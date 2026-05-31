# Available Skills (Slash Commands)

182 slash commands organized by phase. Type `/` in Claude Code to access any of them.

## Onboarding & Navigation

| Command | Purpose |
|---------|---------|
| `/start` | First-time onboarding — asks where you are, then guides you to the right workflow |
| `/help` | Context-aware "what do I do next?" — reads current stage and surfaces the required next step |
| `/project-stage-detect` | Full project audit — detect phase, identify existence gaps, recommend next steps |
| `/setup-engine` | Configure engine + version, detect knowledge gaps, populate version-aware reference docs |
| `/adopt` | Brownfield format audit — checks internal structure of existing GDDs/ADRs/stories, produces migration plan |

## Game Design

| Command | Purpose |
|---------|---------|
| `/brainstorm` | Guided ideation using professional studio methods (MDA, SDT, Bartle, verb-first) |
| `/map-systems` | Decompose game concept into systems, map dependencies, prioritize design order |
| `/design-system` | Guided, section-by-section GDD authoring for a single game system |
| `/quick-design` | Lightweight design spec for small changes — tuning, tweaks, minor additions |
| `/review-all-gdds` | Cross-GDD consistency and game design holism review across all design docs |
| `/propagate-design-change` | When a GDD is revised, find affected ADRs and produce an impact report |

## Art & Assets

| Command | Purpose |
|---------|---------|
| `/art-bible` | Guided, section-by-section Art Bible authoring — creates visual identity spec before asset production begins |
| `/asset-spec` | Generate per-asset visual specifications and AI generation prompts from GDDs, level docs, or character profiles |
| `/asset-audit` | Audit assets for naming conventions, file size budgets, and pipeline compliance |

## UX & Interface Design

| Command | Purpose |
|---------|---------|
| `/ux-design` | Guided section-by-section UX spec authoring (screen/flow, HUD, or pattern library) |
| `/ux-review` | Validate UX specs for GDD alignment, accessibility, and pattern compliance |

## Architecture

| Command | Purpose |
|---------|---------|
| `/create-architecture` | Guided authoring of the master architecture document |
| `/architecture-decision` | Create an Architecture Decision Record (ADR) |
| `/architecture-review` | Validate all ADRs for completeness, dependency ordering, and GDD coverage |
| `/create-control-manifest` | Generate flat programmer rules sheet from accepted ADRs |

## Stories & Sprints

| Command | Purpose |
|---------|---------|
| `/create-epics` | Translate GDDs + ADRs into epics — one per architectural module |
| `/create-stories` | Break a single epic into implementable story files |
| `/dev-story` | Read a story and implement it — routes to the correct programmer agent |
| `/sprint-plan` | Generate or update a sprint plan; initializes sprint-status.yaml |
| `/sprint-status` | Fast 30-line sprint snapshot (reads sprint-status.yaml) |
| `/story-readiness` | Validate a story is implementation-ready before pickup (READY/NEEDS WORK/BLOCKED) |
| `/story-done` | 8-phase completion review after implementation; updates story file, surfaces next story |
| `/estimate` | Structured effort estimate with complexity, dependencies, and risk breakdown |

## Reviews & Analysis

| Command | Purpose |
|---------|---------|
| `/design-review` | Review a game design document for completeness and consistency |
| `/code-review` | Architectural code review for a file or changeset |
| `/balance-check` | Analyze game balance data, formulas, and config — flag outliers |
| `/content-audit` | Audit GDD-specified content counts against implemented content |
| `/scope-check` | Analyze feature or sprint scope against original plan, flag scope creep |
| `/perf-profile` | Structured performance profiling with bottleneck identification |
| `/tech-debt` | Scan, track, prioritize, and report on technical debt |
| `/gate-check` | Validate readiness to advance between development phases (PASS/CONCERNS/FAIL) |
| `/consistency-check` | Scan all GDDs against the entity registry to detect cross-document inconsistencies (stats, names, rules that contradict each other) |
| `/security-audit` | Audit the game for security vulnerabilities: save tampering, cheat vectors, network exploits, data exposure, and input validation gaps |

## QA & Testing

| Command | Purpose |
|---------|---------|
| `/qa-plan` | Generate a QA test plan for a sprint or feature |
| `/smoke-check` | Run critical path smoke test gate before QA hand-off |
| `/soak-test` | Generate a soak test protocol for extended play sessions |
| `/regression-suite` | Map test coverage to GDD critical paths, identify fixed bugs without regression tests |
| `/test-setup` | Scaffold the test framework and CI/CD pipeline for the project's engine |
| `/test-helpers` | Generate engine-specific test helper libraries for the test suite |
| `/test-evidence-review` | Quality review of test files and manual evidence documents |
| `/test-flakiness` | Detect non-deterministic (flaky) tests from CI run logs |
| `/skill-test` | Validate skill files for structural compliance and behavioral correctness |
| `/skill-improve` | Improve a skill using a test-fix-retest loop — diagnose, propose fix, rewrite, verify |

## Production

