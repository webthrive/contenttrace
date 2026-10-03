// Content type profiles. Each type changes section weights and marks factors
// that a genre does not normally show as N/A (excluded from the score).
// Shared by the API route and the UI selector.

export const CONTENT_TYPE_IDS = [
  "general",
  "personal_blog",
  "thought_leadership",
  "company_blog",
  "corporate",
  "technical",
  "academic",
  "marketing",
  "social",
  "email",
] as const;

export type ContentTypeId = (typeof CONTENT_TYPE_IDS)[number];

type SectionName =
  | "Structure & Flow"
  | "Word Choice & Phrasing"
  | "Voice & Perspective"
  | "Content & Logic"
  | "Cognitive Fingerprinting"
  | "Emotional Texture"
  | "Pragmatics & Subtext"
  | "Statistical Proxies";

// Calibration: raw scores differ a lot by genre. Formal human writing scores much lower than
// personal human writing. Anchors are the median raw scores of known human and known AI samples
// from the September 2026 evaluation run (137 samples). Displayed score = 25 at the AI anchor,
// 75 at the human anchor. Re-run the evaluation and update these when the scoring changes.
export type CalibrationGroup = "formal" | "business" | "personal" | "general";
export const CALIBRATION: Record<CalibrationGroup, { ai: number; human: number }> = {
  formal: { ai: 19.6, human: 42.2 },
  // Company blogs, thought leadership, marketing: between formal and personal (Oct 2026 run, 19 samples).
  business: { ai: 30.5, human: 52.7 },
  personal: { ai: 36.9, human: 74.8 },
  // General (chat or Q&A replies, and mixed or unclear genre): the mean of the three
  // measured groups. Provisional until a General test set exists. Before Oct 2026 General used the
  // formal anchors, which made casual AI text (raw 54+) show as 100.
  general: { ai: 29.0, human: 56.6 },
};

// Displayed scores stay inside this range: no detector can be 100% certain either way.
export const SCORE_FLOOR = 2;
export const SCORE_CEILING = 98;

export function calibrate(raw: number, group: CalibrationGroup): number {
  const a = CALIBRATION[group];
  const v = 25 + (50 * (raw - a.ai)) / (a.human - a.ai);
  return Math.max(SCORE_FLOOR, Math.min(SCORE_CEILING, v));
}

export type ContentProfile = {
  id: ContentTypeId;
  label: string;
  description: string; // used by the auto-detect prompt
  note: string; // shown in results: why scoring is adjusted for this type
  group: CalibrationGroup; // which calibration anchors apply
  weights: Record<SectionName, number>; // 0 = whole section N/A
  naFactors: string[];
};

const BASE: Record<SectionName, number> = {
  "Structure & Flow": 0.12,
  "Word Choice & Phrasing": 0.15,
  "Voice & Perspective": 0.14,
  "Content & Logic": 0.13,
  "Cognitive Fingerprinting": 0.16,
  "Emotional Texture": 0.12,
  "Pragmatics & Subtext": 0.1,
  "Statistical Proxies": 0.08,
};

const w = (o: Partial<Record<SectionName, number>>) => ({ ...BASE, ...o });

