# Changelog

GameStudio release history and migration details live in `UPGRADING.md`.

## 2026.11.03

- Added OpenCode V2 adapter: `gamestudio` primary agent (Shift+Tab) next to `build`/`plan`, 55 role subagents, 184 prefixed skills, dispatcher commands, and a path-rules plugin.
- Refreshed all 8 engine pins to current stable (Godot 4.7.2, Unity 6000.3.27f2, UE 5.8.4, three 0.187.0, R3F 9.8.2, drei 10.7.9, Phaser 4.2.1, PixiJS 8.22.0) with migration notes.
- Added `converge` drift-check skill, `verify` acceptance-check skill, EARS acceptance criteria guidance, declarative `studio.yaml` workflow with gates, skill tiering, and validation tooling: static skill lint, catalog drift check, engine-pin compatibility check, and a skill trigger-eval harness, all gated in CI.
- Shrank always-on skill catalog cost via tiered advertisement (18 core, rest on demand).

## 2026.06.01

- Added provider-neutral harness compatibility assets.
- Added Agent Harness Launcher companion integration.
- Added optional install helper for `agent-launch`.
- Hardened launcher install fallback behavior across Windows, WSL, and Python environments.

