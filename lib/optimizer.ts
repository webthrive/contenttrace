// Content Optimizer (server only): rewrite text for a goal, judge Search & AI-answer readiness,
// and sign the re-check token that lets /api/analyze score the rewrite without a second charge.
import Anthropic from "@anthropic-ai/sdk";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";
import { MODEL } from "./analyzer";
import { contentMetrics } from "./contentMetrics";
import { env } from "./billing/env";

export const GOALS = ["readability", "seo", "aeo"] as const;
export type Goal = (typeof GOALS)[number];
export const isGoal = (g: unknown): g is Goal => typeof g === "string" && (GOALS as readonly string[]).includes(g);

export type Change = { before: string; after: string; reason: string; kind: string };
export type InputNeeded = { marker: string; why: string };
export type ReadinessCheck = { label: string; score: number; note: string; source: "model" | "code" };
export type Readiness = { score: number; checks: ReadinessCheck[] };
export type Weakness = { factor: string; score: number; note: string };

// The rewrite takes longer than a scoring call, so it gets its own client with a longer timeout.
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 38_000, maxRetries: 1 });

// ---------------------------------------------------------------------------------------------
// Rewrite

const GOAL_BRIEF: Record<Goal, string> = {
  readability:
    "Goal: easier to read. Use shorter sentences, plain words, active voice and one idea per paragraph. Cut filler. Do not add headings unless the text is long and has none.",
  seo:
    "Goal: easier to read AND easier for search engines to understand. Use shorter sentences, plain words and active voice. Use descriptive headings that say what each section covers. Put the main point early. If a target keyword is given, use it naturally in the first 100 words and in at least one heading, and use close variants. Never stuff the keyword.",
  aeo:
    "Goal: easier to read AND easy for AI assistants and answer engines (Google AI Overviews, ChatGPT, Perplexity) to quote. Start with a direct answer of 40 to 60 words to the main question. Use question-style headings where they fit. Make each paragraph self-contained: name the subject instead of starting with \"it\" or \"this\". Define key terms in one sentence. Use short lists for steps or options. State specific facts plainly. If a target question is given, answer it directly at the top.",
};

const REWRITE_SYSTEM = `You are a senior editor. You rewrite text so it reads like a skilled human wrote it, for the goal you are given.
You are an editor, not an author: you change how things are said, never what is said.
Rules:
1. Keep every fact, claim, number, name, date, link and the author's position. Write in the same language as the original.
2. Keep every direct quote word for word, with its speaker. Do not remove quotes, facts or sections.
3. Do not add anything that is not in the original: no new names of people, companies, products or places, no new numbers, dates, examples, sources or quotes, no new conclusions or predictions.
4. Do not add opinions, judgments, feelings, worries, beliefs or first-person statements the author did not make. Do not make the author more emotional, more certain or more personal than the original.
5. Where a real detail would make the text stronger (an example from the author's own work, a number, a source), insert a short marker in square brackets, for example [Add: a real example of a client result]. Use at most 3 markers per part. Every marker in inputNeeded must appear in the rewritten text exactly as written.
6. Do not use em dashes or en dashes as punctuation. Use commas, periods, colons or parentheses.
7. Avoid patterns typical of AI assistants: "Here's...", "Great question", "It's not X, it's Y", "not just X, but Y", groups of three everywhere, "delve", "landscape", "in today's fast-paced world", "it's important to note", "moreover", "furthermore", a closing offer to help more, and filler.
8. Vary sentence length: mix short sentences with longer ones. Prefer precise words over vague ones. Use contractions where the register allows.
9. Keep the register right for the content type. Do not make a formal document, a news report or a legal email chatty.
10. Keep the formatting: markdown stays markdown, heading levels and numbering stay as they are, lists stay lists, tables stay tables. Add a new heading only when the goal asks for it, using the same heading style as the original ("## " if the original has none).
11. Keep the length between about 80% and 120% of the original.
12. In changes, list the most important edits (at most 10). For each: a short exact excerpt of the original (max 20 words), the new version, and the reason in plain English (max 15 words).
Return your answer only through the record_rewrite tool.`;

