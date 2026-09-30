import { useState, useCallback } from "react";

export interface FactorScore {
  name: string;
  score: number;
  explanation: string[];
}

export interface SectionScore {
  name: string;
  score: number;
  weight: number;
  factors: FactorScore[];
}

export interface AnalysisResult {
  aggregateScore: number;
  verdict: "Likely Human" | "Leans Human" | "Leans AI" | "Likely AI-Generated";
  verdictColor: "green" | "teal" | "amber" | "red";
  wordCount: number;
  confidence: "Low" | "Medium" | "High";
  sections: SectionScore[];
}

export interface StreamingState {
  isLoading: boolean;
  streamingSections: SectionScore[];
  result: AnalysisResult | null;
  error: string | null;
  sectionsComplete: number; // how many sections have arrived
}

export function useAnalyze() {
  const [state, setState] = useState<StreamingState>({
    isLoading: false,
    streamingSections: [],
    result: null,
    error: null,
    sectionsComplete: 0,
  });

  const analyze = useCallback(async (text: string) => {
    setState({
      isLoading: true,
      streamingSections: [],
      result: null,
      error: null,
      sectionsComplete: 0,
    });

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        let message = "Analysis failed. Please try again.";
        try {
          const data = await response.json();
          if (data?.error) message = data.error;
        } catch {
          // Server sent a non-JSON error page (e.g. 500/504). Keep the friendly message.
        }
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));
        return;
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let finished = false; // true once a "complete" or "error" event arrives

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE lines are separated by \n\n
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? ""; // keep incomplete chunk

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));

            if (event.type === "section") {
              setState((prev) => ({
                ...prev,
                streamingSections: [...prev.streamingSections, event.section],
                sectionsComplete: prev.sectionsComplete + 1,
              }));
            } else if (event.type === "complete") {
              finished = true;
              setState((prev) => ({
                ...prev,
                isLoading: false,
                result: event.result,
                // Use the fully-computed sections from the complete event
                streamingSections: event.result.sections,
                sectionsComplete: event.result.sections.length,
              }));
            } else if (event.type === "error") {
              finished = true;
              setState((prev) => ({
                ...prev,
                isLoading: false,
                error: event.message,
              }));
            }
          } catch {
            // Malformed JSON in stream chunk — skip
          }
        }
      }

      // Stream closed early (for example, a server timeout): do not leave the spinner running.
      if (!finished) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "The analysis did not finish. Please try again.",
        }));
      }
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Network error. Please try again.",
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      streamingSections: [],
      result: null,
      error: null,
      sectionsComplete: 0,
    });
  }, []);

  return { ...state, analyze, reset };
}
