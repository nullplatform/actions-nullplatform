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
|----------|----------|-------------|
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Validates PR branch names against a conventional naming pattern |
| [Changelog and Release](#changelog-and-release) | 📦 Release & Changelog | Generates changelogs and bumps versions for npm, Helm, and generic projects |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Validates PR commits conform to Conventional Commits specification |
| [Docker Build and Push to ECR](#docker-build-and-push-to-ecr) | 🚀 Build & Deploy | Builds multi-arch Docker images and pushes them to Amazon ECR Public |
| [Docker Build and Push to ECR (Nullplatform)](#docker-build-and-push-to-ecr-nullplatform) | 🚀 Build & Deploy | Builds and pushes Docker images via Nullplatform CLI and Makefile conventions |
| [Docker Security Scan](#docker-security-scan) | 🔒 Security | Builds a local Docker image and scans it for vulnerabilities using Trivy |
| [ECR Security Scan](#ecr-security-scan) | 🔒 Security | Scans latest ECR Public images for vulnerabilities and sends Slack alerts |
| [pr-checks-actions](#pr-checks-actions) | 🔍 CI & Validation | Lints GitHub Actions workflow syntax and scans for hardcoded secrets |
| [PR Checks - Docker Build](#pr-checks---docker-build) | 🚀 Build & Deploy | Validates a Dockerfile builds successfully on pull requests |
| [PR Checks - Go](#pr-checks---go) | 🔍 CI & Validation | Runs `go vet` and `go test` for Go projects on pull requests |
| [PR Checks - Node (npm)](#pr-checks---node-npm) | 🔍 CI & Validation | Runs linting and tests for Node.js projects using npm |
| [PR Checks - Node Build (pnpm)](#pr-checks---node-build-pnpm) | 🔍 CI & Validation | Runs `pnpm build` to validate the build compiles successfully |
| [PR Checks - Node (pnpm)](#pr-checks---node-pnpm) | 🔍 CI & Validation | Runs linting and tests for Node.js projects using pnpm |
| [PR Checks - Terraform](#pr-checks---terraform) | 🔍 CI & Validation | Orchestrates Terraform/OpenTofu lint, security scan, and optional module tests |
| [tofu-pre-release](#tofu-pre-release) | 📦 Release & Changelog | Posts a semantic-release changelog preview comment on pull requests |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | Generates AI-powered README files for changed or all project directories |
| [tofu-release](#tofu-release) | 📦 Release & Changelog | Runs Release Please and updates version references in README files post-release |
| [shellcheck](#shellcheck) | 🔍 CI & Validation | Runs ShellCheck static analysis on shell scripts |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Auto-generates Terraform/OpenTofu module documentation into README files |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Runs `tofu init`, `tofu fmt`, and `tofu validate` on OpenTofu configurations |
| [tofu-test](#tofu-test) | 🔍 CI & Validation | Runs `tofu test` across a matrix of specified module paths |
| [trivy-tofu-scan](#trivy-tofu-scan) | 🔒 Security | Scans Terraform/OpenTofu IaC files for CRITICAL and HIGH misconfigurations |

---

## 🔍 CI & Validation

### branch-validation

Validates that pull request branch names conform to a conventional `type/description` format (e.g., `feat/add-login`, `fix/bug-123`). Automatically skips validation for `release-please--*` branches. Use this on `pull_request` events to enforce branch naming standards across your repository.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `pattern` | Regex pattern for branch name validation | No | `^(feat\|feature\|fix\|docs\|style\|refactor\|perf\|test\|build\|ci\|chore\|revert)/.+$` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/branch-validation.yml@main
```

---

### conventional-commit

Validates all commits in a pull request against the [Conventional Commits](https://www.conventionalcommits.org/) specification using `commitlint`. Enforces valid types (`feat`, `fix`, `chore`, etc.) and disallows sentence/pascal/upper case subjects. Use this on `pull_request` events to maintain a consistent commit history suitable for automated changelogs.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

---

### pr-checks-actions

Validates GitHub Actions workflow syntax using `actionlint` and scans the repository filesystem for hardcoded credentials using Trivy's secret scanner. Use this on pull requests that modify workflow files to catch syntax errors and accidental secret exposure before merging.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-actions.yml@main
```

---

### PR Checks - Docker Build

Validates that a Dockerfile builds successfully without publishing the image. Supports both the legacy `--build-arg GITHUB_TOKEN` pattern and the more secure BuildKit `--secret` approach. Use this on pull requests to catch broken Dockerfiles early.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `context` | Docker build context path | No | `.` |
| `dockerfile` | Path to the Dockerfile | No | `Dockerfile` |
| `use_buildkit_secret` | Use BuildKit `--secret` for `GITHUB_TOKEN` instead of `--build-arg` | No | `false` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-docker.yml@main
with:
  context: .
  dockerfile: Dockerfile
  use_buildkit_secret: false
```

---

### PR Checks - Go

Runs `go vet ./...` and `go test ./...` for Go projects. Reads the Go version from `go.mod` by default, or uses an explicit version if specified. Use this on pull requests to enforce code quality and prevent test regressions.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `working-directory` | Working directory for go commands | No | `.` |
| `go-version` | Go version (overrides `go.mod` if set) | No | `''` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-go.yml@main
with:
  working-directory: .
```

---

### PR Checks - Node (npm)

Installs npm dependencies and runs linting (`test:static` or `lint` script, whichever exists first) followed by `npm test`. Reads the Node.js version from `.node-version` by default. Use this on pull requests for Node.js projects managed with npm.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `working-directory` | Working directory for npm commands | No | `.` |
| `node-version` | Node.js version (overrides `.node-version` file if set) | No | `''` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-npm.yml@main
with:
  working-directory: .
```

---

### PR Checks - Node Build (pnpm)

Installs pnpm dependencies and runs `pnpm build` to verify the project compiles without errors. Reads the Node.js version from `.node-version` by default. Use this on pull requests for frontend or library projects that require a build step.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `working-directory` | Working directory for pnpm commands | No | `.` |
| `node-version` | Node.js version (overrides `.node-version` file if set) | No | `''` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-pnpm-build.yml@main
with:
  working-directory: .
```

---

### PR Checks - Node (pnpm)

Installs pnpm dependencies and runs linting (`test:static` or `lint` script, whichever exists first) followed by `pnpm test`. Reads the Node.js version from `.node-version` by default. Use this on pull requests for Node.js projects managed with pnpm.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `working-directory` | Working directory for pnpm commands | No | `.` |
| `node-version` | Node.js version (overrides `.node-version` file if set) | No | `''` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-pnpm.yml@main
with:
  working-directory: .
```

---

### PR Checks - Terraform

Orchestrates a full pull request validation suite for Terraform/OpenTofu repositories by calling three reusable workflows: `tofu-lint` (init/fmt/validate), `tfsec` (security scan), and optionally `tofu-test` (module tests). Use this as a single entry point for all Terraform PR checks.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `minimum_severity` | Minimum severity for tfsec (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) | No | `HIGH` |
| `upload_sarif` | Upload SARIF results to GitHub Security tab | No | `true` |
| `post_comment` | Post a PR comment if tfsec scan fails | No | `true` |
| `run_tests` | Run `tofu test` on specified modules | No | `false` |
| `modules` | JSON array of module paths to test | No | `''` |
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
  modules: '["modules/vpc", "modules/iam"]'
  skip_backend: true
```

---

### shellcheck

Runs [ShellCheck](https://www.shellcheck.net/) static analysis against shell scripts. Scans a specified set of directories/files or recursively finds all `*.sh` files when no target is given. Use this on pull requests or push events to catch shell scripting bugs and portability issues.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `script_dirs` | Space-separated dirs/files to scan. When empty, finds `*.sh` recursively. | No | `''` |
| `severity` | Minimum severity (`error`, `warning`, `info`, `style`) | No | `error` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/shellcheck.yml@main
with:
  script_dirs: scripts/ bin/
  severity: warning
```

---

### tofu-lint

Runs `tofu init`, `tofu fmt -check`, and `tofu validate` to ensure OpenTofu configurations are correctly formatted and syntactically valid. Supports `‑backend=false` for repositories with remote backends that cannot be initialized in CI. Use this on pull requests as a lightweight Terraform quality gate.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `skip_backend` | Run `tofu init` with `-backend=false` | No | `false` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-lint.yml@main
with:
  skip_backend: true
```

---

### tofu-test

Runs `tofu test` for each module path provided in a JSON array, using a parallel matrix strategy (`max-parallel: 2`). Each module is initialized with `-backend=false` before testing. Use this to run native OpenTofu unit tests across multiple modules in a single workflow call.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `modules` | JSON array of module paths to test | **Yes** | — |
| `tofu_version` | OpenTofu version to use | No | `1.10.6` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-test.yml@main
with:
  modules: '["modules/vpc", "modules/iam", "modules/eks"]'
  tofu_version: 1.10.6
```

---

## 🔒 Security

### Docker Security Scan

Builds a Docker image locally (for `linux/amd64`) and scans it for known vulnerabilities using Trivy. Results are optionally uploaded to the GitHub Security tab as SARIF. The workflow fails if vulnerabilities at or above the configured severity are found. Use this on pull requests or scheduled jobs to catch vulnerable base images or packages before they reach production.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `context` | Build context directory | **Yes** | — |
| `image_name` | Name for the scanned image (used for reporting) | **Yes** | — |
| `dockerfile` | Path to Dockerfile relative to context | No | `Dockerfile` |
| `severity` | Minimum severity to report (`CRITICAL,HIGH,MEDIUM,LOW`) | No | `CRITICAL,HIGH` |
| `build_args` | Docker build arguments (multiline, one per line: `KEY=VALUE`) | No | `''` |
| `exit_code` | Exit code when vulnerabilities are found (`0` to not fail) | No | `1` |
| `upload_sarif` | Upload SARIF results to GitHub Security tab | No | `true` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/docker-security-scan.yml@main
with:
  context: .
  image_name: my-app
  dockerfile: Dockerfile
  severity: CRITICAL,HIGH
  upload_sarif: true
```

---

### ECR Security Scan

Pulls the latest semver-tagged images from Amazon ECR Public for each name in the provided JSON array, scans them with Trivy, and sends a Slack alert when CRITICAL or HIGH vulnerabilities are found. SARIF results are optionally uploaded to the GitHub Security tab. Use this in scheduled workflows to continuously monitor published images for newly disclosed vulnerabilities.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `image_names` | JSON array of image names to scan | **Yes** | — |
| `ecr_registry` | ECR registry URL | No | `public.ecr.aws/nullplatform` |
| `severity` | Minimum severity to report | No | `CRITICAL,HIGH` |
| `upload_sarif` | Upload SARIF results to GitHub Security tab | No | `true`

<!-- ACTIONS-END -->

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
