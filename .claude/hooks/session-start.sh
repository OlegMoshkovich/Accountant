#!/bin/bash
set -euo pipefail

# Install Node dependencies so tests, linters and builds work in the session.
# Runs on Claude Code on the web; skipped locally where deps are already set up.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# npm install (not ci) so the cached container layer is reused across sessions.
npm install --no-audit --no-fund