export const CONTENT_PROFILES: Record<ContentTypeId, ContentProfile> = {
  general: {
    id: "general",
    group: "general",
    label: "General",
    description: "A reply that answers or explains something someone asked, as in a chat with an AI assistant or a Q&A answer (even on a technical topic). Also mixed or unclear genre.",
    note: "Standard weights. No signals are excluded.",
    weights: BASE,
    naFactors: [],
  },
  personal_blog: {
    id: "personal_blog",
    group: "personal",
    label: "Personal blog / essay",
    description: "First-person blog post, personal essay, newsletter, or story about the author's own experience, written as 'I'.",
    note: "First-person writing is expected here, so voice, personal stories, and emotional texture carry more weight.",
    weights: w({ "Structure & Flow": 0.1, "Word Choice & Phrasing": 0.14, "Voice & Perspective": 0.18, "Content & Logic": 0.1, "Emotional Texture": 0.16, "Statistical Proxies": 0.06 }),
    naFactors: [],
  },
  thought_leadership: {
    id: "thought_leadership",
    group: "business",
    label: "Thought leadership / opinion",
    description: "Opinion piece, LinkedIn article, op-ed, or expert commentary that argues a point of view.",
    note: "Opinion writing should show a clear point of view and strong reasoning, so those signals carry more weight. Personal vulnerability is not expected.",
    weights: w({ "Structure & Flow": 0.1, "Voice & Perspective": 0.18, "Content & Logic": 0.18, "Cognitive Fingerprinting": 0.14, "Emotional Texture": 0.07 }),
    naFactors: ["Vulnerability Present"],
  },
  company_blog: {
    id: "company_blog",
    group: "business",
    label: "Company blog / brand article",
    description: "Blog post or article published by a company or brand, written in a 'we' or neutral voice for customers. Not about one author's own life. Choose this over personal_blog when the text speaks for a business.",
    note: "Company blog posts speak for a brand, so they rarely include one person's stories, vulnerability, or self-correction. We do not count these first-person signals against the text. Specific detail, real insight, and natural phrasing carry more weight.",
    weights: w({ "Structure & Flow": 0.12, "Word Choice & Phrasing": 0.18, "Voice & Perspective": 0.1, "Content & Logic": 0.22, "Cognitive Fingerprinting": 0.1, "Emotional Texture": 0.04, "Pragmatics & Subtext": 0.1, "Statistical Proxies": 0.14 }),
    naFactors: ["Personal Anecdotes Present", "Vulnerability Present", "Opinion Drift / Self-Correction", "Thinking Out Loud"],
  },
  corporate: {
    id: "corporate",
    group: "formal",
    label: "Corporate / white paper",
    description: "White paper, report, case study, press release, or formal business content written for a company.",
    note: "Formal business writing normally has no personal stories, emotion, or thinking out loud. We do not count these against the text. Specificity, evidence, and phrasing carry more weight.",
    weights: w({ "Structure & Flow": 0.14, "Word Choice & Phrasing": 0.2, "Voice & Perspective": 0.08, "Content & Logic": 0.26, "Cognitive Fingerprinting": 0.08, "Emotional Texture": 0, "Pragmatics & Subtext": 0.08, "Statistical Proxies": 0.16 }),
    naFactors: ["Personal Anecdotes Present", "Emotional Authenticity", "Opinion Drift / Self-Correction", "Thinking Out Loud", "Irony or Dry Humor"],
  },
  technical: {
    id: "technical",
    group: "formal",
    label: "Technical / documentation",
    description: "Standalone documentation, how-to guide, FAQ, specification, or tutorial written for a product, project, or reference site. Not a reply to someone's question in a chat or forum (use general).",
    note: "Documentation is written to be neutral and exact. Personal voice, opinions, and emotion are not expected, so we do not count them. Accuracy, specificity, and phrasing carry more weight.",
    weights: w({ "Structure & Flow": 0.14, "Word Choice & Phrasing": 0.22, "Voice & Perspective": 0.05, "Content & Logic": 0.28, "Cognitive Fingerprinting": 0.06, "Emotional Texture": 0, "Pragmatics & Subtext": 0.07, "Statistical Proxies": 0.18 }),
    naFactors: ["Personal Anecdotes Present", "Emotional Authenticity", "Opinion Strength", "Opinion Drift / Self-Correction", "Thinking Out Loud", "Cognitive Bias Presence", "Irony or Dry Humor"],
  },
  academic: {
    id: "academic",
    group: "formal",
    label: "Academic / student essay",
    description: "School or university essay, research paper, thesis, or academic article.",
    note: "Academic writing is formal and rarely personal. Personal stories, vulnerability, and humor are not expected. Argument quality and phrasing carry more weight.",
    weights: w({ "Structure & Flow": 0.14, "Word Choice & Phrasing": 0.18, "Voice & Perspective": 0.12, "Content & Logic": 0.24, "Cognitive Fingerprinting": 0.12, "Emotional Texture": 0.04, "Pragmatics & Subtext": 0.06, "Statistical Proxies": 0.1 }),
    naFactors: ["Personal Anecdotes Present", "Vulnerability Present", "Irony or Dry Humor"],
  },
  marketing: {
    id: "marketing",
    group: "business",
    label: "Marketing / web copy",
    description: "Landing page, product description, ad copy, sales page, or promotional web content.",
    note: "Marketing copy is written to persuade, not to reflect. Self-correction and thinking out loud are not expected. Phrasing and specific claims carry more weight.",
    weights: w({ "Word Choice & Phrasing": 0.22, "Content & Logic": 0.16, "Cognitive Fingerprinting": 0.06, "Emotional Texture": 0.1, "Statistical Proxies": 0.1 }),
    naFactors: ["Opinion Drift / Self-Correction", "Thinking Out Loud", "Vulnerability Present"],
  },
  social: {
    id: "social",
    group: "personal",
    label: "Social post",
    description: "Social media post (LinkedIn, X, Facebook) or a short casual comment. A comment that mainly explains an answer to a question is general.",
    note: "Social posts are short and informal. Paragraph structure and complete arguments are not expected. Voice and tone carry more weight.",
    weights: w({ "Structure & Flow": 0.08, "Word Choice & Phrasing": 0.16, "Voice & Perspective": 0.18, "Content & Logic": 0.08, "Cognitive Fingerprinting": 0.14, "Emotional Texture": 0.16, "Pragmatics & Subtext": 0.14, "Statistical Proxies": 0.06 }),
    naFactors: ["Paragraph Length Consistency", "Argument Completeness"],
  },
  email: {
    id: "email",
    group: "personal",
    label: "Email / letter",
    description: "Email, cover letter, or personal or business letter to a specific reader.",
    note: "Emails are short and written to one reader. Paragraph structure is not scored. Tone, directness, and phrasing carry more weight.",
    weights: w({ "Structure & Flow": 0.1, "Word Choice & Phrasing": 0.2, "Voice & Perspective": 0.16, "Content & Logic": 0.12, "Cognitive Fingerprinting": 0.1, "Pragmatics & Subtext": 0.14, "Statistical Proxies": 0.06 }),
    naFactors: ["Paragraph Length Consistency"],
  },
};

export function isContentTypeId(v: unknown): v is ContentTypeId {
  return typeof v === "string" && (CONTENT_TYPE_IDS as readonly string[]).includes(v);
}

// Options for the UI selector ("auto" is added by the UI).
export const CONTENT_TYPE_OPTIONS = CONTENT_TYPE_IDS.filter((id) => id !== "general").map((id) => ({
  id,
  label: CONTENT_PROFILES[id].label,
}));
