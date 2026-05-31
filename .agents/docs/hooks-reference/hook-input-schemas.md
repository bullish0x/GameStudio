# Hook Input/Output Schemas

This documents the JSON payloads adapter hooks may receive on stdin. Claude Code and Codex-style harnesses can differ; scripts should handle missing fields gracefully.

## PreToolUse

Fired before a tool is executed. Can **allow** (exit 0) or **block** (exit 2).

### PreToolUse: Bash

```json
{
  "tool_name": "Bash",
  "tool_input": {
    "command": "git commit -m 'feat: add player health system'",
    "description": "Commit changes with message",
    "timeout": 120000
  }
}
```

### PreToolUse: Write

```json
{
  "tool_name": "Write",
  "tool_input": {
    "file_path": "src/gameplay/health.gd",
    "content": "extends Node\n..."
  }
}
```

### PreToolUse: Edit

```json
{
  "tool_name": "Edit",
  "tool_input": {
    "file_path": "src/gameplay/health.gd",
    "old_string": "var health = 100",
    "new_string": "var health: int = 100"
  }
}
```

### PreToolUse: Read

```json
{
  "tool_name": "Read",
  "tool_input": {
    "file_path": "src/gameplay/health.gd"
  }
}
```

## PostToolUse

Fired after a tool completes. **Cannot block** (exit code ignored for blocking). Stderr messages are shown as warnings.

### PostToolUse: Write

```json
{
  "tool_name": "Write",
  "tool_input": {
    "file_path": "assets/data/enemy_stats.json",
    "content": "{\"goblin\": {\"health\": 50}}"
  },
  "tool_output": "File written successfully"
}
```

### PostToolUse: Edit

```json
{
  "tool_name": "Edit",
  "tool_input": {
    "file_path": "assets/data/enemy_stats.json",
    "old_string": "\"health\": 50",
    "new_string": "\"health\": 75"
  },
  "tool_output": "File edited successfully"
}
```

## SubagentStart

Fired when a subagent is spawned via the Task tool.

```json
{
  "agent_name": "game-designer",
  "model": "studio-balanced",
  "description": "Design the combat healing mechanic"
}
```

## SessionStart

Fired when a harness session begins. Some adapters provide no stdin input; hook stdout is shown to the active harness as context.

## PreCompact

Fired before context window compression. **No stdin input** — the hook runs to save state before compression occurs.

## Stop

Fired when the active harness session ends. Some adapters provide no stdin input; the hook runs for cleanup and logging.

## Exit Code Reference

| Exit Code | Meaning | Applicable Events |
|-----------|---------|-------------------|
| 0 | Allow / Success | All events |
| 2 | Block (stderr shown to the active harness) | PreToolUse only |
| Other | Treated as error, tool proceeds | All events |

## Notes

- Hooks receive JSON on **stdin** (pipe). Use `INPUT=$(cat)` to capture.
- Parse with `jq` if available, fall back to `grep` for cross-platform compatibility.
- On Windows, `grep -P` (Perl regex) is often unavailable. Use `grep -E` (POSIX extended) instead.
- Path separators may be `\` on Windows. Normalize with `sed 's|\\|/|g'` when comparing paths.
