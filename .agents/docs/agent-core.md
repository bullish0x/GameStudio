# GameStudio Agent Core

The full operating contract for any agent working in a GameStudio project.
`AGENTS.md` is the short entrypoint; this file holds the detail.

## Harness compatibility

GameStudio is provider-neutral at the harness level. The same studio workflow
works from Claude Code, Codex/OpenAI-based harnesses, Cursor, Antigravity,
OpenCode, Gemini-style tools, or any harness that can read repository
instructions and expose file/shell tools.

- Do not bake provider or model choices into skills, agents, hooks, or project
  docs. Select the model in the active harness.
- `AGENTS.md` is the common instruction entrypoint.
- `.agents/skills/` is the provider-neutral skill source.
- `.agents/agents/` is the provider-neutral role source.
- `.agents/hooks/` and `.agents/hooks.json` are the provider-neutral hook
  source and registry.
- `.agents/rules/` is the provider-neutral path-scoped standards source.
- `.agents/docs/templates/` is the provider-neutral template source.
- `.claude/` and `.codex/` are adapters. `.opencode/` is the OpenCode V2
  adapter; generate it with `tools/build-opencode-adapter.mjs`.
- If a provider bridge is needed, prefer a trusted gateway documented in
  `docs/HARNESS-COMPATIBILITY.md`; do not rewrite skill behavior for one vendor.
- When a skill names a harness tool such as `AskUserQuestion`, `Task`, or
  `TodoWrite`, use the active harness equivalent and preserve the decision and
  approval semantics.

## Technology stack

- **Engine**: [CHOOSE: Godot 4 / Unity / Unreal Engine 5 / Three.js (Web 3D) / PixiJS (Web 2D interactive) / Phaser (Web 2D games)]
- **Language**: [CHOOSE: GDScript / C# / C++ / Blueprint / JS/TS]
- **Version Control**: Git with trunk-based development
- **Build System**: [SPECIFY after choosing engine]
- **Asset Pipeline**: [SPECIFY after choosing engine]

Engine-specialist agents exist for Godot, Unity, Unreal, Three.js, PixiJS, and
Phaser, with dedicated sub-specialists. Use the set matching the project engine.

## Collaboration protocol

**User-driven collaboration, not autonomous execution.**
Every task follows: **Question -> Options -> Decision -> Draft -> Approval**.

- Ask "May I write this to [filepath]?" before using Write/Edit.
- Show drafts or summaries before requesting approval.
- Multi-file changes require explicit approval for the full changeset.
- No commits without user instruction.

Full protocol and examples: `docs/COLLABORATIVE-DESIGN-PRINCIPLE.md`.

## Pointers

| Topic | Source |
| --- | --- |
| Project layout | `.agents/docs/directory-structure.md` |
| Engine version pins | `docs/engine-reference/*/VERSION.md` |
| Technical preferences | `.agents/docs/technical-preferences.md` |
| Coordination rules | `.agents/docs/coordination-rules.md` |
| Coding standards | `.agents/docs/coding-standards.md` |
| Context management | `.agents/docs/context-management.md` |
| Skill catalog | `.agents/docs/skills-reference.md` |
| Agent roster | `.agents/docs/agent-roster.md` |
| Workflow | `.agents/workflows/studio.yaml` |
| OpenCode mode | `docs/OPENCODE_ADAPTER.md` |
