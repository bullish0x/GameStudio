## Summary

Brief description of what this PR does.

## Type of Change

- [ ] New agent
- [ ] New skill
- [ ] New hook or rule
- [ ] Harness adapter or provider gateway change
- [ ] Security, contribution, or collaboration policy change
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
- [ ] Canonical behavior lives under `.agents/`; harness-specific folders only adapt it
- [ ] Adapter coverage changes update `.agents/adapter-manifest.json`
- [ ] Codex plugin packaging changes update `.codex-plugin/plugin.json` and `docs/PLUGIN_PACKAGING.md`
- [ ] Provider-neutral reference docs are updated in `.agents/docs/` (agent-roster, skills-reference, hooks-reference, rules-reference)
- [ ] Hooks use `grep -E` (POSIX) and fail gracefully without jq/python
- [ ] If this changes hooks, harness adapters, gateway examples, or provider-neutral docs, `python .agents/scripts/validate-compatibility.py` passes
- [ ] If this changes release-facing behavior, `VERSION`, `CHANGELOG.md`, or `UPGRADING.md` is updated
- [ ] If this changes security-sensitive behavior, `SECURITY.md` is updated
- [ ] If this changes collaboration or review policy, `CONTRIBUTING.md` and this PR template are updated
- [ ] No hardcoded paths or platform-specific assumptions
