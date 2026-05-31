# GameStudio -- Game Studio Agent Architecture

Indie game development managed through 55 coordinated coding-agent subagents.
Each agent owns a specific domain, enforcing separation of concerns and quality.

## Harness Compatibility

GameStudio is provider-neutral at the harness level. The same studio workflow
should work when launched from Claude Code, Codex/OpenAI-based harnesses,
Cursor, Antigravity, Gemini-style tools, or another coding-agent harness that
can read repository instructions and expose file/shell tools.

- Do not bake provider or model choices into skills, agents, hooks, or project
  docs. Select the model in the active harness: Anthropic, OpenAI, Gemini,
  DeepSeek, GLM/Z.ai, Qwen, local Ollama/vLLM, or a router-backed model.
- Treat `AGENTS.md` as the common instruction entrypoint.
- Treat `.agents/skills/` as the provider-neutral skill source.
- Treat `.agents/agents/` as the provider-neutral role source.
- Treat `.agents/rules/` as the provider-neutral path-scoped standards source.
- Treat `.agents/docs/templates/` as the provider-neutral template source.
- Treat `.claude/` as the Claude Code adapter and `.codex/` as the Codex
  adapter. Other harnesses should map their own agent/rule/hook formats back to
  the same canonical behavior.
- If a provider bridge is needed, prefer a trusted gateway documented in
  `docs/HARNESS-COMPATIBILITY.md`; do not rewrite skill behavior for a single
  vendor.
- When a skill names a harness tool such as `AskUserQuestion`, `Task`, or
  `TodoWrite`, use the active harness equivalent. Preserve the decision and
  approval semantics even if the exact tool name is unavailable.

## Technology Stack

- **Engine**: [CHOOSE: Godot 4 / Unity / Unreal Engine 5 / Three.js (Web 3D) / PixiJS (Web 2D interactive) / Phaser (Web 2D games)]
- **Language**: [CHOOSE: GDScript / C# / C++ / Blueprint / JS/TS]
- **Version Control**: Git with trunk-based development
- **Build System**: [SPECIFY after choosing engine]
- **Asset Pipeline**: [SPECIFY after choosing engine]

> **Note**: Engine-specialist agents exist for Godot, Unity, Unreal, Three.js
> (Web 3D), PixiJS (Web 2D interactive), and Phaser (Web 2D games) with
> dedicated sub-specialists. Use the set matching your engine.

## Project Structure

@.agents/docs/directory-structure.md

## Engine Version Reference

@docs/engine-reference/godot/VERSION.md

## Technical Preferences

@.agents/docs/technical-preferences.md

## Coordination Rules

@.agents/docs/coordination-rules.md

## Collaboration Protocol

**User-driven collaboration, not autonomous execution.**
Every task follows: **Question -> Options -> Decision -> Draft -> Approval**

- Agents MUST ask "May I write this to [filepath]?" before using Write/Edit tools
- Agents MUST show drafts or summaries before requesting approval
- Multi-file changes require explicit approval for the full changeset
- No commits without user instruction

See `docs/COLLABORATIVE-DESIGN-PRINCIPLE.md` for full protocol and examples.

> **First session?** If the project has no engine configured and no game concept,
> run `/start` to begin the guided onboarding flow.

## Coding Standards

@.agents/docs/coding-standards.md

## Context Management

@.agents/docs/context-management.md
