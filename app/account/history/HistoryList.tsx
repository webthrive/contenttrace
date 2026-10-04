"use client";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

type Item = { id: string; created_at: string; content_type: string | null; word_count: number; score: number | null; verdict: string | null; preview: string | null; goal?: string | null; parent_id?: string | null };

const GOAL_NAMES: Record<string, string> = { readability: "Humanize", seo: "SEO", aeo: "AI answers" };

const VERDICT_COLOR: Record<string, string> = {
  "Likely Human": "#0a7373",
  "Leans Human": "#0a8a6a",
  "Leans AI": "#c47a00",
  "Likely AI-Generated": "var(--red)",
};

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function HistoryList() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/history", { cache: "no-store" })
      .then(async (r) => {
        if (r.status === 401) { window.location.href = "/login?next=/account/history"; return; }
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Could not load your history.");
        setItems(j.items);
      })
      .catch((e) => setError(e.message));
  }, []);

  const remove = async (id: string) => {
    if (!window.confirm("Delete this analysis from your history? This cannot be undone.")) return;
    const r = await fetch(`/api/history/${id}`, { method: "DELETE" });
    if (r.ok) setItems((prev) => (prev ?? []).filter((i) => i.id !== id));
    else setError("Could not delete this analysis. Please try again.");
  };

  return (
    <>
      <a href="/account" style={{ fontSize: "14px", color: "var(--accent)" }}>← Your account</a>
      <h1 style={{ fontSize: "30px", fontWeight: 700, color: "var(--text-primary)", margin: "12px 0 6px" }}>Your past analyses</h1>
      <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginBottom: "24px", lineHeight: 1.6 }}>
        Open any analysis to run the three optimizers on it and compare before and after. Only you can see these. You can delete any of them at any time.
      </p>

      {error && <p role="alert" style={{ color: "var(--red)", fontSize: "14px", marginBottom: "16px" }}>{error}</p>}
      {!items && !error && <p style={{ color: "var(--text-muted)" }}>Loading…</p>}

      {items && items.length === 0 && (
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "var(--bg-card)", padding: "28px", textAlign: "center" }}>
          <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginBottom: "14px" }}>No saved analyses yet.</p>
          <a href="/" style={{ display: "inline-block", padding: "10px 18px", borderRadius: "8px", background: "var(--accent)", color: "white", fontWeight: 600, textDecoration: "none", fontSize: "14px" }}>Analyze a text</a>
        </div>
      )}

      {items && items.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
          {items.map((i) => (
            <li key={i.id} style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-card)", display: "flex", alignItems: "stretch" }}>
              <a href={`/account/history/${i.id}`} style={{ flex: 1, minWidth: 0, padding: "16px 18px", textDecoration: "none", display: "flex", gap: "16px", alignItems: "center" }}>
                <div style={{ minWidth: "58px", textAlign: "center" }}>
                  <div style={{ fontSize: "24px", fontWeight: 700, color: VERDICT_COLOR[i.verdict ?? ""] ?? "var(--text-primary)" }}>{i.score != null ? Math.round(Number(i.score)) : "–"}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>/ 100</div>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
                    {i.goal && <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent)", background: "var(--accent-light)", border: "1px solid rgba(10,115,115,0.3)", borderRadius: "10px", padding: "1px 8px", marginRight: "8px" }}>Optimized · {GOAL_NAMES[i.goal] ?? i.goal}</span>}
                    {i.verdict ?? "Analysis"} <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>· {formatDate(i.created_at)}</span>
                  </div>
                  <div style={{ fontSize: "14px", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{i.preview}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                    {i.word_count.toLocaleString()} words{i.content_type ? ` · ${i.content_type}` : ""}
                  </div>
                </div>
              </a>
              <button onClick={() => remove(i.id)} aria-label="Delete this analysis" title="Delete"
                style={{ border: "none", borderLeft: "1px solid var(--border)", background: "transparent", color: "var(--text-muted)", padding: "0 16px", cursor: "pointer" }}>
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
