# Rule: src/shaders/** — GLSL / WebGL shader code

Scope: vertex/fragment shaders, ShaderMaterial/RawShaderMaterial wiring, custom
material patches, post-processing passes, and GPGPU/FBO code.

## Enforced standards

- **Precision is declared deliberately.** Fragment shaders target `mediump`
  unless `highp` is justified and known-available on the target hardware. Assume
  mobile precision limits exist; document the assumption.
- **Minimize fragment work.** Push computation to the vertex stage or uniforms
  where possible. Texture fetch count and dependent texture reads are kept low
  and noted.
- **Avoid per-fragment dynamic branching.** Prefer `mix`/`step`/`smoothstep`
  over `if` in fragment hot paths.
- **Color space correctness.** Sampled-texture color space and output color
  space are handled explicitly. Mismatches are treated as bugs, not style.
- **Prefer patching built-ins for small tweaks.** Use `onBeforeCompile` over a
  full `ShaderMaterial` rewrite when only adjusting a built-in material — but
  document the dependency on internal chunk names (upgrade fragility).
- **Post-processing is budgeted.** Each full-screen pass is justified; stacked
  passes (especially for mobile targets) are flagged and combined where possible.
- **Capability assumptions are explicit.** Any reliance on WebGL2-only features
  or extensions is stated, with a fallback or a clear hardware requirement note.
- **Uniforms are documented.** Each shader lists its uniforms and their expected
  ranges/units so scene code can wire them correctly.
