"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SectionScore } from "@/types/analysis";
import FactorRow from "./FactorRow";
import ScoreGauge from "./ScoreGauge";

interface SectionCardProps { section: SectionScore; index: number; }

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

  const getColor = (s: number) => {
    if (s >= 75) return { accent: "#0a7373", bg: "rgba(10,115,115,0.04)" };
    if (s >= 50) return { accent: "#0a8a6a", bg: "rgba(10,138,106,0.04)" };
    if (s >= 25) return { accent: "#c47a00", bg: "rgba(196,122,0,0.04)" };
    return { accent: "#c43302", bg: "rgba(196,51,2,0.04)" };
  };

  const colors = getColor(section.score);

  return (
    <div className="fade-in" style={{ animationDelay: `${index * 80}ms`, opacity: 0, border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-card)", overflow: "hidden", marginBottom: "12px", boxShadow: "0 1px 4px rgba(1,2,33,0.04)" }}>
      <button onClick={() => setExpanded(!expanded)}
        style={{ width: "100%", padding: "18px 22px", display: "flex", alignItems: "center", gap: "16px", background: expanded ? colors.bg : "none", border: "none", cursor: "pointer", textAlign: "left", transition: "background 0.2s" }}>
        <div style={{ flexShrink: 0 }}><ScoreGauge score={section.score} size="sm" /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>{section.name}</div>
          <div style={{ fontSize: "16px", color: "var(--text-muted)", lineHeight: "1.4" }}>{SECTION_DESCRIPTIONS[section.name] || ""}</div>
        </div>
        <span style={{ fontSize: "13px", color: "var(--text-muted)", flexShrink: 0 }}>{section.factors.length} factors</span>
        <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
      </button>
      {expanded && (
        <div style={{ padding: "14px 18px 18px 18px", borderTop: "1px solid var(--border)" }}>
          {section.factors.map((factor, i) => (<FactorRow key={factor.name} factor={factor} delay={i * 50} />))}
        </div>
      )}
    </div>
  );
}
