# Agent Coordination Rules

1. **Vertical Delegation**: Leadership agents delegate to department leads, who
   delegate to specialists. Never skip a tier for complex decisions.
2. **Horizontal Consultation**: Agents at the same tier may consult each other
   but must not make binding decisions outside their domain.
3. **Conflict Resolution**: When two agents disagree, escalate to the shared
   parent. If no shared parent, escalate to `creative-director` for design
   conflicts or `technical-director` for technical conflicts.
4. **Change Propagation**: When a design change affects multiple domains, the
   `producer` agent coordinates the propagation.
5. **No Unilateral Cross-Domain Changes**: An agent must never modify files
   outside its designated directories without explicit delegation.

## Reasoning Tier Assignment

Skills and agents may recommend reasoning tiers based on task complexity. These
are portability hints only; the active harness decides the actual model.

| Tier | Harness-level meaning | When to use |
|------|-------|-------------|
| **fast reasoning** | `fast-reasoning-tier` | Read-only status checks, formatting, simple lookups — no creative judgment needed |
| **balanced reasoning** | `balanced-reasoning-tier` | Implementation, design authoring, analysis of individual systems — default for most work |
| **highest reasoning** | `highest-reasoning-tier` | Multi-document synthesis, high-stakes phase gate verdicts, cross-system holistic review |

Fast-reasoning examples: `/help`, `/sprint-status`, `/story-readiness`, `/scope-check`,
`/project-stage-detect`, `/changelog`, `/patch-notes`, `/onboard`

Highest-reasoning examples: `/review-all-gdds`, `/architecture-review`, `/gate-check`

All other skills default to balanced reasoning. When creating new skills, assign fast reasoning if the
skill only reads and formats; assign highest reasoning if it must synthesize 5+ documents with
high-stakes output; otherwise leave unset (balanced reasoning).

## Subagents vs Agent Teams

This project uses two distinct multi-agent patterns:

### Subagents (current, always active)
Spawned via `Task` or the active harness equivalent within a single active
harness session. Used by all `team-*` skills
and orchestration skills. Subagents share the session's permission context, run
sequentially or in parallel within the session, and return results to the parent.

**When to spawn in parallel**: If two subagents' inputs are independent (neither
needs the other's output to begin), spawn both Task calls simultaneously rather
than waiting. Example: `/review-all-gdds` Phase 1 (consistency) and Phase 2
(design theory) are independent — spawn both at the same time.

### Agent Teams (experimental — opt-in)
Multiple independent active harness sessions running simultaneously, coordinated
via a shared task list. Each session has its own context window and token budget.
Requires explicit harness support for parallel agent teams.

**Use agent teams when**:
- Work spans multiple subsystems that will not touch the same files
- Each workstream would take >30 minutes and benefits from true parallelism
- A senior agent (technical-director, producer) needs to coordinate 3+ specialist
  sessions working on different epics simultaneously

**Do not use agent teams when**:
- One session's output is required as input for another (use sequential subagents)
- The task fits in a single session's context (use subagents instead)
- Cost is a concern — each team member burns tokens independently

**Current status**: Opt-in when the selected harness supports parallel agent
teams. Document first usage here when adopted.

## Parallel Task Protocol

When an orchestration skill spawns multiple independent agents:

1. Issue all independent Task calls before waiting for any result
2. Collect all results before proceeding to dependent phases
3. If any agent is BLOCKED, surface it immediately — do not silently skip
4. Always produce a partial report if some agents complete and others block
