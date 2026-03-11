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
  const pct = score / 100;
  const dims =    { sm: 64,  md: 96,  lg: 140 };
  const strokes = { sm: 5,   md: 7,   lg: 10  };
  const dim = dims[size];
  const stroke = strokes[size];

  // Center of circle is at (cx, cy), arc is top half only
  // We want the flat edge at the bottom, so cy = height of SVG
  const r = (dim - stroke * 2) / 2;
  const cx = dim / 2;
  // Place cy so the semicircle sits properly — flat bottom at svg bottom edge
  const svgH = dim / 2 + stroke;
  const cy = svgH; // flat edge exactly at bottom of arc area

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const startX = cx - r;
  const startY = cy;
  const endX   = cx + r;
  const endY   = cy;

  // Colored arc endpoint
  const angle = Math.PI * (1 - pct); // from left (180°) sweeping right
  const arcX = cx + r * Math.cos(Math.PI - angle);
  const arcY = cy - r * Math.sin(Math.PI - angle);
  const largeArc = pct > 0.5 ? 1 : 0;

  const fontSize =  { sm: "12px", md: "16px", lg: "26px" };
  const labelSize = { sm: "8px",  md: "10px", lg: "12px" };
  const labelGap =  { sm: 13,     md: 16,     lg: 22     };
  const scoreY =    { sm: svgH - 6, md: svgH - 8, lg: svgH - 10 };

  return (
    <svg
      width={dim}
      height={svgH + labelGap[size] + 4}
      viewBox={`0 0 ${dim} ${svgH + labelGap[size] + 4}`}
      style={{ overflow: "visible", display: "block" }}
    >
      {/* Background track */}
      <path
        d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`}
        fill="none"
        stroke="var(--border)"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      {/* Colored progress arc */}
      {pct > 0 && (
        <path
          d={`M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${arcX} ${arcY}`}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color}40)` }}
        />
      )}
      {/* Score number */}
      <text
        x={cx}
        y={scoreY[size]}
        textAnchor="middle"
        fill={color}
        fontSize={fontSize[size]}
        fontFamily="DM Mono, monospace"
        fontWeight="600"
      >
        {score}
      </text>
      {/* /100 label */}
      <text
        x={cx}
        y={scoreY[size] + labelGap[size]}
        textAnchor="middle"
        fill="var(--text-muted)"
        fontSize={labelSize[size]}
        fontFamily="Rubik, sans-serif"
      >
        / 100
      </text>
    </svg>
  );
}
