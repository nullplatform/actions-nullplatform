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

# GitHub Actions - Reusable Workflows

This repository contains reusable GitHub Actions workflows for CI/CD, security scanning, documentation generation, and release management.

## Summary

| Workflow | Category | Description |
|----------|----------|-------------|
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Validates branch names against conventional commit patterns |
| [Changelog and Release](#changelog-and-release) | 📦 Release & Changelog | Automated semantic versioning, changelog generation, and GitHub releases for monorepos |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Validates commit messages follow conventional commit format |
| [Docker Build and Push to ECR](#docker-build-and-push-to-ecr) | 🚀 Build & Deploy | Multi-architecture Docker builds with automatic ECR push |
| [Docker Security Scan](#docker-security-scan) | 🔒 Security | Scans Docker images for vulnerabilities using Trivy |
| [ECR Security Scan](#ecr-security-scan) | 🔒 Security | Scheduled security scans of ECR images with Slack alerts |
| [PR Checks - Docker Build](#pr-checks---docker-build) | 🔍 CI & Validation | Validates Docker builds in pull requests |
| [PR Checks - Go](#pr-checks---go) | 🔍 CI & Validation | Runs Go linting and tests |
| [PR Checks - Node (npm)](#pr-checks---node-npm) | 🔍 CI & Validation | Runs npm linting and tests |
| [PR Checks - Node Build (pnpm)](#pr-checks---node-build-pnpm) | 🔍 CI & Validation | Validates Node.js builds using pnpm |
| [PR Checks - Node (pnpm)](#pr-checks---node-pnpm) | 🔍 CI & Validation | Runs pnpm linting and tests |
| [tofu-pre-release](#tofu-pre-release) | 📦 Release & Changelog | Posts changelog preview comments on PRs |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | AI-powered README generation for code projects |
| [tofu-release](#tofu-release) | 📦 Release & Changelog | Automated releases for Terraform modules with README version updates |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Automated Terraform documentation generation |
| [tfsec-security-scan](#tfsec-security-scan) | 🔒 Security | Security scanning for Terraform code with SARIF upload |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Formats and validates OpenTofu/Terraform code |
| [tofu-test](#tofu-test) | 🔍 CI & Validation | Runs OpenTofu tests across multiple modules |
| [update-readme-actions](#update-readme-actions) | 📚 Documentation | Automatically updates repository README with workflow documentation |

---

## 🔍 CI & Validation

### branch-validation

Enforces consistent branch naming conventions for pull requests. Validates that branch names follow the pattern `type/description` where type can be feat, fix, docs, style, refactor, perf, test, build, ci, chore, or revert. Use this workflow to maintain clean git history and enable automated changelog generation.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| pattern | Regex pattern for branch name validation | No | `^(feat\|feature\|fix\|docs\|style\|refactor\|perf\|test\|build\|ci\|chore\|revert)/.+$` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/branch-validation.yml@main
```

### conventional-commit

Validates that all commit messages in a pull request follow the Conventional Commits specification. Ensures commits start with a valid type (feat, fix, docs, etc.) and enforces proper formatting. Essential for projects using automated changelog generation and semantic versioning.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

### PR Checks - Docker Build

Validates that Docker images build successfully in pull requests without pushing to any registry. Useful for catching build errors early and ensuring Dockerfiles remain valid. Supports private GitHub packages through automatic token injection.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| context | Docker build context path | No | `.` |
| dockerfile | Path to the Dockerfile | No | `Dockerfile` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-docker.yml@main
with:
  context: ./app
  dockerfile: Dockerfile
```

### PR Checks - Go

Runs Go linting with `go vet` and executes all tests. Automatically detects Go version from go.mod or allows explicit version override. Use this workflow to ensure Go code quality and test coverage before merging.

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

Runs npm-based linting and tests for Node.js projects. Automatically detects Node version from .node-version file and uses npm ci for reproducible builds. Intelligently runs either lint or test:static script based on what's available in package.json.

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
```

### PR Checks - Node Build (pnpm)

Validates that Node.js projects build successfully using pnpm. Ideal for TypeScript projects or any codebase requiring a compilation step. Uses pnpm's efficient disk space usage and faster install times compared to npm.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for pnpm commands | No | `.` |
| node-version | Node.js version (overrides .node-version file if set) | No | `` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-pnpm-build.yml@main
with:
  working-directory: ./packages/app
```

### PR Checks - Node (pnpm)

Runs pnpm-based linting and tests for Node.js monorepos or projects. Supports both lint and test:static scripts, automatically choosing the first available. Perfect for repositories using pnpm workspaces.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for pnpm commands | No | `.` |
| node-version | Node.js version (overrides .node-version file if set) | No | `` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-pnpm.yml@main
with:
  working-directory: ./apps/web
  node-version: '20'
```

### tofu-lint

Validates OpenTofu/Terraform code formatting and syntax. Runs `tofu fmt -check` to ensure consistent formatting and `tofu validate` to catch configuration errors. Essential for maintaining Infrastructure as Code quality standards.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-lint.yml@main
```

### tofu-test

Executes OpenTofu tests across multiple modules in parallel. Ideal for monorepo setups with multiple Terraform modules that need independent validation. Uses matrix strategy for efficient parallel execution.

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

Scans Docker images for security vulnerabilities using Trivy before deployment. Builds the image locally and analyzes it for CRITICAL and HIGH severity issues. Configure to fail builds on vulnerabilities or just report findings for awareness.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| context | Build context directory | Yes | - |
| dockerfile | Path to Dockerfile relative to context | No | `Dockerfile` |
| image_name | Name for the scanned image (used for reporting) | Yes | - |
| severity | Minimum severity to report (CRITICAL,HIGH,MEDIUM,LOW) | No | `CRITICAL,HIGH` |
| build_args | Docker build arguments (multiline, one per line: KEY=VALUE) | No | `` |
| exit_code | Exit code when vulnerabilities are found (0 to not fail) | No | `1` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/docker-security-scan.yml@main
with:
  context: ./app
  dockerfile: Dockerfile
  image_name: my-application
  severity: CRITICAL,HIGH
  exit_code: 1
```

### ECR Security Scan

Scheduled security scanning of images in Amazon ECR Public registry. Automatically finds the latest semver tag for each image, scans for vulnerabilities, and sends Slack alerts when CRITICAL or HIGH issues are detected. Ideal for continuous monitoring of production images.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| image_names | JSON array of image names to scan | Yes | - |
| ecr_registry | ECR registry URL | No | `public.ecr.aws/nullplatform` |
| severity | Minimum severity to report (CRITICAL,HIGH,MEDIUM,LOW) | No | `CRITICAL,HIGH` |

**Secrets required**
- `aws_role_arn` - AWS IAM Role ARN for OIDC authentication
- `slack_webhook_url` - Slack webhook URL for vulnerability alerts

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/ecr-security-scan.yml@main
with:
  image_names: '["k8s-logs-controller", "k8s-traffic-manager"]'
  severity: CRITICAL,HIGH
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
  slack_webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### tfsec-security-scan

Security scanning for Terraform/OpenTofu code using tfsec. Detects security misconfigurations, compliance violations, and best practice issues. Uploads results to GitHub Security tab and posts PR comments when issues are found. Configure minimum severity threshold based on your security requirements.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| minimum_severity | Minimum severity level to report (CRITICAL, HIGH, MEDIUM, LOW) | No | `HIGH` |
| upload_sarif | Upload SARIF results to GitHub Security tab | No | `true` |
| post_comment | Post comment on PR if scan fails | No | `true` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tfsec.yml@main
with:
  minimum_severity: HIGH
  upload_sarif: true
  post_comment: true
```

---

## 🚀 Build & Deploy

### Docker Build and Push to ECR

Multi-platform Docker image builds with automatic push to Amazon ECR Public. Supports linux/amd64 and linux/arm64 architectures, custom build arguments, and efficient layer caching. Uses AWS OIDC for secure authentication without long-lived credentials.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| image_name | Name of the Docker image | Yes | - |
| context | Build context directory | Yes | - |
| dockerfile | Path to Dockerfile relative to context | No | `Dockerfile` |
| platforms | Target platforms for multi-arch build | No | `linux/amd64,linux/arm64` |
| ecr_registry | ECR registry URL | No | `public.ecr.aws/nullplatform` |
| tag | Additional tag for the image (latest and sha are always added) | No | `` |
| aws_region | AWS region for ECR | No | `us-east-1` |
| build_args | Docker build arguments (newline-separated) | No | `` |

**Secrets required**
- `aws_role_arn` - AWS IAM Role ARN for OIDC authentication

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/docker-build-push-ecr.yml@main
with:
  image_name: my-app
  context: .
  dockerfile: Dockerfile
  tag: v1.0.0
  platforms: linux/amd64,linux/arm64
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
```

---

## 📦 Release & Changelog

### Changelog and Release

Intelligent semantic versioning and changelog generation for monorepos and single projects. Analyzes conventional commits to determine version bumps (major, minor, patch), updates version files (Chart.yaml, package.json, VERSION), generates detailed changelogs with commit links, and creates GitHub releases. Supports Helm charts, npm packages, and generic projects.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| project-type | Type of project: helm-charts, npm, generic | No | `generic` |
| source-dir | Directory containing packages/charts (use . for root) | No | `.` |
| version-file | Version file name (Chart.yaml, package.json, VERSION). Auto-detected if not specified. | No | `` |
| tag-prefix | Prefix for git tags (e.g., "v" for v1.0.0). Use empty for no prefix. | No | `` |
| create-github-release | Create a GitHub Release | No | `true` |
| commit-message | Commit message for version bump | No | `chore(release): bump version and update changelog [skip ci]` |

**Outputs**
- `has_changes` - Whether there were changes to release
- `new_version` - The new version number
- `changelog` - The generated changelog content

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/changelog-release.yml@main
with:
  project-type: helm-charts
  source-dir: charts
  tag-prefix: v
  create-github-release: true
```

### tofu-pre-release

Posts an automated changelog preview as a comment on pull requests using semantic-release. Shows what changes will be included in the next release based on conventional commits. Helps reviewers understand the impact of merging a PR.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pre-release.yml@main
```

### tofu-release

Automated release management for Terraform modules using Google's Release Please. Creates release PRs that bump versions, generates changelogs, and optionally updates all README.md

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
