#!/usr/bin/env bash
# Install the optional Agent Harness Launcher companion from its separate repo.
# The launcher is intentionally not vendored into GameStudio: it owns provider
# profiles, bridge code, harness launch behavior, and its own security review.

set -euo pipefail

REPO_URL="${AGENT_HARNESS_LAUNCHER_REPO:-https://github.com/bullish0x/agent-harness-launcher.git}"
REPO_SLUG="${AGENT_HARNESS_LAUNCHER_REPO_SLUG:-bullish0x/agent-harness-launcher}"
INSTALL_DIR="${AGENT_HARNESS_LAUNCHER_DIR:-$HOME/.agent-harness-launcher/source}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
GAMESTUDIO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SIBLING_LAUNCHER="$(cd "$GAMESTUDIO_ROOT/.." && pwd)/agent-harness-launcher"

if ! command -v git >/dev/null 2>&1; then
  echo "git is required to install Agent Harness Launcher" >&2
  exit 1
fi

if command -v pipx >/dev/null 2>&1; then
  echo "Installing Agent Harness Launcher with pipx from $REPO_URL"
  pipx install --force "git+$REPO_URL"
  echo "Installed. Run: agent-launch init-defaults --workspace \"$PWD\""
  echo "If agent-launch is not on PATH, run: python -m agent_harness_launcher.cli init-defaults --workspace \"$PWD\""
  exit 0
fi

PYTHON_CMD=""
for candidate in python python3 python.exe py py.exe; do
  if command -v "$candidate" >/dev/null 2>&1 && "$candidate" -m pip --version >/dev/null 2>&1; then
    PYTHON_CMD="$candidate"
    break
  fi
done

if [ -z "$PYTHON_CMD" ]; then
  echo "python with pip support is required when pipx is unavailable" >&2
  exit 1
fi

INSTALL_SOURCE="$INSTALL_DIR"
if [ -d "$SIBLING_LAUNCHER/.git" ]; then
  echo "Using local sibling Agent Harness Launcher source at $SIBLING_LAUNCHER"
  INSTALL_SOURCE="$SIBLING_LAUNCHER"
elif [ -d "$INSTALL_DIR/.git" ]; then
  echo "Updating Agent Harness Launcher in $INSTALL_DIR"
  git -C "$INSTALL_DIR" pull --ff-only
else
  echo "Cloning Agent Harness Launcher into $INSTALL_DIR"
  mkdir -p "$(dirname "$INSTALL_DIR")"
  if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
    gh repo clone "$REPO_SLUG" "$INSTALL_DIR"
  else
    git clone "$REPO_URL" "$INSTALL_DIR"
  fi
fi

PIP_SOURCE="$INSTALL_SOURCE"
case "$PYTHON_CMD" in
  *.exe)
    if command -v wslpath >/dev/null 2>&1; then
      PIP_SOURCE="$(wslpath -w "$INSTALL_SOURCE")"
    fi
    ;;
esac

"$PYTHON_CMD" -m pip install -e "$PIP_SOURCE"

echo "Installed. Run: agent-launch init-defaults --workspace \"$PWD\""
echo "If agent-launch is not on PATH, run: $PYTHON_CMD -m agent_harness_launcher.cli init-defaults --workspace \"$PWD\""
