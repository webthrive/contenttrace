// Small markdown helpers for the subset the editor writes: headings, bold, italic,
// bullet and numbered lists (nested by indent), quotes and paragraphs.
// No dependencies, so the server and the browser can both use them.

export type LineBlock =
  | { kind: "heading"; level: number; prefix: number }
  | { kind: "bullet"; depth: number; prefix: number }
  | { kind: "number"; depth: number; prefix: number; num: string }
  | { kind: "quote"; prefix: number }
  | { kind: "blank"; prefix: 0 }
  | { kind: "para"; prefix: 0 };

const indentDepth = (ws: string) => Math.floor(ws.replace(/\t/g, "  ").length / 2);

// What kind of block a line is, and how many leading characters are markdown syntax.
export function lineBlock(line: string): LineBlock {
  if (!line.trim()) return { kind: "blank", prefix: 0 };
  let m = /^ {0,3}(#{1,6})[ \t]+/.exec(line);
  if (m) return { kind: "heading", level: m[1].length, prefix: m[0].length };
  m = /^([ \t]*)[-*+•][ \t]+/.exec(line);
  if (m) return { kind: "bullet", depth: indentDepth(m[1]), prefix: m[0].length };
  m = /^([ \t]*)(\d{1,3})[.)][ \t]+/.exec(line);
  if (m) return { kind: "number", depth: indentDepth(m[1]), prefix: m[0].length, num: m[2] };
  m = /^ {0,3}>[ \t]?/.exec(line);
  if (m) return { kind: "quote", prefix: m[0].length };
  return { kind: "para", prefix: 0 };
}

// Character-level emphasis marks for one line (after its block prefix).
// hidden = markdown syntax not to show; bold / italic = styled characters.
export function inlineMarks(line: string, from = 0) {
  const n = line.length;
  const hidden = new Array<boolean>(n).fill(false);
  const bold = new Array<boolean>(n).fill(false);
  const italic = new Array<boolean>(n).fill(false);
  for (let i = 0; i < from; i++) hidden[i] = true;
  const body = line.slice(from);
  const mark = (re: RegExp, open: number, arr: boolean[]) => {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(body))) {
      const s = from + m.index;
      const e = s + m[0].length;
      if (hidden[s] || hidden[e - 1]) continue; // a delimiter already used by bold
      for (let i = s; i < s + open; i++) hidden[i] = true;
      for (let i = e - open; i < e; i++) hidden[i] = true;
      for (let i = s + open; i < e - open; i++) arr[i] = true;
    }
  };
  mark(/\*\*(?=\S)([\s\S]*?\S)\*\*/g, 2, bold);
  mark(/(?<![\w])__(?=\S)([\s\S]*?\S)__(?![\w])/g, 2, bold);
  mark(/(?<![*\w])\*(?=[^\s*])([^*]*?[^\s*])\*(?![*\w])/g, 1, italic);
  mark(/(?<![\w])_(?=[^\s_])([^_]*?[^\s_])_(?![\w])/g, 1, italic);
  return { hidden, bold, italic };
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function inlineHtml(text: string): string {
  const { hidden, bold, italic } = inlineMarks(text);
  let out = "";
  let b = false, it = false;
  for (let i = 0; i < text.length; i++) {
    if (hidden[i]) continue;
    if (it && !italic[i]) { out += "</em>"; it = false; }
    if (b && !bold[i]) { out += "</strong>"; b = false; }
    if (!b && bold[i]) { out += "<strong>"; b = true; }
    if (!it && italic[i]) { out += "<em>"; it = true; }
    out += esc(text[i]);
  }
  if (it) out += "</em>";
  if (b) out += "</strong>";
  return out;
}

// Markdown to clean HTML (for the editor, rich copy and display).
export function mdToHtml(md: string): string {
  const lines = md.replace(/\r\n?/g, "\n").split("\n");
  let html = "";
  let para: string[] = [];
  // Open list stack: one entry per nesting depth.
  const stack: ("ul" | "ol")[] = [];
  let liOpen = false;
  const flushPara = () => { if (para.length) { html += `<p>${para.map(inlineHtml).join("<br>")}</p>`; para = []; } };
  const closeLists = (toDepth: number) => {
    while (stack.length > toDepth) {
      if (liOpen) { html += "</li>"; }
      html += `</${stack.pop()}>`;
      liOpen = stack.length > 0;
    }
  };
  for (const raw of lines) {
    const blk = lineBlock(raw);
    const content = raw.slice(blk.prefix).trim();
    if (blk.kind === "bullet" || blk.kind === "number") {
      flushPara();
      const tag = blk.kind === "bullet" ? "ul" : "ol";
      const depth = Math.min(blk.depth, stack.length); // cannot skip levels
      if (stack.length > depth + 1) closeLists(depth + 1);
      if (stack.length === depth + 1 && stack[depth] !== tag) closeLists(depth);
      if (stack.length === depth) {
        html += blk.kind === "number" && blk.num !== "1" ? `<ol start="${Number(blk.num)}">` : `<${tag}>`;
        stack.push(tag);
      } else if (liOpen) {
        html += "</li>";
      }
      html += `<li><p>${inlineHtml(content)}</p>`;
      liOpen = true;
      continue;
    }
    if (blk.kind === "blank") { flushPara(); closeLists(0); continue; }
    if (stack.length && blk.kind === "para" && /^[ \t]+\S/.test(raw)) {
      // Indented continuation of a list item.
      html += `<p>${inlineHtml(content)}</p>`;
      continue;
    }
    closeLists(0);
    if (blk.kind === "heading") { flushPara(); html += `<h${blk.level}>${inlineHtml(content)}</h${blk.level}>`; continue; }
    if (blk.kind === "quote") { flushPara(); html += `<blockquote><p>${inlineHtml(content)}</p></blockquote>`; continue; }
    para.push(content);
  }
  flushPara();
  closeLists(0);
  return html;
}

// Markdown to plain text: no heading hashes or emphasis marks. Bullets stay as "- ".
export function mdToPlain(md: string): string {
  return md.replace(/\r\n?/g, "\n").split("\n").map((line) => {
    const blk = lineBlock(line);
    const keep = blk.kind === "bullet" || blk.kind === "number" ? line.slice(0, blk.prefix) : "";
    const body = blk.kind === "heading" || blk.kind === "quote" ? line.slice(blk.prefix) : line.slice(keep.length);
    const { hidden } = inlineMarks(body);
    return keep + body.split("").filter((_, i) => !hidden[i]).join("");
  }).join("\n");
}

// Text the scoring engine sees. Emphasis marks and heading hashes are removed, so the
// scores match plain pasted text (the calibration baseline). List markers stay.
export function scoringText(md: string): string {
  return mdToPlain(md);
}
