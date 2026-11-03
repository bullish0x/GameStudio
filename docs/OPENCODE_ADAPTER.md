# OpenCode Adapter

GameStudio ships a first-class OpenCode V2 adapter under `.opencode/` plus a
generator at `tools/build-opencode-adapter.mjs`.

## Install (global)

```sh
cd /path/to/gamestudio
node tools/build-opencode-adapter.mjs                 # all 55 roles (default)
node tools/build-opencode-adapter.mjs --roles core    # 12 director/lead roles
```

`--roles core` keeps the catalog small for lower per-turn cost; the remaining
specialists are still available as `gs-*` skills and the primary agent handles
their work directly. Switching modes cleans stale `gs-*.md` agents first.

This creates:
- `~/.config/opencode/agents/gamestudio.md` — primary agent (Shift+Tab to select)
- `~/.config/opencode/agents/gs-*.md` — role subagents (55 or 12)
- `~/.config/opencode/vendor/gamestudio/skills/gs-*/SKILL.md` — 184 skills (18 core advertised, rest on demand)
- `~/.config/opencode/commands/gs*.md` — dispatcher + pipeline commands
- `~/.config/opencode/plugins/gamestudio-guard/server.ts` — path rules

The generator also merges `skills` + `permissions` into `~/.config/opencode/opencode.json`
(backed up first). Global permissions deny `gs-*` skills/subagents by default; the
`gamestudio` agent re-allows them, so `build` and `plan` are unaffected.

## Install (project)

```sh
bash install.sh install /path/to/game
```

copies `.opencode/` (commands, plugin, project config with `default_agent: gamestudio`)
into the project, so GameStudio is the default agent only there.

## Usage

- Switch: `Shift+Tab` cycles `build → gamestudio → plan`; or `/agents`.
- Run a workflow: `/gs <intent>` (e.g. `/gs brainstorm`, `/gs dev-story path`).
- Engine pins: `docs/engine-reference/*/VERSION.md`.

## Validation

```sh
node scripts/validate-skills.mjs       # structural skill lint
node scripts/converge-check.mjs        # catalog <-> skills <-> VERSION <-> pins drift
node scripts/check-engine-pins.mjs     # three / R3F / drei compatibility
node scripts/skill-trigger-eval.mjs --static
node scripts/skill-trigger-eval.mjs --live --only gate-check   # routing accuracy
```

CI runs the first four on every pull request (`.github/workflows/skills.yml`).
The live trigger eval is manual because it calls a model.

## Uninstall

```sh
bash install.sh uninstall /path/to/game   # project
# global: remove ~/.config/opencode/vendor/gamestudio, agents/gs-*.md,
# commands/gs*.md, plugins/gamestudio-guard, and restore the opencode.json backup
```
