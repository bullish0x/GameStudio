# PLAN: GameStudio × OpenCode V2 mode + 2026 upgrade

Status: phase 1 shipped. Phase 2 complete.

## Phase 1 (done)
- [x] OpenCode adapter + gamestudio primary agent + 55 subagents + 184 skills
- [x] Engine pins refreshed
- [x] converge/verify skills, EARS, workflows, tiering, validator + CI
- [x] Global install + headless verification

## Phase 2 checklist
- [x] S4. Generator `--roles core|all` subset flag (12 core roles / 55 all)
- [x] S6. Converge drift check in CI (`scripts/converge-check.mjs`)
- [x] S7. `scripts/check-engine-pins.mjs` (three/r3f/drei as one unit)
- [x] S5. Lean `AGENTS.md` + `.agents/docs/agent-core.md`
- [x] S1. End-to-end gamestudio run on a scratch game project
- [x] S3. Skill trigger-eval harness (`tools/skill-trigger-evals.json`, `scripts/skill-trigger-eval.mjs`)

## Locked decisions
- Approach 3: generated OpenCode adapter; `.agents/` canonical.
- Skills prefixed `gs-` only in the adapter.
- 18 core skills advertised (added converge + verify); rest on demand.
- CI runs deterministic checks; live trigger eval stays manual (calls a model).
- `--roles core` keeps 12 director/lead roles; specialists remain skills.

## Phase 2 evidence
- `node scripts/validate-skills.mjs` → PASS 184 / FAIL 0
- `node scripts/converge-check.mjs` → PASS 239 catalog entries / 239 skills
- `node scripts/check-engine-pins.mjs` → PASS 0.187.0 / 9.8.2 / 10.7.9
- `node scripts/skill-trigger-eval.mjs --static` → PASS 18 core / 90 queries
- `node scripts/skill-trigger-eval.mjs --live` → 100.0% (90/90), threshold 80%
  - all 18 core skills scored 5/5 after disambiguating one eval query
- `node tools/build-opencode-adapter.mjs --roles core --out <tmp>` → 12 agents + primary
- S1 scratch project `/tmp/opencode/gs-game`:
  - `/gs start` wrote `production/stage.txt` (Concept) and `production/review-mode.txt` (lean)
  - `/gs brainstorm` wrote a complete `design/gdd/game-concept.md` (229 lines, verdict drafted)
  - `/gs design-review` spawned 9 `gs-*` specialist subagents, returned a senior
    synthesis and `NEEDS REVISION` verdict, wrote no files (read-only held),
    and degraded cleanly when an interactive question was unavailable
  - guard plugin runtime-tested: writing `.env` was refused with
    "GameStudio: refusing to write environment files"
