# GameStudio × OpenCode V2: `gamestudio` mode + 2026 upgrade

Date: 2026-11-03
Status: proposed
Repo: `/root/repos/GameStudio` (upstream `bullish0x/GameStudio`, MIT, v2026.06.01)

## Intent

Make GameStudio usable as a **third primary agent** in OpenCode V2 alongside the
built-in `build` and `plan`, and upgrade the framework to the current state of the
art (Nov 2026) while keeping its 55 roles / 182 skills structure.

Success: `Shift+Tab` (or `/agents`) reaches `build → gamestudio → plan`; selecting
`gamestudio` loads the studio workflow, its roles, its skills and its path rules,
and none of that leaks into `build` or `plan`.

## What exists today

- Provider-neutral source in `.agents/` (agents, skills, hooks, rules, docs, templates).
- Adapters for Claude (`.claude/`) and Codex (`.codex/`) only.
- `install.sh` copies a tracked "studio brain" into a project, manifest-based.
- 13 lifecycle hooks are shell scripts registered by `.agents/hooks.json`.
- Every engine pin is stale: Godot 4.6→4.7.2, Unity 6.3.0→6000.3.27f2,
  UE 5.7→5.8.4, three 0.184→0.187, R3F 9.6.1→9.8.2, drei 10.7.7→10.7.9,
  Phaser 4.1.0→4.2.1, PixiJS 8.18.1→8.22.0.
- The eval framework exists but has recorded 0/182 results; CI only runs a
  compatibility check.

## Constraints (verified)

- OpenCode V2 agent shape: `agents.<id>` with `mode`, `system`, `permissions`,
  `color`, `steps`. V1 keys (`prompt`, `permission`, `tools`) are deprecated.
- Agent switching is **Shift+Tab** (Tab is session tabs). Registry order is
  alphabetical by ID, so `gamestudio` sits between `build` and `plan`.
- Skills are registered globally but **advertised per agent** by `skill`
  permission. Global deny + agent-level allow works (last match wins).
- No rule match ⇒ `ask`. Every agent needs an explicit terminal rule.
- A skill's ID is path-derived. To scope 182 skills with one glob they must
  share a `gs-` prefix. `allowed-tools` is not an OpenCode field.
- V2 plugin hooks: `ctx.tool.hook("execute.before")` can throw to block an edit;
  `ctx.permission.hook("evaluate")` cannot undo an explicit config deny.
- `request` is parsed but not sent in V2; do not use it for temperature.

## Approaches considered

1. **Direct install, no adapter (rejected).** Point `skills` at
   `.agents/skills` and copy agents as-is. Cheapest, but 182 IDs collide with
   existing global skills (`prototype`, `code-review`, `help`, `start`), and
   55 subagents + 182 skills flood every agent's prompt.
2. **Project-local only (rejected).** Install per game project. Safe, but the
   user asked for a mode next to `build`/`plan`, which is global state.
3. **Generated OpenCode adapter (chosen).** Keep `.agents/` canonical; generate
   a prefixed, permission-scoped OpenCode tree from it. One build step, no
   hand-editing 182 skills, collisions impossible, `build`/`plan` unaffected.

## Design

### 1. Canonical source stays put

`.agents/` is not rewritten. A generator produces the OpenCode adapter:

```
tools/build-opencode-adapter.mjs
  .agents/skills/<id>/SKILL.md        -> .opencode/generated/skills/gs-<id>/SKILL.md
  .agents/agents/<id>.md              -> .opencode/generated/agents/gs-<id>.md
  .agents/skills/catalog.yaml         -> tier metadata for advertisement
```

Rules:
- Rewrite only `/<known-skill-id>` references in skill bodies to `/gs-<id>`
  using the exact ID set, so prose is untouched.
- Agent frontmatter maps `tools:`/`disallowedTools:` to `permissions:` rules,
  `skills:` to allowed `gs-*` IDs, `maxTurns:` to `steps:`.
- Emit a report of anything that could not be mapped.

### 2. `gamestudio` primary agent

`~/.config/opencode/agents/gamestudio.md`:

- `mode: primary`, `color: #ff6b6b`, `steps: 80`.
- System prompt = studio conductor: phase pipeline, gate discipline
  (question → options → decision → draft → approval), routing table to roles,
  and "load the matching `gs-*` skill before acting".
- Permissions: allow `skill gs-*`, `subagent gs-*`; deny everything else;
  `edit` allowed in project, `ask` on `git push`/destructive shell.
- Project instructions (`AGENTS.md`), skills and references still apply.

### 3. Roles as subagents

