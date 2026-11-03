# Skill Test Spec: /verify

## Skill Summary

`/verify` runs the project's real verification commands (build, typecheck, lint,
tests) and reports pass/fail with evidence. It is the acceptance-check skill used
before any "done" claim.

---

## Static Assertions (Structural)

- [ ] Has required frontmatter fields: `name`, `description`, `argument-hint`, `user-invocable`, `allowed-tools`
- [ ] Has at least 2 `##` headings
- [ ] Contains a verdict keyword: PASS, FAIL, or BLOCKED
- [ ] Has a next-step handoff at the end

---

## Test Cases

### Case 1: All commands pass

**Fixture:** `package.json` defines `build`, `typecheck`, `lint`, `test`, and all
exit 0.

**Input:** `/verify all`

**Expected behavior:**
1. Discovers commands from `package.json` scripts.
2. Runs each with a timeout and captures exit codes.
3. Reports PASS for each with the command used.

**Assertions:**
- [ ] Every reported command is one that actually exists in the project
- [ ] Report includes exit codes
- [ ] Report is written to `production/verify-report-<timestamp>.md`

### Case 2: One command fails

**Fixture:** `test` exits 1 with 3/47 failures.

**Input:** `/verify test`

**Expected behavior:**
1. Reports FAIL with the failure count and last lines of output.
2. Does not report overall success.
3. Recommends fixing before `/story-done`.

**Assertions:**
- [ ] FAIL is explicit with the exit code
- [ ] No command is invented or skipped silently
- [ ] Missing commands are marked `N/A (not configured)`

---

## Category Rubric

- Evidence before assertions: real commands, real exit codes.
- No mocks or fabricated passes.
- BLOCKED is used when secrets or network are unavailable.
