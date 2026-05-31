#!/usr/bin/env bash
#
# GameStudio installer — safe install / update / uninstall for new OR existing
# projects. It only ever touches the GameStudio "studio brain" (agents, skills,
# hooks, rules, harness adapters, studio docs, engine-reference, the testing
# framework) and tracks every file it writes in a manifest. Your source code,
# your design docs, your settings.json, CLAUDE.md, and AGENTS.md are never
# clobbered.
#
# Usage (run from the cloned gamestudio repo):
#   bash install.sh install   [target-dir]   # default target: current dir
#   bash install.sh update    [target-dir]
#   bash install.sh uninstall [target-dir]
#   bash install.sh status    [target-dir]
#
set -euo pipefail

CMD="${1:-help}"
SRC="$(cd "$(dirname "$0")" && pwd)"
TARGET="${2:-$PWD}"
TARGET="$(cd "$TARGET" && pwd)"
GS_DIR="$TARGET/.claude/.gamestudio"
MANIFEST="$GS_DIR/manifest.tsv"          # relpath<TAB>sha256
VERSION_FILE="$GS_DIR/version.txt"

# Tooling the installer OWNS (tracked: installed, updated, removed).
TOOLING_PATHS=(
  ".claude/agents" ".claude/skills" ".claude/hooks" ".claude/rules"
  ".claude/docs" ".claude/agent-memory" ".claude/statusline.sh"
  ".agents" ".codex" ".cursor"
  "docs/engine-reference" "docs/HARNESS-COMPATIBILITY.md"
  "GameStudio Skill Testing Framework"
)
# Handled specially — never overwritten (a side-file is written for you to merge).
SPECIAL_PATHS=( ".claude/settings.json" "CLAUDE.md" "AGENTS.md" )

c_red=$'\033[31m'; c_grn=$'\033[32m'; c_yel=$'\033[33m'; c_dim=$'\033[2m'; c_off=$'\033[0m'
info(){ printf '%s\n' "$*"; }
ok(){ printf '%s%s%s\n' "$c_grn" "$*" "$c_off"; }
warn(){ printf '%s%s%s\n' "$c_yel" "$*" "$c_off"; }
err(){ printf '%s%s%s\n' "$c_red" "$*" "$c_off" >&2; }

sha(){ if command -v sha256sum >/dev/null 2>&1; then sha256sum "$1" | awk '{print $1}';
       else shasum -a 256 "$1" | awk '{print $1}'; fi; }

# emit every tracked source file as a relative path (NUL-delimited)
src_files(){
  local p
  for p in "${TOOLING_PATHS[@]}"; do
    [ -e "$SRC/$p" ] || continue
    if [ -d "$SRC/$p" ]; then
      find "$SRC/$p" -type f -print0
    else
      printf '%s\0' "$SRC/$p"
    fi
  done
}
manifest_has(){ grep -qF -- "$1"$'\t' "$MANIFEST" 2>/dev/null; }
manifest_sha(){ awk -F'\t' -v p="$1" '$1==p{print $2; exit}' "$MANIFEST" 2>/dev/null; }

guard(){
  if [ "$SRC" = "$TARGET" ]; then err "Target is the GameStudio repo itself — pick a project dir."; exit 1; fi
}

