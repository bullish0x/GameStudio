# Rule: assets/3d/** — 3D models and textures

Scope: glTF/GLB models, textures, and their compressed variants delivered to the
browser.

## Enforced standards

- **glTF/GLB only as the delivery format.** Source files (.blend, .fbx, Spline
  projects) live outside the runtime asset folder; only optimized glTF/GLB ships.
- **Models are validated and stripped.** Pass the glTF validator; remove unused
  UV sets, cameras, and oversized accessors before commit.
- **Geometry is compressed.** Draco or Meshopt applied; the required runtime
  decoder is documented alongside the asset.
- **Textures use GPU-native compression where viable.** KTX2/Basis preferred
  over raw PNG/JPEG for 3D textures; uncompressed maps are justified per case.
- **Textures are right-sized and packed.** No oversized maps relative to
  on-screen footprint; ORM channels packed; atlases reused.
- **Color space is tagged at authoring.** Base-color/emissive as sRGB; normal/
  ORM/data maps as linear.
- **Budgets are enforced.** Per-scene triangle and draw-call budgets are
  documented; assets exceeding budget are flagged before integration.
- **LODs exist where needed.** Anything viewed at varying distance ships LODs.
- **Naming conventions.** Follows the repo's asset naming/validation conventions
  (see validate-assets.sh hook) so automated checks pass.
