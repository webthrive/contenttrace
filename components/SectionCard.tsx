"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SectionScore } from "@/types/analysis";
import FactorRow from "./FactorRow";
import ScoreGauge from "./ScoreGauge";

interface SectionCardProps {
  section: SectionScore;
  index: number;
}

const SECTION_DESCRIPTIONS: Record<string, string> = {
  "Structure & Flow": "How sentences and paragraphs are organized — AI tends toward uniform rhythm and predictable patterns.",
  "Word Choice & Phrasing": "Specific language patterns, filler phrases, and hedging language common in AI output.",
  "Voice & Perspective": "Whether the writing has a distinct, authentic human point of view or reads as generic.",
  "Content & Logic": "Depth of treatment, insider knowledge, and whether the content says anything surprising.",
  "Cognitive Fingerprinting": "Traces of human thinking — self-correction, opinion drift, thinking out loud.",
  "Emotional Texture": "Whether emotion feels genuine or performed, and whether vulnerability is present.",
  "Pragmatics & Subtext": "Subtext, irony, register shifts — human writers imply; AI tends to over-explain.",
  "Statistical Proxies": "Approximations of vocabulary richness, burstiness, and response calibration.",
};

export default function SectionCard({ section, index }: SectionCardProps) {
  const [expanded, setExpanded] = useState(index === 0);

  // score is 0-100, higher = more human = green
  const getColor = (s: number) => {
    if (s >= 65) return { accent: "#4ade80", bg: "rgba(74,222,128,0.06)" };
    if (s >= 35) return { accent: "#fbbf24", bg: "rgba(251,191,36,0.06)" };
    return { accent: "#f87171", bg: "rgba(248,113,113,0.06)" };
  };

  const colors = getColor(section.score);

  return (
    <div className="fade-in" style={{ animationDelay: `${index * 80}ms`, opacity: 0, border: "1px solid var(--border-light)", borderRadius: "12px", background: "var(--bg-card)", overflow: "hidden", marginBottom: "12px" }}>
      <button onClick={() => setExpanded(!expanded)}
        style={{ width: "100%", padding: "18px 22px", display: "flex", alignItems: "center", gap: "16px", background: expanded ? colors.bg : "none", border: "none", cursor: "pointer", textAlign: "left", transition: "background 0.2s" }}>
        <div style={{ flexShrink: 0 }}>
          <ScoreGauge score={section.score} size="sm" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px", fontFamily: "var(--font)" }}>{section.name}</div>
          <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.4" }}>{SECTION_DESCRIPTIONS[section.name] || ""}</div>
        </div>
        <span style={{ fontSize: "13px", color: "var(--text-muted)", flexShrink: 0 }}>{section.factors.length} factors</span>
        <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
      {expanded && (
        <div style={{ padding: "14px 18px 18px 18px", borderTop: "1px solid var(--border)" }}>
          {section.factors.map((factor, i) => (
            <FactorRow key={factor.name} factor={factor} delay={i * 50} />
          ))}
        </div>
      )}
    </div>
  );
}
