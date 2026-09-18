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

## Summary Table

| Workflow | Category | Description |
|---|---|---|
| [auto-merge-release-pr](#auto-merge-release-pr) | 📦 Release & Changelog | Automatically merges release-please PRs after all checks pass, using a GitHub App token to trigger downstream workflows |
| [Changelog and Release](#changelog-and-release) | 📦 Release & Changelog | Generates changelogs, bumps versions, and creates GitHub Releases for helm-charts, npm, and generic projects |
| [release](#release) | 📦 Release & Changelog | Runs release-please to cut releases and optionally updates `ref=vX.Y.Z` version pins in README files |
| [release-publish-oci](#release-publish-oci) | 📦 Release & Changelog | Full release pipeline: release-please → Docker build → ECR push → nullplatform artifact registration and release finalization |
| [Docker Build and Push to ECR](#docker-build-and-push-to-ecr) | 🚀 Build & Deploy | Builds a multi-arch Docker image and pushes it to Amazon ECR Public with digest output |
| [Docker Build and Push to ECR (nullplatform)](#docker-build-and-push-to-ecr-nullplatform) | 🚀 Build & Deploy | Builds and pushes a Docker image using the nullplatform CLI (`make build` / `make push`) with CI lifecycle reporting |
| [PR Checks - Docker Build](#pr-checks---docker-build) | 🚀 Build & Deploy | Validates that a Dockerfile builds successfully on pull requests, with optional GitHub App token for private dependencies |
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Enforces conventional branch naming (e.g., `feat/`, `fix/`) on pull requests, skipping release-please and Dependabot branches |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Validates that all commits in a pull request follow the Conventional Commits specification |
| [PR Checks - Go](#pr-checks---go) | 🔍 CI & Validation | Runs `go vet` and `go test` with configurable private module access via GitHub App or PAT |
| [PR Checks - Node (npm)](#pr-checks---node-npm) | 🔍 CI & Validation | Installs npm dependencies, runs lint (`test:static` or `lint`), and executes `npm test` |
| [PR Checks - Node Build (pnpm)](#pr-checks---node-build-pnpm) | 🔍 CI & Validation | Installs pnpm dependencies and runs `pnpm build` to validate the build succeeds |
| [PR Checks - Node (pnpm)](#pr-checks---node-pnpm) | 🔍 CI & Validation | Installs pnpm dependencies, lints, and runs tests with optional changed-file filtering and vitest sharding |
| [shellcheck](#shellcheck) | 🔍 CI & Validation | Runs ShellCheck on shell scripts, auto-discovering `.sh` files and extensionless files with shell shebangs |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Runs `tofu init`, `tofu fmt -check`, and `tofu validate` to lint OpenTofu/Terraform configurations |
| [tofu-test](#tofu-test) | 🔍 CI & Validation | Runs `tofu test` across a matrix of module paths using a configurable OpenTofu version |
| [PR Checks - Terraform](#pr-checks---terraform) | 🔍 CI & Validation | Orchestrates Terraform/OpenTofu lint, tfsec security scan, and optional `tofu test` for pull requests |
| [tofu-pre-release](#tofu-pre-release) | 🔍 CI & Validation | Posts a semantic-release changelog preview comment on pull requests |
| [Docker Security Scan](#docker-security-scan) | 🔒 Security | Builds a Docker image locally and scans it with Trivy, optionally uploading SARIF results to the GitHub Security tab |
| [ECR Security Scan](#ecr-security-scan) | 🔒 Security | Pulls the latest versioned tag of each specified ECR image and scans with Trivy, alerting to Slack on findings |
| [trivy-tofu-scan](#trivy-tofu-scan) | 🔒 Security | Scans OpenTofu/Terraform IaC files with Trivy for CRITICAL and HIGH misconfigurations |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | Generates or updates README files using an AI provider (Groq, GitHub, OpenAI, Anthropic) for changed or all project directories |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Generates terraform-docs documentation and injects it into README files for all modules |

---

## 📦 Release & Changelog

### auto-merge-release-pr

Resolves the open release-please PR (by label, author, and branch name) and merges it automatically after waiting for all other required checks to pass. Uses a GitHub App token to perform the merge so that the resulting push to `main` triggers downstream tag/release workflows — the default `GITHUB_TOKEN` cannot do this due to GitHub's loop-prevention rules. Designed to be called from `on: workflow_run` pointing at your release workflow; calling it from `on: pull_request` on a bot-authored PR is blocked by GitHub since mid-2026.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `release_pr_label` | Label release-please sets on its release PR | No | `autorelease: pending` |
| `release_pr_author` | Expected author login of the release PR | No | `github-actions[bot]` |
| `merge_method` | Merge method: `merge`, `squash`, or `rebase` | No | `merge` |
| `pr_number` | Explicit PR number to merge; `0` means auto-resolve | No | `0` |

**Secrets required**

- `app-id` — GitHub App ID used to mint the merge token
- `app-private-key` — GitHub App private key

**Usage**

```yaml
on:
  workflow_run:
    workflows: [release]
    types: [completed]

jobs:
  auto-merge:
    uses: nullplatform/actions-nullplatform/.github/workflows/auto-merge-release.yml@main
    secrets:
      app-id: ${{ secrets.RELEASE_APP_ID }}
      app-private-key: ${{ secrets.RELEASE_APP_PRIVATE_KEY }}
```

---

### Changelog and Release

Automatically generates a CHANGELOG.md, bumps the version following Conventional Commits rules (major/minor/patch), commits the changes, creates git tags, and optionally creates a GitHub Release. Supports helm-charts (per-chart versioning with change detection), npm (`package.json`), and generic (`VERSION` file) projects.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `project-type` | Project type: `helm-charts`, `npm`, or `generic` | No | `generic` |
| `source-dir` | Directory containing packages/charts | No | `.` |
| `version-file` | Version file name (auto-detected if empty) | No | `''` |
| `tag-prefix` | Prefix for git tags (e.g., `v`) | No | `''` |
| `create-github-release` | Create a GitHub Release | No | `true` |
| `commit-message` | Commit message for the version bump | No | `chore(release): bump version and update changelog [skip ci]` |

**Outputs**

- `has_changes` — Whether there were changes to release
- `new_version` — The new version number
- `changelog` — The generated changelog content

**Usage**

```yaml
jobs:
  release:
    uses: nullplatform/actions-nullplatform/.github/workflows/changelog-release.yml@main
    with:
      project-type: helm-charts
      source-dir: charts
      tag-prefix: v
      create-github-release: true
```

---

### release

Wraps `googleapis/release-please-action` to cut releases and optionally updates `ref=vX.Y.Z` pins across all `README.md` files in the repository. Exposes `release_created` and `tag_name` outputs so callers can chain publish or artifact-registration jobs in the same workflow run — necessary because release-please creates tags with `GITHUB_TOKEN` and GitHub suppresses push-triggered workflows from bot-token events.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `release-type` | release-please release type (e.g., `terraform-module`, `simple`, `node`) | No | `terraform-module` |
| `update_readme_versions` | Update `ref=vX.Y.Z` references in README files after release | No | `true` |

**Outputs**

- `release_created` — `true` when release-please cut a release on this run
- `tag_name` — Tag of the created release (e.g., `v1.2.3`)

**Usage**

```yaml
jobs:
  release:
    uses: nullplatform/actions-nullplatform/.github/workflows/release.yml@main
    with:
      release-type: simple
      update_readme_versions: false
```

---

### release-publish-oci

Full end-to-end release pipeline for service repositories that ship an OCI image: runs a preflight check, invokes release-please, builds and pushes the multi-arch Docker image to ECR, registers the artifact with the nullplatform API, and appends image/digest metadata to the GitHub Release body. Supports recovery/backfill via `existing_tag` — pass a tag to skip release-please and re-publish only. All steps run in a single workflow to avoid cross-workflow trigger limitations from bot-token events.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `image_name` | Image name under the registry (e.g., `scopes/lambda`) | Yes | — |
| `context` | Docker build context | No | `.` |
| `dockerfile` | Dockerfile path relative to context | No | `Dockerfile` |
| `platforms` | Target platforms for the multi-arch build | No | `linux/amd64,linux/arm64` |
| `ecr_registry` | ECR registry URL prefix | No | `public.ecr.aws/nullplatform` |
| `aws_region` | AWS region for ECR | No | `us-east-1` |
| `build_args` | Docker build arguments (newline-separated) | No | `''` |
| `also_tag_latest` | Also tag and push the image as `latest` | No | `false` |
| `release-type` | release-please release type | No | `simple` |
| `update_readme_versions` | Update `ref=vX.Y.Z` references in READMEs after release | No | `false` |
| `existing_tag` | Skip release-please and publish this existing tag (recovery/backfill) | No | `''` |
| `register_artifact` | Register the image as a nullplatform `oci_image` artifact | No | `true` |
| `artifact_visible_to` | Visibility selector for the registered artifact | No | `organization=*` |
| `np_cli_version` | np CLI version/channel for artifact registration | No | `alpha` |

**Secrets required**

- `aws_role_arn` — AWS IAM Role ARN for OIDC authentication to ECR (required)
- `artifact_np_api_key` — nullplatform API key for artifact registration (required when `register_artifact: true`)

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

---

## 🚀 Build & Deploy

### Docker Build and Push to ECR

Builds a multi-arch Docker image (default: `linux/amd64,linux/arm64`) using BuildKit cache and pushes it to Amazon ECR Public via OIDC authentication. Strips monorepo tag prefixes before tagging (e.g., `logs-controller-v2.0.0` → `v2.0.0`) and outputs the image digest and the actual pushed tag for use in downstream jobs.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `image_name` | Name of the Docker image (e.g., `k8s-logs-controller`) | Yes | — |
| `context` | Build context directory | Yes | — |
| `submodules` | Check out git submodules before building | No | `false` |
| `ref` | Git ref to build from; empty uses the triggering ref | No | `''` |
| `dockerfile` | Path to Dockerfile relative to context | No | `Dockerfile` |
| `platforms` | Target platforms for multi-arch build | No | `linux/amd64,linux/arm64` |
| `ecr_registry` | ECR registry URL | No | `public.ecr.aws/nullplatform` |
| `tag` | Tag for the image | No | `''` |
| `also_tag_latest` | Also tag and push the image as `latest` | No | `false` |
| `aws_region` | AWS region for ECR | No | `us-east-1` |
| `build_args` | Docker build arguments (newline-separated) | No | `''` |

**Secrets required**

- `aws_role_arn` — AWS IAM Role ARN for OIDC authentication

**Outputs**

- `image_digest` — OCI image-index digest (`sha256:...`)
- `image_tag` — Tag the image was actually pushed with (after prefix stripping)

**Usage**

```yaml
jobs:
  build:
    uses: nullplatform/actions-nullplatform/.github/workflows/docker-build-push-ecr.yml@main
    with:
      image_name: k8s-logs-controller
      context: .
      dockerfile: Dockerfile
      tag: v1.2.3
      platforms: linux/amd64,linux/arm64
    secrets:
      aws_role_arn: ${{ secrets.AWS_ROLE_ARN_ECR_PUSH }}
```

---

### Docker Build and Push to ECR (nullplatform)

Builds and pushes a Docker image using the nullplatform CLI and `make build` / `make push` targets, wrapping the build with `np build start` and `np build update` for CI lifecycle tracking in the nullplatform platform. Requires the repository to have a `Makefile` with `build` and `push` targets that handle Docker operations.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `platforms` | Target platforms for multi-arch build (passed as `DOCKER_PLATFORMS` env var to make) | No | `linux/amd64,linux/arm64` |

**Secrets required**

- `nullplatform_api_key` — nullplatform API key for CLI authentication

**Usage**

```yaml
jobs:
  build:
    uses: nullplatform/actions-nullplatform/.github/workflows/docker-build-push-np-ecr.yml@main
    with:
      

<!-- ACTIONS-END -->

## 📦 Release & Changelog

### release-publish-oci

The standard release pipeline for service repos that ship an OCI image. Chains release-please, the ECR image publish, nullplatform artifact registration, and release finalization (artifact metadata appended to the body, release force-published) in a single workflow run — so the GitHub limitation that bot-token events never trigger workflows is structurally irrelevant, and no PAT is needed. Supports `existing_tag` for recovery/backfill of already-created tags.

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
