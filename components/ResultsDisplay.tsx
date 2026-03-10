"use client";

import { AnalysisResult } from "@/types/analysis";
import ScoreGauge from "./ScoreGauge";
import SectionCard from "./SectionCard";
import { AlertTriangle, CheckCircle, HelpCircle, Zap } from "lucide-react";

interface ResultsDisplayProps {
  result: AnalysisResult;
}

const TAKEAWAYS: Record<string, { headline: string; body: string }> = {
  green: {
    headline: "This reads like human writing.",
    body: "The text shows strong signals of authentic human authorship — varied rhythm, genuine voice, and cognitive fingerprints that AI rarely replicates convincingly. It would likely pass scrutiny in most contexts.",
  },
  yellow: {
    headline: "Mixed signals — could go either way.",
    body: "The text has some human characteristics but also patterns consistent with AI generation or heavy AI editing. It may have been AI-assisted, lightly prompted, or written by a human in a formulaic style.",
  },
  red: {
    headline: "This reads like AI-generated content.",
    body: "The text shows strong AI signals across multiple sections — predictable structure, generic phrasing, performed rather than genuine emotion, and little evidence of real human cognitive fingerprints.",
  },
};

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const getVerdictStyle = () => {
    if (result.verdictColor === "green")
      return { color: "#4ade80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.2)", icon: <CheckCircle size={22} /> };
    if (result.verdictColor === "yellow")
      return { color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)", icon: <HelpCircle size={22} /> };
    return { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)", icon: <AlertTriangle size={22} /> };
  };

  const vstyle = getVerdictStyle();
  const takeaway = TAKEAWAYS[result.verdictColor];

  return (
    <div style={{ position: "relative", zIndex: 1 }}>

      {/* Score hero */}
      <div className="fade-in" style={{ border: `1px solid ${vstyle.border}`, borderRadius: "16px", background: vstyle.bg, padding: "28px 28px 24px", marginBottom: "16px" }}>

        <div style={{ display: "flex", alignItems: "center", gap: "28px", flexWrap: "wrap", marginBottom: "20px" }}>
          {/* Gauge */}
          <div style={{ flexShrink: 0 }}>
            <ScoreGauge score={result.aggregateScore} size="lg" />
          </div>

          {/* Verdict + stats */}
          <div style={{ flex: 1, minWidth: "200px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: vstyle.color, marginBottom: "4px" }}>
              {vstyle.icon}
              <span style={{ fontSize: "24px", fontFamily: "var(--font)", fontWeight: 700, letterSpacing: "-0.01em" }}>
                {result.verdict}
              </span>
            </div>
            <div style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "16px" }}>
              Human Score across {result.sections.length} sections · {result.sections.reduce((sum, s) => sum + s.factors.length, 0)} individual factors
            </div>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <Stat label="Word Count" value={result.wordCount.toString()} />
              <Stat label="Confidence" value={result.confidence} note={result.confidence === "Low" ? "Short text reduces accuracy" : undefined} />
              <Stat label="Perplexity" value="Phase 2" note="Statistical layer coming soon" muted />
            </div>
          </div>
        </div>

        {/* Takeaway box */}
        <div style={{ borderTop: `1px solid ${vstyle.border}`, paddingTop: "18px" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: "8px" }}>
            Our Takeaway
          </div>
          <div style={{ fontSize: "17px", fontWeight: 600, color: vstyle.color, marginBottom: "6px", fontFamily: "var(--font)" }}>
            {takeaway.headline}
          </div>
          <div style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: "1.65" }}>
            {takeaway.body}
          </div>
        </div>
      </div>

      {/* Section breakdown */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", paddingTop: "8px" }}>
          <Zap size={14} style={{ color: "var(--accent)" }} />
          <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
            Section Breakdown — click any section to expand factors
          </span>
        </div>
        {result.sections.map((section, i) => (
          <SectionCard key={section.name} section={section} index={i} />
        ))}
      </div>

      {/* Disclaimer */}
      <div style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "14px 18px", fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6" }}>
        <strong style={{ color: "var(--text-secondary)" }}>Note:</strong> These scores are probabilistic, not definitive. Short texts (&lt;100 words) produce lower confidence results. Heavily edited AI text or highly structured human writing may score unexpectedly. Phase 2 will add true statistical perplexity scoring via open-source language models.
      </div>
    </div>
  );
}

function Stat({ label, value, note, muted }: { label: string; value: string; note?: string; muted?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "3px", fontWeight: 500 }}>
        {label}
      </div>
      <div style={{ fontSize: "15px", fontFamily: "var(--font-mono)", color: muted ? "var(--text-muted)" : "var(--text-primary)", fontWeight: 500 }}>
        {value}
      </div>
      {note && <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{note}</div>}
    </div>
  );
}
