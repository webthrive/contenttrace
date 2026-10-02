"use client";
import { useEffect, useState } from "react";
import { History } from "lucide-react";

type Item = { id: string; created_at: string; word_count: number; score: number | null; verdict: string | null; preview: string | null };

const VERDICT_COLOR: Record<string, string> = {
  "Likely Human": "#0a7373",
  "Leans Human": "#0a8a6a",
  "Leans AI": "#c47a00",
  "Likely AI-Generated": "var(--red)",
};

function shortDate(iso: string) {
  const d = new Date(iso);
  const sameDay = d.toDateString() === new Date().toDateString();
  return sameDay
    ? d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    : d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// The signed-in user's latest saved analyses, shown under the input box on the home page.
export default function RecentAnalyses({ refreshKey }: { refreshKey?: string | null }) {
  const [items, setItems] = useState<Item[] | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("/api/history?limit=3", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { if (j) { setItems(j.items); setTotal(j.total ?? j.items.length); } })
      .catch(() => {});
  }, [refreshKey]);

  if (!items || items.length === 0) return null;

  return (
    <section aria-label="Your recent analyses" style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-card)", padding: "14px 16px", marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          <History size={14} />Your recent analyses
        </span>
        <a href="/account/history" style={{ fontSize: "13px", color: "var(--accent)", fontWeight: 600 }}>View all{total > items.length ? ` (${total})` : ""} →</a>
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {items.map((i, n) => (
          <li key={i.id} style={{ borderTop: n === 0 ? "none" : "1px solid var(--border)" }}>
            <a href={`/account/history/${i.id}`} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 0", textDecoration: "none" }}>
              <span style={{ minWidth: "34px", fontSize: "16px", fontWeight: 700, textAlign: "right", color: VERDICT_COLOR[i.verdict ?? ""] ?? "var(--text-primary)" }}>
                {i.score != null ? Math.round(Number(i.score)) : "–"}
              </span>
              <span style={{ flex: 1, minWidth: 0, fontSize: "14px", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{i.preview}</span>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{shortDate(i.created_at)}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
