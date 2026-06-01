#!/usr/bin/env bash
# Install the optional GameStudio Launcher companion from its separate repo.
# The launcher is intentionally not vendored into GameStudio: it owns provider
# profiles, bridge code, harness launch behavior, and its own security review.

set -euo pipefail

REPO_URL="${GAMESTUDIO_LAUNCHER_REPO:-https://github.com/bullish0x/gamestudio-launcher.git}"
INSTALL_DIR="${GAMESTUDIO_LAUNCHER_DIR:-$HOME/.gamestudio/launcher/source}"

if ! command -v git >/dev/null 2>&1; then
  echo "git is required to install GameStudio Launcher" >&2
  exit 1
fi

if command -v pipx >/dev/null 2>&1; then
  echo "Installing GameStudio Launcher with pipx from $REPO_URL"
  pipx install --force "git+$REPO_URL"
  echo "Installed. Run: gamestudio-launch init-defaults --workspace \"$PWD\""
  exit 0
fi

if ! command -v python >/dev/null 2>&1; then
  echo "python is required when pipx is unavailable" >&2
  exit 1
fi

if [ -d "$INSTALL_DIR/.git" ]; then
  echo "Updating GameStudio Launcher in $INSTALL_DIR"
  git -C "$INSTALL_DIR" pull --ff-only
else
  echo "Cloning GameStudio Launcher into $INSTALL_DIR"
  mkdir -p "$(dirname "$INSTALL_DIR")"
  git clone "$REPO_URL" "$INSTALL_DIR"
fi

python -m pip install -e "$INSTALL_DIR"

echo "Installed. Run: gamestudio-launch init-defaults --workspace \"$PWD\""
