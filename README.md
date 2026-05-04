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
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Validates PR branch names against a configurable conventional naming pattern |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Enforces Conventional Commits specification on all PR commits using commitlint |
| [shellcheck](#shellcheck) | 🔍 CI & Validation | Runs ShellCheck static analysis on shell scripts with configurable severity |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Runs OpenTofu init, fmt check, and validate on Terraform/OpenTofu configurations |
| [PR Checks - Docker Build](#pr-checks---docker-build) | 🚀 Build & Deploy | Validates Docker image builds on PRs with support for both legacy build-arg and BuildKit secret injection |
| [PR Checks - Go](#pr-checks---go) | 🚀 Build & Deploy | Runs go vet and go test for Go projects on PRs |
| [PR Checks - Node (npm)](#pr-checks---node-npm) | 🚀 Build & Deploy | Runs lint and tests for Node.js projects using npm on PRs |
| [PR Checks - Node Build (pnpm)](#pr-checks---node-build-pnpm) | 🚀 Build & Deploy | Runs pnpm install and build for Node.js projects using pnpm on PRs |
| [PR Checks - Node (pnpm)](#pr-checks---node-pnpm) | 🚀 Build & Deploy | Runs lint and tests for Node.js projects using pnpm on PRs |
| [PR Checks - Terraform](#pr-checks---terraform) | 🚀 Build & Deploy | Orchestrates Terraform/OpenTofu lint, tfsec security scan, and optional module tests on PRs |
| [Docker Build and Push to ECR](#docker-build-and-push-to-ecr) | 🚀 Build & Deploy | Builds a multi-arch Docker image and pushes it to Amazon ECR Public using OIDC authentication |
| [Docker Build and Push to ECR](#docker-build-and-push-to-ecr-nullplatform) | 🚀 Build & Deploy | Builds and pushes Docker images via `make build/push` integrated with the Nullplatform CI lifecycle |
| [tofu-test](#tofu-test) | 🚀 Build & Deploy | Runs `tofu test` across a matrix of OpenTofu module paths |
| [Docker Security Scan](#docker-security-scan) | 🔒 Security | Builds a Docker image locally and scans it with Trivy for vulnerabilities |
| [ECR Security Scan](#ecr-security-scan) | 🔒 Security | Scans the latest semver-tagged images in ECR Public with Trivy and sends a Slack alert on findings |
| [tfsec-security-scan](#tfsec-security-scan) | 🔒 Security | Runs tfsec on all Terraform files, uploads SARIF results, and posts a PR comment on failures |
| [Changelog and Release](#changelog-and-release) | 📦 Release & Changelog | Generates changelogs from Conventional Commits, bumps versions, creates git tags, and GitHub Releases |
| [tofu-pre-release](#tofu-pre-release) | 📦 Release & Changelog | Posts a semantic-release changelog preview as a PR comment before merging |
| [tofu-release](#tofu-release) | 📦 Release & Changelog | Runs release-please for Terraform modules and updates version references in all README files |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Generates and injects terraform-docs output into README.md files for all modules |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | AI-generates README files for changed or all project directories using a configurable LLM provider |

---

## 🔍 CI & Validation

### branch-validation

Validates that pull request branch names conform to a conventional naming pattern (e.g., `feat/my-feature`, `fix/bug-123`). Automatically skips validation for `release-please--*` branches. Use this on any repository where you want to enforce a consistent branching strategy.

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

Validates all commits in a pull request against the [Conventional Commits](https://www.conventionalcommits.org/) specification using `commitlint`. Enforces allowed types (`feat`, `fix`, `chore`, etc.) and subject casing rules. Use this on repositories that rely on commit messages for automated changelog generation or release automation.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

---

### shellcheck

Runs [ShellCheck](https://www.shellcheck.net/) static analysis on shell scripts. When no directories are specified, it recursively finds all `*.sh` files in the repository. Use this to catch common shell scripting bugs and style issues.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `script_dirs` | Space-separated directories or files to scan. Finds all `*.sh` files recursively when empty | No | `''` |
| `severity` | Minimum severity to report (`error`, `warning`, `info`, `style`) | No | `error` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/shellcheck.yml@main
with:
  script_dirs: 'scripts/ bin/'
  severity: warning
```

---

### tofu-lint

Runs `tofu init`, `tofu fmt -check`, and `tofu validate` on an OpenTofu/Terraform repository. Supports skipping the backend initialization for repositories that use remote backends requiring credentials. Use this as a fast lint gate on pull requests.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `skip_backend` | Run `tofu init` with `-backend=false` (for repos with remote backends) | No | `false` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-lint.yml@main
with:
  skip_backend: true
```

---

## 🚀 Build & Deploy

### PR Checks - Docker Build

Validates that a Docker image builds successfully on pull requests without pushing it. Supports two build modes: classic `--build-arg GITHUB_TOKEN` for standard Dockerfiles, and Docker BuildKit `--secret` injection for Dockerfiles that use secret mounts. Falls back to `GITHUB_TOKEN` if `CI_TOKEN` is not set.

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

Runs `go vet ./...` for linting and `go test ./...` for testing on Go projects. Reads the Go version from `go.mod` by default, or accepts an explicit version override. Use this as a standard PR validation gate for Go repositories.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `working-directory` | Working directory for go commands | No | `.` |
| `go-version` | Go version to use (overrides `go.mod` if set) | No | `''` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-go.yml@main
with:
  working-directory: .
  go-version: '1.22'
```

---

### PR Checks - Node (npm)

Runs `npm ci`, linting (via `test:static` or `lint` script, whichever is present), and `npm test` for Node.js projects using npm. Reads the Node.js version from `.node-version` by default. Uses `CI_TOKEN` if available for private package registry access.

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
  node-version: '20'
```

---

### PR Checks - Node Build (pnpm)

Runs `pnpm install` and `pnpm build` for Node.js projects using pnpm. Useful for repositories where a successful build compilation (e.g., TypeScript) needs to be verified on every PR without running tests.

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
  node-version: '20'
```

---

### PR Checks - Node (pnpm)

Runs `pnpm install`, linting (via `test:static` or `lint` script, whichever is present), and `pnpm test` for Node.js projects using pnpm. Reads the Node.js version from `.node-version` by default. Uses `CI_TOKEN` if available for private package registry access.

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
  node-version: '20'
```

---

### PR Checks - Terraform

Orchestrates a full Terraform/OpenTofu PR validation suite by composing three reusable workflows: `tofu-lint` (format + validate), `tfsec` (security scanning), and optionally `tofu-test` (module unit tests). Use this as the single entry point for Terraform PR checks.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `minimum_severity` | Minimum severity for tfsec (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) | No | `HIGH` |
| `upload_sarif` | Upload SARIF results to GitHub Security tab | No | `true` |
| `post_comment` | Post a PR comment if tfsec scan fails | No | `true` |
| `run_tests` | Run `tofu test` on specified modules | No | `false` |
| `modules` | JSON array of module paths to test (e.g., `["module/a", "module/b"]`) | No | `''` |
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
  modules: '["modules/vpc", "modules/iam"]'
  skip_backend: true
```

---

### Docker Build and Push to ECR

Builds a multi-architecture Docker image and pushes it to Amazon ECR Public using AWS OIDC authentication (no long-lived credentials). Tags are derived from the provided `tag` input, extracting semantic version numbers automatically. Supports GHA layer caching for faster builds.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `image_name` | Name of the Docker image | Yes | — |
| `context` | Build context directory | Yes | — |
| `dockerfile` | Path to Dockerfile relative to context | No | `Dockerfile` |
| `platforms` | Target platforms for multi-arch build | No | `linux/amd64,linux/arm64` |
| `ecr_registry` | ECR registry URL | No | `public.ecr.aws/nullplatform` |
| `tag` | Image tag (semantic version extracted automatically) | No | `''` |
| `aws_region` | AWS region for ECR | No | `us-east-1` |
| `build_args` | Docker build arguments (newline-separated `KEY=VAL`) | No | `''` |

**Secrets required**

- `aws_role_arn` — AWS IAM Role ARN for OIDC authentication (required)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/docker-build-push-ecr.yml@main
with:
  image_name: my-app
  context: .
  dockerfile: Dockerfile
  tag: v1.2.3
  platforms: linux/amd64,linux/arm64
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
```

---

### Docker Build and Push to ECR (Nullplatform) {#docker-build-and-push-to-ecr-nullplatform}

Builds and pushes a Docker image using `make build` and `make push`, fully integrated with the Nullplatform CI lifecycle (`np build start` / `np build update`). The build status is reported back to Nullplatform as `successful` or `failed` regardless of outcome. Requires a `Makefile` that implements the `build` and `push` targets.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `platforms` | Target platforms passed as `DOCKER_PLATFORMS` env var to make | No | `linux/amd64,linux/arm64` |

**Secrets required**

- `nullplatform_api_key` — Nullplatform API key for CLI authentication (required)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/docker-build-push-np-ecr.yml@main
with:
  platforms: linux/amd64,linux/arm64
secrets:
  nullplatform_api_key: ${{ secrets.NULLPLATFORM_API_KEY }}
```

---

### tofu-test

Runs `tofu init -backend=false` and `tofu test` for each module in a provided JSON array, using a fan-out matrix strategy with a max parallelism of 2. Use this to run built-in OpenTofu unit tests across multiple modules in a single workflow call.

**Inputs**

| Name | Description | Required | Default

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
