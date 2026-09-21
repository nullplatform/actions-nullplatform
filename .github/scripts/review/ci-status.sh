#!/usr/bin/env bash
# Summarizes the CI workflow ("CI") job conclusions for the PR head SHA and
# writes a one-line `summary` to $GITHUB_OUTPUT for the auto-review prompt.
# Requires: GH_TOKEN, PR_NUMBER env vars.
set -euo pipefail

# Capture before summarizing: `gh pr checks` exits non-zero while checks are
# pending (8) or when none are reported, and under pipefail a `|| fallback` on
# the pipeline would concatenate with what node already printed, not replace it.
RAW=$(gh pr checks "$PR_NUMBER" --json name,state,bucket 2>/dev/null) || true

# The node program is intentionally single-quoted: it is source for node, not shell.
# shellcheck disable=SC2016
SUMMARY=$(printf '%s' "$RAW" | node -e '
  let raw = "";
  process.stdin.on("data", (d) => (raw += d));
  process.stdin.on("end", () => {
    let checks = [];
    try { checks = JSON.parse(raw); } catch { checks = []; }
    if (!checks.length) { process.stdout.write("no CI checks reported yet"); return; }
    const parts = checks.map((c) => `${c.name}:${c.bucket || c.state}`);
    process.stdout.write(parts.join(", "));
  });
')

echo "summary=${SUMMARY}" >> "$GITHUB_OUTPUT"
