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

Scans Docker images for security vulnerabilities using Trivy before deployment. Builds the image locally and checks for known CVEs with configurable severity thresholds. Use this in CI pipelines to prevent deploying vulnerable containers.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| context | Build context directory | Yes | - |
| dockerfile | Path to Dockerfile relative to context | No | Dockerfile |
| image_name | Name for the scanned image (used for reporting) | Yes | - |
| severity | Minimum severity to report (CRITICAL,HIGH,MEDIUM,LOW) | No | CRITICAL,HIGH |
| build_args | Docker build arguments (multiline, one per line: KEY=VALUE) | No | '' |
| exit_code | Exit code when vulnerabilities are found (0 to not fail) | No | 1 |

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
```

### ecr-security-scan

Scans published ECR images for vulnerabilities on a schedule or manually. Finds the latest semver tag for each specified image, scans for critical/high vulnerabilities, and sends Slack alerts if issues are found. Use this for continuous security monitoring of production images.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| image_names | JSON array of image names to scan (e.g., ["k8s-logs-controller", "k8s-traffic-manager"]) | Yes | - |
| ecr_registry | ECR registry URL | No | public.ecr.aws/nullplatform |
| severity | Minimum severity to report (CRITICAL,HIGH,MEDIUM,LOW) | No | CRITICAL,HIGH |

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
