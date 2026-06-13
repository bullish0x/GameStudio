# Plugin Packaging

GameStudio includes local packaging manifests for Codex and Claude Code:

- `.codex-plugin/plugin.json`
- `.claude-plugin/plugin.json`

These manifests record metadata, canonical assets, adapter paths, hook registry
locations, and validation commands for compatible harnesses.

This is still a project-local packaging surface. The manifests are not published
marketplace packages, they do not install themselves into Codex or Claude Code,
and they do not guarantee automatic slash-command exposure.

## Current Model

Use GameStudio by keeping these files in the project repository:

- `AGENTS.md`
- `CLAUDE.md` when using Claude Code
- `.agents/`
- `.codex/` for Codex adapter files
- `.codex-plugin/plugin.json` for local Codex packaging metadata
- `.claude/` for Claude Code adapter files
- `.claude-plugin/plugin.json` for local Claude packaging metadata
- `.cursor/` for Cursor rules
- `docs/HARNESS-COMPATIBILITY.md` and adapter docs

Skills can always be read as Markdown workflows from `.agents/skills/`. Whether
they appear as slash commands depends on the active harness and adapter loader.
Hooks only run when the harness supports compatible lifecycle hook registration.

## Manifest Contents

Both manifests record:

- Plugin identity, version, license, and status.
- The instruction entrypoint for the target harness.
- `.agents/` as the source of truth.
- Adapter paths for the target harness.
- Canonical skill, agent, hook, rule, and template locations.
- Validation commands:
  - `python .agents/scripts/validate-compatibility.py`
  - `python .agents/scripts/sync-adapters.py`

Codex-specific metadata lives in `.codex-plugin/plugin.json` and points to
`.codex/`. Claude-specific metadata lives in `.claude-plugin/plugin.json` and
points to `.claude/`.

## What Is Still Harness-Dependent

A harness or future packaging tool still has to decide how to consume each local
manifest:

- How skills become slash commands, if supported.
- How hook events map to `.codex/hooks.json` or `.claude/settings.json`.
- How agent definitions are registered.
- How install, update, and uninstall preserve user project files.
- Whether a published package registry requires a different schema.

Do not move canonical behavior into `.codex-plugin/` or `.claude-plugin/`. The
manifests point to `.agents/` and adapter files; they are not the source of
truth.

## Sync And Validation

After changing canonical agents, hooks, rules, adapter files, or packaging
metadata, run:

```bash
python .agents/scripts/sync-adapters.py
python .agents/scripts/validate-compatibility.py
```

`sync-adapters.py --write` can refresh governed adapter outputs from `.agents/`.
`validate-compatibility.py` verifies both manifests, adapter sync, hook paths,
README counts, gateway examples, installer payload coverage, and documentation
pointers.
