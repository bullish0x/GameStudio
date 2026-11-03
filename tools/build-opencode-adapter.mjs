#!/usr/bin/env node
// Build the OpenCode V2 adapter from the canonical .agents/ source.
// Usage: node tools/build-opencode-adapter.mjs [--out <dir>] [--dry-run] [--roles core|all]
// Default out: ~/.config/opencode
//
// --roles core  emits only the 12 director/lead roles (smaller catalog, lower
//               per-turn cost). Specialists stay available as gs-* skills.
// --roles all   emits all 55 role subagents (default).

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync, cpSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { join, relative, dirname, basename } from "node:path";

const args = process.argv.slice(2);
const outIdx = args.indexOf("--out");
const OUT = outIdx >= 0 ? args[outIdx + 1] : join(homedir(), ".config", "opencode");
const DRY = args.includes("--dry-run");
const rolesIdx = args.indexOf("--roles");
const ROLES = rolesIdx >= 0 ? args[rolesIdx + 1] : "all";
if (!["core", "all"].includes(ROLES)) {
  console.error("--roles must be 'core' or 'all'");
  process.exit(2);
}
const REPO = process.cwd();
const AGENTS = join(REPO, ".agents");
const SKILLS_SRC = join(AGENTS, "skills");
const AGENTS_SRC = join(AGENTS, "agents");

const SKILL_IDS = new Set(readdirSync(SKILLS_SRC).filter(d => statSync(join(SKILLS_SRC, d)).isDirectory()));

// tier map from catalog.yaml
const catalogRaw = readFileSync(join(REPO, "GameStudio Skill Testing Framework", "catalog.yaml"), "utf8");
const coreSkills = new Set();
let curName = null, curTier = null;
for (const line of catalogRaw.split("\n")) {
  const nm = line.match(/^  - name: (.+)/);
  if (nm) { if (curName && curTier === "core") coreSkills.add(curName); curName = nm[1].trim(); curTier = null; }
  const tm = line.match(/^    tier: (.+)/);
  if (tm) curTier = tm[1].trim();
}
if (curName && curTier === "core") coreSkills.add(curName);
console.log("core skills:", coreSkills.size);
const AGENT_IDS = new Set(readdirSync(AGENTS_SRC).filter(f => f.endsWith(".md")).map(f => f.replace(/\.md$/, "")));

// The 12 director/lead roles kept when --roles core is used.
const CORE_ROLES = new Set([
  "creative-director", "technical-director", "producer",
  "art-director", "audio-director", "narrative-director",
  "lead-programmer", "qa-lead", "localization-lead",
  "game-designer", "systems-designer", "release-manager",
]);
const EMITTED_AGENT_IDS = ROLES === "core"
  ? new Set([...AGENT_IDS].filter(id => CORE_ROLES.has(id)))
  : AGENT_IDS;
if (ROLES === "core") {
  const missing = [...CORE_ROLES].filter(id => !AGENT_IDS.has(id));
  if (missing.length) {
    console.error("core roles missing from .agents/agents:", missing.join(", "));
    process.exit(2);
  }
}
console.log("roles:", ROLES, "(" + EMITTED_AGENT_IDS.size + " agents)");

