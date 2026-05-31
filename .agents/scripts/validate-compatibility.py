#!/usr/bin/env python3
"""Validate GameStudio provider-neutral compatibility assets.

This script intentionally uses only Python stdlib so it can run in fresh
projects without extra packages. It checks the files that make non-Claude,
non-Codex harnesses work: neutral hook registry/scripts, adapter parity,
gateway example sync, and required documentation pointers.
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]

EXPECTED_HOOKS = {
    "detect-gaps.sh",
    "log-agent-stop.sh",
    "log-agent.sh",
    "model-advisory.sh",
    "notify.sh",
    "post-compact.sh",
    "pre-compact.sh",
    "session-start.sh",
    "session-stop.sh",
    "validate-assets.sh",
    "validate-commit.sh",
    "validate-push.sh",
    "validate-skill-change.sh",
}

EXPECTED_GATEWAY_ROUTES = {
    "studio-primary",
    "studio-anthropic",
    "studio-gemini",
    "studio-deepseek",
    "studio-glm",
    "studio-qwen",
    "studio-openrouter",
    "studio-local",
    "studio-vllm",
}


def fail(message: str) -> None:
    print(f"FAIL: {message}", file=sys.stderr)
    raise SystemExit(1)


def read_text(path: str) -> str:
    full = ROOT / path
    if not full.is_file():
        fail(f"missing file: {path}")
    return full.read_text(encoding="utf-8")


def load_json(path: str) -> dict:
    try:
        return json.loads(read_text(path))
    except json.JSONDecodeError as exc:
        fail(f"invalid JSON in {path}: {exc}")


def collect_hook_commands(config: dict) -> list[tuple[str, str]]:
    hooks = config.get("hooks")
    if not isinstance(hooks, dict):
        fail("hook config missing object field: hooks")

    commands: list[tuple[str, str]] = []
    for event_name, event_entries in hooks.items():
        if not isinstance(event_entries, list):
            fail(f"hook event is not a list: {event_name}")
        for entry in event_entries:
            for hook in entry.get("hooks", []):
                command = hook.get("command")
                if command:
                    commands.append((event_name, command))
    return commands


def hook_name(command: str, prefix: str) -> str:
    expected = f"bash {prefix}/"
    if not command.startswith(expected):
        fail(f"unexpected hook command prefix: {command}")
    return command.removeprefix(expected)


def validate_hook_registry() -> None:
    neutral = load_json(".agents/hooks.json")
    commands = collect_hook_commands(neutral)
    if len(commands) != 13:
        fail(f".agents/hooks.json should register 13 commands, found {len(commands)}")

    names = {hook_name(command, ".agents/hooks") for _, command in commands}
    if names != EXPECTED_HOOKS:
        fail(f"neutral hook registry mismatch: missing={sorted(EXPECTED_HOOKS - names)} extra={sorted(names - EXPECTED_HOOKS)}")

    for name in names:
        path = ROOT / ".agents" / "hooks" / name
        if not path.is_file():
            fail(f"registered neutral hook script does not exist: {path.relative_to(ROOT)}")

    claude_names = {
        hook_name(command, ".claude/hooks")
        for _, command in collect_hook_commands(load_json(".claude/settings.json"))
        if command.startswith("bash .claude/hooks/")
    }
    if claude_names != EXPECTED_HOOKS:
        fail(f"Claude hook adapter mismatch: missing={sorted(EXPECTED_HOOKS - claude_names)} extra={sorted(claude_names - EXPECTED_HOOKS)}")

    codex_expected = EXPECTED_HOOKS - {"notify.sh"}
    codex_names = {
        hook_name(command, ".codex/hooks")
        for _, command in collect_hook_commands(load_json(".codex/hooks.json"))
    }
    if codex_names != codex_expected:
        fail(f"Codex hook adapter mismatch: missing={sorted(codex_expected - codex_names)} extra={sorted(codex_names - codex_expected)}")


def validate_shell_syntax() -> None:
    scripts = sorted((ROOT / ".agents" / "hooks").glob("*.sh"))
    scripts += sorted((ROOT / ".claude" / "hooks").glob("*.sh"))
    scripts += sorted((ROOT / ".codex" / "hooks").glob("*.sh"))
    scripts.append(ROOT / ".claude" / "statusline.sh")

    for script in scripts:
        rel = script.relative_to(ROOT).as_posix()
        result = subprocess.run(["bash", "-n", rel], cwd=ROOT, text=True, capture_output=True)
        if result.returncode != 0:
            fail(f"bash syntax failed for {rel}: {result.stderr.strip()}")


def validate_gateway_examples() -> None:
    agents = read_text(".agents/docs/provider-gateway-example.yaml")
    claude = read_text(".claude/docs/provider-gateway-example.yaml")
    if agents != claude:
        fail("gateway example copies differ between .agents and .claude")

    routes = set(re.findall(r"^\s*-\s+model_name:\s+([A-Za-z0-9_-]+)\s*$", agents, flags=re.MULTILINE))
    if routes != EXPECTED_GATEWAY_ROUTES:
        fail(f"gateway route mismatch: missing={sorted(EXPECTED_GATEWAY_ROUTES - routes)} extra={sorted(routes - EXPECTED_GATEWAY_ROUTES)}")

    required_fragments = [
        "api_base: https://openrouter.ai/api/v1",
        "api_base: http://localhost:11434/v1",
        "master_key: os.environ/LITELLM_MASTER_KEY",
        "drop_params: true",
    ]
    for fragment in required_fragments:
        if fragment not in agents:
            fail(f"gateway example missing fragment: {fragment}")


def validate_docs() -> None:
    required = {
        "AGENTS.md": [".agents/hooks.json", "OpenCode-style tools"],
        "docs/HARNESS-COMPATIBILITY.md": [
            ".agents/hooks.json",
            "OpenCode-style tool",
            "provider-gateway-example.yaml",
            "ANTHROPIC_CUSTOM_MODEL_OPTION",
            "OPENAI_BASE_URL",
        ],
        ".agents/docs/hooks-reference.md": [".agents/hooks.json", "notify.sh"],
        ".agents/docs/setup-requirements.md": ["provider-gateway-example.yaml", "OpenCode-style tools"],
        ".claude/docs/setup-requirements.md": ["provider-gateway-example.yaml", "OpenCode-style tools"],
    }

    for path, fragments in required.items():
        text = read_text(path)
        for fragment in fragments:
            if fragment not in text:
                fail(f"{path} missing required text: {fragment}")

    # Repository docs are not part of installed project payloads. Validate them
    # when present in the source repo, but allow the script to run in generated
    # projects that only receive the installer-owned files.
    optional_repo_docs = {
        "README.md": [
            ".agents/docs/provider-gateway-example.yaml",
            ".agents/hooks.json",
            "Cursor",
            "generic AGENTS.md-compatible adapters",
        ],
        "docs/examples/README.md": ["without a structured question UI"],
    }

    for path, fragments in optional_repo_docs.items():
        full = ROOT / path
        if not full.is_file():
            continue
        text = full.read_text(encoding="utf-8")
        for fragment in fragments:
            if fragment not in text:
                fail(f"{path} missing required text: {fragment}")


def main() -> None:
    validate_hook_registry()
    validate_shell_syntax()
    validate_gateway_examples()
    validate_docs()
    print("compatibility validation ok")


if __name__ == "__main__":
    main()
