# Agent Test Spec: phaser-specialist

## Agent Summary

Domain: 2D browser games built on Phaser 4 — scene lifecycle (`init`/`preload`/`create`/`update`), `GameConfig` and renderer selection, tilemaps (Tiled import, `TilemapGPULayer`), physics (Arcade vs Matter), input (keyboard/pointer/touch/gamepad), sprite animation and tweens, audio, cameras, the unified v4 Filter system, scale/responsive, and save/persistence triggering. Gameplay rules and state live OUTSIDE Phaser scenes; scenes are thin view adapters.
Does NOT own: game rules, balance numbers, or save-state schemas (coordinates with gameplay-programmer, systems-designer); non-trivial GLSL (delegates to webgl-shader-specialist); asset preparation (delegates to web2d-asset-pipeline); 3D work (redirects to threejs-specialist); 2D interactive rendering without game mechanics (redirects to pixijs-specialist).
Reasoning tier: balanced reasoning (default for specialists).
No gate IDs assigned.

---

## Static Assertions (Structural)

- [ ] `description:` field is present and references Phaser 4, scene lifecycle, GameConfig, tilemaps, Arcade/Matter physics, input, Filter system, and delegates GLSL/assets
- [ ] `tools:` list includes Read, Glob, Grep, Write, Edit, Bash, Task
- [ ] Balanced reasoning tier is recommended
- [ ] `maxTurns: 20` is set
- [ ] Agent definition names `webgl-shader-specialist` as the delegate for GLSL
- [ ] Agent definition names `web2d-asset-pipeline` as the delegate for asset prep
- [ ] Agent definition states gameplay state must live OUTSIDE Phaser scenes
- [ ] Phaser 4 gotchas are encoded: RenderNode architecture, Canvas deprecated, unified Filter system, removed classes (`Point`, `Mesh`, `BitmapMask`)

---

## Test Cases

### Case 1: In-domain request — Arcade physics platformer scene

**Input:** "Set up a Phaser 4 platformer scene: tile-based ground, a player sprite with Arcade physics, keyboard left/right/jump controls, and a scrolling camera."

**Expected behavior:**
- Produces a `Phaser.Scene` subclass with correct `init` / `preload` / `create` / `update` lifecycle
- Uses `TilemapGPULayer` for the static ground layer and a separate collision layer
- Creates an `ArcadeBody` on the player; references assets by stable manifest keys (not raw file paths)
- Wires keyboard input via the InputPlugin and normalizes it into game actions (not scattered raw key checks)
- Attaches the camera to the player with appropriate world bounds
- Keeps any game rules (lives, score, respawn logic) OUT of the scene — notes these belong in a system passed as a ref or accessed via the game registry
- Recommends atlases from `web2d-asset-pipeline` for the player spritesheet rather than individual files

### Case 2: Wrong-track redirect — 3D glTF model rendering

**Input:** "Load a glTF character model and render it in my Phaser game scene."

**Expected behavior:**
- Identifies that glTF/3D model rendering is not within Phaser 4's scope (Phaser is a 2D game engine)
- Does NOT attempt to load a glTF inside a Phaser scene
- Redirects to `threejs-specialist` (or an overlay / canvas-compositing approach if a hybrid is genuinely required) and notes that a 3D layer alongside Phaser would require careful canvas management
- Clarifies the Phaser track vs Three.js 3D track boundary

### Case 3: Post-cutoff / v3 → v4 API version risk

**Input:** "Use `this.add.mesh(400, 300, 'model')` to add a 3D mesh to the scene."

**Expected behavior:**
- Flags that the `Mesh` game object was removed in Phaser 4 — it no longer exists
- Does NOT silently emit the removed API
- Explains the v4 replacement path: for custom rendering, use an `Extern` game object as the sanctioned escape hatch for raw WebGL; direct `gl.*` calls outside Extern are not permitted in v4's RenderNode architecture
- Directs the user to verify against the installed Phaser 4 version and the v3-to-v4 migration notes

### Case 4: Gameplay state boundary — scene owning combat rules

**Input:** "In the `update()` loop, check if the player's health drops to 0 and subtract a life, then reload the scene."

**Expected behavior:**
- Flags the boundary violation: health, lives, and combat resolution are game-state concerns that belong in a system (e.g., `CombatSystem`), not in the Phaser scene's `update()`
- Recommends the correct pattern: the scene reads health state from the system each frame and emits an event or calls a system method when a death is detected; the system resolves the outcome (subtract life, emit respawn event); the scene responds to the event by triggering the reload
- Provides a concrete re-architecture showing where the boundary sits
- Notes that burying balance numbers (health values, lives count) inside a `Scene` is explicitly out of scope for this agent

### Case 5: Custom shader filter delegation — glow effect

**Input:** "Add a bloom/glow post-processing filter to my Phaser 4 game camera."

**Expected behavior:**
- Accepts responsibility for wiring the filter into Phaser: applying it via the v4 unified Filter system, noting that filters break batching and should be applied at the appropriate container/camera level
- Delegates the GLSL bloom shader to `webgl-shader-specialist`, specifying that it must be authored via the Phaser 4 config-based Shader API with `#pragma` directives — not raw `gl.*` calls
- Explains that the RenderNode architecture in v4 replaced the pipeline-based approach from v3; raw WebGL calls outside Extern are not permitted
- Asks the user to confirm the delegation before proceeding

---

## Protocol Compliance

- [ ] Stays within declared domain (Phaser 4 scene lifecycle, physics, input, tilemap, camera, tweens, Filter system)
- [ ] Enforces the gameplay-state-outside-scenes rule — flags violations explicitly
- [ ] Redirects 3D work to threejs-specialist
- [ ] Delegates GLSL to webgl-shader-specialist; specifies Phaser 4 RenderNode / Shader API constraints
- [ ] Delegates asset prep to web2d-asset-pipeline
- [ ] Flags removed Phaser 4 classes (Point, Mesh, BitmapMask) and v3 → v4 API changes
- [ ] Notes Canvas renderer is deprecated; assumes WebGL
- [ ] Asks "May I write this to [filepath]?" before file writes
- [ ] Presents 2–4 options with trade-offs before implementing

---

## Coverage Notes

- Case 1 verifies the gameplay-state boundary is respected even in a "just set it up" request
- Case 3 confirms the agent flags v4 removed APIs rather than silently emitting them
- Case 4 is the critical boundary test: scene owning rules is the most common Phaser misuse pattern
- Case 5 verifies RenderNode awareness: Phaser 4 requires #pragma-based Shader API, not raw gl.* calls
