#!/usr/bin/env node
// Generate AI samples: sends every prompt in eval/prompts.json to Claude, ChatGPT (OpenAI API) and Gemini.
// No system prompt and default settings, so the text matches what a normal chat user gets.
//
//   node eval/generate-ai.mjs                 # asks for each key (press Enter to skip a provider)
//   node eval/generate-ai.mjs --only openai   # one provider
//   node eval/generate-ai.mjs --list-models   # print model IDs your keys can use
//
// Keys can also come from ANTHROPIC_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY.
// Models can be set with CLAUDE_MODEL, OPENAI_MODEL, GEMINI_MODEL. Otherwise the script picks one (see below).
// Output: eval/data/ai-samples.jsonl. Safe to re-run: finished samples are skipped.
import fs from "node:fs";
import path from "node:path";
import { DATA_DIR, EVAL_DIR, appendJsonl, arg, askSecret, pool, readJsonl, sleep } from "./lib/common.mjs";

const OUT = path.join(DATA_DIR, "ai-samples.jsonl");
const { prompts } = JSON.parse(fs.readFileSync(path.join(EVAL_DIR, "prompts.json"), "utf8"));

// First model ID that works is used. Override with the env vars above.
const CANDIDATES = {
  openai: ["chat-latest", "gpt-5-chat-latest", "chatgpt-4o-latest", "gpt-4o"],
  gemini: ["gemini-flash-latest", "gemini-3.8-flash", "gemini-2.5-flash"],
};

async function http(url, opts) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, opts);
    if (res.ok) return res.json();
    const body = await res.text();
    if ((res.status === 429 || res.status >= 500) && attempt < 5) {
      await sleep(2000 * attempt * attempt);
      continue;
    }
    const err = new Error(`HTTP ${res.status}: ${body.slice(0, 300)}`);
    err.status = res.status;
    throw err;
  }
}

const PROVIDERS = {
  claude: {
    label: "Claude",
    keyEnv: "ANTHROPIC_API_KEY",
    modelEnv: "CLAUDE_MODEL",
    headers: (key) => ({ "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" }),
    async listModels(key) {
      const d = await http("https://api.anthropic.com/v1/models?limit=100", { headers: this.headers(key) });
      return d.data.map((m) => m.id); // newest first
    },
    // Default: the newest Sonnet model (the default model in the Claude apps).
    async pickModel(key) {
      const ids = await this.listModels(key);
      return ids.find((id) => id.includes("sonnet")) ?? ids[0];
    },
    async generate(key, model, prompt) {
      const d = await http("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: this.headers(key),
        body: JSON.stringify({ model, max_tokens: 2500, messages: [{ role: "user", content: prompt }] }),
      });
      return d.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
    },
  },
  openai: {
    label: "ChatGPT",
    keyEnv: "OPENAI_API_KEY",
    modelEnv: "OPENAI_MODEL",
    headers: (key) => ({ authorization: `Bearer ${key}`, "content-type": "application/json" }),
    async listModels(key) {
      const d = await http("https://api.openai.com/v1/models", { headers: this.headers(key) });
      return d.data.map((m) => m.id).sort();
    },
    async pickModel(key) {
      const ids = new Set(await this.listModels(key));
      return CANDIDATES.openai.find((id) => ids.has(id));
    },
    async generate(key, model, prompt) {
      const d = await http("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: this.headers(key),
        body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }] }),
      });
      return (d.choices?.[0]?.message?.content ?? "").trim();
    },
  },
  gemini: {
    label: "Gemini",
    keyEnv: "GEMINI_API_KEY",
    modelEnv: "GEMINI_MODEL",
    headers: (key) => ({ "x-goog-api-key": key, "content-type": "application/json" }),
    async listModels(key) {
      const d = await http("https://generativelanguage.googleapis.com/v1beta/models?pageSize=200", { headers: this.headers(key) });
      return d.models.filter((m) => m.supportedGenerationMethods?.includes("generateContent")).map((m) => m.name.replace("models/", ""));
    },
    async pickModel(key) {
      const ids = new Set(await this.listModels(key));
      return CANDIDATES.gemini.find((id) => ids.has(id));
    },
    async generate(key, model, prompt) {
      const d = await http(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: this.headers(key),
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] }),
      });
      const parts = d.candidates?.[0]?.content?.parts ?? [];
      return parts.filter((p) => !p.thought).map((p) => p.text ?? "").join("").trim();
    },
  },
};

async function main() {
  const only = arg("only");
  const names = Object.keys(PROVIDERS).filter((n) => !only || n === only);
  const keys = {};
  for (const n of names) {
    const p = PROVIDERS[n];
    keys[n] = process.env[p.keyEnv] || (await askSecret(`${p.label} API key (${p.keyEnv}, Enter to skip): `));
  }

  if (arg("list-models")) {
    for (const n of names) {
      if (!keys[n]) continue;
      console.log(`\n${PROVIDERS[n].label}:\n  ${(await PROVIDERS[n].listModels(keys[n])).join("\n  ")}`);
    }
    return;
  }

  const done = new Set(readJsonl(OUT).map((s) => s.id));
  for (const n of names) {
    const p = PROVIDERS[n];
    if (!keys[n]) {
      console.log(`- ${p.label}: skipped (no key)`);
      continue;
    }
    let model;
    try {
      model = process.env[p.modelEnv] || (await p.pickModel(keys[n]));
    } catch (e) {
      console.log(`- ${p.label}: could not use this key (${e.message.slice(0, 160)})`);
      continue;
    }
    if (!model) {
      console.log(`- ${p.label}: none of the default models are available. Run with --list-models and set ${p.modelEnv}.`);
      continue;
    }
    const todo = prompts.filter((q) => !done.has(`ai-${n}-${q.id}`));
    console.log(`- ${p.label}: model ${model}, ${todo.length} prompts to run`);
    let ok = 0;
    await pool(todo, 3, async (q) => {
      try {
        const text = await p.generate(keys[n], model, q.prompt);
        if (text.length < 50) throw new Error(`reply too short (${text.length} chars)`);
        appendJsonl(OUT, {
          id: `ai-${n}-${q.id}`,
          label: "ai",
          category: q.category,
          expected_type: q.expected_type,
          variant: q.variant,
          text,
          words: text.split(/\s+/).filter(Boolean).length,
          source: `${p.label} API`,
          model,
          prompt: q.prompt,
          date: new Date().toISOString().slice(0, 10),
        });
        ok++;
        process.stdout.write(".");
      } catch (e) {
        console.log(`\n  ${q.id} failed: ${e.message}`);
      }
    });
    console.log(`\n  ${ok}/${todo.length} saved`);
  }
  const all = readJsonl(OUT);
  console.log(`\n${all.length} AI samples in ${path.relative(process.cwd(), OUT)}`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
