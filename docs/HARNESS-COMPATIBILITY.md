# Harness Compatibility

**Last Updated:** 2026-06-01

GameStudio is a studio workflow, not a model provider. Agents, skills, hooks,
rules, and templates must stay provider-neutral so the same project can run from
Claude Code, Codex/OpenAI-based harnesses, Cursor, Antigravity,
OpenCode-style tools, Gemini-style tools, or another AGENTS.md-aware coding
harness.

## Compatibility Contract

- `AGENTS.md` is the common repository instruction entrypoint.
- `.agents/skills/` is the canonical provider-neutral skill source.
- `.agents/agents/` is the canonical provider-neutral role source.
- `.agents/hooks/` is the canonical provider-neutral lifecycle hook source.
- `.agents/hooks.json` is the canonical provider-neutral hook registry.
- `.agents/rules/` is the canonical provider-neutral path-scoped rules source.
- `.agents/docs/` is the canonical provider-neutral coordination doc source.
- `.agents/docs/templates/` is the canonical provider-neutral template source.
- `.agents/adapter-manifest.json` records how adapter files map back to
  canonical assets and which gaps are intentional.
- `.claude/` is the Claude Code adapter.
- `.codex/` is the Codex/OpenAI adapter.
- `.cursor/rules/` is the Cursor adapter layer.
- Other harnesses should map their own skills, hooks, subagents, and rules back
  to the same behavior instead of changing the workflow.

Provider selection belongs outside the skill files. Configure Anthropic,
OpenAI, Gemini, DeepSeek, GLM/Z.ai, Qwen, local Ollama/vLLM, or routed models in
the harness or gateway.

## Harness Matrix

| Harness | Instruction Entry | Skills | Agents | Hooks | Provider Selection |
| ---- | ---- | ---- | ---- | ---- | ---- |
| Claude Code | `CLAUDE.md`, `AGENTS.md` | `.claude/skills/` or `.agents/skills/` | `.claude/agents/` or `.agents/agents/` | `.claude/settings.json` -> `.claude/hooks/` | Claude Code model/API config or compatible gateway |
| Codex/OpenAI harness | `AGENTS.md` | `.agents/skills/` | `.codex/agents/` or `.agents/agents/` | `.codex/hooks.json` -> `.codex/hooks/` | Harness model/API config or compatible gateway |
| Cursor | `AGENTS.md`, `.cursor/rules/gamestudio.mdc` | `.agents/skills/` | `.agents/agents/` via prompt or tool-native subagents | Cursor/external automation mapped from `.agents/hooks.json` to `.agents/hooks/` | Cursor model/provider settings or compatible gateway |
| Antigravity-style harness | `AGENTS.md` | Harness-native skills mapped to `.agents/skills/` | Harness-native subagents mapped to `.agents/agents/` | Harness-native lifecycle hooks mapped from `.agents/hooks.json` to `.agents/hooks/` | Harness model/provider settings or compatible gateway |
| OpenCode-style tool | `AGENTS.md` | Tool-native commands mapped to `.agents/skills/` | Tool-native agents or inline `.agents/agents/` roles | Tool-native lifecycle automation mapped from `.agents/hooks.json` to `.agents/hooks/` | Tool provider registry, custom base URL, or compatible gateway |
| Generic AGENTS.md-aware agent | `AGENTS.md` | `.agents/skills/` | `.agents/agents/` where supported | Manual or harness-native registration from `.agents/hooks.json` | Agent model/provider settings or compatible gateway |

Adapter details:

- Codex/OpenAI adapter: `docs/CODEX_ADAPTER.md`
- Claude Code adapter: `docs/CLAUDE_ADAPTER.md`
- Future Codex plugin packaging: `docs/PLUGIN_PACKAGING.md`

## Provider And Gateway Guidance

Use the simplest working provider path:

1. **Direct provider support**: Use this when the harness natively supports the
   model family you want.
2. **LiteLLM Proxy**: Recommended self-hosted default as of 2026-05-30 when you
   need one trusted open-source gateway for many upstream providers. Its
   official docs describe a unified interface for 100+ LLMs:
   https://docs.litellm.ai/
3. **OpenRouter**: Recommended hosted multi-model option when you want one API
   key for many hosted models and do not need to self-host the gateway. Its
   official docs describe one API for hundreds of models:
   https://openrouter.ai/docs/guides/overview/models
4. **Provider-specific OpenAI-compatible endpoints**: Use for vendors that
   already expose OpenAI-compatible chat completions or responses APIs.
5. **Agent Harness Launcher**: Optional companion repo
   `bullish0x/agent-harness-launcher` for users who want a CLI wizard that selects
   harness, provider, model, and workspace, then launches Claude Code or a
   Codex/OpenAI-compatible harness with the right bridge or environment.

Do not add provider-specific instructions to individual skills. A `/dev-story`
workflow should read the same whether the active model is Claude, GPT, Gemini,
DeepSeek, GLM/Z.ai, Qwen, or local.

Agent Harness Launcher is intentionally separate from this repository. It owns
provider profiles, bridge code, and harness process launch. This repository owns
portable studio behavior. Traditional direct harness setup remains supported.

