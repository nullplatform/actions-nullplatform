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

# GitHub Actions Workflows

## Summary

| Workflow | Category | Description |
|----------|----------|-------------|
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Validates pull request branch names against conventional naming patterns |
| [Changelog and Release](#changelog-and-release) | 📦 Release & Changelog | Automates version bumping and changelog generation for mono-repos and single projects |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Validates commit messages against conventional commit standards |
| [Docker Build and Push to ECR](#docker-build-and-push-to-ecr) | 🚀 Build & Deploy | Builds multi-architecture Docker images and publishes to Amazon ECR Public |
| [Docker Security Scan](#docker-security-scan) | 🔒 Security | Scans Docker images for vulnerabilities using Trivy before deployment |
| [ECR Security Scan](#ecr-security-scan) | 🔒 Security | Monitors ECR images for critical vulnerabilities and sends Slack alerts |
| [PR Checks - Docker Build](#pr-checks---docker-build) | 🔍 CI & Validation | Verifies Docker images build successfully in pull requests |
| [PR Checks - Go](#pr-checks---go) | 🔍 CI & Validation | Runs linting and tests for Go projects in pull requests |
| [PR Checks - Node (npm)](#pr-checks---node-npm) | 🔍 CI & Validation | Runs linting and tests for Node.js projects using npm |
| [PR Checks - Node (pnpm)](#pr-checks---node-pnpm) | 🔍 CI & Validation | Runs linting and tests for Node.js projects using pnpm |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | Generates project documentation using AI based on code changes |
| [tofu-release](#tofu-release) | 📦 Release & Changelog | Creates automated releases for Terraform modules using Release Please |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Generates Terraform module documentation using terraform-docs |
| [tfsec-security-scan](#tfsec-security-scan) | 🔒 Security | Scans Terraform code for security issues and uploads results to GitHub Security |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Validates and formats Terraform/OpenTofu code |
| [tofu-test](#tofu-test) | 🔍 CI & Validation | Runs OpenTofu tests across multiple modules in parallel |

## 🔍 CI & Validation

### branch-validation

Enforces consistent branch naming conventions in pull requests using regex patterns. Helps teams maintain organized Git workflows by requiring branch names to follow formats like `feat/add-feature` or `fix/bug-123`. Use this to ensure all contributors follow the same naming standards before code review.

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

Validates that all commits in a pull request follow the conventional commits specification. Ensures commit messages have proper types (feat, fix, docs, etc.) and formatting, which is essential for automated changelog generation and semantic versioning. Run this check on every pull request to maintain clean Git history.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

### PR Checks - Docker Build

Validates that Docker images build successfully in pull requests without pushing them. Catches build failures early in the development cycle before merging changes. Use this for repositories where Docker builds are critical but you don't need the full build-push-scan pipeline on every PR.

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
  dockerfile: Dockerfile.production
```

### PR Checks - Go

Runs Go linting and tests for pull requests. Executes `go vet` for static analysis and `go test` for running the test suite. Supports custom working directories for mono-repos and can use either go.mod version or a specified Go version.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for go commands | No | `.` |
| go-version | Go version (overrides go.mod if set) | No | `` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-go.yml@main
with:
  working-directory: ./services/api
  go-version: '1.21'
```

### PR Checks - Node (npm)

Runs Node.js linting and tests using npm for pull requests. Automatically detects and runs either `test:static` or `lint` scripts, then executes the test suite. Supports private npm packages through GitHub Packages authentication.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for npm commands | No | `.` |
| node-version | Node.js version (overrides .node-version file if set) | No | `` |

**Secrets required**

- `GITHUB_TOKEN` (automatically provided, used for GitHub Packages authentication)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-npm.yml@main
with:
  working-directory: ./packages/frontend
  node-version: '20'
```

### PR Checks - Node (pnpm)

Runs Node.js linting and tests using pnpm for pull requests. Provides the same functionality as the npm variant but with pnpm's faster installation and better disk space efficiency. Ideal for mono-repos using pnpm workspaces.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for pnpm commands | No | `.` |
| node-version | Node.js version (overrides .node-version file if set) | No | `` |

**Secrets required**

- `GITHUB_TOKEN` (automatically provided, used for GitHub Packages authentication)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-pnpm.yml@main
with:
  working-directory: ./apps/web
  node-version: '22'
```

### tofu-lint

Validates OpenTofu/Terraform code formatting and syntax. Runs `tofu fmt -check` to ensure consistent formatting and `tofu validate` to catch configuration errors. Essential for maintaining infrastructure-as-code quality standards in pull requests.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-lint.yml@main
```

### tofu-test

Executes OpenTofu tests across multiple modules in parallel. Runs `tofu init` and `tofu test` for each specified module, with configurable parallelism to balance speed and resource usage. Use this to validate infrastructure code changes with real test scenarios.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| modules | JSON array of module paths to test | Yes | - |
| tofu_version | OpenTofu version to use | No | `1.10.6` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-test.yml@main
with:
  modules: '["modules/vpc", "modules/eks", "modules/rds"]'
  tofu_version: '1.10.6'
```

## 🔒 Security

### Docker Security Scan

Scans Docker images for security vulnerabilities using Trivy before they reach production. Builds the image locally, runs comprehensive vulnerability scanning, and fails the workflow if issues above the specified severity threshold are found. Use this in CI pipelines to catch vulnerabilities early.

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
  severity: CRITICAL,HIGH
  build_args: |
    NODE_ENV=production
    VERSION=1.2.3
```

### ECR Security Scan

Continuously monitors production images in Amazon ECR Public for new vulnerabilities. Automatically detects the latest semantic version tags for each image, scans them with Trivy, and sends Slack notifications when critical or high severity issues are found. Schedule this workflow to run daily or weekly for production monitoring.

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
  ecr_registry: public.ecr.aws/nullplatform
  severity: CRITICAL,HIGH
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
  slack_webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### tfsec-security-scan

Scans Terraform/OpenTofu code for security misconfigurations and compliance issues using tfsec. Automatically discovers all Terraform directories, uploads SARIF results to GitHub Security tab, and can post PR comments when issues are found. Essential for preventing security issues in infrastructure code before deployment.

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

## 🚀 Build & Deploy

### Docker Build and Push to ECR

Builds multi-architecture Docker images and publishes them to Amazon ECR Public. Supports ARM64 and AMD64 platforms, custom build arguments, and automatic layer caching for faster builds. Use this for production deployments when you need versioned, multi-platform images.

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
  image_name: k8s-logs-controller
  context: ./controllers/logs
  dockerfile: Dockerfile
  platforms: linux/amd64,linux/arm64
  tag: v2.1.0
  build_args: |
    VERSION=2.1.0
    BUILD_DATE=2024-01-15
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
```

## 📦 Release & Changelog

### Changelog and Release

Automates semantic versioning, changelog generation, and GitHub releases for mono-repos or single projects. Analyzes conventional commits to determine version bumps (major/minor/patch), generates formatted changelogs with links to commits and comparisons, and updates version files. Supports Helm charts, npm packages, and generic projects.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| project-type | Type of project: helm-charts, npm, generic | No | `generic` |
| source-dir | Directory containing packages/charts (use . for root) | No | `.` |
| version-file | Version file name (auto-detected if not specified) | No | `` |
| tag-prefix | Prefix for git tags (e.g., "v" for v1.0.0) | No | `` |
| create-github-release | Create a GitHub Release | No | `true` |
| commit-message | Commit message for version bump | No | `chore(release): bump version and update changelog [skip ci]` |

**Outputs**

- `has_changes` - Whether there were changes to release
- `new_version` - The new version number
- `changelog` - The generated changelog content

**Secrets required**

- `GITHUB_TOKEN` (automatically provided)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/changelog-release.yml@main
with:
  project-type: helm-charts
  source-dir: charts
  tag-prefix: v
  create-github-release: true
```

### tofu-release

Automates releases for Terraform/OpenTofu modules using Google's Release Please action. Creates release PRs that bump versions based on conventional commits, generates changelogs, and optionally updates version references across all README files. Perfect for maintaining Terraform module registries.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| update_readme_versions | Update version references in README files after release | No | `true` |

**Secrets required**

- `GITHUB_TOKEN` (automatically provided)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/release.yml@main
with:
  update_readme_versions: true
```

## 📚 Documentation

### readme-ai-generator

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
