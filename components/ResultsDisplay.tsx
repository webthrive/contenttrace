"use client";

import { AnalysisResult } from "@/types/analysis";
import ScoreGauge from "./ScoreGauge";
import SectionCard from "./SectionCard";
import { AlertTriangle, CheckCircle, TrendingDown, TrendingUp, Zap } from "lucide-react";

interface ResultsDisplayProps { result: AnalysisResult; }

const VERDICTS: Record<string, { headline: string; body: string; color: string; bg: string; border: string; icon: React.ReactNode; }> = {
  green: {
    headline: "This reads like human writing.",
    body: "Strong signals of authentic human authorship — varied rhythm, genuine voice, and cognitive fingerprints that AI rarely replicates convincingly.",
    color: "#0a7373", bg: "rgba(10,115,115,0.05)", border: "rgba(10,115,115,0.25)",
    icon: <CheckCircle size={20} />,
  },
  teal: {
    headline: "This leans human — but not conclusively.",
    body: "More human signals than AI across the analysis, but some sections show patterns consistent with AI generation or heavy AI editing.",
    color: "#0a8a6a", bg: "rgba(10,138,106,0.05)", border: "rgba(10,138,106,0.25)",
    icon: <TrendingUp size={20} />,
  },
  amber: {
    headline: "This leans AI — treat with caution.",
    body: "More AI signals than human. The writing may be AI-generated, heavily AI-assisted, or written by a human in a very structured, formulaic style.",
    color: "#c47a00", bg: "rgba(196,122,0,0.05)", border: "rgba(196,122,0,0.25)",
    icon: <TrendingDown size={20} />,
  },
  red: {
    headline: "This reads like AI-generated content.",
    body: "Strong AI signals across multiple sections — predictable structure, generic phrasing, performed emotion, and little evidence of real human cognitive fingerprints.",
    color: "#c43302", bg: "rgba(196,51,2,0.05)", border: "rgba(196,51,2,0.25)",
    icon: <AlertTriangle size={20} />,
  },
};

