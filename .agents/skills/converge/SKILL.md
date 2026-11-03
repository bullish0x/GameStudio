---
name: converge
description: "Terminal drift check after a change set: compare GDDs, ADRs, control manifest, and stories against the current implementation and report what has drifted. Run after /story-done or before a milestone review. Surfaces undocumented behavior, stale docs, and missing tests."
argument-hint: "[scope: all | system:<name> | files]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Bash
---

# Converge

Close the loop. GameStudio's pipeline creates docs first, then code; reality diverges.
This skill detects divergence and produces a numbered drift report.

## What to check

1. **GDD vs code**: every acceptance criterion in `design/gdd/*.md` that is marked
   done in `production/epics/` must have a corresponding implementation path
   under `src/` and a test under `tests/`. Missing → drift.
2. **ADR vs code**: every rule in `docs/architecture/control-manifest.md` must be
   enforceable by a grep over `src/`. A rule with no matching code pattern or
   test → drift.
3. **Story status vs git**: a story marked Done must have commits touching its
   listed files after its created date. Otherwise → drift.
4. **Version pins**: `docs/engine-reference/*/VERSION.md` pins must match the
   versions actually installed (package.json / project.godot / *.csproj / *.uproject).
   Mismatch → drift.
5. **Templates**: every GDD in `design/gdd/` must follow the 8-section template.

## Output

Write `production/converge-report-<date>.md` with sections:
- Summary (counts: drift items, clean items)
- Drift items numbered, each with file:line, why, suggested fix
- Clean items (brief)
- Recommended next action

## Rules

- Read-only: never edit source. Report only.
- If no drift found, say so explicitly and recommend advancing the phase.
- Do not invent drift: every item must cite a concrete file path and evidence.

Verdict: PASS (no drift) / CONCERNS (documentation drift) / FAIL (behavioral drift
without tests).
