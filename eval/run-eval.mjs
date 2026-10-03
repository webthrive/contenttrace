#!/usr/bin/env node
// Score every sample with the real analyzer (app/api/analyze) running on your Mac, and save raw results.
//
// 1. In one terminal, start the site WITHOUT Supabase keys, so there are no usage limits or human check:
//      ANTHROPIC_API_KEY=sk-ant-... npm run dev
// 2. In a second terminal:
//      node eval/run-eval.mjs
//
// Options:
//   --url http://localhost:3000   analyzer location
//   --only human|ai               score one group
//   --limit 5                     first N samples (quick test)
//   --type expected               send each sample's expected content type (default: auto-detect, like real users)
//   --plain                       remove markdown marks (#, **, list bullets) first, like text copied from a web page
//   --workers 2                   samples in parallel (each sample makes ~8 API calls at once)
//   --out eval/results/x.jsonl    resume an earlier run (finished samples are skipped)
import fs from "node:fs";
import path from "node:path";
import { DATA_DIR, RESULTS_DIR, appendJsonl, arg, pool, readJsonl, sleep } from "./lib/common.mjs";

const URL_BASE = String(arg("url", "http://localhost:3000")).replace(/\/$/, "");
const ONLY = arg("only");
const LIMIT = Number(arg("limit", 0));
const TYPE_MODE = arg("type", "auto");
const PLAIN = Boolean(arg("plain", false));
const WORKERS = Number(arg("workers", 2));
const stamp = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 16);
const OUT = path.resolve(String(arg("out", path.join(RESULTS_DIR, `run-${stamp}${PLAIN ? "-plain" : ""}.jsonl`))));

function plain(text) {
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*\n]+)\*\*/g, "$1")
    .replace(/__([^_\n]+)__/g, "$1")
    .replace(/^\s*[-*•]\s+/gm, "");
}

// POST the text and read the server-sent events until the final result.
async function analyze(text, contentType) {
  const res = await fetch(`${URL_BASE}/api/analyze`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(contentType ? { text, contentType } : { text }),
  });
  if (!res.ok) {
    const body = await res.text();
    if (res.status === 403 || res.status === 402 || res.status === 503) {
      console.error(`\nThe site has usage limits on (HTTP ${res.status}). Supabase keys are set, probably in .env.local.`);
      console.error("Stop the dev server, rename .env.local, and start it again with only ANTHROPIC_API_KEY.");
      process.exit(1);
    }
    const err = new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
    err.retry = res.status === 429 || res.status >= 500;
    throw err;
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let i;
    while ((i = buf.indexOf("\n\n")) !== -1) {
      const chunk = buf.slice(0, i);
      buf = buf.slice(i + 2);
      const line = chunk.split("\n").find((l) => l.startsWith("data: "));
      if (!line) continue;
      const ev = JSON.parse(line.slice(6));
      if (ev.type === "complete") return ev.result;
      if (ev.type === "error") {
        const err = new Error(ev.message);
        err.retry = true;
        throw err;
      }
    }
  }
  throw new Error("Stream ended without a result");
}

async function main() {
  // Check the server first, so a wrong setup fails fast.
  try {
    await fetch(`${URL_BASE}/`, { method: "HEAD" });
  } catch {
    console.error(`Cannot reach ${URL_BASE}. Start the site first: ANTHROPIC_API_KEY=... npm run dev`);
    process.exit(1);
  }

  let samples = [...readJsonl(path.join(DATA_DIR, "human-samples.jsonl")), ...readJsonl(path.join(DATA_DIR, "ai-samples.jsonl"))];
  if (ONLY) samples = samples.filter((s) => s.label === ONLY);
  const done = new Set(readJsonl(OUT).filter((r) => !r.error).map((r) => r.id));
  samples = samples.filter((s) => !done.has(s.id));
  if (LIMIT) samples = samples.slice(0, LIMIT);
  const ai = samples.filter((s) => s.label === "ai").length;
  console.log(`Scoring ${samples.length} samples (${samples.length - ai} human, ${ai} AI) -> ${path.relative(process.cwd(), OUT)}`);
  if (!readJsonl(path.join(DATA_DIR, "ai-samples.jsonl")).length) console.log("Note: no AI samples yet. Run: node eval/generate-ai.mjs");

  let n = 0;
  const t0 = Date.now();
  await pool(samples, WORKERS, async (s) => {
    const text = PLAIN ? plain(s.text) : s.text;
    let result, error;
    for (let attempt = 1; attempt <= 4; attempt++) {
      try {
        result = await analyze(text, TYPE_MODE === "expected" ? s.expected_type : undefined);
        error = undefined;
        break;
      } catch (e) {
        error = e.message;
        if (!e.retry || attempt === 4) break;
        await sleep(15000 * attempt); // rate limit: wait and retry
      }
    }
    n++;
    const row = {
      id: s.id,
      label: s.label,
      category: s.category,
      variant: s.variant ?? "plain",
      expected_type: s.expected_type,
      source: s.source,
      model: s.model ?? null,
      words: s.words,
      plain: PLAIN,
      type_mode: TYPE_MODE,
    };
    if (error) {
      appendJsonl(OUT, { ...row, error });
      console.log(`[${n}/${samples.length}] ${s.id} ERROR ${error}`);
      return;
    }
    appendJsonl(OUT, {
      ...row,
      detected_type: result.contentType?.id,
      raw: result.adjustment?.rawScore,
      score: result.aggregateScore,
      verdict: result.verdict,
      confidence: result.confidence,
      sections: result.sections.map((sec) => ({
        name: sec.name,
        score: sec.score,
        weight: sec.weight,
        applicable: sec.applicable,
        factors: sec.factors.map((f) => ({ name: f.name, score: f.score, applicable: f.applicable })),
      })),
    });
    const mins = ((Date.now() - t0) / 60000).toFixed(1);
    console.log(`[${n}/${samples.length}] ${s.id.padEnd(22)} ${String(result.contentType?.id).padEnd(18)} raw ${String(result.adjustment?.rawScore).padStart(5)}  shown ${String(result.aggregateScore).padStart(5)}  ${result.verdict}  (${mins} min)`);
  });

  const rows = readJsonl(OUT);
  const errors = rows.filter((r) => r.error && !rows.some((x) => x.id === r.id && !x.error));
  console.log(`\nDone. ${rows.filter((r) => !r.error).length} scored, ${errors.length} failed.`);
  console.log(`Next: node eval/summarize.mjs ${path.relative(process.cwd(), OUT)}`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
