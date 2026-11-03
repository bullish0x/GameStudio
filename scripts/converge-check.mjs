#!/usr/bin/env node
// Deterministic drift check for the GameStudio repo itself.
// This is the automatable half of the gs-converge skill: it verifies that the
// catalog, skill files, version pins, and release metadata agree.
//
// Usage: node scripts/converge-check.mjs
// Writes production/converge-report.md and exits non-zero on drift.

import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const CATALOG = join(ROOT, "GameStudio Skill Testing Framework", "catalog.yaml");
const SKILLS = join(ROOT, ".agents", "skills");
const problems = [];
const checked = [];

// --- catalog -> skills ---
const raw = readFileSync(CATALOG, "utf8");
const entries = [];
let cur = null;
for (const line of raw.split("\n")) {
  const nm = line.match(/^  - name: (.+)/);
  if (nm) { cur = { name: nm[1].trim() }; entries.push(cur); continue; }
  if (!cur) continue;
  const kv = line.match(/^    ([a-z_]+): (.+)/);
  if (kv) cur[kv[1]] = kv[2].trim().replace(/^"|"$/g, "");
}

const seen = new Set();
for (const e of entries) {
  seen.add(e.name);
  if (!["core", "engine", "reference"].includes(e.tier)) {
    problems.push(`catalog: ${e.name} has invalid tier '${e.tier}'`);
  }
  if (!e.spec) {
    problems.push(`catalog: ${e.name} has no spec path`);
  } else if (!existsSync(join(ROOT, e.spec))) {
    problems.push(`catalog: ${e.name} spec path missing (${e.spec})`);
  }
  // Catalog mixes skill entries and agent-role entries; route by spec path.
  const isAgent = /\/agents\//.test(e.spec || "");
  const source = isAgent
    ? join(ROOT, ".agents", "agents", `${e.name}.md`)
    : join(SKILLS, e.name, "SKILL.md");
  if (!existsSync(source)) {
    problems.push(`catalog: ${e.name} has no ${isAgent ? ".agents/agents/" + e.name + ".md" : ".agents/skills/" + e.name + "/SKILL.md"}`);
    continue;
  }
  const text = readFileSync(source, "utf8");
  const fmBlock = text.match(/^---\n([\s\S]*?)\n---/)?.[1] || "";
  const fmName = fmBlock.match(/^name:\s*(.+)$/m)?.[1]?.trim();
  if (fmName && fmName !== e.name) {
    problems.push(`${isAgent ? "agent" : "skill"} ${e.name}: frontmatter name is '${fmName}'`);
  }
  checked.push(e.name);
}

// --- skills -> catalog ---
for (const dir of readdirSync(SKILLS).filter(d => statSync(join(SKILLS, d)).isDirectory())) {
  if (!seen.has(dir)) problems.push(`skill ${dir} is not in catalog.yaml`);
}

// --- release metadata ---
const version = readFileSync(join(ROOT, "VERSION"), "utf8").trim();
const changelog = readFileSync(join(ROOT, "CHANGELOG.md"), "utf8");
const top = changelog.match(/^## (\d{4}\.\d{2}\.\d{2})/m)?.[1];
if (top !== version) {
  problems.push(`VERSION (${version}) does not match latest CHANGELOG entry (${top ?? "none"})`);
}

// --- engine pins ---
const engineDir = join(ROOT, "docs", "engine-reference");
for (const d of readdirSync(engineDir).filter(d => statSync(join(engineDir, d)).isDirectory())) {
  const v = join(engineDir, d, "VERSION.md");
  if (!existsSync(v)) {
    problems.push(`engine-reference/${d} has no VERSION.md`);
    continue;
  }
  const t = readFileSync(v, "utf8");
  if (!/Verified/i.test(t) || !/\d{4}-\d{2}-\d{2}/.test(t)) {
    problems.push(`engine-reference/${d}/VERSION.md has no verified date`);
  }
}

// --- report ---
const report = [
  "# Converge report",
  "",
  `Generated: ${new Date().toISOString()}`,
  `Catalog entries: ${entries.length}  Skills checked: ${checked.length}`,
  "",
  problems.length ? "## Drift" : "## Drift\n\nNone.",
  ...problems.map((p, i) => `${i + 1}. ${p}`),
  "",
].join("\n");
mkdirSync(join(ROOT, "production"), { recursive: true });
writeFileSync(join(ROOT, "production", "converge-report.md"), report);

if (problems.length) {
  for (const p of problems) console.error("DRIFT:", p);
  console.error(`\n${problems.length} drift item(s). See production/converge-report.md`);
  process.exit(1);
}
console.log(`PASS: ${entries.length} catalog entries, ${checked.length} skills, VERSION ${version}, engine pins present`);
