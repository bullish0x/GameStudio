# Setup Requirements

This template requires a few tools to be installed for full functionality.
All hooks fail gracefully if tools are missing — nothing will break, but
you'll lose validation features.

## Required

| Tool | Purpose | Install |
| ---- | ---- | ---- |
| **Git** | Version control, branch management | [git-scm.com](https://git-scm.com/) |
| **A supported coding-agent harness** | Runs GameStudio agents, skills, and hooks | Claude Code, Codex/OpenAI-based harnesses, Cursor, Antigravity, OpenCode-style tools, Gemini-style tools, or another AGENTS.md-aware agent |

## Recommended

| Tool | Used By | Purpose | Install |
| ---- | ---- | ---- | ---- |
| **jq** | Hooks (7 of 13) | JSON parsing in commit/push/asset/agent hooks | See below |
| **Python 3** | Hooks (2 of 13) | JSON validation for data files | [python.org](https://www.python.org/) |
| **Bash** | All hooks | Shell script execution | Included with Git for Windows |
| **LiteLLM Proxy or OpenRouter** | Optional model gateway | Use when your harness needs one OpenAI-compatible or Anthropic-compatible endpoint for multiple providers |

### Installing jq

**Windows** (any of these):
```
winget install jqlang.jq
choco install jq
scoop install jq
```

**macOS**:
```
brew install jq
```

**Linux**:
```
sudo apt install jq     # Debian/Ubuntu
sudo dnf install jq     # Fedora
sudo pacman -S jq       # Arch
```

## Platform Notes

### Windows
- Git for Windows includes **Git Bash**, which provides the `bash` command
  used by all hooks in `settings.json`
- Ensure Git Bash is on your PATH (default if installed via the Git installer)
- Hooks use `bash .agents/hooks/[name].sh`, `bash .claude/hooks/[name].sh`, or
  the matching adapter path. This
  works on Windows when the active harness invokes commands through a shell
  that can find `bash.exe`

### macOS / Linux
- Bash is available natively
- Install `jq` via your package manager for full hook support

## Verifying Your Setup

Run these commands to check prerequisites:

```bash
git --version          # Should show git version
bash --version         # Should show bash version
jq --version           # Should show jq version (optional)
python3 --version      # Should show python version (optional)
```

## Provider And Router Setup

GameStudio does not require a specific LLM provider. Configure the active
harness to use Anthropic, OpenAI, Gemini, DeepSeek, GLM/Z.ai, Qwen, a local
Ollama/vLLM endpoint, or a routed model.

When a bridge is needed, prefer a gateway instead of editing skills:

| Gateway | Use When | Notes |
| ---- | ---- | ---- |
| **LiteLLM Proxy** | You want a trusted open-source, self-hosted gateway | Presents a unified OpenAI-style API for many providers and can run locally or on a small server |
| **OpenRouter** | You want hosted multi-model routing with one API key | Good for quick access to many hosted models |
| **Direct provider API** | Your harness already supports the provider | Best when the harness natively supports the target model and tools |

Use `.agents/docs/provider-gateway-example.yaml` as a starting point when you
want one local LiteLLM Proxy config for OpenAI, Anthropic, Gemini, DeepSeek,
GLM/Z.ai, Qwen, OpenRouter, Ollama, and vLLM-style routes.

Keep provider credentials, base URLs, model aliases, budgets, and fallbacks in
the harness or gateway configuration. Do not hardcode them in GameStudio skills,
agents, hooks, or project docs.

## What Happens Without Optional Tools

| Missing Tool | Effect |
| ---- | ---- |
| **jq** | Commit validation, push protection, asset validation, and agent audit hooks silently skip their checks. Commits and pushes still work. |
| **Python 3** | JSON data file validation in commit and asset hooks is skipped. Invalid JSON can be committed without warning. |
| **Both** | All hooks still execute without error (exit 0) but provide no validation. You're flying without safety nets. |

## Recommended Harnesses And IDEs

GameStudio is harness-neutral, with adapters for:

- **Canonical harness-neutral files** via `.agents/skills/`, `.agents/agents/`,
  `.agents/hooks/`, `.agents/rules/`, and `.agents/docs/`
- **Claude Code** via `.claude/settings.json`, `.claude/agents/`,
  `.claude/skills/`, and `.claude/hooks/`
- **Codex/OpenAI-based harnesses** via `AGENTS.md`, `.codex/agents/`, and
  `.codex/hooks.json`
- **Cursor** via `AGENTS.md` and `.cursor/rules/gamestudio.mdc`
- **Antigravity/OpenCode-style harnesses** via AGENTS.md plus harness-native skills,
  hooks, and subagent registration mapped back to `.agents/`
