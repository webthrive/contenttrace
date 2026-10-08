"use client";

import { Fragment, type ReactNode } from "react";
import { inlineMarks, lineBlock } from "@/lib/markdown";

// Shows markdown text formatted (headings, bold, italics, lists) instead of raw "##" and "**".
// Takes diff segments, so the before/after views keep their red and green highlights.
export type MdSegment = { value: string; added?: boolean; removed?: boolean };

const HEADING: Record<number, React.CSSProperties> = {
  1: { fontSize: "1.45em", fontWeight: 700, lineHeight: 1.3, margin: "0.7em 0 0.3em" },
  2: { fontSize: "1.25em", fontWeight: 700, lineHeight: 1.35, margin: "0.7em 0 0.25em" },
  3: { fontSize: "1.1em", fontWeight: 700, lineHeight: 1.4, margin: "0.6em 0 0.2em" },
  4: { fontSize: "1em", fontWeight: 700, margin: "0.5em 0 0.2em" },
};

type Piece = { text: string; seg: number };

export default function MarkdownView({ segments, text, renderText }: {
  segments?: MdSegment[];
  text?: string;
  renderText?: (t: string) => ReactNode; // for example, highlight [Add: ...] markers
}) {
  const segs: MdSegment[] = segments ?? [{ value: text ?? "" }];
  // Split the segments into lines, keeping which segment each piece came from.
  const lines: Piece[][] = [[]];
  segs.forEach((s, si) => {
    s.value.split("\n").forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (part) lines[lines.length - 1].push({ text: part, seg: si });
    });
  });
  const draw = (t: string) => (renderText ? renderText(t) : t);

  return (
    <>
      {lines.map((pieces, li) => {
        const full = pieces.map((p) => p.text).join("");
        const blk = lineBlock(full);
        if (blk.kind === "blank") {
          // A line that only held a removed or added line break still shows its highlight.
          return <div key={li} style={{ height: "0.6em" }} />;
        }
        const { hidden, bold, italic } = inlineMarks(full, blk.prefix);
        // Runs of characters with the same segment and style.
        const runs: ReactNode[] = [];
        let pos = 0;
        for (const p of pieces) {
          let buf = "";
          let style = "";
          const flush = () => {
            if (!buf) return;
            const [b, it] = [style[0] === "1", style[1] === "1"];
            let node: ReactNode = draw(buf);
            if (it) node = <em>{node}</em>;
            if (b) node = <strong>{node}</strong>;
            const s = segs[p.seg];
            const k = `${li}-${runs.length}`;
            runs.push(s.added
              ? <ins key={k} style={{ background: "var(--accent-light)", color: "var(--text-primary)", textDecoration: "none", borderRadius: "3px" }}>{node}</ins>
              : s.removed
                ? <del key={k} style={{ background: "var(--red-bg)", color: "var(--red)", textDecorationColor: "rgba(196,51,2,0.5)" }}>{node}</del>
                : <Fragment key={k}>{node}</Fragment>);
            buf = "";
          };
          for (let i = 0; i < p.text.length; i++, pos++) {
            if (hidden[pos]) continue;
            const st = `${bold[pos] ? 1 : 0}${italic[pos] ? 1 : 0}`;
            if (st !== style) { flush(); style = st; }
            buf += p.text[i];
          }
          flush();
        }

        if (blk.kind === "heading") {
          const Tag = `h${Math.min(blk.level + 1, 6)}` as "h2"; // page already has an h1
          return <Tag key={li} style={{ ...HEADING[Math.min(blk.level, 4)], color: "inherit" }}>{runs}</Tag>;
        }
        if (blk.kind === "bullet" || blk.kind === "number") {
          return (
            <div key={li} style={{ display: "flex", gap: "8px", paddingLeft: `${blk.depth * 22 + 4}px` }}>
              <span aria-hidden style={{ flexShrink: 0, minWidth: "14px", color: "var(--text-muted)" }}>{blk.kind === "bullet" ? (blk.depth % 2 ? "◦" : "•") : `${blk.num}.`}</span>
              <span style={{ flex: 1, minWidth: 0 }}>{runs}</span>
            </div>
          );
        }
        if (blk.kind === "quote") {
          return <div key={li} style={{ borderLeft: "3px solid var(--border)", paddingLeft: "12px", fontStyle: "italic" }}>{runs}</div>;
        }
        return <div key={li}>{runs}</div>;
      })}
    </>
  );
}
