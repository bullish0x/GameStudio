<p align="center">
  <h1 align="center">GameStudio</h1>
  <p align="center">
    Turn a single Claude Code session into a full game development studio.
    <br />
    55 agents. 183 skills. One coordinated AI team.
  </p>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
  <a href=".claude/agents"><img src="https://img.shields.io/badge/agents-55-blueviolet" alt="55 Agents"></a>
  <a href=".claude/skills"><img src="https://img.shields.io/badge/skills-183-green" alt="183 Skills"></a>
  <a href=".claude/hooks"><img src="https://img.shields.io/badge/hooks-12-orange" alt="12 Hooks"></a>
  <a href=".claude/rules"><img src="https://img.shields.io/badge/rules-14-red" alt="14 Rules"></a>
  <a href="https://docs.anthropic.com/en/docs/claude-code"><img src="https://img.shields.io/badge/built%20for-Claude%20Code-f5f5f5?logo=anthropic" alt="Built for Claude Code"></a>
</p>

---

## Why This Exists

Building a game solo with AI is powerful — but a single chat session has no structure. No one stops you from hardcoding magic numbers, skipping design docs, or writing spaghetti code. There's no QA pass, no design review, no one asking "does this actually fit the game's vision?"

**GameStudio** solves this by giving your AI session the structure of a real studio. Instead of one general-purpose assistant, you get 55 specialized agents organized into a studio hierarchy — directors who guard the vision, department leads who own their domains, and specialists who do the hands-on work. Each agent has defined responsibilities, escalation paths, and quality gates.

The result: you still make every decision, but now you have a team that asks the right questions, catches mistakes early, and keeps your project organized from first brainstorm to launch.

---

## Table of Contents

