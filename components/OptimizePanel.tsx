"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import type { AnalysisResult } from "@/types/analysis";
import type { UsageInfo } from "@/lib/billing/browser";
import { OPTIMIZE_FREE_UNITS, OPTIMIZE_WORD_MULTIPLIER } from "@/lib/billing/config";
import { errorOf, readEvents } from "@/lib/sse";
import { GOAL_LABELS, type OptimizeChange, type OptimizeGoal, type OptimizeInputNeeded, type Readiness } from "@/types/optimize";
import OptimizeResults from "./OptimizeResults";
import { clearHumanPass, getHumanPass, setHumanPass } from "@/hooks/useTurnstile";

type Props = {
  text: string; // full original text
  result: AnalysisResult;
  historyId: string | null;
  usage: UsageInfo | null;
  needsBotCheck: boolean;
  getToken: (force?: boolean) => Promise<string | null>;
  onUsageChange: () => void;
  onRunsChange?: (count: number) => void; // how many goals have a finished result
  onSaved?: () => void; // a re-checked version was saved to history
  defaultGoal?: OptimizeGoal;
  autoRun?: OptimizeGoal; // run this goal once, as soon as the panel opens (landing pages)
};

type Rewrite = { rewritten: string; changes: OptimizeChange[]; inputNeeded: OptimizeInputNeeded[]; warnings?: string[]; readinessBefore: Readiness | null };

// One finished run for one goal. Every run is compared with the same original text.
type Run = {
  goal: OptimizeGoal;
  keyword: string;
  rw: Rewrite;
  afterScore: number | null;
  afterReadiness: Readiness | null;
  afterHistoryId: string | null;
  checking: boolean;
  checkError: string | null;
};

// Live status of a goal while it runs (or after it failed).
type Status =
  | { phase: "queued" }
  | { phase: "rewriting"; done: number; total: number }
  | { phase: "checking" }
  | { phase: "error"; message: string };

const GOALS = Object.keys(GOAL_LABELS) as OptimizeGoal[];

function Bar({ pct, pulse }: { pct: number; pulse?: boolean }) {
  return (
    <div style={{ height: "6px", borderRadius: "4px", background: "var(--bg-elevated)", overflow: "hidden", marginTop: "8px" }}>
      <div className={pulse ? "pulse" : undefined} style={{ height: "100%", width: `${Math.max(6, Math.min(100, pct))}%`, background: "var(--accent)", borderRadius: "4px", transition: "width 0.4s ease" }} />
    </div>
  );
}

