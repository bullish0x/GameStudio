# PixiJS (2D Web) — VERSION

Reference version for the web 2D stack, verified **2026-05-29**. When a project
installs a specific version, update the table to match — `pixijs-specialist`
reads this file to verify APIs against the installed release rather than relying
on training data.

| Package | Reference version | Verified |
| ------- | ----------------- | -------- |
| `pixi.js` | `8.22.0` | 2026-11-03 |

## Knowledge-gap window

PixiJS changed substantially across major versions (notably v7 → v8: renderer
initialization, the `Assets` loader API, and more — this stack is on v8). Treat
any API you are unsure about as **verify-before-use** against the pinned version.

## Agent instructions

`pixijs-specialist` must:

1. Read this file to confirm the version in use.
2. Flag any API it is not certain exists in the pinned version.
3. Prefer the project's installed-version docs over memory.

## Notable v7 → v8 gotchas to watch

- Async renderer creation (`await Application.init(...)`) replaced the v7 constructor flow.
- The unified `Assets` loader replaced the older `Loader`.
- Graphics API changes (fill/stroke ordering).
- WebGPU renderer available alongside WebGL — state the fallback explicitly.

## 2026-11-03 update (8.18.1 → 8.22.0)

Source: https://github.com/pixijs/pixijs/releases/tag/v8.22.0

- 8.21: `Matrix.decompose()`/`setFromMatrix()` now return negative `scale.x` instead of skew for mirrored matrices (rendering identical; values read back differ).
- 8.20: `StructsAndGroups.isUniform` → `accessMode` (`group.accessMode === 'uniform'`); old property silently `undefined`.
- 8.20: `updateTransform({scaleX:0})` no longer coerces to 1.
- New features across 8.19–8.22: improved batching, text rendering, WebGPU renderer stability.
