#!/usr/bin/env bash
# Install the optional GameStudio Launcher companion from its separate repo.
# The launcher is intentionally not vendored into GameStudio: it owns provider
# profiles, bridge code, harness launch behavior, and its own security review.

set -euo pipefail

REPO_URL="${GAMESTUDIO_LAUNCHER_REPO:-https://github.com/bullish0x/gamestudio-launcher.git}"
REPO_SLUG="${GAMESTUDIO_LAUNCHER_REPO_SLUG:-bullish0x/gamestudio-launcher}"
INSTALL_DIR="${GAMESTUDIO_LAUNCHER_DIR:-$HOME/.gamestudio/launcher/source}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
GAMESTUDIO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SIBLING_LAUNCHER="$(cd "$GAMESTUDIO_ROOT/.." && pwd)/gamestudio-launcher"

if ! command -v git >/dev/null 2>&1; then
  echo "git is required to install GameStudio Launcher" >&2
  exit 1
fi

if command -v pipx >/dev/null 2>&1; then
  echo "Installing GameStudio Launcher with pipx from $REPO_URL"
  pipx install --force "git+$REPO_URL"
  echo "Installed. Run: gamestudio-launch init-defaults --workspace \"$PWD\""
  echo "If gamestudio-launch is not on PATH, run: python -m gamestudio_launcher.cli init-defaults --workspace \"$PWD\""
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
  echo "Using local sibling GameStudio Launcher source at $SIBLING_LAUNCHER"
  INSTALL_SOURCE="$SIBLING_LAUNCHER"
elif [ -d "$INSTALL_DIR/.git" ]; then
  echo "Updating GameStudio Launcher in $INSTALL_DIR"
  git -C "$INSTALL_DIR" pull --ff-only
else
  echo "Cloning GameStudio Launcher into $INSTALL_DIR"
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

echo "Installed. Run: gamestudio-launch init-defaults --workspace \"$PWD\""
echo "If gamestudio-launch is not on PATH, run: $PYTHON_CMD -m gamestudio_launcher.cli init-defaults --workspace \"$PWD\""
