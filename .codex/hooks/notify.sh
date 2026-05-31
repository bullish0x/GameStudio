#!/usr/bin/env bash
# Notification hook - fires when the active harness sends a notification
# Shows a Windows toast via PowerShell

# Read notification JSON from stdin
INPUT=$(cat)

# Extract message — try jq first, fall back to grep
if command -v jq &>/dev/null; then
  MESSAGE=$(echo "$INPUT" | jq -r '.message // empty' 2>/dev/null)
fi
if [ -z "$MESSAGE" ]; then
  MESSAGE=$(echo "$INPUT" | grep -oE '"message"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/"message"[[:space:]]*:[[:space:]]*"//;s/"$//')
fi
if [ -z "$MESSAGE" ]; then
  MESSAGE="GameStudio agent needs your attention"
fi

# Sanitize message for PowerShell string embedding (escape single quotes)
MESSAGE_SAFE=$(echo "$MESSAGE" | sed "s/'/''/g" | head -c 200)

# Show Windows balloon tip notification (works on all Windows 10/11 without extra modules)
powershell.exe -NonInteractive -WindowStyle Hidden -Command "
  Add-Type -AssemblyName System.Windows.Forms
  \$notify = New-Object System.Windows.Forms.NotifyIcon
  \$notify.Icon = [System.Drawing.SystemIcons]::Information
  \$notify.BalloonTipTitle = 'GameStudio'
  \$notify.BalloonTipText = '$MESSAGE_SAFE'
  \$notify.Visible = \$true
  \$notify.ShowBalloonTip(5000)
  Start-Sleep -Seconds 6
  \$notify.Dispose()
" 2>/dev/null &

echo "Notification: $MESSAGE_SAFE"
