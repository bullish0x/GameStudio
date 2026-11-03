#!/usr/bin/env node
// Skill trigger evaluation harness.
//
// static: validate the eval set covers every core skill and is well formed.
// live:   ask a headless gamestudio agent to route each query to one skill,
//         then score should-trigger / should-not-trigger accuracy.
//
// Usage:
//   node scripts/skill-trigger-eval.mjs --static
//   node scripts/skill-trigger-eval.mjs --live [--only <skill>] [--limit <n>]
//                                        [--threshold 0.8] [--dry-run]
//
// Requires the OpenCode adapter installed (tools/build-opencode-adapter.mjs)
// for --live. Writes production/skill-trigger-eval-report.md.

import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";

const args = process.argv.slice(2);
const MODE = args.includes("--live") ? "live" : "static";
const DRY = args.includes("--dry-run");
const onlyIdx = args.indexOf("--only");
const ONLY = onlyIdx >= 0 ? args[onlyIdx + 1] : null;
const limitIdx = args.indexOf("--limit");
const LIMIT = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : Infinity;
const thIdx = args.indexOf("--threshold");
const THRESHOLD = thIdx >= 0 ? parseFloat(args[thIdx + 1]) : 0.8;

const ROOT = process.cwd();
const SKILLS = join(ROOT, ".agents", "skills");
const EVALS = join(ROOT, "tools", "skill-trigger-evals.json");

const evals = JSON.parse(readFileSync(EVALS, "utf8"));

// Core skills = tier:core in the catalog.
const catalog = readFileSync(join(ROOT, "GameStudio Skill Testing Framework", "catalog.yaml"), "utf8");
const core = new Set();
let cur = null, tier = null;
for (const line of catalog.split("\n")) {
  const nm = line.match(/^  - name: (.+)/);
  if (nm) { if (cur && tier === "core") core.add(cur); cur = nm[1].trim(); tier = null; }
  const tm = line.match(/^    tier: (.+)/);
  if (tm) tier = tm[1].trim();
}
if (cur && tier === "core") core.add(cur);

function descriptionOf(id) {
  const text = readFileSync(join(SKILLS, id, "SKILL.md"), "utf8");
  const fm = text.match(/^---\n([\s\S]*?)\n---/)?.[1] || "";
  const d = fm.match(/^description:\s*([\s\S]*?)(?=\n[a-zA-Z_-]+:|$)/m)?.[1] || "";
  return d.trim().replace(/^"|"$/g, "").replace(/\s+/g, " ");
}

// --- static validation ---
const problems = [];
for (const id of core) {
  const e = evals.skills[id];
  if (!e) { problems.push(`${id}: missing from eval set`); continue; }
  if (!Array.isArray(e.should) || e.should.length < 2) problems.push(`${id}: needs >=2 should-trigger queries`);
  if (!Array.isArray(e.should_not) || e.should_not.length < 1) problems.push(`${id}: needs >=1 should-not-trigger query`);
  for (const q of [...(e.should || []), ...(e.should_not || [])]) {
    if (typeof q !== "string" || q.trim().length < 8) problems.push(`${id}: weak query '${q}'`);
  }
}
for (const id of Object.keys(evals.skills)) {
  if (!core.has(id)) problems.push(`${id}: eval entry is not a core skill (or tier changed)`);
  if (!statSync(join(SKILLS, id, "SKILL.md"), { throwIfNoEntry: false })) problems.push(`${id}: no SKILL.md`);
}
const allQueries = Object.values(evals.skills).flatMap(e => [...(e.should || []), ...(e.should_not || [])]);
const dupes = allQueries.filter((q, i) => allQueries.indexOf(q) !== i);
for (const q of new Set(dupes)) problems.push(`duplicate query: ${q}`);

if (MODE === "static") {
  if (problems.length) {
    for (const p of problems) console.error("FAIL:", p);
    process.exit(1);
  }
  console.log(`PASS: eval set covers ${core.size} core skills (${allQueries.length} queries)`);
  process.exit(0);
}

// --- live routing ---
if (problems.length) {
  for (const p of problems) console.error("FAIL:", p);
  process.exit(1);
}

