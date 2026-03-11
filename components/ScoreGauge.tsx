"use client";

interface ScoreGaugeProps { score: number; size?: "sm" | "md" | "lg"; }

export default function ScoreGauge({ score, size = "md" }: ScoreGaugeProps) {
  const getColor = (s: number) => {
    if (s >= 75) return "#0a7373";
    if (s >= 50) return "#0a8a6a";
    if (s >= 25) return "#c47a00";
    return "#c43302";
  };

  const color = getColor(score);
  const pct = Math.min(Math.max(score, 0), 100) / 100;

  const dims    = { sm: 72,  md: 100, lg: 148 };
  const strokes = { sm: 6,   md: 8,   lg: 12  };
  const dim    = dims[size];
  const stroke = strokes[size];
  const r  = dim / 2 - stroke;
  const cx = dim / 2;

  // Arc goes left to right across the top — flat bottom at y = cx
  // Start: left end of diameter  End: right end of diameter
  const x0 = stroke;           // left point
  const x1 = dim - stroke;     // right point
  const y0 = cx;               // both at vertical center = flat bottom

  // Point along arc for progress
  // angle 0 = left (180° in standard), sweeps clockwise to right (0°)
  const angle = Math.PI - pct * Math.PI;   // goes from π → 0
  const ax = cx + r * Math.cos(angle);
  const ay = cx - r * Math.sin(angle);     // subtract because SVG y is flipped
  const largeArc = pct > 0.5 ? 1 : 0;

  // SVG height = radius + stroke (just the top half) + label space
  const labelGap = { sm: 18, md: 22, lg: 30 };
  const svgH = cx + labelGap[size];

  const fontSize  = { sm: "13px", md: "18px", lg: "28px" };
  const labelSize = { sm: "9px",  md: "11px", lg: "13px" };
  const scoreOffY = { sm: -4, md: -5, lg: -8 };
  const labelOffY = { sm: 10, md: 13, lg: 18 };

  return (
    <svg
      width={dim}
      height={svgH}
      viewBox={`0 0 ${dim} ${svgH}`}
      style={{ display: "block", overflow: "visible" }}
    >
      {/* Background track — full semicircle */}
      <path
        d={`M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y0}`}
        fill="none"
        stroke="var(--border)"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      {/* Colored progress arc */}
      {pct > 0.01 && (
        <path
          d={`M ${x0} ${y0} A ${r} ${r} 0 ${largeArc} 1 ${ax} ${ay}`}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 3px ${color}50)` }}
        />
      )}
      {/* Score */}
      <text
        x={cx}
        y={y0 + scoreOffY[size]}
        textAnchor="middle"
        dominantBaseline="auto"
        fill={color}
        fontSize={fontSize[size]}
        fontFamily="DM Mono, monospace"
        fontWeight="600"
      >
        {score}
      </text>
      {/* /100 */}
      <text
        x={cx}
        y={y0 + labelOffY[size]}
        textAnchor="middle"
        dominantBaseline="auto"
        fill="var(--text-muted)"
        fontSize={labelSize[size]}
        fontFamily="Rubik, sans-serif"
      >
        / 100
      </text>
    </svg>
  );
}
