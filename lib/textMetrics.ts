// Deterministic text metrics, computed in code (instant, same result every run).
// Scores use the same 0-10 scale as the model (0 = AI-like, 10 = human-like).

export type RawFactor = { name: string; score: number; explanation: string[] };

export type TextMetrics = {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  avgSentenceLength: number;
  sentenceLengthCV: number;
  paragraphLengthCV: number;
  mattr: number;
  surprisalCV: number;
  hedgesPer100: number;
  contractionsPer100: number;
  transitionsPer100: number;
};

const HEDGES = [
  "may", "might", "perhaps", "possibly", "arguably", "generally", "typically",
  "often", "usually", "likely", "potentially", "somewhat", "relatively",
  "it's important to note", "it is important to note", "it's worth noting",
  "it is worth noting", "in many cases", "to some extent", "can be",
];

const TRANSITIONS = [
  "moreover", "furthermore", "additionally", "in addition", "however",
  "therefore", "consequently", "thus", "hence", "in conclusion", "overall",
  "ultimately", "notably", "importantly", "that said", "as a result",
  "on the other hand", "in summary", "to summarize", "first and foremost",
];

const clamp = (n: number, lo = 0, hi = 10) => Math.min(hi, Math.max(lo, n));
const round1 = (n: number) => Math.round(n * 10) / 10;
const pct = (n: number) => `${Math.round(n * 100)}%`;

// Linear map: value at `lo` -> 0, value at `hi` -> 10 (works for inverted ranges too).
const scale = (v: number, lo: number, hi: number) => clamp(((v - lo) / (hi - lo)) * 10);