const ids = [...core].filter(id => !ONLY || id === ONLY);
const skillLines = ids.map(id => `- gs-${id}: ${descriptionOf(id)}`).join("\n");

function runAgent(prompt) {
  const res = spawnSync(
    "opencode",
    ["run", "--standalone", "--agent", "gamestudio", "--format", "json", prompt],
    { cwd: tmpdir(), encoding: "utf8", timeout: 180000, maxBuffer: 8 * 1024 * 1024 },
  );
  if (res.error) throw res.error;
  const text = (res.stdout || "")
    .split("\n")
    .filter(Boolean)
    .map(line => { try { return JSON.parse(line); } catch { return null; } })
    .filter(e => e && e.type === "text" && e.part && typeof e.part.text === "string")
    .map(e => e.part.text)
    .join("");
  return text;
}

function parseAnswers(text, count) {
  const candidates = [...text.matchAll(/\{[\s\S]*?\}/g)].map(m => m[0]);
  for (const c of candidates.reverse()) {
    try {
      const obj = JSON.parse(c);
      const out = {};
      for (let i = 1; i <= count; i++) {
        const v = obj[`q${i}`];
        if (typeof v === "string") out[i] = v.trim();
      }
      if (Object.keys(out).length === count) return out;
    } catch { /* try next */ }
  }
  return {};
}

function normalize(v) {
  const s = String(v || "").trim().toLowerCase();
  if (!s || s === "none" || s === "n/a" || s === "null") return "none";
  return s.replace(/^gs-/, "").replace(/[`"']/g, "");
}

const results = [];
for (const id of ids) {
  const e = evals.skills[id];
  const queries = [...e.should.map(q => ({ q, expect: id })), ...e.should_not.map(q => ({ q, expect: null }))].slice(0, LIMIT);
  const prompt = [
    "You are a routing classifier for GameStudio skills. Do not perform the request.",
    "Pick exactly one skill ID from the list, or NONE if no listed skill fits.",
    "Return only a JSON object mapping each request number to the chosen ID.",
    "",
    "Skills:",
    skillLines,
    "",
    "Requests:",
    ...queries.map((x, i) => `${i + 1}. ${x.q}`),
    "",
    `Return: ${JSON.stringify(Object.fromEntries(queries.map((_, i) => [`q${i + 1}`, "gs-..."])))}`,
  ].join("\n");

  if (DRY) {
    console.log(`\n===== ${id} =====\n${prompt}`);
    continue;
  }
  const text = runAgent(prompt);
  const answers = parseAnswers(text, queries.length);
  queries.forEach((x, i) => {
    const got = normalize(answers[i + 1]);
    const ok = x.expect === null ? got !== id : got === x.expect;
    results.push({ skill: id, query: x.q, expect: x.expect ?? `not-${id}`, got: got || "(no answer)", ok });
  });
  process.stderr.write(`. ${id}\n`);
}

if (DRY) process.exit(0);

const passed = results.filter(r => r.ok).length;
const accuracy = results.length ? passed / results.length : 0;
const report = [
  "# Skill trigger eval",
  "",
  `Generated: ${new Date().toISOString()}`,
  `Mode: live  Queries: ${results.length}  Passed: ${passed}  Accuracy: ${(accuracy * 100).toFixed(1)}%  Threshold: ${(THRESHOLD * 100).toFixed(0)}%`,
  "",
  "## Failures",
  "",
  ...(results.filter(r => !r.ok).length
    ? results.filter(r => !r.ok).map(r => `- [${r.skill}] "${r.query}" -> expected ${r.expect}, got ${r.got}`)
    : ["None."]),
  "",
  "## Per-skill",
  "",
  ...[...new Set(results.map(r => r.skill))].map(s => {
    const rs = results.filter(r => r.skill === s);
    return `- ${s}: ${rs.filter(r => r.ok).length}/${rs.length}`;
  }),
  "",
].join("\n");
mkdirSync(join(ROOT, "production"), { recursive: true });
writeFileSync(join(ROOT, "production", "skill-trigger-eval-report.md"), report);
console.log(`\nAccuracy ${(accuracy * 100).toFixed(1)}% (${passed}/${results.length}) — report: production/skill-trigger-eval-report.md`);
if (accuracy < THRESHOLD) process.exit(1);
