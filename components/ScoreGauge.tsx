"use client";

interface ScoreGaugeProps {
  score: number; // 0-100, higher = more human
  size?: "sm" | "md" | "lg";
}

export default function ScoreGauge({ score, size = "md" }: ScoreGaugeProps) {
  // Green = human (high), Yellow = mixed, Red = AI (low)
  const getColor = (s: number) => {
    if (s >= 65) return "#4ade80";
    if (s >= 35) return "#fbbf24";
    return "#f87171";
  };

  const color = getColor(score);
  const pct = score / 100;

  const dims = { sm: 64, md: 96, lg: 140 };
  const strokes = { sm: 5, md: 7, lg: 10 };
  const dim = dims[size];
  const stroke = strokes[size];
  const r = (dim - stroke * 2) / 2;
  const cx = dim / 2;
  const cy = dim / 2;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const startX = cx + r * Math.cos(toRad(-180));
  const startY = cy + r * Math.sin(toRad(-180));
  const angle = -180 + 180 * pct;
  const endX = cx + r * Math.cos(toRad(angle));
  const endY = cy + r * Math.sin(toRad(angle));
  const bgEndX = cx + r;
  const bgEndY = cy;
  const largeArc = pct > 0.5 ? 1 : 0;

  const fontSize = { sm: "11px", md: "15px", lg: "24px" };
  const labelSize = { sm: "7px", md: "9px", lg: "11px" };

  return (
    <svg
      width={dim}
      height={dim / 2 + stroke + 16}
      viewBox={`0 0 ${dim} ${dim / 2 + stroke + 16}`}
      style={{ overflow: "visible" }}
    >
      <path
        d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${bgEndX} ${bgEndY}`}
        fill="none"
        stroke="#22222e"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      {pct > 0 && (
        <path
          d={`M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY}`}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
        />
      )}
      <text
        x={cx}
        y={cy + 2}
        textAnchor="middle"
        fill={color}
        fontSize={fontSize[size]}
        fontFamily="DM Mono, monospace"
        fontWeight="500"
      >
        {score}
      </text>
      <text
        x={cx}
        y={cy + 13}
        textAnchor="middle"
        fill="#55556a"
        fontSize={labelSize[size]}
        fontFamily="Inter, sans-serif"
      >
        / 100
      </text>
    </svg>
  );
}