## Gateway Configuration Shape

Keep secrets out of the repo. Store them in the harness, gateway environment, or
local ignored config.

GameStudio does not install or impersonate model providers. It provides the
portable project instructions, skills, agents, hooks, and adapter files. The
active harness still owns authentication, model selection, request format, and
network routing. When a harness supports custom base URLs or provider adapters,
GameStudio documents the shape to use; when it does not, use that harness's
native provider support or place a gateway in front of the model.

GameStudio is also not currently packaged as a Codex plugin. It is a
project-local framework/template. A packaged plugin would need
`.codex-plugin/plugin.json`, curated skill exposure, hook registration metadata,
agent registration metadata, and packaging/update semantics. See
`docs/PLUGIN_PACKAGING.md`.

Example LiteLLM proxy shape:

```yaml
model_list:
  - model_name: studio-primary
    litellm_params:
      model: <provider>/<primary-model>
      api_key: os.environ/OPENAI_API_KEY
  - model_name: studio-balanced
    litellm_params:
      model: <provider>/<balanced-model>
      api_key: os.environ/BALANCED_MODEL_API_KEY
  - model_name: studio-deepseek
    litellm_params:
      model: <provider>/<alternate-model>
      api_key: os.environ/DEEPSEEK_API_KEY
```

For a fuller installed starter config covering Anthropic, OpenAI, Gemini,
DeepSeek, GLM/Z.ai, Qwen, OpenRouter, Ollama, and vLLM-style routes, copy
`.agents/docs/provider-gateway-example.yaml` to an ignored local config file and
replace the placeholder model IDs/base URLs with the providers you actually use.

Point the harness at the gateway base URL and select `studio-primary`,
`studio-balanced`, or another alias there. Do not edit GameStudio skill files to
switch models.

Example OpenAI-compatible harness variables. Use the names your harness
documents; common variants include `OPENAI_BASE_URL` and `OPENAI_API_BASE`.

```bash
OPENAI_BASE_URL=http://localhost:4000/v1
OPENAI_API_KEY=<gateway-virtual-key>
OPENAI_MODEL=studio-primary
```

Example OpenRouter-style variables:

```bash
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENAI_API_KEY=<openrouter-key>
OPENAI_MODEL=<provider>/<model>
```

Use equivalent settings for harnesses that use Anthropic Messages or Gemini
native APIs.

## Optional Agent Harness Launcher

If you have access to the private companion repo, install the launcher from a
GameStudio checkout:

```bash
bash .agents/scripts/install-launcher.sh
```

Then create and run a profile:

```bash
agent-launch init-defaults --workspace "$PWD"
agent-launch doctor openrouter-codex
agent-launch web
agent-launch run <profile-name>
```

Launcher profiles live in the user's home directory and reference API key
environment variable names rather than storing committed secrets. The launcher
can detect GameStudio workspaces by `AGENTS.md` and `.agents/`, but it also
accepts an explicit workspace path.

## Harness Provider Setup

### Claude Code

Claude Code is the Claude adapter, but it can be pointed at a proxy or gateway
through Claude Code's own configuration. Configure this outside the repo or in
ignored local settings:

```bash
ANTHROPIC_BASE_URL=https://your-gateway.example.com
ANTHROPIC_AUTH_TOKEN=<gateway-token>
ANTHROPIC_CUSTOM_MODEL_OPTION=<gateway-model-alias>
ANTHROPIC_CUSTOM_MODEL_OPTION_NAME=Studio Primary
```

Use the Claude Code model picker to select the custom model entry, or use the
documented `ANTHROPIC_DEFAULT_*_MODEL` variables when you intentionally want to
remap Claude Code's default model roles through a gateway. The repo should not
hardcode those values.

### Codex And OpenAI-Compatible Harnesses

Use the harness's provider configuration. For Codex-style OpenAI-compatible
harnesses, that usually means a model provider entry or equivalent environment:

```bash
OPENAI_BASE_URL=https://your-gateway.example.com/v1
OPENAI_API_KEY=<gateway-token>
OPENAI_MODEL=<gateway-model-alias>
```

If the harness supports a provider registry, add LiteLLM, OpenRouter, DeepSeek,
GLM/Z.ai, Gemini, Ollama, vLLM, or another OpenAI-compatible endpoint there and
keep GameStudio files unchanged.

### Cursor, Antigravity, OpenCode, And Similar Tools

Use the tool's native provider settings first. Cursor and Antigravity-style
tools should read `AGENTS.md` plus their rule files and select models in their
own settings. OpenCode-style tools support provider configuration and custom
base URLs in their own config. Point those settings at a direct provider or at
LiteLLM/OpenRouter, then use `.agents/skills/`, `.agents/agents/`,
`.agents/hooks/`, `.agents/rules/`, and `.agents/docs/` as the portable
behavior source.

### What Hooks Can And Cannot Do

Hooks are lifecycle automation, not model routers. They can validate commands,
load state, remind the active harness to restore context, and log subagent
activity. They should not choose providers, mutate API keys, call model APIs, or
rewrite harness model configuration at runtime.