do_install(){ # also used by update (mode=update)
  local mode="${1:-install}"
  guard
  mkdir -p "$GS_DIR"; : > "$MANIFEST.new"
  local added=0 updated=0 skipped=0 usermod=0
  while IFS= read -r -d '' f; do
    local rel; rel="${f#$SRC/}"
    local tgt="$TARGET/$rel"
    local s; s="$(sha "$f")"
    if [ -e "$tgt" ]; then
      local cur; cur="$(sha "$tgt")"
      if [ "$cur" = "$s" ]; then printf '%s\t%s\n' "$rel" "$s" >> "$MANIFEST.new"; continue; fi
      if manifest_has "$rel"; then
        if [ "$(manifest_sha "$rel")" = "$cur" ]; then
          mkdir -p "$(dirname "$tgt")"; cp "$f" "$tgt"; printf '%s\t%s\n' "$rel" "$s" >> "$MANIFEST.new"; updated=$((updated+1))
        else
          cp "$f" "$tgt.gamestudio-new"; printf '%s\t%s\n' "$rel" "$(manifest_sha "$rel")" >> "$MANIFEST.new"
          warn "  kept your edited $rel  (new version: $rel.gamestudio-new)"; usermod=$((usermod+1))
        fi
      else
        cp "$f" "$tgt.gamestudio-new"
        warn "  exists & not ours: $rel  (studio copy: $rel.gamestudio-new)"; skipped=$((skipped+1))
      fi
    else
      mkdir -p "$(dirname "$tgt")"; cp "$f" "$tgt"; printf '%s\t%s\n' "$rel" "$s" >> "$MANIFEST.new"; added=$((added+1))
    fi
  done < <(src_files)

  # files removed upstream since last install: drop ours that are gone from SRC
  if [ "$mode" = "update" ] && [ -f "$MANIFEST" ]; then
    while IFS=$'\t' read -r rel oldsha; do
      [ -e "$SRC/$rel" ] && continue
      local tgt="$TARGET/$rel"
      if [ -f "$tgt" ] && [ "$(sha "$tgt")" = "$oldsha" ]; then rm -f "$tgt"; info "  removed (upstream-deleted) $rel"; fi
    done < "$MANIFEST"
  fi
  mv "$MANIFEST.new" "$MANIFEST"

  # special files — never clobber
  local sp
  for sp in "${SPECIAL_PATHS[@]}"; do
    [ -e "$SRC/$sp" ] || continue
    if [ ! -e "$TARGET/$sp" ]; then
      mkdir -p "$(dirname "$TARGET/$sp")"; cp "$SRC/$sp" "$TARGET/$sp"; ok "  installed $sp"
    elif [ "$(sha "$SRC/$sp")" != "$(sha "$TARGET/$sp")" ]; then
      cp "$SRC/$sp" "$TARGET/$sp.gamestudio"; warn "  kept your $sp  (studio copy: $sp.gamestudio — merge hooks/permissions by hand)"
    fi
  done

  ( git -C "$SRC" rev-parse --short HEAD 2>/dev/null || echo "unknown" ) > "$VERSION_FILE"
  ok "$mode complete: +$added new, ~$updated updated, $usermod kept-edited, $skipped conflicts. Source: $(cat "$VERSION_FILE")"
  [ $((usermod+skipped)) -gt 0 ] && warn "Review the .gamestudio-new / .gamestudio side-files above; nothing of yours was overwritten."
  info "${c_dim}Tracked files: $(wc -l < "$MANIFEST" | tr -d ' ') · manifest: ${MANIFEST#$TARGET/}${c_off}"
}

do_uninstall(){
  guard
  [ -f "$MANIFEST" ] || { err "No manifest at $MANIFEST — nothing tracked to uninstall."; exit 1; }
  local removed=0 kept=0
  while IFS=$'\t' read -r rel recsha; do
    local tgt="$TARGET/$rel"
    [ -e "$tgt" ] || continue
    if [ "$(sha "$tgt")" = "$recsha" ]; then rm -f "$tgt"; removed=$((removed+1))
    else warn "  kept your edited $rel"; kept=$((kept+1)); fi
  done < "$MANIFEST"
  # prune now-empty dirs we may have created (never removes dirs with user files)
  local p
  for p in "${TOOLING_PATHS[@]}"; do
    [ -d "$TARGET/$p" ] && find "$TARGET/$p" -type d -empty -delete 2>/dev/null || true
  done
  rm -rf "$GS_DIR"
  ok "uninstalled: removed $removed studio files, kept $kept you had edited."
  warn "Left untouched: your settings.json, CLAUDE.md, AGENTS.md, and all project content (design/ docs/ production/ src/). Remove *.gamestudio side-files manually if you don't want them."
}

do_status(){
  if [ -f "$MANIFEST" ]; then
    ok "GameStudio installed in $TARGET"
    info "  source version: $(cat "$VERSION_FILE" 2>/dev/null || echo unknown)"
    info "  tracked files:  $(wc -l < "$MANIFEST" | tr -d ' ')"
  else
    warn "GameStudio not installed in $TARGET (no manifest)."
  fi
}

case "$CMD" in
  install)   info "Installing GameStudio into $TARGET ..."; do_install install ;;
  update)    info "Updating GameStudio in $TARGET ..."; do_install update ;;
  uninstall) info "Uninstalling GameStudio from $TARGET ..."; do_uninstall ;;
  status)    do_status ;;
  *) cat <<EOF
GameStudio installer — safe, manifest-tracked.

  bash install.sh install   [target]   Install the studio brain (default: current dir)
  bash install.sh update    [target]   Update tracked files (keeps your edits; writes *.gamestudio-new for changed ones)
  bash install.sh uninstall [target]   Remove only what we installed (keeps your edits + all project content)
  bash install.sh status    [target]   Show install state

Never overwrites your settings.json, CLAUDE.md, AGENTS.md, source, or design docs. Run from the cloned gamestudio repo.
EOF
  ;;
esac
