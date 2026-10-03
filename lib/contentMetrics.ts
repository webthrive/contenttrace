// Readability and structure measures for the Content Optimizer, computed in code.
// Pure functions with no server imports, so the browser and the API both use them.

export type ContentMetrics = {
  words: number;
  sentences: number;
  avgSentenceLength: number; // words per sentence
  longSentences: number; // sentences over 30 words
  readingEase: number; // Flesch Reading Ease, 0-100 (higher = easier)
  gradeLevel: number; // Flesch-Kincaid grade
  paragraphs: number;
  longParagraphs: number; // paragraphs over 120 words
  headings: number;
  questionHeadings: number;
  listItems: number;
  keyword?: {
    term: string;
    inFirst100Words: boolean;
    inHeading: boolean;
    count: number;
  };
};

const round1 = (n: number) => Math.round(n * 10) / 10;

function wordList(s: string): string[] {
  return s.match(/[A-Za-z0-9][A-Za-z0-9'’-]*/g) ?? [];
}

// Syllable estimate for English words (good enough for readability formulas).
export function syllables(word: string): number {
  let w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|[^laeiouy]ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  const groups = w.match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 1);
}

function splitSentences(text: string): string[] {
  return text
    .split(/\n+/)
    .flatMap((line) => line.split(/(?<=[.!?])\s+(?=["“'(]?[A-Z0-9])/))
    .map((s) => s.trim())
    .filter((s) => wordList(s).length > 0);
}

// A line is a heading when it is a markdown heading, or a short line with no end punctuation
// that sits on its own (common when text is pasted from a web page or a doc).
function isHeading(line: string, prevBlank: boolean, nextBlank: boolean): boolean {
  const t = line.trim();
  if (/^#{1,6}\s+\S/.test(t)) return true;
  if (/^\*\*[^*]+\*\*:?$/.test(t)) return true;
  const n = wordList(t).length;
  return prevBlank && nextBlank && n > 0 && n <= 12 && !/[.,;:]$/.test(t) && !/^[-*•]|^\d+[.)]/.test(t);
}

const LIST_RE = /^\s*(?:[-*•]|\d+[.)])\s+\S/;

export function contentMetrics(text: string, keyword?: string): ContentMetrics {
  const lines = text.split("\n");
  const blank = (i: number) => i < 0 || i >= lines.length || !lines[i].trim();

  const headingLines: string[] = [];
  let listItems = 0;
  lines.forEach((line, i) => {
    if (!line.trim()) return;
    if (LIST_RE.test(line)) listItems++;
    else if (isHeading(line, blank(i - 1), blank(i + 1))) headingLines.push(line.trim().replace(/^#+\s*/, ""));
  });

  // Sentence measures skip headings and list items, which are not full sentences.
  const proseLines = lines.filter((l) => l.trim() && !LIST_RE.test(l) && !headingLines.includes(l.trim().replace(/^#+\s*/, "")));
  const sentences = splitSentences(proseLines.join("\n"));
  const sentenceWords = sentences.map((s) => wordList(s));
  const allWords = wordList(text);
  const proseWordCount = sentenceWords.reduce((n, w) => n + w.length, 0);
  const sylls = sentenceWords.flat().reduce((n, w) => n + syllables(w), 0);

  const avgSentenceLength = sentences.length ? proseWordCount / sentences.length : 0;
  const sylPerWord = proseWordCount ? sylls / proseWordCount : 0;
  const readingEase = sentences.length ? Math.max(0, Math.min(100, 206.835 - 1.015 * avgSentenceLength - 84.6 * sylPerWord)) : 0;
  const gradeLevel = sentences.length ? Math.max(0, 0.39 * avgSentenceLength + 11.8 * sylPerWord - 15.59) : 0;

  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  let kw: ContentMetrics["keyword"];
  const term = keyword?.trim();
  if (term) {
    const esc = term.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
    const re = new RegExp(`(^|[^a-z0-9])${esc}([^a-z0-9]|$)`, "i");
    const reAll = new RegExp(`(^|[^a-z0-9])${esc}(?=[^a-z0-9]|$)`, "gi");
    kw = {
      term,
      inFirst100Words: re.test(allWords.slice(0, 100).join(" ")),
      inHeading: headingLines.some((h) => re.test(h)),
      count: (text.match(reAll) ?? []).length,
    };
  }

  return {
    words: allWords.length,
    sentences: sentences.length,
    avgSentenceLength: round1(avgSentenceLength),
    longSentences: sentenceWords.filter((w) => w.length > 30).length,
    readingEase: Math.round(readingEase),
    gradeLevel: round1(gradeLevel),
    paragraphs: paragraphs.length,
    longParagraphs: paragraphs.filter((p) => wordList(p).length > 120).length,
    headings: headingLines.length,
    questionHeadings: headingLines.filter((h) => /\?\s*$/.test(h) || /^(what|why|how|when|where|who|which|can|does|do|is|are|should)\b/i.test(h)).length,
    listItems,
    keyword: kw,
  };
}

// Plain-English label for a Flesch Reading Ease score.
export function readingEaseLabel(score: number): string {
  if (score >= 70) return "Easy";
  if (score >= 60) return "Plain English";
  if (score >= 50) return "Fairly hard";
  if (score >= 30) return "Hard";
  return "Very hard";
}
