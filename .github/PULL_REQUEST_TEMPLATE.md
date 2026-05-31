## Summary

Brief description of what this PR does.

## Type of Change

- [ ] New agent
- [ ] New skill
- [ ] New hook or rule
- [ ] Bug fix
- [ ] Documentation improvement
- [ ] Other:

## Changes

-
-
-

## Checklist

- [ ] I've tested this in at least one supported coding-agent harness
- [ ] New agents include the Collaboration Protocol section
- [ ] New skills use the subdirectory format (`.agents/skills/<name>/SKILL.md`)
- [ ] Provider-neutral reference docs are updated in `.agents/docs/` (agent-roster, skills-reference, hooks-reference, rules-reference)
- [ ] Hooks use `grep -E` (POSIX) and fail gracefully without jq/python
- [ ] If this changes hooks, harness adapters, gateway examples, or provider-neutral docs, `python .agents/scripts/validate-compatibility.py` passes
- [ ] No hardcoded paths or platform-specific assumptions
