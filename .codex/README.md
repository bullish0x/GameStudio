# GameStudio Codex Adapter

This folder is adapter glue for Codex/OpenAI-based harnesses. It is not the
canonical GameStudio workflow source.

- Canonical assets live in `.agents/`.
- Codex agent definitions live in `.codex/agents/*.toml`.
- Codex hook wiring lives in `.codex/hooks.json`.
- Codex hook scripts live in `.codex/hooks/`.
- Skills are read from `.agents/skills/<name>/SKILL.md` unless a future Codex
  plugin or harness loader exposes them another way.

See `docs/CODEX_ADAPTER.md` for usage details and
`docs/PLUGIN_PACKAGING.md` for the local Codex packaging manifest.

After changing this adapter or canonical `.agents/` files, run:

```bash
python .agents/scripts/validate-compatibility.py
```
