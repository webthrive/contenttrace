"use client";

import { useMemo, useState } from "react";
import { diffWords } from "diff";
import { ArrowRight, Check, Copy, PenLine } from "lucide-react";
import { contentMetrics, readingEaseLabel } from "@/lib/contentMetrics";
import { GOAL_LABELS, type OptimizeChange, type OptimizeGoal, type OptimizeInputNeeded, type Readiness } from "@/types/optimize";

export type OptimizeResultsProps = {
  goal: OptimizeGoal;
  keyword: string;
  originalText: string;
  optimizedText: string;
  changes: OptimizeChange[];
  inputNeeded: OptimizeInputNeeded[];
  beforeScore: number;
  afterScore: number | null; // null while the re-check runs
  beforeReadiness: Readiness | null;
  afterReadiness: Readiness | null;
  checking?: boolean;
  checkError?: string | null;
};

const card: React.CSSProperties = { border: "1px solid var(--border)", borderRadius: "14px", background: "var(--bg-card)", boxShadow: "0 1px 6px rgba(1,2,33,0.05)" };
const labelStyle: React.CSSProperties = { fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 };

function Delta({ value, suffix = "" }: { value: number; suffix?: string }) {
  const r = Math.round(value * 10) / 10;
  if (Math.abs(r) < 0.5) return <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>no change</span>;
  const up = r > 0;
  return (
    <span style={{ fontSize: "13px", fontWeight: 600, color: up ? "var(--accent)" : "var(--red)", background: up ? "var(--accent-light)" : "var(--red-bg)", borderRadius: "6px", padding: "2px 7px" }}>
      {up ? "+" : ""}{r}{suffix}
    </span>
  );
}

