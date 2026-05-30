# Skill Test Spec: /threejs-postprocessing

> **Category**: threejs · **Skill type**: knowledge/reference · **Spec written**: 2026-05-29

## Skill Summary
A concise, Quick-Start-first reference for the Three.js `EffectComposer` pipeline: setup, resize handling, and a catalogue of built-in passes — bloom (`UnrealBloomPass`), selective bloom via layers, FXAA / SMAA anti-aliasing, SSAO, DOF (`BokehPass`), film grain, vignette, colour correction, gamma correction, pixelation, glitch, halftone, and outline. Also covers custom `ShaderPass` (wave distortion, invert, chromatic aberration), multi-composer layered rendering, WebGPU post-processing preview, and a `bloomPass.enabled = false` toggle pattern. Triggered when adding visual effects, colour grading, blur, glow, or creating custom screen-space shaders.

## Static Assertions (`/skill-test static`)
- [ ] Frontmatter has `name: threejs-postprocessing` and a `description`
- [ ] Description names EffectComposer, bloom, DOF, and screen effects
- [ ] Body contains a Quick Start section that is complete and runnable
- [ ] Body has a "Handle Resize" section showing both `composer.setSize()` and pass-specific resolution updates
- [ ] Body has a "Performance Tips" section with `bloomPass.enabled = false` pattern

## Content Coverage Assertions (`/skill-test spec`)
- [ ] All pass imports use `three/addons/postprocessing/` and `three/addons/shaders/` paths
- [ ] `composer.render()` (not `renderer.render()`) is used in the animation loop
- [ ] `RenderPass` is always the first pass added to the composer
- [ ] FXAA resolution uniform uses `1 / window.innerWidth` and updated on resize
- [ ] `SSAOPass.OUTPUT.Default` and alternative output modes are listed
- [ ] `BokehPass` `focus`, `aperture`, and `maxblur` uniforms are shown
- [ ] Selective bloom uses `THREE.Layers` and `darkenNonBloomed` / `restoreMaterial` traverse pattern
- [ ] Custom `ShaderPass` requires `tDiffuse: { value: null }` as the input sampler
- [ ] `renderer.autoClear = false` is set for multi-composer rendering

## Version Awareness
- [ ] Aligns with pinned three 0.184; WebGPU post-processing (`postProcessing` node-based API) preview is noted as `r150+` — flag as experimental / subject to change; verify `three/addons/nodes/Nodes.js` path at 0.184

## Known Gaps / Notes
- No `TAA` pass is listed despite being in `three/addons/postprocessing/TAARenderPass.js`.
