#!/usr/bin/env bash
#
# Classify what happened to a review run, so the workflow can tell
# "the model could not be reached" apart from "this pipeline is broken".
#
# The action exits 0 even when the API refused the request: the result record
# carries `is_error` plus a rate_limit_event, and no review body is written.
# Treating that as a red check trains people to ignore the check.
#
# Usage: review-outcome.sh <execution_file> <body_file> <review_step_outcome>
# Writes `status` and `reason` to $GITHUB_OUTPUT.
#
#   ok           a review body was written; post it as usual
#   unavailable  the model could not answer (spend or rate limit, overload).
#                Not a defect in this PR or this pipeline; do not fail the job.
#   skipped      the action deliberately self-skipped (its workflow-validation
#                guard fires on any PR that edits this workflow). Not a failure.
#   missing      no body and no recognised reason; fail loudly, as before.
set -euo pipefail

exec_file="${1:-}"
body_file="${2:-}"
review_outcome="${3:-}"

emit() {
  printf 'status=%s\n' "$1" >>"${GITHUB_OUTPUT:-/dev/stdout}"
  printf 'reason=%s\n' "$2" >>"${GITHUB_OUTPUT:-/dev/stdout}"
  echo "review outcome: $1 — $2"
}

if [ -s "$body_file" ]; then
  emit ok "review body written"
  exit 0
fi

# No execution output at all means the action never really ran. That is its
# self-skip guard when the step still succeeded, and a genuine crash when it
# did not — only the second one is worth failing over.
if [ -z "$exec_file" ] || [ ! -s "$exec_file" ]; then
  if [ "$review_outcome" = "failure" ]; then
    emit missing "the review action crashed before producing any output"
  else
    emit skipped "the review action skipped itself (this PR edits the review workflow)"
  fi
  exit 0
fi

# Prefer the API's own wording when it gave one — it usually names the limit
# and when it resets, which is the only actionable part.
msg=$(grep -oE '"text": *"[^"]*(limit|overloaded|capacity|quota)[^"]*"' "$exec_file" \
  | head -1 | sed 's/^"text": *"//; s/"$//' | tr -d '\r') || true

if grep -qE '"(type|error)": *"(rate_limit_event|rate_limit)"' "$exec_file"; then
  emit unavailable "${msg:-the API rate limit or spend limit was reached}"
  exit 0
fi

if grep -qE 'overloaded_error|"status": *529' "$exec_file"; then
  emit unavailable "${msg:-the API was overloaded}"
  exit 0
fi

emit missing "execution output present but no review body was written"
