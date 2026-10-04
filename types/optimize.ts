// Content Optimizer types shared by the browser components (the server has matching types in lib/optimizer.ts).
// "readability" is shown to users as "Humanize". The id stays the same so saved history keeps working.
export type OptimizeGoal = "readability" | "seo" | "aeo";
export type OptimizeChange = { before: string; after: string; reason: string; kind: string };
export type OptimizeInputNeeded = { marker: string; why: string };
export type ReadinessCheck = { label: string; score: number; note: string; source: "model" | "code" };
export type Readiness = { score: number; checks: ReadinessCheck[] };

// Saved with the re-check in the user's history (result.optimization).
export type OptimizationRecord = {
  goal: OptimizeGoal;
  keyword: string;
  parentId: string | null;
  originalText: string;
  changes: OptimizeChange[];
  inputNeeded: OptimizeInputNeeded[];
  warnings?: string[];
  before: { score: number; verdict: string; readiness: Readiness | null };
  readinessAfter: Readiness | null;
};

export const GOAL_LABELS: Record<OptimizeGoal, { label: string; short: string; desc: string }> = {
  readability: { label: "Humanize", short: "Humanize", desc: "Make AI drafts read like a person wrote them. Plain words, varied sentences, no AI filler." },
  seo: { label: "SEO", short: "SEO", desc: "Humanize plus descriptive headings, the main point early, and your keyword placed naturally." },
  aeo: { label: "AI answers (AEO)", short: "AI answers", desc: "Humanize plus a direct answer up top, question headings and quotable passages for AI Overviews, ChatGPT and Perplexity." },
};
