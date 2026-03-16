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
|----------|----------|-------------|
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Validates branch names against conventional commit type prefixes |
| [Changelog and Release](#changelog-and-release) | 📦 Release & Changelog | Generates changelogs from conventional commits and creates releases for Helm charts, npm packages, or generic projects |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Validates commit messages follow conventional commit format |
| [Docker Build and Push to ECR](#docker-build-and-push-to-ecr) | 🚀 Build & Deploy | Builds multi-platform Docker images and pushes them to Amazon ECR Public |
| [Docker Security Scan](#docker-security-scan) | 🔒 Security | Scans Docker images for vulnerabilities using Trivy before pushing to registries |
| [ECR Security Scan](#ecr-security-scan) | 🔒 Security | Scans latest ECR Public images for vulnerabilities and alerts via Slack |
| [PR Checks - Docker Build](#pr-checks---docker-build) | 🔍 CI & Validation | Validates Dockerfile builds successfully in pull requests |
| [PR Checks - Go](#pr-checks---go) | 🔍 CI & Validation | Runs linting and tests for Go projects in pull requests |
| [PR Checks - Node (npm)](#pr-checks---node-npm) | 🔍 CI & Validation | Runs linting and tests for Node.js npm projects in pull requests |
| [PR Checks - Node (pnpm)](#pr-checks---node-pnpm) | 🔍 CI & Validation | Runs linting and tests for Node.js pnpm projects in pull requests |
| [tofu-pre-release](#tofu-pre-release) | 📦 Release & Changelog | Posts changelog preview comments on pull requests using semantic-release |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | Generates README files using AI for changed or all projects |
| [tofu-release](#tofu-release) | 📦 Release & Changelog | Creates releases for Terraform modules using Release Please and updates version references |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Generates and injects Terraform documentation into README files |
| [tfsec-security-scan](#tfsec-security-scan) | 🔒 Security | Scans Terraform code for security issues and uploads results to GitHub Security |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Validates and formats OpenTofu/Terraform code |
| [tofu-test](#tofu-test) | 🔍 CI & Validation | Runs tests for multiple Terraform/OpenTofu modules |

---

## 🔍 CI & Validation

### branch-validation

Validates that pull request branch names follow a conventional pattern with type prefixes. Ensures branches are named like `feat/feature-name`, `fix/bug-description`, etc. This helps maintain consistent branch naming conventions across your repository.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| pattern | Regex pattern for branch name validation | No | `^(feat\|feature\|fix\|docs\|style\|refactor\|perf\|test\|build\|ci\|chore\|revert)/.+$` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/branch-validation.yml@main
with:
  pattern: '^(feat|fix|docs|chore)/.+$'
```

---

### conventional-commit

Validates that all commits in a pull request follow the conventional commit format (type: description). Ensures commits are properly formatted for automated changelog generation and semantic versioning. Uses commitlint to enforce the convention.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

---

### PR Checks - Docker Build

Validates that Docker images build successfully in pull requests without pushing to any registry. Useful for catching Docker build issues early in the development cycle before merging changes.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| context | Docker build context path | No | `.` |
| dockerfile | Path to the Dockerfile | No | `Dockerfile` |

**Secrets required**
- `GITHUB_TOKEN` (automatically provided)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-docker.yml@main
with:
  context: ./services/api
  dockerfile: Dockerfile.prod
```

---

### PR Checks - Go

Runs Go linting (`go vet`) and tests (`go test`) on pull requests. Ensures Go code quality and test coverage before merging. Automatically detects Go version from go.mod or allows explicit version override.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for go commands | No | `.` |
| go-version | Go version (overrides go.mod if set) | No | `` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-go.yml@main
with:
  working-directory: ./cmd/server
  go-version: '1.22'
```

---

### PR Checks - Node (npm)

Runs npm install, linting (test:static or lint script), and tests for Node.js projects using npm. Automatically caches dependencies and uses `.node-version` file or explicit Node version.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for npm commands | No | `.` |
| node-version | Node.js version (overrides .node-version file if set) | No | `` |

**Secrets required**
- `GITHUB_TOKEN` (automatically provided)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-npm.yml@main
with:
  working-directory: ./frontend
  node-version: '20'
```

---

### PR Checks - Node (pnpm)

Runs pnpm install, linting (test:static or lint script), and tests for Node.js projects using pnpm. Supports monorepos and uses pnpm workspace features with efficient caching.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for pnpm commands | No | `.` |
| node-version | Node.js version (overrides .node-version file if set) | No | `` |

**Secrets required**
- `GITHUB_TOKEN` (automatically provided)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-pnpm.yml@main
with:
  working-directory: ./packages/core
  node-version: '22'
```

---

### tofu-lint

Validates OpenTofu/Terraform configuration files by running init, fmt check, and validate. Ensures infrastructure code follows proper formatting standards and has valid syntax before merging.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-lint.yml@main
```

---

### tofu-test

Runs `tofu test` for multiple Terraform/OpenTofu modules in parallel. Validates that infrastructure code works correctly by executing test configurations. Supports testing multiple modules simultaneously with configurable parallelism.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| modules | JSON array of module paths to test (e.g. ["module/a", "module/b"]) | Yes | - |
| tofu_version | OpenTofu version to use | No | `1.10.6` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-test.yml@main
with:
  modules: '["modules/vpc", "modules/eks", "modules/rds"]'
  tofu_version: '1.10.6'
```

---

## 🔒 Security

### Docker Security Scan

Scans Docker images for security vulnerabilities using Trivy before pushing to registries. Builds the image locally, scans for vulnerabilities at specified severity levels, and can fail the build if issues are found. Use this in CI pipelines to catch vulnerabilities early.

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
  context: ./services/api
  dockerfile: Dockerfile
  image_name: my-api-service
  severity: 'CRITICAL,HIGH,MEDIUM'
  exit_code: 1
  build_args: |
    NODE_ENV=production
    BUILD_VERSION=1.0.0
```

---

### ECR Security Scan

Continuously scans the latest versions of Docker images in Amazon ECR Public for vulnerabilities. Automatically detects the most recent semantic version tags, runs Trivy scans, and sends Slack alerts if critical or high severity vulnerabilities are found. Ideal for scheduled security monitoring.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| image_names | JSON array of image names to scan (e.g., ["k8s-logs-controller", "k8s-traffic-manager"]) | Yes | - |
| ecr_registry | ECR registry URL | No | `public.ecr.aws/nullplatform` |
| severity | Minimum severity to report (CRITICAL,HIGH,MEDIUM,LOW) | No | `CRITICAL,HIGH` |

**Secrets required**
- `aws_role_arn` - AWS IAM Role ARN for OIDC authentication
- `slack_webhook_url` - Slack webhook URL for vulnerability alerts

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/ecr-security-scan.yml@main
with:
  image_names: '["k8s-logs-controller", "k8s-traffic-manager", "api-gateway"]'
  ecr_registry: 'public.ecr.aws/nullplatform'
  severity: 'CRITICAL,HIGH'
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
  slack_webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

### tfsec-security-scan

Scans Terraform/OpenTofu code for security misconfigurations and vulnerabilities using tfsec. Uploads results to GitHub Security tab (SARIF format), posts comments on pull requests when issues are found, and can block merges based on severity thresholds.

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
  minimum_severity: 'HIGH'
  upload_sarif: true
  post_comment: true
```

---

## 🚀 Build & Deploy

### Docker Build and Push to ECR

Builds multi-platform Docker images (amd64/arm64) and pushes them to Amazon ECR Public. Uses Docker Buildx for efficient multi-architecture builds with caching. Authenticates to AWS using OIDC (no long-lived credentials needed). Tags images with version numbers extracted from git tags.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| image_name | Name of the Docker image (e.g., k8s-logs-controller) | Yes | - |
| context | Build context directory | Yes | - |
| dockerfile | Path to Dockerfile relative to context | No | `Dockerfile` |
| platforms | Target platforms for multi-arch build | No | `linux/amd64,linux/arm64` |
| ecr_registry | ECR registry URL | No | `public.ecr.aws/nullplatform` |
| tag | Additional tag for the image (latest and sha are always added) | No | `` |
| aws_region | AWS region for ECR | No | `us-east-1` |
| build_args | Docker build arguments (newline-separated, e.g. "ARG1=val1\nARG2=val2") | No | `` |

**Secrets required**
- `aws_role_arn` - AWS IAM Role ARN for OIDC authentication

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/docker-build-push-ecr.yml@main
with:
  image_name: my-app
  context: .
  dockerfile: Dockerfile
  platforms: 'linux/amd64,linux/arm64'
  tag: 'v1.2.3'
  build_args: |
    NODE_ENV=production
    VERSION=1.2.3
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
```

---

## 📦 Release & Changelog

### Changelog and Release

Automatically generates changelogs from conventional commits and bumps versions for Helm charts, npm packages, or generic projects. Parses commit history to determine semantic version bumps (major/minor/patch), updates CHANGELOG.md files, creates git tags, and optionally publishes GitHub Releases. Supports monorepos with multiple packages.

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

| Name | Description |
|------|-------------|
| has_changes | Whether there were changes to release |
| new_version | The new version number |
| changelog | The generated changelog content |

**Secrets required**
- `GITHUB_TOKEN` (automatically provided)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/changelog-release.yml@main
with:
  project-type: helm-charts
  source-dir: charts
  tag-prefix: 'v'
  create-github-release: true
  commit-message: 'chore: release new version [skip ci]'
```

---

### tofu-pre-release

Posts changelog preview comments on pull requests using semantic-release-github-pr. Shows what the next release version and changelog will look like before merging. Helps reviewers understand the impact of changes on versioning.

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