function words(s: string): string[] {
  return (s.toLowerCase().match(/[a-z0-9']+/g) ?? []).filter(Boolean);
}

function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"“'(])/)
    .map((s) => s.trim())
    .filter((s) => words(s).length > 0);
}

function cv(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  if (mean === 0) return 0;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance) / mean;
}

// Moving-average type-token ratio (stable across text lengths).
function mattr(tokens: string[], window = 50): number {
  if (tokens.length === 0) return 0;
  if (tokens.length <= window) return new Set(tokens).size / tokens.length;
  let total = 0;
  let n = 0;
  for (let i = 0; i + window <= tokens.length; i += 5) {
    total += new Set(tokens.slice(i, i + window)).size / window;
    n++;
  }
  return total / n;
}

function countPhrases(lowerText: string, phrases: string[]): number {
  let count = 0;
  for (const p of phrases) {
    const re = new RegExp(`\\b${p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g");
    count += (lowerText.match(re) ?? []).length;
  }
  return count;
}

export function computeMetrics(text: string): TextMetrics {
  const tokens = words(text);
  const wc = Math.max(tokens.length, 1);
  const sentences = splitSentences(text);
  const sentLens = sentences.map((s) => words(s).length);
  const paragraphs = text.split(/\n\s*\n|\n/).map((p) => p.trim()).filter((p) => words(p).length > 0);
  const paraLens = paragraphs.map((p) => words(p).length);

  // Per-sentence surprisal using the text's own word distribution.
  const freq = new Map<string, number>();
  for (const t of tokens) freq.set(t, (freq.get(t) ?? 0) + 1);
  const surprisals = sentences.map((s) => {
    const w = words(s);
    const sum = w.reduce((acc, t) => acc - Math.log2((freq.get(t) ?? 1) / wc), 0);
    return w.length ? sum / w.length : 0;
  });

  const lower = text.toLowerCase();
  // Contractions only (not possessive 's): n't, 're, 've, 'll, 'd, 'm, plus common 's forms.
  const contractions = (lower.match(/\b([a-z]+n't|[a-z]+'(re|ve|ll|d|m)|(it|that|there|what|he|she|let|here|who)'s)\b/g) ?? []).length;

  return {
    wordCount: tokens.length,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    avgSentenceLength: sentLens.length ? sentLens.reduce((a, b) => a + b, 0) / sentLens.length : 0,
    sentenceLengthCV: cv(sentLens),
    paragraphLengthCV: cv(paraLens),
    mattr: mattr(tokens),
    surprisalCV: cv(surprisals),
    hedgesPer100: (countPhrases(lower, HEDGES) / wc) * 100,
    contractionsPer100: (contractions / wc) * 100,
    transitionsPer100: (countPhrases(lower, TRANSITIONS) / wc) * 100,
  };
}

// The "Statistical Proxies" section, fully computed in code.
export function statisticalFactors(m: TextMetrics): RawFactor[] {
  // Initial thresholds. Calibrate against a labeled test set before relying on them.
  const shortText = m.wordCount < 150 || m.sentenceCount < 6;
  const vocab = shortText ? 5 : scale(m.mattr, 0.7, 0.9);
  const burst = m.sentenceCount < 4 ? 5 : scale(m.sentenceLengthCV, 0.25, 0.75);
  // Heavy hedging is an AI pattern: 0.5 hedges/100 words -> 8, 3.0 -> 1.
  const calib = clamp(8 - ((m.hedgesPer100 - 0.5) / 2.5) * 7, 1, 9);
  const entropy = shortText ? 5 : scale(m.surprisalCV, 0.005, 0.05);
  const shortNote = "Text is short, so this measure is set to neutral (5/10).";

  return [
    {
      name: "Vocabulary Richness",
      score: round1(vocab),
      explanation: [
        `Moving-average type-token ratio is ${m.mattr.toFixed(2)}.`,
        shortText ? shortNote : vocab >= 5
          ? "Word choice varies well; the text does not reuse the same small set of words."
          : "The text reuses a narrow set of words, which is common in generated text.",
      ],
    },
    {
      name: "Burstiness Approximation",
      score: round1(burst),
      explanation: [
        `Sentence length varies by ${pct(m.sentenceLengthCV)} around an average of ${Math.round(m.avgSentenceLength)} words (${m.sentenceCount} sentences).`,
        burst >= 5
          ? "Long and short sentences mix unevenly, which is typical of human writing."
          : "Sentence lengths are uniform. Human writing usually varies by more than 50%.",
      ],
    },
    {
      name: "Response Calibration",
      score: round1(calib),
      explanation: [
        `Hedging phrases appear ${m.hedgesPer100.toFixed(1)} times per 100 words.`,
        calib >= 5
          ? "Claims are stated with direct confidence rather than constant qualifiers."
          : "Frequent qualifiers (may, typically, it's important to note) suggest generated caution.",
      ],
    },
    {
      name: "Entropy Variance",
      score: round1(entropy),
      explanation: [
        `Word predictability varies by ${(m.surprisalCV * 100).toFixed(1)}% from sentence to sentence.`,
        shortText ? shortNote : entropy >= 5
          ? "Some sentences are plain and others dense, an uneven texture typical of people."
          : "Predictability is flat across sentences, a pattern common in model output.",
      ],
    },
  ];
}

// Short summary passed to the model so its structure scores agree with the measured facts.
export function metricsBrief(m: TextMetrics): string {
  return [
    `Measured facts (computed in code — trust these over estimation):`,
    `- ${m.wordCount} words, ${m.sentenceCount} sentences, ${m.paragraphCount} paragraphs`,
    `- Sentence length: average ${Math.round(m.avgSentenceLength)} words, variation ${pct(m.sentenceLengthCV)}`,
    `- Paragraph length variation: ${pct(m.paragraphLengthCV)}`,
    `- Contractions: ${m.contractionsPer100.toFixed(1)} per 100 words`,
    `- Transition phrases (moreover, furthermore, however...): ${m.transitionsPer100.toFixed(1)} per 100 words`,
    `- Hedging phrases: ${m.hedgesPer100.toFixed(1)} per 100 words`,
  ].join("\n");
}
