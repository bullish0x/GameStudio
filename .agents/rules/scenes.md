# Rule: src/scenes/** — Three.js / R3F scene code

Scope: scene graph construction, renderer setup, cameras, lights, meshes, and
the animation/render loop (vanilla Three.js or React Three Fiber).

## Enforced standards

- **No per-frame allocation.** Do not create objects (`new THREE.Vector3()`,
  arrays, closures) inside the render loop / `useFrame` / `requestAnimationFrame`
  callback. Hoist scratch objects and reuse them.
- **Dispose discipline.** Every manually created geometry, material, texture,
  and render target must have a corresponding `.dispose()` on teardown/unmount.
  GPU resources are not garbage-collected.
- **Reuse shared resources.** Materials and geometries used by multiple meshes
  are created once and shared, not duplicated per instance.
- **Instance or merge repeats.** Many copies of one mesh use `InstancedMesh`
  (or drei `<Instances>`); static repeated geometry is merged. Raw per-object
  meshes for large counts are flagged.
- **Render strategy is explicit.** A scene declares whether it runs a continuous
  loop or on-demand rendering (`frameloop="demand"` in R3F). Continuous loops on
  static scenes must be justified.
- **Color space is set.** Renderer color space, tone mapping, and texture color
  space are configured explicitly — never left to chance.
- **No app state ownership.** Scene code reads state and emits events; it does
  not own game/application state. Coordinate with the UI/gameplay layer.
- **Loading is non-blocking.** Large model/texture loads show a loading state
  and never block the main thread on parse.

## R3F-specific

- Mutate via refs in `useFrame`; do not call `setState` every frame.
- Memoize geometries/materials created in components.
- Manually created resources still need manual disposal even under R3F.
