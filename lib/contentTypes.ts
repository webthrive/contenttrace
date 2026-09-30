// Content type profiles. Each type changes section weights and marks factors
// that a genre does not normally show as N/A (excluded from the score).
// Shared by the API route and the UI selector.

export const CONTENT_TYPE_IDS = [
  "general",
  "personal_blog",
  "thought_leadership",
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

export type ContentProfile = {
  id: ContentTypeId;
  label: string;
  description: string; // used by the auto-detect prompt
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
    label: "General",
    description: "Mixed or unclear genre. Use only if no other type fits.",
    weights: BASE,
    naFactors: [],
  },
  personal_blog: {
    id: "personal_blog",
    label: "Personal blog / essay",
    description: "First-person blog post, personal essay, newsletter, or story about the author's own experience.",
    weights: w({ "Structure & Flow": 0.1, "Word Choice & Phrasing": 0.14, "Voice & Perspective": 0.18, "Content & Logic": 0.1, "Emotional Texture": 0.16, "Statistical Proxies": 0.06 }),
    naFactors: [],
  },
  thought_leadership: {
    id: "thought_leadership",
    label: "Thought leadership / opinion",
    description: "Opinion piece, LinkedIn article, op-ed, or expert commentary that argues a point of view.",
    weights: w({ "Structure & Flow": 0.1, "Voice & Perspective": 0.18, "Content & Logic": 0.18, "Cognitive Fingerprinting": 0.14, "Emotional Texture": 0.07 }),
    naFactors: ["Vulnerability Present"],
  },
  corporate: {
    id: "corporate",
    label: "Corporate / white paper",
    description: "White paper, report, case study, press release, or formal business content written for a company.",
    weights: w({ "Structure & Flow": 0.14, "Word Choice & Phrasing": 0.2, "Voice & Perspective": 0.08, "Content & Logic": 0.26, "Cognitive Fingerprinting": 0.08, "Emotional Texture": 0, "Pragmatics & Subtext": 0.08, "Statistical Proxies": 0.16 }),
    naFactors: ["Personal Anecdotes Present", "Emotional Authenticity", "Opinion Drift / Self-Correction", "Thinking Out Loud", "Irony or Dry Humor"],
  },
  technical: {
    id: "technical",
    label: "Technical / documentation",
    description: "Documentation, how-to guide, FAQ, specification, tutorial, or technical explainer.",
    weights: w({ "Structure & Flow": 0.14, "Word Choice & Phrasing": 0.22, "Voice & Perspective": 0.05, "Content & Logic": 0.28, "Cognitive Fingerprinting": 0.06, "Emotional Texture": 0, "Pragmatics & Subtext": 0.07, "Statistical Proxies": 0.18 }),
    naFactors: ["Personal Anecdotes Present", "Emotional Authenticity", "Opinion Strength", "Opinion Drift / Self-Correction", "Thinking Out Loud", "Cognitive Bias Presence", "Irony or Dry Humor"],
  },
  academic: {
    id: "academic",
    label: "Academic / student essay",
    description: "School or university essay, research paper, thesis, or academic article.",
    weights: w({ "Structure & Flow": 0.14, "Word Choice & Phrasing": 0.18, "Voice & Perspective": 0.12, "Content & Logic": 0.24, "Cognitive Fingerprinting": 0.12, "Emotional Texture": 0.04, "Pragmatics & Subtext": 0.06, "Statistical Proxies": 0.1 }),
    naFactors: ["Personal Anecdotes Present", "Vulnerability Present", "Irony or Dry Humor"],
  },
  marketing: {
    id: "marketing",
    label: "Marketing / web copy",
    description: "Landing page, product description, ad copy, sales page, or promotional web content.",
    weights: w({ "Word Choice & Phrasing": 0.22, "Content & Logic": 0.16, "Cognitive Fingerprinting": 0.06, "Emotional Texture": 0.1, "Statistical Proxies": 0.1 }),
    naFactors: ["Opinion Drift / Self-Correction", "Thinking Out Loud", "Vulnerability Present"],
  },
  social: {
    id: "social",
    label: "Social post",
    description: "Short social media post (LinkedIn, X, Facebook, Reddit comment) or forum reply.",
    weights: w({ "Structure & Flow": 0.08, "Word Choice & Phrasing": 0.16, "Voice & Perspective": 0.18, "Content & Logic": 0.08, "Cognitive Fingerprinting": 0.14, "Emotional Texture": 0.16, "Pragmatics & Subtext": 0.14, "Statistical Proxies": 0.06 }),
    naFactors: ["Paragraph Length Consistency", "Argument Completeness"],
  },
  email: {
    id: "email",
    label: "Email / letter",
    description: "Email, cover letter, or personal or business letter to a specific reader.",
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
