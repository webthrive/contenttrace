#!/usr/bin/env node
// Summarize an eval run and propose new CALIBRATION anchors.
//   node eval/summarize.mjs                       # newest file in eval/results
//   node eval/summarize.mjs eval/results/run-....jsonl
// Writes a Markdown report next to the results file and prints it.
import fs from "node:fs";
import path from "node:path";
import { EVAL_DIR, RESULTS_DIR, readJsonl } from "./lib/common.mjs";

// ---- Current settings, read from the code so the report always matches the scoring engine ----
const ctSrc = fs.readFileSync(path.join(EVAL_DIR, "..", "lib", "contentTypes.ts"), "utf8");
const CAL = {};
for (const m of ctSrc.matchAll(/^\s*(\w+):\s*\{\s*ai:\s*([\d.]+),\s*human:\s*([\d.]+)\s*\}/gm)) CAL[m[1]] = { ai: +m[2], human: +m[3] };
const GROUP = {};
for (const m of ctSrc.matchAll(/id:\s*"(\w+)",\s*\n\s*group:\s*"(\w+)"/g)) GROUP[m[1]] = m[2];
const FLOOR = +(ctSrc.match(/SCORE_FLOOR\s*=\s*([\d.]+)/)?.[1] ?? 0);
const CEIL = +(ctSrc.match(/SCORE_CEILING\s*=\s*([\d.]+)/)?.[1] ?? 100);
const GROUPS = Object.keys(CAL);

