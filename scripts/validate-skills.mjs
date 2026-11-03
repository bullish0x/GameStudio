#!/usr/bin/env node
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const SKILLS = join(ROOT, ".agents", "skills");
const ids = readdirSync(SKILLS).filter(d => statSync(join(SKILLS, d)).isDirectory());
// core skill set from catalog.yaml
const catalogCore = new Set();
try {
  const raw = readFileSync(join(ROOT, "GameStudio Skill Testing Framework", "catalog.yaml"), "utf8");
  let cur = null, tier = null;
  for (const line of raw.split("\n")) {
    const nm = line.match(/^  - name: (.+)/);
    if (nm) { if (cur && tier === "core") catalogCore.add(cur); cur = nm[1].trim(); tier = null; }
    const tm = line.match(/^    tier: (.+)/);
    if (tm) tier = tm[1].trim();
  }
  if (cur && tier === "core") catalogCore.add(cur);
} catch {}
const VERDICTS = ["PASS","FAIL","CONCERNS","APPROVED","BLOCKED","COMPLETE","READY","COMPLIANT","NON-COMPLIANT"];
let pass=0, fail=0; const rows=[];
for (const id of ids) {
  const p = join(SKILLS, id, "SKILL.md");
  let text; try { text = readFileSync(p,"utf8"); } catch { rows.push({id,status:"FAIL",reason:"missing SKILL.md"}); fail++; continue; }
  const fm = text.match(/^---\n([\s\S]*?)\n---/)?.[1] || "";
  const reasons=[];
  // Core pipeline skills require full compliance; reference/engine skills only need name+description.
  const isCore = catalogCore.has(id);
  const required = isCore
    ? ["name:","description:","argument-hint:","user-invocable:","allowed-tools:"]
    : ["name:","description:"];
  for (const f of required) {
    if (!fm.includes(f)) reasons.push("missing "+f);
  }
  if (isCore) {
    const headings = (text.match(/^## .+/gm) || []).length;
    if (headings < 2) reasons.push("fewer than 2 ## headings");
    if (!VERDICTS.some(v => text.includes(v))) reasons.push("no verdict keyword");
    const toolsLine = fm.match(/allowed-tools:\s*(.+)/)?.[1] || "";
    if (/Write|Edit/.test(toolsLine) && !/May I write|before writing|approval/i.test(text)) reasons.push("Write/Edit without ask-before-write");
    const tail = text.slice(-600);
    if (!/\/[a-z-]+/.test(tail)) reasons.push("no next-step handoff");
    // line count is advisory only
  }
  if (reasons.length) { fail++; rows.push({id,status:"FAIL",reason:reasons.join("; ")}); }
  else { pass++; rows.push({id,status:"PASS",reason:""}); }
}
const summary = "# Skill validation report\n\nGenerated: " + new Date().toISOString() + "\nSkills: " + ids.length + "  PASS: " + pass + "  FAIL: " + fail + "\n\n" +
  rows.filter(r=>r.status==="FAIL").map(r=>"- "+r.id+": "+r.reason).join("\n") + "\n";
mkdirSync(join(ROOT,"production"),{recursive:true});
writeFileSync(join(ROOT,"production","skill-validation-report.md"), summary);
console.log("PASS " + pass + " / FAIL " + fail + " / total " + ids.length);
if (fail>0) { console.log("See production/skill-validation-report.md"); process.exit(1); }