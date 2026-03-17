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
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Validates PR branch names against conventional commit prefixes |
| [Changelog and Release](#changelog-and-release) | 📦 Release & Changelog | Automates version bumping, changelog generation, and GitHub releases |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Validates commit messages follow conventional commits specification |
| [Docker Build and Push to ECR](#docker-build-and-push-to-ecr) | 🚀 Build & Deploy | Builds multi-architecture Docker images and pushes to Amazon ECR Public |
| [Docker Security Scan](#docker-security-scan) | 🔒 Security | Scans Docker images for vulnerabilities using Trivy |
| [ECR Security Scan](#ecr-security-scan) | 🔒 Security | Scans latest ECR images for vulnerabilities with Slack alerts |
| [PR Checks - Docker Build](#pr-checks---docker-build) | 🔍 CI & Validation | Validates Docker builds in pull requests |
| [PR Checks - Go](#pr-checks---go) | 🔍 CI & Validation | Runs Go linting and tests in pull requests |
| [PR Checks - Node (npm)](#pr-checks---node-npm) | 🔍 CI & Validation | Runs npm linting and tests in pull requests |
| [PR Checks - Node Build (pnpm)](#pr-checks---node-build-pnpm) | 🔍 CI & Validation | Validates Node.js build with pnpm in pull requests |
| [PR Checks - Node (pnpm)](#pr-checks---node-pnpm) | 🔍 CI & Validation | Runs pnpm linting and tests in pull requests |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | Generates or updates README files using AI based on code changes |
| [tofu-release](#tofu-release) | 📦 Release & Changelog | Creates releases for Terraform modules using Release Please |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Generates Terraform documentation using terraform-docs |
| [tfsec-security-scan](#tfsec-security-scan) | 🔒 Security | Scans Terraform code for security issues using tfsec |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Validates Terraform/OpenTofu code formatting and syntax |
| [tofu-test](#tofu-test) | 🔍 CI & Validation | Runs OpenTofu tests across multiple modules |

---

## 🔍 CI & Validation

### branch-validation

Validates that pull request branch names follow conventional commit type prefixes (feat/, fix/, docs/, etc.). Use this workflow to enforce consistent branch naming conventions across your team, ensuring branches are properly categorized by their purpose.

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

Validates that commit messages in pull requests follow the conventional commits specification using commitlint. Use this workflow to maintain clean, standardized commit history that enables automated changelog generation and semantic versioning.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

### PR Checks - Docker Build

Validates that Docker images can be built successfully in pull requests. Use this workflow to catch Docker build issues early before merging changes, ensuring your Dockerfiles and build context are correct.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| context | Docker build context path | No | `.` |
| dockerfile | Path to the Dockerfile | No | `Dockerfile` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-docker.yml@main
with:
  context: ./backend
  dockerfile: Dockerfile
```

### PR Checks - Go

Runs Go linting (vet) and tests for pull requests. Use this workflow to validate Go code quality and ensure tests pass before merging changes.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for go commands | No | `.` |
| go-version | Go version (overrides go.mod if set) | No | `` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-go.yml@main
with:
  working-directory: ./api
  go-version: '1.21'
```

### PR Checks - Node (npm)

Runs npm-based linting and tests for pull requests. Automatically detects and runs either `test:static` or `lint` scripts. Use this workflow for Node.js projects using npm as the package manager.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for npm commands | No | `.` |
| node-version | Node.js version (overrides .node-version file if set) | No | `` |

**Secrets required**

- `CI_TOKEN` (optional, falls back to `GITHUB_TOKEN`)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-npm.yml@main
with:
  working-directory: ./frontend
  node-version: '20'
secrets:
  CI_TOKEN: ${{ secrets.CI_TOKEN }}
```

### PR Checks - Node Build (pnpm)

Validates that Node.js projects using pnpm can be built successfully. Use this workflow to ensure build processes work before merging pull requests.

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

Runs pnpm-based linting and tests for pull requests. Automatically detects and runs either `test:static` or `lint` scripts. Use this workflow for Node.js projects using pnpm as the package manager.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for pnpm commands | No | `.` |
| node-version | Node.js version (overrides .node-version file if set) | No | `` |

**Secrets required**

- `CI_TOKEN` (optional, falls back to `GITHUB_TOKEN`)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-pnpm.yml@main
with:
  working-directory: ./packages/core
  node-version: '22'
secrets:
  CI_TOKEN: ${{ secrets.CI_TOKEN }}
```

### tofu-lint

Validates OpenTofu/Terraform code formatting and syntax. Runs `tofu init`, `tofu fmt -check`, and `tofu validate` to ensure code quality. Use this workflow to enforce consistent Terraform formatting and catch syntax errors before merging.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-lint.yml@main
```

### tofu-test

Runs OpenTofu tests across multiple modules in parallel. Use this workflow to execute automated Terraform/OpenTofu tests, validating your infrastructure code with real plan/apply scenarios.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| modules | JSON array of module paths to test (e.g. ["module/a", "module/b"]) | Yes | - |
| tofu_version | OpenTofu version to use | No | `1.10.6` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-test.yml@main
with:
  modules: '["modules/vpc", "modules/eks"]'
  tofu_version: '1.10.6'
```

---

## 🔒 Security

### Docker Security Scan

Scans Docker images for security vulnerabilities using Trivy before pushing to registries. Use this workflow in pull requests to identify and fix security issues early in the development cycle.

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
  context: ./backend
  dockerfile: Dockerfile
  image_name: my-api
  severity: CRITICAL,HIGH
  exit_code: 1
```

### ECR Security Scan

Scans the latest versions of Docker images in Amazon ECR Public for vulnerabilities using Trivy. Sends Slack alerts when critical or high severity issues are found. Use this workflow on a schedule to monitor production images for newly discovered vulnerabilities.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| image_names | JSON array of image names to scan (e.g., ["k8s-logs-controller", "k8s-traffic-manager"]) | Yes | - |
| ecr_registry | ECR registry URL | No | `public.ecr.aws/nullplatform` |
| severity | Minimum severity to report (CRITICAL,HIGH,MEDIUM,LOW) | No | `CRITICAL,HIGH` |

**Secrets required**

- `aws_role_arn`
- `slack_webhook_url`

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/ecr-security-scan.yml@main
with:
  image_names: '["api", "worker", "scheduler"]'
  ecr_registry: public.ecr.aws/myorg
  severity: CRITICAL,HIGH
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
  slack_webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### tfsec-security-scan

Scans Terraform code for security misconfigurations and compliance issues using tfsec. Uploads results to GitHub Security tab and posts PR comments on failures. Use this workflow to identify infrastructure security issues before deployment.

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
  minimum_severity: CRITICAL
  upload_sarif: true
  post_comment: true
```

---

## 🚀 Build & Deploy

### Docker Build and Push to ECR

Builds multi-architecture Docker images and pushes them to Amazon ECR Public using OIDC authentication. Supports custom build arguments and automatic tagging with version numbers. Use this workflow to build and publish production Docker images with proper versioning.

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

- `aws_role_arn`

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/docker-build-push-ecr.yml@main
with:
  image_name: my-app
  context: .
  dockerfile: Dockerfile
  platforms: linux/amd64,linux/arm64
  tag: v1.2.3
  build_args: |
    NODE_ENV=production
    APP_VERSION=1.2.3
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
```

---

## 📦 Release & Changelog

### Changelog and Release

Automates semantic versioning, changelog generation, and GitHub releases based on conventional commits. Supports multiple project types (Helm charts, npm packages, generic) with automatic version bumping in Chart.yaml, package.json, or VERSION files. Use this workflow to streamline your release process with automated version management.

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

Creates automated releases for Terraform modules using Release Please. Supports optional version reference updates in README files after release. Use this workflow to automate Terraform module releases with proper semantic versioning.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| update_readme_versions | Update version references in README files after release | No | `true` |

**Outputs**

| Name | Description |
|------|

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
