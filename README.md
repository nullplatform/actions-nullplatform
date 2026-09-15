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

# Available GitHub Actions Workflows

This repository provides reusable GitHub Actions workflows for CI/CD, security scanning, documentation generation, and release management.

## Summary Table

| Workflow | Category | Description |
|----------|----------|-------------|
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Validates branch names against conventional commit type patterns |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Enforces conventional commit message format on all commits |
| [shellcheck](#shellcheck) | 🔍 CI & Validation | Static analysis of shell scripts for common errors and best practices |
| [docker-security-scan](#docker-security-scan) | 🔒 Security | Scans Docker images for vulnerabilities using Trivy |
| [ecr-security-scan](#ecr-security-scan) | 🔒 Security | Scans ECR images for vulnerabilities and alerts via Slack |
| [tfsec-security-scan](#tfsec-security-scan) | 🔒 Security | Security scanner for Terraform/OpenTofu with SARIF upload |
| [Docker Build and Push to ECR](#docker-build-and-push-to-ecr) | 🚀 Build & Deploy | Builds multi-arch Docker images and pushes to Amazon ECR Public |
| [Docker Build and Push to ECR (Nullplatform)](#docker-build-and-push-to-ecr-nullplatform) | 🚀 Build & Deploy | Integrates Docker builds with Nullplatform build lifecycle |
| [PR Checks - Docker Build](#pr-checks---docker-build) | 🚀 Build & Deploy | Validates Docker builds work correctly in pull requests |
| [PR Checks - Go](#pr-checks---go) | 🚀 Build & Deploy | Runs linting and tests for Go projects |
| [PR Checks - Node (npm)](#pr-checks---node-npm) | 🚀 Build & Deploy | Runs linting and tests for Node.js projects using npm |
| [PR Checks - Node (pnpm)](#pr-checks---node-pnpm) | 🚀 Build & Deploy | Runs linting and tests for Node.js projects using pnpm |
| [PR Checks - Node Build (pnpm)](#pr-checks---node-build-pnpm) | 🚀 Build & Deploy | Validates build process for Node.js projects using pnpm |
| [PR Checks - Terraform](#pr-checks---terraform) | 🚀 Build & Deploy | Comprehensive Terraform validation including linting, security, and testing |
| [tofu-lint](#tofu-lint) | 🚀 Build & Deploy | Validates OpenTofu/Terraform formatting and configuration |
| [tofu-test](#tofu-test) | 🚀 Build & Deploy | Runs OpenTofu test suites for infrastructure modules |
| [Changelog and Release](#changelog-and-release) | 📦 Release & Changelog | Automated version bumping and changelog generation |
| [tofu-release](#tofu-release) | 📦 Release & Changelog | Creates releases for Terraform modules with version updates |
| [release-publish-oci](#release-publish-oci) | 📦 Release & Changelog | Chained release: release-please, ECR image publish, artifact registration, release metadata |
| [publish-test-image-oci](#publish-test-image-oci) | 📦 Release & Changelog | Test image from a branch or PR: ECR push with a test- tag and a test artifact, no release |
| [register-oci-artifact](#register-oci-artifact) | 📦 Release & Changelog | Registers a pushed image as a nullplatform oci_image artifact (used by the two above) |
| [tofu-pre-release](#tofu-pre-release) | 📦 Release & Changelog | Previews changelog in pull requests before release |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | AI-powered README generation for projects |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Generates Terraform module documentation |
| [update-readme-actions](#update-readme-actions) | 📚 Documentation | Automatically updates this README with workflow documentation |

---

## 🔍 CI & Validation

### branch-validation

Validates pull request branch names follow conventional commit type patterns (feat/, fix/, docs/, etc.). Use this in pull request workflows to enforce branch naming conventions before allowing merges.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| pattern | Regex pattern for branch name validation | No | `^(feat\|feature\|fix\|docs\|style\|refactor\|perf\|test\|build\|ci\|chore\|revert)/.+$` |

**Secrets required**
- None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/branch-validation.yml@main
with:
  pattern: '^(feat|fix|docs|refactor)/.+$'
```

### conventional-commit

Enforces conventional commit message format across all commits in pull requests. Validates commit messages follow the pattern `type(scope): description` where type is one of feat, fix, docs, etc. Use this to maintain consistent commit history and enable automated changelog generation.

**Inputs**
- None

**Secrets required**
- None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

### shellcheck

Performs static analysis on shell scripts to catch syntax errors, deprecated commands, and common mistakes. Scans either specified files/directories or all `.sh` files in the repository. Use this to maintain high-quality shell scripts and prevent runtime errors.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| script_dirs | Space-separated dirs/files to scan. When empty, finds *.sh recursively | No | '' |
| severity | Minimum severity (error, warning, info, style) | No | error |

**Secrets required**
- None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/shellcheck.yml@main
with:
  script_dirs: 'scripts/ tools/'
  severity: 'warning'
```

---

## 🔒 Security

### docker-security-scan

Scans Docker images for security vulnerabilities using Trivy before deployment. Builds the image locally and checks for known CVEs with configurable severity thresholds. Generates SARIF reports for the GitHub Security tab. Use this in CI pipelines to prevent deploying vulnerable containers.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| context | Build context directory | Yes | - |
| dockerfile | Path to Dockerfile relative to context | No | Dockerfile |
| image_name | Name for the scanned image (used for reporting) | Yes | - |
| severity | Minimum severity to report (CRITICAL,HIGH,MEDIUM,LOW) | No | CRITICAL,HIGH |
| build_args | Docker build arguments (multiline, one per line: KEY=VALUE) | No | '' |
| exit_code | Exit code when vulnerabilities are found (0 to not fail) | No | 1 |
| upload_sarif | Upload SARIF results to GitHub Security tab | No | true |

**Secrets required**
- None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/docker-security-scan.yml@main
with:
  context: .
  dockerfile: Dockerfile
  image_name: my-app
  severity: 'CRITICAL,HIGH,MEDIUM'
  build_args: |
    NODE_VERSION=20
    BUILD_ENV=production
  upload_sarif: true
```

### ecr-security-scan

Scans published ECR images for vulnerabilities on a schedule or manually. Finds the latest semver tag for each specified image, scans for critical/high vulnerabilities, sends Slack alerts if issues are found, and generates SARIF reports for the GitHub Security tab. Use this for continuous security monitoring of production images.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| image_names | JSON array of image names to scan (e.g., ["k8s-logs-controller", "k8s-traffic-manager"]) | Yes | - |
| ecr_registry | ECR registry URL | No | public.ecr.aws/nullplatform |
| severity | Minimum severity to report (CRITICAL,HIGH,MEDIUM,LOW) | No | CRITICAL,HIGH |
| upload_sarif | Upload SARIF results to GitHub Security tab | No | true |

**Secrets required**
- `aws_role_arn`: AWS IAM Role ARN for OIDC authentication
- `slack_webhook_url`: Slack webhook URL for vulnerability alerts

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/ecr-security-scan.yml@main
with:
  image_names: '["my-app", "my-worker"]'
  ecr_registry: 'public.ecr.aws/myorg'
  severity: 'CRITICAL,HIGH'
  upload_sarif: true
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
  slack_webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### tfsec-security-scan

Security scanner for Terraform/OpenTofu code that detects misconfigurations and security issues. Generates SARIF reports for GitHub Security tab and posts PR comments on failures. Use this to enforce security best practices in infrastructure code.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| minimum_severity | Minimum severity level to report (CRITICAL, HIGH, MEDIUM, LOW) | No | HIGH |
| upload_sarif | Upload SARIF results to GitHub Security tab | No | true |
| post_comment | Post comment on PR if scan fails | No | true |

**Secrets required**
- None (uses `GITHUB_TOKEN` automatically)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tfsec.yml@main
with:
  minimum_severity: 'MEDIUM'
  upload_sarif: true
  post_comment: true
permissions:
  contents: read
  pull-requests: write
  security-events: write
```

---

## 🚀 Build & Deploy

### Docker Build and Push to ECR

Builds multi-architecture Docker images and pushes them to Amazon ECR Public. Supports custom build arguments, multiple platforms (amd64/arm64), and uses GitHub Actions cache for faster builds. Use this to publish production-ready container images.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| image_name | Name of the Docker image (e.g., k8s-logs-controller) | Yes | - |
| context | Build context directory | Yes | - |
| dockerfile | Path to Dockerfile relative to context | No | Dockerfile |
| platforms | Target platforms for multi-arch build | No | linux/amd64,linux/arm64 |
| ecr_registry | ECR registry URL | No | public.ecr.aws/nullplatform |
| tag | Additional tag for the image (latest and sha are always added) | No | '' |
| aws_region | AWS region for ECR | No | us-east-1 |
| build_args | Docker build arguments (newline-separated) | No | '' |

**Secrets required**
- `aws_role_arn`: AWS IAM Role ARN for OIDC authentication

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/docker-build-push-ecr.yml@main
with:
  image_name: my-app
  context: .
  dockerfile: Dockerfile
  tag: v1.2.3
  platforms: 'linux/amd64,linux/arm64'
  build_args: |
    NODE_VERSION=20
    BUILD_ENV=production
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
```

### Docker Build and Push to ECR (Nullplatform)

Integrates Docker image builds with Nullplatform's build lifecycle management. Uses your project's Makefile for building and pushing, automatically tracking build status in Nullplatform. Use this when deploying applications managed by Nullplatform.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| platforms | Target platforms for multi-arch build (passed as DOCKER_PLATFORMS env var to make) | No | linux/amd64,linux/arm64 |

**Secrets required**
- `nullplatform_api_key`: Nullplatform API key for CLI authentication

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/docker-build-push-np-ecr.yml@main
with:
  platforms: 'linux/amd64,linux/arm64'
secrets:
  nullplatform_api_key: ${{ secrets.NULLPLATFORM_API_KEY }}
```

### PR Checks - Docker Build

Validates that Docker images build successfully in pull requests. Supports both legacy `--build-arg` and modern BuildKit `--secret` for passing the GitHub token to private dependency installation. Use this to catch Docker build issues before merging.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| context | Docker build context path | No | . |
| dockerfile | Path to the Dockerfile | No | Dockerfile |
| use_buildkit_secret | Use BuildKit --secret for GITHUB_TOKEN instead of --build-arg | No | false |

**Secrets required**
- None (uses `GITHUB_TOKEN` automatically, or `CI_TOKEN` if available)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-docker.yml@main
with:
  context: .
  dockerfile: Dockerfile
  use_buildkit_secret: true
```

### PR Checks - Go

Runs linting and tests for Go projects in pull requests. Automatically detects Go version from `go.mod` or uses a specified version. Use this to validate Go code changes before merging.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for go commands | No | . |
| go-version | Go version (overrides go.mod if set) | No | '' |

**Secrets required**
- None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-go.yml@main
with:
  working-directory: ./services/api
  go-version: '1.21'
```

### PR Checks - Node (npm)

Runs linting and tests for Node.js projects using npm. Automatically detects Node version from `.node-version` file and runs the first available linting command (test:static or lint). Use this for npm-based projects.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for npm commands | No | . |
| node-version | Node.js version (overrides .node-version file if set) | No | '' |

**Secrets required**
- None (uses `GITHUB_TOKEN` or `CI_TOKEN` for private packages)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-npm.yml@main
with:
  working-directory: ./frontend
  node-version: '20'
```

### PR Checks - Node (pnpm)

Runs linting and tests for Node.js projects using pnpm. Supports pnpm workspaces and monorepos, with automatic Node version detection. Use this for pnpm-based projects.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for pnpm commands | No | . |
| node-version | Node.js version (overrides .node-version file if set) | No | '' |

**Secrets required**
- None (uses `GITHUB_TOKEN` or `CI_TOKEN` for private packages)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-pnpm.yml@main
with:
  working-directory: ./packages/core
  node-version: '20'
```

### PR Checks - Node Build (pnpm)

Validates that Node.js projects build successfully using pnpm. Only runs the build step without tests, useful for checking build artifacts. Use this to ensure production builds work before merging.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for pnpm commands | No | . |
| node-version | Node.js version (overrides .node-version file if set) | No | '' |

**Secrets required**
- None (uses `GITHUB_TOKEN

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

A test build can't be mistaken for a release:

- The tag always starts with `test-` and never contains a dot, so it never looks like a version to `docker-build-push-ecr` or `ecr-security-scan`. Release tags must never start with `test-`.
- The artifact is owned by the `NP_TEST_ARTIFACT_NRN` variable, which must differ from `NP_ARTIFACT_NRN`. Artifacts are unique on (owner NRN, registry, repository), so test builds become revisions of a separate artifact and never the newest revision of the release artifact. That newest revision is what the UI's **Existing artifact** picker and tag-less lookups default to.
- The revision carries `com.nullplatform.build.type=test`, `com.nullplatform.build.branch` and `com.nullplatform.build.run` annotations, plus `org.opencontainers.image.source` and `org.opencontainers.image.revision`.
- The artifact is visible to its owner NRN only, unless `artifact_visible_to` adds NRNs. `organization=*` is refused.

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
| register_artifact | Register the image as an artifact owned by `NP_TEST_ARTIFACT_NRN` | No | true |
| artifact_visible_to | Extra NRNs that can use the test artifact, space or comma separated | No | '' (owner NRN only) |
| np_cli_version | np CLI version/channel for artifact registration | No | alpha |

**Secrets**
- `aws_role_arn` (required): AWS IAM Role ARN for OIDC auth against ECR
- `artifact_np_api_key`: nullplatform API key allowed to create artifacts at `NP_TEST_ARTIFACT_NRN` (required while `register_artifact` is true)

**Outputs**: `image_tag`, `image_digest`, `artifact_id`, `artifact_revision_id`.

Reads the `NP_TEST_ARTIFACT_NRN` and `NP_ARTIFACT_NRN` repository/organization variables, and requires the caller to grant `contents: read` and `id-token: write`. A preflight job checks the permissions and the artifact wiring before anything is built.

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
