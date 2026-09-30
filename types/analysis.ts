export interface FactorScore {
  name: string;
  score: number; // 0-100, higher = more human
  explanation: string[];
  applicable?: boolean; // false = N/A for this content type (excluded from score)
}

export interface SectionScore {
  name: string;
  score: number;
  weight: number;
  applicable?: boolean; // false = whole section N/A for this content type
  factors: FactorScore[];
}

export interface ContentTypeInfo {
  id: string;
  label: string;
  detected: boolean; // true = auto-detected, false = chosen by the user
  reason?: string;
}

export interface AnalysisResult {
  id?: string;
  text: string;
  wordCount: number;
  aggregateScore: number;
  verdict: "Likely Human" | "Leans Human" | "Leans AI" | "Likely AI-Generated";
  verdictColor: "green" | "teal" | "amber" | "red";
  confidence: "Low" | "Medium" | "High";
  contentType?: ContentTypeInfo;
  adjustment?: { note: string; excludedFactors: string[]; excludedSections: string[] };
  sections: SectionScore[];
  createdAt?: string;
}
