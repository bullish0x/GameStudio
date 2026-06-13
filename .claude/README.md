# GameStudio Claude Adapter

This folder is adapter glue for Claude Code. It mirrors or maps the canonical
provider-neutral workflow in `.agents/`.

- Canonical assets live in `.agents/`.
- Claude agent definitions live in `.claude/agents/`.
- Claude slash-command skill copies live in `.claude/skills/`.
- Claude hook wiring and permissions live in `.claude/settings.json`.
- Claude hook scripts live in `.claude/hooks/`.
- Claude-only status line glue lives in `.claude/statusline.sh`.

Do not make `.claude/` an independent fork of GameStudio behavior. Change the
canonical source first, then update the adapter mapping.

See `docs/CLAUDE_ADAPTER.md` and `.agents/adapter-manifest.json`.

After changing this adapter or canonical `.agents/` files, run:

```bash
python .agents/scripts/validate-compatibility.py
```
