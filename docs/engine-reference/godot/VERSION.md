# Godot Engine — Version Reference

| Field | Value |
|-------|-------|
| **Engine Version** | Godot 4.7.2 |
| **Release Date** | August 2026 (4.7.2) |
| **Project Pinned** | 2026-11-03 |
| **Last Docs Verified** | 2026-11-03 |
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

## 2026-11-03 update (4.6 → 4.7.2)

Source: https://godotengine.org/releases/4.7/ , https://docs.godotengine.org/en/4.7/tutorials/migrating/upgrading_to_godot_4.7.html

- Input device IDs: mouse/keyboard device ID is no longer `0`; use `InputEvent.DEVICE_ID_MOUSE` / `InputEvent.DEVICE_ID_KEYBOARD`.
- Jolt (default since 4.6): `WorldBoundaryShape3D.plane.d` sign flipped; `SoftBody3D` mass now defaults to 1 kg for the whole body; `linear_stiffness` application changed (re-tune).
- `AnimationNodeBlendSpace1D/2D`: boolean `sync` replaced by `SyncMode` enum.
- Renames: `RichTextLabel` image width-in-percent → width unit; `Control.accessibility_live` type moved to `AccessibilityServer.AccessibilityLiveMode`; `Object.is_class()` takes `StringName`.
- `AudioStreamPlayer` default `area_mask` 1 → 0; `CanvasItem` no longer adds antialiasing feather to lines.
- New features: `AreaLight3D` rectangular area lights, HDR output, `Control` offset transforms, new Asset Store, standalone Android export.

Knowledge gap: LLM training likely covers ≤4.5; treat 4.6/4.7 APIs as verify-before-use.
