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
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Validates branch names follow conventional commit patterns |
| [Changelog and Release](#changelog-and-release) | 📦 Release & Changelog | Generates changelogs, bumps versions, and creates GitHub releases |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Validates commit messages follow conventional commit format |
| [Docker Build and Push to ECR](#docker-build-and-push-to-ecr) | 🚀 Build & Deploy | Builds multi-arch Docker images and pushes to Amazon ECR Public |
| [Docker Security Scan](#docker-security-scan) | 🔒 Security | Scans Docker images for vulnerabilities using Trivy |
| [ECR Security Scan](#ecr-security-scan) | 🔒 Security | Scans latest ECR images and sends Slack alerts for vulnerabilities |
| [PR Checks - Docker Build](#pr-checks---docker-build) | 🔍 CI & Validation | Validates Docker builds compile successfully |
| [PR Checks - Go](#pr-checks---go) | 🔍 CI & Validation | Runs Go linting and tests |
| [PR Checks - Node (npm)](#pr-checks---node-npm) | 🔍 CI & Validation | Runs npm linting and tests |
| [PR Checks - Node Build (pnpm)](#pr-checks---node-build-pnpm) | 🔍 CI & Validation | Validates Node.js projects build successfully with pnpm |
| [PR Checks - Node (pnpm)](#pr-checks---node-pnpm) | 🔍 CI & Validation | Runs pnpm linting and tests |
| [tofu-pre-release](#tofu-pre-release) | 📦 Release & Changelog | Posts changelog preview comments on PRs using semantic-release |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | Generates project READMEs using AI with multi-provider support |
| [tofu-release](#tofu-release) | 📦 Release & Changelog | Creates releases for Terraform modules and updates README versions |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Generates Terraform documentation using terraform-docs |
| [tfsec-security-scan](#tfsec-security-scan) | 🔒 Security | Scans Terraform code for security issues using tfsec |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Validates Terraform code formatting and syntax |
| [tofu-test](#tofu-test) | 🔍 CI & Validation | Runs Terraform tests across multiple modules |
| [update-readme-actions](#update-readme-actions) | 📚 Documentation | Auto-generates workflow documentation in README |

## 🔍 CI & Validation

### branch-validation

Validates pull request branch names against configurable regex patterns. Enforces consistent branch naming conventions like `feat/description`, `fix/bug-123`, or `docs/readme`.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| pattern | Regex pattern for branch name validation | No | `^(feat\|feature\|fix\|docs\|style\|refactor\|perf\|test\|build\|ci\|chore\|revert)/.+$` |

**Secrets required**

None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/branch-validation.yml@main
with:
  pattern: '^(feat|fix|docs)/.+$'
```

### conventional-commit

Validates commit messages follow the conventional commits specification using commitlint. Ensures consistent commit history for changelog generation and semantic versioning.

**Inputs**

None

**Secrets required**

None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

### PR Checks - Docker Build

Validates Docker images build successfully without errors. Useful for catching build failures early in the PR process before pushing to registries.

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
  context: ./backend
  dockerfile: Dockerfile.prod
```

### PR Checks - Go

Runs Go linting with `go vet` and executes test suites. Supports custom Go versions or auto-detection from go.mod.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for go commands | No | `.` |
| go-version | Go version (overrides go.mod if set) | No | `` |

**Secrets required**

None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-go.yml@main
with:
  working-directory: ./api
  go-version: '1.21'
```

### PR Checks - Node (npm)

Runs npm-based projects through linting and testing. Automatically detects and runs available lint scripts (`test:static` or `lint`).

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for npm commands | No | `.` |
| node-version | Node.js version (overrides .node-version file if set) | No | `` |

**Secrets required**

- `GITHUB_TOKEN` (for private package access)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-npm.yml@main
with:
  working-directory: ./frontend
  node-version: '20'
```

### PR Checks - Node Build (pnpm)

Validates pnpm-based projects compile successfully by running the build script. Catches build-time errors before deployment.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for pnpm commands | No | `.` |
| node-version | Node.js version (overrides .node-version file if set) | No | `` |

**Secrets required**

- `GITHUB_TOKEN` (for private package access)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-pnpm-build.yml@main
with:
  working-directory: ./app
  node-version: '22'
```

### PR Checks - Node (pnpm)

Runs pnpm-based projects through linting and testing. Automatically detects and runs available lint scripts.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for pnpm commands | No | `.` |
| node-version | Node.js version (overrides .node-version file if set) | No | `` |

**Secrets required**

- `GITHUB_TOKEN` (for private package access)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-pnpm.yml@main
with:
  working-directory: ./packages/ui
  node-version: '20'
```

### tofu-lint

Validates OpenTofu/Terraform code formatting and syntax. Runs `tofu fmt -check` and `tofu validate` to ensure code quality.

**Inputs**

None

**Secrets required**

None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-lint.yml@main
```

### tofu-test

Runs OpenTofu/Terraform tests across multiple modules in parallel. Executes `tofu test` to validate infrastructure code behavior.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| modules | JSON array of module paths to test | Yes | - |
| tofu_version | OpenTofu version to use | No | `1.10.6` |

**Secrets required**

None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-test.yml@main
with:
  modules: '["modules/vpc", "modules/eks"]'
  tofu_version: '1.10.6'
```

## 🔒 Security

### Docker Security Scan

Scans Docker images for vulnerabilities using Trivy before deployment. Configurable severity thresholds and exit codes allow flexible security policies.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| context | Build context directory | Yes | - |
| dockerfile | Path to Dockerfile relative to context | No | `Dockerfile` |
| image_name | Name for the scanned image | Yes | - |
| severity | Minimum severity to report | No | `CRITICAL,HIGH` |
| build_args | Docker build arguments (multiline) | No | `` |
| exit_code | Exit code when vulnerabilities are found | No | `1` |

**Secrets required**

None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/docker-security-scan.yml@main
with:
  context: ./backend
  image_name: my-api
  severity: 'CRITICAL,HIGH,MEDIUM'
  exit_code: 0
```

### ECR Security Scan

Scans latest semantic version tags of ECR images for vulnerabilities. Sends Slack alerts when critical or high severity issues are detected.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| image_names | JSON array of image names to scan | Yes | - |
| ecr_registry | ECR registry URL | No | `public.ecr.aws/nullplatform` |
| severity | Minimum severity to report | No | `CRITICAL,HIGH` |

**Secrets required**

- `aws_role_arn` (AWS IAM Role for OIDC)
- `slack_webhook_url` (Slack webhook for alerts)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/ecr-security-scan.yml@main
with:
  image_names: '["k8s-logs-controller", "k8s-traffic-manager"]'
  severity: 'CRITICAL,HIGH'
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
  slack_webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### tfsec-security-scan

Scans Terraform/OpenTofu code for security misconfigurations using tfsec. Uploads results to GitHub Security tab and posts PR comments on failures.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| minimum_severity | Minimum severity level to report | No | `HIGH` |
| upload_sarif | Upload SARIF results to GitHub Security | No | `true` |
| post_comment | Post comment on PR if scan fails | No | `true` |

**Secrets required**

None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tfsec.yml@main
with:
  minimum_severity: 'CRITICAL'
  upload_sarif: true
  post_comment: true
```

## 🚀 Build & Deploy

### Docker Build and Push to ECR

Builds multi-architecture Docker images using buildx and pushes to Amazon ECR Public. Supports custom build arguments and automatic tagging.

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

- `aws_role_arn` (AWS IAM Role for OIDC)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/docker-build-push-ecr.yml@main
with:
  image_name: my-app
  context: .
  dockerfile: Dockerfile
  tag: 'v1.2.3'
  platforms: 'linux/amd64,linux/arm64'
  build_args: |
    NODE_ENV=production
    API_VERSION=2.0
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
```

## 📦 Release & Changelog

### Changelog and Release

Generates conventional changelogs, bumps semantic versions, and creates GitHub releases. Supports Helm charts, npm packages, and generic projects with automatic version detection.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| project-type | Type of project | No | `generic` |
| source-dir | Directory containing packages/charts | No | `.` |
| version-file | Version file name | No | `` |
| tag-prefix | Prefix for git tags | No | `` |
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
  project-type: 'helm-charts'
  source-dir: 'charts'
  tag-prefix: 'v'
  create-github-release: true
```

### tofu-pre-release

Posts automated changelog preview comments on pull requests using semantic-release-github-pr. Helps reviewers understand release impact before merging.

**Inputs**

None

**Secrets required**

- `GITHUB_TOKEN` (automatically provided)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pre-release.yml@main
```

### tofu-release

Creates releases for Terraform modules using Google's Release Please action. Optionally updates version references across all README files after release.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| update_readme_versions | Update version references in README files | No | `true` |

**Outputs**

| Name | Description |
|------|-------------|
| release_created | Whether a release was created |
| tag_name | The tag name of the release |

**Secrets required**

- `GITHUB_TOKEN` (automatically provided)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/release.yml@main
with:
  update_readme_versions: true
```

## 📚 Documentation

### readme-ai-generator-v2

Generates or updates project README files using AI with support for multiple providers (Groq, GitHub Models, OpenAI, Anthropic). Automatically det

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
