#!/usr/bin/env bash
# run-demo.sh — OpenCode CLI Demo Script
# Usage:
#   ./run-demo.sh           — mocked mode (no opencode needed)
#   ./run-demo.sh --live    — live mode (requires opencode installed)

set -euo pipefail

LIVE=false
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MOCK_DIR="$SCRIPT_DIR/mock-responses"
REPO_DIR="$SCRIPT_DIR/sample-repo"

# Parse flags
for arg in "$@"; do
  case $arg in
    --live) LIVE=true ;;
  esac
done

# ─── Helpers ────────────────────────────────────────────────────────────────
header() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  $1"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
}

pause() {
  echo ""
  echo "[Press Enter to continue...]"
  read -r
}

# ─── Step 1: Show the bug ────────────────────────────────────────────────────
header "STEP 1 — The Code Under Review"
echo "We have a simple TypeScript calculator in sample-repo/src/calculator.ts"
echo ""
echo "Let's look at the suspicious function:"
echo ""
cat "$REPO_DIR/src/calculator.ts" | grep -A5 "divide"
echo ""
echo "Spotted it? The divide() function multiplies instead of divides."
echo "Now let's see what OpenCode makes of this."
pause

# ─── Step 2: OpenCode plan output ────────────────────────────────────────────
header "STEP 2 — OpenCode Analyses the Code"

if [ "$LIVE" = true ]; then
  echo "Running: opencode run --plan 'Find and fix any bugs in src/calculator.ts'"
  echo ""
  cd "$SCRIPT_DIR"
  opencode run --plan "Find and fix any bugs in src/calculator.ts"
else
  echo "[MOCK MODE] Showing pre-recorded OpenCode plan output:"
  echo ""
  cat "$MOCK_DIR/plan-output.txt"
fi

pause

# ─── Step 3: Show the agent answer ───────────────────────────────────────────
header "STEP 3 — Asking OpenCode What the Code Does"

if [ "$LIVE" = true ]; then
  echo "Running: opencode run 'What does src/calculator.ts do? Any issues?'"
  echo ""
  cd "$SCRIPT_DIR"
  opencode run "What does src/calculator.ts do? Any issues?"
else
  echo "[MOCK MODE] Showing pre-recorded agent answer:"
  echo ""
  cat "$MOCK_DIR/agent-answer.txt"
fi

pause

# ─── Step 4: Apply the fix ───────────────────────────────────────────────────
header "STEP 4 — Applying the Fix"

if [ "$LIVE" = true ]; then
  echo "Running: opencode run 'Fix the bug in divide() — it should divide, not multiply'"
  echo ""
  cd "$SCRIPT_DIR"
  opencode run "Fix the bug in divide() — it should divide, not multiply"
else
  echo "[MOCK MODE] Demonstrating what the fix looks like..."
  echo ""
  echo "BEFORE:"
  echo "  export function divide(a: number, b: number): number {"
  echo "    return a * b;  // BUG"
  echo "  }"
  echo ""
  echo "AFTER (agent would apply):"
  echo "  export function divide(a: number, b: number): number {"
  echo "    return a / b;"
  echo "  }"
fi

echo ""
header "DEMO COMPLETE"
echo "Key takeaways:"
echo "  1. OpenCode found the bug without being told exactly where it was"
echo "  2. Plan mode shows intent before making changes"
echo "  3. Permissions in opencode.json gate what the agent can touch"
echo "  4. Works offline with mock-responses/ for reliable demos"
echo ""
