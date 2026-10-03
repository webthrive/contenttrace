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
Rules:
1. Keep the meaning, facts, claims, numbers, names, links and the author's position. Write in the same language as the original.
2. Never invent facts, statistics, sources, quotes, names, dates, products or personal experiences. Where a real detail would make the text stronger (an example from the author's own work, a number, a source), insert a short marker in square brackets, for example [Add: a real example of a client result]. Use at most 3 markers per part, and report each one in inputNeeded.
3. Do not use em dashes or en dashes as punctuation. Use commas, periods, colons or parentheses.
4. Avoid patterns typical of AI assistants: "Here's...", "Great question", "It's not X, it's Y", "not just X, but Y", groups of three everywhere, "delve", "landscape", "in today's fast-paced world", "it's important to note", "moreover", "furthermore", a closing offer to help more, empathy with no specific detail, and safe conclusions that weigh both sides without committing.
5. Vary sentence length: mix short sentences with longer ones. Prefer concrete, specific words over generic ones. Use contractions where the register allows. Keep a clear point of view where the original has one.
6. Keep the register right for the content type. Do not make a formal document chatty.
7. Keep the formatting style. If the original uses markdown, keep markdown. New headings use "## " unless the original uses another heading style.
8. Keep the length between about 80% and 120% of the original.
9. In changes, list the most important edits (at most 10). For each: a short exact excerpt of the original (max 20 words), the new version, and the reason in plain English (max 15 words).
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

// Long texts are rewritten in parallel parts of about 350 words, split at paragraph breaks,
// so a 5,000-word text finishes about as fast as a short one.
export function splitIntoParts(text: string, target = 350, singleMax = 600): string[] {
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

// Em dashes, and spaced en dashes, become commas. Number ranges like 2020–2022 stay as they are.
const noDashes = (s: string) => s.replace(/\s*—\s*/g, ", ").replace(/\s+–\s+/g, ", ");

type PartResult = { rewritten: string; changes: Change[]; inputNeeded: InputNeeded[] };

async function rewritePart(opts: {
  part: string; index: number; total: number; opening: string; goal: Goal; keyword: string; contentLabel: string; weaknesses: Weakness[];
}): Promise<PartResult> {
  const { part, index, total, opening, goal, keyword, contentLabel, weaknesses } = opts;
  const weak = weaknesses.length
    ? `The AI-detection analysis flagged these weak signals (0 = AI-like, 100 = human-like). Fix them where the goal allows:\n${weaknesses.map((w) => `- ${w.factor} (${w.score}): ${w.note}`).join("\n")}`
    : "";
  const position =
    total > 1
      ? `This is part ${index + 1} of ${total} of a longer text. Rewrite only this part.${
          index > 0 ? ` It is not the start of the text, so do not add an opening answer or introduction.\nOpening of the full text, for context only (do not rewrite it):\n"""${opening}"""` : ""
        }`
      : "";
  const target = keyword ? `Target ${goal === "aeo" ? "question or keyword" : "keyword"}: ${keyword}` : "No target keyword given.";

  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 4000,
    temperature: 0.4,
    system: REWRITE_SYSTEM,
    tools: [REWRITE_TOOL],
    tool_choice: { type: "tool", name: REWRITE_TOOL.name },
    messages: [
      {
        role: "user",
        content: [GOAL_BRIEF[goal], target, `Content type: ${contentLabel}.`, weak, position, `Text to rewrite:\n"""\n${part}\n"""`]
          .filter(Boolean)
          .join("\n\n"),
      },
    ],
  });
  const block = msg.content.find((b) => b.type === "tool_use");
  if (!block || block.type !== "tool_use") throw new Error("No rewrite returned");
  const input = block.input as Partial<PartResult>;
  if (typeof input.rewritten !== "string" || !input.rewritten.trim()) throw new Error("Empty rewrite");
  const str = (v: unknown, max: number) => String(v ?? "").slice(0, max);
  return {
    // Safety net for rule 3: replace any dash punctuation the model still used.
    rewritten: noDashes(input.rewritten).trim(),
    changes: (Array.isArray(input.changes) ? input.changes : []).slice(0, 10).map((c) => ({
      before: str(c?.before, 400), after: noDashes(str(c?.after, 600)), reason: str(c?.reason, 200), kind: str(c?.kind, 30),
    })),
    inputNeeded: (Array.isArray(input.inputNeeded) ? input.inputNeeded : []).slice(0, 3).map((n) => ({ marker: str(n?.marker, 200), why: str(n?.why, 200) })),
  };
}

export async function rewrite(
  text: string,
  opts: { goal: Goal; keyword: string; contentLabel: string; weaknesses: Weakness[]; onProgress?: (done: number, total: number) => void }
): Promise<PartResult> {
  const parts = splitIntoParts(text);
  const opening = parts[0].slice(0, 600);
  let done = 0;
  opts.onProgress?.(0, parts.length);
  const results = await Promise.all(
    parts.map((part, index) =>
      rewritePart({ ...opts, part, index, total: parts.length, opening }).then((r) => {
        opts.onProgress?.(++done, parts.length);
        return r;
      })
    )
  );
  return {
    rewritten: results.map((r) => r.rewritten).join("\n\n"),
    changes: results.flatMap((r) => r.changes),
    inputNeeded: results.flatMap((r) => r.inputNeeded),
  };
}

// The weakest scored factors from an analysis result, used as the rewrite brief.
export function weakestFactors(result: unknown, max = 8): Weakness[] {
  const sections = (result as { sections?: unknown })?.sections;
  if (!Array.isArray(sections)) return [];
  const out: Weakness[] = [];
  for (const s of sections) {
    if (!s || (s as { applicable?: boolean }).applicable === false) continue;
    for (const f of ((s as { factors?: unknown[] }).factors ?? []) as { name?: unknown; score?: unknown; applicable?: boolean; explanation?: unknown }[]) {
      if (!f || f.applicable === false || typeof f.name !== "string" || typeof f.score !== "number" || f.score >= 60) continue;
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
