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
| [auto-merge-release-pr](#auto-merge-release-pr) | 🚀 Build & Deploy | Automatically merges release-please PRs after all other CI checks pass |
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Validates PR branch names against a conventional naming pattern |
| [Changelog and Release](#changelog-and-release) | 📦 Release & Changelog | Generates changelogs and bumps versions for helm-charts, npm, and generic projects |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Lints commit messages against the Conventional Commits specification |
| [Docker Build and Push to ECR](#docker-build-and-push-to-ecr) | 🚀 Build & Deploy | Builds a multi-arch Docker image and pushes it to Amazon ECR Public |
| [Docker Build and Push to ECR (nullplatform)](#docker-build-and-push-to-ecr-nullplatform) | 🚀 Build & Deploy | Builds and pushes a Docker image via the nullplatform CLI and Makefile conventions |
| [Docker Security Scan](#docker-security-scan) | 🔒 Security | Builds a Docker image locally and runs Trivy vulnerability scanning against it |
| [ECR Security Scan](#ecr-security-scan) | 🔒 Security | Pulls and scans production ECR images with Trivy, sending Slack alerts on findings |
| [pr-checks-actions](#pr-checks-actions) | 🔍 CI & Validation | Validates GitHub Actions workflow syntax with actionlint and scans for leaked credentials |
| [PR Checks - Docker Build](#pr-checks---docker-build) | 🚀 Build & Deploy | Validates that a Docker image builds successfully on pull requests |
| [PR Checks - Go](#pr-checks---go) | 🔍 CI & Validation | Runs `go vet` and `go test` with support for private module authentication |
| [PR Checks - Node (npm)](#pr-checks---node-npm) | 🔍 CI & Validation | Installs npm dependencies, runs linting and tests for Node.js projects |
| [PR Checks - Node Build (pnpm)](#pr-checks---node-build-pnpm) | 🔍 CI & Validation | Installs pnpm dependencies and runs the build step for Node.js projects |
| [PR Checks - Node (pnpm)](#pr-checks---node-pnpm) | 🔍 CI & Validation | Installs pnpm dependencies, runs linting and tests for Node.js projects |
| [PR Checks - Terraform](#pr-checks---terraform) | 🔍 CI & Validation | Orchestrates lint, security scan, and optional tofu tests for Terraform/OpenTofu PRs |
| [tofu-pre-release](#tofu-pre-release) | 📦 Release & Changelog | Posts a changelog preview comment on a PR using semantic-release |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | Generates or updates README files using AI for changed or all project directories |
| [release-publish-oci](#release-publish-oci) | 📦 Release & Changelog | Full release pipeline: runs release-please, builds and pushes an OCI image, registers the artifact, and finalizes the GitHub Release |
| [release](#release) | 📦 Release & Changelog | Runs release-please to create releases and optionally updates `ref=vX.Y.Z` version pins in READMEs |
| [shellcheck](#shellcheck) | 🔍 CI & Validation | Runs ShellCheck on shell scripts, auto-discovering both `.sh` files and extensionless scripts |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Generates and injects Terraform/OpenTofu module documentation into README files |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Runs `tofu init`, `tofu fmt -check`, and `tofu validate` on the repository |
| [tofu-test](#tofu-test) | 🔍 CI & Validation | Runs `tofu test` against a matrix of specified module paths |
| [trivy-tofu-scan](#trivy-tofu-scan) | 🔒 Security | Scans OpenTofu/Terraform IaC files for CRITICAL and HIGH misconfigurations using Trivy |

---

## 🔍 CI & Validation

### branch-validation

Validates that a pull request's source branch name matches a conventional `type/description` pattern (e.g., `feat/add-login`). Automatically skips validation for `release-please` and `dependabot` branches. Use this on `pull_request` events to enforce consistent branch naming across your team.

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

Lints all commits in a pull request against the [Conventional Commits](https://www.conventionalcommits.org/) specification using `commitlint`. Enforces valid commit types (`feat`, `fix`, `docs`, etc.) and disallows sentence-case, start-case, pascal-case, and upper-case subjects. Use this on `pull_request` events to keep your commit history consistent.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

---

### pr-checks-actions

Validates GitHub Actions workflow files using `actionlint` to catch syntax errors, and scans the repository filesystem for accidentally committed secrets or credentials using Trivy. Runs on pull requests targeting repositories that contain workflow files.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-actions.yml@main
```

---

### PR Checks - Docker Build

Verifies that a Docker image builds successfully on every pull request without pushing it to a registry. Supports both legacy `--build-arg GITHUB_TOKEN` and BuildKit `--secret` patterns, and can optionally mint a short-lived GitHub App token for accessing private dependencies.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `context` | Docker build context path | No | `.` |
| `dockerfile` | Path to the Dockerfile | No | `Dockerfile` |
| `use-app-token` | Mint a GitHub App token for private source access (requires `CI_APP_ID` and `CI_APP_PRIVATE_KEY` org secrets) | No | `false` |
| `use_buildkit_secret` | Use BuildKit `--secret` for `GITHUB_TOKEN` instead of `--build-arg` | No | `false` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-docker.yml@main
with:
  context: .
  dockerfile: Dockerfile
```

---

### PR Checks - Go

Runs `go vet ./...` and `go test ./...` for Go projects. Supports private module authentication via a GitHub App token, a `CI_TOKEN` PAT, or `DEPENDABOT_TOKEN`, configuring `GOPRIVATE` and `git` credential rewrites automatically. Set `require-private-modules: true` to fail fast when no credential is available.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `working-directory` | Working directory for go commands | No | `.` |
| `go-version` | Go version (overrides `go.mod` if set) | No | `''` (reads `go.mod`) |
| `go-private` | `GOPRIVATE` glob for private modules | No | `github.com/nullplatform/*` |
| `use-app-token` | Mint a GitHub App token for private module access | No | `false` |
| `require-private-modules` | Fail fast if no credential is available for private modules | No | `false` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-go.yml@main
with:
  working-directory: .
  go-private: github.com/nullplatform/*
```

---

### PR Checks - Node (npm)

Installs npm dependencies with `npm ci`, runs the first available lint script (`test:static` or `lint`), and then runs `npm test`. Resolves a `GITHUB_TOKEN` from `CI_TOKEN`, `DEPENDABOT_TOKEN`, or the default `GITHUB_TOKEN` to support private package access.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `working-directory` | Working directory for npm commands | No | `.` |
| `node-version` | Node.js version (overrides `.node-version` file if set) | No | `''` (reads `.node-version`) |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-npm.yml@main
with:
  working-directory: .
  node-version: '20'
```

---

### PR Checks - Node Build (pnpm)

Installs pnpm dependencies and runs `pnpm build`. Use this for projects where the PR check is a build verification rather than a test run — for example, TypeScript libraries or CLI tools that must compile without errors.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `working-directory` | Working directory for pnpm commands | No | `.` |
| `node-version` | Node.js version (overrides `.node-version` file if set) | No | `''` (reads `.node-version`) |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-pnpm-build.yml@main
with:
  working-directory: .
  node-version: '20'
```

---

### PR Checks - Node (pnpm)

Installs pnpm dependencies, runs the first available lint script (`test:static` or `lint`), and then runs `pnpm test`. Resolves a `GITHUB_TOKEN` from `CI_TOKEN`, `DEPENDABOT_TOKEN`, or the default `GITHUB_TOKEN` to support private package access.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `working-directory` | Working directory for pnpm commands | No | `.` |
| `node-version` | Node.js version (overrides `.node-version` file if set) | No | `''` (reads `.node-version`) |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-pnpm.yml@main
with:
  working-directory: .
  node-version: '20'
```

---

### PR Checks - Terraform

Orchestrates three checks for Terraform/OpenTofu pull requests: formatting and validation via `tofu-lint`, security scanning via `tfsec`, and optional `tofu test` execution against a matrix of modules. Use as a single entry point for all Terraform PR validation.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `minimum_severity` | Minimum severity for tfsec (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) | No | `HIGH` |
| `upload_sarif` | Upload SARIF results to GitHub Security tab | No | `true` |
| `post_comment` | Post a PR comment if the tfsec scan fails | No | `true` |
| `run_tests` | Run `tofu test` on specified modules | No | `false` |
| `modules` | JSON array of module paths to test (e.g. `["module/a", "module/b"]`) | No | `''` |
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
  modules: '["modules/vpc", "modules/ecs"]'
  skip_backend: true
```

---

### shellcheck

Runs ShellCheck against shell scripts in the repository. When no explicit paths are provided, auto-discovers all `.sh` files and extensionless files that contain a shell shebang (`#!/bin/sh`, `#!/bin/bash`, etc.), excluding `.git`, `.terraform`, and `node_modules`.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `script_dirs` | Space-separated dirs/files to scan; empty triggers auto-discovery | No | `''` (auto-discover) |
| `severity` | Minimum severity (`error`, `warning`, `info`, `style`) | No | `error` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/shellcheck.yml@main
with:
  script_dirs: scripts/ tools/
  severity: warning
```

---

### tofu-lint

Runs `tofu init`, `tofu fmt -check`, and `tofu validate -no-color` using OpenTofu v1.10.5. Pass `skip_backend: true` for repositories with remote backends that cannot be initialised in CI without credentials.

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

Runs `tofu init -backend=false` and `tofu test` for each module path supplied as a JSON array, using a parallel matrix strategy (max 2 concurrent jobs, `fail-fast: false`). Use this to run unit tests against individual OpenTofu modules.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `modules` | JSON array of module paths to test (e.g. `["module/a", "module/b"]`) | **Yes** | — |
| `tofu_version` | OpenTofu version to use | No | `1.10.6` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-test.yml@main
with:
  modules: '["modules/vpc", "modules/rds"]'
  tofu_version: '1.10.6'
```

---

## 🔒 Security

### Docker Security Scan

Builds a Docker image locally (without pushing) and runs Trivy to detect known vulnerabilities in OS packages and dependencies. Optionally uploads a SARIF report to the GitHub Security tab. Use this on pull requests or scheduled scans to catch vulnerabilities before images are published.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `context` | Build context directory | **Yes** | — |
| `image_name` | Name for the scanned image (used for reporting) | **Yes** | — |
| `dockerfile` | Path to Dockerfile relative to context | No | `Dockerfile` |
| `severity` | Minimum severity to report | No | `CRITICAL,HIGH` |
| `build_args` | Docker build arguments (multiline, `KEY=VALUE` per line) | No | `''` |
| `exit_code` | Exit code when vulnerabilities are found (`0` to not fail) | No | `1` |
| `

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
