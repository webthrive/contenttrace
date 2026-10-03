"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import type { AnalysisResult } from "@/types/analysis";
import type { UsageInfo } from "@/lib/billing/browser";
import { OPTIMIZE_FREE_UNITS, OPTIMIZE_WORD_MULTIPLIER } from "@/lib/billing/config";
import { errorOf, readEvents } from "@/lib/sse";
import { GOAL_LABELS, type OptimizeChange, type OptimizeGoal, type OptimizeInputNeeded, type Readiness } from "@/types/optimize";
import OptimizeResults from "./OptimizeResults";

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

const GOALS = Object.keys(GOAL_LABELS) as OptimizeGoal[];

// Content Optimizer: rewrite for a goal, then re-check the rewrite with the same engine.
// You can run all three goals on the same text and switch between the before/after results.
export default function OptimizePanel({ text, result, historyId, usage, needsBotCheck, getToken, onUsageChange, onRunsChange, onSaved }: Props) {
  const [goal, setGoal] = useState<OptimizeGoal>("aeo");
  const [keyword, setKeyword] = useState("");
  const [runs, setRuns] = useState<Partial<Record<OptimizeGoal, Run>>>({});
  const [active, setActive] = useState<OptimizeGoal | null>(null);
  const [running, setRunning] = useState<{ goal: OptimizeGoal; phase: "rewriting" | "checking"; progress: { done: number; total: number } | null } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const doneCount = Object.keys(runs).length;
  useEffect(() => { onRunsChange?.(doneCount); }, [doneCount, onRunsChange]);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const costOf = (n: number) =>
    !usage?.enabled ? "" :
    usage.plan === "free" ? `Uses ${OPTIMIZE_FREE_UNITS * n} of your free checks (${usage.freeAnalysesLeft ?? 0} left)` :
    `Uses about ${(words * OPTIMIZE_WORD_MULTIPLIER * n).toLocaleString()} words (rewrite + re-check${n > 1 ? ", all three" : ""})`;

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

  // Returns false when the run stopped (error or plan limit), so "Run all 3" can stop too.
  const runGoal = async (g: OptimizeGoal, kw: string): Promise<boolean> => {
    setError(null); setLimit(null);
    setRunning({ goal: g, phase: "rewriting", progress: null });
    try {
      let token: string | null = null;
      if (needsBotCheck) {
        token = await getToken();
        if (!token) throw new Error("The quick human check did not finish. Please try again in a moment.");
      }
      const send = (t: string | null) => fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, goal: g, keyword: kw, contentType: result.contentType?.id, result, parentId: historyId, turnstileToken: t }),
      });
      let res = await send(token);
      if (res.status === 403 && needsBotCheck && (await errorOf(res.clone(), "")).code === "bot_check") {
        const retry = await getToken(true);
        if (retry) res = await send(retry);
      }
      if (!res.ok) {
        const { message, code } = await errorOf(res, "The optimizer failed. Please try again.");
        if (code === "limit" || code === "too_long") { setLimit(message); setRunning(null); return false; }
        throw new Error(message);
      }
      let out: (Rewrite & { recheckToken: string }) | null = null;
      await readEvents(res, (e) => {
        if (e.type === "progress") setRunning({ goal: g, phase: "rewriting", progress: { done: Number(e.done), total: Number(e.total) } });
        else if (e.type === "complete") out = e as unknown as Rewrite & { recheckToken: string };
        else if (e.type === "error") throw new Error(String(e.message));
      });
      if (!out) throw new Error("The optimizer did not finish. Please try again.");
      const o = out as Rewrite & { recheckToken: string };
      setRuns((r) => ({ ...r, [g]: { goal: g, keyword: kw, rw: o, afterScore: null, afterReadiness: null, afterHistoryId: null, checking: true, checkError: null } }));
      setActive(g);
      setRunning({ goal: g, phase: "checking", progress: null });
      onUsageChange();
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      await recheck(g, o, o.recheckToken);
      setRunning(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setRunning(null);
      return false;
    }
  };

  const runAll = async () => {
    const kw = keyword.trim();
    for (const g of GOALS) {
      if (!(await runGoal(g, g === "readability" ? "" : kw))) break;
    }
  };

  const busy = running !== null;
  const run = active ? runs[active] : undefined;
  const canRunAll = Boolean(usage?.signedIn && usage.plan !== "free");
  const btnLabel = running
    ? running.phase === "rewriting"
      ? `${GOAL_LABELS[running.goal].short}: ${running.progress && running.progress.total > 1 ? `part ${Math.min(running.progress.done + 1, running.progress.total)} of ${running.progress.total}` : "rewriting"}…`
      : `${GOAL_LABELS[running.goal].short}: re-checking…`
    : runs[goal] ? `Run ${GOAL_LABELS[goal].short} again` : `Run ${GOAL_LABELS[goal].short}`;

  return (
    <section id="optimize" style={{ scrollMarginTop: "80px" }}>
      <div style={{ border: "1px solid rgba(10,115,115,0.3)", borderRadius: "16px", background: "linear-gradient(180deg, rgba(10,115,115,0.06), var(--bg-card))", padding: "20px", marginBottom: "16px", boxShadow: "0 2px 12px rgba(1,2,33,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <Sparkles size={18} style={{ color: "var(--accent)" }} />
          <h2 style={{ fontSize: "19px", fontWeight: 700, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.01em" }}>Optimize this text</h2>
        </div>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.55, margin: "0 0 14px" }}>
          Pick a goal and run it. Each result shows your text before and after, with the scores. Run all three goals and switch between them.
        </p>

        <div role="radiogroup" aria-label="Optimization goal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "10px", marginBottom: "14px" }}>
          {GOALS.map((g) => {
            const r = runs[g];
            const here = running?.goal === g;
            const sel = goal === g;
            const status = here
              ? (running!.phase === "rewriting" ? "Rewriting…" : "Re-checking…")
              : r
                ? (r.afterScore != null ? `Done. Human Score ${Math.round(result.aggregateScore)} → ${Math.round(r.afterScore)}` : r.checking ? "Done. Scoring…" : "Done")
                : null;
            return (
              <button key={g} role="radio" aria-checked={sel} onClick={() => { setGoal(g); if (r) setActive(g); }} disabled={busy}
                style={{ textAlign: "left", padding: "12px 14px", borderRadius: "10px", cursor: busy ? "default" : "pointer", fontFamily: "var(--font)",
                  border: sel ? "2px solid var(--accent)" : "1px solid var(--border)", background: sel ? "var(--accent-light)" : "var(--bg-card)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                  <span style={{ fontSize: "15px", fontWeight: 600, color: sel ? "var(--accent)" : "var(--text-primary)" }}>{GOAL_LABELS[g].label}</span>
                  {r && <span style={{ fontSize: "11px", fontWeight: 700, color: "white", background: "var(--accent)", borderRadius: "8px", padding: "1px 7px" }}>DONE</span>}
                </div>
                <div style={{ fontSize: "12px", color: status ? "var(--accent)" : "var(--text-muted)", fontWeight: status ? 600 : 400, lineHeight: 1.45 }}>{status ?? GOAL_LABELS[g].desc}</div>
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

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{costOf(1)}</span>
          <span style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {canRunAll && !busy && doneCount < GOALS.length && (
              <button onClick={runAll} title={costOf(GOALS.length)}
                style={{ padding: "12px 16px", fontSize: "14px", fontWeight: 600, fontFamily: "var(--font)", borderRadius: "10px", cursor: "pointer", color: "var(--accent)", background: "var(--bg-card)", border: "1px solid var(--accent)" }}>
                Run all 3
              </button>
            )}
            <button onClick={() => runGoal(goal, goal === "readability" ? "" : keyword.trim())} disabled={busy}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 22px", fontSize: "15px", fontWeight: 600, fontFamily: "var(--font)", borderRadius: "10px", cursor: busy ? "default" : "pointer",
                background: busy ? "var(--bg-elevated)" : "var(--accent)", color: busy ? "var(--text-muted)" : "white", border: busy ? "1px solid var(--border)" : "none" }}>
              {busy
                ? <><span style={{ width: "15px", height: "15px", border: "2px solid rgba(0,0,0,0.15)", borderTopColor: "var(--accent)", borderRadius: "50%", display: "inline-block" }} className="spin" />{btnLabel}</>
                : <><Sparkles size={15} />{btnLabel}</>}
            </button>
          </span>
        </div>

        {limit && (
          <div role="alert" style={{ marginTop: "12px", fontSize: "14px", color: "var(--text-secondary)" }}>
            {limit} <a href="/pricing" style={{ color: "var(--accent)", fontWeight: 600 }}>See plans</a>
          </div>
        )}
        {error && <div role="alert" style={{ marginTop: "12px", fontSize: "14px", color: "var(--red)" }}>{error}</div>}
      </div>

      <div ref={resultsRef} style={{ scrollMarginTop: "70px" }}>
        {run && active && (
          <>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Before and after: {GOAL_LABELS[active].label}</h2>
              {doneCount > 1 && (
                <span style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {GOALS.filter((g) => runs[g]).map((g) => (
                    <button key={g} onClick={() => setActive(g)} aria-pressed={active === g}
                      style={{ fontSize: "13px", fontWeight: active === g ? 700 : 500, fontFamily: "var(--font)", padding: "5px 12px", borderRadius: "16px", cursor: "pointer",
                        color: active === g ? "white" : "var(--text-secondary)", background: active === g ? "var(--accent)" : "var(--bg-card)", border: active === g ? "1px solid var(--accent)" : "1px solid var(--border)" }}>
                      {GOAL_LABELS[g].short}
                    </button>
                  ))}
                </span>
              )}
            </div>
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
        )}
      </div>
    </section>
  );
}
