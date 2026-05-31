# Agent Test Spec: web2d-asset-pipeline

## Agent Summary

Domain: 2D asset preparation and the web 2D pipeline — spritesheet/texture atlas packing and trimming, POT and mipmap decisions, KTX2/Basis compression for 2D textures, Spine/DragonBones skeletal export and runtime integration, particle textures, GIF sources (convert to atlas frames or documented runtime path), and manifest-keyed assets (stable keys, not raw file paths). Produces optimized assets that `pixijs-specialist` and `phaser-specialist` load. The 2D analogue to `web3d-asset-pipeline`.
Does NOT own: scene, sprite, or loader code (specifies what the runtime must load to pixijs-specialist/phaser-specialist); shader authoring (coordinates texture channel layout and color space with webgl-shader-specialist but does not write GLSL); gameplay state (ships the art, keyed).
Reasoning tier: balanced reasoning (default for specialists).
No gate IDs assigned.

---

## Static Assertions (Structural)

- [ ] `description:` field is present and references spritesheet/atlas packing, KTX2/Basis, Spine/DragonBones, manifest-keyed assets, and that it produces assets for pixijs-specialist and phaser-specialist
- [ ] `tools:` list includes Read, Glob, Grep, Write, Edit, Bash, Task
- [ ] Balanced reasoning tier is recommended
- [ ] `maxTurns: 20` is set
- [ ] Agent definition names `pixijs-specialist` and `phaser-specialist` as consumers
- [ ] Agent definition states it does NOT write scene or loader code
- [ ] Post-cutoff tooling risk guidance is present (TexturePacker, Spine exporter, basisu/toktx versions evolve; verify against installed tools)

---

## Test Cases

### Case 1: In-domain request — atlas packing for a character with multiple states

**Input:** "Pack a player character with 8 animation states (idle, run, jump, fall, attack, hurt, death, victory), each 12 frames at 128×128. Target is both PixiJS v8 and Phaser 4."

**Expected behavior:**
- Recommends trimming transparent padding from each frame and packing all 96 frames into the fewest power-of-two atlas pages needed (states the expected page count and dimensions)
- Explains the trim/pivot metadata the runtime needs and confirms both PixiJS v8 (Spritesheet JSON) and Phaser 4 (Phaser-format atlas JSON) can be output by common packers (TexturePacker, free-tex-packer)
- Explicitly outputs stable manifest keys for each animation (`player-idle`, `player-run`, etc.) — never raw file paths
- Notes whether mipmaps are appropriate for this pixel-art character (likely not — suggests disabling to avoid bilinear blur on crisp art)
- Does NOT write the loader code — specifies the key/manifest the runtime must load

### Case 2: Wrong-domain redirect — loader and scene code

**Input:** "Write the PixiJS code to load the atlas and create AnimatedSprites from it."

**Expected behavior:**
- Identifies that loader integration and `AnimatedSprite` construction are `pixijs-specialist` domain, not the asset pipeline
- Does NOT produce `Assets.load()` or `AnimatedSprite` JavaScript code
- Provides the manifest/key specification so `pixijs-specialist` has exactly what it needs (atlas file name, frame key format, animation groups)
- Redirects the implementation task explicitly to `pixijs-specialist`

### Case 3: Post-cutoff tooling risk — TexturePacker format flag

**Input:** "Generate a Phaser 3 JSON atlas with TexturePacker's `--format phaser3` flag."

**Expected behavior:**
- Notes that Phaser 4 may require a different format output from TexturePacker than Phaser 3; the `--format phaser3` flag should be verified against the project's installed TexturePacker version and the Phaser 4 loader's expected schema
- Flags the version-dependency explicitly rather than assuming the flag is current
- Recommends running `TexturePacker --help` or checking the installed version's format list to confirm the correct `--format` value for Phaser 4
- Provides a fallback: output in a generic JSON-array format and document any parsing adjustments needed

### Case 4: Skeletal animation trade-off — Spine runtime vs baked frames

**Input:** "Our character needs smooth blended transitions between 20 animation states. Should we use Spine skeletal animation or baked sprite frames?"

**Expected behavior:**
- Presents the trade-off explicitly: Spine runtime provides smooth bone-based blending and much smaller file sizes for complex animations, but requires loading the Spine runtime JS (bundle cost) and the project must license Spine; baked frames are simpler but storage-heavy for 20 states with smooth transitions
- Recommends Spine when blending between many states is a core requirement; recommends baked frames when the skeletal flexibility is not needed and the team lacks a Spine workflow
- Flags that the Spine runtime must be added as a project dependency and specifies which version the project should target
- States the export artifacts required (atlas + skeleton JSON + animation data) and confirms they are consumed via the manifest-key system
- Does NOT make the final decision — presents options and asks the user

### Case 5: Texture budget enforcement and KTX2 compression recommendation

**Input:** "The HUD scene loads 14 separate PNG textures totalling 28 MB. It runs on mobile."

**Expected behavior:**
- Flags the budget violation: 14 separate textures cause 14 texture-swap batch breaks; 28 MB PNG decode to full uncompressed VRAM on mobile, which is almost certainly over budget
- Proposes remediation: pack all HUD elements into one or two atlases (single texture bind, batched draw calls) and compress with KTX2/Basis for GPU-native compression (dramatically lower VRAM footprint vs PNG)
- Recommends keeping small pixel-art UI elements as PNG where KTX2 compression artifacts would be visible, and using KTX2 for larger photographic or painterly HUD assets
- States the expected VRAM delta explicitly so `pixijs-specialist` / `phaser-specialist` can see the win
- Does NOT proceed silently — flags the budget problem before assets land in `src/`

---

## Protocol Compliance

- [ ] Stays within declared domain (atlas packing, compression, skeletal export, manifest keying)
- [ ] Redirects loader/scene code to pixijs-specialist or phaser-specialist
- [ ] Flags packing tool version risk and directs verification against installed versions
- [ ] Enforces texture budget and batch-count issues before assets reach src/
- [ ] Emits stable manifest keys — never raw file paths — in all output
- [ ] Coordinates texture channel layout with webgl-shader-specialist when displacement/mask maps are needed
- [ ] Asks "May I write this to [filepath]?" before writing pipeline scripts or config

---

## Coverage Notes

- Case 1 verifies cross-runtime output: the agent handles both PixiJS and Phaser atlas format requirements from a single packing decision
- Case 3 (tooling version risk) confirms the agent does not silently assume TexturePacker flag compatibility across Phaser versions
- Case 5 (budget enforcement) confirms the agent acts as the upstream performance gate, not a passive processor — analogous to web3d-asset-pipeline Case 4