// Content Optimizer: rewrite for a goal, then re-check the rewrite with the same engine.
// You can run all three goals on the same text and switch between the before/after results.
export default function OptimizePanel({ text, result, historyId, usage, needsBotCheck, getToken, onUsageChange, onRunsChange, onSaved, defaultGoal = "aeo", autoRun }: Props) {
  const [goal, setGoal] = useState<OptimizeGoal>(defaultGoal);
  const [keyword, setKeyword] = useState("");
  const [runs, setRuns] = useState<Partial<Record<OptimizeGoal, Run>>>({});
  const [active, setActive] = useState<OptimizeGoal | null>(null);
  const [status, setStatus] = useState<Partial<Record<OptimizeGoal, Status>>>({});
  const [limit, setLimit] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const scrolled = useRef(false);
  const autoStarted = useRef(false);

  const doneCount = Object.keys(runs).length;
  useEffect(() => { onRunsChange?.(doneCount); }, [doneCount, onRunsChange]);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const costOf = (n: number) =>
    !usage?.enabled ? "" :
    usage.plan === "free" ? `Uses ${OPTIMIZE_FREE_UNITS * n} of your free checks (${usage.freeAnalysesLeft ?? 0} left)` :
    `Uses about ${(words * OPTIMIZE_WORD_MULTIPLIER * n).toLocaleString()} words (rewrite + re-check${n > 1 ? `, ${n} goals` : ""})`;

  const setGoalStatus = (g: OptimizeGoal, s: Status | null) =>
    setStatus((m) => { const next = { ...m }; if (s) next[g] = s; else delete next[g]; return next; });
  const patchRun = (g: OptimizeGoal, p: Partial<Run>) => setRuns((r) => (r[g] ? { ...r, [g]: { ...r[g]!, ...p } } : r));

  const recheck = async (g: OptimizeGoal, out: Rewrite, token: string) => {
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: out.rewritten,
          contentType: result.contentType?.id, // same profile as the original, so the scores compare fairly
          recheckToken: token,
          optimization: {
            originalText: text,
            changes: out.changes,
            inputNeeded: out.inputNeeded,
            warnings: out.warnings ?? [],
            before: { score: result.aggregateScore, verdict: result.verdict, readiness: out.readinessBefore },
          },
        }),
      });
      if (!res.ok) throw new Error((await errorOf(res, "The re-check failed.")).message);
      let finished = false;
      await readEvents(res, (e) => {
        if (e.type === "readiness") patchRun(g, { afterReadiness: e.readiness as Readiness });
        else if (e.type === "complete") {
          finished = true;
          const r = e.result as AnalysisResult;
          patchRun(g, { afterScore: r.aggregateScore, afterHistoryId: typeof e.historyId === "string" ? e.historyId : null });
          if (typeof e.historyId === "string") onSaved?.();
        } else if (e.type === "error") throw new Error(String(e.message));
      });
      if (!finished) throw new Error("The re-check did not finish.");
    } catch (err) {
      patchRun(g, { checkError: `${err instanceof Error ? err.message : "The re-check failed."} Your optimized text is still below.` });
    }
    patchRun(g, { checking: false });
  };

  // Runs one goal from start to finish and keeps its status card up to date.
  // Returns "limit" when the plan limit stops it, so "Run all" can tell the user once.
  const runGoal = async (g: OptimizeGoal, kw: string): Promise<"ok" | "error" | "limit"> => {
    setGoalStatus(g, { phase: "rewriting", done: 0, total: 1 });
    setActive((cur) => cur ?? g);
    try {
      // A human pass from an earlier check skips Turnstile. Otherwise get a fresh token.
      const humanPass = needsBotCheck ? getHumanPass() : null;
      let token: string | null = null;
      if (needsBotCheck && !humanPass) {
        token = await getToken();
        if (!token) throw new Error("The quick human check did not finish. If a check box appeared at the bottom of the screen, tick it and run again.");
      }
      const send = (t: string | null) => fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, goal: g, keyword: kw, contentType: result.contentType?.id, result, parentId: historyId, turnstileToken: t, humanPass: t ? undefined : humanPass }),
      });
      let res = await send(token);
      if (res.status === 403 && needsBotCheck && (await errorOf(res.clone(), "")).code === "bot_check") {
        clearHumanPass();
        const retry = await getToken(true);
        if (retry) res = await send(retry);
      }
      if (!res.ok) {
        const { message, code } = await errorOf(res, "The optimizer failed. Please try again.");
        if (code === "limit" || code === "too_long") { setLimit(message); setGoalStatus(g, null); return "limit"; }
        throw new Error(message);
      }
      let out: (Rewrite & { recheckToken: string }) | null = null;
      await readEvents(res, (e) => {
        if (e.type === "progress") setGoalStatus(g, { phase: "rewriting", done: Number(e.done), total: Math.max(1, Number(e.total)) });
        else if (e.type === "complete") out = e as unknown as Rewrite & { recheckToken: string };
        else if (e.type === "error") throw new Error(String(e.message));
      });
      if (!out) throw new Error("The optimizer did not finish. Please try again.");
      const o = out as Rewrite & { recheckToken: string; humanPass?: string };
      setHumanPass(o.humanPass);
      setRuns((r) => ({ ...r, [g]: { goal: g, keyword: kw, rw: o, afterScore: null, afterReadiness: null, afterHistoryId: null, checking: true, checkError: null } }));
      setActive((a) => (a && runs[a] ? a : g)); // show the first result that finishes; the others wait in their tabs
      setGoalStatus(g, { phase: "checking" });
      onUsageChange();
      if (!scrolled.current) {
        scrolled.current = true;
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      }
      await recheck(g, o, o.recheckToken);
      setGoalStatus(g, null);
      return "ok";
    } catch (err) {
      setGoalStatus(g, { phase: "error", message: err instanceof Error ? err.message : "Something went wrong. Please try again." });
      return "error";
    }
  };

  const startOne = () => {
    setLimit(null);
    scrolled.current = false;
    runGoal(goal, goal === "readability" ? "" : keyword.trim());
  };

  // All goals that have no result yet, at the same time. Each card shows its own status.
  const runAll = async () => {
    setLimit(null);
    scrolled.current = false;
    const kw = keyword.trim();
    const todo = GOALS.filter((g) => !runs[g]);
    todo.forEach((g) => setGoalStatus(g, { phase: "queued" }));
    await Promise.all(todo.map((g) => runGoal(g, g === "readability" ? "" : kw)));
  };

  // Landing pages promise a one-click result, so the chosen goal starts as soon as the check finishes.
  useEffect(() => {
    if (!autoRun || autoStarted.current) return;
    autoStarted.current = true;
    runGoal(autoRun, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRun]);

  const busy = Object.values(status).some((s) => s && s.phase !== "error");
  const run = active ? runs[active] : undefined;
  const todoCount = GOALS.filter((g) => !runs[g]).length;
  const canRunAll = Boolean(usage?.signedIn && usage.plan !== "free");

  return (
    <section id="optimize" style={{ scrollMarginTop: "80px" }}>
      <div style={{ border: "1px solid rgba(10,115,115,0.3)", borderRadius: "16px", background: "linear-gradient(180deg, rgba(10,115,115,0.06), var(--bg-card))", padding: "20px", marginBottom: "16px", boxShadow: "0 2px 12px rgba(1,2,33,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <Sparkles size={18} style={{ color: "var(--accent)" }} />
          <h2 style={{ fontSize: "19px", fontWeight: 700, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.01em" }}>Optimize this text</h2>
        </div>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.55, margin: "0 0 14px" }}>
          Pick a goal and run it, or run all three. Each result shows your text before and after, with the scores.
        </p>

        <div role="radiogroup" aria-label="Optimization goal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "10px", marginBottom: "14px" }}>
          {GOALS.map((g) => {
            const r = runs[g];
            const st = status[g];
            const sel = goal === g;
            let line: React.ReactNode = <span style={{ color: "var(--text-muted)" }}>{GOAL_LABELS[g].desc}</span>;
            let bar: React.ReactNode = null;
            if (st?.phase === "queued") { line = <span style={{ color: "var(--accent)", fontWeight: 600 }}>Waiting to start…</span>; bar = <Bar pct={4} />; }
            else if (st?.phase === "rewriting") { line = <span style={{ color: "var(--accent)", fontWeight: 600 }}>Step 1 of 2: rewriting…</span>; bar = <Bar pct={10 + (st.done / st.total) * 60} pulse />; }
            else if (st?.phase === "checking") { line = <span style={{ color: "var(--accent)", fontWeight: 600 }}>Step 2 of 2: scoring the new version…</span>; bar = <Bar pct={85} pulse />; }
            else if (st?.phase === "error") { line = <span style={{ color: "var(--red)", fontWeight: 600 }}>Failed: {st.message}</span>; }
            else if (r) line = <span style={{ color: "var(--accent)", fontWeight: 600 }}>{r.afterScore != null ? `Human Score ${Math.round(result.aggregateScore)} → ${Math.round(r.afterScore)}. Click to view.` : "Scoring…"}</span>;
            const badge = st?.phase === "error" ? { t: "FAILED", bg: "var(--red)" } : st ? { t: "RUNNING", bg: "var(--amber)" } : r ? { t: "DONE", bg: "var(--accent)" } : null;
            return (
              <button key={g} role="radio" aria-checked={sel} onClick={() => { setGoal(g); if (r) setActive(g); }}
                style={{ textAlign: "left", padding: "12px 14px", borderRadius: "10px", cursor: "pointer", fontFamily: "var(--font)",
                  border: sel ? "2px solid var(--accent)" : "1px solid var(--border)", background: sel ? "var(--accent-light)" : "var(--bg-card)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                  <span style={{ fontSize: "15px", fontWeight: 600, color: sel ? "var(--accent)" : "var(--text-primary)" }}>{GOAL_LABELS[g].label}</span>
                  {badge && <span style={{ fontSize: "11px", fontWeight: 700, color: "white", background: badge.bg, borderRadius: "8px", padding: "1px 7px" }}>{badge.t}</span>}
                </div>
                <div style={{ fontSize: "12px", lineHeight: 1.45 }}>{line}</div>
                {bar}
              </button>
            );
          })}
        </div>

        {goal !== "readability" && (
          <label style={{ display: "block", marginBottom: "14px" }}>
            <span style={{ display: "block", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "6px" }}>
              {goal === "aeo" ? "Question you want to be the answer to (optional)" : "Target keyword (optional)"}
            </span>
            <input value={keyword} onChange={(e) => setKeyword(e.target.value.slice(0, 120))} disabled={busy}
              placeholder={goal === "aeo" ? "e.g. how do AI detectors work" : "e.g. ai content detector"}
              style={{ width: "100%", boxSizing: "border-box", fontSize: "15px", fontFamily: "var(--font)", padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--bg-card)", color: "var(--text-primary)" }} />
          </label>
        )}

        {goal !== "readability" && result.aggregateScore >= 60 && (
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 12px", lineHeight: 1.55 }}>
            Your text already reads human (Human Score {Math.round(result.aggregateScore)}). {GOAL_LABELS[goal].short} adds structure for search, which can lower the Human Score. We keep edits light for text like this.
          </p>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{costOf(1)}</span>
          <span style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {canRunAll && !busy && todoCount > 1 && (
              <button onClick={runAll} title={costOf(todoCount)}
                style={{ padding: "12px 16px", fontSize: "14px", fontWeight: 600, fontFamily: "var(--font)", borderRadius: "10px", cursor: "pointer", color: "var(--accent)", background: "var(--bg-card)", border: "1px solid var(--accent)" }}>
                {todoCount === GOALS.length ? "Run all 3" : `Run the other ${todoCount}`}
              </button>
            )}
            <button onClick={startOne} disabled={busy}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 22px", fontSize: "15px", fontWeight: 600, fontFamily: "var(--font)", borderRadius: "10px", cursor: busy ? "default" : "pointer",
                background: busy ? "var(--bg-elevated)" : "var(--accent)", color: busy ? "var(--text-muted)" : "white", border: busy ? "1px solid var(--border)" : "none" }}>
              {busy
                ? <><span style={{ width: "15px", height: "15px", border: "2px solid rgba(0,0,0,0.15)", borderTopColor: "var(--accent)", borderRadius: "50%", display: "inline-block" }} className="spin" />Optimizing…</>
                : <><Sparkles size={15} />{runs[goal] || status[goal]?.phase === "error" ? `Run ${GOAL_LABELS[goal].short} again` : `Run ${GOAL_LABELS[goal].short}`}</>}
            </button>
          </span>
        </div>

        {busy && <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "10px 0 0" }}>Each goal takes about 20 to 50 seconds. You can stay on this page while it runs.</p>}

        {limit && (
          <div role="alert" style={{ marginTop: "12px", fontSize: "14px", color: "var(--text-secondary)" }}>
            {limit} <a href="/pricing" style={{ color: "var(--accent)", fontWeight: 600 }}>See plans</a>
          </div>
        )}
      </div>

      <div ref={resultsRef} style={{ scrollMarginTop: "70px" }}>
        {active && (doneCount > 0 || busy) && (
          <>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 10px" }}>Before and after</h2>
            {/* One tab per goal, always visible, so it is clear where each result lives. */}
            <div role="tablist" aria-label="Results by goal" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "6px", marginBottom: "16px" }}>
              {GOALS.map((g) => {
                const r = runs[g];
                const st = status[g];
                const on = active === g;
                const dropped = r && r.afterScore != null && r.afterScore < result.aggregateScore - 3;
                const sub = st?.phase === "error" ? "Failed" : st ? "Running…" : r ? (r.afterScore != null ? `Score ${Math.round(result.aggregateScore)} → ${Math.round(r.afterScore)}${dropped ? " · went down" : ""}` : "Scoring…") : "Not run yet";
                return (
                  <button key={g} role="tab" aria-selected={on} onClick={() => { setActive(g); setGoal(g); }}
                    style={{ textAlign: "left", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", fontFamily: "var(--font)", minWidth: 0,
                      border: on ? "2px solid var(--accent)" : "1px solid var(--border)", background: on ? "var(--accent)" : r ? "var(--bg-card)" : "var(--bg-elevated)" }}>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: on ? "white" : r ? "var(--text-primary)" : "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{GOAL_LABELS[g].short}</div>
                    <div style={{ fontSize: "12px", color: on ? "rgba(255,255,255,0.85)" : st?.phase === "error" ? "var(--red)" : "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</div>
                  </button>
                );
              })}
            </div>

            {run ? (
              <>
                <OptimizeResults
                  key={active}
                  goal={run.goal} keyword={run.keyword}
                  originalText={text} optimizedText={run.rw.rewritten}
                  changes={run.rw.changes} inputNeeded={run.rw.inputNeeded} warnings={run.rw.warnings ?? []}
                  beforeScore={result.aggregateScore} afterScore={run.afterScore}
                  beforeReadiness={run.rw.readinessBefore} afterReadiness={run.afterReadiness}
                  checking={run.checking} checkError={run.checkError}
                />
                {run.afterHistoryId && (
                  <div style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "12px" }}>
                    Saved to your history. <a href={`/account/history/${run.afterHistoryId}`} style={{ color: "var(--accent)", fontWeight: 600 }}>See the full analysis of the new version</a>
                  </div>
                )}
              </>
            ) : (
              <div style={{ border: "1px dashed var(--border)", borderRadius: "14px", padding: "28px 20px", textAlign: "center", background: "var(--bg-card)" }}>
                {status[active] && status[active]!.phase !== "error" ? (
                  <p style={{ fontSize: "15px", color: "var(--text-secondary)", margin: 0 }}>{GOAL_LABELS[active].label} is running. The before and after will show here.</p>
                ) : (
                  <>
                    <p style={{ fontSize: "15px", color: "var(--text-secondary)", margin: "0 0 14px" }}>
                      {status[active]?.phase === "error" ? `${GOAL_LABELS[active].label} did not finish. ` : `${GOAL_LABELS[active].label} has not run on this text yet. `}
                      {GOAL_LABELS[active].desc}
                    </p>
                    <button onClick={() => { setGoal(active); runGoal(active, active === "readability" ? "" : keyword.trim()); }} disabled={busy}
                      style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "11px 20px", fontSize: "15px", fontWeight: 600, fontFamily: "var(--font)", borderRadius: "10px", cursor: busy ? "default" : "pointer",
                        background: busy ? "var(--bg-elevated)" : "var(--accent)", color: busy ? "var(--text-muted)" : "white", border: busy ? "1px solid var(--border)" : "none" }}>
                      <Sparkles size={15} />Run {GOAL_LABELS[active].short}
                    </button>
                    {active !== "readability" && <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "10px 0 0" }}>Optional: add a {active === "aeo" ? "target question" : "keyword"} in the box above first.</p>}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