| Command | Purpose |
|---------|---------|
| `/milestone-review` | Review milestone progress and generate status report |
| `/retrospective` | Run a structured sprint or milestone retrospective |
| `/bug-report` | Create a structured bug report |
| `/bug-triage` | Read all open bugs, re-evaluate priority vs. severity, assign owner and label |
| `/reverse-document` | Generate design or architecture docs from existing implementation |
| `/playtest-report` | Generate a structured playtest report or analyze existing playtest notes |

## Release

| Command | Purpose |
|---------|---------|
| `/release-checklist` | Generate and validate a pre-release checklist for the current build |
| `/launch-checklist` | Complete launch readiness validation across all departments |
| `/changelog` | Auto-generate changelog from git commits and sprint data |
| `/patch-notes` | Generate player-facing patch notes from git history and internal data |
| `/hotfix` | Emergency fix workflow with audit trail, bypassing normal sprint process |
| `/day-one-patch` | Prepare a focused day-one patch for known issues discovered after gold master but before or at public launch |

## Creative & Content

| Command | Purpose |
|---------|---------|
| `/prototype` | Concept prototype — throwaway build right after brainstorm to validate core idea (Phase 1) |
| `/vertical-slice` | Pre-Production validation — production-quality end-to-end build before committing to Production (Phase 4) |
| `/onboard` | Generate contextual onboarding document for a new contributor or agent |
| `/localize` | Localization workflow: string extraction, validation, translation readiness |

## Team Orchestration

Coordinate multiple agents on a single feature area:

| Command | Coordinates |
|---------|-------------|
| `/team-combat` | game-designer + gameplay-programmer + ai-programmer + technical-artist + sound-designer + qa-tester |
| `/team-narrative` | narrative-director + writer + world-builder + level-designer |
| `/team-ui` | ux-designer + ui-programmer + art-director + accessibility-specialist |
| `/team-release` | release-manager + qa-lead + devops-engineer + producer |
| `/team-polish` | performance-analyst + technical-artist + sound-designer + qa-tester |
| `/team-audio` | audio-director + sound-designer + technical-artist + gameplay-programmer |
| `/team-level` | level-designer + narrative-director + world-builder + art-director + systems-designer + qa-tester |
| `/team-live-ops` | live-ops-designer + economy-designer + community-manager + analytics-engineer |
| `/team-qa` | qa-lead + qa-tester + gameplay-programmer + producer |

## Web Game Development

57 skills feeding the web engine agents (Three.js, React Three Fiber, PixiJS). Invocable like any other skill.

### 3D Rendering (Three.js)

| Command | Purpose |
|---------|---------|
| `/threejs-scene-setup` | Set up a Three.js scene with best practices for performance, organization, and maintainability |
| `/threejs-geometry-management` | Efficient geometry creation, management, and optimization including BufferGeometry, instancing, and custom geometry for mobile performance |
| `/threejs-material-systems` | Comprehensive material management including all Three.js material types, custom shaders, material pooling, and mobile optimization |
| `/threejs-texture-management` | Texture loading, compression, atlasing, and memory optimization for mobile Three.js applications |
| `/threejs-raycasting` | Mouse and touch interaction using raycasting for object picking, collision detection, and UI interaction in Three.js |
| `/threejs-animation-systems` | Three.js animation implementation with AnimationMixer, clips, actions, blending, and skeletal animation for characters |
| `/threejs-model-loading` | Load and optimize 3D models in GLTF, FBX, and OBJ formats with compression, progressive loading, and mobile optimization |
| `/threejs-camera-controls` | Camera systems for Three.js including orbit controls, first-person, third-person, and cinematic cameras |
| `/threejs-lighting` | Comprehensive lighting systems for Three.js including ambient, directional, point, spot, and hemisphere lights with optimization strategies |
| `/threejs-shadows` | Shadow configuration and optimization for Three.js including shadow maps, CSM, PCFSS, and mobile shadow strategies |
| `/threejs-particles` | Particle systems for Three.js including GPU particles, instanced particles, particle emitters, and effects |
| `/threejs-performance-profiling` | Performance profiling and optimization for Three.js including FPS monitoring, draw call analysis, memory profiling, and bottleneck identification |
| `/threejs-pbr-materials` | Physically-Based Rendering materials in Three.js including metalness-roughness workflow, clear coat, transmission, and material optimization |
| `/threejs-math-utilities` | Essential math utilities for Three.js game development including vector operations, quaternions, interpolation, curves, and collision helpers |
| `/threejs-fog` | Fog and atmospheric effects in Three.js including linear fog, exponential fog, distance-based fading, and custom atmospheric shaders |
| `/threejs-environment-maps` | Environment mapping and IBL (Image-Based Lighting) in Three.js including HDRI loading, skyboxes, reflection probes, and dynamic environment maps |
| `/threejs-instancing-advanced` | Advanced instancing techniques in Three.js including InstancedMesh, dynamic updates, LOD instancing, frustum culling, and custom attributes |
| `/threejs-sprites` | Sprites and billboards in Three.js including sprite materials, texture atlases, sprite animation, and particle sprites |
| `/threejs-best-practices` | Comprehensive best practices for Three.js development including optimization, architecture, debugging, and production deployment |
| `/threejs-loaders` | Three.js asset loading - GLTF, textures, images, models, async patterns. Use when loading 3D models, textures, HDR environments, or managing loading progress. |
| `/threejs-shaders` | Three.js shaders - GLSL, ShaderMaterial, uniforms, custom effects. Use when creating custom visual effects, modifying vertices, writing fragment shaders, or extending built-in materials. |
| `/threejs-postprocessing` | Three.js post-processing - EffectComposer, bloom, DOF, screen effects. Use when adding visual effects, color grading, blur, glow, or creating custom screen-space shaders. |
| `/threejs-animation` | Three.js animation - keyframe animation, skeletal animation, morph targets, animation mixing. Use when animating objects, playing GLTF animations, creating procedural motion, or blending animations. |

