"use client";
import { useEffect, useState } from "react";
import ResultsDisplay from "@/components/ResultsDisplay";
import type { AnalysisResult } from "@/types/analysis";
import { formatDate } from "../HistoryList";

type Saved = { id: string; created_at: string; input_text: string; result: AnalysisResult };

export default function SavedAnalysis({ id }: { id: string }) {
  const [data, setData] = useState<Saved | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showText, setShowText] = useState(false);

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

  return (
    <>
      <a href="/account/history" style={{ fontSize: "14px", color: "var(--accent)" }}>← All past analyses</a>
      {error && <p role="alert" style={{ color: "var(--red)", fontSize: "15px", marginTop: "20px" }}>{error}</p>}
      {!data && !error && <p style={{ color: "var(--text-muted)", marginTop: "20px" }}>Loading…</p>}
      {data && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap", margin: "14px 0 18px" }}>
            <span style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Saved {formatDate(data.created_at)}</span>
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
          <ResultsDisplay result={{ ...data.result, text: data.input_text.substring(0, 500) }} />
        </>
      )}
    </>
  );
}
