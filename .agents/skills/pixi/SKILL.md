---
name: pixi
description: "Use this skill first for ANY PixiJS v8 task; it routes to the right specialized skill for the job. Covers the full PixiJS surface: Application setup, the scene graph (Container, Sprite, Graphics, Text, Mesh, ParticleContainer, DOMContainer, GifSprite), rendering (WebGL/WebGPU/Canvas, render loop, custom shaders, filters, blend modes), assets, events, color, math, ticker, accessibility, performance, environments, migration from v7, and project scaffolding. Triggers on: pixi, pixi.js, pixijs, PixiJS, v8, Application, app.init, Sprite, Container, Graphics, Text, Mesh, ParticleContainer, DOMContainer, GifSprite, Assets, Ticker, renderer, WebGL, WebGPU, scene graph, filter, shader, blend mode, texture, BitmapText, create-pixi, how do I draw, how do I render, how do I animate in pixi."
license: MIT
---

Entry point for the PixiJS v8 skill collection. PixiJS is the fastest library available for the web, working across all devices and allowing you to create rich, interactive graphics and cross-platform applications using WebGL, WebGPU, and Canvas as a fallback.

## How to use this skill

1. Find the specialized skill in the router below that best matches the task.
2. Load that skill's `SKILL.md` and follow its guidance.
3. If no sub-skill fits (the task references a specific class, function, option, or API surface not listed below), **WebFetch `https://pixijs.download/release/docs/llms.txt`**. That file is the auto-generated, always-current index of the full PixiJS API and guides. Each entry links to a `.html.md` page you can WebFetch for the detailed content.

For the long-form description and trigger keywords of every skill, see [references/index.md](references/index.md).

## Skill router

### Foundations

| Skill | Load when... |
|---|---|
| [pixijs-application](../pixi-application/SKILL.md) | Creating or configuring a PixiJS `Application`, calling `app.init()`, accessing `app.stage`/`renderer`/`canvas`/`screen`, resize/ticker plugins, `app.destroy()`. |
| [pixijs-core-concepts](../pixi-core-concepts/SKILL.md) | Understanding the renderer pipeline, choosing WebGL/WebGPU/Canvas, render loop internals, systems and pipes. |
| [pixijs-create](../pixi-create/SKILL.md) | Scaffolding a new project with the `create-pixi` CLI (bundler-vite, creation-web, framework-react templates). |
| [pixijs-environments](../pixi-environments/SKILL.md) | Running PixiJS in Web Workers, Node/SSR, or strict-CSP contexts (`DOMAdapter`, `WebWorkerAdapter`, `pixi.js/unsafe-eval`). |
| [pixijs-migration-v8](../pixi-migration-v8/SKILL.md) | Upgrading from v7 to v8 or fixing v7 patterns (`beginFill`/`endFill`, `@pixi/*` packages, `BaseTexture`, `DisplayObject`). |
| [pixijs-scene-core-concepts](../pixi-scene-core-concepts/SKILL.md) | Understanding the scene graph as a whole: containers vs leaves, transforms, render order, masking, `RenderLayer`. |

### Scene Objects

| Skill | Load when... |
|---|---|
| [pixijs-scene-container](../pixi-scene-container/SKILL.md) | Working with `Container`: `addChild`/`removeChild`, transforms, `zIndex`, bounds, `toGlobal`/`toLocal`, `destroy`. |
| [pixijs-scene-sprite](../pixi-scene-sprite/SKILL.md) | Drawing images: `Sprite`, `AnimatedSprite`, `NineSliceSprite`, `TilingSprite`. |
| [pixijs-scene-graphics](../pixi-scene-graphics/SKILL.md) | Drawing vector shapes or paths: `Graphics`, `GraphicsContext`, `fill`/`stroke`, `FillGradient`, SVG. |
| [pixijs-scene-text](../pixi-scene-text/SKILL.md) | Rendering text: `Text`, `BitmapText`, `HTMLText`, `SplitText`, `TextStyle`. |
| [pixijs-scene-mesh](../pixi-scene-mesh/SKILL.md) | Custom geometry: `Mesh`, `MeshSimple`, `MeshPlane`, `MeshRope`, `PerspectiveMesh`. |
| [pixijs-scene-particle-container](../pixi-scene-particle-container/SKILL.md) | Rendering thousands of lightweight sprites: `ParticleContainer`, `Particle`, `dynamicProperties`. |
| [pixijs-scene-dom-container](../pixi-scene-dom-container/SKILL.md) | Overlaying HTML elements on the canvas: `DOMContainer`, `pixi.js/dom`. |
| [pixijs-scene-gif](../pixi-scene-gif/SKILL.md) | Displaying animated GIFs: `GifSprite`, `GifSource`, `pixi.js/gif`. |

### Utilities

| Skill | Load when... |
|---|---|
| [pixijs-assets](../pixi-assets/SKILL.md) | Loading resources: `Assets.init`, `Assets.load`, bundles, manifests, spritesheets, caching. |
| [pixijs-color](../pixi-color/SKILL.md) | Creating or converting colors: `Color` class, hex/rgb/hsl, `tint`, `premultiply`. |
| [pixijs-events](../pixi-events/SKILL.md) | Handling pointer/mouse/touch/wheel input: `eventMode`, `FederatedEvent`, `hitArea`, `cursor`, drag. |
| [pixijs-math](../pixi-math/SKILL.md) | Points, vectors, matrices, shapes, hit testing: `Point`, `Matrix`, `Rectangle`, `toGlobal`/`toLocal`. |
| [pixijs-ticker](../pixi-ticker/SKILL.md) | Per-frame logic or controlling the render loop: `Ticker`, `deltaTime`, `UPDATE_PRIORITY`, `maxFPS`. |

### Advanced

| Skill | Load when... |
|---|---|
| [pixijs-accessibility](../pixi-accessibility/SKILL.md) | Screen reader or keyboard navigation: `AccessibilitySystem`, `accessibleTitle`, `tabIndex`. |
| [pixijs-blend-modes](../pixi-blend-modes/SKILL.md) | Compositing with blend modes: `add`, `multiply`, `screen`, `overlay`, `pixi.js/advanced-blend-modes`. |
| [pixijs-custom-rendering](../pixi-custom-rendering/SKILL.md) | Writing custom shaders, uniforms, or batchers: `Shader.from`, `GlProgram`/`GpuProgram`, `UniformGroup`, custom `Filter`. |
| [pixijs-filters](../pixi-filters/SKILL.md) | Applying visual effects: `BlurFilter`, `ColorMatrixFilter`, `DisplacementFilter`, `Filter.from`, `pixi-filters`. |
| [pixijs-performance](../pixi-performance/SKILL.md) | Profiling or optimizing FPS, draw calls, GPU memory: culling, `GCSystem`, `cacheAsTexture`, object pooling. |

## Fallback: canonical PixiJS docs

If the task references a class, function, option, or API surface not covered by any sub-skill above, **WebFetch `https://pixijs.download/release/docs/llms.txt`**. It's the auto-generated index of the full PixiJS API and guides, regenerated on every release. Each entry links to a `.html.md` page you can WebFetch for the detailed content. Use this fallback whenever the router table doesn't point at an obvious match.
