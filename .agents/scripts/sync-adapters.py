#!/usr/bin/env python3
"""Synchronize generated GameStudio adapter files from .agents/.

By default this runs in check mode and exits non-zero when generated adapter
files would change. Pass --write to update the governed adapter files.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8", newline="\n")


def fail(message: str) -> None:
    print(f"FAIL: {message}", file=sys.stderr)
    raise SystemExit(1)


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def transform_claude_text(text: str) -> str:
    return (
        text.replace(".agents", ".claude")
        .replace(".agents".replace("/", "\\"), ".claude".replace("/", "\\"))
        .replace("AGENTS.md", "CLAUDE.md")
    )


def transform_claude_hook(text: str) -> str:
    return (
        text.replace("Provider-neutral harness", "Claude Code")
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


def transform_codex_hook(text: str) -> str:
    return (
        text.replace("Provider-neutral harness", "Codex-compatible harness")
        .replace("provider-neutral hook reference", "Codex-compatible harness hooks reference")
        .replace(
            "inside .agents/skills/ or an adapter skill tree",
            "inside .codex/skills/, .claude/skills/, or .agents/skills/",
        )
    )


def parse_frontmatter(path: Path) -> tuple[dict[str, str], str]:
    text = read(path)
    match = re.match(r"^---\n(.*?)\n---\n?(.*)$", text, flags=re.DOTALL)
    if not match:
        fail(f"missing frontmatter: {rel(path)}")
    fields: dict[str, str] = {}
    lines = match.group(1).splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        if ":" not in line:
            i += 1
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        value = value.strip()
        if value in {">", ">-", "|", "|-"}:
            collected: list[str] = []
            i += 1
            while i < len(lines) and (lines[i].startswith(" ") or not lines[i].strip()):
                collected.append(lines[i].strip())
                i += 1
            fields[key] = " ".join(part for part in collected if part).strip()
            continue
        fields[key] = value.strip().strip('"').replace('\\"', '"')
        i += 1
    return fields, match.group(2).lstrip("\n")


def toml_string(value: str) -> str:
    if '"' in value and "'" not in value:
        return "'" + value + "'"
    return '"' + value.replace("\\", "\\\\").replace('"', '\\"') + '"'


def toml_multiline(value: str) -> str:
    lines = value.replace('"""', '\\"\\"\\"').rstrip().splitlines()
    return '"""\n' + "\\r\n".join(lines) + '"""'


def codex_agent_toml(source: Path) -> str:
    fields, body = parse_frontmatter(source)
    name = fields.get("name") or source.stem
    description = fields.get("description", "")
    return (
        f"name = {toml_string(name)}\n"
        f"description = {toml_string(description)}\n"
        f"developer_instructions = {toml_multiline(body)}\n"
    )


def expected_files() -> dict[Path, str]:
    files: dict[Path, str] = {}

    for source in sorted((ROOT / ".agents" / "agents").glob("*.md")):
        files[ROOT / ".claude" / "agents" / source.name] = transform_claude_text(read(source))
        files[ROOT / ".codex" / "agents" / f"{source.stem}.toml"] = codex_agent_toml(source)

    for source in sorted((ROOT / ".agents" / "rules").glob("*.md")):
        files[ROOT / ".claude" / "rules" / source.name] = read(source)

    for source in sorted((ROOT / ".agents" / "hooks").glob("*.sh")):
        files[ROOT / ".claude" / "hooks" / source.name] = transform_claude_hook(read(source))
        if source.name != "notify.sh":
            files[ROOT / ".codex" / "hooks" / source.name] = transform_codex_hook(read(source))

    return files


def main() -> None:
    parser = argparse.ArgumentParser(description="Check or write generated GameStudio adapter files.")
    parser.add_argument("--write", action="store_true", help="update generated adapter files")
    args = parser.parse_args()

    changed: list[Path] = []
    for path, expected in expected_files().items():
        current = read(path) if path.exists() else ""
        if current != expected:
            changed.append(path)
            if args.write:
                write(path, expected)

    if changed and not args.write:
        for path in changed:
            print(f"would update {rel(path)}", file=sys.stderr)
        fail(f"{len(changed)} adapter file(s) are out of sync; run python .agents/scripts/sync-adapters.py --write")

    if changed:
        print(f"updated {len(changed)} adapter file(s)")
    else:
        print("adapter sync ok")


if __name__ == "__main__":
    main()
