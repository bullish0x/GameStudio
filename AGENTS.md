# GameStudio -- Game Studio Agent Architecture

Indie game development run by a coordinated studio of role agents. Each agent
owns one domain. The full contract lives in `.agents/docs/agent-core.md`.

## Operating contract

- **Question -> Options -> Decision -> Draft -> Approval.** Show the draft,
  then ask "May I write this to [filepath]?" before any Write/Edit.
- Multi-file changes need one approval for the full changeset.
- No commits without explicit user instruction.
- No provider or model choice in skills, agents, hooks, or docs; the harness
  owns that.
- When a skill names `AskUserQuestion`, `Task`, or `TodoWrite`, use the harness
  equivalent but keep the same decision and approval semantics.

## Layout

- `.agents/skills/` — canonical skills (provider-neutral)
- `.agents/agents/` — canonical role agents
- `.agents/hooks/`, `.agents/hooks.json` — lifecycle hooks
- `.agents/rules/` — path-scoped standards
- `.agents/docs/templates/` — document templates
- `.claude/`, `.codex/`, `.opencode/` — harness adapters

## Setup

- Engine, language, build, and asset pipeline: set them in
  `.agents/docs/technical-preferences.md`.
- Engine pins: `docs/engine-reference/*/VERSION.md`.
- First session with no engine or concept: run `/start`.

## Where to look

- Full contract: `.agents/docs/agent-core.md`
- Project layout: `.agents/docs/directory-structure.md`
- Coding standards: `.agents/docs/coding-standards.md`
- Coordination rules: `.agents/docs/coordination-rules.md`
- Workflow: `.agents/workflows/studio.yaml`
- OpenCode mode: `docs/OPENCODE_ADAPTER.md`
