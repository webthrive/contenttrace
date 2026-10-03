"use client";
import { useCallback, useEffect, useState } from "react";
import ResultsDisplay from "@/components/ResultsDisplay";
import OptimizeResults from "@/components/OptimizeResults";
import OptimizePanel from "@/components/OptimizePanel";
import WorkspaceTabs from "@/components/WorkspaceTabs";
import type { AnalysisResult } from "@/types/analysis";
import { GOAL_LABELS, type OptimizationRecord } from "@/types/optimize";
import { fetchUsage, type UsageInfo } from "@/lib/billing/browser";
import { needsBotCheckFor, useTurnstile } from "@/hooks/useTurnstile";
import { formatDate } from "../HistoryList";

type Saved = { id: string; created_at: string; input_text: string; result: AnalysisResult & { optimization?: OptimizationRecord } };
type Child = { id: string; created_at: string; score: number | null; goal?: string | null };
type View = "compare" | "optimize" | "analysis";

// A saved optimized version: the before/after for one goal, loaded when opened.
function SavedVersion({ child, baseScore }: { child: Child; baseScore: number | null }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Saved | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggle = () => {
    setOpen((v) => !v);
    if (!data && !error) {
      fetch(`/api/history/${child.id}`, { cache: "no-store" })
        .then(async (r) => { const j = await r.json(); if (!r.ok) throw new Error(j.error || "Could not load this version."); setData(j); })
        .catch((e) => setError(e.message));
    }
  };
  const goalName = child.goal ? (GOAL_LABELS[child.goal as keyof typeof GOAL_LABELS]?.label ?? child.goal) : "Optimized";
  const o = data?.result.optimization;

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-card)" }}>
      <button onClick={toggle} aria-expanded={open}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", textAlign: "left", padding: "14px 16px", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font)" }}>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent)", background: "var(--accent-light)", border: "1px solid rgba(10,115,115,0.3)", borderRadius: "10px", padding: "2px 10px" }}>{goalName}</span>
        <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
          Human Score {baseScore != null ? Math.round(baseScore) : "–"} → <strong>{child.score != null ? Math.round(Number(child.score)) : "–"}</strong>
        </span>
        <span style={{ fontSize: "13px", color: "var(--text-muted)", marginLeft: "auto" }}>{formatDate(child.created_at)} · {open ? "Hide" : "Show before | after"}</span>
      </button>
      {open && (
        <div style={{ padding: "0 16px 16px" }}>
          {error && <p role="alert" style={{ color: "var(--red)", fontSize: "14px" }}>{error}</p>}
          {!data && !error && <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Loading…</p>}
          {data && o && (
            <>
              <OptimizeResults
                goal={o.goal} keyword={o.keyword ?? ""}
                originalText={o.originalText ?? ""} optimizedText={data.input_text}
                changes={o.changes ?? []} inputNeeded={o.inputNeeded ?? []} warnings={o.warnings ?? []}
                beforeScore={o.before?.score ?? 0} afterScore={data.result.aggregateScore}
                beforeReadiness={o.before?.readiness ?? null} afterReadiness={o.readinessAfter ?? null}
              />
              <p style={{ fontSize: "14px", margin: "12px 0 0" }}><a href={`/account/history/${child.id}`} style={{ color: "var(--accent)", fontWeight: 600 }}>Open the full analysis of this version</a></p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function SavedAnalysis({ id }: { id: string }) {
  const [data, setData] = useState<Saved | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showText, setShowText] = useState(false);
  const [view, setView] = useState<View | null>(null);
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [doneRuns, setDoneRuns] = useState(0);

  const needsBotCheck = needsBotCheckFor(usage);
  const { ref: turnstileRef, getFreshToken } = useTurnstile(needsBotCheck);

  useEffect(() => { fetchUsage().then(setUsage); }, []);

  useEffect(() => {
    fetch(`/api/history/${id}`, { cache: "no-store" })
      .then(async (r) => {
        if (r.status === 401) { window.location.href = `/login?next=/account/history/${id}`; return; }
        const j = await r.json();
        if (!r.ok) throw new Error(r.status === 404 ? "This analysis was not found. It may have been deleted." : j.error || "Could not load this analysis.");
        setData(j);
      })
      .catch((e) => setError(e.message));
  }, [id]);

  const loadChildren = useCallback(() => {
    fetch(`/api/history?parent=${id}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { if (j?.items) setChildren(j.items); })
      .catch(() => {});
  }, [id]);
  useEffect(() => { loadChildren(); }, [loadChildren]);

  const opt = data?.result.optimization;
  const current: View = view ?? (opt ? "compare" : "optimize");
  const tabs: { id: View; label: string; badge?: number }[] = [
    ...(opt ? [{ id: "compare" as View, label: "Before & after" }] : []),
    { id: "optimize", label: opt ? "Optimize again" : "Optimize", badge: (opt ? doneRuns : children.length) || undefined },
    { id: "analysis", label: "Full analysis" },
  ];
  const { optimization: _omit, ...resultForOptimizer } = (data?.result ?? {}) as AnalysisResult & { optimization?: OptimizationRecord };
  void _omit;

  return (
    <>
      <a href="/account/history" style={{ fontSize: "14px", color: "var(--accent)" }}>← All past analyses</a>
      {error && <p role="alert" style={{ color: "var(--red)", fontSize: "15px", marginTop: "20px" }}>{error}</p>}
      {!data && !error && <p style={{ color: "var(--text-muted)", marginTop: "20px" }}>Loading…</p>}
      {needsBotCheck && <div ref={turnstileRef} style={{ display: "flex", justifyContent: "center", margin: "8px 0" }} />}
      {data && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap", margin: "14px 0 14px" }}>
            <div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Saved {formatDate(data.created_at)}</div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>
                Human Score {Math.round(data.result.aggregateScore)} <span style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-secondary)" }}>· {data.result.verdict}</span>
              </div>
              {opt?.parentId && <div style={{ fontSize: "13px", marginTop: "2px" }}><a href={`/account/history/${opt.parentId}`} style={{ color: "var(--accent)" }}>See the original analysis</a></div>}
            </div>
            <button onClick={() => setShowText((v) => !v)}
              style={{ fontSize: "14px", color: "var(--text-secondary)", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "6px", padding: "8px 14px", cursor: "pointer", fontFamily: "var(--font)" }}>
              {showText ? "Hide the text" : "Show the analyzed text"}
            </button>
          </div>
          {showText && (
            <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-card)", padding: "18px 20px", marginBottom: "20px", fontSize: "15px", lineHeight: 1.7, color: "var(--text-secondary)", whiteSpace: "pre-wrap", maxHeight: "420px", overflowY: "auto" }}>
              {data.input_text}
            </div>
          )}

          <WorkspaceTabs tabs={tabs} active={current} onChange={setView} />

          {opt && (
            <div style={{ display: current === "compare" ? "block" : "none" }}>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: "0 0 14px" }}>
                {GOAL_LABELS[opt.goal]?.label ?? "Optimized"} version of your original text.
              </p>
              <OptimizeResults
                goal={opt.goal} keyword={opt.keyword ?? ""}
                originalText={opt.originalText ?? ""} optimizedText={data.input_text}
                changes={opt.changes ?? []} inputNeeded={opt.inputNeeded ?? []} warnings={opt.warnings ?? []}
                beforeScore={opt.before?.score ?? 0} afterScore={data.result.aggregateScore}
                beforeReadiness={opt.before?.readiness ?? null} afterReadiness={opt.readinessAfter ?? null}
              />
            </div>
          )}

          <div style={{ display: current === "optimize" ? "block" : "none" }}>
            {children.length > 0 && !opt && (
              <div style={{ marginBottom: "22px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 4px" }}>Saved optimized versions ({children.length})</h2>
                <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: "0 0 12px" }}>Earlier optimizer runs on this text. Open one to see before and after.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {children.map((c) => <SavedVersion key={c.id} child={c} baseScore={data.result.aggregateScore} />)}
                </div>
              </div>
            )}
            <OptimizePanel
              text={data.input_text}
              result={resultForOptimizer as AnalysisResult}
              historyId={id}
              usage={usage}
              needsBotCheck={needsBotCheck}
              getToken={getFreshToken}
              onUsageChange={() => { fetchUsage().then(setUsage); }}
              onRunsChange={setDoneRuns}
              onSaved={loadChildren}
            />
          </div>

          <div style={{ display: current === "analysis" ? "block" : "none" }}>
            <ResultsDisplay result={{ ...data.result, text: data.input_text.substring(0, 500) }} />
          </div>
        </>
      )}
    </>
  );
}
