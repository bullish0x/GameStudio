# Claude Adapter

GameStudio's Claude Code support is an adapter over the provider-neutral
`.agents/` source. Claude Code can read `.claude/`, but the behavior should stay
aligned with `.agents/` and must not become a separate product.

## What Claude Reads

- `CLAUDE.md` is the Claude Code adapter instruction file.
- `AGENTS.md` remains the provider-neutral instruction entrypoint.
- `.agents/skills/` is the canonical skill workflow source.
- `.agents/agents/` is the canonical role source.
- `.agents/hooks/` and `.agents/hooks.json` are the canonical hook source and
  registry.
- `.claude/skills/` mirrors canonical skills with Claude path references where
  needed for slash-command loading.
- `.claude/agents/` mirrors canonical agents.
- `.claude/rules/` mirrors canonical path-scoped rules.
- `.claude/settings.json` wires Claude permissions, status line, and hooks.

## Hooks And Settings

Claude Code reads `.claude/settings.json`. Hook commands point to
`.claude/hooks/*.sh`, which are adapter copies of `.agents/hooks/*.sh` with
Claude-specific path references. `notify.sh` is included for Claude's
notification event.

The status line script `.claude/statusline.sh` is Claude-specific adapter glue.
It is intentionally excluded from canonical `.agents/` because it depends on
Claude Code status line behavior.

On Windows, hooks require a usable Bash environment such as Git Bash. The hook
scripts avoid `grep -P` and include fallbacks for missing optional tools.

## Sync Rules

Canonical behavior changes go in `.agents/` first. The Claude adapter may use
path substitutions such as `.agents/skills` to `.claude/skills`, but it should
not change workflow decisions, approvals, or quality gates.

The sync contract is recorded in `.agents/adapter-manifest.json`. After changing
canonical assets or `.claude/`, run:

```bash
python .agents/scripts/validate-compatibility.py
```

The validator checks mirrored agents/rules/hooks, skill coverage, hook
references, README counts, gateway examples, and required documentation.

## Local Plugin Manifest

`.claude-plugin/plugin.json` records local packaging metadata for Claude
Code-compatible harnesses: canonical assets, `.claude/` adapter paths, hook
registry, and validation commands. It is not a published marketplace package and
does not guarantee automatic slash-command exposure. See
`docs/PLUGIN_PACKAGING.md`.
