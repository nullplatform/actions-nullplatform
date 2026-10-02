<h2 align="center">
    <a href="https://httpie.io" target="blank_">
        <img height="100" alt="nullplatform" src="https://nullplatform.com/favicon/android-chrome-192x192.png" />
    </a>
    <br>
    <br>
     Nullplatform Github action for Terraform/Tofu
    <br>
</h2>




# About 


## .github Directory

Reusable GitHub Actions workflows that support OpenTofu/Terraform module automation live here. Each workflow is designed to be called from other pipelines via `workflow_call`.

## Available Workflows

<!-- ACTIONS-START -->

# GitHub Actions Reusable Workflows

## Summary

| Workflow | Category | Description |
|---|---|---|
| [auto-merge-release-pr](#auto-merge-release-pr) | 📦 Release & Changelog | Automatically merges release-please PRs after all checks pass, using a GitHub App token to trigger downstream workflows |
| [bot-prs-digest](#bot-prs-digest) | 🔍 CI & Validation | Posts a biweekly Slack digest of open bot PRs (Dependabot, Renovate, release-please) and audits release conformance across the org |
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Validates PR branch names against a conventional type/description pattern, skipping release-please and Dependabot branches |
| [Changelog and Release](#changelog-and-release) | 📦 Release & Changelog | Generates a conventional-commit-based changelog, bumps the version, creates git tags, and optionally publishes a GitHub Release |
| [code-review-command](#code-review-command) | 📚 Documentation | Dispatches on-demand Claude AI review tiers (qa, deep, fix) triggered by `@claude` PR comments, with fork guards and budget controls |
| [code-review](#code-review) | 📚 Documentation | Runs an automated Claude AI review pass on every PR, keeping exactly one review comment updated in place |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Validates all commits in a PR against the Conventional Commits spec using commitlint |
| [Docker Build and Push to ECR](#docker-build-push-to-ecr) | 🚀 Build & Deploy | Builds a multi-arch Docker image and pushes it to Amazon ECR Public with tag normalization and GHA cache |
| [Docker Build and Push to ECR (nullplatform)](#docker-build-and-push-to-ecr-nullplatform) | 🚀 Build & Deploy | Builds and pushes a Docker image using the nullplatform CLI (`np build`) and a Makefile-driven asset pipeline |
| [Docker Security Scan](#docker-security-scan) | 🔒 Security | Builds a local Docker image and scans it with Trivy for CRITICAL/HIGH CVEs, with optional SARIF upload |
| [ECR Security Scan](#ecr-security-scan) | 🔒 Security | Scans live ECR images for vulnerabilities with Trivy and sends a Slack alert when CRITICAL/HIGH CVEs are found |
| [pr-checks-actions](#pr-checks-actions) | 🔍 CI & Validation | Runs actionlint syntax validation and Trivy secret scanning on workflow files in a PR |
| [PR Checks - Docker Build](#pr-checks---docker-build) | 🔍 CI & Validation | Validates that a Dockerfile builds successfully on a PR, with optional GitHub App token for private dependency access |
| [PR Checks - Go](#pr-checks---go) | 🔍 CI & Validation | Runs `go vet` and `go test` on a PR, with configurable private module authentication via GitHub App or PAT |
| [PR Checks - Node (npm)](#pr-checks---node-npm) | 🔍 CI & Validation | Runs npm lint and tests on a PR with dependency caching and flexible Node version selection |
| [PR Checks - Node Build (pnpm)](#pr-checks---node-build-pnpm) | 🔍 CI & Validation | Runs `pnpm install` and `pnpm build` on a PR using pnpm with dependency caching |
| [PR Checks - Node (pnpm)](#pr-checks---node-pnpm) | 🔍 CI & Validation | Runs pnpm lint and tests on a PR with optional changed-file filtering and vitest sharding |
| [pr-checks-renovate-config](#pr-checks-renovate-config) | 🔍 CI & Validation | Validates `renovate-config.js` against the exact Renovate version pinned in the repo's renovate workflow |
| [PR Checks - Terraform](#pr-checks---terraform) | 🔍 CI & Validation | Orchestrates OpenTofu lint, tfsec security scan, and optional module tests for Terraform PRs |
| [tofu-pre-release](#tofu-pre-release) | 📦 Release & Changelog | Posts a changelog preview comment on a PR using semantic-release dry-run |
| [publish-test-image-oci](#publish-test-image-oci) | 🚀 Build & Deploy | Builds and pushes a branch test image to ECR with a `test-<slug>-<sha>` tag and registers it as a nullplatform artifact revision |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | Generates AI-powered README files for changed or all project directories using a configurable AI provider |
| [register-oci-artifact](#register-oci-artifact) | 🚀 Build & Deploy | Registers a pre-pushed OCI image as a nullplatform artifact revision with annotations, changelog, and visibility selectors |
| [release-publish-oci](#release-publish-oci) | 📦 Release & Changelog | Full release pipeline: runs release-please, builds and pushes a Docker image to ECR, registers a nullplatform artifact, and finalizes the GitHub Release |
| [release](#release) | 📦 Release & Changelog | Runs release-please to cut a release and optionally updates `ref=vX.Y.Z` version pins in README files |
| [shellcheck](#shellcheck) | 🔍 CI & Validation | Runs ShellCheck on `.sh` files and extensionless shell scripts, with auto-discovery or explicit path targeting |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Auto-generates Terraform/OpenTofu module documentation into README files using terraform-docs |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Runs `tofu init`, `tofu fmt -check`, and `tofu validate` on an OpenTofu project |
| [tofu-test](#tofu-test) | 🔍 CI & Validation | Runs `tofu test` on a matrix of module paths using a specified OpenTofu version |
| [trivy-tofu-scan](#trivy-tofu-scan) | 🔒 Security | Scans OpenTofu/Terraform configurations for CRITICAL/HIGH misconfigurations using Trivy IaC mode |

---

## 🔍 CI & Validation

### bot-prs-digest

Collects all open bot-authored PRs (Dependabot, Renovate, release-please) across image-publishing repos in the org, posts a structured Slack message with age indicators and merge-since stats, and audits every public `scopes-*/services-*` repo for the required standard release workflow set. Use this on a schedule to give the team a single consolidated view instead of monitoring dozens of repositories individually.

> **Note:** This workflow is schedule/dispatch-triggered and not directly callable via `workflow_call`. It is documented here for completeness as it runs within this repository.

**Secrets required:**
- `SLACK_SECURITY_URL` — Slack incoming webhook URL
- `RENOVATE_APP_PRIVATE_KEY` — Private key for the Renovate GitHub App (needed to read private repos)
- `APP_RELEASE_PRIVATE_KEY` — Private key for the release GitHub App (optional; used to check App coverage)

---

### branch-validation

Enforces a `type/description` branch naming convention on pull requests. Branches beginning with `release-please--` or `dependabot/` are automatically skipped. Use this as a required PR check to maintain consistent branch names across the repository.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `pattern` | Regex pattern for branch name validation | No | `^(feat\|feature\|fix\|docs\|style\|refactor\|perf\|test\|build\|ci\|chore\|revert)/.+$` |

**Usage**

```yaml
jobs:
  validate-branch:
    uses: nullplatform/actions-nullplatform/.github/workflows/branch-validation.yml@main
```

---

### conventional-commit

Validates every commit in a pull request against the Conventional Commits spec using commitlint. Allows the standard type set (`feat`, `fix`, `chore`, etc.) and relaxes body/footer line-length limits to accommodate Dependabot and Renovate PRs that embed release notes.

**Usage**

```yaml
jobs:
  commit-lint:
    uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

---

### pr-checks-actions

Runs two checks on workflow files in a PR: `actionlint` (syntax and schema validation with known false-positive suppressions) and Trivy secret scanning across the entire filesystem. Use as a required check on any repository that maintains GitHub Actions workflows.

> **Note:** This workflow triggers on `pull_request` directly and is not callable via `workflow_call`.

---

### PR Checks - Docker Build

Validates that a Dockerfile builds successfully on a PR without pushing. Supports both `--build-arg` and BuildKit `--secret` modes for passing `GITHUB_TOKEN`, and optionally mints a short-lived GitHub App token for builds that need access to private source repositories.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `context` | Docker build context path | No | `.` |
| `dockerfile` | Path to the Dockerfile | No | `Dockerfile` |
| `use-app-token` | Mint a GitHub App token for private source access (requires `CI_APP_ID`/`CI_APP_PRIVATE_KEY` org secrets) | No | `false` |
| `use_buildkit_secret` | Use BuildKit `--secret` instead of `--build-arg` for `GITHUB_TOKEN` | No | `false` |

**Secrets required:**
- `CI_TOKEN` or `DEPENDABOT_TOKEN` — PAT fallback for GitHub Packages access (optional)
- `CI_APP_ID` / `CI_APP_PRIVATE_KEY` — GitHub App credentials when `use-app-token: true`

**Usage**

```yaml
jobs:
  docker-build:
    uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-docker.yml@main
    with:
      context: .
      dockerfile: Dockerfile
```

---

### PR Checks - Go

Runs `go vet ./...` and `go test ./...` on a PR. Configures `GOPRIVATE` and a git credential helper for private module access, with an opt-in GitHub App token minting flow that avoids tying credentials to any individual's account.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `working-directory` | Working directory for go commands | No | `.` |
| `go-version` | Go version (overrides go.mod if set) | No | `` |
| `go-private` | `GOPRIVATE` glob for modules bypassing the public proxy | No | `github.com/nullplatform/*` |
| `use-app-token` | Mint a GitHub App token for private module access | No | `false` |
| `require-private-modules` | Fail fast if no credential is available for private modules | No | `false` |

**Secrets required:**
- `CI_APP_ID` / `CI_APP_PRIVATE_KEY` — GitHub App credentials when `use-app-token: true`
- `CI_TOKEN` or `DEPENDABOT_TOKEN` — PAT fallback for private module access

**Usage**

```yaml
jobs:
  go-checks:
    uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-go.yml@main
    with:
      working-directory: .
      go-private: github.com/nullplatform/*
      use-app-token: true
    secrets:
      CI_APP_ID: ${{ secrets.CI_APP_ID }}
      CI_APP_PRIVATE_KEY: ${{ secrets.CI_APP_PRIVATE_KEY }}
```

---

### PR Checks - Node (npm)

Installs npm dependencies and runs lint (trying `test:static` then `lint`) followed by `npm test`. Resolves the Node version from `.node-version` or an explicit input, and uses `CI_TOKEN`/`DEPENDABOT_TOKEN` for GitHub Packages access.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `working-directory` | Working directory for npm commands | No | `.` |
| `node-version` | Node.js version (overrides `.node-version` file if set) | No | `` |

**Secrets required:**
- `CI_TOKEN` or `DEPENDABOT_TOKEN` — PAT for GitHub Packages (optional fallback to `GITHUB_TOKEN`)

**Usage**

```yaml
jobs:
  node-checks:
    uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-npm.yml@main
    with:
      working-directory: .
```

---

### PR Checks - Node Build (pnpm)

Installs pnpm dependencies and runs `pnpm build` to verify the project compiles on a PR. Resolves the Node version from `.node-version` or an explicit input.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `working-directory` | Working directory for pnpm commands | No | `.` |
| `node-version` | Node.js version (overrides `.node-version` file if set) | No | `` |

**Usage**

```yaml
jobs:
  node-build:
    uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-pnpm-build.yml@main
    with:
      working-directory: .
```

---

### PR Checks - Node (pnpm)

Installs pnpm dependencies and runs lint (trying `test:static` then `lint`) followed by `pnpm test`. Supports optional changed-file filtering (`--changed <ref>`) and vitest sharding to distribute a large test suite across parallel runners. Disable lint on all-but-one shard to avoid redundant runs.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `working-directory` | Working directory for pnpm commands | No | `.` |
| `node-version` | Node.js version (overrides `.node-version` file if set) | No | `` |
| `changed-since` | Git ref to filter tests to changed files only (e.g. `github.event.pull_request.base.sha`) | No | `` |
| `shard` | Vitest shard index as `<index>/<count>` (e.g. `2/4`) | No | `` |
| `lint` | Run the lint step (set `false` on all but one shard) | No | `true` |

**Secrets required:**
- `CI_TOKEN` or `DEPENDABOT_TOKEN` — PAT for GitHub Packages (optional fallback to `GITHUB_TOKEN`)

**Usage**

```yaml
jobs:
  node-checks:
    uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-pnpm.yml@main
    with:
      working-directory: .
      changed-since: ${{ github.event.pull_request.base.sha }}
```

---

### pr-checks-renovate-config

Validates `renovate-config.js` against the exact Renovate version that will actually run (read from the pinned SHA of `renovatebot/github-action` in `renovate.yml`). Catches breaking config changes up to two weeks before the next scheduled Renovate run.

> **Note:** This workflow triggers on `pull_request` paths directly and is not callable via `workflow_call`.

---

### PR Checks - Terraform

Orchestrates three checks for Terraform/OpenTofu PRs: format/validate lint (via `tofu-lint.yml`), tfsec security scanning with optional SARIF upload, and optional `tofu test` execution across a matrix of modules.

**Inputs**

<!-- ACTIONS-END -->

## 📦 Release & Changelog

### release-publish-oci

The standard release pipeline for service repos that ship an OCI image. Chains release-please, the ECR image publish, nullplatform artifact registration, and release finalization (artifact metadata appended to the body, release force-published) in a single workflow run — so the GitHub limitation that bot-token events never trigger workflows is structurally irrelevant, and no PAT is needed. Supports `existing_tag` for recovery/backfill of already-created tags. Registration runs through [register-oci-artifact](#register-oci-artifact).

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| image_name | Image name under the registry (e.g. scopes/lambda) | Yes | - |
| context | Docker build context | No | . |
| dockerfile | Dockerfile path relative to context | No | Dockerfile |
| platforms | Target platforms for the multi-arch build | No | linux/amd64,linux/arm64 |
| ecr_registry | ECR registry URL prefix | No | public.ecr.aws/nullplatform |
| aws_region | AWS region for ECR | No | us-east-1 |
| build_args | Docker build arguments (newline-separated) | No | '' |
| also_tag_latest | Also tag and push the image as latest | No | false |
| release-type | Release Please release type | No | simple |
| update_readme_versions | Update ref=vX.Y.Z references in READMEs after release | No | false |
| existing_tag | Skip release-please; publish + finalize this existing tag | No | '' |
| register_artifact | Register the image as a nullplatform oci_image artifact | No | true |
| artifact_visible_to | Visibility selector for the registered artifact | No | organization=* |
| np_cli_version | np CLI version/channel for artifact registration | No | alpha-packages |

**Secrets**
- `aws_role_arn` (required): AWS IAM Role ARN for OIDC auth against ECR
- `artifact_np_api_key`: nullplatform API key (required while `register_artifact` is true)

Also reads the `NP_ARTIFACT_NRN` repository/organization variable (artifact owner NRN), and requires the caller to grant `contents: write`, `pull-requests: write`, and `id-token: write` (a preflight job fails fast when `id-token` is missing).

**Usage**

```yaml
name: release
on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      existing_tag:
        description: 'Publish + finalize an existing tag (recovery/backfill)'
        required: true
        type: string
permissions:
  contents: write
  pull-requests: write
  id-token: write
jobs:
  release:
    uses: nullplatform/actions-nullplatform/.github/workflows/release-publish-oci.yml@main
    with:
      image_name: scopes/lambda
      existing_tag: ${{ inputs.existing_tag || '' }}
    secrets:
      aws_role_arn: ${{ secrets.AWS_ROLE_ARN_ECR_PUSH }}
      artifact_np_api_key: ${{ secrets.ARTIFACT_NP_API_KEY }}
```

### publish-test-image-oci

Builds a test image from the branch it is dispatched on (or from a same-repo pull request), pushes it to ECR with the tag `test-<branch-slug>-<short-sha>`, and registers it as an `oci_image` artifact so it can go into a package version and be rolled out to a test scope. No release-please, no git tag, no GitHub release, never `latest`. The run's job summary lists the image, digest, pinned reference, registry/repository, artifact ID and revision ID.

A test build registers exactly where a release does: the same owner (`NP_ARTIFACT_NRN`), the same registry and repository, and the same default visibility (`organization=*`). Artifacts are unique on (owner NRN, registry, repository), so a test build is one more revision of the release artifact. The image is already in the public registry, and the artifact is as visible as the image.

A test revision is told apart from a release by:

- The tag, which always starts with `test-` and never contains a dot, so it never looks like a version to `docker-build-push-ecr` or `ecr-security-scan`. Release tags must never start with `test-`.
- The `com.nullplatform.build.type=test`, `com.nullplatform.build.branch` and `com.nullplatform.build.run` annotations, next to `org.opencontainers.image.source` and `org.opencontainers.image.revision`.

Until the next release registers, the test revision is the artifact's newest one: the UI's **Existing artifact** picker and tag-less lookups default to it, and a package pinning the artifact sees it as the available update. Pin releases by tag or digest where that matters.

Fork pull requests and `pull_request_target` are refused, so fork code never runs with push credentials. ECR Public has no lifecycle policies and artifacts can't be deleted, so test tags stay until someone removes them (`aws ecr-public batch-delete-image`).

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| image_name | Image name under the registry (e.g. scopes/lambda) | Yes | - |
| context | Docker build context | No | . |
| dockerfile | Dockerfile path relative to context | No | Dockerfile |
| submodules | Check out git submodules before building | No | false |
| platforms | Target platforms for the multi-arch build | No | linux/amd64,linux/arm64 |
| ecr_registry | ECR registry URL prefix | No | public.ecr.aws/nullplatform |
| aws_region | AWS region for ECR | No | us-east-1 |
| build_args | Docker build arguments (newline-separated) | No | '' |
| register_artifact | Register the image as a revision of the artifact owned by `NP_ARTIFACT_NRN` | No | true |
| artifact_visible_to | Visibility selector for the registered artifact (same default as `release-publish-oci`) | No | organization=* |
| np_cli_version | np CLI version/channel for artifact registration | No | alpha |

**Secrets**
- `aws_role_arn` (required): AWS IAM Role ARN for OIDC auth against ECR
- `artifact_np_api_key`: nullplatform API key allowed to create artifacts at `NP_ARTIFACT_NRN`, the same one `release-publish-oci` uses (required while `register_artifact` is true)

**Outputs**: `image_tag`, `image_digest`, `artifact_id`, `artifact_revision_id`.

Reads the `NP_ARTIFACT_NRN` repository/organization variable (the one `release-publish-oci` reads), and requires the caller to grant `contents: read` and `id-token: write`. A preflight job checks the permissions and the artifact wiring before anything is built.

**Usage**

```yaml
name: test-image
on:
  workflow_dispatch:
permissions:
  contents: read
  id-token: write
jobs:
  test-image:
    uses: nullplatform/actions-nullplatform/.github/workflows/publish-test-image-oci.yml@v1
    with:
      image_name: scopes/lambda
    secrets:
      aws_role_arn: ${{ secrets.AWS_ROLE_ARN_ECR_PUSH }}
      artifact_np_api_key: ${{ secrets.ARTIFACT_NP_API_KEY }}
```

Run it from the branch to test: **Actions > test-image > Run workflow**, or `gh workflow run test-image.yml --ref <branch>`. To build pull requests that carry a label instead, trigger on `pull_request: types: [labeled, synchronize]` and guard the job with `if: contains(github.event.pull_request.labels.*.name, 'test-image')`.

### register-oci-artifact

Registers an image that is already in a registry as a nullplatform `oci_image` artifact revision with `np artifact create`, and outputs the artifact and revision IDs. `release-publish-oci` and `publish-test-image-oci` both call it. It always adds `org.opencontainers.image.source`, and can add the build commit (`source_ref`), a version, the notes of a GitHub release as the changelog, and extra `key=value` annotations. Registering the same digest and tag again returns the same revision and replaces its annotations.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| nrn | Owner NRN of the artifact | Yes | - |
| ecr_registry | Registry URL prefix the image was pushed under | No | public.ecr.aws/nullplatform |
| image_name | Image name under the registry | Yes | - |
| image_tag | Tag the image was pushed with | Yes | - |
| image_digest | Image digest (sha256:...) | Yes | - |
| source_ref | Git ref or commit the image was built from, recorded as `org.opencontainers.image.revision` | No | '' |
| version | Value for `org.opencontainers.image.version` | No | '' |
| changelog_release_tag | Use the notes of the GitHub release for this tag as the changelog | No | '' |
| annotations | Extra annotations, one `key=value` per line | No | '' |
| visible_to | Visibility NRN selectors, space or comma separated | No | '' (owner NRN only) |
| np_cli_version | np CLI version/channel | No | alpha |

**Secrets**
- `np_api_key`: nullplatform API key allowed to create artifacts at `nrn` (the job fails when it is empty)

**Outputs**: `artifact_id`, `artifact_revision_id`.

Workflows in this repo call it with the path form (`uses: ./.github/workflows/register-oci-artifact.yml`) so it runs from the same ref the caller pinned. Other repos can call it like any reusable workflow.

## Notes

### AI-Powered Documentation

This README is automatically generated using AI. The `update-readme-actions` workflow reads all workflow files and generates documentation using your configured AI provider.

#### Supported Providers

| Provider | Secret for API Key | Default Model |
|----------|-------------------|---------------|
| `groq` | `GROQ_API_KEY` | `llama-3.3-70b-versatile` |
| `github` | `GITHUB_TOKEN` | `gpt-4o` |
| `openai` | `OPENAI_API_KEY` | `gpt-4o` |
| `anthropic` | `ANTHROPIC_API_KEY` | `claude-sonnet-4-20250514` |

#### Configuration

To configure the AI provider, add these secrets in **Settings → Secrets and variables → Actions**:

1. `AI_PROVIDER` - Provider to use: `groq`, `github`, `openai`, or `anthropic`
2. `AI_MODEL` - (Optional) Specific model to use
3. The API key secret for your chosen provider (e.g., `GROQ_API_KEY`)

**Example for Groq:**
```
AI_PROVIDER = groq
GROQ_API_KEY = gsk_xxx...
```

**Example for Anthropic Claude:**
```
AI_PROVIDER = anthropic
ANTHROPIC_API_KEY = sk-ant-xxx...
```

#### Running Locally

```bash
AI_PROVIDER=groq GROQ_API_KEY=xxx node .github/scripts/update-actions-readme.js
```

---

## Contributions

If you want to add or modify a module:

1. Create a `feature/` or `fix/` branch.
2. Add tests or validations if applicable.
3. Update or generate documentation for the affected module.
4. Open a Pull Request for review.

---