const SCALE_ZONES = [
  { label: "Likely AI",    range: "0 – 24",   color: "#c43302", bg: "rgba(196,51,2,0.08)",   border: "rgba(196,51,2,0.2)",   key: "red"   },
  { label: "Leans AI",     range: "25 – 49",  color: "#c47a00", bg: "rgba(196,122,0,0.08)",  border: "rgba(196,122,0,0.2)",  key: "amber" },
  { label: "Leans Human",  range: "50 – 74",  color: "#0a8a6a", bg: "rgba(10,138,106,0.08)", border: "rgba(10,138,106,0.2)", key: "teal"  },
  { label: "Likely Human", range: "75 – 100", color: "#0a7373", bg: "rgba(10,115,115,0.08)", border: "rgba(10,115,115,0.2)", key: "green" },
];

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const v = VERDICTS[result.verdictColor];
  const scoredSections = result.sections.filter((s) => s.applicable !== false);
  const scoredFactors = scoredSections.reduce((n, s) => n + s.factors.filter((f) => f.applicable !== false).length, 0);

  return (
    <div>
      {/* Hero card */}
      <div className="fade-in" style={{ border: `1px solid ${v.border}`, borderRadius: "16px", background: v.bg, padding: "28px", marginBottom: "16px", boxShadow: "0 2px 16px rgba(1,2,33,0.06)" }}>

        {/* Score bar — large */}
        <ScoreGauge score={result.aggregateScore} size="lg" />

        {/* Meta */}
        <div style={{ fontSize: "14px", color: "var(--text-muted)", margin: "10px 0 16px" }}>
          Human Score across {scoredSections.length} sections · {scoredFactors} individual factors
        </div>

        {/* Word count + confidence */}
        <div style={{ display: "flex", gap: "24px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "3px", fontWeight: 500 }}>Word Count</div>
            <div style={{ fontSize: "15px", fontFamily: "var(--font-mono)", color: "var(--text-primary)", fontWeight: 500 }}>{result.wordCount}</div>
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "3px", fontWeight: 500 }}>Confidence</div>
            <div style={{ fontSize: "15px", fontFamily: "var(--font-mono)", color: "var(--text-primary)", fontWeight: 500 }}>{result.confidence}</div>
            {result.confidence === "Low" && <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>Short text reduces accuracy</div>}
          </div>
          {result.contentType && (
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "3px", fontWeight: 500 }}>Scored As</div>
              <div style={{ fontSize: "15px", fontFamily: "var(--font-mono)", color: "var(--text-primary)", fontWeight: 500 }}>{result.contentType.label}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                {result.contentType.detected ? "Auto-detected" : "Selected by you"}
              </div>
            </div>
          )}
        </div>

        {/* Content type adjustment */}
        {result.contentType && result.adjustment && (
          <div style={{ border: "1px solid var(--border)", borderRadius: "10px", background: "var(--bg-card)", padding: "14px 16px", marginBottom: "20px" }}>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: "6px" }}>
              Adjusted for {result.contentType.label}
            </div>
            <div style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>{result.adjustment.note}</div>
            {result.adjustment.excludedFactors.length > 0 && (
              <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6", marginTop: "8px" }}>
                <strong style={{ color: "var(--text-secondary)", fontWeight: 600 }}>Not counted ({result.adjustment.excludedFactors.length}):</strong>{" "}
                {result.adjustment.excludedFactors.join(" · ")}
              </div>
            )}
            {result.contentType.detected && (
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "8px" }}>
                Wrong type? Click New Analysis, choose the content type under the text box, and run it again.
              </div>
            )}
          </div>
        )}

        {/* Takeaway */}
        <div style={{ borderTop: `1px solid ${v.border}`, paddingTop: "18px", marginBottom: "20px" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: "8px" }}>Our Takeaway</div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: v.color, marginBottom: "6px" }}>
            {v.icon}
            <span style={{ fontSize: "17px", fontWeight: 600 }}>{v.headline}</span>
          </div>
          <div style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: "1.65" }}>{v.body}</div>
        </div>

        {/* Scale bar */}
        <div style={{ borderTop: `1px solid ${v.border}`, paddingTop: "18px" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: "10px" }}>Score Scale</div>
          <div style={{ position: "relative", marginBottom: "6px" }}>
            <div style={{ height: "10px", borderRadius: "6px", background: "linear-gradient(to right,#c43302 0%,#c43302 25%,#c47a00 25%,#c47a00 50%,#0a8a6a 50%,#0a8a6a 75%,#0a7373 75%,#0a7373 100%)" }} />
            <div style={{ position: "absolute", top: "-3px", left: `calc(${result.aggregateScore}% - 8px)`, width: "16px", height: "16px", borderRadius: "50%", background: v.color, border: "2px solid white", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginBottom: "10px" }}>
            <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "6px" }}>
            {SCALE_ZONES.map((z) => (
              <div key={z.label} style={{ textAlign: "center", padding: "7px 6px", borderRadius: "8px", background: z.bg, border: `1px solid ${z.border}`, opacity: z.key === result.verdictColor ? 1 : 0.4 }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: z.color }}>{z.label}</div>
                <div style={{ fontSize: "10px", color: z.color, fontFamily: "var(--font-mono)", opacity: 0.8, marginTop: "2px" }}>{z.range}</div>
              </div>
            ))}
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
        {result.sections.map((section, i) => (<SectionCard key={section.name} section={section} index={i} />))}
      </div>

      <div style={{ border: "1px solid var(--border)", borderRadius: "8px", padding: "14px 18px", fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.6", background: "var(--bg-elevated)" }}>
        <strong style={{ color: "var(--text-secondary)" }}>Note:</strong> These scores are probabilistic, not definitive. Short texts (&lt;100 words) produce lower confidence results. Heavily edited AI text or highly structured human writing may score unexpectedly.
      </div>
    </div>
  );
}
