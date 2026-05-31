# Agent Test Spec: threejs-specialist

## Agent Summary

Domain: Three.js and React Three Fiber implementation — scene graph construction, cameras, lights, geometries, materials, meshes, the render loop, animation, raycasting/interaction, loading 3D models (glTF), Spline exports, and 3D product configurators. Covers both vanilla Three.js (JS/TS) and R3F + drei. Stack-selection (vanilla vs R3F, JS vs TS, continuous vs on-demand rendering) is surfaced before code is written.
Does NOT own: raw GLSL authoring (delegates to webgl-shader-specialist), model/texture compression (delegates to web3d-asset-pipeline), game/application state or UI ownership (coordinates with gameplay-programmer and ui-programmer).
Reasoning tier: balanced reasoning (default for specialists).
No gate IDs assigned.

---

## Static Assertions (Structural)

- [ ] `description:` field is present and references Three.js, React Three Fiber, scene graph, glTF, and delegates shader/asset work
- [ ] `tools:` list includes Read, Glob, Grep, Write, Edit, Bash, Task
- [ ] Balanced reasoning tier is recommended
- [ ] `maxTurns: 20` is set
- [ ] Agent definition names `webgl-shader-specialist` as the delegate for GLSL
- [ ] Agent definition names `web3d-asset-pipeline` as the delegate for compression/assets
- [ ] Post-cutoff API risk guidance is present (library moves fast; verify against pinned version)

---

## Test Cases

### Case 1: In-domain request — InstancedMesh for a crowd scene

**Input:** "I need to render 2 000 identical enemy characters in a browser scene. What's the fastest approach?"

**Expected behavior:**
- Recommends `InstancedMesh` as the primary path; explains that it collapses 2 000 draw calls to 1 and how to set per-instance matrices with `setMatrixAt` + `instanceMatrix.needsUpdate`
- Presents at least two options: `InstancedMesh` (manually managed) vs `<Instances>` / `<Merged>` from drei (R3F declarative), with trade-offs tied to whether the project uses R3F
- Surfaces the vanilla-vs-R3F stack question before writing code if the stack is undecided
- Mentions scratch `Matrix4` / `Object3D` objects to avoid per-frame allocation inside the update loop
- Does NOT author GLSL for a custom enemy shader — flags that work as a `webgl-shader-specialist` delegation

### Case 2: Wrong-track redirect — 2D sprite game

**Input:** "Add a scrolling background and sprite sheet animation for my 2D platformer using PixiJS."

**Expected behavior:**
- Identifies that the request is for 2D rendering with PixiJS, not a Three.js 3D scene
- Does NOT produce Three.js or R3F code for the task
- Redirects explicitly to `pixijs-specialist` (or `phaser-specialist` if the request is game-oriented)
- May briefly note what Three.js could do in 2D (orthographic camera + PlaneGeometry) but makes clear that is the wrong tool for a PixiJS spritesheet workflow

### Case 3: Post-cutoff API version risk — Three.js deprecation

**Input:** "Use `renderer.outputEncoding = THREE.sRGBEncoding` to set up color space."

**Expected behavior:**
- Flags that `outputEncoding` / `sRGBEncoding` were deprecated and replaced by `renderer.outputColorSpace = THREE.SRGBColorSpace` in Three.js r152 (and the project is pinned to 0.184)
- Does NOT silently emit the deprecated API
- Directs the user to verify the correct property name against the project's pinned Three.js 0.184 build rather than relying on training data alone
- Provides the current-API equivalent with an explanation of the color-space workflow (`SRGBColorSpace` on color textures, linear workflow throughout)

### Case 4: Shader delegation boundary

**Input:** "Write a dissolve effect that erodes the edges of a mesh using a noise texture."

**Expected behavior:**
- Accepts responsibility for wiring the effect into the scene (assigning the material to the mesh, driving a `dissolveProgress` uniform from the animation loop)
- Delegates the GLSL — the noise-based edge-erosion vertex/fragment code — to `webgl-shader-specialist`
- States clearly what the shader needs to receive (a `uniform sampler2D noiseMap`, a `uniform float dissolveProgress`, UV coordinates) so the shader specialist can produce a drop-in material
- Does NOT write non-trivial GLSL itself
- Asks the user to confirm the delegation path before proceeding

### Case 5: Stack decision — vanilla vs R3F for a product configurator

**Input:** "We're building a 3D shoe configurator where users swap colors and materials. The rest of the UI is React. Which should we use, vanilla Three.js or R3F?"

**Expected behavior:**
- Presents the trade-off explicitly: R3F integrates naturally with React state and component lifecycle, making it well-suited for a React UI + configurator; vanilla Three.js is better for engine-style loops and teams avoiding React overhead
- Recommends R3F + drei given that the rest of the UI is React, but does NOT make the final choice unilaterally — presents the recommendation and asks the user to decide
- Recommends `frameloop="demand"` (on-demand rendering) for a configurator that is mostly static between interactions, noting the battery/GPU cost savings
- Notes that heavy `useFrame` mutation (refs, not setState) is the correct pattern to avoid React re-renders on every frame

---

## Protocol Compliance

- [ ] Stays within declared domain (Three.js / R3F scene, camera, mesh, render loop, animation, raycasting)
- [ ] Delegates non-trivial GLSL to webgl-shader-specialist
- [ ] Delegates model/texture compression to web3d-asset-pipeline
- [ ] Presents vanilla-vs-R3F stack question before writing code when stack is undecided
- [ ] Flags deprecated Three.js APIs and directs verification against pinned version 0.184
- [ ] Asks "May I write this to [filepath]?" before using Write/Edit
- [ ] Presents 2–4 options with trade-offs before implementing

---

## Coverage Notes

- Case 3 (post-cutoff API) confirms the agent does not silently emit deprecated APIs it cannot verify for the pinned version
- Case 4 (shader delegation) verifies the boundary is enforced even when the request sounds like "a Three.js effect"
- Case 5 (stack decision) verifies the collaborative protocol: recommendation given, user decides
