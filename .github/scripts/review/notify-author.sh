#!/usr/bin/env bash
#
# Notify the PR author that the review comment was (re)posted.
#
# Editing a comment in place does NOT trigger a GitHub notification, so we post
# a fresh, minimal comment that @-mentions the author — a new comment is what
# actually notifies. Any previous ping is deleted first, so the PR keeps at most
# one ping at a time.
#
# Usage: notify-author.sh '<!-- ping-marker -->' '<!-- review-marker -->' 'auto-review'
# Env:   REPO (owner/name), PR_NUMBER, GH_TOKEN
#        HEAD_SHA (optional) — the commit that was reviewed, so the ping names the
#        same one as the review's footer; defaults to the PR's current head.
set -euo pipefail

# shellcheck source=.github/scripts/review/lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

ping_marker="$1"
review_marker="$2"
label="$3"

# Only ping if a review comment actually exists (links the ping to it). Match
# only the bot's own comments — a human quote-reply carries the marker too.
review_url=$(gh_retry gh api "repos/${REPO}/issues/${PR_NUMBER}/comments?per_page=100" \
  --jq "[.[] | select(.user.login == \"github-actions[bot]\") | select(.body | contains(\"${review_marker}\"))] | last | .html_url")
if [ -z "$review_url" ] || [ "$review_url" = "null" ]; then
  echo "No review comment with marker ${review_marker}; skipping ping."
  exit 0
fi

info=$(gh_retry gh pr view "$PR_NUMBER" --repo "$REPO" --json author,headRefOid)
author=$(printf '%s' "$info" | jq -r '.author.login')
is_bot=$(printf '%s' "$info" | jq -r '.author.is_bot')
sha="${HEAD_SHA:-$(printf '%s' "$info" | jq -r '.headRefOid')}"

# Mentioning a bot author (e.g. dependabot[bot]) would not notify a human.
if [ "$is_bot" = "true" ]; then
  echo "PR author '${author}' is a bot; skipping ping."
  exit 0
fi

# Delete any prior ping so only the newest remains (bot-authored only — never
# touch a human comment that happens to quote the marker).
mapfile -t old < <(gh_retry gh api "repos/${REPO}/issues/${PR_NUMBER}/comments?per_page=100" \
  --jq ".[] | select(.user.login == \"github-actions[bot]\") | select(.body | contains(\"${ping_marker}\")) | .id")
for id in "${old[@]}"; do
  if gh api "repos/${REPO}/issues/comments/${id}" -X DELETE >/dev/null 2>&1; then
    echo "Removed previous ping ${id}."
  fi
done

# Post a fresh ping (a new comment → GitHub notifies the mentioned author).
# REST, not `gh pr comment` — the GraphQL path is more prone to transient errors.
body="${ping_marker}
🔔 @${author} — the ${label} was updated for \`${sha:0:7}\`. See the [review](${review_url})."
gh_retry gh api "repos/${REPO}/issues/${PR_NUMBER}/comments" -f body="$body" >/dev/null
echo "Posted review-updated ping for @${author}."
