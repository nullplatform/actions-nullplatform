#!/usr/bin/env bash
#
# Delete this workflow's own comments that carry a marker — e.g. a "did not
# run" note once a later run has posted the real review.
#
# Usage: delete-comments.sh '<!-- marker -->'
# Env:   REPO (owner/name), PR_NUMBER, GH_TOKEN
set -euo pipefail

# shellcheck source=.github/scripts/review/lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

marker="$1"

# Only the bot's own comments: a human quote-reply carries the marker too.
mapfile -t ids < <(gh_retry gh api "repos/${REPO}/issues/${PR_NUMBER}/comments?per_page=100" \
  --jq ".[] | select(.user.login == \"github-actions[bot]\") | select(.body | contains(\"${marker}\")) | .id")

for id in "${ids[@]}"; do
  if gh api "repos/${REPO}/issues/comments/${id}" -X DELETE >/dev/null 2>&1; then
    echo "Removed comment ${id} (${marker})."
  fi
done
