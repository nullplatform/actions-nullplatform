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
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Validates PR branch names against a conventional prefix pattern |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Lints commit messages against Conventional Commits specification |
| [PR Checks - Docker Build](#pr-checks---docker-build) | 🔍 CI & Validation | Validates a Dockerfile builds successfully on pull requests |
| [PR Checks - Go](#pr-checks---go) | 🔍 CI & Validation | Runs `go vet` and `go test` for Go projects |
| [PR Checks - Node (npm)](#pr-checks---node-npm) | 🔍 CI & Validation | Runs lint and tests for Node.js projects using npm |
| [PR Checks - Node Build (pnpm)](#pr-checks---node-build-pnpm) | 🔍 CI & Validation | Runs `pnpm build` for Node.js projects using pnpm |
| [PR Checks - Node (pnpm)](#pr-checks---node-pnpm) | 🔍 CI & Validation | Runs lint and tests for Node.js projects using pnpm |
| [PR Checks - Terraform](#pr-checks---terraform) | 🔍 CI & Validation | Orchestrates lint, security scan, and optional tests for Terraform/OpenTofu PRs |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Runs `tofu init`, `tofu fmt`, and `tofu validate` on OpenTofu code |
| [tofu-test](#tofu-test) | 🔍 CI & Validation | Executes `tofu test` across a matrix of specified OpenTofu modules |
| [shellcheck](#shellcheck) | 🔍 CI & Validation | Runs ShellCheck static analysis on shell scripts |
| [Docker Security Scan](#docker-security-scan) | 🔒 Security | Builds a Docker image locally and scans it with Trivy for vulnerabilities |
| [ECR Security Scan](#ecr-security-scan) | 🔒 Security | Pulls images from ECR and scans them with Trivy, sending Slack alerts on findings |
| [tfsec-security-scan](#tfsec-security-scan) | 🔒 Security | Scans Terraform files with tfsec and optionally uploads SARIF to GitHub Security |
| [Docker Build and Push to ECR](#docker-build-and-push-to-ecr) | 🚀 Build & Deploy | Builds a multi-arch Docker image and pushes it to Amazon ECR Public |
| [Docker Build and Push to ECR (Nullplatform)](#docker-build-and-push-to-ecr-1) | 🚀 Build & Deploy | Builds and pushes a Docker image via Nullplatform CLI lifecycle (start/build/push/finalize) |
| [Changelog and Release](#changelog-and-release) | 📦 Release & Changelog | Generates a CHANGELOG, bumps version files, creates git tags, and GitHub Releases |
| [tofu-pre-release](#tofu-pre-release) | 📦 Release & Changelog | Posts a semantic-release changelog preview as a PR comment |
| [tofu-release](#tofu-release) | 📦 Release & Changelog | Runs Release Please and updates `ref=` version pins in all README files |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Generates and injects terraform-docs output into README files |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | AI-generates README files for changed or all project directories using a configurable AI provider |

---

## 🔍 CI & Validation

### branch-validation

Validates the source branch name of a pull request against a configurable regex pattern. Automatically skips `release-please--*` branches. Use this on `pull_request` events to enforce branch naming conventions such as `feat/`, `fix/`, `chore/`, etc.

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

Lints all commits in a pull request against the [Conventional Commits](https://www.conventionalcommits.org/) specification using `commitlint`. Enforces allowed types (`feat`, `fix`, `chore`, etc.) and disallows sentence-case subjects. Use this on `pull_request` events to maintain a clean, parseable commit history.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

---

### PR Checks - Docker Build

Performs a local Docker build (without pushing) to verify the Dockerfile compiles successfully on every pull request. Supports two authentication modes for private package registries: the legacy `--build-arg GITHUB_TOKEN` approach and the more secure BuildKit `--secret` method.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
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

Runs `go vet ./...` for static analysis and `go test ./...` for unit tests. The Go version is read from `go.mod` by default or can be pinned explicitly. Use this on pull requests for Go projects.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `working-directory` | Working directory for go commands | No | `.` |
| `go-version` | Go version (overrides `go.mod` if set) | No | `''` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-go.yml@main
with:
  working-directory: .
  go-version: '1.22'
```

---

### PR Checks - Node (npm)

Installs dependencies with `npm ci`, runs the first available lint script (`test:static` or `lint`), then runs `npm test`. Node.js version is auto-detected from `.node-version` or can be pinned. Passes `CI_TOKEN` or `GITHUB_TOKEN` for private registry access.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
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

Installs dependencies with `pnpm install` and runs `pnpm build` to validate the project compiles without errors. Node.js version is auto-detected from `.node-version` or can be pinned. Use this for pnpm projects that require a build step validation on PRs.

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

Installs dependencies with `pnpm install`, runs the first available lint script (`test:static` or `lint`), then runs `pnpm test`. Node.js version is auto-detected from `.node-version` or can be pinned. Passes `CI_TOKEN` or `GITHUB_TOKEN` for private registry access.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
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

Orchestrates a full Terraform/OpenTofu PR validation suite by composing three reusable workflows: [`tofu-lint`](#tofu-lint) for format and validation, [`tfsec-security-scan`](#tfsec-security-scan) for security checks, and optionally [`tofu-test`](#tofu-test) for module tests. Use this as a single entry point for all Terraform PR checks.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `minimum_severity` | Minimum severity for tfsec (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) | No | `HIGH` |
| `upload_sarif` | Upload SARIF results to GitHub Security tab | No | `true` |
| `post_comment` | Post a PR comment if tfsec scan fails | No | `true` |
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
  modules: '["modules/vpc", "modules/iam"]'
  skip_backend: true
```

---

### tofu-lint

Runs `tofu init`, `tofu fmt -check`, and `tofu validate` to ensure OpenTofu code is correctly formatted and syntactically valid. Use `skip_backend` for repositories with remote backends that cannot be initialized in CI.

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

Runs `tofu test` in parallel across a matrix of specified module directories using a configurable OpenTofu version. Each module is initialized with `-backend=false`. Use this for unit/integration testing of individual OpenTofu modules.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `modules` | JSON array of module paths to test | Yes | — |
| `tofu_version` | OpenTofu version to use | No | `1.10.6` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-test.yml@main
with:
  modules: '["modules/vpc", "modules/rds"]'
  tofu_version: '1.10.6'
```

---

### shellcheck

Runs [ShellCheck](https://www.shellcheck.net/) static analysis on shell scripts. Scans specific directories/files when provided, or recursively finds all `*.sh` files from the repository root. Configure `severity` to control the minimum issue level that causes a failure.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `script_dirs` | Space-separated directories or files to scan. Finds all `*.sh` recursively if empty. | No | `''` |
| `severity` | Minimum severity to fail on (`error`, `warning`, `info`, `style`) | No | `error` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/shellcheck.yml@main
with:
  script_dirs: 'scripts/ bin/'
  severity: warning
```

---

## 🔒 Security

### Docker Security Scan

Builds a Docker image locally (amd64 only, no push) and scans it with [Trivy](https://github.com/aquasecurity/trivy) for OS and library vulnerabilities. Set `exit_code` to `0` to report findings without failing the workflow. Use this on pull requests or scheduled runs to catch vulnerabilities before publishing.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `context` | Build context directory | Yes | — |
| `image_name` | Name for the scanned image (used for reporting) | Yes | — |
| `dockerfile` | Path to Dockerfile relative to context | No | `Dockerfile` |
| `severity` | Minimum severity to report (`CRITICAL,HIGH,MEDIUM,LOW`) | No | `CRITICAL,HIGH` |
| `build_args` | Docker build arguments (multiline, one per line: `KEY=VALUE`) | No | `''` |
| `exit_code` | Exit code when vulnerabilities are found (`0` to not fail) | No | `1` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/docker-security-scan.yml@main
with:
  context: .
  image_name: my-app
  dockerfile: Dockerfile
  severity: CRITICAL,HIGH
  exit_code: 1
```

---

### ECR Security Scan

Fetches the latest semver-tagged image for each name in the provided list from Amazon ECR Public, scans each with Trivy, and sends a Slack alert if any `CRITICAL` or `HIGH` vulnerabilities are found. Designed for scheduled security audits of published container images.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `image_names` | JSON array of ECR image names to scan | Yes | — |
| `ecr_registry` | ECR registry URL | No | `public.ecr.aws/nullplatform` |
| `severity` | Minimum severity to report | No | `CRITICAL,HIGH` |

**Secrets required**
- `aws_role_arn` — AWS IAM Role ARN for OIDC authentication
- `slack_webhook_url` — Slack webhook URL for vulnerability alerts

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/ecr-security-scan.yml@main
with:
  image_names: '["my-service", "my-worker"]'
  ecr_registry: public.ecr.aws/nullplatform
  severity: CRITICAL,HIGH
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
  slack_webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

### tfsec-security-scan

Scans all Terraform directories

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