const REWRITE_TOOL: Anthropic.Tool = {
  name: "record_rewrite",
  description: "Record the rewritten text and the list of changes.",
  input_schema: {
    type: "object",
    properties: {
      rewritten: { type: "string", description: "The full rewritten text of this part." },
      changes: {
        type: "array",
        maxItems: 10,
        items: {
          type: "object",
          properties: {
            before: { type: "string" },
            after: { type: "string" },
            reason: { type: "string" },
            kind: { type: "string", enum: ["Readability", "Natural voice", "Structure", "SEO", "AI answers"] },
          },
          required: ["before", "after", "reason", "kind"],
        },
      },
      inputNeeded: {
        type: "array",
        maxItems: 3,
        items: {
          type: "object",
          properties: {
            marker: { type: "string", description: "The exact [Add: ...] marker text." },
            why: { type: "string", description: "Why a real detail here helps (max 15 words)." },
          },
          required: ["marker", "why"],
        },
      },
    },
    required: ["rewritten", "changes", "inputNeeded"],
  },
};

const countWords = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);

// Long texts are rewritten in parallel parts of about 600 words, split at paragraph breaks,
// so a 5,000-word text finishes about as fast as a short one. Texts up to 900 words stay whole.
export function splitIntoParts(text: string, target = 600, singleMax = 900): string[] {
  if (countWords(text) <= singleMax) return [text];
  const paras = text.split(/(\n\s*\n)/); // keep the separators
  const parts: string[] = [];
  let cur = "";
  for (const piece of paras) {
    if (/^\n\s*\n$/.test(piece)) { cur += piece; continue; }
    if (cur.trim() && countWords(cur) + countWords(piece) > target) {
      parts.push(cur.trim());
      cur = "";
    }
    cur += piece;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

// Em dashes, and spaced en dashes, become commas (a dash after a period, as in a dateline, becomes a space).
// Number ranges like 2020–2022 stay as they are.
const noDashes = (s: string) =>
  s.replace(/\.\s*[—–]\s+/g, ". ").replace(/\s*—\s*/g, ", ").replace(/\s+–\s+/g, ", ");

// ---------------------------------------------------------------------------------------------
// Fact guard: names and numbers in the rewrite that are not in the original, and quotes that changed.

const MARKER_RE = /\[Add:[^\]]*\]/g;
const norm = (s: string) => s.toLowerCase().replace(/[‘’]/g, "'").replace(/[“”]/g, '"');

// Capitalized words in the middle of a sentence (likely names), and numbers. Headings are skipped.
function namesAndNumbers(text: string): { names: Set<string>; numbers: Set<string> } {
  const names = new Set<string>();
  const numbers = new Set<string>();
  const body = text
    .replace(MARKER_RE, " ")
    .split("\n")
    .filter((l) => !/^\s*(#|\*\*[^*]+\*\*\s*$|\|)/.test(l))
    .join("\n");
  for (const m of body.matchAll(/(?<=[A-Za-z,;:]\s)[A-Z][A-Za-z0-9&.'-]*[A-Za-z0-9]/g)) names.add(m[0].replace(/['’]s$/, ""));
  for (const m of body.matchAll(/\d[\d,.]*\d|\d/g)) numbers.add(m[0].replace(/[.,]$/, ""));
  return { names, numbers };
}

// Direct quotes: 40+ characters on one line, opening after a space or line start, ending with
// punctuation inside the closing mark ("...," or "..."). Text between two scare quotes does not count.
const quotesOf = (text: string) =>
  [...norm(text).matchAll(/(?<=^|[\s(])"([^"\n]{40,}?[.,?!])"/gm)].map((m) => m[1].replace(/\s+/g, " ").trim());

export function factIssues(original: string, rewritten: string): string[] {
  const o = norm(original);
  const issues: string[] = [];
  const { names, numbers } = namesAndNumbers(rewritten);
  const origWords = o.match(/[a-z0-9&'-]+/g) ?? [];
  // A spelling fix (Architecure -> Architecture) is not a new name: same start, similar length.
  const nearMatch = (n: string) => {
    const w = n.toLowerCase();
    return w.length >= 6 && origWords.some((x) => x.slice(0, 5) === w.slice(0, 5) && Math.abs(x.length - w.length) <= 2);
  };
  const newNames = [...names].filter((n) => !o.includes(n.toLowerCase()) && !nearMatch(n));
  const newNumbers = [...numbers].filter((n) => !o.includes(n.toLowerCase()) && !o.includes(n.replace(/,/g, "")));
  if (newNames.length) issues.push(`Names not in the original: ${newNames.slice(0, 12).join(", ")}`);
  if (newNumbers.length) issues.push(`Numbers not in the original: ${newNumbers.slice(0, 12).join(", ")}`);
  const r = norm(rewritten).replace(/\s+/g, " ");
  const lost = quotesOf(original).filter((q) => !r.includes(q));
  if (lost.length) issues.push(`Quotes changed or removed (keep them word for word): ${lost.map((q) => `"${q.slice(0, 80)}..."`).join(" ")}`);
  return issues;
}

// Keep the "input needed" list in step with the markers that are really in the text.
function syncMarkers(text: string, listed: InputNeeded[]): InputNeeded[] {
  const inText = text.match(MARKER_RE) ?? [];
  const out: InputNeeded[] = [];
  for (const marker of inText) {
    if (out.some((n) => n.marker === marker)) continue;
    const l = listed.find((n) => n.marker.trim() === marker);
    out.push({ marker, why: l?.why ?? "A real detail here makes the text more specific and credible." });
  }
  return out;
}

type PartResult = { rewritten: string; changes: Change[]; inputNeeded: InputNeeded[] };

type PartOpts = {
  part: string; index: number; total: number; opening: string; outline: string; goal: Goal; keyword: string; contentLabel: string; weaknesses: Weakness[];
  canRepair: () => boolean;
};

async function callRewrite(content: string): Promise<PartResult> {
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 6000,
    temperature: 0.2,
    system: REWRITE_SYSTEM,
    tools: [REWRITE_TOOL],
    tool_choice: { type: "tool", name: REWRITE_TOOL.name },
    messages: [{ role: "user", content }],
  });
  const block = msg.content.find((b) => b.type === "tool_use");
  if (!block || block.type !== "tool_use") throw new Error("No rewrite returned");
  const input = block.input as Partial<PartResult>;
  if (typeof input.rewritten !== "string" || !input.rewritten.trim()) throw new Error("Empty rewrite");
  const str = (v: unknown, max: number) => String(v ?? "").slice(0, max);
  return {
    // Safety net for rule 6: replace any dash punctuation the model still used.
    rewritten: noDashes(input.rewritten).trim(),
    changes: (Array.isArray(input.changes) ? input.changes : []).slice(0, 10).map((c) => ({
      before: str(c?.before, 400), after: noDashes(str(c?.after, 600)), reason: str(c?.reason, 200), kind: str(c?.kind, 30),
    })),
    inputNeeded: (Array.isArray(input.inputNeeded) ? input.inputNeeded : []).slice(0, 3).map((n) => ({ marker: str(n?.marker, 200), why: str(n?.why, 200) })),
  };
}

async function rewritePart(opts: PartOpts): Promise<PartResult & { warnings: string[] }> {
  const { part, index, total, opening, outline, goal, keyword, contentLabel, weaknesses } = opts;
  const weak = weaknesses.length
    ? `The AI-detection analysis flagged these weak writing signals (0 = AI-like, 100 = human-like). Fix them by changing wording only, never by adding facts, opinions or feelings:\n${weaknesses.map((w) => `- ${w.factor} (${w.score}): ${w.note}`).join("\n")}`
    : "";
  const position =
    total > 1
      ? `This is part ${index + 1} of ${total} of a longer text. Rewrite only this part.${
          outline ? `\nHeadings of the full text, for consistency (keep the same heading levels and numbering style):\n${outline}` : ""
        }${
          index > 0 ? `\nIt is not the start of the text, so do not add an opening answer, introduction or conclusion.\nOpening of the full text, for context only (do not rewrite it):\n"""${opening}"""` : ""
        }`
      : "";
  const target = keyword ? `Target ${goal === "aeo" ? "question or keyword" : "keyword"}: ${keyword}` : "No target keyword given.";

  const prompt = [GOAL_BRIEF[goal], target, `Content type: ${contentLabel}.`, weak, position, `Text to rewrite:\n"""\n${part}\n"""`]
    .filter(Boolean)
    .join("\n\n");
  let out = await callRewrite(prompt);
  let issues = factIssues(part, out.rewritten);
  // One repair pass when the guard finds added names or numbers, or changed quotes (if time allows).
  if (issues.length && opts.canRepair()) {
    try {
      const fixed = await callRewrite(
        `${prompt}\n\nYour previous rewrite broke the rules. Problems found:\n${issues.map((i) => `- ${i}`).join("\n")}\n\nPrevious rewrite:\n"""\n${out.rewritten}\n"""\n\nReturn a corrected rewrite of the original text. Remove anything not in the original and restore quotes word for word.`
      );
      const fixedIssues = factIssues(part, fixed.rewritten);
      if (fixedIssues.length <= issues.length) { out = fixed; issues = fixedIssues; }
    } catch { /* keep the first rewrite and show the warnings */ }
  }
  return { ...out, inputNeeded: syncMarkers(out.rewritten, out.inputNeeded), warnings: issues };
}

export async function rewrite(
  text: string,
  opts: { goal: Goal; keyword: string; contentLabel: string; weaknesses: Weakness[]; onProgress?: (done: number, total: number) => void; repairUntil?: number }
): Promise<PartResult & { warnings: string[] }> {
  const parts = splitIntoParts(text);
  const opening = parts[0].slice(0, 600);
  const headings = text.split("\n").filter((l) => /^#{1,6}\s/.test(l.trim()));
  const outline = parts.length > 1 ? headings.slice(0, 40).join("\n") : "";
  const canRepair = () => Date.now() < (opts.repairUntil ?? Infinity);
  let done = 0;
  opts.onProgress?.(0, parts.length);
  const results = await Promise.all(
    parts.map((part, index) =>
      rewritePart({ ...opts, part, index, total: parts.length, opening, outline, canRepair }).then((r) => {
        opts.onProgress?.(++done, parts.length);
        return r;
      })
    )
  );
  return {
    rewritten: results.map((r) => r.rewritten).join("\n\n"),
    changes: results.flatMap((r) => r.changes),
    inputNeeded: results.flatMap((r) => r.inputNeeded),
    warnings: results.flatMap((r) => r.warnings),
  };
}

// Factors an editor can improve by changing wording alone. The others (voice, emotion, anecdotes,
// opinions, thinking out loud) can only rise if facts or feelings are invented, so they are not in the brief.
const STYLE_FACTORS = new Set([
  "Sentence Length Variation", "Transitional Phrase Overuse", "Predictable List Structures", "Paragraph Length Consistency",
  "AI Filler Phrases", "Hedging Language Overuse", "Lack of Contractions", "Generic vs Specific Language",
  "Over-Explicitness", "Register Shifts",
]);

// The weakest style factors from an analysis result, used as the rewrite brief.
export function weakestFactors(result: unknown, max = 8): Weakness[] {
  const sections = (result as { sections?: unknown })?.sections;
  if (!Array.isArray(sections)) return [];
  const out: Weakness[] = [];
  for (const s of sections) {
    if (!s || (s as { applicable?: boolean }).applicable === false) continue;
    for (const f of ((s as { factors?: unknown[] }).factors ?? []) as { name?: unknown; score?: unknown; applicable?: boolean; explanation?: unknown }[]) {
      if (!f || f.applicable === false || typeof f.name !== "string" || typeof f.score !== "number" || f.score >= 60) continue;
      if (!STYLE_FACTORS.has(f.name)) continue;
      const note = Array.isArray(f.explanation) ? f.explanation.map(String).join(" ") : "";
      out.push({ factor: f.name.slice(0, 60), score: Math.round(f.score), note: note.slice(0, 300) });
    }
  }
  return out.sort((a, b) => a.score - b.score).slice(0, max);
}

// ---------------------------------------------------------------------------------------------
// Search & AI-answer readiness: model rubric (65%) + code checks (35%). A checklist, not a ranking forecast.

const READINESS_TOOL: Anthropic.Tool = {
  name: "record_readiness",
  description: "Score the text against each criterion.",
  input_schema: {
    type: "object",
    properties: {
      criteria: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            score: { type: "number", minimum: 0, maximum: 10 },
            note: { type: "string", description: "One short sentence (max 20 words) with evidence from the text." },
          },
          required: ["name", "score", "note"],
        },
      },
    },
    required: ["criteria"],
  },
};

const CRITERIA: { name: string; desc: string }[] = [
  { name: "Answer first", desc: "The opening directly answers the main question or states the main point. No warm-up." },
  { name: "Quotable passages", desc: "Paragraphs make sense on their own when quoted alone (subject named, no dangling 'it' or 'this')." },
  { name: "Clear structure", desc: "Descriptive headings, lists or steps where they help a reader scan. Score short texts on paragraph clarity." },
  { name: "Specific facts", desc: "Concrete entities, numbers, names and definitions instead of vague claims." },
  { name: "Topic coverage", desc: "Covers the obvious follow-up questions a searcher would have on this topic." },
  { name: "Trust signals", desc: "Shows first-hand experience, sources, dates or credentials that make it credible to cite." },
];

const scale = (v: number, lo: number, hi: number) => Math.max(0, Math.min(10, ((v - lo) / (hi - lo)) * 10));

export async function judgeReadiness(text: string, keyword: string): Promise<Readiness> {
  const m = contentMetrics(text, keyword);
  const code: ReadinessCheck[] = [
    { label: "Readability", score: Math.round(scale(m.readingEase, 30, 60)), note: `Reading ease ${m.readingEase}, about grade ${m.gradeLevel}.`, source: "code" },
    { label: "Sentence length", score: Math.round(scale(m.avgSentenceLength, 30, 18)), note: `Average ${m.avgSentenceLength} words per sentence, ${m.longSentences} over 30 words.`, source: "code" },
  ];
  if (m.words >= 250) {
    const s = m.headings > 0 ? (m.listItems > 0 || m.questionHeadings > 0 ? 10 : 7) : m.listItems > 0 ? 5 : 2;
    code.push({ label: "Scannable layout", score: s, note: `${m.headings} heading${m.headings === 1 ? "" : "s"}, ${m.questionHeadings} as questions, ${m.listItems} list item${m.listItems === 1 ? "" : "s"}.`, source: "code" });
  }
  if (m.keyword) {
    const s = (m.keyword.inFirst100Words ? 5 : 0) + (m.keyword.inHeading ? 5 : 0);
    code.push({
      label: "Keyword placement",
      score: s,
      note: `"${m.keyword.term}" ${m.keyword.inFirst100Words ? "is" : "is not"} in the first 100 words and ${m.keyword.inHeading ? "is" : "is not"} in a heading.`,
      source: "code",
    });
  }

  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 900,
    temperature: 0,
    tools: [READINESS_TOOL],
    tool_choice: { type: "tool", name: READINESS_TOOL.name },
    messages: [
      {
        role: "user",
        content: `Score how well this text works as a source for search engines and AI answer engines. Use 0-10 per criterion (10 = excellent). Judge only what is in the text.${
          keyword ? ` The target keyword or question is: ${keyword}` : ""
        }\n\nCriteria (use these exact names):\n${CRITERIA.map((c) => `- ${c.name}: ${c.desc}`).join("\n")}\n\nText:\n---\n${text.slice(0, 24000)}\n---`,
      },
    ],
  });
  const block = msg.content.find((b) => b.type === "tool_use");
  const got = ((block && block.type === "tool_use" ? block.input : {}) as { criteria?: { name?: string; score?: number; note?: string }[] }).criteria ?? [];
  const byName = new Map(got.map((c) => [String(c.name ?? "").trim().toLowerCase(), c]));
  const model: ReadinessCheck[] = CRITERIA.map((c, i) => {
    const g = byName.get(c.name.toLowerCase()) ?? got[i] ?? {};
    return { label: c.name, score: Math.round(Math.max(0, Math.min(10, Number(g.score) || 0))), note: String(g.note ?? "").slice(0, 200), source: "model" as const };
  });

  const avg = (xs: ReadinessCheck[]) => xs.reduce((n, c) => n + c.score, 0) / xs.length;
  const score = Math.round(10 * (0.65 * avg(model) + 0.35 * avg(code)));
  return { score, checks: [...model, ...code] };
}

