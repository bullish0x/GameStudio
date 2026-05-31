# Agent Test Spec: webgl-shader-specialist

## Agent Summary

Domain: GLSL shader authoring and optimization for the browser — vertex/fragment shaders, `ShaderMaterial` / `RawShaderMaterial`, custom material extensions via `onBeforeCompile`, GPGPU/FBO techniques, post-processing passes (`EffectComposer`), and shader-level performance work (precision, branching, texture fetches, overdraw). Also covers 2D filters: PixiJS `Filter` lifecycle (`filterArea`, `padding`, batch-breaking cost) and Phaser 4 custom filters via the `RenderNode` architecture and config-based Shader API with `#pragma` directives.
Does NOT own: Three.js scene graph or render loop (hands finished materials to threejs-specialist), asset/texture preparation (requests channel-packed maps from web3d-asset-pipeline or web2d-asset-pipeline), PixiJS or Phaser scene code (hands finished filters to pixijs-specialist or phaser-specialist).
Reasoning tier: balanced reasoning (default for specialists).
No gate IDs assigned.

---

## Static Assertions (Structural)

- [ ] `description:` field is present and covers GLSL/WebGL, ShaderMaterial, onBeforeCompile, GPGPU, post-processing, PixiJS Filter, and Phaser 4 RenderNode/Shader API
- [ ] `tools:` list includes Read, Glob, Grep, Write, Edit, Bash, Task
- [ ] Balanced reasoning tier is recommended
- [ ] `maxTurns: 20` is set
- [ ] Description notes this agent is consumed by threejs-specialist, pixijs-specialist, and phaser-specialist
- [ ] Agent definition states it does NOT own the surrounding scene/loop code

---

## Test Cases

### Case 1: In-domain request — Three.js ShaderMaterial for a water surface

**Input:** "Write a vertex/fragment shader for an animated ocean surface using Three.js. It should deform vertices with a sine-based wave and tint the foam near crests."

**Expected behavior:**
- Produces a complete `ShaderMaterial` with `vertexShader` and `fragmentShader` strings, uniform declarations (`time`, `waveAmplitude`, `waveFrequency`, `foamColor`), and comments explaining each shader block
- Addresses `mediump` vs `highp` precision choice and states the hardware assumption explicitly
- Avoids dynamic branching in the fragment stage — uses `smoothstep` to blend foam rather than an `if`
- States what uniforms `threejs-specialist` must update each frame in the animation loop
- Does NOT restructure the mesh or scene — hands the completed material back to `threejs-specialist`
- Asks "May I write this to [filepath]?" before writing

### Case 2: In-domain request — PixiJS 2D filter (cross-engine coverage)

**Input:** "Create a PixiJS scanline filter that applies horizontal dark bands over a sprite. Runs on mobile."

**Expected behavior:**
- Produces a class extending PixiJS `Filter` with a GLSL fragment shader that draws periodic dark bands using `mod(vTextureCoord.y * uResolution.y, uBandSpacing)`
- Sets `filterArea` and sufficient `padding` so the effect is not clipped
- Explicitly warns that attaching this filter to a sprite breaks batching for that sprite and notes the GPU cost is proportional to the filtered area
- Flags `mediump` as the safe default for mobile fragment shaders
- Instructs `pixijs-specialist` to manage filter attachment/destruction on the display object

### Case 3: `onBeforeCompile` patch vs full ShaderMaterial trade-off

**Input:** "I want to add a subtle rim-light effect to the built-in MeshStandardMaterial without losing Three.js PBR lighting."

**Expected behavior:**
- Recommends `material.onBeforeCompile` as the correct approach — patches the existing chunk (`#include <lights_fragment_end>`) to inject rim light rather than reimplementing the entire PBR pipeline in a raw `ShaderMaterial`
- Explicitly flags the upgrade-fragility risk: `onBeforeCompile` patches depend on Three.js internal chunk names that may change between versions; advises pinning the chunk names to the project's installed version (0.184) and noting them in a comment
- Provides a working patch snippet
- Does NOT silently create a full `ShaderMaterial` clone of `MeshStandardMaterial` when the patch approach is viable

### Case 4: Wrong-domain redirect — scene graph restructure

**Input:** "Restructure the scene so the ocean mesh is a child of an empty parent pivot node, then attach my ShaderMaterial to it."

**Expected behavior:**
- Identifies that scene graph restructuring (adding a pivot parent, parenting meshes) is `threejs-specialist` domain, not shader domain
- Does NOT produce scene graph mutation code
- Completes only the shader-side of the request (attaching the `ShaderMaterial` is a one-liner it can specify), but redirects the structural refactor to `threejs-specialist`
- Provides clear instructions to `threejs-specialist` on what the mesh hierarchy should look like for the shader to work correctly

### Case 5: WebGL2 capability and fallback declaration

**Input:** "Build a GPGPU particle system using ping-pong float render targets for 100 000 particles."

**Expected behavior:**
- Flags that float render targets (`OES_texture_float` / `RGBA32F`) require WebGL2 or the extension; states this explicitly as "this requires WebGL2" rather than assuming support
- Provides a ping-pong FBO implementation with two `WebGLRenderTarget`s, a simulation shader pass, and a render pass
- States whether a WebGL1 fallback is feasible (e.g., encode positions in RGBA8) and what that fallback costs
- Notes that half-float (`RG16F`) is often the safe mobile choice over `RGBA32F`
- Requests any displacement or noise textures needed from `web3d-asset-pipeline` rather than generating them in the shader spec

---

## Protocol Compliance

- [ ] Stays within declared domain (GLSL authoring, material/uniform wiring, filter lifecycle)
- [ ] Redirects scene graph and render-loop work to threejs-specialist
- [ ] Redirects texture/asset preparation to web3d-asset-pipeline (3D) or web2d-asset-pipeline (2D)
- [ ] Declares precision assumptions explicitly on every shader
- [ ] Flags WebGL2-only features with "requires WebGL2" and provides a fallback story
- [ ] Flags `onBeforeCompile` upgrade-fragility when recommending that approach
- [ ] Asks "May I write this to [filepath]?" before file writes

---

## Coverage Notes

- Cases 1 and 2 verify cross-engine coverage: the agent handles both Three.js ShaderMaterial (3D) and PixiJS Filter (2D) without being two separate agents
- Case 3 (onBeforeCompile) verifies the agent recommends the minimal-patch approach and calls out the version-coupling risk
- Case 5 (GPGPU/WebGL2) verifies the agent does not silently assume WebGL2 or float-texture support
