"use client";
import { useState } from "react";
import { FactorScore } from "@/types/analysis";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FactorRowProps { factor: FactorScore; }

function getColor(s: number) {
  if (s >= 75) return "#0a7373";
  if (s >= 50) return "#0a8a6a";
  if (s >= 25) return "#c47a00";
  return "#c43302";
}

export default function FactorRow({ factor }: FactorRowProps) {
  const [open, setOpen] = useState(false);
  const na = factor.applicable === false;
  const color = na ? "var(--text-muted)" : getColor(factor.score);
  const pct = na ? 0 : Math.max(factor.score, 4);

  return (
    <div style={{ borderRadius: "8px", overflow: "hidden", background: "var(--bg-elevated)", marginBottom: "4px", opacity: na ? 0.6 : 1 }}>
      <div onClick={() => setOpen(!open)} style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
        {/* Mini bar */}
        <div style={{ width: "60px", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "3px" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color, fontFamily: "var(--font-mono)" }}>{na ? "N/A" : factor.score}</span>
            {!na && <span style={{ fontSize: "9px", color: "var(--text-muted)" }}>/100</span>}
          </div>
          <div style={{ height: "4px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "2px" }} />
          </div>
        </div>
        {/* Name */}
        <div style={{ flex: 1, fontSize: "14px", color: "var(--text-primary)", fontWeight: 500 }}>{factor.name}</div>
        {/* Toggle */}
        {factor.explanation?.length > 0 && (
          <div style={{ color: "var(--text-muted)", flexShrink: 0 }}>
            {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </div>
        )}
      </div>
      {open && factor.explanation?.length > 0 && (
        <div style={{ padding: "0 14px 12px 86px", display: "flex", flexDirection: "column", gap: "5px" }}>
          {factor.explanation.map((e, i) => (
            <div key={i} style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.55", display: "flex", gap: "8px" }}>
              <span style={{ color, flexShrink: 0 }}>•</span>
              <span>{e}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