// ---------------------------------------------------------------------------------------------
// Re-check token: proves this exact text came from a paid-for optimize run, so /api/analyze can
// score it once without charging again. Valid 15 minutes, for the same visitor, single use.

export type RecheckPayload = { id: string; h: string; exp: number; sub: string; p: string | null; g: Goal; k: string };

function signingKey(): string {
  const base = env("OPTIMIZE_TOKEN_SECRET") || env("SUPABASE_SERVICE_ROLE_KEY") || env("ANTHROPIC_API_KEY") || "";
  return createHash("sha256").update(`ct-recheck:${base}`).digest("hex");
}

export const textHash = (text: string) => createHash("sha256").update(text).digest("hex");

export function signRecheck(p: Omit<RecheckPayload, "id" | "exp">): string {
  const payload: RecheckPayload = { ...p, id: randomBytes(9).toString("hex"), exp: Date.now() + 15 * 60_000 };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", signingKey()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyRecheck(token: unknown, text: string, sub: string): RecheckPayload | null {
  if (typeof token !== "string" || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  const expected = createHmac("sha256", signingKey()).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString()) as RecheckPayload;
    if (p.exp < Date.now() || p.h !== textHash(text) || p.sub !== sub || !isGoal(p.g)) return null;
    return p;
  } catch {
    return null;
  }
}

// The visitor a token belongs to: the signed-in user, or the anonymous browser ID.
export const subjectOf = (id: { userId: string | null; anonId: string }) => (id.userId ? `u:${id.userId}` : `a:${id.anonId}`);
