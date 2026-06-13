# Codex Plugin Packaging

GameStudio includes a local packaging manifest for Codex at
`.codex-plugin/plugin.json`. The manifest records metadata, canonical assets,
adapter paths, hook registry location, and validation commands for
Codex-compatible harnesses.

This is still a project-local packaging surface. It is not a published
marketplace package, it does not install itself into Codex, and it does not
guarantee automatic slash-command exposure.

## Current Model

Use GameStudio by keeping these files in the project repository:

- `AGENTS.md`
- `.agents/`
- `.codex/` for Codex adapter files
- `.codex-plugin/plugin.json` for local packaging metadata
- `.claude/` for Claude Code adapter files
- `.cursor/` for Cursor rules
- `docs/HARNESS-COMPATIBILITY.md` and adapter docs

Skills can always be read as Markdown workflows from `.agents/skills/`. Whether
they appear as slash commands depends on the active harness and adapter loader.
Hooks only run when the harness supports compatible lifecycle hook registration.

## Manifest Contents

`.codex-plugin/plugin.json` records:

- Plugin identity, version, license, and status.
- `AGENTS.md` as the instruction entrypoint.
- `.agents/` as the source of truth.
- `.codex/` as the Codex adapter path.
- Canonical skill, agent, hook, rule, and template locations.
- Validation commands:
  - `python .agents/scripts/validate-compatibility.py`
  - `python .agents/scripts/sync-adapters.py`

## What Is Still Harness-Dependent

A harness or future packaging tool still has to decide how to consume the local
manifest:

- How skills become slash commands, if supported.
- How hook events map to `.codex/hooks.json`.
- How agent definitions in `.codex/agents/*.toml` are registered.
- How install, update, and uninstall preserve user project files.
- Whether a published package registry requires a different schema.

Do not move canonical behavior into `.codex-plugin/`. The manifest points to
`.agents/` and adapter files; it is not the source of truth.

## Sync And Validation

After changing canonical agents, hooks, rules, adapter files, or packaging
metadata, run:

```bash
python .agents/scripts/sync-adapters.py
python .agents/scripts/validate-compatibility.py
```

`sync-adapters.py --write` can refresh governed adapter outputs from `.agents/`.
`validate-compatibility.py` verifies the manifest, adapter sync, hook paths,
README counts, gateway examples, and documentation pointers.
