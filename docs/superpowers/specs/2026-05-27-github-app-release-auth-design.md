# GitHub App Authentication for Release Workflows

**Date:** 2026-05-27
**Status:** Approved

## Problem

Branch protection rules on `main` require PRs and status checks. The `GITHUB_TOKEN` cannot bypass these protections, forcing a manual bypass whenever an automated release needs to push to `main`. This applies to both release reusable workflows: `release.yml` (release-please) and `changelog-release.yml` (custom changelog).

## Solution

Add optional GitHub App authentication to both reusable workflows. When the App credentials are provided, a short-lived token is generated and used in place of `GITHUB_TOKEN`. When not provided, the workflows fall back to `GITHUB_TOKEN` as today — maintaining full backwards compatibility.

## Parameters

Both workflows receive two new optional secrets:

| Secret name (in workflow) | Maps to (in caller) | Description |
|---|---|---|
| `app_id` | `APP_RELEASE_ID` | GitHub App numeric ID (not sensitive but passed as secret for consistency) |
| `app_private_key` | `APP_RELEASE_PRIVATE_KEY` | GitHub App private key (PEM format) |

The App must be installed on the target repos and have:
- **Contents**: Read & write
- **Pull requests**: Read & write

## Token Generation

At the start of each job, a conditional step generates the token:

```yaml
- name: Generate GitHub App token
  id: app-token
  if: ${{ secrets.app_id != '' }}
  uses: actions/create-github-app-token@v3
  with:
    app-id: ${{ secrets.app_id }}
    private-key: ${{ secrets.app_private_key }}
```

The effective token is resolved as:
```
${{ steps.app-token.outputs.token || secrets.GITHUB_TOKEN }}
```

If `app_id` is empty, the step is skipped, the output is empty, and the expression falls back to `GITHUB_TOKEN`.

## Changes per Workflow

### `release.yml` (tofu-release)

Two jobs need independent token generation (jobs don't share step outputs).

**`release` job:**
- Add token generation step
- Pass token to `release-please-action` via `token:` input

**`update-readme-versions` job:**
- Add token generation step
- Pass token to `actions/checkout@v6` via `token:` input
- `git push` inherits the token from checkout automatically

### `changelog-release.yml`

Single job, three token injection points:

| Step | Change |
|---|---|
| `actions/checkout@v6` | `token:` → effective token |
| `git push` | inherits from checkout |
| `gh release create` | `GH_TOKEN:` env → effective token |

## Caller Usage Example

```yaml
jobs:
  release:
    uses: nullplatform/actions-nullplatform/.github/workflows/changelog-release.yml@main
    with:
      project-type: npm
    secrets:
      app_id: ${{ secrets.APP_RELEASE_ID }}
      app_private_key: ${{ secrets.APP_RELEASE_PRIVATE_KEY }}
```

## Backwards Compatibility

Callers that do not pass `app_id` / `app_private_key` continue to work with `GITHUB_TOKEN` unchanged.