## Hook Portability

Hook scripts must:

- Exit `0` when a harness does not provide the expected event payload.
- Avoid provider-specific API calls.
- Use repo-relative paths when possible.
- Keep validation behavior identical across `.agents/hooks/`, `.claude/hooks/`,
  and `.codex/hooks/`.
- Treat missing optional tools (`jq`, Python) as a degraded validation mode, not
  a failed session.

Harness event names differ. Map them to the closest GameStudio lifecycle event:

| GameStudio Event | Script Name | Generic Meaning |
| ---- | ---- | ---- |
| `SessionStart` | `session-start.sh`, `detect-gaps.sh`, `model-advisory.sh` | Load project state and warn about obvious setup gaps |
| `PreToolUse` | `validate-commit.sh`, `validate-push.sh` | Validate dangerous or consequential shell commands |
| `PostToolUse` | `validate-assets.sh`, `validate-skill-change.sh` | Validate changed files after writes |
| `PreCompact` | `pre-compact.sh` | Persist active context before summary/compaction |
| `PostCompact` | `post-compact.sh` | Restore state after summary/compaction |
| `SubagentStart` | `log-agent.sh` | Start audit trail for delegated work |
| `SubagentStop` | `log-agent-stop.sh` | Close audit trail for delegated work |
| `Stop` | `session-stop.sh` | Summarize session end state |

## Skill And Agent Portability

Skills should be plain Markdown workflows with stable sections:

- Trigger conditions
- Required context to read
- Questions and decision points
- Approval requirements before writes
- Expected outputs
- Verification steps

Agents should be role definitions with:

- Domain ownership
- Inputs they must inspect
- Outputs they can draft
- Escalation path
- Files they may touch only after approval

Avoid harness-only phrases such as "use the Claude Task tool" in canonical
skills. Adapter copies may mention harness-specific commands, but the canonical
behavior must remain transferable.

Templates live under `.agents/docs/templates/` for provider-neutral use. Adapter
copies can point to the same template names, but template content should describe
game artifacts, not model providers or harness-specific commands.

Guarantees are intentionally narrow:

- Skills can always be read and followed as workflow docs from `.agents/skills/`.
- Slash-command exposure depends on the harness adapter or loader.
- Hooks depend on the harness hook system and a compatible local shell.
- Adapter folders must map back to `.agents/` through
  `.agents/adapter-manifest.json` and validation.

## Repository Governance

Provider-neutral compatibility is enforced through repository metadata as well
as docs:

- `README.md` should describe GameStudio as a harness-neutral studio framework,
  not as a Claude-only template.
- `CONTRIBUTING.md` defines the contribution rule: canonical behavior goes in
  `.agents/`; adapters translate it for specific harnesses.
- `SECURITY.md` treats hooks, skills, agents, adapters, gateway examples, and
  collaboration bypasses as security-sensitive surfaces.
- `.github/CODEOWNERS` requires maintainer review for `.agents/`, adapter
  folders, security policy, contribution policy, and GitHub workflow metadata.
- `.github/PULL_REQUEST_TEMPLATE.md` asks contributors to confirm provider
  neutrality, compatibility validation, security updates, and collaboration
  policy updates when relevant.
- Issue templates ask reporters to identify whether a problem is in canonical
  `.agents/` content, a harness adapter, a provider gateway example, or repo
  policy.

When changing any of those files, keep the same invariant: the workflow should
stay stable while provider, model, and harness selection remain external.

### Tool Name Mapping

Some skill files refer to common harness tools by their Claude/Codex-style
names. Other harnesses should map these to native equivalents:

| Canonical Tool Name | Portable Meaning | Fallback |
| ---- | ---- | ---- |
| `Read`, `Glob`, `Grep` | Inspect files and search the workspace | Use the harness file browser or shell search |
| `Write`, `Edit` | Create or modify files after approval | Use the harness edit tool after explicit user approval |
| `Bash` | Run shell commands | Use the harness terminal/shell tool |
| `Task` | Spawn or consult a role-specific subagent | Inline the role instructions or use the harness subagent feature |
| `AskUserQuestion` | Capture a structured user decision | Present the same options in plain text if no structured UI exists |
| `TodoWrite` | Track multi-step progress | Use the harness plan/task list or a concise markdown checklist |

The required behavior is the collaboration pattern, not the exact tool name.
If a harness lacks a named tool, preserve the same decision point and approval
semantics with that harness's closest available mechanism.

## Compatibility Checklist

Before adding or changing a skill, agent, hook, or rule:

- [ ] It works when model/provider is selected only by the harness.
- [ ] It does not mention a provider unless the task is explicitly about that
      provider.
- [ ] It keeps the collaboration protocol: Question -> Options -> Decision ->
      Draft -> Approval.
- [ ] It can run with direct provider APIs or through a gateway.
- [ ] Hook logic has no provider-specific network dependency.
- [ ] Any harness-specific adapter points back to the provider-neutral source.

After changing compatibility assets, run:

```bash
python .agents/scripts/validate-compatibility.py
```
