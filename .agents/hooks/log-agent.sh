#!/bin/bash
# Provider-neutral harness SubagentStart hook: Log agent invocations for audit trail
# Tracks which agents are being used and when
#
# Input schema (SubagentStart) — per provider-neutral hook reference:
# { "session_id": "...", "agent_id": "agent-abc123", "agent_type": "Explore", ... }
#
# The agent name lives in `agent_type`. We also read `agent_name` as a fallback
# so the audit trail stays correct if the payload field is ever renamed.

INPUT=$(cat)

# Parse agent name -- use jq if available, fall back to grep
if command -v jq >/dev/null 2>&1; then
    AGENT_NAME=$(echo "$INPUT" | jq -r '.agent_type // .agent_name // "unknown"' 2>/dev/null)
else
    AGENT_NAME=$(echo "$INPUT" | grep -oE '"(agent_type|agent_name)"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/"[^"]*"[[:space:]]*:[[:space:]]*"//;s/"$//')
    [ -z "$AGENT_NAME" ] && AGENT_NAME="unknown"
fi

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SESSION_LOG_DIR="production/session-logs"

mkdir -p "$SESSION_LOG_DIR" 2>/dev/null

echo "$TIMESTAMP | Agent invoked: $AGENT_NAME" >> "$SESSION_LOG_DIR/agent-audit.log" 2>/dev/null

exit 0
