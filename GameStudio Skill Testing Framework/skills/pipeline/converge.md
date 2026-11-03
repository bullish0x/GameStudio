# Skill Test Spec: /converge

## Skill Summary

`/converge` is the terminal drift check after a change set. It compares GDDs,
ADRs, the control manifest, and stories against the current implementation and
reports what has drifted. It is read-only and produces a numbered report.

---

## Static Assertions (Structural)

- [ ] Has required frontmatter fields: `name`, `description`, `argument-hint`, `user-invocable`, `allowed-tools`
- [ ] Has at least 2 `##` headings
- [ ] Contains a verdict keyword: PASS, CONCERNS, or FAIL
- [ ] Has a next-step handoff at the end

---

## Test Cases

### Case 1: Clean tree

**Fixture:** every GDD criterion has an implementation path and a test; every
control-manifest rule is grep-enforceable; story status matches git history;
engine pins match installed versions.

**Input:** `/converge`

**Expected behavior:**
1. Reads `design/gdd/`, `docs/architecture/`, `production/epics/`, `src/`, `tests/`.
2. Finds no drift.
3. States explicitly that no drift was found and recommends advancing the phase.

**Assertions:**
- [ ] Report file `production/converge-report-<date>.md` is written
- [ ] Report contains a Summary with drift count 0
- [ ] No source files are modified

### Case 2: Drift present

**Fixture:** a GDD acceptance criterion marked done has no matching test.

**Input:** `/converge system:combat`

**Expected behavior:**
1. Reports the missing test as drift item 1 with file path and evidence.
2. Does not edit source.
3. Recommends `/story-done` or adding the test.

**Assertions:**
- [ ] Drift item cites a concrete `file:line` or path
- [ ] Report separates Drift items from Clean items
- [ ] Skill does not fabricate drift beyond the fixture

---

## Category Rubric

- Read-only discipline: never edits source.
- Every drift item is evidence-backed.
- Explicit clean result when nothing is wrong.
