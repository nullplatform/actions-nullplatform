#!/usr/bin/env bash
# Shared helpers for the review scripts. Source this file; don't execute it.

# GitHub's API occasionally returns a transient 5xx / GraphQL "Something went
# wrong while executing your query". Retry with backoff so a single hiccup
# doesn't fail the whole check.
gh_retry() {
  local attempt=1 max=4 delay=3
  while true; do
    if "$@"; then return 0; fi
    if [ "$attempt" -ge "$max" ]; then return 1; fi
    echo "::warning::GitHub API call failed (attempt ${attempt}/${max}); retrying in ${delay}s…" >&2
    sleep "$delay"
    attempt=$((attempt + 1)); delay=$((delay * 2))
  done
}

# True when a file holds something besides whitespace — a model that wrote only
# blank lines has not answered.
has_text() {
  [ -s "$1" ] && grep -q '[^[:space:]]' "$1"
}

# Make a model-written body safe to post, in place. Fails (non-zero) when the
# body carries this job's token, which the model can read — the action writes it
# into `.git/config` — and which GitHub masks in logs but never in a comment.
# Truncates what would not fit a comment (65536 characters), leaving room for the
# footer; bytes >= characters, and `iconv -c` drops a character cut in half.
make_postable() {
  local file="$1" limit=64000 tmp
  if [ -n "${GH_TOKEN:-}" ]; then
    local basic
    basic=$(printf 'x-access-token:%s' "$GH_TOKEN" | base64 | tr -d '\n')
    if grep -qF -e "$GH_TOKEN" -e "$basic" "$file"; then
      echo "::error::The body contains this job's token; refusing to post it."
      return 1
    fi
  fi
  if [ "$(wc -c <"$file")" -gt "$limit" ]; then
    tmp=$(mktemp)
    head -c "$limit" "$file" | iconv -c -f UTF-8 -t UTF-8 >"$tmp" || true
    printf '\n\n_(Truncated to fit a GitHub comment — the full text is in the run log.)_\n' >>"$tmp"
    mv "$tmp" "$file"
    echo "::warning::The body was over ${limit} bytes and was truncated."
  fi
}

# jq filter selecting this workflow's own comments that carry a marker. Only the
# bot's own comments count (a human quote-reply copies the marker too), and only
# with the marker LEADING the comment: bodies are model-written, and one that
# quotes another comment's marker mid-body must never be taken for that comment.
# Usage: gh api "…/comments" --jq "$(own_comments_jq '<!-- marker -->') | .id"
own_comments_jq() {
  printf '.[] | select(.user.login == "github-actions[bot]") | select(.body | split("\\n")[0] | startswith("%s"))' "$1"
}
