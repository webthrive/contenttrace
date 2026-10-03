// Shared helpers for the eval scripts. Plain Node (18+), no extra packages.
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

export const EVAL_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// Data and results live outside the repo (they hold third-party text). Set CT_EVAL_DIR to that folder,
// for example the "eval" folder in the ContentTrace Google Drive folder. Default: eval/data and eval/results.
const EXTERNAL = process.env.CT_EVAL_DIR ? path.resolve(process.env.CT_EVAL_DIR) : null;
export const DATA_DIR = EXTERNAL ? path.join(EXTERNAL, "data") : path.join(EVAL_DIR, "data");
export const RESULTS_DIR = EXTERNAL ? path.join(EXTERNAL, "results") : path.join(EVAL_DIR, "results");

export function readJsonl(file) {
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, "utf8")
    .split("\n")
    .filter((l) => l.trim())
    .map((l, i) => {
      try {
        return JSON.parse(l);
      } catch {
        throw new Error(`${path.basename(file)} line ${i + 1} is not valid JSON`);
      }
    });
}

export function appendJsonl(file, obj) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.appendFileSync(file, JSON.stringify(obj) + "\n");
}

export function arg(name, fallback = undefined) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const v = process.argv[i + 1];
  return v === undefined || v.startsWith("--") ? true : v;
}

// Ask for a secret in the terminal without showing it. Returns "" if the user presses Enter.
export function askSecret(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    let muted = false;
    const write = rl._writeToOutput.bind(rl);
    rl._writeToOutput = (s) => (muted ? write(s.includes("\n") ? "\n" : "") : write(s));
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
    muted = true;
  });
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Run async jobs with a fixed number of workers.
export async function pool(items, workers, fn) {
  let next = 0;
  const run = async () => {
    while (next < items.length) {
      const i = next++;
      await fn(items[i], i);
    }
  };
  await Promise.all(Array.from({ length: Math.min(workers, items.length) }, run));
}
