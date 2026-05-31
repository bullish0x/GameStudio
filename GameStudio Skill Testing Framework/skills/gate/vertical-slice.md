# Skill Test Spec: /vertical-slice

> **Category**: gate · **Skill type**: workflow · **Spec written**: 2026-05-29

## Skill Summary
A multi-phase Pre-Production validation workflow that builds a near-production-quality end-to-end game loop to confirm the full [start → challenge → resolution] cycle is achievable before committing to Production. The skill resolves a review mode (full/lean/solo), loads GDD and architecture context, defines a falsifiable validation question, scopes 3–5 minutes of polished gameplay with explicit scope-cut discipline, plans and implements the slice in `prototypes/[concept-name]-vertical-slice/` with quality standards above a prototype, runs a structured playtest debrief (6 questions asked one at a time), generates a velocity-logged report, optionally gates through a Creative Director review (full mode only), and outputs a PROCEED / PIVOT / KILL verdict with mode-specific follow-on instructions including PIVOT-NOTE.md and GRAVEYARD.md for non-PROCEED outcomes.

## Static Assertions (`/skill-test static`)
- [ ] Frontmatter has `name: vertical-slice` and a `description`
- [ ] Frontmatter has `argument-hint: "[--review full|lean|solo]"`
- [ ] Body contains at least 2 phase headings (e.g., `## Phase 1`, `## Phase 2`, etc.)
- [ ] Verdict keywords PROCEED, PIVOT, and KILL all appear in the body
- [ ] "May I write" language appears in Phase 4 (implementation) asking permission to create the slice directory
- [ ] "May I write this report" language appears in Phase 6 asking permission before writing REPORT.md
- [ ] `user-invocable: true` is set in frontmatter
- [ ] `agent: prototyper` and `isolation: worktree` are set in frontmatter

## Content Coverage Assertions (`/skill-test spec`)
- [ ] Phase 1 describes resolving review mode from argument, file, or default (`lean`)
- [ ] Phase 2 defines the falsifiable validation question template including both player experience and build feasibility parts
- [ ] Phase 2 specifies the target scope as 3–5 minutes of polished continuous gameplay with scope-cut-before-quality-cut guidance
- [ ] Phase 3 requires specifying a hard time limit in days and asking for user confirmation before building
- [ ] Phase 3 requires writing a session checkpoint to `production/session-state/active.md` as the primary recovery mechanism
- [ ] Phase 4 specifies that every file must begin with a `// VERTICAL SLICE - NOT FOR PRODUCTION` comment block
- [ ] Phase 4 defines a Day 3 sunk cost checkpoint: if the full loop is not demonstrable, stop and surface the blocker
- [ ] Phase 5 prescribes exactly 6 playtest debrief questions (loop completion, time check, core fantasy, blockers, pipeline check, verdict)
- [ ] Phase 6 specifies a velocity log as mandatory in the report (day-by-day actual progress)
- [ ] Phase 7 specifies that Creative Director review is skipped in `solo` and `lean` modes and only spawned in `full` mode
- [ ] Phase 8 PIVOT path asks two carry-forward questions and writes a `PIVOT-NOTE.md`
- [ ] Phase 8 KILL path provides a 5-item checklist to confirm the verdict is sound before writing to `GRAVEYARD.md`
- [ ] Important Constraints section states slice code must NEVER be refactored into production

## Version Awareness
- [ ] The skill is a studio workflow with no library dependencies. Verify that `production/review-mode.txt`, `.agents/docs/director-gates.md`, and `.agents/docs/templates/vertical-slice-report.md` all exist in the project before running the skill; the skill falls back gracefully when the template is missing.

## Known Gaps / Notes
- The skill explicitly notes that networked/multiplayer games cannot validate network feel locally — the slice can only validate the game loop; network feel requires real peers or simulated latency.
- The Creative Director review in Phase 7 uses a `Task` tool to spawn the `creative-director` agent; the gate identifier `CD-PLAYTEST` must exist in `director-gates.md` for this path to succeed.
- Playtesting guidance includes Wizard-of-Oz technique, think-aloud protocol, and async Loom/OBS recording as alternatives when live testers are unavailable — these are advisory, not required.