function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { fm: {}, body: text };
  const fm = {};
  for (const line of m[1].split("\n")) {
    const mm = line.match(/^([a-zA-Z_-]+):\s*(.*)$/);
    if (!mm) continue;
    let v = mm[2].trim();
    if (v.startsWith("[") && v.endsWith("]")) {
      try { v = JSON.parse(v.replace(/'/g, '"')); } catch { v = v.slice(1, -1).split(",").map(s => s.trim().replace(/^['"]|['"]$/g, "")); }
    }
    fm[mm[1]] = v;
  }
  return { fm, body: m[2] };
}

function toolToPerm(t) {
  const map = {
    Read: "read", Glob: "glob", Grep: "grep",
    Write: "edit", Edit: "edit",
    Bash: "shell", Task: "subagent", WebSearch: "websearch",
    AskUserQuestion: null,
  };
  return map[t] ?? null;
}

function write(p, content) {
  if (DRY) { console.log("WRITE", p); return; }
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
}

// 1. Agents
const agentsOut = join(OUT, "agents");
if (!DRY && existsSync(agentsOut)) {
  for (const f of readdirSync(agentsOut)) {
    if (/^gs-.*\.md$/.test(f)) rmSync(join(agentsOut, f), { force: true });
  }
}
let nAgents = 0;
for (const id of EMITTED_AGENT_IDS) {
  const src = join(AGENTS_SRC, id + ".md");
  const raw = readFileSync(src, "utf8");
  const { fm, body } = parseFrontmatter(raw);
  const tools = Array.isArray(fm.tools) ? fm.tools : String(fm.tools || "").split(",").map(s => s.trim()).filter(Boolean);
  const disallowed = Array.isArray(fm.disallowedTools) ? fm.disallowedTools : String(fm.disallowedTools || "").split(",").map(s => s.trim()).filter(Boolean);
  const steps = fm.maxTurns ? parseInt(fm.maxTurns, 10) : 40;
  const allowedPerms = new Set();
  const deniedPerms = new Set();
  for (const t of tools) { const p = toolToPerm(t); if (p) allowedPerms.add(p); }
  for (const t of disallowed) { const p = toolToPerm(t); if (p) deniedPerms.add(p); }
  const permLines = [];
  for (const p of allowedPerms) permLines.push(`  - action: ${p}\n    resource: "**/*"\n    effect: allow`);
  for (const p of deniedPerms) permLines.push(`  - action: ${p}\n    resource: "**/*"\n    effect: deny`);
  // skills the role uses -> allow loading those gs-* skills
  const roleSkills = Array.isArray(fm.skills) ? fm.skills : [];
  for (const s of roleSkills) permLines.push(`  - action: skill\n    resource: "gs-${s}"\n    effect: allow`);
  // all agents can load any gs skill (gamestudio policy) and spawn subagents
  permLines.push(`  - action: skill\n    resource: "gs-*"\n    effect: allow`);
  permLines.push(`  - action: subagent\n    resource: "gs-*"\n    effect: allow`);
  const perms = permLines.length ? "permissions:\n" + permLines.map(l => l).join("\n") : "";
  const out = `---
description: ${JSON.stringify(fm.description || id)}
mode: subagent
color: "#8b5cf6"
steps: ${steps}
${perms}
---

${body.trim()}
`;
  write(join(agentsOut, `gs-${id}.md`), out);
  nAgents++;
}
console.log("agents:", nAgents);

// 2. Skills
const skillsOut = join(OUT, "vendor", "gamestudio", "skills");
// clean (retry: a running watcher can recreate files mid-removal)
if (!DRY && existsSync(skillsOut)) {
  rmSync(skillsOut, { recursive: true, force: true, maxRetries: 8, retryDelay: 150 });
}
const knownIds = [...SKILL_IDS];
// build a regex to rewrite /id references
const idAlt = knownIds.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
const refRe = new RegExp("(^|[^\\w-])/(?:" + idAlt + ")(?![\\w-])", "g");
function rewriteRefs(text) {
  return text.replace(refRe, (m, pre) => {
    // extract the id
    const id = m.slice(pre.length + 1); // after slash
    if (SKILL_IDS.has(id)) return pre + "/gs-" + id;
    return m;
  });
}
let nSkills = 0;
for (const id of SKILL_IDS) {
  const srcDir = join(SKILLS_SRC, id);
  const dstDir = join(skillsOut, `gs-${id}`);
  if (!DRY) mkdirSync(dstDir, { recursive: true });
  // copy supporting files
  for (const f of readdirSync(srcDir)) {
    const sp = join(srcDir, f);
    const st = statSync(sp);
    if (st.isDirectory()) {
      if (!DRY) cpSync(sp, join(dstDir, f), { recursive: true });
    } else if (f !== "SKILL.md") {
      if (!DRY) cpSync(sp, join(dstDir, f));
    }
  }
  const raw = readFileSync(join(srcDir, "SKILL.md"), "utf8");
  const { fm, body } = parseFrontmatter(raw);
  const newFm = { ...fm };
  // tier from catalog? default reference; set autoinvoke based on a core list
  const outBody = rewriteRefs(body);
  // frontmatter: keep name/description; add opencode autoinvoke marker via metadata
  const fmLines = [];
  fmLines.push("---");
  if (fm.name) fmLines.push(`name: ${fm.name}`);
  if (fm.description) fmLines.push(`description: ${fm.description}`);
  // metadata
  fmLines.push("metadata:");
  fmLines.push("  opencode/autoinvoke: " + (coreSkills.has(id) ? "true" : "false"));
  // carry license/compatibility
  if (fm.license) fmLines.push(`license: ${fm.license}`);
  if (fm.compatibility) fmLines.push(`compatibility: ${fm.compatibility}`);
  if (fm["argument-hint"]) fmLines.push(`argument-hint: ${fm["argument-hint"]}`);
  fmLines.push("---");
  const content = fmLines.join("\n") + "\n\n" + outBody.trim() + "\n";
  write(join(dstDir, "SKILL.md"), content);
  nSkills++;
}
console.log("skills:", nSkills);

// 3. Commands
const cmdsOut = join(OUT, "commands");
const pipeline = ["start","help","brainstorm","map-systems","design-system","create-architecture","create-stories","dev-story","code-review","story-done","qa-plan","gate-check","converge","verify"];
for (const c of pipeline) {
  const content = `---
description: GameStudio: ${c}
agent: gamestudio
---
Run the GameStudio ${c} workflow for: $ARGUMENTS
`;
  write(join(cmdsOut, `gs-${c}.md`), content);
}
// dispatcher
write(join(cmdsOut, "gs.md"), `---
description: Run any GameStudio workflow by name
agent: gamestudio
---
Use the GameStudio workflow for: $ARGUMENTS

If no argument is given, run help: read production/session-state/active.md if present, otherwise run project-stage-detect and report the next step.
`);
console.log("commands:", pipeline.length + 1);

// 4. gamestudio primary agent
const conductor = `---
description: "GameStudio production pipeline: ${EMITTED_AGENT_IDS.size} role agents, ${SKILL_IDS.size} skills, path rules, lifecycle hooks. Shift+Tab to select."
mode: primary
color: "#ff6b6b"
steps: 80
permissions:
  - action: skill
    resource: "gs-*"
    effect: allow
  - action: subagent
    resource: "gs-*"
    effect: allow
  - action: read
    resource: "**/*"
    effect: allow
  - action: edit
    resource: "**/*"
    effect: allow
  - action: shell
    resource: "git push *"
    effect: ask
  - action: shell
    resource: "rm -rf *"
    effect: deny
---

You are GameStudio: a full game-development studio operating inside this session.
Follow the studio pipeline and the collaborative protocol in AGENTS.md:
question -> options -> decision -> draft -> approval. You make no commits without
instruction.

## Phase pipeline
Concept -> Systems design -> Architecture -> Pre-production -> Stories ->
Implementation -> QA -> Release. Use /gs <intent> or the gs-* skills.

## Routing
- Design/vision questions -> creative-director, game-designer (gs-creative-director, gs-game-designer)
- Implementation -> lead-programmer then the matching engine specialist
- QA -> qa-lead, qa-tester
- Release -> release-manager, devops-engineer
- If a specialist subagent is not installed (--roles core), do the work in this
  session using the matching gs-* skill instead of delegating.

## Rules
- Load the matching gs-* skill before acting on a workflow.
- Run gs-verify before declaring any task done.
- Run gs-converge before a phase gate.
- Respect path-scoped rules under .agents/rules/.
- Provider/model selection belongs to the harness, not to you.

## Active state
If production/session-state/active.md exists, read it first and resume from it.
`;
write(join(OUT, "agents", "gamestudio.md"), conductor);
console.log("primary agent: gamestudio");

// 5. path-rules plugin
const pluginSrc = join(REPO, ".opencode", "plugins", "gamestudio-guard", "server.ts");
if (existsSync(pluginSrc)) {
  const pluginDst = join(OUT, "plugins", "gamestudio-guard", "server.ts");
  if (!DRY) {
    mkdirSync(dirname(pluginDst), { recursive: true });
    cpSync(pluginSrc, pluginDst);
  }
  console.log("plugin: gamestudio-guard");
}

// 6. manifest
const manifest = {
  version: "2026.11.03",
  generated: new Date().toISOString(),
  roles: ROLES,
  skills: nSkills,
  agents: nAgents + 1,
  commands: pipeline.length + 1,
};
write(join(OUT, "vendor", "gamestudio", "manifest.json"), JSON.stringify(manifest, null, 2));
console.log("manifest written");

// 7. merge global opencode.json (skills entry + gs-* deny for non-gamestudio agents)
const cfgPath = join(OUT, "opencode.json");
if (!DRY && existsSync(cfgPath)) {
  const raw = readFileSync(cfgPath, "utf8");
  let cfg = null;
  try { cfg = JSON.parse(raw); } catch { console.warn("skip opencode.json merge: not valid JSON"); }
  if (cfg) {
    let changed = false;
    const skillPath = join(OUT, "vendor", "gamestudio", "skills");
    const samePath = (p) => String(p).replace(/^~/, homedir()) === skillPath;
    cfg.skills = Array.isArray(cfg.skills) ? cfg.skills : [];
    if (!cfg.skills.some(samePath)) { cfg.skills.push(skillPath); changed = true; }
    cfg.permissions = Array.isArray(cfg.permissions) ? cfg.permissions : [];
    const hasDeny = (action) => cfg.permissions.some(p => p.action === action && p.resource === "gs-*" && p.effect === "deny");
    for (const action of ["skill", "subagent"]) {
      if (!hasDeny(action)) { cfg.permissions.push({ action, resource: "gs-*", effect: "deny" }); changed = true; }
    }
    if (changed) {
      const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
      const backup = `${cfgPath}.bak.${stamp}`;
      writeFileSync(backup, raw);
      writeFileSync(cfgPath, JSON.stringify(cfg, null, 2) + "\n");
      console.log("merged opencode.json (backup:", backup + ")");
    } else {
      console.log("opencode.json already configured");
    }
  }
}
