#!/usr/bin/env bash
#
# Upsert a PR comment identified by a marker.
#
# - First run on a PR: creates the comment.
# - Later runs: edits that same comment in place (stable id, keeps reactions),
#   and deletes any older duplicates so the PR keeps exactly one.
#
# Usage: upsert-comment.sh '<!-- marker -->' /path/to/body.md
# Env:   REPO (owner/name), PR_NUMBER, GH_TOKEN
set -euo pipefail

marker="$1"
body_file="$2"

if [ ! -s "$body_file" ]; then
  echo "::error::No review body at '$body_file' (missing or empty); the review step likely failed to write it."
  exit 1
fi

# Safety net: guarantee the marker is in the body so future runs can find it.
if ! grep -qF "$marker" "$body_file"; then
  printf '%s\n%s\n' "$marker" "$(cat "$body_file")" > "$body_file"
fi

# shellcheck source=.github/scripts/review/lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

# Only the bot's own comments count: a human quote-reply copies the raw
# markdown — marker included — and must never be edited or pruned here.
# Issue comments come back oldest-first, so the newest match is last.
mapfile -t ids < <(gh_retry gh api "repos/${REPO}/issues/${PR_NUMBER}/comments?per_page=100" \
  --jq ".[] | select(.user.login == \"github-actions[bot]\") | select(.body | contains(\"${marker}\")) | .id")

if [ "${#ids[@]}" -eq 0 ]; then
  # Create via REST (not `gh pr comment`, which goes through GraphQL and is
  # more prone to transient "Something went wrong" errors).
  gh_retry gh api "repos/${REPO}/issues/${PR_NUMBER}/comments" -F body=@"$body_file" >/dev/null
  echo "Created new review comment."
  exit 0
fi

target="${ids[-1]}"
gh_retry gh api "repos/${REPO}/issues/comments/${target}" -X PATCH -F body=@"$body_file" >/dev/null
echo "Updated review comment ${target} in place."

# Prune any older duplicates left over from before this was idempotent.
for old in "${ids[@]:0:${#ids[@]}-1}"; do
  if gh api "repos/${REPO}/issues/comments/${old}" -X DELETE >/dev/null 2>&1; then
    echo "Removed duplicate review comment ${old}."
  fi
done
