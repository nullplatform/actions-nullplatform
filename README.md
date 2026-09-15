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
| [auto-merge-release-pr](#auto-merge-release-pr) | 📦 Release & Changelog | Auto-merges release-please PRs after all other CI checks pass, using a GitHub App token to trigger downstream workflows |
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Validates PR branch names against a conventional prefix pattern, with automatic exemptions for release-please and Dependabot branches |
| [Changelog and Release](#changelog-and-release) | 📦 Release & Changelog | Generates changelogs from conventional commits, bumps semver, and creates GitHub Releases for helm-charts, npm, or generic projects |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Lints all commits in a PR against the Conventional Commits spec using commitlint |
| [Docker Build and Push to ECR](#docker-build-push-to-ecr) | 🚀 Build & Deploy | Builds a multi-arch Docker image and pushes it to Amazon ECR Public using OIDC authentication |
| [Docker Build and Push to ECR (nullplatform)](#docker-build-and-push-to-ecr-nullplatform) | 🚀 Build & Deploy | Builds and pushes a Docker image via `make build`/`make push`, integrated with the nullplatform CI lifecycle |
| [Docker Security Scan](#docker-security-scan) | 🔒 Security | Builds a Docker image locally and scans it with Trivy, optionally uploading SARIF results to the GitHub Security tab |
| [ECR Security Scan](#ecr-security-scan) | 🔒 Security | Scans a list of images already in Amazon ECR Public with Trivy and sends Slack alerts when CRITICAL or HIGH vulnerabilities are found |
| [pr-checks-actions](#pr-checks-actions) | 🔍 CI & Validation | Validates GitHub Actions workflow syntax with actionlint and scans files for accidentally committed secrets with Trivy |
| [PR Checks - Docker Build](#pr-checks---docker-build) | 🔍 CI & Validation | Validates that a Docker image builds successfully on PRs, supporting both legacy `--build-arg` and BuildKit secret injection |
| [PR Checks - Go](#pr-checks---go) | 🔍 CI & Validation | Runs `go vet` and `go test` with optional private module access via a GitHub App token or PAT |
| [PR Checks - Node (npm)](#pr-checks---node-npm) | 🔍 CI & Validation | Installs npm dependencies and runs lint and tests for Node.js projects using npm |
| [PR Checks - Node Build (pnpm)](#pr-checks---node-build-pnpm) | 🔍 CI & Validation | Installs pnpm dependencies and runs the build step for Node.js projects using pnpm |
| [PR Checks - Node (pnpm)](#pr-checks---node-pnpm) | 🔍 CI & Validation | Installs pnpm dependencies and runs lint and tests for Node.js projects using pnpm |
| [PR Checks - Terraform](#pr-checks---terraform) | 🔍 CI & Validation | Orchestrates lint/validate, tfsec security scanning, and optional OpenTofu tests for Terraform/OpenTofu pull requests |
| [tofu-pre-release](#tofu-pre-release) | 📦 Release & Changelog | Posts a changelog preview comment on PRs using semantic-release dry-run output |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | Generates or updates README files using AI for changed or all project directories, with support for multiple AI providers |
| [release-publish-oci](#release-publish-oci) | 📦 Release & Changelog | Full OCI release pipeline: runs release-please, builds and pushes to ECR, registers a nullplatform artifact, and finalizes the GitHub Release |
| [release](#release) | 📦 Release & Changelog | Runs release-please to cut a versioned release and optionally updates `ref=vX.Y.Z` pins in README files |
| [shellcheck](#shellcheck) | 🔍 CI & Validation | Runs ShellCheck against `.sh` files and extensionless shell scripts, with auto-discovery when no paths are specified |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Generates and injects Terraform/OpenTofu module documentation into README files using terraform-docs |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Runs `tofu init`, `tofu fmt -check`, and `tofu validate` against an OpenTofu configuration |
| [tofu-test](#tofu-test) | 🔍 CI & Validation | Runs `tofu test` in parallel across a matrix of specified module paths |
| [trivy-tofu-scan](#trivy-tofu-scan) | 🔒 Security | Scans OpenTofu/Terraform IaC files with Trivy for CRITICAL and HIGH misconfigurations, uploading SARIF results to the Security tab |
| [readme-ai-generator-v2 (actions)](#readme-ai-generator-v2-actions) | 📚 Documentation | Regenerates the repository README when workflow files change, using AI to summarize available actions |

---

## 🔍 CI & Validation

### branch-validation

Validates that PR branch names match a conventional `type/description` pattern (e.g., `feat/add-login`, `fix/bug-123`). Branches created by release-please and Dependabot are automatically exempted. Use this on the `pull_request` event to enforce branch naming standards before review.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `pattern` | Regex pattern for branch name validation | No | `^(feat\|feature\|fix\|docs\|style\|refactor\|perf\|test\|build\|ci\|chore\|revert)/.+$` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/branch-validation.yml@main
```

---

### conventional-commit

Validates every commit in a pull request against the Conventional Commits specification using `commitlint` with the `@commitlint/config-conventional` preset. Accepted types include `feat`, `fix`, `docs`, `chore`, `revert`, and others. Use this on the `pull_request` event to enforce consistent commit history before merge.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

---

### pr-checks-actions

Runs two independent checks on pull requests: **actionlint** validates the syntax of all GitHub Actions workflow files, and **Trivy** scans the repository filesystem for accidentally committed credentials or secrets. Use this in actions/workflow repositories to gate merges on workflow correctness and secret hygiene.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-actions.yml@main
```

---

### PR Checks - Docker Build

Verifies that a Docker image builds successfully without pushing it, intended as a PR gate. Supports injecting a `GITHUB_TOKEN` either as a `--build-arg` (legacy) or as a BuildKit secret (preferred). Optionally mints a short-lived GitHub App token for builds that need access to private source repositories.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `context` | Docker build context path | No | `.` |
| `dockerfile` | Path to the Dockerfile | No | `Dockerfile` |
| `use-app-token` | Mint a GitHub App token for private source access (requires `CI_APP_ID`/`CI_APP_PRIVATE_KEY` org secrets) | No | `false` |
| `use_buildkit_secret` | Use BuildKit `--secret` for `GITHUB_TOKEN` instead of `--build-arg` | No | `false` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-docker.yml@main
with:
  context: .
  dockerfile: Dockerfile
  use_buildkit_secret: true
```

---

### PR Checks - Go

Runs `go vet ./...` and `go test ./...` for Go projects. Configures `GOPRIVATE` and wires a `git` credential for private module access via a GitHub App token, `CI_TOKEN`, or `DEPENDABOT_TOKEN`. Set `require-private-modules: true` to fail fast with a clear error when no credential is present rather than letting `go get` fail with a confusing 404.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `working-directory` | Directory where `go` commands run | No | `.` |
| `go-version` | Explicit Go version (overrides `go.mod` if set) | No | `''` |
| `go-private` | `GOPRIVATE` glob for private modules | No | `github.com/nullplatform/*` |
| `use-app-token` | Mint a GitHub App token for private module access | No | `false` |
| `require-private-modules` | Fail fast if no credential is available for private modules | No | `false` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-go.yml@main
with:
  working-directory: .
  go-private: github.com/nullplatform/*
  require-private-modules: true
  use-app-token: true
```

---

### PR Checks - Node (npm)

Installs npm dependencies with `npm ci` and runs lint (detecting `test:static` or `lint` scripts) followed by `npm test`. Resolves a `GITHUB_TOKEN` from `CI_TOKEN`, `DEPENDABOT_TOKEN`, or the default token for packages access. Reads the Node.js version from `.node-version` unless overridden.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `working-directory` | Directory where npm commands run | No | `.` |
| `node-version` | Explicit Node.js version (overrides `.node-version` if set) | No | `''` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-npm.yml@main
with:
  working-directory: .
  node-version: '20'
```

---

### PR Checks - Node Build (pnpm)

Installs pnpm dependencies and runs the `pnpm build` step. Use this as a PR gate for projects that require a compilation or bundling step before deployment. Reads the Node.js version from `.node-version` unless overridden.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `working-directory` | Directory where pnpm commands run | No | `.` |
| `node-version` | Explicit Node.js version (overrides `.node-version` if set) | No | `''` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-pnpm-build.yml@main
with:
  working-directory: packages/my-lib
  node-version: '20'
```

---

### PR Checks - Node (pnpm)

Installs pnpm dependencies and runs lint (detecting `test:static` or `lint` scripts) followed by `pnpm test`. Resolves a `GITHUB_TOKEN` from `CI_TOKEN`, `DEPENDABOT_TOKEN`, or the default token. Reads the Node.js version from `.node-version` unless overridden.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `working-directory` | Directory where pnpm commands run | No | `.` |
| `node-version` | Explicit Node.js version (overrides `.node-version` if set) | No | `''` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-pnpm.yml@main
with:
  working-directory: .
  node-version: '20'
```

---

### PR Checks - Terraform

Orchestrates three checks for Terraform/OpenTofu pull requests: format/validate linting via `tofu-lint`, security scanning via `tfsec`, and optional `tofu test` execution across a matrix of module paths. Acts as a single-entry-point caller for the individual specialized workflows.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `minimum_severity` | Minimum severity for tfsec (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) | No | `HIGH` |
| `upload_sarif` | Upload SARIF results to the GitHub Security tab | No | `true` |
| `post_comment` | Post a PR comment if the tfsec scan fails | No | `true` |
| `run_tests` | Run `tofu test` on specified modules | No | `false` |
| `modules` | JSON array of module paths to test | No | `''` |
| `tofu_version` | OpenTofu version for `tofu test` | No | `1.10.6` |
| `skip_backend` | Run `tofu init` with `-backend=false` | No | `false` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-terraform.yml@main
with:
  minimum_severity: HIGH
  upload_sarif: true
  post_comment: true
  run_tests: true
  modules: '["modules/vpc", "modules/eks"]'
  skip_backend: true
```

---

### shellcheck

Runs ShellCheck against shell scripts in the repository. When no paths are provided, auto-discovers both `.sh` files and extensionless files that contain a shell shebang line, avoiding false negatives on scripts without file extensions. Excludes `.git`, `.terraform`, and `node_modules` directories.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `script_dirs` | Space-separated dirs/files to scan. Empty = auto-discover | No | `''` |
| `severity` | Minimum severity level (`error`, `warning`, `info`, `style`) | No | `error` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/shellcheck.yml@main
with:
  script_dirs: scripts/ bin/
  severity: warning
```

---

### tofu-lint

Runs `tofu init`, `tofu fmt -check`, and `tofu validate -no-color` against an OpenTofu/Terraform configuration. Use `skip_backend: true` for repositories with remote backends to avoid requiring backend credentials during PR checks.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `skip_backend` | Run `tofu init` with `-backend=false` | No | `false` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-lint.yml@main
with:
  skip_backend: true
```

---

### tofu-test

Runs `tofu test` in parallel (max 2 at a time) across a matrix of module paths. Each module is initialized with `-backend=false` to avoid requiring remote state credentials. Use `fail-fast: false` behavior is built in so a failure in one module does not abort the others.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `modules` | JSON array of module paths to test | Yes | — |
| `tofu_version` | OpenTofu version to use | No | `1.10.6` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-test.yml@main
with:
  modules: '["modules/vpc", "modules/eks", "modules/rds"]'
  tofu_version: '1.

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
