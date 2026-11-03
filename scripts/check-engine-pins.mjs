#!/usr/bin/env node
// Verify the web 3D stack is pinned as one compatible unit.
//
// Two modes:
//   1. Inside a game project (package.json present): compare the installed
//      declared versions against the reference pins and check the R3F peer range.
//   2. Inside the GameStudio repo: verify the reference pin table itself is
//      internally consistent (same verified date, compatible majors).
//
// Usage: node scripts/check-engine-pins.mjs [--project <dir>]
// Exits non-zero on any inconsistency.

import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const projIdx = args.indexOf("--project");
const PROJECT = projIdx >= 0 ? resolve(args[projIdx + 1]) : process.cwd();
const REPO = resolve(new URL("..", import.meta.url).pathname);
const PINS = join(REPO, "docs", "engine-reference", "web3d", "VERSION.md");

const problems = [];
const notes = [];

function semver(v) {
  const m = String(v).match(/(\d+)\.(\d+)\.(\d+)/);
  return m ? { major: +m[1], minor: +m[2], patch: +m[3], raw: m[0] } : null;
}

// Parse the reference table.
const text = readFileSync(PINS, "utf8");
const rows = {};
for (const line of text.split("\n")) {
  const m = line.match(/^\|\s*`([^`]+)`\s*\|\s*`([^`]+)`\s*\|\s*([0-9-]+)\s*\|/);
  if (m) rows[m[1]] = { version: m[2], verified: m[3] };
}
for (const pkg of ["three", "@react-three/fiber", "@react-three/drei"]) {
  if (!rows[pkg]) problems.push(`reference pin missing for ${pkg} in ${PINS}`);
}
if (problems.length === 0) {
  const trio = ["three", "@react-three/fiber", "@react-three/drei"];
  const dates = new Set(trio.map(p => rows[p].verified));
  if (dates.size !== 1) {
    problems.push(
      `three / R3F / drei verified dates differ (${trio.map(p => `${p}=${rows[p].verified}`).join(", ")}) — bump them as one unit`,
    );
  }
  for (const p of trio) {
    if (!semver(rows[p].version)) problems.push(`unparseable version for ${p}: ${rows[p].version}`);
  }
  const three = semver(rows["three"].version);
  const r3f = semver(rows["@react-three/fiber"].version);
  const drei = semver(rows["@react-three/drei"].version);
  if (three && three.major !== 0) problems.push(`three pin ${rows["three"].version} is not a 0.x release`);
  if (r3f && r3f.major !== 9) problems.push(`R3F pin ${rows["@react-three/fiber"].version} is not on the 9.x line`);
  if (drei && drei.major !== 10) problems.push(`drei pin ${rows["@react-three/drei"].version} is not on the 10.x line`);
}

// Project mode: compare declared versions against the pins.
const pkgPath = join(PROJECT, "package.json");
if (existsSync(pkgPath)) {
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
  for (const name of ["three", "@react-three/fiber", "@react-three/drei"]) {
    if (!deps[name]) {
      notes.push(`${name} not declared in ${pkgPath} — skipping project comparison`);
      continue;
    }
    const declared = semver(deps[name]);
    const pinned = semver(rows[name]?.version);
    if (!declared) {
      notes.push(`${name} declared as ${deps[name]} (range) — pin it to ${rows[name]?.version} for reproducibility`);
      continue;
    }
    if (pinned) {
      // three is 0.x, so the minor version is the compatibility line.
      const sameLine = pinned.major === 0
        ? declared.major === 0 && declared.minor === pinned.minor
        : declared.major === pinned.major;
      if (!sameLine) {
        problems.push(`${name} is ${deps[name]} but reference is ${rows[name].version} (incompatible line)`);
      }
    }
  }
  // R3F peer range must accept the installed three version.
  const r3fPkg = join(PROJECT, "node_modules", "@react-three", "fiber", "package.json");
  if (existsSync(r3fPkg) && deps["three"]) {
    const r3fMeta = JSON.parse(readFileSync(r3fPkg, "utf8"));
    const peer = r3fMeta.peerDependencies?.three;
    if (peer) {
      const installed = semver(deps["three"]);
      const floor = semver(peer);
      if (installed && floor && installed.major === 0 && installed.minor < floor.minor) {
        problems.push(`installed three ${deps["three"]} is below R3F peer range (${peer})`);
      }
      notes.push(`R3F peerDependencies.three = ${peer}`);
    }
  }
} else {
  notes.push(`no package.json in ${PROJECT} — checked reference pins only`);
}

if (notes.length) for (const n of notes) console.log("note:", n);
if (problems.length) {
  for (const p of problems) console.error("FAIL:", p);
  process.exit(1);
}
console.log(`PASS: three/R3F/drei pins are one consistent unit (${rows["three"].version}, ${rows["@react-three/fiber"].version}, ${rows["@react-three/drei"].version})`);