function ScoreCard({ title, before, after, hint, pending, beforeNote, afterNote }: {
  title: string; before: number | null; after: number | null; hint: string; pending?: boolean; beforeNote?: string; afterNote?: string;
}) {
  return (
    <div style={{ ...card, padding: "16px 18px", display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={labelStyle}>{title}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "22px", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{before ?? "–"}</span>
        <ArrowRight size={16} style={{ color: "var(--text-muted)", alignSelf: "center" }} />
        {pending || after == null
          ? <span style={{ fontSize: "14px", color: "var(--text-muted)" }} className="pulse">{pending ? "checking…" : "–"}</span>
          : <span style={{ fontSize: "28px", fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>{after}</span>}
        {before != null && after != null && !pending && <Delta value={after - before} />}
      </div>
      {(beforeNote || afterNote) && (
        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{beforeNote}{afterNote && !pending ? ` → ${afterNote}` : ""}</div>
      )}
      <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.5 }}>{hint}</div>
    </div>
  );
}

// Show [Add: ...] markers as highlighted chips inside the text.
function WithMarkers({ text }: { text: string }) {
  const parts = text.split(/(\[Add:[^\]]*\])/g);
  return (
    <>
      {parts.map((p, i) =>
        /^\[Add:/.test(p)
          ? <mark key={i} style={{ background: "var(--amber-bg)", color: "var(--amber)", border: "1px solid rgba(196,122,0,0.3)", borderRadius: "4px", padding: "0 3px", fontWeight: 500 }}>{p}</mark>
          : <span key={i}>{p}</span>
      )}
    </>
  );
}

const KIND_COLORS: Record<string, string> = {
  Readability: "#0a7373", "Natural voice": "#c47a00", Structure: "#4a5ab8", SEO: "#0a8a6a", "AI answers": "#8a3fb0",
};

export default function OptimizeResults(p: OptimizeResultsProps) {
  const [tab, setTab] = useState<"changes" | "compare" | "text">("changes");
  const [copied, setCopied] = useState(false);
  const [showChecks, setShowChecks] = useState(false);

  const mBefore = useMemo(() => contentMetrics(p.originalText, p.keyword), [p.originalText, p.keyword]);
  const mAfter = useMemo(() => contentMetrics(p.optimizedText, p.keyword), [p.optimizedText, p.keyword]);
  const diff = useMemo(() => (tab === "compare" ? diffWords(p.originalText, p.optimizedText) : []), [tab, p.originalText, p.optimizedText]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(p.optimizedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked: the text is still selectable */ }
  };

  const tabBtn = (id: typeof tab, label: string) => (
    <button key={id} onClick={() => setTab(id)} role="tab" aria-selected={tab === id}
      style={{ fontSize: "14px", fontWeight: tab === id ? 600 : 500, fontFamily: "var(--font)", padding: "8px 14px", borderRadius: "8px", cursor: "pointer",
        border: tab === id ? "1px solid var(--accent)" : "1px solid var(--border)", background: tab === id ? "var(--accent-light)" : "var(--bg-card)", color: tab === id ? "var(--accent)" : "var(--text-secondary)" }}>
      {label}
    </button>
  );

  const readinessByLabel = new Map((p.beforeReadiness?.checks ?? []).map((c) => [c.label, c.score]));

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
        <ScoreCard title="Human Score" before={Math.round(p.beforeScore)} after={p.afterScore == null ? null : Math.round(p.afterScore)} pending={p.checking}
          hint="Our 32-signal analysis of how natural the writing reads." />
        <ScoreCard title="Reading ease" before={mBefore.readingEase} after={mAfter.readingEase}
          beforeNote={`${readingEaseLabel(mBefore.readingEase)}, grade ${mBefore.gradeLevel}`} afterNote={`${readingEaseLabel(mAfter.readingEase)}, grade ${mAfter.gradeLevel}`}
          hint="Flesch Reading Ease. 60+ is plain English for most readers." />
        <ScoreCard title="Search & AI-answer readiness" before={p.beforeReadiness?.score ?? null} after={p.afterReadiness?.score ?? null} pending={p.checking}
          hint="Our checklist for content that search engines and AI assistants can quote. Not a ranking forecast." />
      </div>

      {p.checkError && <div role="alert" style={{ fontSize: "14px", color: "var(--red)" }}>{p.checkError}</div>}

      {p.afterReadiness && (
        <div style={{ ...card, padding: "14px 18px" }}>
          <button onClick={() => setShowChecks((v) => !v)} style={{ fontSize: "14px", fontWeight: 600, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "var(--font)" }}>
            {showChecks ? "Hide" : "Show"} the readiness checklist
          </button>
          {showChecks && (
            <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {p.afterReadiness.checks.map((c) => {
                const b = readinessByLabel.get(c.label);
                return (
                  <div key={c.label} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "4px 12px", fontSize: "14px", borderTop: "1px solid var(--border-light)", paddingTop: "8px" }}>
                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{c.label}</span>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{b != null ? `${b} → ` : ""}{c.score}/10</span>
                    <span style={{ gridColumn: "1 / -1", color: "var(--text-muted)", fontSize: "13px" }}>{c.note}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {p.inputNeeded.length > 0 && (
        <div style={{ ...card, padding: "16px 18px", borderColor: "rgba(196,122,0,0.35)", background: "var(--amber-bg)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>
            <PenLine size={16} style={{ color: "var(--amber)" }} /> Your input needed ({p.inputNeeded.length})
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 10px", lineHeight: 1.6 }}>
            We never invent facts or stories. Replace each marker with a real detail, or delete it. Real examples and sources are what search engines and AI assistants trust most.
          </p>
          <ul style={{ margin: 0, paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "6px" }}>
            {p.inputNeeded.map((n, i) => (
              <li key={i} style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                <WithMarkers text={n.marker} /> <span style={{ color: "var(--text-muted)" }}>{n.why}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ ...card, padding: "16px 18px" }}>
        <div role="tablist" style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
          {tabBtn("changes", `Changes (${p.changes.length})`)}
          {tabBtn("compare", "Tracked changes")}
          {tabBtn("text", "Optimized text")}
        </div>

        {tab === "changes" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {p.changes.length === 0 && <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>See the tracked changes tab for every edit.</p>}
            {p.changes.map((c, i) => (
              <div key={i} style={{ borderTop: i ? "1px solid var(--border-light)" : "none", paddingTop: i ? "12px" : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: KIND_COLORS[c.kind] ?? "var(--accent)", border: `1px solid ${KIND_COLORS[c.kind] ?? "var(--accent)"}55`, borderRadius: "6px", padding: "2px 8px" }}>{c.kind}</span>
                  <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{c.reason}</span>
                </div>
                {c.before && <div style={{ fontSize: "14px", lineHeight: 1.6, color: "var(--red)", background: "var(--red-bg)", borderRadius: "6px", padding: "6px 10px", textDecoration: "line-through", textDecorationColor: "rgba(196,51,2,0.5)", marginBottom: "4px" }}>{c.before}</div>}
                <div style={{ fontSize: "14px", lineHeight: 1.6, color: "var(--text-primary)", background: "var(--accent-light)", borderRadius: "6px", padding: "6px 10px" }}><WithMarkers text={c.after} /></div>
              </div>
            ))}
          </div>
        )}

        {tab === "compare" && (
          <div style={{ fontSize: "15px", lineHeight: 1.8, color: "var(--text-secondary)", whiteSpace: "pre-wrap", maxHeight: "560px", overflowY: "auto", overflowWrap: "anywhere" }}>
            {diff.map((d, i) =>
              d.added ? <ins key={i} style={{ background: "var(--accent-light)", color: "var(--text-primary)", textDecoration: "none", borderRadius: "3px" }}>{d.value}</ins>
              : d.removed ? <del key={i} style={{ background: "var(--red-bg)", color: "var(--red)", textDecorationColor: "rgba(196,51,2,0.5)" }}>{d.value}</del>
              : <span key={i}>{d.value}</span>
            )}
          </div>
        )}

        {tab === "text" && (
          <>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
              <button onClick={copy} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 600, color: "white", background: "var(--accent)", border: "none", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", fontFamily: "var(--font)" }}>
                {copied ? <><Check size={14} />Copied</> : <><Copy size={14} />Copy text</>}
              </button>
            </div>
            <div style={{ fontSize: "15px", lineHeight: 1.8, color: "var(--text-primary)", whiteSpace: "pre-wrap", maxHeight: "560px", overflowY: "auto", overflowWrap: "anywhere" }}>
              <WithMarkers text={p.optimizedText} />
            </div>
          </>
        )}
      </div>

      <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
        Goal: {GOAL_LABELS[p.goal].label}{p.keyword ? ` · Target: "${p.keyword}"` : ""}. The ContentTrace engine scored both versions. Review every change before you publish. No tool can guarantee rankings or AI citations.
      </p>
    </div>
  );
}
