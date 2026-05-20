# Design: trivy-tofu-scan reusable workflow

**Date:** 2026-05-20  
**Author:** David Fernandez  
**Status:** Approved

## Summary

Replace `tfsec.yml` with a new reusable workflow `trivy-tofu-scan.yml` that uses Trivy to scan OpenTofu/Terraform IaC code for misconfigurations. The workflow generates a full report persisted in four ways: SARIF upload to the GitHub Security tab, JSON artifact, Job Summary, and PR comment.

## Context

The repo already has `tfsec.yml` for IaC security scanning. Trivy covers the same surface (OpenTofu/Terraform misconfigurations) via `--scanners misconfig` and provides richer output options, active maintenance, and a unified tool already used in `docker-security-scan.yml` and `ecr-security-scan.yml`.

## Architecture

A single file `.github/workflows/trivy-tofu-scan.yml` with `on: workflow_call`. Follows the exact pattern of `tfsec.yml`, `docker-security-scan.yml`, and `ecr-security-scan.yml`.

### Permissions

```yaml
permissions:
  contents: read
  security-events: write   # SARIF upload to GitHub Security tab
  pull-requests: write     # PR comment
```

### Inputs

| Input | Type | Default | Description |
|---|---|---|---|
| `upload_sarif` | boolean | `true` | Upload SARIF to GitHub Security tab |
| `post_comment` | boolean | `true` | Post comment on PR if findings found |

Severity is hardcoded to `CRITICAL,HIGH` — not configurable.

## Job: `trivy-iac`

Runner: `ubuntu-24.04`. Env: `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true`.

### Steps

1. **Checkout** — `actions/checkout@v6`

2. **Find .tf files** — `find . -name "*.tf" -not -path "./.terraform/*"`. Sets `has_tf_files` output. Early exits (skip remaining steps) if no `.tf` files found.

3. **Run Trivy IaC scan** — Installs Trivy CLI (pinned version), runs:
   ```
   trivy config . --scanners misconfig --severity CRITICAL,HIGH \
     --format json --output trivy-results.json \
     --exit-code 1
   ```
   Uses `continue-on-error: true` to allow subsequent reporting steps to run. Captures exit code in step output.

4. **Run Trivy SARIF export** — Re-runs Trivy with `--format sarif --output results.sarif --soft-fail`. Only runs if `has_tf_files == 'true'` and `inputs.upload_sarif`.

5. **Upload SARIF** — `github/codeql-action/upload-sarif@v4` with `category: trivy-iac`. Runs if `upload_sarif` input is true and `results.sarif` exists.

6. **Generate Job Summary** — Bash script parses `trivy-results.json` with `jq`, builds a markdown table of findings (ID, severity, resource, message) and writes to `$GITHUB_STEP_SUMMARY`. Always runs if `has_tf_files == 'true'`.

7. **Upload artifact** — `actions/upload-artifact@v4` uploads `trivy-results.json` as `trivy-iac-scan-results`. Always runs if `has_tf_files == 'true'` (even on clean scans — artifact confirms the scan ran).

8. **Post PR comment** — `actions/github-script@v9` posts a comment with finding count and link to the run. Runs if `post_comment` is true, `github.event_name == 'pull_request'`, and findings were found.

9. **Fail if findings** — `run: exit 1` if Trivy step exit code was non-zero.

## Error handling

- No `.tf` files: steps 3–9 are skipped via `if: steps.find.outputs.has_tf_files == 'true'`. Workflow exits green.
- SARIF upload failure: `continue-on-error: true` so it doesn't block the fail step.
- Trivy install failure: the job fails immediately (no `continue-on-error`).

## Migration from tfsec

Callers replace:
```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tfsec.yml@main
```
with:
```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/trivy-tofu-scan.yml@main
```

The `minimum_severity` input from `tfsec.yml` has no equivalent — severity is fixed to `CRITICAL,HIGH`.

## Files

| Action | File |
|---|---|
| Create | `.github/workflows/trivy-tofu-scan.yml` |
| Delete (or deprecate) | `.github/workflows/tfsec.yml` |
