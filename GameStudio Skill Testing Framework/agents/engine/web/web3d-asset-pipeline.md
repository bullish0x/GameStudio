# Agent Test Spec: web3d-asset-pipeline

## Agent Summary

Domain: 3D model and texture preparation for the web — glTF/GLB authoring and validation, Draco/Meshopt geometry compression, KTX2/Basis texture compression, texture channel packing (ORM), texture resizing, LOD generation, draw-call budgeting at the asset level, and Spline export workflows. Produces optimized assets that `threejs-specialist` loads and `webgl-shader-specialist` samples.
Does NOT own: scene or loader code (specifies loader requirements to threejs-specialist), shader authoring (coordinates texture channel layouts with webgl-shader-specialist but does not write GLSL).
Reasoning tier: balanced reasoning (default for specialists).
No gate IDs assigned.

---

## Static Assertions (Structural)

- [ ] `description:` field is present and references glTF/GLB, Draco, Meshopt, KTX2/Basis, LOD generation, draw-call budgeting, and Spline export
- [ ] `tools:` list includes Read, Glob, Grep, Write, Edit, Bash, Task
- [ ] Balanced reasoning tier is recommended
- [ ] `maxTurns: 20` is set
- [ ] Agent definition names `threejs-specialist` as the consumer of its output
- [ ] Agent definition states it does NOT write scene or loader code
- [ ] Post-cutoff tooling risk guidance is present (gltf-transform, toktx, Basis flags evolve; verify against installed version)

---

## Test Cases

### Case 1: In-domain request — compress a character glTF for mobile web

**Input:** "We have a 15 MB character model (`.glb`). Target is mid-range mobile. Recommend a compression strategy."

**Expected behavior:**
- Presents at least two geometry-compression options: Draco (smaller size, slower decode) vs Meshopt (faster decode, broad tooling, slightly larger) with trade-offs tied to mobile decode cost
- Recommends KTX2/Basis over PNG/JPEG for textures and explains the VRAM win (GPU-native compression vs full decode to uncompressed VRAM)
- Recommends ORM channel packing (occlusion + roughness + metalness into one texture) to cut texture count
- Specifies the runtime loader chain `threejs-specialist` must configure: `DRACOLoader` or `MeshoptDecoder` + `KTX2Loader`
- Flags color-space tagging: base-color/emissive as sRGB, data textures (normal, ORM) as linear
- Does NOT write loader or scene code — only the pipeline/commands and loader requirements

### Case 2: Wrong-domain redirect — loader integration code

**Input:** "Write the Three.js code to load my compressed .glb with DRACOLoader and display it in the scene."

**Expected behavior:**
- Identifies that loader integration code and scene setup belong to `threejs-specialist`, not the asset pipeline
- Does NOT produce `GLTFLoader` / `DRACOLoader` JavaScript scene code
- Provides the loader configuration requirements in spec form (e.g., "DRACOLoader decoder path must be set; KTX2Loader transcoder WASM must be loaded") so `threejs-specialist` has what it needs
- Redirects the implementation task explicitly to `threejs-specialist`

### Case 3: Post-cutoff tooling version risk — gltf-transform flag

**Input:** "Use `gltf-transform optimize --simplify` to reduce polygon count."

**Expected behavior:**
- Flags that `gltf-transform` CLI flags evolve between major versions; `--simplify` behavior and availability should be verified against the installed version of `gltf-transform` rather than relying on training data
- Provides the best-effort flag guidance while clearly marking it as version-dependent
- Points the user to run `gltf-transform --help` or check the installed version's changelog rather than assuming the flag is current
- Provides alternative pipeline options (e.g., `gltfpack` with `-si` simplification ratio) as a cross-check

### Case 4: LOD budget enforcement — asset over triangle budget

**Input:** "Our environment scene has one hero rock mesh at 800 000 triangles. The draw-call budget per scene is 500K triangles total."

**Expected behavior:**
- Flags the budget violation before it reaches `threejs-specialist` — this is the asset-level line of defense
- Proposes at least two remediation options: LOD generation (full-res close-up + reduced-res distant) with expected triangle counts per LOD level; and/or geometry simplification via `gltf-transform simplify` or `gltfpack`
- States the LOD generation toolchain (e.g., `gltf-transform lod`, `simplygon`, or manual artist pass) and the decoder requirements
- Documents the per-LOD triangle target against the 500K scene budget
- Does NOT proceed silently — blocks the asset from landing in `src/` until the budget is met

### Case 5: Spline export workflow decision

**Input:** "We have an interactive Spline scene with animated hover behaviors. Should we export to glTF or use the Spline runtime?"

**Expected behavior:**
- Presents the two paths with real trade-offs: glTF export (smaller bundle, pipeline-optimized, loses Spline-native interactive behaviors) vs Spline runtime (`@splinetool/r3f-spline`, preserves hover/interaction, but adds bundle weight and ties the project to the Spline runtime)
- Recommends glTF export as the default path and Spline runtime only when the interactive Spline behaviors are genuinely required
- Flags the bundle-size cost of the Spline runtime explicitly (runtime JS weight + asset)
- States that the glTF export path runs through this same pipeline (Draco/KTX2/LOD) before `threejs-specialist` loads it
- Does NOT make the final decision — presents options and asks the user

---

## Protocol Compliance

- [ ] Stays within declared domain (format, compression, packing, LOD, budgeting)
- [ ] Redirects loader/scene integration code to threejs-specialist
- [ ] Flags tooling version risk (gltf-transform, toktx, Basis) and directs verification against installed version
- [ ] Enforces asset budgets before assets reach src/ — does not silently pass over-budget assets
- [ ] Specifies loader requirements for threejs-specialist rather than writing loader code itself
- [ ] Asks "May I write this to [filepath]?" before writing pipeline scripts or config

---

## Coverage Notes

- Case 1 verifies the full compression decision path including loader requirements hand-off
- Case 4 (LOD budget enforcement) confirms the agent acts as the upstream performance gate, not a passive processor
- Case 5 (Spline) verifies the default-to-glTF stance is followed and runtime is recommended only when interactive behaviors are needed
