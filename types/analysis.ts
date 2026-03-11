export interface FactorScore {
  name: string;
  score: number; // 0-100, higher = more human
  explanation: string[];
}

export interface SectionScore {
  name: string;
  score: number;
  weight: number;
  factors: FactorScore[];
}

export interface AnalysisResult {
  id?: string;
  text: string;
  wordCount: number;
  aggregateScore: number;
  verdict: "Likely Human" | "Leans Human" | "Leans AI" | "Likely AI-Generated";
  verdictColor: "green" | "teal" | "amber" | "red";
  confidence: "Low" | "Medium" | "High";
  sections: SectionScore[];
  createdAt?: string;
}
