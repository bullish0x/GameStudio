# Codex Adapter

GameStudio's Codex support is a project-local adapter, not an installed Codex
plugin. The canonical workflow remains in `.agents/`; `.codex/` only translates
the pieces that Codex-style harnesses can consume directly.

## What Codex Reads

- `AGENTS.md` is the primary instruction entrypoint.
- `.agents/skills/<name>/SKILL.md` is the canonical skill workflow source.
- `.agents/agents/*.md` is the canonical role source.
- `.agents/hooks/` and `.agents/hooks.json` are the canonical hook source and
  registry.
- `.agents/rules/` is the canonical path-scoped standards source.
- `.codex/agents/*.toml` adapts canonical agents into Codex agent definitions.
- `.codex/hooks.json` maps Codex lifecycle events to `.codex/hooks/*.sh`.

Codex does not currently get a duplicate `.codex/skills/` tree in this repo.
When a user invokes a slash-style workflow such as `/dev-story`, the harness or
agent should open the matching canonical `.agents/skills/dev-story/SKILL.md` and
follow it. Slash-command exposure depends on the active Codex harness or plugin
loader; the Markdown workflow is always available.

## Hooks

`.codex/hooks.json` references Bash hook scripts in `.codex/hooks/`. Those files
are adapter copies of `.agents/hooks/` with path references adjusted for the
Codex adapter. The Codex adapter intentionally omits `notify.sh` because that
hook is a Claude notification event adapter and not part of the current Codex
hook mapping.

On Windows, these hooks require a usable Bash environment such as Git Bash. If a
machine resolves `bash` to WSL and WSL is blocked, shell syntax validation will
report a warning locally. CI still validates syntax on Ubuntu.

## Sync Rules

Do not edit `.codex/` as an independent workflow fork. Change canonical behavior
under `.agents/`, then update the Codex adapter only where the harness format
requires it.

Run:

```bash
python .agents/scripts/validate-compatibility.py
```

The validator checks that Codex agents map to canonical agents, Codex hook
references exist, README counts match the canonical tree, and the adapter
manifest documents intentional gaps.

## Local Plugin Manifest

`.codex-plugin/plugin.json` records local packaging metadata for Codex-compatible
harnesses: canonical assets, adapter paths, hook registry, and validation
commands. It is not a published marketplace package and does not guarantee
automatic slash-command exposure. See `docs/PLUGIN_PACKAGING.md`.
