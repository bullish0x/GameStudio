#!/usr/bin/env bash
# SessionStart hook: if the session is on a likely large-context model variant,
# inject a one-time advisory so the active harness can flag it to the user.
# Context-heavy skills (/reverse-document, /adopt, /review-all-gdds) should be
# scoped deliberately when the active model has billing or context constraints.
#
# Only SessionStart hooks receive the `model` field, so this fires once per
# session in harnesses that provide it. Fails silently if jq is absent.

input=$(cat 2>/dev/null)

model=""
if command -v jq >/dev/null 2>&1; then
  model=$(printf '%s' "$input" | jq -r '.model // empty' 2>/dev/null)
else
  model=$(printf '%s' "$input" \
    | grep -oE '"model"[[:space:]]*:[[:space:]]*"[^"]*"' \
    | head -1 \
    | sed -E 's/.*:[[:space:]]*"([^"]*)".*/\1/')
fi

case "$model" in
  *"[1m]"*|*-1m|*1m]*)
    msg="HEADS-UP FOR THE USER: this session appears to be on a large-context model (${model}). Context-heavy GameStudio skills like /reverse-document, /adopt, and /review-all-gdds can consume substantial context and may hit harness billing, quota, or context limits. If that happens, use the active harness model/provider settings or gateway configuration to choose a smaller-context model, enable the required quota, or scope the skill to one subsystem. Surface this once at the start of the session."
    # msg contains no double-quotes or newlines, so direct JSON embedding is safe.
    printf '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"%s"}}\n' "$msg"
    ;;
  *)
    : # standard context (or unknown) — stay silent
    ;;
esac

exit 0