const calibrate = (raw, a) => Math.max(FLOOR, Math.min(CEIL, 25 + (50 * (raw - a.ai)) / (a.human - a.ai)));
const median = (xs) => {
  if (!xs.length) return NaN;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
// AUC: chance that a random human sample scores higher (more human) than a random AI sample.
function auc(h, a) {
  if (!h.length || !a.length) return NaN;
  let wins = 0;
  for (const x of h) for (const y of a) wins += x > y ? 1 : x === y ? 0.5 : 0;
  return wins / (h.length * a.length);
}
const pct = (x) => (Number.isFinite(x) ? `${Math.round(x * 100)}%` : "-");
const f1 = (x) => (Number.isFinite(x) ? x.toFixed(1) : "-");
const correct = (r, score) => (r.label === "human" ? score >= 50 : score < 50);

// ---- Load ----
let file = process.argv[2];
if (!file) {
  const runs = fs.existsSync(RESULTS_DIR) ? fs.readdirSync(RESULTS_DIR).filter((f) => /^run-.*\.jsonl$/.test(f)).sort() : [];
  if (!runs.length) {
    console.error("No results yet. Run: node eval/run-eval.mjs");
    process.exit(1);
  }
  file = path.join(RESULTS_DIR, runs.at(-1));
}
const all = readJsonl(file);
const byId = new Map();
for (const r of all) if (!r.error || !byId.has(r.id)) byId.set(r.id, r); // keep the last good row per sample
const rows = [...byId.values()].filter((r) => !r.error && Number.isFinite(r.raw));
const failed = [...byId.values()].filter((r) => r.error).length;
for (const r of rows) r.group = GROUP[r.detected_type] ?? "general";
const plainRows = rows.filter((r) => r.variant !== "humanized");
const humanized = rows.filter((r) => r.variant === "humanized");

// ---- Proposed anchors: median raw score per group (plain samples only) ----
const MIN_N = 5;
const proposed = {};
const groupStats = [];
for (const g of GROUPS) {
  const h = plainRows.filter((r) => r.group === g && r.label === "human").map((r) => r.raw);
  const a = plainRows.filter((r) => r.group === g && r.label === "ai").map((r) => r.raw);
  const mh = median(h), ma = median(a);
  const enough = h.length >= MIN_N && a.length >= MIN_N && mh - ma > 3;
  proposed[g] = enough ? { ai: +ma.toFixed(1), human: +mh.toFixed(1) } : CAL[g];
  groupStats.push({ g, nh: h.length, na: a.length, mh, ma, auc: auc(h, a), enough });
}

// Leave-one-out check: score each sample with anchors built from the other samples, so the
// "proposed" accuracy is not just the anchors fitted to the same data.
function looScore(r) {
  const peers = plainRows.filter((x) => x.group === r.group && x.id !== r.id);
  const h = peers.filter((x) => x.label === "human").map((x) => x.raw);
  const a = peers.filter((x) => x.label === "ai").map((x) => x.raw);
  const ok = h.length >= MIN_N && a.length >= MIN_N && median(h) - median(a) > 3;
  return calibrate(r.raw, ok ? { ai: median(a), human: median(h) } : CAL[r.group]);
}
for (const r of rows) {
  r.cur = calibrate(r.raw, CAL[r.group]);
  r.prop = calibrate(r.raw, proposed[r.group]);
  r.loo = r.variant === "humanized" ? r.prop : looScore(r);
}

function accTable(list, keyFn, keys) {
  const lines = ["| Group | Human n | AI n | Humans right (now) | AI right (now) | Humans right (proposed, LOO) | AI right (proposed, LOO) |", "|---|---|---|---|---|---|---|"];
  for (const k of keys) {
    const sub = list.filter((r) => keyFn(r) === k);
    const h = sub.filter((r) => r.label === "human"), a = sub.filter((r) => r.label === "ai");
    if (!sub.length) continue;
    const rate = (xs, s) => (xs.length ? `${xs.filter((r) => correct(r, r[s])).length}/${xs.length}` : "-");
    lines.push(`| ${k} | ${h.length} | ${a.length} | ${rate(h, "cur")} | ${rate(a, "cur")} | ${rate(h, "loo")} | ${rate(a, "loo")} |`);
  }
  return lines.join("\n");
}

const uniq = (xs) => [...new Set(xs)].sort();
const out = [];
const P = (s = "") => out.push(s);

P(`# ContentTrace eval summary`);
P();
P(`- Results file: \`${path.basename(file)}\``);
P(`- Scored: ${rows.length} (${rows.filter((r) => r.label === "human").length} human, ${rows.filter((r) => r.label === "ai").length} AI, of which ${humanized.length} "humanized"). Failed: ${failed}.`);
P(`- Content type: ${uniq(rows.map((r) => r.type_mode)).join(", ")}. Markdown removed: ${uniq(rows.map((r) => r.plain)).join(", ")}.`);
P(`- "Right" = human shown at 50 or higher, AI shown below 50. "Humanized" AI samples are not used for anchors.`);
P();
P(`## Overall (plain samples)`);
P();
const hAll = plainRows.filter((r) => r.label === "human"), aAll = plainRows.filter((r) => r.label === "ai");
const right = (xs, s) => xs.filter((r) => correct(r, r[s])).length;
P(`- Accuracy now: ${pct((right(hAll, "cur") + right(aAll, "cur")) / plainRows.length)} (humans ${right(hAll, "cur")}/${hAll.length}, AI ${right(aAll, "cur")}/${aAll.length})`);
P(`- Accuracy with proposed anchors (leave-one-out): ${pct((right(hAll, "loo") + right(aAll, "loo")) / plainRows.length)} (humans ${right(hAll, "loo")}/${hAll.length}, AI ${right(aAll, "loo")}/${aAll.length})`);
P(`- AUC of shown score (now): ${f1(auc(hAll.map((r) => r.cur), aAll.map((r) => r.cur)) * 100)}% — ranking quality, not changed by anchors within a group`);
P(`- Content type detected as expected: ${rows.filter((r) => r.detected_type === r.expected_type).length}/${rows.length}`);
P();
P(`## Raw score by calibration group (plain samples)`);
P();
P(`| Group | Human n | AI n | Human median | AI median | AUC (raw) | Current anchors (ai / human) | Proposed |`);
P(`|---|---|---|---|---|---|---|---|`);
for (const s of groupStats) {
  P(`| ${s.g} | ${s.nh} | ${s.na} | ${f1(s.mh)} | ${f1(s.ma)} | ${pct(s.auc)} | ${CAL[s.g].ai} / ${CAL[s.g].human} | ${s.enough ? `${proposed[s.g].ai} / ${proposed[s.g].human}` : `keep (need ${MIN_N}+ each side)`} |`);
}
P();
P(`## Accuracy by group`);
P();
P(accTable(plainRows, (r) => r.group, GROUPS));
P();
P(`## Accuracy by category`);
P();
P(accTable(plainRows, (r) => r.category, uniq(plainRows.map((r) => r.category))));
P();
P(`## AI samples by provider (plain)`);
P();
P(`| Provider | Model | n | Caught now | Caught (proposed, LOO) | Median shown now |`);
P(`|---|---|---|---|---|---|`);
for (const src of uniq(aAll.map((r) => r.source))) {
  const sub = aAll.filter((r) => r.source === src);
  P(`| ${src} | ${uniq(sub.map((r) => r.model)).join(", ")} | ${sub.length} | ${right(sub, "cur")}/${sub.length} | ${right(sub, "loo")}/${sub.length} | ${f1(median(sub.map((r) => r.cur)))} |`);
}
if (humanized.length) {
  P();
  P(`## "Humanized" AI samples (user asked the model to sound human)`);
  P();
  P(`- Caught now: ${right(humanized, "cur")}/${humanized.length}. With proposed anchors: ${right(humanized, "prop")}/${humanized.length}. Median shown score now: ${f1(median(humanized.map((r) => r.cur)))}.`);
}
P();
P(`## Content type detection`);
P();
P(`| Expected | Detected as |`);
P(`|---|---|`);
for (const e of uniq(rows.map((r) => r.expected_type))) {
  const counts = {};
  for (const r of rows.filter((x) => x.expected_type === e)) counts[r.detected_type] = (counts[r.detected_type] ?? 0) + 1;
  P(`| ${e} | ${Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(", ")} |`);
}
P();
P(`## Which signals separate human from AI (plain samples)`);
P();
P(`AUC per factor: 50% = no signal, 100% = humans always score higher. Below 50% = the factor points the wrong way.`);
P();
const factorNames = uniq(plainRows.flatMap((r) => r.sections.flatMap((s) => s.factors.map((f) => `${s.name} › ${f.name}`))));
const fac = factorNames.map((key) => {
  const [sec, name] = key.split(" › ");
  const get = (r) => r.sections.find((s) => s.name === sec)?.factors.find((f) => f.name === name)?.score;
  const h = hAll.map(get).filter(Number.isFinite), a = aAll.map(get).filter(Number.isFinite);
  return { key, auc: auc(h, a), dh: mean(h), da: mean(a) };
}).sort((x, y) => y.auc - x.auc);
P(`| Factor | AUC | Human mean | AI mean |`);
P(`|---|---|---|---|`);
for (const x of fac) P(`| ${x.key} | ${pct(x.auc)} | ${f1(x.dh)} | ${f1(x.da)} |`);
P();
P(`## Wrong calls with proposed anchors (leave-one-out)`);
P();
const wrong = plainRows.filter((r) => !correct(r, r.loo)).sort((a, b) => a.label.localeCompare(b.label) || a.loo - b.loo);
P(wrong.length ? `| Sample | Label | Detected type | Raw | Shown now | Shown proposed |\n|---|---|---|---|---|---|\n` + wrong.map((r) => `| ${r.id} | ${r.label} | ${r.detected_type} | ${f1(r.raw)} | ${f1(r.cur)} | ${f1(r.loo)} |`).join("\n") : "None.");
P();
P(`## Proposed CALIBRATION for lib/contentTypes.ts`);
P();
P("```ts");
P(`export const CALIBRATION: Record<CalibrationGroup, { ai: number; human: number }> = {`);
for (const g of GROUPS) P(`  ${g}: { ai: ${proposed[g].ai}, human: ${proposed[g].human} },${groupStats.find((s) => s.g === g).enough ? "" : " // unchanged: not enough samples"}`);
P(`};`);
P("```");

const report = out.join("\n");
const mdFile = file.replace(/\.jsonl$/, "-summary.md");
fs.writeFileSync(mdFile, report + "\n");
console.log(report);
console.log(`\nSaved: ${path.relative(process.cwd(), mdFile)}`);
