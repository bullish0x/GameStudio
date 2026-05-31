# Technical Preferences

<!-- Populated by /setup-engine. Updated as the user makes decisions throughout development. -->
<!-- All agents reference this file for project-specific standards and conventions. -->

## Engine & Language

- **Engine**: [TO BE CONFIGURED — run /setup-engine]
- **Language**: [TO BE CONFIGURED]
- **Rendering**: [TO BE CONFIGURED]
- **Physics**: [TO BE CONFIGURED]

## Input & Platform

<!-- Written by /setup-engine. Read by /ux-design, /ux-review, /test-setup, /team-ui, and /dev-story -->
<!-- to scope interaction specs, test helpers, and implementation to the correct input methods. -->

- **Target Platforms**: [TO BE CONFIGURED — e.g., PC, Console, Mobile, Web]
- **Input Methods**: [TO BE CONFIGURED — e.g., Keyboard/Mouse, Gamepad, Touch, Mixed]
- **Primary Input**: [TO BE CONFIGURED — the dominant input for this game]
- **Gamepad Support**: [TO BE CONFIGURED — Full / Partial / None]
- **Touch Support**: [TO BE CONFIGURED — Full / Partial / None]
- **Platform Notes**: [TO BE CONFIGURED — any platform-specific UX constraints]

## Naming Conventions

- **Classes**: [TO BE CONFIGURED]
- **Variables**: [TO BE CONFIGURED]
- **Signals/Events**: [TO BE CONFIGURED]
- **Files**: [TO BE CONFIGURED]
- **Scenes/Prefabs**: [TO BE CONFIGURED]
- **Constants**: [TO BE CONFIGURED]

## Performance Budgets

- **Target Framerate**: [TO BE CONFIGURED]
- **Frame Budget**: [TO BE CONFIGURED]
- **Draw Calls**: [TO BE CONFIGURED]
- **Memory Ceiling**: [TO BE CONFIGURED]

## Testing

- **Framework**: [TO BE CONFIGURED]
- **Minimum Coverage**: [TO BE CONFIGURED]
- **Required Tests**: Balance formulas, gameplay systems, networking (if applicable)

## Forbidden Patterns

<!-- Add patterns that should never appear in this project's codebase -->
- [None configured yet — add as architectural decisions are made]

## Allowed Libraries / Addons

<!-- Add approved third-party dependencies here -->
- [None configured yet — add as dependencies are approved]

## Architecture Decisions Log

<!-- Quick reference linking to full ADRs in docs/architecture/ -->
- [No ADRs yet — use /architecture-decision to create one]

## Engine Specialists

<!-- Written by /setup-engine when engine is configured. -->
<!-- Read by /code-review, /architecture-decision, /architecture-review, and team skills -->
<!-- to know which specialist to spawn for engine-specific validation. -->

### Available Engine Specialist Sets

Select one via `/setup-engine`; the per-project routing below is filled from the chosen set.

| Engine | Lead Agent | Sub-Specialists |
|--------|-----------|-----------------|
| Godot 4 | `godot-specialist` | GDScript, Shaders, GDExtension |
| Unity | `unity-specialist` | DOTS/ECS, Shaders/VFX, Addressables, UI Toolkit |
| Unreal Engine 5 | `unreal-specialist` | GAS, Blueprints, Replication, UMG/CommonUI |
| Three.js (Web 3D) | `threejs-specialist` | `webgl-shader-specialist`, `web3d-asset-pipeline` |
| PixiJS (Web 2D interactive) | `pixijs-specialist` | `web2d-asset-pipeline`; borrows `webgl-shader-specialist` for custom 2D filters |
| Phaser (Web 2D games) | `phaser-specialist` | `web2d-asset-pipeline`; borrows `webgl-shader-specialist` for custom filters |

### Web Engine Skill Routing

Web engine agents draw on the `.claude/skills/` web game-dev skill library:

| Agent | Skills it uses |
|-------|----------------|
| `threejs-specialist` | R3F (`react-three-fiber-setup`, `r3f-*`), ECS (`ecs-*`), scene (`threejs-scene-setup`, `threejs-camera-controls`), mobile (`mobile-performance`, `touch-input-handling`, `battery-optimization`, `memory-management`), input (`input-system`), lighting (`threejs-lighting`), animation (`threejs-animation`, `threejs-animation-systems`) |
| `webgl-shader-specialist` | 3D: `threejs-shaders`, `threejs-postprocessing` · 2D filters: `pixi-filters`, `phaser-filters-and-postfx` |
| `web3d-asset-pipeline` | `threejs-loaders`, `threejs-texture-management` |
| `pixijs-specialist` | PixiJS interactive: `pixi-application`, `pixi-scene-*` (sprite/graphics/text/mesh/container/particle/dom), `pixi-assets`, `pixi-events`, `pixi-ticker`, `pixi-filters`, `pixi-blend-modes`, `pixi-performance`, `pixi-migration-v8` |
| `phaser-specialist` | Phaser games: `phaser-scenes`, `phaser-game-setup-and-config`, `phaser-loading-assets`, `phaser-tilemaps`, `phaser-physics-arcade`, `phaser-physics-matter`, `phaser-input-keyboard-mouse-touch`, `phaser-animations`, `phaser-tweens`, `phaser-audio-and-sound`, `phaser-cameras`, `phaser-scale-and-responsive`, `phaser-filters-and-postfx`, `phaser-v3-to-v4-migration`, and the rest of `phaser-*` |
| `web2d-asset-pipeline` | `pixi-assets`, `phaser-loading-assets` (atlas/spritesheet/Spine/compressed-2D prep) |
| _all web agents_ | `web-game-foundations` (shared architecture frame) |

### Project Configuration

- **Primary**: [TO BE CONFIGURED — run /setup-engine]
- **Language/Code Specialist**: [TO BE CONFIGURED]
- **Shader Specialist**: [TO BE CONFIGURED]
- **UI Specialist**: [TO BE CONFIGURED]
- **Additional Specialists**: [TO BE CONFIGURED]
- **Routing Notes**: [TO BE CONFIGURED]

### File Extension Routing

<!-- Skills use this table to select the right specialist per file type. -->
<!-- If a row says [TO BE CONFIGURED], fall back to Primary for that file type. -->

| File Extension / Type | Specialist to Spawn |
|-----------------------|---------------------|
| Game code (primary language) | [TO BE CONFIGURED] |
| Shader / material files | [TO BE CONFIGURED] |
| UI / screen files | [TO BE CONFIGURED] |
| Scene / prefab / level files | [TO BE CONFIGURED] |
| Native extension / plugin files | [TO BE CONFIGURED] |
| General architecture review | Primary |
