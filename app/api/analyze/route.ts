import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Analyze text for AI vs human authorship. Respond ONLY with valid JSON, no markdown, no preamble.

Score 0-10 per factor (0=AI, 10=human). Each factor needs 2-3 specific observations from the text.

JSON structure:
{"sections":[{"name":"...","weight":0.12,"factors":[{"name":"...","score":7,"explanation":["obs1","obs2"]}]}]}

Score exactly these 8 sections:
{"name":"Structure & Flow","weight":0.12,"factors":["Sentence Length Variation","Transitional Phrase Overuse","Predictable List Structures","Paragraph Length Consistency"]}
{"name":"Word Choice & Phrasing","weight":0.15,"factors":["AI Filler Phrases","Hedging Language Overuse","Lack of Contractions","Generic vs Specific Language"]}
{"name":"Voice & Perspective","weight":0.14,"factors":["Distinct Point of View","Personal Anecdotes Present","Emotional Authenticity","Opinion Strength"]}
{"name":"Content & Logic","weight":0.13,"factors":["Depth vs Surface Treatment","Insider/Niche Knowledge","Surprising Observations","Argument Completeness"]}
{"name":"Cognitive Fingerprinting","weight":0.16,"factors":["Opinion Drift / Self-Correction","Thinking Out Loud","Metacognitive Signals","Cognitive Bias Presence"]}
{"name":"Emotional Texture","weight":0.12,"factors":["Genuine vs Performed Empathy","Vulnerability Present","Emotional Range","Specificity of Feeling"]}
{"name":"Pragmatics & Subtext","weight":0.10,"factors":["Subtext and Implication","Irony or Dry Humor","Register Shifts","Over-Explicitness"]}
{"name":"Statistical Proxies","weight":0.08,"factors":["Vocabulary Richness","Burstiness Approximation","Response Calibration","Entropy Variance"]}`;

type SectionObj = {
  name: string;
  weight: number;
  score: number;
  factors: { name: string; score: number; explanation: string[] }[];
};

function scoreSection(raw: { name: string; weight: number; factors: { name: string; score: number; explanation: string[] }[] }): SectionObj {
  // Prompt returns 0-10; UI expects 0-100. Multiply by 10.
  const scaledFactors = raw.factors.map(f => ({ ...f, score: Math.round(f.score * 10) }));
  const sectionScore = scaledFactors.reduce((sum, f) => sum + f.score, 0) / scaledFactors.length;
  return { ...raw, factors: scaledFactors, score: Math.round(sectionScore) };
}

function computeResult(sections: SectionObj[], wordCount: number) {
  const totalWeight = sections.reduce((sum, s) => sum + s.weight, 0);
  const aggregateScore =
    sections.reduce((sum, s) => sum + s.score * s.weight, 0) / totalWeight;
  const roundedAggregate = Math.round(aggregateScore * 10) / 10;

  let verdict: "Likely Human" | "Leans Human" | "Leans AI" | "Likely AI-Generated";
  let verdictColor: "green" | "teal" | "amber" | "red";

  // Scores are now 0-100
  if (roundedAggregate >= 75) {
    verdict = "Likely Human"; verdictColor = "green";
  } else if (roundedAggregate >= 50) {
    verdict = "Leans Human"; verdictColor = "teal";
  } else if (roundedAggregate >= 25) {
    verdict = "Leans AI"; verdictColor = "amber";
  } else {
    verdict = "Likely AI-Generated"; verdictColor = "red";
  }

  const confidence: "Low" | "Medium" | "High" =
    wordCount < 100 ? "Low" : wordCount < 300 ? "Medium" : "High";

  return { aggregateScore: roundedAggregate, verdict, verdictColor, wordCount, confidence, sections };
}

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  if (!text || text.trim().length < 50) {
    return new Response(
      JSON.stringify({ error: "Please provide at least 50 characters of text to analyze." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (text.length > 10000) {
    return new Response(
      JSON.stringify({ error: "Text must be under 10,000 characters." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const claudeStream = await client.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Analyze this text:\n\n---\n${text}\n---`,
      },
    ],
  });

  const encoder = new TextEncoder();
  const wordCount = text.trim().split(/\s+/).length;

  const stream = new ReadableStream({
    async start(controller) {
      let buffer = "";
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const parsedSections: SectionObj[] = [];
      let emittedCount = 0;

      for await (const chunk of claudeStream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          buffer += chunk.delta.text;

          try {
            const sectionsMatch = buffer.match(/"sections"\s*:\s*\[/);
            if (sectionsMatch) {
              const sectionsStart = buffer.indexOf(sectionsMatch[0]) + sectionsMatch[0].length;
              const partial = buffer.slice(sectionsStart);

              let depth = 0;
              let sectionStart = -1;
              const rawSections: string[] = [];

              for (let i = 0; i < partial.length; i++) {
                const ch = partial[i];
                if (ch === "{") {
                  if (depth === 0) sectionStart = i;
                  depth++;
                } else if (ch === "}") {
                  depth--;
                  if (depth === 0 && sectionStart !== -1) {
                    rawSections.push(partial.slice(sectionStart, i + 1));
                    sectionStart = -1;
                  }
                }
              }

              while (emittedCount < rawSections.length) {
                try {
                  const sectionObj = scoreSection(JSON.parse(rawSections[emittedCount]));
                  parsedSections[emittedCount] = sectionObj;
                  send({ type: "section", section: sectionObj });
                  emittedCount++;
                } catch {
                  break;
                }
              }
            }
          } catch {
            // Continue accumulating
          }
        }
      }

      try {
        let sections = parsedSections.filter(Boolean);

        if (sections.length < 8) {
          const clean = buffer.replace(/```json|```/g, "").trim();
          const jsonStart = clean.indexOf("{");
          const jsonEnd = clean.lastIndexOf("}");
          const jsonStr = clean.slice(jsonStart, jsonEnd + 1);
          const parsed = JSON.parse(jsonStr);
          sections = parsed.sections.map(scoreSection);
        }

        send({ type: "complete", result: computeResult(sections, wordCount) });
      } catch (err) {
        console.error("Final parse error:", err, "Buffer tail:", buffer.slice(-300));
        send({ type: "error", message: "Failed to parse analysis results. Please try again." });
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