### React Three Fiber

| Command | Purpose |
|---------|---------|
| `/react-three-fiber-setup` | Complete React Three Fiber setup for mobile-optimized Three.js games with TypeScript, performance configuration, and best practices |
| `/r3f-ecs-integration` | Integrate Entity Component System architecture with React Three Fiber for high-performance declarative 3D games |
| `/r3f-component-patterns` | Advanced React Three Fiber component patterns including reusable components, hooks, composition, and performance optimization |
| `/r3f-performance` | React Three Fiber performance optimization with memoization, instancing, LOD, suspense, and mobile-specific optimizations |
| `/r3f-state-management` | State management in React Three Fiber using Zustand, React Context, and global stores for game state |
| `/r3f-mobile-patterns` | Mobile-specific React Three Fiber patterns including touch controls, device adaptation, battery optimization, and responsive layouts |

### Entity Component System

| Command | Purpose |
|---------|---------|
| `/ecs-architecture` | Design and implement Entity Component System architecture with TypeScript for game development |
| `/ecs-component-patterns` | Advanced ECS component design patterns including tag components, singleton components, shared data, and component pools |
| `/ecs-system-patterns` | Common system patterns in ECS including update systems, reactive systems, interval systems, and system priorities |
| `/ecs-queries` | Efficient entity queries in ECS including archetype-based queries, filtered queries, cached queries, and query optimization |
| `/ecs-events` | Event-driven architecture in ECS including event buses, typed events, event queues, and event-based system communication |
| `/ecs-serialization` | Serializing and deserializing ECS worlds including save/load systems, component serialization, entity prefabs, and network synchronization |
| `/ecs-performance` | Performance optimization for ECS including archetype optimization, memory pooling, cache-friendly data structures, and profiling techniques |

### Mobile Optimization

| Command | Purpose |
|---------|---------|
| `/mobile-performance` | Comprehensive mobile optimization strategies for Three.js games including device detection, quality scaling, thermal throttling, and battery management |
| `/touch-input-handling` | Comprehensive touch input system for mobile Three.js games including gestures, virtual joystick, and multi-touch support |
| `/battery-optimization` | Mobile battery optimization techniques including adaptive quality, power-efficient rendering, and background behavior |
| `/memory-management` | Mobile memory management including resource disposal, memory pooling, texture management, and leak prevention |

### TypeScript

| Command | Purpose |
|---------|---------|
| `/typescript-game-types` | Type-safe patterns for game development with TypeScript, including branded types, strict null checks, and performance-focused type design |
| `/typescript-performance` | TypeScript performance optimization including compilation settings, type checking, and runtime performance patterns |
| `/typescript-ecs-types` | TypeScript type patterns for Entity Component Systems including type-safe queries, component types, and system patterns |

### Game Systems

| Command | Purpose |
|---------|---------|
| `/ai-system` | AI system for game entities including behavior trees, finite state machines, steering behaviors, and decision making |
| `/audio-system` | Audio system for games including sound effects, music, spatial audio, and audio management with Web Audio API |
| `/camera-system` | Camera system for games including follow camera, orbit controls, shake effects, and cinematic cameras |
| `/collision-system` | ECS collision detection system with spatial partitioning, broadphase/narrowphase, AABB, and sphere collision for mobile games |
| `/health-combat-system` | Health and combat system including damage, healing, armor, status effects, and combat mechanics |
| `/input-system` | Unified input system for ECS games supporting keyboard, mouse, touch, and gamepad with action mapping and input buffering |
| `/inventory-system` | Inventory system for games including item management, stacking, equipment, and inventory UI |
| `/level-system` | Level and progression system including experience, leveling, skill trees, and stat progression |
| `/physics-system` | Physics simulation system for ECS including rigid body dynamics, forces, constraints, and integration with physics engines |
| `/spawn-system` | Spawn system for games including entity spawning, spawn pools, waves, and spawn points |
| `/ui-system` | UI system for games including HUD elements, menus, health bars, damage numbers, and UI state management |

### Foundations & 2D

