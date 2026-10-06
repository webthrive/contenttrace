"use client";

import { useMemo, useRef, useState } from "react";
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
  warnings?: string[]; // fact guard: names, numbers or quotes that differ from the original
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

const wordCount = (t: string) => (t.trim() ? t.trim().split(/\s+/).length : 0);

type Tab = "side" | "tracked" | "changes" | "text";

export default function OptimizeResults(p: OptimizeResultsProps) {
  const [tab, setTab] = useState<Tab>("side");
  const [highlight, setHighlight] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showChecks, setShowChecks] = useState(false);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const syncing = useRef(false);

  const mBefore = useMemo(() => contentMetrics(p.originalText, p.keyword), [p.originalText, p.keyword]);
  const mAfter = useMemo(() => contentMetrics(p.optimizedText, p.keyword), [p.optimizedText, p.keyword]);
  // Scores that fell by more than normal run-to-run noise (3 points). Shown only once the re-check is done.
  const NOISE = 3;
  const drops: string[] = [];
  if (!p.checking && p.afterScore != null && p.afterScore < p.beforeScore - NOISE) drops.push(`Human Score ${Math.round(p.beforeScore)} → ${Math.round(p.afterScore)}`);
  if (!p.checking && mAfter.readingEase < mBefore.readingEase - NOISE) drops.push(`Reading ease ${mBefore.readingEase} → ${mAfter.readingEase}`);
  if (!p.checking && p.beforeReadiness && p.afterReadiness && p.afterReadiness.score < p.beforeReadiness.score - NOISE) drops.push(`Search & AI-answer readiness ${p.beforeReadiness.score} → ${p.afterReadiness.score}`);
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const copyOriginal = async () => {
    try { await navigator.clipboard.writeText(p.originalText); setCopiedOriginal(true); setTimeout(() => setCopiedOriginal(false), 2000); } catch { /* clipboard blocked */ }
  };
  const diff = useMemo(() => (tab === "side" || tab === "tracked" ? diffWords(p.originalText, p.optimizedText) : []), [tab, p.originalText, p.optimizedText]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(p.optimizedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked: the text is still selectable */ }
  };

  // Keep the two panes at the same scroll position, so the reader compares the same passage.
  const syncScroll = (from: "l" | "r") => () => {
    if (syncing.current) { syncing.current = false; return; }
    const a = from === "l" ? leftRef.current : rightRef.current;
    const b = from === "l" ? rightRef.current : leftRef.current;
    if (!a || !b) return;
    const room = a.scrollHeight - a.clientHeight;
    if (room <= 0) return;
    syncing.current = true;
    b.scrollTop = (a.scrollTop / room) * (b.scrollHeight - b.clientHeight);
  };

  const tabBtn = (id: Tab, label: string) => (
    <button key={id} onClick={() => setTab(id)} role="tab" aria-selected={tab === id}
      style={{ fontSize: "14px", fontWeight: tab === id ? 600 : 500, fontFamily: "var(--font)", padding: "8px 14px", borderRadius: "8px", cursor: "pointer",
        border: tab === id ? "1px solid var(--accent)" : "1px solid var(--border)", background: tab === id ? "var(--accent-light)" : "var(--bg-card)", color: tab === id ? "var(--accent)" : "var(--text-secondary)" }}>
      {label}
    </button>
  );

  const readinessByLabel = new Map((p.beforeReadiness?.checks ?? []).map((c) => [c.label, c.score]));
  const paneStyle: React.CSSProperties = { fontSize: "15px", lineHeight: 1.8, whiteSpace: "pre-wrap", maxHeight: "520px", overflowY: "auto", overflowWrap: "anywhere", padding: "14px 16px" };

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {drops.length > 0 && (
        <div role="alert" style={{ ...card, padding: "16px 18px", borderColor: "rgba(196,122,0,0.45)", background: "var(--amber-bg)" }}>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>Your scores went down. We recommend keeping your original text.</div>
          <ul style={{ margin: "0 0 8px", paddingLeft: "18px" }}>
            {drops.map((d) => <li key={d} style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{d}</li>)}
          </ul>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 10px" }}>
            {p.goal === "readability"
              ? "Your original already read well, so there was little for Humanize to fix."
              : `${GOAL_LABELS[p.goal].short} adds structure (headings, short definitions, lists) that our AI check reads as less natural.`}{" "}
            You can still copy single changes you like from the change list.
          </p>
          <button onClick={copyOriginal} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", fontFamily: "var(--font)" }}>
            {copiedOriginal ? <><Check size={14} />Copied</> : <><Copy size={14} />Copy original text</>}
          </button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
        {p.goal === "readability" ? <>
        <ScoreCard title="Reading ease" before={mBefore.readingEase} after={mAfter.readingEase}
          beforeNote={`${readingEaseLabel(mBefore.readingEase)}, grade ${mBefore.gradeLevel}`} afterNote={`${readingEaseLabel(mAfter.readingEase)}, grade ${mAfter.gradeLevel}`}
          hint="Flesch Reading Ease. 60+ is plain English for most readers." />
        <ScoreCard title="Human Score" before={Math.round(p.beforeScore)} after={p.afterScore == null ? null : Math.round(p.afterScore)} pending={p.checking}
          hint="Our 32-signal analysis of how natural the writing reads." />
        </> : <>
        <ScoreCard title="Human Score" before={Math.round(p.beforeScore)} after={p.afterScore == null ? null : Math.round(p.afterScore)} pending={p.checking}
          hint="Our 32-signal analysis of how natural the writing reads." />
        <ScoreCard title="Reading ease" before={mBefore.readingEase} after={mAfter.readingEase}
          beforeNote={`${readingEaseLabel(mBefore.readingEase)}, grade ${mBefore.gradeLevel}`} afterNote={`${readingEaseLabel(mAfter.readingEase)}, grade ${mAfter.gradeLevel}`}
          hint="Flesch Reading Ease. 60+ is plain English for most readers." />
        </>}
        <ScoreCard title="Search & AI-answer readiness" before={p.beforeReadiness?.score ?? null} after={p.afterReadiness?.score ?? null} pending={p.checking}
          hint="Our checklist for content that search engines and AI assistants can quote. Not a ranking forecast." />
      </div>

      {p.goal === "readability" && (
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0, background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "10px", padding: "10px 14px" }}>
          Humanize edits wording only. It never invents stories, opinions or facts, so the Human Score may move only a little. Reading ease usually improves most, and the real details you add at the [Add: ...] markers help most.
        </p>
      )}
      {p.checkError && <div role="alert" style={{ fontSize: "14px", color: "var(--red)" }}>{p.checkError}</div>}

      {(p.warnings?.length ?? 0) > 0 && (
        <div role="alert" style={{ ...card, padding: "16px 18px", borderColor: "rgba(196,51,2,0.35)", background: "var(--red-bg)" }}>
          <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--red)", marginBottom: "6px" }}>Check these before you publish</div>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 8px", lineHeight: 1.6 }}>
            Our fact check found details in the new version that we could not match to your original. Confirm them or change them back.
          </p>
          <ul style={{ margin: 0, paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "4px" }}>
            {p.warnings!.map((w, i) => <li key={i} style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{w}</li>)}
          </ul>
        </div>
      )}

      {p.afterReadiness && (() => {
        // Lowest scores first: these are the improvements only the writer can make (real examples, sources, data).
        const checks = [...p.afterReadiness.checks].sort((x, y) => x.score - y.score);
        const low = checks.filter((c) => c.score < 7).length;
        const shown = showChecks ? checks : checks.filter((c) => c.score < 7).slice(0, 3);
        return (
          <div style={{ ...card, padding: "16px 18px" }}>
            <button onClick={() => setShowChecks((v) => !v)} aria-expanded={showChecks}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "var(--font)", textAlign: "left" }}>
              <span>
                <span style={{ display: "block", fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>How to improve it further{low ? ` (${low} to work on)` : ""}</span>
                <span style={{ display: "block", fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>Search & AI-answer readiness checklist. We can only rework what is in your text; these need your input.</span>
              </span>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--accent)", whiteSpace: "nowrap" }}>{showChecks ? "Show less" : `Show all ${checks.length}`}</span>
            </button>
            {shown.length > 0 && (
              <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {shown.map((c) => {
                  const b = readinessByLabel.get(c.label);
                  const weak = c.score < 7;
                  return (
                    <div key={c.label} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "4px 12px", fontSize: "14px", borderTop: "1px solid var(--border-light)", paddingTop: "8px" }}>
                      <span style={{ fontWeight: 600, color: weak ? "var(--amber)" : "var(--text-primary)" }}>{weak ? "● " : "✓ "}{c.label}</span>
                      <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>{b != null ? `${b} → ` : ""}{c.score}/10</span>
                      <span style={{ gridColumn: "1 / -1", color: "var(--text-muted)", fontSize: "13px" }}>{c.note}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      <div style={{ ...card, padding: "16px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "14px" }}>
          <div role="tablist" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {tabBtn("side", "Before | After")}
            {tabBtn("tracked", "Tracked changes")}
            {tabBtn("changes", `Change list (${p.changes.length})`)}
            {tabBtn("text", "Optimized text")}
          </div>
          <button onClick={copy} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 600, color: "white", background: "var(--accent)", border: "none", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", fontFamily: "var(--font)" }}>
            {copied ? <><Check size={14} />Copied</> : <><Copy size={14} />Copy optimized text</>}
          </button>
        </div>

        {tab === "side" && (
          <>
            <label style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "10px", cursor: "pointer" }}>
              <input type="checkbox" checked={highlight} onChange={(e) => setHighlight(e.target.checked)} />
              Highlight what changed (red = removed, green = added)
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "12px" }}>
              <div style={{ border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px", background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--text-secondary)" }}>BEFORE</span>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{wordCount(p.originalText)} words · score {Math.round(p.beforeScore)}</span>
                </div>
                <div ref={leftRef} onScroll={syncScroll("l")} style={{ ...paneStyle, color: "var(--text-secondary)" }}>
                  {highlight
                    ? diff.filter((d) => !d.added).map((d, i) => d.removed
                        ? <del key={i} style={{ background: "var(--red-bg)", color: "var(--red)", textDecorationColor: "rgba(196,51,2,0.5)" }}>{d.value}</del>
                        : <span key={i}>{d.value}</span>)
                    : p.originalText}
                </div>
              </div>
              <div style={{ border: "2px solid var(--accent)", borderRadius: "10px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px", background: "var(--accent-light)", borderBottom: "1px solid rgba(10,115,115,0.3)" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--accent)" }}>AFTER · {GOAL_LABELS[p.goal].short.toUpperCase()}</span>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{wordCount(p.optimizedText)} words · score {p.afterScore == null ? "…" : Math.round(p.afterScore)}</span>
                </div>
                <div ref={rightRef} onScroll={syncScroll("r")} style={{ ...paneStyle, color: "var(--text-primary)" }}>
                  {highlight
                    ? diff.filter((d) => !d.removed).map((d, i) => d.added
                        ? <ins key={i} style={{ background: "var(--accent-light)", textDecoration: "none", borderRadius: "3px" }}><WithMarkers text={d.value} /></ins>
                        : <span key={i}><WithMarkers text={d.value} /></span>)
                    : <WithMarkers text={p.optimizedText} />}
                </div>
              </div>
            </div>
          </>
        )}

        {tab === "tracked" && (
          <div style={{ fontSize: "15px", lineHeight: 1.8, color: "var(--text-secondary)", whiteSpace: "pre-wrap", maxHeight: "560px", overflowY: "auto", overflowWrap: "anywhere" }}>
            {diff.map((d, i) =>
              d.added ? <ins key={i} style={{ background: "var(--accent-light)", color: "var(--text-primary)", textDecoration: "none", borderRadius: "3px" }}>{d.value}</ins>
              : d.removed ? <del key={i} style={{ background: "var(--red-bg)", color: "var(--red)", textDecorationColor: "rgba(196,51,2,0.5)" }}>{d.value}</del>
              : <span key={i}>{d.value}</span>
            )}
          </div>
        )}

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

        {tab === "text" && (
          <div style={{ fontSize: "15px", lineHeight: 1.8, color: "var(--text-primary)", whiteSpace: "pre-wrap", maxHeight: "560px", overflowY: "auto", overflowWrap: "anywhere" }}>
            <WithMarkers text={p.optimizedText} />
          </div>
        )}
      </div>

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

      <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
        Goal: {GOAL_LABELS[p.goal].label}{p.keyword ? ` · Target: "${p.keyword}"` : ""}. The ContentTrace engine scored both versions. Review every change before you publish. No tool can guarantee rankings or AI citations.
      </p>
    </div>
  );
}
