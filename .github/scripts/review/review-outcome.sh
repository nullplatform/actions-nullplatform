#!/usr/bin/env bash
#
# Classify what happened to a review run, so the workflow can tell
# "the model could not be reached" apart from "this pipeline is broken".
#
# The action exits 0 even when the API refused the request: the messages carry
# a rejected rate_limit_event or an API error, and no review body is written.
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
#   not_run      the review step itself never ran: an earlier step failed, or
#                the run was cancelled or timed out. Nothing is posted — the
#                job's own status already says what happened.
set -euo pipefail

exec_file="${1:-}"
body_file="${2:-}"
review_outcome="${3:-}"

emit() {
  printf 'status=%s\n' "$1" >>"${GITHUB_OUTPUT:-/dev/stdout}"
  printf 'reason=%s\n' "$2" >>"${GITHUB_OUTPUT:-/dev/stdout}"
  echo "review outcome: $1 — $2"
}

# Only a review step that ran can have answered. When it was skipped or
# cancelled, a body on disk came from somewhere else — the checkout — and a
# missing one says nothing about the action.
case "$review_outcome" in
  success | failure) ;;
  *)
    emit not_run "the review step did not run (${review_outcome:-no outcome})"
    exit 0
    ;;
esac

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

# The execution file is the SDK's message list as JSON, so read it as data. A
# `rate_limit_event` alone means nothing — the CLI emits one on every
# subscription run (status `allowed` / `allowed_warning`) — and a transient
# `api_retry` names `rate_limit` too. Only a refusal counts: a rejected limit,
# or a turn that ended on the API's own limit, overload or billing error.
refusal=$(jq -r '
  ([.[] | select(.type == "rate_limit_event" and .rate_limit_info.status == "rejected")] | last) as $limit
  | ([.[] | select(.type == "assistant" and ((.error // "") | IN("rate_limit", "overloaded", "billing_error")))] | last) as $error
  | if $limit != null then
      "the \($limit.rate_limit_info.rateLimitType // "usage") limit was reached"
      + (if $limit.rate_limit_info.resetsAt then "; it resets \($limit.rate_limit_info.resetsAt | todate)" else "" end)
    elif $error != null then "the API answered `\($error.error)`"
    else empty end
' "$exec_file" 2>/dev/null) || refusal=""

if [ -n "$refusal" ]; then
  emit unavailable "$refusal"
  exit 0
fi

# How the run ended is the actionable part: `error_max_turns` or
# `error_max_budget_usd` names the input to raise.
ended=$(jq -r '[.[] | select(.type == "result")] | last | .subtype // empty' "$exec_file" 2>/dev/null) || ended=""
case "$ended" in
  '') emit missing "no review body was written" ;;
  success) emit missing "no review body was written: the model finished without writing it" ;;
  *) emit missing "no review body was written: the run ended with ${ended}" ;;
esac
