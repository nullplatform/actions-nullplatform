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
