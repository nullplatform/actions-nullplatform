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

This repository provides production-ready reusable workflows for common CI/CD tasks including validation, security scanning, building, and releases.

## Summary

| Workflow | Category | Description |
|----------|----------|-------------|
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Validates branch names follow conventional commit type patterns |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Validates commit messages follow conventional commit format |
| [Changelog and Release](#changelog-and-release) | 📦 Release & Changelog | Generates changelogs and creates releases with version bumping |
| [Docker Build and Push to ECR](#docker-build-and-push-to-ecr) | 🚀 Build & Deploy | Builds multi-arch Docker images and pushes to Amazon ECR Public |
| [Docker Security Scan](#docker-security-scan) | 🔒 Security | Scans Docker images for vulnerabilities using Trivy |
| [ECR Security Scan](#ecr-security-scan) | 🔒 Security | Scans ECR images for vulnerabilities and sends Slack alerts |
| [PR Checks - Docker Build](#pr-checks---docker-build) | 🔍 CI & Validation | Validates Docker builds in pull requests |
| [PR Checks - Go](#pr-checks---go) | 🔍 CI & Validation | Runs linting and tests for Go projects |
| [PR Checks - Node (npm)](#pr-checks---node-npm) | 🔍 CI & Validation | Runs linting and tests for Node.js projects using npm |
| [PR Checks - Node (pnpm)](#pr-checks---node-pnpm) | 🔍 CI & Validation | Runs linting and tests for Node.js projects using pnpm |
| [tofu-pre-release](#tofu-pre-release) | 📦 Release & Changelog | Posts changelog preview comments on pull requests |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | Generates AI-powered README files for projects |
| [tofu-release](#tofu-release) | 📦 Release & Changelog | Creates releases for Terraform modules with version updates |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Generates Terraform module documentation automatically |
| [tfsec-security-scan](#tfsec-security-scan) | 🔒 Security | Scans Terraform code for security issues |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Validates Terraform code formatting and syntax |
| [tofu-test](#tofu-test) | 🔍 CI & Validation | Runs OpenTofu tests for multiple modules |

---

## 🔍 CI & Validation

### branch-validation

Validates that pull request branch names follow conventional commit type patterns (e.g., `feat/description`, `fix/bug-123`). Use this workflow to enforce consistent branch naming conventions across your team.

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
  pattern: '^(feat|fix|docs)/.+$'
```

### conventional-commit

Validates that all commits in a pull request follow the conventional commit format. Ensures commit messages are properly structured with types like `feat:`, `fix:`, `docs:`, etc.

**Inputs**
- None

**Secrets required**
- None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

### PR Checks - Docker Build

Validates that Docker images can be built successfully in pull requests. Use this for projects where Docker builds are a critical part of the CI pipeline.

**Inputs**
- None

**Secrets required**
- `GITHUB_TOKEN` (automatically provided by GitHub Actions)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-docker.yml@main
```

### PR Checks - Go

Runs linting and tests for Go projects. Automatically detects Go version from `go.mod` and runs `go vet` and `go test`.

**Inputs**
- None

**Secrets required**
- None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-go.yml@main
```

### PR Checks - Node (npm)

Runs linting and tests for Node.js projects using npm. Automatically caches dependencies and runs static analysis before tests.

**Inputs**
- None

**Secrets required**
- `GITHUB_TOKEN` (for GitHub Packages access)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-npm.yml@main
```

### PR Checks - Node (pnpm)

Runs linting and tests for Node.js projects using pnpm package manager. Includes smart script detection to run available lint commands.

**Inputs**
- None

**Secrets required**
- `GITHUB_TOKEN` (for GitHub Packages access)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-pnpm.yml@main
```

### tofu-lint

Validates Terraform/OpenTofu code formatting and syntax. Runs `tofu fmt -check` and `tofu validate` to ensure code quality.

**Inputs**
- None

**Secrets required**
- None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-lint.yml@main
```

### tofu-test

Runs OpenTofu tests for multiple modules in parallel. Use this to validate Terraform module functionality before merging.

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

---

## 🔒 Security

### Docker Security Scan

Scans Docker images for vulnerabilities using Trivy before pushing to registries. Use this in PR workflows to catch security issues early.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| context | Build context directory | Yes | - |
| dockerfile | Path to Dockerfile relative to context | No | `Dockerfile` |
| image_name | Name for the scanned image (used for reporting) | Yes | - |
| severity | Minimum severity to report | No | `CRITICAL,HIGH` |
| build_args | Docker build arguments (multiline) | No | - |
| exit_code | Exit code when vulnerabilities are found | No | `1` |

**Secrets required**
- None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/docker-security-scan.yml@main
with:
  context: .
  dockerfile: Dockerfile
  image_name: my-app
  severity: 'CRITICAL,HIGH'
```

### ECR Security Scan

Scans images in Amazon ECR Public for vulnerabilities and sends Slack alerts when critical or high severity issues are found. Run this on a schedule to monitor production images.

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
  image_names: '["k8s-logs-controller", "k8s-traffic-manager"]'
  ecr_registry: 'public.ecr.aws/nullplatform'
  severity: 'CRITICAL,HIGH'
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
  slack_webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### tfsec-security-scan

Scans Terraform code for security misconfigurations and best practice violations. Uploads results to GitHub Security tab and posts comments on PRs.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| minimum_severity | Minimum severity level to report | No | `HIGH` |
| upload_sarif | Upload SARIF results to GitHub Security tab | No | `true` |
| post_comment | Post comment on PR if scan fails | No | `true` |

**Secrets required**
- None

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

Builds multi-architecture Docker images (amd64/arm64) and pushes them to Amazon ECR Public. Use this for production deployments requiring multi-platform support.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| image_name | Name of the Docker image | Yes | - |
| context | Build context directory | Yes | - |
| dockerfile | Path to Dockerfile relative to context | No | `Dockerfile` |
| platforms | Target platforms for multi-arch build | No | `linux/amd64,linux/arm64` |
| ecr_registry | ECR registry URL | No | `public.ecr.aws/nullplatform` |
| tag | Additional tag for the image (version required) | No | - |
| aws_region | AWS region for ECR | No | `us-east-1` |
| build_args | Docker build arguments (newline-separated) | No | - |

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
    API_URL=https://api.example.com
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
```

---

## 📦 Release & Changelog

### Changelog and Release

Generates changelogs from conventional commits, bumps versions, and creates GitHub releases. Supports Helm charts, npm packages, and generic projects with automatic version detection.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| project-type | Type of project: helm-charts, npm, generic | No | `generic` |
| source-dir | Directory containing packages/charts | No | `.` |
| version-file | Version file name (auto-detected if empty) | No | - |
| tag-prefix | Prefix for git tags | No | - |
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

Posts changelog preview comments on pull requests using semantic-release. Use this to show what will be released before merging.

**Inputs**
- None

**Secrets required**
- `GITHUB_TOKEN` (automatically provided)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pre-release.yml@main
```

### tofu-release

Creates releases for Terraform modules using Release Please and optionally updates version references in all README files.

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

---

## 📚 Documentation

### readme-ai-generator-v2

Generates or updates README files using AI for Terraform, TypeScript, Python, or generic projects. Detects changed files automatically or can regenerate all project READMEs.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| base_dir | Base directory to search for projects | No | `.` |
| generator_type | Force generator type or leave empty for auto-detect | No | - |
| generate_all | Generate README for all projects | No | `false` |
| file_patterns | File patterns to detect changes | No | `*.tf *.ts *.tsx *.js *.jsx *.py` |
| ai_provider | AI provider (groq, github, openai, anthropic) | No | `groq` |
| ai_model | AI model to use for generation | No | - |
| run_post_generation | Commands to run after generation | No | - |

**Secrets required**
- `GROQ_API_KEY` (if using Groq)
- `GITHUB_TOKEN` (if using GitHub Models)
- `OPENAI_API_KEY` (if using OpenAI)
- `ANTHROPIC_API_KEY` (if using Anthropic)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/readme-ai-v2.yml@main
with:
  base_dir: 'modules'
  generator_type: 'terraform'
  generate_all: false
  ai_provider: 'groq'
  run_post_generation: 'terraform-docs .'
secrets:
  GROQ_API_KEY: ${{ secrets.GROQ_API_KEY }}
```

### tofu-docs

Generates Terraform module documentation automatically using terraform-docs. Injects documentation into README files using markers and commits changes.

**Inputs**
- None

**Secrets required**
- None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tf-docs.yml@main
```

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
