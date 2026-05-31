# GameStudio -- Game Studio Agent Architecture

Indie game development managed through 55 coordinated Claude Code subagents.
Each agent owns a specific domain, enforcing separation of concerns and quality.

## Harness Compatibility

This file is the Claude Code adapter. The provider-neutral entrypoint is
`AGENTS.md`, the canonical skill source is `.agents/skills/`, and the canonical
role source is `.agents/agents/`.

- Model/provider choice belongs in Claude Code or a configured gateway, not in
  GameStudio skills, agents, or hooks.
- Claude Code may use Anthropic directly or route through a compatible gateway
  when the user wants OpenAI, Gemini, DeepSeek, GLM/Z.ai, Qwen, local models, or
  another provider.
- Keep behavior aligned with `docs/HARNESS-COMPATIBILITY.md`.

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

@.claude/docs/directory-structure.md

## Engine Version Reference

@docs/engine-reference/godot/VERSION.md

## Technical Preferences

@.claude/docs/technical-preferences.md

## Coordination Rules

@.claude/docs/coordination-rules.md

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

@.claude/docs/coding-standards.md

## Context Management

@.claude/docs/context-management.md
