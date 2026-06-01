# Security Policy

## Supported Versions

Only the `main` branch receives security fixes. Forks and older releases are
not supported.

## Reporting a Vulnerability

**Do not report security vulnerabilities through public GitHub issues.**

Use GitHub's private vulnerability reporting instead:

**[Report a vulnerability →](https://github.com/bullish0x/gamestudio/security/advisories/new)**

Include as much detail as possible:
- Description of the vulnerability and what it affects
- Steps to reproduce
- Potential impact and attack scenarios
- Any suggested mitigations

**What to expect:**
- Acknowledgment within **48 hours**
- Status update within **7 days**
- Resolution within **90 days** for confirmed vulnerabilities

## What Is In Scope

GS is a **local development tool**. It installs provider-neutral studio files
under `.agents/`, plus adapter files for harnesses such as Claude Code, Codex,
Cursor, Antigravity-style tools, and OpenCode-style tools. Security issues are
primarily about contributed code that executes in users' environments without
their awareness.

### High Severity
- Hooks (`.agents/hooks/*.sh`, `.claude/hooks/*.sh`, `.codex/hooks/*.sh`, or
  another adapter hook path) that execute malicious or undisclosed shell
  commands on user machines
- Skills or agents that exfiltrate environment variables, API keys, or secrets
- Prompt injection via skill or agent definitions that causes the active harness
  to bypass safety measures or take unauthorized destructive actions
- Contributions that silently alter behavior in ways users cannot audit

### Medium Severity
- Skills that make undisclosed outbound network requests
- Agent definitions that escalate permissions or bypass user confirmation prompts
- Hook patterns that behave differently across platforms to conceal behavior
- Skills that write outside their documented scope without an explicit user
  approval step

### Out of Scope
- The behavior of a model provider, gateway, or coding-agent harness itself
  (report to that provider or tool vendor)
- Bugs in the user's local harness installation or editor extension
- Theoretical vulnerabilities with no realistic attack path
- Issues requiring physical access to the user's machine

## Security Guidelines for Contributors

When contributing hooks, skills, agents, adapters, or gateway examples:

- **Hooks must be POSIX-compatible** — use `grep -E`, not `grep -P`; avoid
  platform-specific syntax that behaves differently across operating systems
- **No silent network calls** from hooks or skills unless explicitly documented
  and opt-in by the user
- **No reading secrets or environment variables** beyond what is minimally
  required and clearly documented in the skill's header
- **Skills must not write outside their documented scope** without an explicit
  user confirmation step
- **Provider routing must stay outside canonical skills and agents**. Configure
  model providers in the harness or a gateway; do not hide provider selection
  logic in `.agents/skills/`, `.agents/agents/`, hooks, or templates.
- **Adapters must point back to `.agents/` behavior**. If an adapter needs
  harness-specific syntax, it must not weaken approval, security, or
  collaboration requirements.

Run the compatibility validator after changing hooks, adapters, gateway
examples, or provider-neutral docs:

```bash
python .agents/scripts/validate-compatibility.py
```

## Disclosure Policy

We follow a **90-day coordinated disclosure** timeline:

1. You submit the vulnerability privately
2. We acknowledge within 48 hours
3. We confirm and assess severity within 7 days
4. We develop and test a fix
5. We notify you before any public disclosure
6. Public disclosure happens after the fix ships, or at 90 days — whichever
   comes first

We credit reporters in release notes unless you prefer to remain anonymous.
