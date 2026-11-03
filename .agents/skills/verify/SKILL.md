---
name: verify
description: "Run the project's real verification commands (build, typecheck, lint, tests) as acceptance checks and report pass/fail with evidence. Never declare work done without this. Used at the end of /story-done and before any phase gate."
argument-hint: "[scope: all | build | typecheck | lint | test]"
user-invocable: true
allowed-tools: Read, Glob, Grep, Bash
---

# Verify

Evidence before assertions. Run the real commands; report their exit codes and
output. No mocks, no "should work".

## Discover commands

Read in order, stop at first hit:
1. `package.json` scripts: `build`, `typecheck`/`tsc`, `lint`, `test`.
2. Engine project: Godot `--headless --export`, Unity `-batchmode -runTests`, Unreal `Build.bat`.
3. `Makefile` / `justfile` targets: `build`, `test`, `check`.
4. `.agents/docs/technical-preferences.md` `## Verification Commands`.

If none found, ask the user to define them and record them in
`technical-preferences.md` before proceeding.

## Run

For each available command, run it with a 300s timeout. Capture exit code and
the last 40 lines of output. Stop early only on a hard failure if the user
asked for `all`.

## Report

Write to stdout and to `production/verify-report-<timestamp>.md`:

```
VERIFY REPORT — <date>
build:      PASS (exit 0)  — <cmd>
typecheck:  FAIL (exit 2)  — <cmd>
            <last 20 lines>
lint:       PASS (exit 0)
test:       FAIL (3/47)    — <cmd>
```

## Rules

- Never skip a failing command and report success.
- Never invent commands; if a command is missing, mark it `N/A (not configured)`.
- If a command requires network or secrets that are unavailable, mark `BLOCKED`
  with the reason, do not fake a pass.