- [What's Included](#whats-included)
- [Studio Hierarchy](#studio-hierarchy)
- [Slash Commands](#slash-commands)
- [Getting Started](#getting-started)
- [How to Use](#how-to-use)
- [Upgrading](#upgrading)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Design Philosophy](#design-philosophy)
- [Customization](#customization)
- [Platform Support](#platform-support)
- [Community](#community)
- [License](#license)

---

## What's Included

| Category | Count | Description |
|----------|-------|-------------|
| **Agents** | 55 | Specialized subagents across design, programming, art, audio, narrative, QA, production, and web engines (Three.js / PixiJS / Phaser) |
| **Skills** | 183 | Studio workflow commands plus web game-dev skills (Three.js, R3F, ECS, PixiJS, Phaser) |
| **Hooks** | 12 | Automated validation on commits, pushes, asset changes, session lifecycle, agent audit trail, and gap detection |
| **Rules** | 14 | Path-scoped coding standards enforced when editing gameplay, engine, AI, UI, network code, web scenes/shaders/3D assets, and more |
| **Templates** | 41 | Document templates for GDDs, UX specs, ADRs, sprint plans, HUD design, accessibility, and more |

## Studio Hierarchy

Agents are organized into three tiers, matching how real studios operate:

```
Tier 1 — Directors (Opus)
  creative-director    technical-director    producer

Tier 2 — Department Leads (Sonnet)
  game-designer        lead-programmer       art-director
  audio-director       narrative-director    qa-lead
  release-manager      localization-lead

Tier 3 — Specialists (Sonnet/Haiku)
  gameplay-programmer  engine-programmer     ai-programmer
  network-programmer   tools-programmer      ui-programmer
  systems-designer     level-designer        economy-designer
  technical-artist     sound-designer        writer
  world-builder        ux-designer           prototyper
  performance-analyst  devops-engineer       analytics-engineer
  security-engineer    qa-tester             accessibility-specialist
  live-ops-designer    community-manager
```

### Engine Specialists

The template includes agent sets for the three major native engines plus three
web engines. Use the set that matches your project:

| Engine | Lead Agent | Sub-Specialists |
|--------|-----------|-----------------|
| **Godot 4** | `godot-specialist` | GDScript, Shaders, GDExtension |
| **Unity** | `unity-specialist` | DOTS/ECS, Shaders/VFX, Addressables, UI Toolkit |
| **Unreal Engine 5** | `unreal-specialist` | GAS, Blueprints, Replication, UMG/CommonUI |
| **Three.js (Web 3D)** | `threejs-specialist` | `webgl-shader-specialist` (GLSL/WebGL), `web3d-asset-pipeline` (glTF/Draco/KTX2/LOD) |
| **PixiJS (Web 2D interactive)** | `pixijs-specialist` | `web2d-asset-pipeline` (atlases/Spine); `webgl-shader-specialist` for custom 2D filters |
| **Phaser (Web 2D games)** | `phaser-specialist` | `web2d-asset-pipeline` (atlases/Spine); `webgl-shader-specialist` for custom filters |

## Slash Commands

Type `/` in Claude Code to access all 183 skills:

**Onboarding & Navigation**
| Command | What it does |
|---------|--------------|
| `/start` | First-time onboarding — asks where you are, then guides you to the right workflow |
| `/help` | Context-aware "what do I do next?" — reads current stage and surfaces the required next step |
| `/project-stage-detect` | Full project audit — detect phase, identify existence gaps, recommend next steps |
| `/setup-engine` | Configure engine + version, detect knowledge gaps, populate version-aware reference docs |
| `/adopt` | Brownfield format audit — checks internal structure of existing GDDs/ADRs/stories, produces migration plan |

**Game Design**
| Command | What it does |
|---------|--------------|
| `/brainstorm` | Guided ideation using professional studio methods (MDA, SDT, Bartle, verb-first) |
| `/map-systems` | Decompose game concept into systems, map dependencies, prioritize design order |
| `/design-system` | Guided, section-by-section GDD authoring for a single game system |
| `/quick-design` | Lightweight design spec for small changes — tuning, tweaks, minor additions |
| `/review-all-gdds` | Cross-GDD consistency and game design holism review across all design docs |
| `/propagate-design-change` | When a GDD is revised, find affected ADRs and produce an impact report |

**Art & Assets**
| Command | What it does |
|---------|--------------|
| `/art-bible` | Guided, section-by-section Art Bible authoring — creates visual identity spec before asset production begins |
| `/asset-spec` | Generate per-asset visual specifications and AI generation prompts from GDDs, level docs, or character profiles |
| `/asset-audit` | Audit assets for naming conventions, file size budgets, and pipeline compliance |

**UX & Interface Design**
| Command | What it does |
|---------|--------------|
| `/ux-design` | Guided section-by-section UX spec authoring (screen/flow, HUD, or pattern library) |
| `/ux-review` | Validate UX specs for GDD alignment, accessibility, and pattern compliance |

**Architecture**
| Command | What it does |
|---------|--------------|
| `/create-architecture` | Guided authoring of the master architecture document |
| `/architecture-decision` | Create an Architecture Decision Record (ADR) |
| `/architecture-review` | Validate all ADRs for completeness, dependency ordering, and GDD coverage |
| `/create-control-manifest` | Generate flat programmer rules sheet from accepted ADRs |

**Stories & Sprints**
| Command | What it does |
|---------|--------------|
| `/create-epics` | Translate GDDs + ADRs into epics — one per architectural module |
| `/create-stories` | Break a single epic into implementable story files |
| `/dev-story` | Read a story and implement it — routes to the correct programmer agent |
| `/sprint-plan` | Generate or update a sprint plan; initializes sprint-status.yaml |
| `/sprint-status` | Fast 30-line sprint snapshot (reads sprint-status.yaml) |
| `/story-readiness` | Validate a story is implementation-ready before pickup (READY/NEEDS WORK/BLOCKED) |
| `/story-done` | 8-phase completion review after implementation; updates story file, surfaces next story |
| `/estimate` | Structured effort estimate with complexity, dependencies, and risk breakdown |

**Reviews & Analysis**
| Command | What it does |
|---------|--------------|
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

**QA & Testing**
| Command | What it does |
|---------|--------------|
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

**Production**
| Command | What it does |
|---------|--------------|
| `/milestone-review` | Review milestone progress and generate status report |
| `/retrospective` | Run a structured sprint or milestone retrospective |
| `/bug-report` | Create a structured bug report |
| `/bug-triage` | Read all open bugs, re-evaluate priority vs. severity, assign owner and label |
| `/reverse-document` | Generate design or architecture docs from existing implementation |
| `/playtest-report` | Generate a structured playtest report or analyze existing playtest notes |

**Release**
| Command | What it does |
|---------|--------------|
| `/release-checklist` | Generate and validate a pre-release checklist for the current build |
| `/launch-checklist` | Complete launch readiness validation across all departments |
| `/changelog` | Auto-generate changelog from git commits and sprint data |
| `/patch-notes` | Generate player-facing patch notes from git history and internal data |
| `/hotfix` | Emergency fix workflow with audit trail, bypassing normal sprint process |
| `/day-one-patch` | Prepare a focused day-one patch for known issues discovered after gold master but before or at public launch |

**Creative & Content**
| Command | What it does |
|---------|--------------|
| `/prototype` | Concept prototype — throwaway build right after brainstorm to validate core idea (Phase 1) |
| `/vertical-slice` | Pre-Production validation — production-quality end-to-end build before committing to Production (Phase 4) |
| `/onboard` | Generate contextual onboarding document for a new contributor or agent |
| `/localize` | Localization workflow: string extraction, validation, translation readiness |

**Team Orchestration** (coordinate multiple agents on a single feature)
| Command | What it does |
|---------|--------------|
| `/team-combat` | Game-designer + gameplay-programmer + ai-programmer + technical-artist + sound-designer + qa-tester |
| `/team-narrative` | Narrative-director + writer + world-builder + level-designer |
| `/team-ui` | Ux-designer + ui-programmer + art-director + accessibility-specialist |
| `/team-release` | Release-manager + qa-lead + devops-engineer + producer |
| `/team-polish` | Performance-analyst + technical-artist + sound-designer + qa-tester |
| `/team-audio` | Audio-director + sound-designer + technical-artist + gameplay-programmer |
| `/team-level` | Level-designer + narrative-director + world-builder + art-director + systems-designer + qa-tester |
| `/team-live-ops` | Live-ops-designer + economy-designer + community-manager + analytics-engineer |
| `/team-qa` | Qa-lead + qa-tester + gameplay-programmer + producer |

**Web · 3D Rendering (Three.js)**
| Command | What it does |
|---------|--------------|
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
| `/threejs-loaders` | Three.js asset loading - GLTF, textures, images, models, async patterns. |
| `/threejs-shaders` | Three.js shaders - GLSL, ShaderMaterial, uniforms, custom effects. |
| `/threejs-postprocessing` | Three.js post-processing - EffectComposer, bloom, DOF, screen effects. |
| `/threejs-animation` | Three.js animation - keyframe animation, skeletal animation, morph targets, animation mixing. |

**Web · React Three Fiber**
| Command | What it does |
|---------|--------------|
| `/react-three-fiber-setup` | Complete React Three Fiber setup for mobile-optimized Three.js games with TypeScript, performance configuration, and best practices |
| `/r3f-ecs-integration` | Integrate Entity Component System architecture with React Three Fiber for high-performance declarative 3D games |
| `/r3f-component-patterns` | Advanced React Three Fiber component patterns including reusable components, hooks, composition, and performance optimization |
| `/r3f-performance` | React Three Fiber performance optimization with memoization, instancing, LOD, suspense, and mobile-specific optimizations |
| `/r3f-state-management` | State management in React Three Fiber using Zustand, React Context, and global stores for game state |
| `/r3f-mobile-patterns` | Mobile-specific React Three Fiber patterns including touch controls, device adaptation, battery optimization, and responsive layouts |

**Web · Entity Component System**
| Command | What it does |
|---------|--------------|
| `/ecs-architecture` | Design and implement Entity Component System architecture with TypeScript for game development |
| `/ecs-component-patterns` | Advanced ECS component design patterns including tag components, singleton components, shared data, and component pools |
| `/ecs-system-patterns` | Common system patterns in ECS including update systems, reactive systems, interval systems, and system priorities |
| `/ecs-queries` | Efficient entity queries in ECS including archetype-based queries, filtered queries, cached queries, and query optimization |
| `/ecs-events` | Event-driven architecture in ECS including event buses, typed events, event queues, and event-based system communication |
| `/ecs-serialization` | Serializing and deserializing ECS worlds including save/load systems, component serialization, entity prefabs, and network synchronization |
| `/ecs-performance` | Performance optimization for ECS including archetype optimization, memory pooling, cache-friendly data structures, and profiling techniques |

**Web · Mobile Optimization**
| Command | What it does |
|---------|--------------|
| `/mobile-performance` | Comprehensive mobile optimization strategies for Three.js games including device detection, quality scaling, thermal throttling, and battery management |
| `/touch-input-handling` | Comprehensive touch input system for mobile Three.js games including gestures, virtual joystick, and multi-touch support |
| `/battery-optimization` | Mobile battery optimization techniques including adaptive quality, power-efficient rendering, and background behavior |
| `/memory-management` | Mobile memory management including resource disposal, memory pooling, texture management, and leak prevention |

**Web · TypeScript**
| Command | What it does |
|---------|--------------|
| `/typescript-game-types` | Type-safe patterns for game development with TypeScript, including branded types, strict null checks, and performance-focused type design |
| `/typescript-performance` | TypeScript performance optimization including compilation settings, type checking, and runtime performance patterns |
| `/typescript-ecs-types` | TypeScript type patterns for Entity Component Systems including type-safe queries, component types, and system patterns |

**Web · Game Systems**
| Command | What it does |
|---------|--------------|
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

**Web · Foundations & 2D**
| Command | What it does |
|---------|--------------|
| `/web-game-foundations` | Set browser-game architecture before implementation. |
| `/phaser-2d-game` | Implement 2D browser games with Phaser. |


**Web · PixiJS (2D interactive)**
| Command | What it does |
|---------|--------------|
| `/pixi` | PixiJS v8 task; it routes to the right specialized skill for the job. |
| `/pixi-accessibility` | Adding screen reader and keyboard navigation to PixiJS v8 apps. |
| `/pixi-application` | Creating and configuring a PixiJS v8 Application. |
| `/pixi-assets` | Loading and managing resources in PixiJS v8. |
| `/pixi-blend-modes` | Compositing display objects with blend modes in PixiJS v8. |
| `/pixi-color` | Creating, converting, or manipulating colors in PixiJS v8. |
| `/pixi-core-concepts` | Understanding how PixiJS v8 renders frames: the systems-and-pipes renderer, the render loop, and how the library adapts to different environments. |
| `/pixi-create` | Scaffolding a new PixiJS v8 project with the create-pixi CLI or adding PixiJS to an existing project. |
| `/pixi-custom-rendering` | Writing custom shaders, uniforms, filters, or batchers in PixiJS v8. |
| `/pixi-environments` | Running PixiJS v8 outside a standard browser: Web Workers, OffscreenCanvas, Node/SSR, or CSP-restricted contexts. |
| `/pixi-events` | Handling pointer, mouse, touch, or wheel input in PixiJS v8. |
| `/pixi-filters` | Applying visual effects to PixiJS v8 containers via the filter pipeline. |
| `/pixi-math` | Working with coordinates, vectors, matrices, shapes, hit testing, or layout rectangles in PixiJS v8. |
| `/pixi-migration-v8` | Upgrading to PixiJS v8 from v7 or diagnosing broken v7 code after an upgrade. |
| `/pixi-performance` | Profiling or optimizing a PixiJS v8 app for FPS, draw calls, or GPU memory. |
| `/pixi-scene-container` | Grouping, positioning, or transforming display objects in PixiJS v8. |
| `/pixi-scene-core-concepts` | Reasoning about the PixiJS v8 scene graph as a whole: how containers, leaves, transforms, and render order fit together. |
| `/pixi-scene-dom-container` | Overlaying HTML elements on the PixiJS v8 canvas. |
| `/pixi-scene-gif` | Displaying animated GIFs in PixiJS v8. |
| `/pixi-scene-graphics` | Drawing vector shapes and paths in PixiJS v8. |
| `/pixi-scene-mesh` | Rendering custom geometry in PixiJS v8. |
| `/pixi-scene-particle-container` | Rendering thousands of lightweight sprites in PixiJS v8. |
| `/pixi-scene-sprite` | Drawing images in PixiJS v8. |
| `/pixi-scene-text` | Rendering text in PixiJS v8. |
| `/pixi-ticker` | Running per-frame logic or controlling the PixiJS v8 render loop. |

**Web · Phaser 4 (2D games)**
| Command | What it does |
|---------|--------------|
| `/phaser-actions-and-utilities` | Working with Phaser 4 utility functions, actions, alignment, grid layout, or batch operations on game objects. |
| `/phaser-animations` | Creating or controlling sprite animations in Phaser 4. |
| `/phaser-audio-and-sound` | Adding audio or sound to a Phaser 4 game. |
| `/phaser-cameras` | Working with cameras in Phaser 4. |
| `/phaser-curves-and-paths` | Working with curves and paths in Phaser 4. |
| `/phaser-data-manager` | Using the Phaser 4 DataManager to store custom key-value data on game objects, listen for data change events, or manage game state. |
| `/phaser-events-system` | Working with the Phaser 4 event system. |
| `/phaser-filters-and-postfx` | Applying visual filters or post-processing effects in Phaser 4. |
| `/phaser-game-object-components` | Working with Phaser 4 game object components and the mixin system. |
| `/phaser-game-setup-and-config` | Creating a new Phaser 4 game instance or configuring GameConfig options. |
| `/phaser-geometry-and-math` | Using Phaser 4 math and geometry utilities. |
| `/phaser-graphics-and-shapes` | Drawing shapes and graphics in Phaser 4. |
| `/phaser-groups-and-containers` | Using Groups or Containers in Phaser 4. |
| `/phaser-input-keyboard-mouse-touch` | Handling user input in Phaser 4. |
| `/phaser-loading-assets` | Loading assets in Phaser 4. |
| `/phaser-particles` | Creating particle effects in Phaser 4. |
| `/phaser-physics-arcade` | Using Arcade Physics in Phaser 4. |
| `/phaser-physics-matter` | Using Matter.js physics in Phaser 4. |
| `/phaser-render-textures` | Using RenderTexture or DynamicTexture in Phaser 4. |
| `/phaser-scale-and-responsive` | Making a Phaser 4 game responsive or handling display scaling. |
| `/phaser-scenes` | Working with Phaser 4 scenes. |
| `/phaser-sprites-and-images` | Creating Sprites or Images in Phaser 4. |
| `/phaser-text-and-bitmaptext` | Displaying text in Phaser 4. |
| `/phaser-tilemaps` | Working with tilemaps in Phaser 4. |
| `/phaser-time-and-timers` | Using timers and time-based events in Phaser 4. |
| `/phaser-tweens` | Animating properties over time in Phaser 4. |
| `/phaser-v3-to-v4-migration` | Migrating a Phaser 3 project to Phaser 4, or when a user asks about breaking changes, API differences, or how to update their v3 code. |
| `/phaser-v4-new-features` | Learning about new features, game objects, components, and rendering capabilities added in Phaser 4. |

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (`npm install -g @anthropic-ai/claude-code`)
- **Recommended**: [jq](https://jqlang.github.io/jq/) (for hook validation) and Python 3 (for JSON validation)

All hooks fail gracefully if optional tools are missing — nothing breaks, you just lose validation.

### New project

1. **Clone the template** (or click **"Use this template"** on GitHub for a fresh repo with no history):
   ```bash
   git clone https://github.com/bullish0x/gamestudio.git my-game
   cd my-game
   ```
2. **Open Claude Code:**
   ```bash
   claude
   ```
3. **Run `/start`** — it asks where you are (no idea / vague concept / clear
   design / existing work) and routes you. No assumptions.
4. **Run `/setup-engine`** — pick your track (guided, or name it:
   `/setup-engine godot 4.6`, `/setup-engine phaser`, `/setup-engine threejs`).
   It pins the version in `CLAUDE.md` and fills version-aware reference docs.
5. Follow the pipeline (see [How to Use](#how-to-use)) — `/help` always tells
   you the next step.

> Prefer to jump straight in? `/brainstorm` explores ideas from scratch.

### Existing project

Use the **installer**. It copies only the GameStudio "studio brain" (agents,
skills, hooks, rules, studio docs, engine reference, the testing framework),
**never overwrites your `settings.json`, `CLAUDE.md`, source, or design docs**,
and records every file it writes so it can update or cleanly uninstall later.

```bash
git clone --depth 1 https://github.com/bullish0x/gamestudio.git /tmp/gamestudio
bash /tmp/gamestudio/install.sh install /path/to/your/project   # omit the path to use the current dir
```

If a file already exists and differs from yours, the installer **skips it and
writes a `*.gamestudio` side-file** instead — so your `settings.json` (hooks/
permissions) and `CLAUDE.md` are preserved untouched. Diff the side-files and
merge the studio's `hooks`/`permissions` blocks in when you're ready. On Windows,
run it from **Git Bash**.

**Update / uninstall / status** — safe by design: these only ever touch files the
installer owns (tracked in `.claude/.gamestudio/manifest.tsv`). Files you've
edited are kept and the new version is offered as `*.gamestudio-new`:

```bash
bash /tmp/gamestudio/install.sh update    /path/to/your/project   # re-sync to the latest studio brain
bash /tmp/gamestudio/install.sh uninstall /path/to/your/project   # remove only the studio brain
bash /tmp/gamestudio/install.sh status    /path/to/your/project   # show what's installed
```

Then in the session:

1. **`/project-stage-detect`** — audits your repo and reports which phase you're
   in and what's missing.
2. **`/adopt`** — brownfield format audit: checks your existing GDDs/ADRs/stories
   against the template's expected structure and produces a numbered migration plan.
3. **`/setup-engine <yours>`** — pin the engine you already use so agents verify
   APIs against your version.
4. **`/reverse-document`** — generate any missing design/architecture docs from
   your existing code.

> The `cp` commands above are POSIX (macOS/Linux/Git Bash). On Windows PowerShell
> use `Copy-Item -Recurse` (and `-Force` only where you intend to overwrite).

## How to Use

GameStudio turns one Claude Code session into a directed studio: **you make the
decisions**, specialized agents do the domain work, and quality gates catch
problems before they compound. You drive it with slash commands (see
[Slash Commands](#slash-commands) for what each does).

### The mental model

- **Skills** (`/command`) are workflows you invoke. **Agents** are the specialists
  skills route work to (a director/lead/specialist hierarchy). **Rules** enforce
  standards automatically when you edit matching files. **Hooks** validate on
  commit/push/session events.
- **The files are the memory.** Decisions live in `design/` (GDDs), `docs/`
  (architecture/ADRs), and `production/` (sprints, state) — not in the chat. Any
  session can resume by reading them.
- Every agent follows a collaborative protocol: **ask → present 2–4 options →
  you decide → draft → ask before writing.** Nothing is committed without sign-off.

### 1. Pick your engine

Run `/setup-engine` (guided) or name it: `/setup-engine godot 4.6`,
`/setup-engine phaser`. Supported tracks — language pinned, version-aware:

| Track | Engine | Lead agent |
|-------|--------|-----------|
| Native | Godot 4 / Unity / Unreal Engine 5 | `godot-` / `unity-` / `unreal-specialist` |
| Web 3D | Three.js / React Three Fiber | `threejs-specialist` |
| Web 2D interactive | PixiJS v8 | `pixijs-specialist` |
| Web 2D games | Phaser 4 | `phaser-specialist` |

`/setup-engine` pins the version in `CLAUDE.md` and fills version-aware reference
docs so agents verify APIs against your installed release.

### 2. Follow the pipeline

The studio works in phases; each has its commands and a gate before the next:

1. **Concept** — `/brainstorm` → `/art-bible`. *(Gate: `/gate-check`)*
2. **Systems design** — `/map-systems` → `/design-system` (per system) →
   `/review-all-gdds`.
3. **Architecture** — `/create-architecture` → `/architecture-decision` (per
   ADR) → `/create-control-manifest` → `/architecture-review`.
4. **Pre-production** — `/prototype` (validate the idea) and `/vertical-slice`
   (validate the full loop) → **PROCEED/PIVOT/KILL**.
5. **Stories** — `/create-epics` → `/create-stories` → `/story-readiness`.
6. **Implementation** — `/dev-story` (routes to the right programmer/engine
   specialist) → `/code-review` → `/story-done`.
7. **QA** — `/qa-plan` → `/smoke-check` → `/regression-suite` → `/bug-triage`.
8. **Release** — `/release-checklist` → `/launch-checklist` → `/changelog` →
   `/patch-notes`.

Not sure where you are? `/project-stage-detect` audits the repo and `/help`
surfaces the next step.

### 3. Building a web game

Pick the web track in `/setup-engine`, then the web engine agents pull from the
web skill library automatically:

- **`threejs-specialist`** (3D) — scenes, R3F, ECS, mobile, lighting/animation;
  delegates GLSL to `webgl-shader-specialist`, assets to `web3d-asset-pipeline`.
- **`pixijs-specialist`** (2D interactive) and **`phaser-specialist`** (2D games)
  — share `web2d-asset-pipeline` (atlases/Spine) and `webgl-shader-specialist`
  (2D filters). Phaser rule of thumb: keep gameplay state in systems; scenes are
  thin view adapters.

You can also invoke any reference skill directly (e.g. `/pixi-assets`,
`/phaser-tilemaps`, `/threejs-lighting`).

### Bringing it to an existing game (worked examples)

GameStudio works *backwards* from code you already have: install it, reconstruct
the design/architecture docs that were never written, then drive new work — or a
refactor — through the pipeline, with version-pinned engine specialists doing the
hands-on work.

**You have an existing Three.js game and want to extend it properly**

1. Install the studio brain (see [Existing project](#existing-project)), then `claude`.
2. **`/project-stage-detect`** — finds source but no design/architecture docs and
   tells you where you actually stand.
3. **`/setup-engine threejs`** — pins your installed `three` version so
   `threejs-specialist` validates APIs against it (no guessing on deprecated calls).
4. **`/reverse-document`** — reads your scene / render-loop / asset code and writes
   the GDD + architecture docs that only lived in your head. Scope it per system
   if the codebase is large. Now the studio actually understands your game.
5. **`/adopt`** — audits those reconstructed docs against the studio's formats and
   hands you a numbered migration plan to close the gaps.
6. Build features the normal way: **`/create-stories` → `/dev-story`** (routes to
   `threejs-specialist`, pulling the `threejs-*` skills; GLSL → `webgl-shader-specialist`,
   assets → `web3d-asset-pipeline`) **→ `/code-review` → `/story-done`**. The
   `src/scenes/**` and `src/shaders/**` rules enforce disposal, no per-frame
   allocation, color-space correctness, etc. as you edit.

**You want to refactor a PixiJS game "the proper way"**

1. Install + `claude`, then **`/setup-engine pixijs`** (PixiJS v8 pinned).
2. **`/reverse-document`** per subsystem — capture the *as-is* architecture so the
   refactor starts from a written baseline, not memory.
3. **`/create-architecture` + `/architecture-decision`** — define the *target*:
   e.g. lift game state out of the Pixi stage into systems, move to manifest-keyed
   assets, isolate filters. `pixijs-specialist` holds the line that the render
   layer *reads state and emits events* rather than owning it.
4. **`/create-control-manifest`** turns those decisions into a flat rules sheet
   that **`/code-review`** checks every change against — so the refactor can't
   silently drift back.
5. **`/create-epics` → `/create-stories`** break the refactor into safe, ordered
   steps; **`/dev-story`** implements each (`pixijs-specialist` + `web2d-asset-pipeline`
   + `webgl-shader-specialist`).
6. **`/qa-plan` + `/regression-suite`** so the refactor doesn't quietly break what
   already worked.

**You have an existing native-engine game (Godot / Unity / Unreal)**

Same flow — only the engine specialist changes:

1. Install + `claude`, then **`/setup-engine godot 4.6`** (or `unity` / `unreal`).
   This matters most for native engines: it pins your version and pulls
   version-aware reference docs, so the specialist won't suggest APIs from a
   different engine release (e.g. Godot 4.4→4.6 changed a lot post-training-cutoff).
2. **`/reverse-document`** — reconstruct the GDD + architecture from your existing
   scripts and scenes (`.gd`/`.cs`, `.unity`/prefabs, `.cpp`/Blueprints).
3. **`/adopt`** → migration plan, then **`/create-stories` → `/dev-story` →
   `/code-review` → `/story-done`**. `/dev-story` routes to the right specialist
   set automatically: `godot-specialist` (+ `godot-gdscript`/`godot-csharp`/
   `godot-shader`), `unity-specialist` (+ DOTS / Shaders / Addressables / UI
   Toolkit), or `unreal-specialist` (+ GAS / Blueprints / Replication / UMG).

The throughline: **docs first (even reverse-engineered), then incremental stories,
with version-pinned engine specialists and reviewed against a control manifest** —
that's "the proper way," applied to code that already exists.

### 4. Control the rigor

Set review intensity with `--review` on any skill, or in `production/review-mode.txt`:

- **`full`** — all director gates (highest scrutiny).
- **`lean`** — phase gates only (default for most solo work).
- **`solo`** — no gates (fast prototyping).

### Model & context

**GameStudio works on any Claude model** — Opus, Sonnet, standard or 1M context.
The one gotcha is billing, not compatibility: the **1M-context variants (`[1m]`)
need usage credits**. Context-heavy skills like `/reverse-document`, `/adopt`,
and `/review-all-gdds` read a lot of files, so on a 1M model without credits
you'll hit a *"1M context usage credits required"* error.

Two ways through it:
- **`/model`** → pick a standard-context Opus/Sonnet (no `[1m]`) — works with no credits. Recommended default.
- **`/usage-credits`** → enable 1M and it works fine, big window and all.

A SessionStart hook flags this automatically if you start on a 1M model. For very
large existing codebases, scope heavy skills to one system/module at a time
rather than the whole repo at once.

### Resuming later

Start a new session and run `/start` or `/help`; the session-start hook previews
saved state from `production/session-state/`. The docs in `design/`, `docs/`, and
`production/` hold every decision, so nothing is lost between sessions.

## Upgrading

Already using an older version of this template? See [UPGRADING.md](UPGRADING.md)
for step-by-step migration instructions, a breakdown of what changed between
versions, and which files are safe to overwrite vs. which need a manual merge.

## Project Structure

```
CLAUDE.md                           # Master configuration
.claude/
  settings.json                     # Hooks, permissions, safety rules
  agents/                           # 55 agent definitions (markdown + YAML frontmatter)
  skills/                           # 183 slash commands (subdirectory per skill)
  hooks/                            # 12 hook scripts (bash, cross-platform)
  rules/                            # 14 path-scoped coding standards
  statusline.sh                     # Status line script (context%, model, stage, epic breadcrumb)
  docs/
    workflow-catalog.yaml           # 7-phase pipeline definition (read by /help)
    templates/                      # 41 document templates
src/                                # Game source code
assets/                             # Art, audio, VFX, shaders, data files
design/                             # GDDs, narrative docs, level designs
docs/                               # Technical documentation and ADRs
tests/                              # Test suites (unit, integration, performance, playtest)
tools/                              # Build and pipeline tools
prototypes/                         # Throwaway prototypes (isolated from src/)
production/                         # Sprint plans, milestones, release tracking
```

## How It Works

### Agent Coordination

Agents follow a structured delegation model:

1. **Vertical delegation** — directors delegate to leads, leads delegate to specialists
2. **Horizontal consultation** — same-tier agents can consult each other but can't make binding cross-domain decisions
3. **Conflict resolution** — disagreements escalate up to the shared parent (`creative-director` for design, `technical-director` for technical)
4. **Change propagation** — cross-department changes are coordinated by `producer`
5. **Domain boundaries** — agents don't modify files outside their domain without explicit delegation

### Collaborative, Not Autonomous

This is **not** an auto-pilot system. Every agent follows a strict collaboration protocol:

1. **Ask** — agents ask questions before proposing solutions
2. **Present options** — agents show 2-4 options with pros/cons
3. **You decide** — the user always makes the call
4. **Draft** — agents show work before finalizing
5. **Approve** — nothing gets written without your sign-off

You stay in control. The agents provide structure and expertise, not autonomy.

### Automated Safety

**Hooks** run automatically on every session:

| Hook | Trigger | What It Does |
|------|---------|--------------|
| `validate-commit.sh` | PreToolUse (Bash) | Checks for hardcoded values, TODO format, JSON validity, design doc sections — exits early if the command is not `git commit` |
| `validate-push.sh` | PreToolUse (Bash) | Warns on pushes to protected branches — exits early if the command is not `git push` |
| `validate-assets.sh` | PostToolUse (Write/Edit) | Validates naming conventions and JSON structure — exits early if the file is not in `assets/` |
| `session-start.sh` | Session open | Shows current branch and recent commits for orientation |
| `detect-gaps.sh` | Session open | Detects fresh projects (suggests `/start`) and missing design docs when code or prototypes exist |
| `pre-compact.sh` | Before compaction | Preserves session progress notes |
| `post-compact.sh` | After compaction | Reminds Claude to restore session state from `active.md` |
| `notify.sh` | Notification event | Shows Windows toast notification via PowerShell |
| `session-stop.sh` | Session close | Archives `active.md` to session log and records git activity |
| `log-agent.sh` | Agent spawned | Audit trail start — logs subagent invocation |
| `log-agent-stop.sh` | Agent stops | Audit trail stop — completes subagent record |
| `validate-skill-change.sh` | PostToolUse (Write/Edit) | Advises running `/skill-test` after any `.claude/skills/` change |

> **Note**: `validate-commit.sh`, `validate-assets.sh`, and `validate-skill-change.sh` fire on every Bash/Write tool call and exit immediately (exit 0) when the command or file path is not relevant. This is normal hook behavior — not a performance concern.

**Permission rules** in `settings.json` auto-allow safe operations (git status, test runs) and block dangerous ones (force push, `rm -rf`, reading `.env` files).

### Path-Scoped Rules

Coding standards are automatically enforced based on file location:

| Path | Enforces |
|------|----------|
| `src/gameplay/**` | Data-driven values, delta time usage, no UI references |
| `src/core/**` | Zero allocations in hot paths, thread safety, API stability |
| `src/ai/**` | Performance budgets, debuggability, data-driven parameters |
| `src/networking/**` | Server-authoritative, versioned messages, security |
| `src/ui/**` | No game state ownership, localization-ready, accessibility |
| `design/gdd/**` | Required 8 sections, formula format, edge cases |
| `tests/**` | Test naming, coverage requirements, fixture patterns |
| `prototypes/**` | Relaxed standards, README required, hypothesis documented |

## Design Philosophy

This template is grounded in professional game development practices:

- **MDA Framework** — Mechanics, Dynamics, Aesthetics analysis for game design
- **Self-Determination Theory** — Autonomy, Competence, Relatedness for player motivation
- **Flow State Design** — Challenge-skill balance for player engagement
- **Bartle Player Types** — Audience targeting and validation
- **Verification-Driven Development** — Tests first, then implementation

## Customization

This is a **template**, not a locked framework. Everything is meant to be customized:

- **Add/remove agents** — delete agent files you don't need, add new ones for your domains
- **Edit agent prompts** — tune agent behavior, add project-specific knowledge
- **Modify skills** — adjust workflows to match your team's process
- **Add rules** — create new path-scoped rules for your project's directory structure
- **Tune hooks** — adjust validation strictness, add new checks
- **Pick your engine** — use the Godot, Unity, or Unreal agent set (or none)
- **Set review intensity** — `full` (all director gates), `lean` (phase gates only), or `solo` (none). Set during `/start` or edit `production/review-mode.txt`. Override per-run with `--review solo` on any skill.

## Platform Support

Primary development and testing on **Windows 10** with Git Bash. All hooks use POSIX-compatible patterns (`grep -E`, not `grep -P`) and include fallbacks for missing tools, so they should run on macOS and Linux. The `notify.sh` hook uses PowerShell for Windows toast notifications and is a no-op elsewhere — desktop notifications on macOS/Linux are not yet wired. Cross-platform testing is ongoing; please file issues for any platform-specific breakage.

## Community

- **Discussions** — [GitHub Discussions](https://github.com/bullish0x/gamestudio/discussions) for questions, ideas, and showcasing what you've built
- **Issues** — [Bug reports and feature requests](https://github.com/bullish0x/gamestudio/issues)

---

*Built for Claude Code. Maintained and extended — contributions welcome via [GitHub Discussions](https://github.com/bullish0x/gamestudio/discussions).*

## License

MIT License. See [LICENSE](LICENSE) for details.
