# Agent Roster

The following agents are available. Each has a dedicated definition file in
`.claude/agents/`. Use the agent best suited to the task at hand. When a task
spans multiple domains, the coordinating agent (usually `producer` or the
domain lead) should delegate to specialists.

## Tier 1 -- Leadership Agents (highest reasoning)
| Agent | Domain | When to Use |
|-------|--------|-------------|
| `creative-director` | High-level vision | Major creative decisions, pillar conflicts, tone/direction |
| `technical-director` | Technical vision | Architecture decisions, tech stack choices, performance strategy |
| `producer` | Production management | Sprint planning, milestone tracking, risk management, coordination |

## Tier 2 -- Department Lead Agents (balanced reasoning)
| Agent | Domain | When to Use |
|-------|--------|-------------|
| `game-designer` | Game design | Mechanics, systems, progression, economy, balancing |
| `lead-programmer` | Code architecture | System design, code review, API design, refactoring |
| `art-director` | Visual direction | Style guides, art bible, asset standards, UI/UX direction |
| `audio-director` | Audio direction | Music direction, sound palette, audio implementation strategy |
| `narrative-director` | Story and writing | Story arcs, world-building, character design, dialogue strategy |
| `qa-lead` | Quality assurance | Test strategy, bug triage, release readiness, regression planning |
| `release-manager` | Release pipeline | Build management, versioning, changelogs, deployment, rollbacks |
| `localization-lead` | Internationalization | String externalization, translation pipeline, locale testing |

## Tier 3 -- Specialist Agents (balanced or fast reasoning)
| Agent | Domain | Reasoning tier | When to Use |
|-------|--------|-------|-------------|
| `systems-designer` | Systems design | balanced | Specific mechanic implementation, formula design, loops |
| `level-designer` | Level design | balanced | Level layouts, pacing, encounter design, flow |
| `economy-designer` | Economy/balance | balanced | Resource economies, loot tables, progression curves |
| `gameplay-programmer` | Gameplay code | balanced | Feature implementation, gameplay systems code |
| `engine-programmer` | Engine systems | balanced | Core engine, rendering, physics, memory management |
| `ai-programmer` | AI systems | balanced | Behavior trees, pathfinding, NPC logic, state machines |
| `network-programmer` | Networking | balanced | Netcode, replication, lag compensation, matchmaking |
| `tools-programmer` | Dev tools | balanced | Editor extensions, pipeline tools, debug utilities |
| `ui-programmer` | UI implementation | balanced | UI framework, screens, widgets, data binding |
| `technical-artist` | Tech art | balanced | Shaders, VFX, optimization, art pipeline tools |
| `sound-designer` | Sound design | balanced | SFX design docs, audio event lists, mixing notes |
| `writer` | Dialogue/lore | balanced | Dialogue writing, lore entries, item descriptions |
| `world-builder` | World/lore design | balanced | World rules, faction design, history, geography |
| `qa-tester` | Test execution | fast | Writing test cases, bug reports, test checklists |
| `performance-analyst` | Performance | balanced | Profiling, optimization recs, memory analysis |
| `devops-engineer` | Build/deploy | fast | CI/CD, build scripts, version control workflow |
| `analytics-engineer` | Telemetry | balanced | Event tracking, dashboards, A/B test design |
| `ux-designer` | UX flows | balanced | User flows, wireframes, accessibility, input handling |
| `prototyper` | Rapid prototyping | balanced | Throwaway prototypes, mechanic testing, feasibility validation |
| `security-engineer` | Security | balanced | Anti-cheat, exploit prevention, save encryption, network security |
| `accessibility-specialist` | Accessibility | fast | WCAG compliance, colorblind modes, remapping, text scaling |
| `live-ops-designer` | Live operations | balanced | Seasons, events, battle passes, retention, live economy |
| `community-manager` | Community | fast | Patch notes, player feedback, crisis comms, community health |

## Engine-Specific Agents (use the set matching your engine)

### Engine Leads

| Agent | Engine | Reasoning tier | When to Use |
| ---- | ---- | ---- | ---- |
| `unreal-specialist` | Unreal Engine 5 | balanced | Blueprint vs C++, GAS overview, UE subsystems, Unreal optimization |
| `unity-specialist` | Unity | balanced | MonoBehaviour vs DOTS, Addressables, URP/HDRP, Unity optimization |
| `godot-specialist` | Godot 4 | balanced | GDScript patterns, node/scene architecture, signals, Godot optimization |

### Unreal Engine Sub-Specialists

| Agent | Subsystem | Reasoning tier | When to Use |
| ---- | ---- | ---- | ---- |
| `ue-gas-specialist` | Gameplay Ability System | balanced | Abilities, gameplay effects, attribute sets, tags, prediction |
| `ue-blueprint-specialist` | Blueprint Architecture | balanced | BP/C++ boundary, graph standards, naming, BP optimization |
| `ue-replication-specialist` | Networking/Replication | balanced | Property replication, RPCs, prediction, relevancy, bandwidth |
| `ue-umg-specialist` | UMG/CommonUI | balanced | Widget hierarchy, data binding, CommonUI input, UI performance |

### Unity Sub-Specialists

| Agent | Subsystem | Reasoning tier | When to Use |
| ---- | ---- | ---- | ---- |
| `unity-dots-specialist` | DOTS/ECS | balanced | Entity Component System, Jobs, Burst compiler, hybrid renderer |
| `unity-shader-specialist` | Shaders/VFX | balanced | Shader Graph, VFX Graph, URP/HDRP customization, post-processing |
| `unity-addressables-specialist` | Asset Management | balanced | Addressable groups, async loading, memory, content delivery |
| `unity-ui-specialist` | UI Toolkit/UGUI | balanced | UI Toolkit, UXML/USS, UGUI Canvas, data binding, cross-platform input |

### Godot Sub-Specialists

| Agent | Subsystem | Reasoning tier | When to Use |
| ---- | ---- | ---- | ---- |
| `godot-gdscript-specialist` | GDScript | balanced | Static typing, design patterns, signals, coroutines, GDScript performance |
| `godot-csharp-specialist` | C# / .NET | balanced | .NET patterns, [Signal] delegates, async, nullable types, type-safe node access |
| `godot-shader-specialist` | Shaders/Rendering | balanced | Godot shading language, visual shaders, particles, post-processing |
| `godot-gdextension-specialist` | GDExtension | balanced | C++/Rust bindings, native performance, custom nodes, build systems |
