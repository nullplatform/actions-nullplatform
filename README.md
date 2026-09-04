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

## Summary Table

| Workflow | Category | Description |
|---|---|---|
| [auto-merge-release-pr](#auto-merge-release-pr) | 📦 Release & Changelog | Automatically merges release-please PRs after all other CI checks pass, using a GitHub App token to trigger downstream workflows |
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Enforces conventional branch naming (e.g. `feat/`, `fix/`) on pull requests, with automatic exemptions for release-please and Dependabot branches |
| [Changelog and Release](#changelog-and-release) | 📦 Release & Changelog | Generates changelogs from conventional commits, bumps semver versions, and creates GitHub Releases for helm-chart, npm, or generic projects |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Lints all commits in a pull request against the Conventional Commits specification using commitlint |
| [Docker Build and Push to ECR](#docker-build-push-to-ecr) | 🚀 Build & Deploy | Builds a multi-arch Docker image and pushes it to Amazon ECR Public using OIDC authentication |
| [Docker Build and Push to ECR (nullplatform)](#docker-build-and-push-to-ecr-nullplatform) | 🚀 Build & Deploy | Builds and pushes a Docker image through the nullplatform CLI (`np build start` / `make build` / `make push`), reporting build status back to nullplatform |
| [Docker Security Scan](#docker-security-scan) | 🔒 Security | Builds a Docker image locally and scans it with Trivy for vulnerabilities, optionally uploading SARIF results to the GitHub Security tab |
| [ECR Security Scan](#ecr-security-scan) | 🔒 Security | Pulls the latest semver-tagged images from ECR Public and scans them with Trivy, sending Slack alerts when CRITICAL or HIGH vulnerabilities are found |
| [pr-checks-actions](#pr-checks-actions) | 🔍 CI & Validation | Validates GitHub Actions workflow syntax with `actionlint` and scans for leaked credentials with Trivy secret scanning |
| [PR Checks - Docker Build](#pr-checks---docker-build) | 🔍 CI & Validation | Validates that a Dockerfile builds successfully on pull requests, supporting both `--build-arg` and BuildKit `--secret` token injection patterns |
| [PR Checks - Go](#pr-checks---go) | 🔍 CI & Validation | Runs `go vet` and `go test` on Go projects, with optional private-module access via a GitHub App token or PAT |
| [PR Checks - Node (npm)](#pr-checks---node-npm) | 🔍 CI & Validation | Installs npm dependencies and runs lint and tests for Node.js projects using npm |
| [PR Checks - Node Build (pnpm)](#pr-checks---node-build-pnpm) | 🔍 CI & Validation | Installs pnpm dependencies and runs the build step for Node.js projects using pnpm |
| [PR Checks - Node (pnpm)](#pr-checks---node-pnpm) | 🔍 CI & Validation | Installs pnpm dependencies and runs lint and tests for Node.js projects using pnpm |
| [PR Checks - Terraform](#pr-checks---terraform) | 🔍 CI & Validation | Orchestrates OpenTofu lint, tfsec security scan, and optional module tests for Terraform/OpenTofu pull requests |
| [tofu-pre-release](#tofu-pre-release) | 📦 Release & Changelog | Posts a changelog preview comment on a pull request using `semantic-release-github-pr` |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | Generates or updates README files using AI (Groq, GitHub Models, OpenAI, or Anthropic) for changed or all project directories |
| [release-publish-oci](#release-publish-oci) | 📦 Release & Changelog | Full release pipeline: runs release-please, builds and pushes a multi-arch OCI image to ECR, registers the artifact in nullplatform, and finalizes the GitHub Release |
| [release](#release) | 📦 Release & Changelog | Runs release-please to cut a versioned release and optionally updates `ref=vX.Y.Z` references across all README files |
| [shellcheck](#shellcheck) | 🔍 CI & Validation | Runs ShellCheck against shell scripts, auto-discovering `.sh` files and extensionless files with a shell shebang |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Generates and injects Terraform/OpenTofu module documentation into README files using terraform-docs |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Runs `tofu init`, `tofu fmt -check`, and `tofu validate` on OpenTofu configurations |
| [tofu-test](#tofu-test) | 🔍 CI & Validation | Runs `tofu test` in parallel across a matrix of specified OpenTofu module paths |
| [trivy-tofu-scan](#trivy-tofu-scan) | 🔒 Security | Scans OpenTofu/Terraform IaC files with Trivy for CRITICAL and HIGH misconfigurations, uploading SARIF results to the GitHub Security tab |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | Generates or updates README files using AI for changed or all project directories (self-updating variant triggered on workflow file changes) |

---

## 🔍 CI & Validation

### branch-validation

Validates that pull request branch names follow a conventional format (`type/description`). Automatically skips validation for `release-please--*` and `dependabot/*` branches. Use this on any repository where you want to enforce consistent branch naming conventions across contributors.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `pattern` | Regex pattern for branch name validation | No | `^(feat\|feature\|fix\|docs\|style\|refactor\|perf\|test\|build\|ci\|chore\|revert)/.+$` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/branch-validation.yml@main
with:
  pattern: '^(feat|feature|fix|docs|style|refactor|perf|test|build|ci|chore|revert)/.+$'
```

---

### conventional-commit

Lints every commit in a pull request against the [Conventional Commits](https://www.conventionalcommits.org/) specification using commitlint with `@commitlint/config-conventional`. Enforces valid types (`feat`, `fix`, `docs`, etc.) and disallows sentence/pascal/upper-case subjects. Use this to maintain a clean commit history that enables automated changelog generation.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

---

### pr-checks-actions

Validates GitHub Actions workflow files using `actionlint` and scans the repository filesystem for accidentally committed secrets using Trivy. Use this in the `actions-nullplatform` repository itself or any repo that manages reusable workflows.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-actions.yml@main
```

---

### PR Checks - Docker Build

Verifies that a Dockerfile builds successfully on every pull request without pushing the image. Supports two token-injection strategies: the legacy `--build-arg GITHUB_TOKEN` approach and the more secure BuildKit `--secret` method. Optionally mints a short-lived GitHub App token for builds that need access to private source repositories.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `context` | Docker build context path | No | `.` |
| `dockerfile` | Path to the Dockerfile | No | `Dockerfile` |
| `use-app-token` | Mint a GitHub App installation token for private source access | No | `false` |
| `use_buildkit_secret` | Use BuildKit `--secret` instead of `--build-arg` for GITHUB_TOKEN | No | `false` |

**Secrets required**

- `CI_TOKEN` *(optional)* — Personal access token fallback for private dependency access
- `DEPENDABOT_TOKEN` *(optional)* — Dependabot token fallback
- `CI_APP_ID` *(optional, required when `use-app-token: true`)* — GitHub App ID
- `CI_APP_PRIVATE_KEY` *(optional, required when `use-app-token: true`)* — GitHub App private key

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-docker.yml@main
with:
  context: .
  dockerfile: Dockerfile
  use-app-token: false
  use_buildkit_secret: false
```

---

### PR Checks - Go

Runs `go vet ./...` and `go test ./...` for Go projects. Handles private module access by configuring `GOPRIVATE` and a Git credential helper using a GitHub App token, PAT, or Dependabot token. Set `require-private-modules: true` to fail fast with a clear error when no credential is available rather than getting a confusing 404 from `go get`.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `working-directory` | Working directory for go commands | No | `.` |
| `go-version` | Go version (overrides go.mod if set) | No | `''` |
| `go-private` | GOPRIVATE glob for private modules | No | `github.com/nullplatform/*` |
| `use-app-token` | Mint a GitHub App token for private module access | No | `false` |
| `require-private-modules` | Fail fast if no credential is available for private modules | No | `false` |

**Secrets required**

- `CI_TOKEN` *(optional)* — PAT fallback for private module access
- `DEPENDABOT_TOKEN` *(optional)* — Dependabot token fallback
- `CI_APP_ID` *(optional, required when `use-app-token: true`)* — GitHub App ID
- `CI_APP_PRIVATE_KEY` *(optional, required when `use-app-token: true`)* — GitHub App private key

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-go.yml@main
with:
  working-directory: .
  go-private: 'github.com/nullplatform/*'
  use-app-token: true
  require-private-modules: true
secrets:
  CI_APP_ID: ${{ secrets.CI_APP_ID }}
  CI_APP_PRIVATE_KEY: ${{ secrets.CI_APP_PRIVATE_KEY }}
```

---

### PR Checks - Node (npm)

Runs `npm ci`, lint (`test:static` or `lint` script, whichever exists), and `npm test` for Node.js projects managed with npm. Reads the Node.js version from `.node-version` by default or from an explicit input. Uses `CI_TOKEN` / `DEPENDABOT_TOKEN` / `GITHUB_TOKEN` for private package registry access.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `working-directory` | Working directory for npm commands | No | `.` |
| `node-version` | Node.js version (overrides `.node-version` file if set) | No | `''` |

**Secrets required**

- `CI_TOKEN` *(optional)* — PAT for private GitHub Packages access
- `DEPENDABOT_TOKEN` *(optional)* — Dependabot token fallback

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-npm.yml@main
with:
  working-directory: .
  node-version: '20'
```

---

### PR Checks - Node Build (pnpm)

Installs pnpm dependencies and runs the `pnpm build` step to verify the project compiles successfully on every pull request. Use this for frontend or library projects that require a build step to detect type errors or bundler failures, but don't run a separate test suite in CI.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `working-directory` | Working directory for pnpm commands | No | `.` |
| `node-version` | Node.js version (overrides `.node-version` file if set) | No | `''` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-pnpm-build.yml@main
with:
  working-directory: .
  node-version: '20'
```

---

### PR Checks - Node (pnpm)

Runs `pnpm install`, lint (`test:static` or `lint` script, whichever exists), and `pnpm test` for Node.js projects managed with pnpm. Reads the Node.js version from `.node-version` by default or from an explicit input. Uses `CI_TOKEN` / `DEPENDABOT_TOKEN` / `GITHUB_TOKEN` for private package registry access.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `working-directory` | Working directory for pnpm commands | No | `.` |
| `node-version` | Node.js version (overrides `.node-version` file if set) | No | `''` |

**Secrets required**

- `CI_TOKEN` *(optional)* — PAT for private GitHub Packages access
- `DEPENDABOT_TOKEN` *(optional)* — Dependabot token fallback

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-pnpm.yml@main
with:
  working-directory: .
  node-version: '20'
```

---

### PR Checks - Terraform

Orchestrates the full suite of OpenTofu/Terraform pull request checks by composing three reusable workflows: `tofu-lint` (init, fmt, validate), `tfsec` (security scan with optional PR comment and SARIF upload), and optionally `tofu-test` (module unit tests). Use this as the single entry point for Terraform PR validation rather than calling each workflow individually.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `minimum_severity` | Minimum severity for tfsec (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) | No | `HIGH` |
| `upload_sarif` | Upload SARIF results to GitHub Security tab | No | `true` |
| `post_comment` | Post a PR comment when tfsec scan fails | No | `true` |
| `run_tests` | Run `tofu test` on specified modules | No | `false` |
| `modules` | JSON array of module paths to test (e.g. `["module/a", "module/b"]`) | No | `''` |
| `tofu_version` | OpenTofu version for `tofu-test` | No | `1.10.6` |
| `skip_backend` | Run `tofu init` with `-backend=false` | No | `false` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-terraform.yml@main
with:
  minimum_severity: HIGH
  upload_sarif: true
  post_comment: true
  run_tests: true
  modules: '["modules/networking", "modules/compute"]'
  tofu_version: '1.10.6'
  skip_backend: true
```

---

### shellcheck

Runs [ShellCheck](https://www.shellcheck.net/) against shell scripts in the repository. When no directories are specified, auto-discovers both `.sh` files and extensionless files whose first line contains a shell shebang

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