All 55 roles become `gs-<role>` subagents, scoped to `gamestudio` only via
`subagent` permissions. `build`/`plan` keep the global deny, so they never see
55 extra descriptions. Roles keep their own tool restrictions.

### 4. Skills: tiered advertisement

`catalog.yaml` gains `tier: core | engine | reference`.
- `core` (~40 pipeline skills) advertised to `gamestudio`.
- `engine`/`reference` registered and loadable by exact ID, not advertised
  (`metadata.opencode/autoinvoke: false` in the generated copy only).
- One dispatcher command `/gs <intent>` plus `/gs-start`, `/gs-help`,
  `/gs-next`; no 182 command files.

### 5. Hooks → one V2 plugin

`~/.config/opencode/plugins/gamestudio-guard/` ports the deterministic hooks:
- `execute.before`: enforce path-scoped rules for `src/**`, `docs/**`,
  `design/**`; block writes to `.env*`; require a story file before edits to
  `src/**` in `full` review mode.
- `session.prompt`: inject `production/session-state/active.md` when present.
- Keep validation scripts in `.agents/hooks/` as the single implementation;
  the plugin shells out to them so behaviour stays identical across harnesses.

### 6. Upgrade content (evidence-based, bounded)

| # | Change | Why |
|---|---|---|
| 1 | Refresh all 8 engine pins + migration notes in `docs/engine-reference/*/VERSION.md` | Every pin is stale; agents generate removed APIs |
| 2 | Fix false "verified" dates on web pins | Pins were dated later than their real publish dates |
| 3 | Add EARS acceptance criteria to the story template + property-test mapping | Kiro pattern: machine-checkable criteria |
| 4 | Add `gs-converge` skill: docs↔code drift check as a terminal phase | Spec Kit's 2026 converge phase |
| 5 | Add `.agents/workflows/studio.yaml`: resumable pipeline with typed steps and approve/reject gates | Gates as data, not prose |
| 6 | Add `tier` to `catalog.yaml`; generate the tiered adapter | 12.1k always-on tokens today |
| 7 | Run the existing skill validator over 182 skills; record results; add CI gate | 0/182 results recorded |
| 8 | Shrink root `AGENTS.md` to non-inferable guardrails + pointers | 2026 evidence: repo overviews add cost, not success |
| 9 | Add `gs-verify` skill: run the project's real build/typecheck/test as an acceptance check | Verification is the highest-leverage practice |

Not in scope: rewriting the 182 skill bodies, collapsing the 55 roles,
inventing engine MCP servers, provider/model choices.

### 7. Install and rollback

- Global install writes only under `~/.config/opencode/vendor/gamestudio/`,
  `agents/gamestudio.md`, `agents/gs-*.md`, `commands/gs*.md`,
  `plugins/gamestudio-guard/`, and a **backed-up, merged** `opencode.json`.
- Back up `opencode.json` to `opencode.json.bak.<timestamp>` before merging.
- `uninstall.sh` removes exactly what was recorded in a manifest.
- Project install remains `install.sh install <dir>` and gains an
  `--opencode` flag that also writes `.opencode/` assets + `default_agent`.

## Acceptance checks

1. `opencode debug agents` lists `gamestudio` with `mode: primary`, and lists
   `gs-*` subagents; `build`/`plan` have `skill gs-* → deny`.
2. `opencode debug config` (in a scratch dir) shows the skills entry, the
   global deny and the gamestudio allow, with the config still valid JSON.
3. Every generated `SKILL.md` and agent file parses; zero duplicate IDs; zero
   unresolved `/gs-*` references; generator report is empty.
4. The skill validator runs over all 182 and writes results to
   `GameStudio Skill Testing Framework/catalog.yaml`; CI step fails on error.
5. `bash install.sh install /tmp/gs-test` produces a clean tree and
   `bash install.sh uninstall /tmp/gs-test` leaves no tracked files.
6. `docs/engine-reference/*/VERSION.md` match the researched table, with source
   URLs and a "verified 2026-11-03" stamp.
7. `bash uninstall.sh` restores the backed-up `opencode.json` byte-for-byte.

## Open risks

- OpenCode V2 `hidden` behaviour for primary agents is unverified; the design
  never relies on it.
- Subagent catalog cost for 55 roles is untested; if it hurts, the generator
  can emit only the 12 director/lead roles and keep specialists as skills.
- Rewriting `/id` references could miss variants (`/id` vs `id`); the
  generator reports every rewrite for review.
- Upstream GameStudio may ship its own OpenCode adapter later; ours is additive
  and lives in `.opencode/` + `tools/`.
