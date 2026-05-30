# Unreal Engine — Version Reference

| Field | Value |
|-------|-------|
| **Engine Version** | Unreal Engine 5.7 |
| **Release Date** | November 2025 |
| **Project Pinned** | 2026-02-13 |
| **Last Docs Verified** | 2026-02-13 |
| **LLM Knowledge Cutoff** | January 2026 |

## Knowledge Gap Warning

The LLM's training data (cutoff January 2026) likely covers Unreal Engine through
~5.6. Version 5.7 (Nov 2025) sits near the cutoff boundary, so the model's
knowledge of its newest APIs is unreliable and may be incomplete. Always
cross-reference this directory before suggesting Unreal API calls, and treat any
5.7-specific signature as verify-before-use.

## Version Timeline (risk relative to the Jan 2026 cutoff)

| Version | Release | Risk Level | Key Theme |
|---------|---------|------------|-----------|
| 5.4 | ~Mid 2025 | LOW | Motion Design tools, animation improvements, PCG enhancements |
| 5.5 | ~Sep 2025 | LOW | Megalights (millions of lights), animation authoring, MegaCity demo |
| 5.6 | ~Oct 2025 | LOW | Performance optimizations, bug fixes |
| 5.7 | Nov 2025 | MEDIUM | PCG production-ready, Substrate production-ready, AI assistant |

## Major Changes from UE 5.3 to UE 5.7

### Breaking Changes
- **Substrate Material System**: New material framework (replaces legacy materials)
- **PCG (Procedural Content Generation)**: Production-ready, major API changes
- **Megalights**: New lighting system (millions of dynamic lights)
- **Animation Authoring**: New rigging and animation tools
- **AI Assistant**: In-editor AI guidance (experimental)

### New Features (5.4–5.7)
- **Megalights**: Dynamic lighting at massive scale (millions of lights)
- **Substrate Materials**: Production-ready modular material system
- **PCG Framework**: Procedural world generation (production-ready in 5.7)
- **Enhanced Virtual Production**: MetaHuman integration, deeper VP workflows
- **Animation Improvements**: Better rigging, blending, procedural animation
- **AI Assistant**: In-editor AI help (experimental)

### Deprecated Systems
- **Legacy Material System**: Migrate to Substrate for new projects
- **Old PCG API**: Use new production-ready PCG API (5.7+)

## Verified Sources

- Official docs: https://docs.unrealengine.com/5.7/
- UE 5.7 release notes: https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5-7-release-notes
- What's new in 5.7: https://dev.epicgames.com/documentation/en-us/unreal-engine/whats-new
- UE 5.7 announcement: https://www.unrealengine.com/en-US/news/unreal-engine-5-7-is-now-available
- UE 5.5 blog: https://www.unrealengine.com/en-US/blog/unreal-engine-5-5-is-now-available
- Migration guides: https://docs.unrealengine.com/5.7/en-US/upgrading-projects/
