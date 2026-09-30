#!/usr/bin/env bash
#
# Post a fresh PR comment — a new comment notifies, an edited one does not — for
# something a person asked for: a Q&A answer, a "did not run" note.
#
# Usage: post-comment.sh /path/to/body.md
# Env:   REPO (owner/name), PR_NUMBER, GH_TOKEN
set -euo pipefail

# shellcheck source=.github/scripts/review/lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

body_file="$1"

if ! has_text "$body_file"; then
  echo "::error::Nothing to post at '$body_file' (missing, empty or blank)."
  exit 1
fi
make_postable "$body_file"

# REST, not `gh pr comment` — the GraphQL path fails transiently more often.
gh_retry gh api "repos/${REPO}/issues/${PR_NUMBER}/comments" -F body=@"$body_file" >/dev/null
echo "Posted comment."
