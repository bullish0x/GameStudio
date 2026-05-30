# Godot Engine — Version Reference

| Field | Value |
|-------|-------|
| **Engine Version** | Godot 4.6 |
| **Release Date** | January 2026 |
| **Project Pinned** | 2026-02-12 |
| **Last Docs Verified** | 2026-02-12 |
| **LLM Knowledge Cutoff** | January 2026 |

## Knowledge Gap Warning

The LLM's training data (cutoff January 2026) likely covers Godot through ~4.5.
Version 4.6 released right at the cutoff boundary in January 2026, so the model's
knowledge of its API is unreliable and may be incomplete or wrong. Always
cross-reference this directory before suggesting Godot API calls, and treat any
4.6-specific signature as verify-before-use.

## Version Timeline (risk relative to the Jan 2026 cutoff)

| Version | Release | Risk Level | Key Theme |
|---------|---------|------------|-----------|
| 4.4 | ~Mid 2025 | LOW | Jolt physics option, FileAccess return types, shader texture type changes |
| 4.5 | ~Late 2025 | MEDIUM | Accessibility (AccessKit), variadic args, @abstract, shader baker, SMAA |
| 4.6 | Jan 2026 | HIGH | Jolt default, glow rework, D3D12 default on Windows, IK restored |

## Verified Sources

- Official docs: https://docs.godotengine.org/en/stable/
- 4.5→4.6 migration: https://docs.godotengine.org/en/stable/tutorials/migrating/upgrading_to_godot_4.6.html
- 4.4→4.5 migration: https://docs.godotengine.org/en/stable/tutorials/migrating/upgrading_to_godot_4.5.html
- Changelog: https://github.com/godotengine/godot/blob/master/CHANGELOG.md
- Release notes: https://godotengine.org/releases/4.6/
