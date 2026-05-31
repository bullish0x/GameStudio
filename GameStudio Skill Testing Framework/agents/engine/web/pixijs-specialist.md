# Agent Test Spec: pixijs-specialist

## Agent Summary

Domain: 2D browser rendering with PixiJS — stage/container graph, sprites, textures, spritesheets/atlases, the Ticker/render loop, 2D filters, text rendering, interaction/hit-testing, and 2D rendering performance (batching, texture atlasing, WebGL vs WebGPU renderer). Distinct from the Three.js 3D track and from the Phaser game-engine track.
Does NOT own: 3D work (Three.js / threejs-specialist), game-engine features (physics, scene lifecycle — Phaser's domain), complex custom GLSL (co-developed with webgl-shader-specialist), application/game state or UI ownership (coordinates with gameplay-programmer and ui-programmer).
Reasoning tier: balanced reasoning (default for specialists).
No gate IDs assigned.

---

## Static Assertions (Structural)

- [ ] `description:` field is present and references PixiJS, stage/container graph, sprites, spritesheets/atlases, ticker, filters, and batching
- [ ] `tools:` list includes Read, Glob, Grep, Write, Edit, Bash, Task
- [ ] Balanced reasoning tier is recommended
- [ ] `maxTurns: 20` is set
- [ ] Agent definition explicitly distinguishes this 2D track from Three.js 3D
- [ ] Post-cutoff API risk guidance is present (v7 → v8 API changes; verify against pinned version)

---

## Test Cases

### Case 1: In-domain request — texture atlas and sprite batching

**Input:** "I have 200 enemy sprites with 4 animation states each. How do I set this up in PixiJS v8 so the renderer batches them?"

**Expected behavior:**
- Recommends packing all 200-enemy frames into a single spritesheet/texture atlas so all sprites share one texture and the renderer issues a single batched draw call
- Demonstrates the PixiJS v8 Assets API (`Assets.load` with the atlas manifest) and `Spritesheet` construction
- Shows how to create `AnimatedSprite` instances from atlas frames and drive frame updates in the Ticker
- Flags that mixing textures per sprite breaks batching — all enemies must share the same atlas page
- Does NOT author the atlas itself — delegates atlas-packing decisions to `web2d-asset-pipeline`
- Asks "May I write this to [filepath]?" before writing

### Case 2: Wrong-track redirect — 3D mesh rendering

**Input:** "Add a rotating 3D cube to the PixiJS stage with a PBR material."

**Expected behavior:**
- Identifies that 3D mesh rendering with a PBR material is not PixiJS 2D domain
- Does NOT attempt to bolt a 3D cube into the PixiJS stage
- Redirects to `threejs-specialist` for the 3D work
- May briefly note what PixiJS can do (a 2D sprite that looks cubic via trickery) but makes clear that genuine 3D PBR is outside this track

### Case 3: Post-cutoff API version risk — PixiJS v7 → v8 init change

**Input:** "Initialize PixiJS with `const app = new PIXI.Application({ width: 800, height: 600 }); document.body.appendChild(app.view);`"

**Expected behavior:**
- Flags that `app.view` and synchronous `Application` init were changed in PixiJS v8: initialization is now async (`await app.init({ ... })`), and the canvas is accessed via `app.canvas` not `app.view`
- Does NOT silently emit the v7 API pattern
- Provides the v8-correct initialization sequence
- Directs the user to verify against the project's installed PixiJS version rather than relying on training data

### Case 4: Custom filter delegation boundary

**Input:** "I need a real-time chromatic aberration filter on the full stage. Write the GLSL fragment shader for it."

**Expected behavior:**
- Accepts responsibility for wiring the filter into PixiJS: creating the `Filter` instance, attaching it to the correct container, managing `filterArea`, setting appropriate `padding`, and noting the batch-breaking cost
- Delegates the GLSL fragment shader code to `webgl-shader-specialist`
- States exactly what uniforms the shader receives (e.g., `uSampler`, `inputSize`, `uAberrationStrength`) so the shader specialist can produce a drop-in
- Does NOT write non-trivial GLSL itself
- Asks the user to confirm the delegation path before proceeding

### Case 5: Renderer choice — WebGPU vs WebGL for a large interactive dashboard

**Input:** "We're building a data visualization dashboard with 50 000 animated data-point sprites. Should we use the WebGPU or WebGL renderer?"

**Expected behavior:**
- Presents the trade-off explicitly: WebGPU offers better GPU utilization for large batches but has narrower browser support; WebGL is universally supported with a well-tested Pixi backend
- Recommends providing a WebGPU renderer path with a WebGL fallback (`autoDetectRenderer` with `prefer: 'webgpu'` and a fallback)
- Notes that 50 000 sprites benefit from `ParticleContainer` (if uniform rendering is acceptable) or from atlas batching with the standard renderer
- Does NOT make the final renderer decision unilaterally — presents the recommendation and asks the user

---

## Protocol Compliance

- [ ] Stays within declared domain (Pixi stage/container graph, sprites, ticker, 2D filters, interaction)
- [ ] Redirects 3D work to threejs-specialist
- [ ] Redirects complex GLSL to webgl-shader-specialist; retains filter wiring/lifecycle
- [ ] Delegates atlas packing to web2d-asset-pipeline
- [ ] Flags PixiJS v7 vs v8 API differences and directs verification against installed version
- [ ] Notes batch-breaking consequences of filters, masks, and blend-mode changes
- [ ] Asks "May I write this to [filepath]?" before file writes
- [ ] Presents 2–4 options with trade-offs before implementing

---

## Coverage Notes

- Case 3 (v7 → v8 init) verifies the agent does not silently emit outdated initialization code for the installed version
- Case 4 (filter delegation) confirms the GLSL boundary: PixiJS owns the lifecycle, webgl-shader-specialist owns the GLSL
- Case 5 (renderer choice) verifies the collaborative protocol: recommendation given with fallback path, user decides
