#!/usr/bin/env python3
"""Validate GameStudio provider-neutral compatibility assets.

The canonical GameStudio workflow lives in .agents/. Harness folders are
adapters. This script checks that the adapters are mapped, hook references are
real, README counts match the filesystem, and adapter-only differences are
documented instead of silently drifting.
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


def warn(message: str) -> None:
    print(f"WARN: {message}", file=sys.stderr)


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


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


def canonical_counts() -> dict[str, int]:
    template_root = ROOT / ".agents" / "docs" / "templates"
    return {
        "agents": len(list((ROOT / ".agents" / "agents").glob("*.md"))),
        "skills": len([p for p in (ROOT / ".agents" / "skills").iterdir() if p.is_dir()]),
        "hooks": len(list((ROOT / ".agents" / "hooks").glob("*.sh"))),
        "rules": len(list((ROOT / ".agents" / "rules").glob("*.md"))),
        "templates": len(list(template_root.glob("*.md")))
        + len(list((template_root / "collaborative-protocols").glob("*.md"))),
    }


def validate_readme_counts() -> None:
    readme = read_text("README.md")
    counts = canonical_counts()
    patterns = {
        "agents": [r"badge/agents-(\d+)-", r"\|\s+\*\*Agents\*\*\s+\|\s+(\d+)\s+\|"],
        "skills": [r"badge/skills-(\d+)-", r"\|\s+\*\*Skills\*\*\s+\|\s+(\d+)\s+\|"],
        "hooks": [r"badge/hooks-(\d+)-", r"\|\s+\*\*Hooks\*\*\s+\|\s+(\d+)\s+\|"],
        "rules": [r"badge/rules-(\d+)-", r"\|\s+\*\*Rules\*\*\s+\|\s+(\d+)\s+\|"],
        "templates": [r"\|\s+\*\*Templates\*\*\s+\|\s+(\d+)\s+\|"],
    }

    for key, pats in patterns.items():
        for pattern in pats:
            match = re.search(pattern, readme)
            if not match:
                fail(f"README.md missing count pattern for {key}: {pattern}")
            value = int(match.group(1))
            if value != counts[key]:
                fail(f"README.md {key} count is {value}, filesystem count is {counts[key]}")

    headline = re.search(r"(\d+) agents\. (\d+) skills\.", readme)
    if not headline:
        fail("README.md missing headline agent/skill count")
    if int(headline.group(1)) != counts["agents"] or int(headline.group(2)) != counts["skills"]:
        fail("README.md headline counts do not match canonical filesystem counts")


def collect_hook_commands(config: dict) -> list[tuple[str, str]]:
    hooks = config.get("hooks")
    if not isinstance(hooks, dict):
        fail("hook config missing object field: hooks")

    commands: list[tuple[str, str]] = []
    for event_name, event_entries in hooks.items():
        if not isinstance(event_entries, list):
            fail(f"hook event is not a list: {event_name}")
        for entry in event_entries:
            if not isinstance(entry, dict):
                fail(f"hook entry is not an object: {event_name}")
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
    if len(commands) != len(EXPECTED_HOOKS):
        fail(f".agents/hooks.json should register {len(EXPECTED_HOOKS)} commands, found {len(commands)}")

    names = {hook_name(command, ".agents/hooks") for _, command in commands}
    if names != EXPECTED_HOOKS:
        fail(f"neutral hook registry mismatch: missing={sorted(EXPECTED_HOOKS - names)} extra={sorted(names - EXPECTED_HOOKS)}")

    for name in names:
        path = ROOT / ".agents" / "hooks" / name
        if not path.is_file():
            fail(f"registered neutral hook script does not exist: {rel(path)}")

    claude_names = {
        hook_name(command, ".claude/hooks")
        for _, command in collect_hook_commands(load_json(".claude/settings.json"))
        if command.startswith("bash .claude/hooks/")
    }
    if claude_names != EXPECTED_HOOKS:
        fail(f"Claude hook adapter mismatch: missing={sorted(EXPECTED_HOOKS - claude_names)} extra={sorted(claude_names - EXPECTED_HOOKS)}")
    for name in claude_names:
        path = ROOT / ".claude" / "hooks" / name
        if not path.is_file():
            fail(f"registered Claude hook script does not exist: {rel(path)}")

    codex_expected = EXPECTED_HOOKS - {"notify.sh"}
    codex_names = {
        hook_name(command, ".codex/hooks")
        for _, command in collect_hook_commands(load_json(".codex/hooks.json"))
    }
    if codex_names != codex_expected:
        fail(f"Codex hook adapter mismatch: missing={sorted(codex_expected - codex_names)} extra={sorted(codex_names - codex_expected)}")
    for name in codex_names:
        path = ROOT / ".codex" / "hooks" / name
        if not path.is_file():
            fail(f"registered Codex hook script does not exist: {rel(path)}")


def normalize_adapter_text(text: str, source: str, target: str) -> str:
    target_top = target.split("/", 1)[0]
    if source == ".agents/hooks":
        normalized = text
        if target_top == ".claude":
            return (
                normalized.replace("Provider-neutral harness", "Claude Code")
                .replace("provider-neutral hook reference", "Claude Code hooks reference")
                .replace("Reminds the harness", "Reminds Claude")
                .replace("the harness sees", "Claude sees")
                .replace("when the harness finishes", "when Claude finishes")
                .replace("stderr shown to the harness", "stderr shown to Claude")
                .replace(
                    "inside .agents/skills/ or an adapter skill tree",
                    "inside .claude/skills/ or .agents/skills/",
                )
                .replace(r"(\.codex|\.claude|\.agents)", r"(\.claude|\.agents)")
            )
        if target_top == ".codex":
            return (
                normalized.replace("Provider-neutral harness", "Codex-compatible harness")
                .replace("provider-neutral hook reference", "Codex-compatible harness hooks reference")
                .replace(
                    "inside .agents/skills/ or an adapter skill tree",
                    "inside .codex/skills/, .claude/skills/, or .agents/skills/",
                )
            )
        return normalized

    normalized = text.replace(source, target).replace(source.replace("/", "\\"), target.replace("/", "\\"))
    source_top = source.split("/", 1)[0]
    normalized = normalized.replace(source_top, target_top).replace(source_top.replace("/", "\\"), target_top.replace("/", "\\"))
    if target_top == ".claude":
        normalized = normalized.replace("AGENTS.md", "CLAUDE.md")
    return normalized


def compare_mirror_tree(source: str, target: str, pattern: str, *, transform: bool = False, exclude: set[str] | None = None) -> None:
    exclude = exclude or set()
    source_root = ROOT / source
    target_root = ROOT / target
    if not source_root.is_dir():
        fail(f"missing source tree: {source}")
    if not target_root.is_dir():
        fail(f"missing adapter tree: {target}")

    for source_file in sorted(source_root.rglob(pattern)):
        if not source_file.is_file():
            continue
        relative = source_file.relative_to(source_root)
        if relative.as_posix() in exclude:
            continue
        target_file = target_root / relative
        if not target_file.is_file():
            fail(f"adapter missing mapped file: {rel(target_file)} from {rel(source_file)}")

        source_text = source_file.read_text(encoding="utf-8")
        target_text = target_file.read_text(encoding="utf-8")
        expected = normalize_adapter_text(source_text, source, target) if transform else source_text
        if target_text != expected:
            fail(f"adapter file diverged from mapped source: {rel(target_file)}")

    for target_file in sorted(target_root.rglob(pattern)):
        if not target_file.is_file():
            continue
        relative = target_file.relative_to(target_root)
        if relative.as_posix() in exclude:
            continue
        source_file = source_root / relative
        if not source_file.is_file():
            fail(f"adapter file has no canonical source: {rel(target_file)}")


def parse_frontmatter_name(path: Path) -> str:
    text = path.read_text(encoding="utf-8")
    match = re.search(r"^---\s*\n(.*?)\n---", text, flags=re.DOTALL)
    if not match:
        fail(f"missing YAML frontmatter: {rel(path)}")
    name = re.search(r"^name:\s*([A-Za-z0-9_-]+)\s*$", match.group(1), flags=re.MULTILINE)
    if not name:
        fail(f"frontmatter missing name: {rel(path)}")
    return name.group(1)


def validate_claude_skills() -> None:
    source_root = ROOT / ".agents" / "skills"
    target_root = ROOT / ".claude" / "skills"
    source_ids = {p.name for p in source_root.iterdir() if p.is_dir()}
    target_ids = {p.name for p in target_root.iterdir() if p.is_dir()}
    if source_ids != target_ids:
        fail(f"Claude skill adapter mismatch: missing={sorted(source_ids - target_ids)} extra={sorted(target_ids - source_ids)}")

    for skill_id in sorted(source_ids):
        source_skill = source_root / skill_id / "SKILL.md"
        target_skill = target_root / skill_id / "SKILL.md"
        if not source_skill.is_file() or not target_skill.is_file():
            fail(f"skill missing SKILL.md in canonical or Claude adapter: {skill_id}")
        if parse_frontmatter_name(source_skill) != parse_frontmatter_name(target_skill):
            fail(f"Claude skill frontmatter name differs from canonical: {skill_id}")


def validate_codex_agents() -> None:
    source_root = ROOT / ".agents" / "agents"
    target_root = ROOT / ".codex" / "agents"
    source_ids = {p.stem for p in source_root.glob("*.md")}
    target_ids = {p.stem for p in target_root.glob("*.toml")}
    if source_ids != target_ids:
        fail(f"Codex agent adapter mismatch: missing={sorted(source_ids - target_ids)} extra={sorted(target_ids - source_ids)}")

    for path in sorted(target_root.glob("*.toml")):
        text = path.read_text(encoding="utf-8")
        match = re.search(r'^name\s*=\s*"([^"]+)"\s*$', text, flags=re.MULTILINE)
        if not match:
            fail(f"Codex agent missing name field: {rel(path)}")
        if match.group(1) != path.stem:
            fail(f"Codex agent name does not match filename: {rel(path)}")
        if "developer_instructions" not in text:
            fail(f"Codex agent missing developer_instructions: {rel(path)}")


def validate_adapter_manifest() -> None:
    manifest = load_json(".agents/adapter-manifest.json")
    if manifest.get("schema_version") != 1:
        fail(".agents/adapter-manifest.json schema_version must be 1")

    for path in manifest.get("canonical", {}).values():
        full = ROOT / path
        if not full.exists():
            fail(f"adapter manifest references missing canonical path: {path}")

    adapters = manifest.get("adapters")
    if not isinstance(adapters, dict):
        fail("adapter manifest missing adapters object")

    for adapter_name, adapter in adapters.items():
        root = adapter.get("root")
        if not root or not (ROOT / root).exists():
            fail(f"adapter manifest references missing root for {adapter_name}: {root}")
        docs = adapter.get("docs")
        if docs and not (ROOT / docs).is_file():
            fail(f"adapter manifest references missing docs for {adapter_name}: {docs}")
        coverage = adapter.get("coverage")
        if not isinstance(coverage, dict) or not coverage:
            fail(f"adapter manifest missing coverage for {adapter_name}")
        for item_name, item in coverage.items():
            for key in ("path", "source", "mode"):
                if key not in item:
                    fail(f"adapter manifest {adapter_name}.{item_name} missing {key}")
            if not (ROOT / item["path"]).exists():
                fail(f"adapter manifest {adapter_name}.{item_name} path missing: {item['path']}")
            if not (ROOT / item["source"]).exists():
                fail(f"adapter manifest {adapter_name}.{item_name} source missing: {item['source']}")

    plugin = manifest.get("plugin_packaging", {})
    if plugin.get("status") != "not-packaged":
        fail("plugin_packaging.status must be not-packaged until a real plugin manifest exists")


def validate_adapter_mapping() -> None:
    validate_adapter_manifest()
    compare_mirror_tree(".agents/agents", ".claude/agents", "*.md", transform=True)
    compare_mirror_tree(".agents/rules", ".claude/rules", "*.md")
    compare_mirror_tree(".agents/hooks", ".claude/hooks", "*.sh", transform=True)
    compare_mirror_tree(".agents/hooks", ".codex/hooks", "*.sh", transform=True, exclude={"notify.sh"})
    validate_claude_skills()
    validate_codex_agents()


def validate_shell_syntax() -> None:
    probe = subprocess.run(["bash", "-n", "--version"], cwd=ROOT, text=True, capture_output=True)
    if probe.returncode != 0:
        detail = (probe.stderr or probe.stdout or "").strip().replace("\x00", "")
        warn(f"bash is unavailable or unusable; skipping shell syntax checks locally. Detail: {detail or 'no output'}")
        return

    scripts = sorted((ROOT / ".agents" / "hooks").glob("*.sh"))
    scripts += sorted((ROOT / ".claude" / "hooks").glob("*.sh"))
    scripts += sorted((ROOT / ".codex" / "hooks").glob("*.sh"))
    scripts.append(ROOT / ".claude" / "statusline.sh")

    for script in scripts:
        script_rel = rel(script)
        result = subprocess.run(["bash", "-n", script_rel], cwd=ROOT, text=True, capture_output=True)
        if result.returncode != 0:
            detail = (result.stderr or result.stdout or "").strip().replace("\x00", "")
            fail(f"bash syntax failed for {script_rel}: {detail or 'no output'}")


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
        "README.md": [
            ".agents/adapter-manifest.json",
            "Codex plugin packaging",
            "project-local framework",
            "canonical vs adapter-specific",
        ],
        "docs/HARNESS-COMPATIBILITY.md": [
            ".agents/hooks.json",
            "OpenCode-style tool",
            "provider-gateway-example.yaml",
            "ANTHROPIC_CUSTOM_MODEL_OPTION",
            "OPENAI_BASE_URL",
            "docs/CODEX_ADAPTER.md",
            "docs/CLAUDE_ADAPTER.md",
            "docs/PLUGIN_PACKAGING.md",
        ],
        "docs/CODEX_ADAPTER.md": [".codex/hooks.json", ".agents/skills/", ".codex-plugin/plugin.json"],
        "docs/CLAUDE_ADAPTER.md": [".claude/settings.json", ".agents/skills/", ".agents/adapter-manifest.json"],
        "docs/PLUGIN_PACKAGING.md": [".codex-plugin/plugin.json", "not currently packaged"],
        ".codex/README.md": [".agents/", "docs/CODEX_ADAPTER.md"],
        ".claude/README.md": [".agents/", "docs/CLAUDE_ADAPTER.md"],
        ".agents/docs/hooks-reference.md": [".agents/hooks.json", "notify.sh"],
        ".agents/docs/setup-requirements.md": ["provider-gateway-example.yaml", "OpenCode-style tools"],
        ".claude/docs/setup-requirements.md": ["provider-gateway-example.yaml", "OpenCode-style tools"],
        "CONTRIBUTING.md": [".agents/adapter-manifest.json", "validate-compatibility.py"],
    }

    for path, fragments in required.items():
        text = read_text(path)
        for fragment in fragments:
            if fragment not in text:
                fail(f"{path} missing required text: {fragment}")

    optional_repo_docs = {
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
    validate_readme_counts()
    validate_hook_registry()
    validate_adapter_mapping()
    validate_shell_syntax()
    validate_gateway_examples()
    validate_docs()
    print("compatibility validation ok")


if __name__ == "__main__":
    main()
