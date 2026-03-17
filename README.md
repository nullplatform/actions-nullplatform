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

| Workflow | Category | Description |
|----------|----------|-------------|
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Validates branch names against conventional commit type patterns |
| [Changelog and Release](#changelog-and-release) | 📦 Release & Changelog | Automatically generates changelogs and bumps versions based on conventional commits |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Validates commit messages follow conventional commit format |
| [Docker Build and Push to ECR](#docker-build-and-push-to-ecr) | 🚀 Build & Deploy | Builds multi-arch Docker images and pushes to Amazon ECR Public |
| [Docker Security Scan](#docker-security-scan) | 🔒 Security | Scans Docker images for vulnerabilities using Trivy |
| [ECR Security Scan](#ecr-security-scan) | 🔒 Security | Scans latest ECR images for vulnerabilities and sends Slack alerts |
| [PR Checks - Docker Build](#pr-checks---docker-build) | 🔍 CI & Validation | Validates Docker builds in pull requests |
| [PR Checks - Go](#pr-checks---go) | 🔍 CI & Validation | Runs linting and tests for Go projects |
| [PR Checks - Node (npm)](#pr-checks---node-npm) | 🔍 CI & Validation | Runs linting and tests for Node.js projects using npm |
| [PR Checks - Node Build (pnpm)](#pr-checks---node-build-pnpm) | 🔍 CI & Validation | Validates builds for Node.js projects using pnpm |
| [PR Checks - Node (pnpm)](#pr-checks---node-pnpm) | 🔍 CI & Validation | Runs linting and tests for Node.js projects using pnpm |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | Generates AI-powered README files for changed or all projects |
| [tofu-release](#tofu-release) | 📦 Release & Changelog | Creates releases for Terraform/OpenTofu modules using Release Please |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Generates Terraform documentation using terraform-docs |
| [tfsec-security-scan](#tfsec-security-scan) | 🔒 Security | Scans Terraform/OpenTofu code for security issues using tfsec |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Lints and validates OpenTofu/Terraform code |
| [tofu-test](#tofu-test) | 🔍 CI & Validation | Runs OpenTofu tests for specified modules |

## 🔍 CI & Validation

### branch-validation

Enforces branch naming conventions for pull requests. Validates that branch names follow the pattern `type/description` where type is a conventional commit type (feat, fix, docs, etc.). Useful for maintaining consistent branching strategies across teams.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| pattern | Regex pattern for branch name validation | No | `^(feat\|feature\|fix\|docs\|style\|refactor\|perf\|test\|build\|ci\|chore\|revert)/.+$` |

**Secrets required**
- None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/branch-validation.yml@main
```

### conventional-commit

Validates that all commit messages in a pull request follow the Conventional Commits specification. Ensures commits use the format `type(scope): description` where type is one of the standard commit types (feat, fix, docs, etc.).

**Inputs**
- None

**Secrets required**
- None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

### PR Checks - Docker Build

Validates that Docker images can be built successfully in pull requests. Useful for catching build issues before merging. Supports GitHub Packages for private dependencies.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| context | Docker build context path | No | `.` |
| dockerfile | Path to the Dockerfile | No | `Dockerfile` |

**Secrets required**
- None (uses `GITHUB_TOKEN` automatically)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-docker.yml@main
with:
  context: ./apps/api
  dockerfile: Dockerfile
```

### PR Checks - Go

Runs Go linting and tests for pull requests. Automatically detects Go version from `go.mod` or uses a specified version.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for go commands | No | `.` |
| go-version | Go version (overrides go.mod if set) | No | `` |

**Secrets required**
- None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-go.yml@main
with:
  working-directory: ./services/auth
  go-version: '1.21'
```

### PR Checks - Node (npm)

Runs linting and tests for Node.js projects using npm. Automatically detects Node version from `.node-version` file. Supports GitHub Packages for private npm dependencies.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for npm commands | No | `.` |
| node-version | Node.js version (overrides .node-version file if set) | No | `` |

**Secrets required**
- None (uses `GITHUB_TOKEN` or `CI_TOKEN` if available)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-npm.yml@main
with:
  working-directory: ./packages/frontend
  node-version: '20'
```

### PR Checks - Node Build (pnpm)

Validates that Node.js projects build successfully using pnpm. Useful for monorepos and projects with complex build steps.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for pnpm commands | No | `.` |
| node-version | Node.js version (overrides .node-version file if set) | No | `` |

**Secrets required**
- None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-pnpm-build.yml@main
with:
  working-directory: ./apps/dashboard
```

### PR Checks - Node (pnpm)

Runs linting and tests for Node.js projects using pnpm. Faster alternative to npm with better monorepo support.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for pnpm commands | No | `.` |
| node-version | Node.js version (overrides .node-version file if set) | No | `` |

**Secrets required**
- None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-pnpm.yml@main
with:
  working-directory: ./packages/api
```

### tofu-lint

Validates OpenTofu/Terraform code formatting and configuration. Runs `tofu init`, `tofu fmt -check`, and `tofu validate` to ensure code quality.

**Inputs**
- None

**Secrets required**
- None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-lint.yml@main
```

### tofu-test

Runs OpenTofu test suites for specified modules. Supports parallel execution of tests across multiple modules.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| modules | JSON array of module paths to test | Yes | - |
| tofu_version | OpenTofu version to use | No | `1.10.6` |

**Secrets required**
- None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-test.yml@main
with:
  modules: '["modules/vpc", "modules/eks"]'
  tofu_version: '1.10.6'
```

## 🔒 Security

### Docker Security Scan

Scans Docker images for vulnerabilities using Trivy before deployment. Supports custom build arguments and configurable severity thresholds.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| context | Build context directory | Yes | - |
| dockerfile | Path to Dockerfile relative to context | No | `Dockerfile` |
| image_name | Name for the scanned image (used for reporting) | Yes | - |
| severity | Minimum severity to report (CRITICAL,HIGH,MEDIUM,LOW) | No | `CRITICAL,HIGH` |
| build_args | Docker build arguments (multiline, one per line: KEY=VALUE) | No | `` |
| exit_code | Exit code when vulnerabilities are found (0 to not fail) | No | `1` |

**Secrets required**
- None

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
    VERSION=1.0.0
```

### ECR Security Scan

Scans the latest versions of images in Amazon ECR Public for vulnerabilities and sends Slack alerts when critical or high severity issues are found.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| image_names | JSON array of image names to scan | Yes | - |
| ecr_registry | ECR registry URL | No | `public.ecr.aws/nullplatform` |
| severity | Minimum severity to report (CRITICAL,HIGH,MEDIUM,LOW) | No | `CRITICAL,HIGH` |

**Secrets required**
- `aws_role_arn`: AWS IAM Role ARN for OIDC authentication
- `slack_webhook_url`: Slack webhook URL for vulnerability alerts

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

Scans Terraform/OpenTofu code for security misconfigurations and best practice violations. Uploads results to GitHub Security tab and posts PR comments on failures.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| minimum_severity | Minimum severity level to report (CRITICAL, HIGH, MEDIUM, LOW) | No | `HIGH` |
| upload_sarif | Upload SARIF results to GitHub Security tab | No | `true` |
| post_comment | Post comment on PR if scan fails | No | `true` |

**Secrets required**
- None

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

Builds multi-architecture Docker images and pushes them to Amazon ECR Public. Supports version-based tagging and custom build arguments.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| image_name | Name of the Docker image | Yes | - |
| context | Build context directory | Yes | - |
| dockerfile | Path to Dockerfile relative to context | No | `Dockerfile` |
| platforms | Target platforms for multi-arch build | No | `linux/amd64,linux/arm64` |
| ecr_registry | ECR registry URL | No | `public.ecr.aws/nullplatform` |
| tag | Additional tag for the image | No | `` |
| aws_region | AWS region for ECR | No | `us-east-1` |
| build_args | Docker build arguments (newline-separated) | No | `` |

**Secrets required**
- `aws_role_arn`: AWS IAM Role ARN for OIDC authentication

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/docker-build-push-ecr.yml@main
with:
  image_name: my-app
  context: .
  dockerfile: Dockerfile
  platforms: linux/amd64,linux/arm64
  tag: logs-controller-v2.0.0
  build_args: |
    NODE_ENV=production
    VERSION=2.0.0
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
```

## 📦 Release & Changelog

### Changelog and Release

Automatically generates changelogs and creates releases based on conventional commits. Supports Helm charts, npm packages, and generic projects with automatic version bumping.

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
- None (uses `GITHUB_TOKEN` automatically)

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

Creates releases for Terraform/OpenTofu modules using Release Please. Automatically updates version references in README files after release.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| update_readme_versions | Update version references in README files after release | No | `true` |

**Outputs**

| Name | Description |
|------|-------------|
| release_created | Whether a release was created |
| tag_name | The tag name of the release |

**Secrets required**
- None (uses `GITHUB_TOKEN` automatically)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/release.yml@main
with:
  update_readme_versions: true
```

## 📚 Documentation

### readme-ai-generator-v2

Generates or updates README files using AI for changed or all projects. Supports Terraform, TypeScript, Python, and generic projects with multiple AI providers (Groq, GitHub,

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
