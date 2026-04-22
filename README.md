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

| Workflow | Category | Description |
|----------|----------|-------------|
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Validates PR branch names against conventional commit format patterns |
| [Changelog and Release](#changelog-and-release) | 📦 Release & Changelog | Automates semantic versioning, changelog generation, and GitHub releases |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Validates commit messages follow conventional commit format standards |
| [Docker Build and Push to ECR](#docker-build-and-push-to-ecr) | 🚀 Build & Deploy | Builds multi-architecture Docker images and pushes to AWS ECR Public |
| [Docker Build and Push to ECR (Nullplatform)](#docker-build-and-push-to-ecr-nullplatform) | 🚀 Build & Deploy | Integrates Docker builds with Nullplatform CI tracking and asset management |
| [Docker Security Scan](#docker-security-scan) | 🔒 Security | Scans Docker images for vulnerabilities using Trivy before deployment |
| [ECR Security Scan](#ecr-security-scan) | 🔒 Security | Monitors ECR repositories for vulnerabilities and alerts via Slack |
| [PR Checks - Docker Build](#pr-checks---docker-build) | 🔍 CI & Validation | Validates Docker builds can complete successfully in PRs |
| [PR Checks - Go](#pr-checks---go) | 🔍 CI & Validation | Runs Go linting and tests for pull requests |
| [PR Checks - Node (npm)](#pr-checks---node-npm) | 🔍 CI & Validation | Executes npm-based linting and testing for Node.js projects |
| [PR Checks - Node Build (pnpm)](#pr-checks---node-build-pnpm) | 🔍 CI & Validation | Validates pnpm-based Node.js builds complete successfully |
| [PR Checks - Node (pnpm)](#pr-checks---node-pnpm) | 🔍 CI & Validation | Runs pnpm-based linting and testing for Node.js projects |
| [PR Checks - Terraform](#pr-checks---terraform) | 🔍 CI & Validation | Comprehensive Terraform validation including linting, security scanning, and testing |
| [tofu-pre-release](#tofu-pre-release) | 📦 Release & Changelog | Generates preview changelog comments on PRs using semantic-release |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | AI-powered README generation for projects with automatic version updates |
| [tofu-release](#tofu-release) | 📦 Release & Changelog | Automated Terraform module releases with version updates in documentation |
| [shellcheck](#shellcheck) | 🔍 CI & Validation | Lints shell scripts using ShellCheck for common issues |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Auto-generates Terraform module documentation using terraform-docs |
| [tfsec-security-scan](#tfsec-security-scan) | 🔒 Security | Scans Terraform code for security misconfigurations and compliance issues |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Validates Terraform/OpenTofu formatting and syntax |
| [tofu-test](#tofu-test) | 🔍 CI & Validation | Executes OpenTofu tests across multiple modules in parallel |
| [update-readme-actions](#update-readme-actions) | 📚 Documentation | Maintains README documentation of available GitHub Actions workflows |

---

## 🔍 CI & Validation

### branch-validation

Enforces branch naming conventions for pull requests by validating against regex patterns. Ensures branches follow conventional commit types (feat, fix, docs, etc.) to maintain consistent git history and enable automated tooling. Automatically skips validation for release-please branches.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| pattern | Regex pattern for branch name validation | No | `^(feat\|feature\|fix\|docs\|style\|refactor\|perf\|test\|build\|ci\|chore\|revert)/.+$` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/branch-validation.yml@main
with:
  pattern: '^(feat|fix|docs)/.+$'
```

### conventional-commit

Validates that commit messages in pull requests adhere to the conventional commit specification. Helps maintain clean, semantic commit history that can be used for automated changelog generation and version bumping. Enforces commit message structure with type, optional scope, and description.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

### PR Checks - Docker Build

Validates Docker builds in pull requests to catch build failures before merging. Supports both legacy `--build-arg` and modern BuildKit `--secret` methods for passing GitHub tokens. Use this to ensure Dockerfiles remain buildable throughout development.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| context | Docker build context path | No | `.` |
| dockerfile | Path to the Dockerfile | No | `Dockerfile` |
| use_buildkit_secret | Use BuildKit --secret for GITHUB_TOKEN instead of --build-arg | No | `false` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-docker.yml@main
with:
  context: ./app
  dockerfile: Dockerfile
  use_buildkit_secret: true
```

### PR Checks - Go

Runs Go linting and testing for pull requests to maintain code quality. Automatically detects Go version from `go.mod` or accepts an explicit version override. Executes `go vet` for static analysis and `go test` for unit tests.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for go commands | No | `.` |
| go-version | Go version (overrides go.mod if set) | No | `` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-go.yml@main
with:
  working-directory: ./service
  go-version: '1.21'
```

### PR Checks - Node (npm)

Executes npm-based linting and testing for Node.js projects in pull requests. Automatically detects Node version from `.node-version` file and supports custom NPM registries via GITHUB_TOKEN. Intelligently runs available linting scripts (test:static or lint) before executing tests.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for npm commands | No | `.` |
| node-version | Node.js version (overrides .node-version file if set) | No | `` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-npm.yml@main
with:
  working-directory: ./frontend
  node-version: '20'
```

### PR Checks - Node Build (pnpm)

Validates that pnpm-based Node.js projects build successfully in pull requests. Useful for TypeScript projects or applications with build steps that need verification before merging. Automatically caches pnpm dependencies for faster builds.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for pnpm commands | No | `.` |
| node-version | Node.js version (overrides .node-version file if set) | No | `` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-pnpm-build.yml@main
with:
  working-directory: ./app
  node-version: '22'
```

### PR Checks - Node (pnpm)

Runs comprehensive linting and testing for pnpm-based Node.js projects. Detects Node version from `.node-version` file, caches pnpm dependencies, and intelligently runs available linting scripts before tests. Ideal for monorepos and projects using pnpm workspaces.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for pnpm commands | No | `.` |
| node-version | Node.js version (overrides .node-version file if set) | No | `` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-pnpm.yml@main
with:
  working-directory: ./packages/core
  node-version: '20'
```

### PR Checks - Terraform

Comprehensive validation suite for Terraform/OpenTofu pull requests combining linting, security scanning, and optional testing. Orchestrates multiple checks including format validation, tfsec security scans with SARIF upload, and module testing. Configurable to match your security and testing requirements.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| minimum_severity | Minimum severity for tfsec (CRITICAL, HIGH, MEDIUM, LOW) | No | `HIGH` |
| upload_sarif | Upload SARIF results to GitHub Security tab | No | `true` |
| post_comment | Post comment on PR if tfsec scan fails | No | `true` |
| run_tests | Run tofu test on specified modules | No | `false` |
| modules | JSON array of module paths to test | No | `` |
| tofu_version | OpenTofu version for tofu-test | No | `1.10.6` |
| skip_backend | Run tofu init with -backend=false | No | `false` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-terraform.yml@main
with:
  minimum_severity: CRITICAL
  run_tests: true
  modules: '["modules/vpc", "modules/eks"]'
  skip_backend: true
```

### shellcheck

Lints shell scripts using ShellCheck to detect common issues, portability problems, and potential bugs. Automatically finds all `.sh` files in the repository or scans specific directories/files. Configurable severity levels help focus on critical issues.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| script_dirs | Space-separated dirs/files to scan. When empty, finds *.sh recursively | No | `` |
| severity | Minimum severity (error, warning, info, style) | No | `error` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/shellcheck.yml@main
with:
  script_dirs: scripts/ bin/
  severity: warning
```

### tofu-lint

Validates Terraform/OpenTofu code formatting and syntax to maintain consistency across your infrastructure code. Runs `tofu fmt -check` to verify formatting and `tofu validate` for syntax correctness. Supports skipping backend initialization for repositories with remote backends.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| skip_backend | Run tofu init with -backend=false | No | `false` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-lint.yml@main
with:
  skip_backend: true
```

### tofu-test

Executes OpenTofu tests across multiple modules in parallel to validate infrastructure code behavior. Runs `tofu test` for each module specified, enabling test-driven infrastructure development. Supports customizable OpenTofu versions and parallel execution for faster feedback.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| modules | JSON array of module paths to test | Yes | - |
| tofu_version | OpenTofu version to use | No | `1.10.6` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-test.yml@main
with:
  modules: '["modules/networking", "modules/compute"]'
  tofu_version: '1.10.6'
```

---

## 🔒 Security

### Docker Security Scan

Scans Docker images for vulnerabilities using Trivy before deployment to production. Builds images locally and performs comprehensive security analysis, reporting issues by severity level. Configure to fail builds on vulnerabilities or run in audit mode.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| context | Build context directory | Yes | - |
| dockerfile | Path to Dockerfile relative to context | No | `Dockerfile` |
| image_name | Name for the scanned image | Yes | - |
| severity | Minimum severity to report (CRITICAL,HIGH,MEDIUM,LOW) | No | `CRITICAL,HIGH` |
| build_args | Docker build arguments (multiline) | No | `` |
| exit_code | Exit code when vulnerabilities are found | No | `1` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/docker-security-scan.yml@main
with:
  context: .
  dockerfile: Dockerfile
  image_name: my-app
  severity: CRITICAL,HIGH
  build_args: |
    NODE_ENV=production
    APP_VERSION=1.0.0
  exit_code: 1
```

### ECR Security Scan

Continuously monitors ECR repositories for vulnerabilities in published images and sends Slack alerts when issues are detected. Automatically finds latest semantic version tags, scans with Trivy, and reports critical/high severity findings. Essential for maintaining security posture of production container images.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| image_names | JSON array of image names to scan | Yes | - |
| ecr_registry | ECR registry URL | No | `public.ecr.aws/nullplatform` |
| severity | Minimum severity to report | No | `CRITICAL,HIGH` |

**Secrets required**

- `aws_role_arn` - AWS IAM Role ARN for OIDC authentication
- `slack_webhook_url` - Slack webhook URL for vulnerability alerts

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/ecr-security-scan.yml@main
with:
  image_names: '["api-service", "worker-service"]'
  ecr_registry: public.ecr.aws/nullplatform
  severity: CRITICAL,HIGH
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
  slack_webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### tfsec-security-scan

Scans Terraform code for security misconfigurations and compliance violations using tfsec. Generates SARIF reports for GitHub Security tab integration and can post PR comments when issues are found. Configurable severity thresholds help enforce security standards before infrastructure deployment.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| minimum_severity | Minimum severity level to report | No | `HIGH` |
| upload_sarif | Upload SARIF results to GitHub Security tab | No | `true` |
| post_comment | Post comment on PR if scan fails | No | `true` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tfsec.yml@main
with:
  minimum_severity: CRITICAL
  upload_sarif: true
  post_comment: true
```

---

## 🚀 Build & Deploy

### Docker Build and Push to ECR

Builds multi-architecture Docker images and pushes to AWS ECR Public registry. Supports custom build contexts, platforms, and build arguments with automatic tag generation from release versions. Uses OIDC for secure AWS authentication and caches layers for faster subsequent builds.

**Inputs**

| Name

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