| Command | Purpose |
|---------|---------|
| `/web-game-foundations` | Set browser-game architecture before implementation. Use when the user needs engine choice, simulation and render boundaries, input model, asset organization, or save/debug/performance strategy. |
| `/phaser-2d-game` | Implement 2D browser games with Phaser. Use when the user wants a Phaser, TypeScript, and Vite stack for scenes, gameplay systems, cameras, sprite animation, and DOM-overlay HUD patterns. |


### PixiJS — 2D Interactive (official v8)

| Command | Purpose |
|---------|---------|
| `/pixi` | Use this skill first for ANY PixiJS v8 task; it routes to the right specialized skill for the job. Covers the full PixiJS surface: Application setup, the scene graph (Container, Sprite, Graphics, Text, Mesh, ParticleContainer, DOMContainer, GifSprite), rendering (WebGL/WebGPU/Canvas, render loop, custom shaders, filters, blend modes), assets, events, color, math, ticker, accessibility, performance, environments, migration from v7, and project scaffolding. Triggers on: pixi, pixi.js, pixijs, PixiJS, v8, Application, app.init, Sprite, Container, Graphics, Text, Mesh, ParticleContainer, DOMContainer, GifSprite, Assets, Ticker, renderer, WebGL, WebGPU, scene graph, filter, shader, blend mode, texture, BitmapText, create-pixi, how do I draw, how do I render, how do I animate in pixi. |
| `/pixi-accessibility` | Use this skill when adding screen reader and keyboard navigation to PixiJS v8 apps. Covers AccessibilitySystem options (enabledByDefault, debug, activateOnTab, deactivateOnMouseMove), per-container accessibility properties, shadow DOM overlay, mobile touch-hook activation. Triggers on: accessibility, a11y, screen reader, ARIA, keyboard navigation, tab order, AccessibilitySystem, accessibleTitle, accessibleHint, tabIndex, accessibleChildren. |
| `/pixi-application` | Use this skill when creating and configuring a PixiJS v8 Application. Covers new Application() + async app.init() options (width, height, background, antialias, resolution, autoDensity, preference, resizeTo, autoStart, sharedTicker, canvas, useBackBuffer, powerPreference, eventFeatures, accessibilityOptions, gcActive, bezierSmoothness, webgl/webgpu/canvasOptions per-renderer overrides), app.stage/renderer/canvas/screen/domContainerRoot access, ResizePlugin, TickerPlugin, CullerPlugin (cullable, cullArea), custom ApplicationPlugin creation via ExtensionType.Application, start/stop lifecycle, and app.destroy() with releaseGlobalResources. Triggers on: Application, app.init, app.stage, app.renderer, app.canvas, app.screen, app.domContainerRoot, ApplicationOptions, ApplicationPlugin, ExtensionType.Application, resizeTo, preference, autoStart, sharedTicker, useBackBuffer, powerPreference, skipExtensionImports, preferWebGLVersion, preserveDrawingBuffer, cullable, CullerPlugin, app.start, app.stop, app.destroy, releaseGlobalResources. |
| `/pixi-assets` | Use this skill when loading and managing resources in PixiJS v8. Covers Assets.init, Assets.load/add/unload, bundles, manifests, background loading, onProgress, caching, spritesheets, video textures, web fonts, bitmap fonts, animated GIFs, compressed textures, SVG as texture or Graphics, resolution detection, per-asset data options, and forcing a specific loader with the parser field (for extension-less URLs). Triggers on: Assets, Assets.load, Assets.init, loadBundle, manifest, backgroundLoad, Spritesheet, Cache, LoadOptions, unload, parser, loadParser, loadWebFont, loadBitmapFont, loadVideoTextures, GifSource, VideoSourceOptions. |
| `/pixi-blend-modes` | Use this skill when compositing display objects with blend modes in PixiJS v8. Covers standard modes (normal, add, multiply, screen, erase, min, max), advanced modes via pixi.js/advanced-blend-modes (color-burn, overlay, hard-light, etc.), batch-friendly ordering. Triggers on: blendMode, additive, multiply, screen, overlay, color-burn, color-dodge, advanced-blend-modes, glow, erase. |
| `/pixi-color` | Use this skill when creating, converting, or manipulating colors in PixiJS v8. Covers Color class input formats (hex, CSS names, RGB/HSL objects, arrays, Uint8Array), conversion methods (toHex, toNumber, toArray, toRgba), component access, setAlpha/multiply/premultiply, Color.shared singleton. Triggers on: Color, ColorSource, hex, rgb, hsl, tint, premultiply, Color.shared, color conversion. |
| `/pixi-core-concepts` | Use this skill when understanding how PixiJS v8 renders frames: the systems-and-pipes renderer, the render loop, and how the library adapts to different environments. Covers WebGLRenderer/WebGPURenderer/CanvasRenderer selection, renderer.render() pipeline, environment detection, and pointers to per-topic deep dives. Triggers on: renderer, WebGL, WebGPU, Canvas, render loop, render pipeline, systems, environments, autoDetectRenderer. |
| `/pixi-create` | Use this skill when scaffolding a new PixiJS v8 project with the create-pixi CLI or adding PixiJS to an existing project. Covers npm/yarn/pnpm/bun create commands, interactive vs non-interactive flows, bundler vs creation template categories, available template presets (bundler-vite, bundler-webpack, bundler-esbuild, bundler-import-map, creation-web, framework-react, extension-default), Node version requirements, `npm install pixi.js` for existing projects, post-scaffold dev flow, and the Vite top-level-await production-build gotcha. Triggers on: create pixi.js, npm create, npm install pixi.js, scaffold, template, bundler-vite, bundler-webpack, creation-web, framework-react, new project, existing project, getting started, quick start. |
| `/pixi-custom-rendering` | Use this skill when writing custom shaders, uniforms, filters, or batchers in PixiJS v8. Covers Shader.from({gl, gpu, resources}), GlProgram/GpuProgram, UniformGroup with typed uniforms (f32, vec2, mat4x4), UBO mode, textures as resources, custom Filter via Filter.from, GLSL ES 3.0 conventions (in/out, finalColor, texture()), uBackTexture sampling, pixi.js/unsafe-eval for strict CSP, custom Batcher via extensions. Triggers on: Shader, GlProgram, GpuProgram, UniformGroup, Batcher, Filter, Filter.from, GLSL, WGSL, UBO, uniform, custom shader, finalColor, uBackTexture, blendRequired, unsafe-eval. |
| `/pixi-environments` | Use this skill when running PixiJS v8 outside a standard browser: Web Workers, OffscreenCanvas, Node/SSR, or CSP-restricted contexts. Covers DOMAdapter.set, BrowserAdapter, WebWorkerAdapter, custom Adapter interface, pixi.js/unsafe-eval for strict CSP. Triggers on: DOMAdapter, BrowserAdapter, WebWorkerAdapter, Web Worker, OffscreenCanvas, Node, headless, SSR, CSP, unsafe-eval, Adapter. |
| `/pixi-events` | Use this skill when handling pointer, mouse, touch, or wheel input in PixiJS v8. Covers eventMode (none, passive, auto, static, dynamic), FederatedEvent types, propagation and capture phase, hitArea, interactiveChildren, cursor and cursorStyles, global move events for drag, eventFeatures config. Triggers on: eventMode, FederatedPointerEvent, pointerdown, click, tap, globalpointermove, drag, hitArea, cursor, stopPropagation. |
| `/pixi-filters` | Use this skill when applying visual effects to PixiJS v8 containers via the filter pipeline. Covers built-in filters (AlphaFilter, BlurFilter, ColorMatrixFilter, DisplacementFilter, NoiseFilter), custom Filter.from() with GLSL/WGSL, options (resolution, padding, antialias, blendRequired), filterArea optimization, pixi-filters community package. Triggers on: filters, BlurFilter, ColorMatrixFilter, DisplacementFilter, NoiseFilter, Filter.from, GLSL filter, pixi-filters, filterArea. |
| `/pixi-math` | Use this skill when working with coordinates, vectors, matrices, shapes, hit testing, or layout rectangles in PixiJS v8. Covers Point/ObservablePoint, Matrix (2D affine, decompose, apply, applyInverse), shapes (Rectangle, Circle, Ellipse, Polygon, RoundedRectangle, Triangle), Rectangle layout helpers (pad, fit, enlarge, ceil, scale, getBounds), strokeContains hit tests, Polygon isClockwise/containsPolygon, toGlobal/toLocal, PointData/PointLike/Size types, DEG_TO_RAD, and pixi.js/math-extras vector and intersection helpers. Triggers on: Point, ObservablePoint, Matrix, Rectangle, Circle, Polygon, Triangle, RoundedRectangle, toGlobal, toLocal, hitArea, strokeContains, pad, fit, enlarge, ceil, getBounds, containsRect, intersects, isClockwise, math-extras, lineIntersection, segmentIntersection, DEG_TO_RAD, PointData. |
| `/pixi-migration-v8` | Use this skill when upgrading to PixiJS v8 from v7 or diagnosing broken v7 code after an upgrade. Covers async app.init, single pixi.js package (deprecated @pixi/* sub-packages), Graphics shape-then-fill, BaseTexture → TextureSource, shader/uniform rework, ParticleContainer+Particle, constructor options objects, DisplayObject removal, settings/utils removal, Ticker signature, events rewrite. Triggers on: migrate v7, v8 breaking changes, @pixi/ import, DisplayObject, beginFill, endFill, cacheAsBitmap, BaseTexture, deprecated. |
| `/pixi-performance` | Use this skill when profiling or optimizing a PixiJS v8 app for FPS, draw calls, or GPU memory. Covers destroy patterns (cacheAsTexture(false), releaseGlobalResources), GCSystem and TextureGCSystem, PrepareSystem, object pooling, batching rules, BitmapText for dynamic text, culling (Culler, CullerPlugin, cullable, cullArea), resolution/antialias tradeoffs. Triggers on: FPS, jank, draw calls, batching, object pool, GCSystem, PrepareSystem, Culler, cacheAsTexture, memory leak, destroy patterns. |
| `/pixi-scene-container` | Use this skill when grouping, positioning, or transforming display objects in PixiJS v8. Covers Container constructor options (isRenderGroup, sortableChildren, boundsArea), addChild/removeChild/addChildAt/swapChildren/setChildIndex, position/scale/rotation/pivot/skew/alpha/tint, getBounds/getGlobalPosition/toLocal/toGlobal, zIndex sorting, cullable, onRender per-frame callback, destroy. Triggers on: Container, addChild, removeChild, addChildAt, swapChildren, sortableChildren, zIndex, position, scale, rotation, pivot, getBounds, toGlobal, toLocal, onRender, destroy, constructor options, ContainerOptions. |
| `/pixi-scene-core-concepts` | Use this skill when reasoning about the PixiJS v8 scene graph as a whole: how containers, leaves, transforms, and render order fit together. Covers leaf vs container distinction, local/world coordinates, culling, render groups, sortable children, masking, RenderLayer, constructor options shared by every scene node, and which leaf skill covers which display object. Triggers on: scene graph, display list, Container, Sprite, Graphics, Text, Mesh, ParticleContainer, DOMContainer, GifSprite, masking, render group, RenderLayer, world transform, constructor options, ContainerOptions. |
| `/pixi-scene-dom-container` | Use this skill when overlaying HTML elements on the PixiJS v8 canvas. Covers DOMContainer with element, anchor, and scene-graph-driven CSS transforms, the pixi.js/dom side-effect import, DOMPipe registration, visibility sync, pointer-events handling. Triggers on: DOMContainer, pixi.js/dom, DOMPipe, HTML overlay, input on canvas, iframe overlay, DOMContainerOptions, element, anchor, constructor options. |
| `/pixi-scene-gif` | Use this skill when displaying animated GIFs in PixiJS v8. Covers the pixi.js/gif side-effect import, Assets.load returning a GifSource, GifSprite playback (play/stop/currentFrame/animationSpeed), autoPlay/loop options, onComplete/onLoop/onFrameChange callbacks, GifSource sharing, clone, destroy. Triggers on: GifSprite, GifSource, pixi.js/gif, animationSpeed, currentFrame, autoPlay, onComplete, onFrameChange, constructor options, GifSpriteOptions. |
| `/pixi-scene-graphics` | Use this skill when drawing vector shapes and paths in PixiJS v8. Covers the Graphics API: shape-then-fill methods (rect/circle/ellipse/poly/roundRect/star/regularPoly/roundPoly/roundShape/filletRect/chamferRect), path methods (moveTo/lineTo/bezierCurveTo/quadraticCurveTo/arc/arcTo/arcToSvg/closePath), fill/stroke/cut, holes, FillGradient (linear/radial), FillPattern, GraphicsContext sharing, svg import/export, containsPoint hit testing, cloning, clearing, bounds, fillStyle/strokeStyle, draw-time transforms (rotateTransform/scaleTransform/translateTransform/setTransform/save/restore), default styles, GraphicsPath reuse. Triggers on: Graphics, GraphicsContext, rect, circle, poly, roundRect, fill, stroke, cut, hole, beginHole, FillGradient, FillPattern, moveTo, bezierCurveTo, svg, graphicsContextToSvg, svg export, GraphicsOptions, containsPoint, clone, clear, bounds, rotateTransform, translateTransform, setFillStyle, setStrokeStyle, GraphicsPath. |
| `/pixi-scene-mesh` | Use this skill when rendering custom geometry in PixiJS v8. Covers Mesh with MeshGeometry (positions, uvs, indices, topology), MeshSimple for per-frame vertex animation, MeshPlane for subdivided deformation, MeshRope for path-following textures, PerspectiveMesh for 2.5D corners. Triggers on: Mesh, MeshGeometry, MeshSimple, MeshPlane, MeshRope, PerspectiveMesh, positions, uvs, indices, topology, setCorners, constructor options, MeshOptions, MeshPlaneOptions, MeshRopeOptions, SimpleMeshOptions, PerspectivePlaneOptions. |
| `/pixi-scene-particle-container` | Use this skill when rendering thousands of lightweight sprites in PixiJS v8. Covers ParticleContainer with Particle instances, addParticle/removeParticle, particleChildren array, dynamicProperties (vertex, position, rotation, uvs, color), boundsArea, roundPixels, update. Triggers on: ParticleContainer, Particle, IParticle, addParticle, particleChildren, dynamicProperties, boundsArea, particle effects, constructor options, ParticleContainerOptions, ParticleOptions. |
| `/pixi-scene-sprite` | Use this skill when drawing images in PixiJS v8. Covers Sprite with anchor/tint/texture, AnimatedSprite for frame animation, NineSliceSprite for resizable UI panels, TilingSprite for scrolling/repeating backgrounds. Triggers on: Sprite, AnimatedSprite, NineSliceSprite, TilingSprite, Sprite.from, anchor, tint, tilePosition, animationSpeed, gotoAndPlay, leftWidth, topHeight, constructor options, SpriteOptions, AnimatedSpriteOptions, NineSliceSpriteOptions, TilingSpriteOptions. |
| `/pixi-scene-text` | Use this skill when rendering text in PixiJS v8. Covers Text for canvas-quality styled labels, BitmapText for cheap per-frame updates via glyph atlas, HTMLText for HTML/CSS markup via SVG, SplitText and SplitBitmapText for per-character animation, TextStyle, tagStyles, constructor options, TextOptions, HTMLTextOptions, BitmapText, SplitTextOptions, SplitBitmapTextOptions. Triggers on: Text, BitmapText, HTMLText, SplitText, SplitBitmapText, TextStyle, HTMLTextStyle, BitmapFont.install, tagStyles, fontFamily, wordWrap. |
| `/pixi-ticker` | Use this skill when running per-frame logic or controlling the PixiJS v8 render loop. Covers Ticker.add/addOnce/remove, deltaTime vs deltaMS vs elapsedMS, UPDATE_PRIORITY ordering, maxFPS/minFPS capping, speed scaling, Ticker.shared vs new instances, per-object onRender hook, manual rendering. Triggers on: Ticker, UPDATE_PRIORITY, deltaTime, deltaMS, elapsedMS, onRender, app.ticker, maxFPS, minFPS, Ticker.shared. |

### Phaser 4 — 2D Games (official)

| Command | Purpose |
|---------|---------|
| `/phaser-actions-and-utilities` | Use this skill when working with Phaser 4 utility functions, actions, alignment, grid layout, or batch operations on game objects. Triggers on: align, grid layout, actions, set operations on groups of game objects. |
| `/phaser-animations` | Use this skill when creating or controlling sprite animations in Phaser 4. Covers spritesheets, atlases, AnimationManager, AnimationState, play/stop/chain, frame callbacks, and animation events. Triggers on: sprite animation, spritesheet, play animation, animation frames. |
| `/phaser-audio-and-sound` | Use this skill when adding audio or sound to a Phaser 4 game. Covers loading audio, playing sounds, music, volume, spatial audio, Web Audio API, and SoundManager. Triggers on: sound, audio, music, volume, mute. |
| `/phaser-cameras` | Use this skill when working with cameras in Phaser 4. Covers camera effects (shake, fade, flash, pan, zoom), following sprites, scroll, bounds, viewports, multiple cameras, and minimap. Triggers on: camera, viewport, scroll, zoom, follow, shake, fade. |
| `/phaser-curves-and-paths` | Use this skill when working with curves and paths in Phaser 4. Covers splines, bezier curves, lines, ellipses, path followers, and mathematical curve types. Triggers on: curve, path, spline, bezier, path follower. |
| `/phaser-data-manager` | Use this skill when using the Phaser 4 DataManager to store custom key-value data on game objects, listen for data change events, or manage game state. Triggers on: setData, getData, data events, custom data storage. |
| `/phaser-events-system` | Use this skill when working with the Phaser 4 event system. Covers EventEmitter, scene events, game events, custom events, and event-driven communication. Triggers on: events, on, emit, EventEmitter, scene events, listeners. |
| `/phaser-filters-and-postfx` | Use this skill when applying visual filters or post-processing effects in Phaser 4. Covers bloom, blur, glow, color matrix, barrel distortion, displacement, custom shaders, and the filter pipeline. Triggers on: filter, post-processing, shader, bloom, blur, glow, color effects. |
| `/phaser-game-object-components` | Use this skill when working with Phaser 4 game object components and the mixin system. Covers Transform, Alpha, Tint, Origin, Depth, Flip, Mask, GetBounds, Lighting, and other shared component behaviors. Triggers on: component, mixin, transform, mask, bounds, lighting. |
| `/phaser-game-setup-and-config` | Use this skill when creating a new Phaser 4 game instance or configuring GameConfig options. Covers renderer selection, canvas setup, scaling, pixel art, FPS settings, boot sequence, and all config sub-objects. Triggers on: new Phaser.Game, GameConfig, game setup, renderer, pixel art, FPS. |
| `/phaser-geometry-and-math` | Use this skill when using Phaser 4 math and geometry utilities. Covers vectors, rectangles, circles, triangles, polygons, random number generation, angles, distance, interpolation, and snapping. Triggers on: Vector2, Rectangle, Circle, math, distance, angle, random, lerp. |
| `/phaser-graphics-and-shapes` | Use this skill when drawing shapes and graphics in Phaser 4. Covers the Graphics game object, lines, rectangles, circles, arcs, polygons, gradients, fill, stroke, and generated textures. Triggers on: Graphics, draw shape, fillRect, lineStyle, polygon, arc. |
| `/phaser-groups-and-containers` | Use this skill when using Groups or Containers in Phaser 4. Covers organizing game objects, object pooling, batch operations, and nested transforms with Containers. Triggers on: Group, Container, object pool, getFirstDead, children. |
| `/phaser-input-keyboard-mouse-touch` | Use this skill when handling user input in Phaser 4. Covers keyboard keys, mouse clicks and movement, touch events, pointer handling, drag and drop, hit areas, interactive objects, and gamepad support. Triggers on: keyboard, mouse, touch, pointer, drag, drop, click, input, gamepad, cursor keys. |
| `/phaser-loading-assets` | Use this skill when loading assets in Phaser 4. Covers the Loader plugin, loading images, spritesheets, atlases, audio, JSON, tilemaps, bitmap fonts, and tracking load progress. Triggers on: preload, this.load, asset loading, spritesheet, atlas, load progress. |
| `/phaser-particles` | Use this skill when creating particle effects in Phaser 4. Covers ParticleEmitter, emission zones, death zones, particle properties, textures, gravity wells, and particle movement. Triggers on: particles, emitter, particle effect, explosion, fire, smoke. |
| `/phaser-physics-arcade` | Use this skill when using Arcade Physics in Phaser 4. Covers enabling physics, velocity, acceleration, gravity, collisions, overlap, world bounds, physics groups, static bodies, and collision categories. Triggers on: physics, arcade, velocity, gravity, collide, overlap, bounce, physics body. |
| `/phaser-physics-matter` | Use this skill when using Matter.js physics in Phaser 4. Covers rigid bodies, constraints, composite bodies, sensors, collision filtering, world configuration, and advanced physics shapes. Triggers on: Matter, matter physics, constraint, joint, rigid body, sensor. |
| `/phaser-render-textures` | Use this skill when using RenderTexture or DynamicTexture in Phaser 4. Covers drawing game objects to textures, dynamic texture creation, snapshot/screenshot, stamps, and off-screen rendering. Triggers on: RenderTexture, DynamicTexture, snapshot, draw to texture, stamp. |
| `/phaser-scale-and-responsive` | Use this skill when making a Phaser 4 game responsive or handling display scaling. Covers ScaleManager, scale modes (FIT, RESIZE, EXPAND, ENVELOP), auto-center, fullscreen, and browser resize handling. Triggers on: ScaleManager, responsive, resize, fullscreen, FIT, scale mode. |
| `/phaser-scenes` | Use this skill when working with Phaser 4 scenes. Covers scene lifecycle methods, scene transitions, parallel scenes, scene communication, sleeping, pausing, restarting, and the SceneManager. Triggers on: Scene, scene lifecycle, preload, create, update, scene transition, SceneManager. |
| `/phaser-sprites-and-images` | Use this skill when creating Sprites or Images in Phaser 4. Covers factory methods, texture/frame selection, position, scale, rotation, tint, flip, alpha, origin, depth, and the component mixin system. Triggers on: Sprite, Image, this.add.sprite, this.add.image, texture, setTint, setAlpha. |
| `/phaser-text-and-bitmaptext` | Use this skill when displaying text in Phaser 4. Covers Text game objects, BitmapText, web fonts, text styling, word wrap, alignment, padding, and dynamic text content. Triggers on: Text, BitmapText, this.add.text, font, word wrap, text style. |
| `/phaser-tilemaps` | Use this skill when working with tilemaps in Phaser 4. Covers loading Tiled JSON maps, creating tilemap layers, tile collision, dynamic tiles, tile properties, and tilemap camera culling. Triggers on: Tilemap, Tiled, tilemap layer, tile collision, tile properties. |
| `/phaser-time-and-timers` | Use this skill when using timers and time-based events in Phaser 4. Covers TimerEvent, delayed calls, looping timers, the Clock plugin, and time scaling. Triggers on: timer, delay, delayedCall, TimerEvent, Clock, time event. |
| `/phaser-tweens` | Use this skill when animating properties over time in Phaser 4. Covers tweens, tween chains, easing functions, stagger, yoyo, repeat, callbacks, number tweens, and the TweenManager. Triggers on: tween, ease, animate, this.tweens.add, tween chain, stagger. |
| `/phaser-v3-to-v4-migration` | Use this skill when migrating a Phaser 3 project to Phaser 4, or when a user asks about breaking changes, API differences, or how to update their v3 code. Covers renderer changes (pipelines to render nodes), FX/masks to filters, tint system, camera matrix, texture coordinates, DynamicTexture, shaders, lighting, removed game objects, and a full migration checklist. Triggers on: migrate, upgrade, v3 to v4, breaking changes, Phaser 3 to 4, migration guide, update from v3. |
| `/phaser-v4-new-features` | Use this skill when learning about new features, game objects, components, and rendering capabilities added in Phaser 4. Covers Filters, RenderNodes, CaptureFrame, Gradient, Noise, SpriteGPULayer, TilemapGPULayer, Lighting component, RenderSteps, and new tint modes. Triggers on: new in v4, Phaser 4 features, RenderNode, SpriteGPULayer, CaptureFrame, Gradient game object, Noise game object, new tint modes. For migrating v3 code to v4, see the v3-to-v4-migration skill instead. |
