"use client";

import { useState } from "react";
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
};

type Rewrite = { rewritten: string; changes: OptimizeChange[]; inputNeeded: OptimizeInputNeeded[]; warnings?: string[]; readinessBefore: Readiness | null };

// Content Optimizer: rewrite for a goal, then re-check the rewrite with the same engine.
export default function OptimizePanel({ text, result, historyId, usage, needsBotCheck, getToken, onUsageChange }: Props) {
  const [goal, setGoal] = useState<OptimizeGoal>("aeo");
  const [keyword, setKeyword] = useState("");
  const [phase, setPhase] = useState<"idle" | "rewriting" | "checking" | "done">("idle");
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [rw, setRw] = useState<Rewrite | null>(null);
  const [after, setAfter] = useState<{ score: number | null; readiness: Readiness | null; historyId: string | null }>({ score: null, readiness: null, historyId: null });
  const [error, setError] = useState<string | null>(null);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [limit, setLimit] = useState<string | null>(null);
  const [runKeyword, setRunKeyword] = useState("");
  const [runGoal, setRunGoal] = useState<OptimizeGoal>("aeo");

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const cost =
    !usage?.enabled ? "" :
    usage.plan === "free" ? `Uses ${OPTIMIZE_FREE_UNITS} of your free checks (${usage.freeAnalysesLeft ?? 0} left)` :
    `Uses ${(words * OPTIMIZE_WORD_MULTIPLIER).toLocaleString()} words (rewrite + re-check)`;

  const recheck = async (out: Rewrite, token: string) => {
    setPhase("checking");
    setCheckError(null);
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
        if (e.type === "readiness") setAfter((a) => ({ ...a, readiness: e.readiness as Readiness }));
        else if (e.type === "complete") {
          finished = true;
          const r = e.result as AnalysisResult;
          setAfter((a) => ({ ...a, score: r.aggregateScore, historyId: typeof e.historyId === "string" ? e.historyId : null }));
        } else if (e.type === "error") throw new Error(String(e.message));
      });
      if (!finished) throw new Error("The re-check did not finish.");
    } catch (err) {
      setCheckError(`${err instanceof Error ? err.message : "The re-check failed."} Your optimized text is still below.`);
    }
    setPhase("done");
  };

  const run = async () => {
    setError(null); setLimit(null); setCheckError(null); setRw(null); setProgress(null);
    setAfter({ score: null, readiness: null, historyId: null });
    setRunGoal(goal); setRunKeyword(keyword.trim());
    setPhase("rewriting");
    try {
      let token: string | null = null;
      if (needsBotCheck) {
        token = await getToken();
        if (!token) throw new Error("The quick human check did not finish. Please try again in a moment.");
      }
      const send = (t: string | null) => fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, goal, keyword: keyword.trim(), contentType: result.contentType?.id, result, parentId: historyId, turnstileToken: t }),
      });
      let res = await send(token);
      if (res.status === 403 && needsBotCheck && (await errorOf(res.clone(), "")).code === "bot_check") {
        const retry = await getToken(true);
        if (retry) res = await send(retry);
      }
      if (!res.ok) {
        const { message, code } = await errorOf(res, "The optimizer failed. Please try again.");
        if (code === "limit" || code === "too_long") { setLimit(message); setPhase("idle"); return; }
        throw new Error(message);
      }
      let out: (Rewrite & { recheckToken: string }) | null = null;
      await readEvents(res, (e) => {
        if (e.type === "progress") setProgress({ done: Number(e.done), total: Number(e.total) });
        else if (e.type === "complete") out = e as unknown as Rewrite & { recheckToken: string };
        else if (e.type === "error") throw new Error(String(e.message));
      });
      if (!out) throw new Error("The optimizer did not finish. Please try again.");
      const o = out as Rewrite & { recheckToken: string };
      setRw(o);
      onUsageChange();
      await recheck(o, o.recheckToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setPhase(rw ? "done" : "idle");
    }
  };

  const busy = phase === "rewriting" || phase === "checking";

  return (
    <section id="optimize" style={{ marginTop: "28px", scrollMarginTop: "80px" }}>
      <div style={{ border: "1px solid rgba(10,115,115,0.3)", borderRadius: "16px", background: "linear-gradient(180deg, rgba(10,115,115,0.06), var(--bg-card))", padding: "22px", marginBottom: "16px", boxShadow: "0 2px 12px rgba(1,2,33,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <Sparkles size={18} style={{ color: "var(--accent)" }} />
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.01em" }}>Optimize this text</h2>
        </div>
        <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 16px" }}>
          We rewrite the weak spots this analysis found, then score the new version with the same engine. You see every change and the score before and after.
        </p>

        <div role="radiogroup" aria-label="Optimization goal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "10px", marginBottom: "14px" }}>
          {(Object.keys(GOAL_LABELS) as OptimizeGoal[]).map((g) => (
            <button key={g} role="radio" aria-checked={goal === g} onClick={() => setGoal(g)} disabled={busy}
              style={{ textAlign: "left", padding: "12px 14px", borderRadius: "10px", cursor: busy ? "default" : "pointer", fontFamily: "var(--font)",
                border: goal === g ? "2px solid var(--accent)" : "1px solid var(--border)", background: goal === g ? "var(--accent-light)" : "var(--bg-card)" }}>
              <div style={{ fontSize: "15px", fontWeight: 600, color: goal === g ? "var(--accent)" : "var(--text-primary)", marginBottom: "3px" }}>{GOAL_LABELS[g].label}</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.45 }}>{GOAL_LABELS[g].desc}</div>
            </button>
          ))}
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
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{cost}</span>
          <button onClick={run} disabled={busy}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 22px", fontSize: "15px", fontWeight: 600, fontFamily: "var(--font)", borderRadius: "10px", cursor: busy ? "default" : "pointer",
              background: busy ? "var(--bg-elevated)" : "var(--accent)", color: busy ? "var(--text-muted)" : "white", border: busy ? "1px solid var(--border)" : "none" }}>
            {busy
              ? <><span style={{ width: "15px", height: "15px", border: "2px solid rgba(0,0,0,0.15)", borderTopColor: "var(--accent)", borderRadius: "50%", display: "inline-block" }} className="spin" />
                  {phase === "rewriting" ? (progress && progress.total > 1 ? `Rewriting part ${Math.min(progress.done + 1, progress.total)} of ${progress.total}…` : "Rewriting…") : "Re-checking the new version…"}</>
              : <><Sparkles size={15} />{rw ? "Optimize again" : "Optimize"}</>}
          </button>
        </div>

        {limit && (
          <div role="alert" style={{ marginTop: "12px", fontSize: "14px", color: "var(--text-secondary)" }}>
            {limit} <a href="/pricing" style={{ color: "var(--accent)", fontWeight: 600 }}>See plans</a>
          </div>
        )}
        {error && <div role="alert" style={{ marginTop: "12px", fontSize: "14px", color: "var(--red)" }}>{error}</div>}
      </div>

      {rw && (
        <>
          <OptimizeResults
            goal={runGoal} keyword={runKeyword}
            originalText={text} optimizedText={rw.rewritten}
            changes={rw.changes} inputNeeded={rw.inputNeeded} warnings={rw.warnings ?? []}
            beforeScore={result.aggregateScore} afterScore={after.score}
            beforeReadiness={rw.readinessBefore} afterReadiness={after.readiness}
            checking={phase === "checking"} checkError={checkError}
          />
          {after.historyId && (
            <div style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "12px" }}>
              Saved to your history. <a href={`/account/history/${after.historyId}`} style={{ color: "var(--accent)", fontWeight: 600 }}>See the full analysis of the new version</a>
            </div>
          )}
        </>
      )}
    </section>
  );
}
