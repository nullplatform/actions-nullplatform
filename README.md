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

# Reusable Workflows — nullplatform/actions-nullplatform

## Summary

| Workflow | Category | Description |
|---|---|---|
| [auto-merge-release-pr](#auto-merge-release-pr) | 🚀 Build & Deploy | Automatically merges release-please PRs after all checks pass, using a GitHub App token to trigger downstream workflows |
| [bot-prs-digest](#bot-prs-digest) | 📚 Documentation | Posts a biweekly Slack digest of open bot PRs (Dependabot, Renovate, release-please) and release conformance issues across the org |
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Validates pull request branch names against a conventional prefix pattern |
| [Changelog and Release](#changelog-and-release) | 📦 Release & Changelog | Generates changelogs from conventional commits, bumps versions, and creates GitHub releases for npm, Helm chart, and generic projects |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Validates all commits in a pull request against the Conventional Commits specification |
| [Docker Build and Push to ECR](#docker-build-and-push-to-ecr) | 🚀 Build & Deploy | Builds a multi-arch Docker image and pushes it to Amazon ECR Public using OIDC authentication |
| [Docker Build and Push to ECR (nullplatform)](#docker-build-and-push-to-ecr-nullplatform) | 🚀 Build & Deploy | Builds and pushes a Docker image via `make build`/`make push` with nullplatform CLI build lifecycle tracking |
| [Docker Security Scan](#docker-security-scan) | 🔒 Security | Builds a Docker image locally and scans it with Trivy, optionally uploading SARIF results to the GitHub Security tab |
| [ECR Security Scan](#ecr-security-scan) | 🔒 Security | Scans images already published in Amazon ECR Public for CRITICAL/HIGH vulnerabilities and posts a Slack alert when findings exist |
| [pr-checks-actions](#pr-checks-actions) | 🔍 CI & Validation | Lints GitHub Actions workflow syntax with actionlint and scans for leaked credentials with Trivy |
| [PR Checks - Docker Build](#pr-checks---docker-build) | 🔍 CI & Validation | Builds a Docker image on pull requests to verify the Dockerfile is valid, with optional GitHub App token for private dependencies |
| [PR Checks - Go](#pr-checks---go) | 🔍 CI & Validation | Runs `go vet` and `go test` with optional private module access via GitHub App token or PAT |
| [PR Checks - Node (npm)](#pr-checks---node-npm) | 🔍 CI & Validation | Installs npm dependencies, runs lint, and executes tests for Node.js projects using npm |
| [PR Checks - Node Build (pnpm)](#pr-checks---node-build-pnpm) | 🔍 CI & Validation | Installs pnpm dependencies and runs a production build for Node.js projects |
| [PR Checks - Node (pnpm)](#pr-checks---node-pnpm) | 🔍 CI & Validation | Installs pnpm dependencies, runs lint, and executes tests with optional `--changed` filtering and vitest sharding |
| [pr-checks-renovate-config](#pr-checks-renovate-config) | 🔍 CI & Validation | Validates `renovate-config.js` against the exact Renovate version pinned in the repo's renovate workflow |
| [PR Checks - Terraform](#pr-checks---terraform) | 🔍 CI & Validation | Orchestrates Terraform/OpenTofu lint, tfsec security scan, and optional module tests for pull requests |
| [tofu-pre-release](#tofu-pre-release) | 📦 Release & Changelog | Posts a semantic-release changelog preview comment on a pull request |
| [publish-test-image-oci](#publish-test-image-oci) | 🚀 Build & Deploy | Builds and pushes a tagged test image to ECR and optionally registers it as a nullplatform artifact revision without creating a release |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | Generates or updates README files using an AI provider for changed or all project directories, then commits the result |
| [register-oci-artifact](#register-oci-artifact) | 🚀 Build & Deploy | Registers an image already pushed to a registry as a nullplatform `oci_image` artifact revision via the `np` CLI |
| [release-publish-oci](#release-publish-oci) | 📦 Release & Changelog | Full release pipeline: runs release-please, builds and pushes the Docker image to ECR, registers a nullplatform artifact, and finalizes the GitHub release |
| [release](#release) | 📦 Release & Changelog | Runs release-please and optionally updates `ref=vX.Y.Z` version references in README files after a release is cut |
| [shellcheck](#shellcheck) | 🔍 CI & Validation | Runs ShellCheck against shell scripts, auto-discovering `.sh` files and extensionless files with a shell shebang |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Generates Terraform/OpenTofu module documentation into `README.md` files using terraform-docs |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Runs `tofu init`, `tofu fmt -check`, and `tofu validate` to lint OpenTofu/Terraform configurations |
| [tofu-test](#tofu-test) | 🔍 CI & Validation | Runs `tofu test` across a matrix of module paths using a specified OpenTofu version |
| [trivy-tofu-scan](#trivy-tofu-scan) | 🔒 Security | Scans OpenTofu/Terraform IaC files with Trivy for CRITICAL and HIGH misconfigurations, optionally uploading SARIF results |
| [readme-ai-generator-v2 (self-update)](#readme-ai-generator-v2-self-update) | 📚 Documentation | Generates AI-powered documentation for all reusable workflows and opens a pull request to update the README |

---

## 🔍 CI & Validation

### branch-validation

Validates pull request branch names against a configurable regex pattern. Automatically skips validation for `release-please--*` and `dependabot/*` branches. Use this on `pull_request` events to enforce naming conventions such as `feat/`, `fix/`, `chore/`, etc. before a PR can be merged.

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

Validates all commits in a pull request against the [Conventional Commits](https://www.conventionalcommits.org/) specification using `commitlint`. Enforces type prefixes (`feat`, `fix`, `chore`, etc.) and subject casing rules. Relaxes body and footer line-length limits to accommodate Dependabot and Renovate commit messages.

**Usage**

```yaml
jobs:
  lint-commits:
    uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

---

### pr-checks-actions

Lints all GitHub Actions workflow files in the repository using `actionlint` and scans the codebase for accidentally committed secrets or credentials using Trivy's secret scanner. Designed to run on every pull request in repositories that maintain reusable workflows.

**Usage**

```yaml
jobs:
  pr-checks:
    uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-actions.yml@main
```

---

### PR Checks - Docker Build

Builds a Docker image on pull requests to verify the Dockerfile compiles without errors. Supports both the legacy `--build-arg GITHUB_TOKEN` pattern and the newer BuildKit `--secret` injection. Optionally mints a short-lived GitHub App token for builds that need access to private source repositories.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `context` | Docker build context path | No | `.` |
| `dockerfile` | Path to the Dockerfile | No | `Dockerfile` |
| `use-app-token` | Mint a GitHub App token for private dependency access | No | `false` |
| `use_buildkit_secret` | Use BuildKit `--secret` instead of `--build-arg` for `GITHUB_TOKEN` | No | `false` |

**Secrets required**

- `CI_APP_ID` *(org secret, only when `use-app-token: true`)*
- `CI_APP_PRIVATE_KEY` *(org secret, only when `use-app-token: true`)*
- `CI_TOKEN` *(optional fallback PAT)*
- `DEPENDABOT_TOKEN` *(optional fallback PAT)*

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

Runs `go vet ./...` and `go test ./...` for Go projects. Configures `GOPRIVATE` and git credential rewrites to support private modules in the same org. When `require-private-modules` is `true`, the job fails immediately if no credential is available rather than producing a confusing `go get` 404 later.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `working-directory` | Working directory for go commands | No | `.` |
| `go-version` | Go version (overrides `go.mod` if set) | No | *(reads `go.mod`)* |
| `go-private` | `GOPRIVATE` glob for private modules | No | `github.com/nullplatform/*` |
| `use-app-token` | Mint a GitHub App token for private module access | No | `false` |
| `require-private-modules` | Fail fast if no credential is available for private modules | No | `false` |

**Secrets required**

- `CI_APP_ID` *(org secret, only when `use-app-token: true`)*
- `CI_APP_PRIVATE_KEY` *(org secret, only when `use-app-token: true`)*
- `CI_TOKEN` *(optional fallback PAT)*
- `DEPENDABOT_TOKEN` *(optional fallback PAT)*

**Usage**

```yaml
jobs:
  go-checks:
    uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-go.yml@main
    with:
      working-directory: .
      go-private: github.com/nullplatform/*
```

---

### PR Checks - Node (npm)

Runs `npm ci`, a lint step (tries `test:static` then `lint`), and `npm test` for Node.js projects managed with npm. Reads the Node.js version from `.node-version` by default or accepts an explicit version override.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `working-directory` | Working directory for npm commands | No | `.` |
| `node-version` | Node.js version (overrides `.node-version` if set) | No | *(reads `.node-version`)* |

**Secrets required**

- `CI_TOKEN` *(optional PAT for GitHub Packages access)*
- `DEPENDABOT_TOKEN` *(optional PAT for Dependabot PRs)*

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

Installs pnpm dependencies and runs `pnpm build` for Node.js projects. Use this as a lightweight build-verification check that confirms the project compiles correctly without running the full test suite.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `working-directory` | Working directory for pnpm commands | No | `.` |
| `node-version` | Node.js version (overrides `.node-version` if set) | No | *(reads `.node-version`)* |

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

Runs `pnpm install`, a lint step (tries `test:static` then `lint`), and `pnpm test` for projects using pnpm. Supports advanced vitest features: pass `changed-since` to only run tests related to the diff, and `shard` to spread the suite across parallel runners in a matrix job.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `working-directory` | Working directory for pnpm commands | No | `.` |
| `node-version` | Node.js version (overrides `.node-version` if set) | No | *(reads `.node-version`)* |
| `changed-since` | Git ref to filter tests with `--changed` (e.g. `github.event.pull_request.base.sha`) | No | *(run full suite)* |
| `shard` | Vitest shard as `<index>/<count>` (e.g. `2/4`) | No | *(no sharding)* |
| `lint` | Run the lint step | No | `true` |

**Secrets required**

- `CI_TOKEN` *(optional PAT for GitHub Packages access)*
- `DEPENDABOT_TOKEN` *(optional PAT for Dependabot PRs)*

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

Validates `renovate-config.js` against the exact Renovate version that the pinned `renovatebot/github-action` commit SHA would run. Triggered only when `renovate-config.js` or the Renovate workflow file changes, catching option regressions before the next scheduled Renovate run (up to two weeks away).

**Usage**

```yaml
jobs:
  validate-renovate:
    uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-renovate-config.yml@main
```

---

### PR Checks - Terraform

Orchestrates three checks for Terraform/OpenTofu pull requests: format and validate linting (`tofu-lint`), tfsec security scanning, and optional `tofu test` execution across a module matrix. Acts as a single entry point so callers need only one `uses:` line for all Terraform CI.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `minimum_severity` | Minimum severity for tfsec (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) | No | `HIGH` |
| `upload_sarif` | Upload SARIF results to GitHub Security tab | No | `true` |
| `post_comment` | Post a PR comment when tfsec scan fails | No | `true` |
| `run_tests` | Run `tofu test` on specified modules | No | `false` |
| `modules`

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
