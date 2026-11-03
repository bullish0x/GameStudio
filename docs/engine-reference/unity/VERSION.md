# Unity Engine — Version Reference

| Field | Value |
|-------|-------|
| **Engine Version** | Unity 6.3 LTS (6000.3.27f2) |
| **Release Date** | December 2025 |
| **Project Pinned** | 2026-11-03 |
| **Last Docs Verified** | 2026-11-03 |
| **LLM Knowledge Cutoff** | January 2026 |

## Knowledge Gap Warning

The LLM's training data (cutoff January 2026) likely covers the Unity 6 series
through ~6.2. Version 6.3 LTS (Dec 2025) sits near the cutoff boundary, so the
model's knowledge of its newest APIs is unreliable and may be incomplete. Always
cross-reference this directory before suggesting Unity API calls, and treat any
6.3-specific signature as verify-before-use.

## Version Timeline (risk relative to the Jan 2026 cutoff)

| Version | Release | Risk Level | Key Theme |
|---------|---------|------------|-----------|
| 6.0 | Oct 2024 | LOW | Unity 6 rebrand, new rendering features, Entities 1.3, DOTS improvements |
| 6.1 | Nov 2024 | LOW | Bug fixes, stability improvements |
| 6.2 | Dec 2024 | LOW | Performance optimizations, new input system improvements |
| 6.3 LTS | Dec 2025 | MEDIUM | First LTS since 6.0, production-ready DOTS, enhanced graphics features |

## Major Changes from 2022 LTS to Unity 6.3 LTS

### Breaking Changes
- **Entities/DOTS**: Major API overhaul in Entities 1.0+, complete redesign of ECS patterns
- **Input System**: Legacy Input Manager deprecated, new Input System is default
- **Rendering**: URP/HDRP significant upgrades, SRP Batcher improvements
- **Addressables**: Asset management workflow changes
- **Scripting**: C# 9 support, new API patterns

### New Features (Unity 6 series)
- **DOTS**: Production-ready Entity Component System (Entities 1.3+)
- **Graphics**: Enhanced URP/HDRP pipelines, GPU Resident Drawer
- **Multiplayer**: Netcode for GameObjects improvements
- **UI Toolkit**: Production-ready for runtime UI (replaces UGUI for new projects)
- **Async Asset Loading**: Improved Addressables performance
- **Web**: WebGPU support

### Deprecated Systems
- **Legacy Input Manager**: Use new Input System package
- **Legacy Particle System**: Use Visual Effect Graph
- **UGUI**: Still supported, but UI Toolkit recommended for new projects
- **Old ECS (GameObjectEntity)**: Replaced by modern DOTS/Entities

## Verified Sources

- Official docs: https://docs.unity3d.com/6000.0/Documentation/Manual/index.html
- Unity 6 release: https://unity.com/releases/unity-6
- Unity 6.3 LTS announcement: https://unity.com/blog/unity-6-3-lts-is-now-available
- Migration guide: https://docs.unity3d.com/6000.0/Documentation/Manual/upgrade-guides.html
- Unity 6 support: https://unity.com/releases/unity-6/support
- C# API reference: https://docs.unity3d.com/6000.0/Documentation/ScriptReference/index.html

## 2026-11-03 update (6.3 → 6000.3.27f2)

Source: https://unity.com/blog/unity-6-3-lts-is-now-available , https://docs.unity.com/en-us/engine/6000.3/manual/whats-new/unity63

- Version strings: editor version is `6000.3.x`, not `2023.x`/`6.3.x`. `ProjectVersion.txt` and package `unity:` references must use the 6000.x scheme.
- Android build tooling: Gradle 9.1.0 + AGP 9.0.0; custom Gradle templates need manual migration.
- `PlayerSettings.Android.androidIsGame` obsolete; use the replacement large-screen/Android 16 setting (verify name before generating code).
- New low-level 2D physics on Box2D v3 (multi-threaded, deterministic); do not mix with Rigidbody2D semantics.
- Stay on the 6.3 LTS stream; do not follow 6.6 (non-LTS) or 7.0 (alpha).
