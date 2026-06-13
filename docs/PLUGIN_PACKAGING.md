# Codex Plugin Packaging

GameStudio is not currently packaged as a Codex plugin. It is a project-local
game-agent framework that works through repository instructions, canonical
`.agents/` assets, and harness adapter folders.

## Current Model

Use GameStudio by keeping these files in the project repository:

- `AGENTS.md`
- `.agents/`
- `.codex/` for Codex adapter files
- `.claude/` for Claude Code adapter files
- `.cursor/` for Cursor rules
- `docs/HARNESS-COMPATIBILITY.md` and adapter docs

Skills can always be read as Markdown workflows from `.agents/skills/`. Whether
they appear as slash commands depends on the active harness and adapter loader.
Hooks only run when the harness supports compatible lifecycle hook registration.

## What A Real Codex Plugin Would Need

A packaged Codex plugin would require at least:

- `.codex-plugin/plugin.json` with plugin name, version, entrypoints, and
  compatibility metadata.
- Curated skill exposure that maps canonical `.agents/skills/<id>/SKILL.md`
  files to Codex-visible commands or skills.
- Hook registration metadata that maps lifecycle events to supported hook
  scripts and documents unsupported events.
- Agent registration metadata for `.agents/agents/*.md` or generated Codex
  agent definitions.
- Packaging rules that decide which canonical docs, templates, rules, and
  validation scripts are included.
- Sync or generation tooling so plugin artifacts cannot drift from `.agents/`.
- Install, update, and uninstall semantics that preserve user project files and
  MIT license metadata.

Until those pieces exist, do not claim that GameStudio can be installed as a
Codex plugin. The current `.codex/` folder is only a project-local adapter.

## Future Guardrails

When plugin packaging is added, keep `.agents/` canonical. The plugin manifest
should point to generated or mapped artifacts, not become the source of truth.
The compatibility validator should be extended to check `.codex-plugin/` in the
same way it currently checks `.codex/`, `.claude/`, and `.cursor/`.
