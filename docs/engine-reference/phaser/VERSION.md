# Phaser (2D Web Games) — VERSION

Reference version for the web 2D game stack, verified **2026-05-29**. When a
project installs a specific version, update the table to match — `phaser-specialist`
reads this file to verify APIs against the installed release rather than relying
on training data.

| Package | Reference version | Verified |
| ------- | ----------------- | -------- |
| `phaser` | `4.2.1` | 2026-11-03 |

## Knowledge-gap window

Phaser changed substantially from v3 → v4 (this stack is on **v4**). Treat any
API you are unsure about as **verify-before-use** against the pinned version.

## Agent instructions

`phaser-specialist` must:

1. Read this file to confirm the version in use.
2. Flag any API it is not certain exists in the pinned version.
3. Prefer the project's installed-version docs over memory.

## Notable v3 → v4 gotchas to watch

- **WebGL is the default renderer; Canvas is deprecated.** Do not design Canvas
  fallbacks unless explicitly required.
- **RenderNode architecture replaced v3 pipelines.** No direct `gl.*` calls — use
  an `Extern` game object as the sanctioned escape hatch.
- **FX and Masks are unified into the Filter system.**
- **Removed classes:** `Point`, `Mesh`, `BitmapMask` — use the v4 replacements.
- **Tint system changed** — `setTint` with 6 tint modes.
- **GL texture orientation now matches WebGL** (changed from v3).

## 2026-11-03 update (4.1.0 → 4.2.1)

Source: https://github.com/phaserjs/phaser/releases/tag/v4.2.1

- Phaser 4 is not Phaser 3: pipelines replaced by render nodes; FX and Masks unified into one Filter system. Agents emitting v3 `setPipeline`/`postFX`/`preFX` are wrong.
- 4.2 adds: game config `render.alphaStrategy`/`stencil`/`stencilAlphaStrategy`, `CustomContext` GameObject, `Mesh2D`, `BatchHandlerTri`.
- 4.1: `Layer` is now a true GameObject (filters on layers work); filter `Controller.getPadding()`→`getPaddingCeil()`.
- Tint is now six modes with separate color and mode.
