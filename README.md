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

This repository contains reusable workflows for CI/CD, security scanning, documentation generation, and release automation.

## Summary

| Workflow | Category | Description |
|----------|----------|-------------|
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Enforces conventional branch naming patterns for pull requests |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Validates commit messages follow conventional commit format |
| [tfsec-security-scan](#tfsec-security-scan) | 🔒 Security | Scans Terraform/OpenTofu code for security vulnerabilities and misconfigurations |
| [docker-security-scan](#docker-security-scan) | 🔒 Security | Scans Docker images for vulnerabilities using Trivy before pushing to registry |
| [ecr-security-scan](#ecr-security-scan) | 🔒 Security | Continuously scans latest ECR images and sends Slack alerts for critical vulnerabilities |
| [docker-build-push-ecr](#docker-build-push-ecr) | 🚀 Build & Deploy | Builds multi-arch Docker images and pushes to Amazon ECR Public registry |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Validates and formats OpenTofu/Terraform code for consistency |
| [tofu-test](#tofu-test) | 🔍 CI & Validation | Runs OpenTofu tests across multiple modules in parallel |
| [pr-checks-docker](#pr-checks-docker) | 🔍 CI & Validation | Validates Docker builds in pull requests before merge |
| [pr-checks-go](#pr-checks-go) | 🔍 CI & Validation | Runs Go linting and tests for pull request validation |
| [pr-checks-node-npm](#pr-checks-node-npm) | 🔍 CI & Validation | Validates Node.js projects using npm package manager |
| [pr-checks-node-pnpm](#pr-checks-node-pnpm) | 🔍 CI & Validation | Validates Node.js projects using pnpm package manager |
| [Changelog and Release](#changelog-and-release) | 📦 Release & Changelog | Generates changelogs, bumps versions, creates tags and GitHub releases automatically |
| [tofu-release](#tofu-release) | 📦 Release & Changelog | Automates Terraform module releases with version bumping and README updates |
| [tofu-pre-release](#tofu-pre-release) | 📦 Release & Changelog | Previews changelog in pull requests before merging |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Auto-generates Terraform documentation and injects into README files |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | Generates comprehensive README documentation using AI for Terraform, TypeScript, Python projects |

## 🔍 CI & Validation

### branch-validation

Validates branch names against conventional naming patterns to ensure consistent Git workflow practices. Enforces format like `feat/description`, `fix/bug-123`, preventing merges of incorrectly named branches.

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

Validates all commit messages in pull requests follow the conventional commits specification, ensuring consistent commit history and enabling automated changelog generation.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

### tofu-lint

Validates OpenTofu/Terraform code formatting and syntax, ensuring infrastructure code meets quality standards before deployment.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-lint.yml@main
```

### tofu-test

Executes OpenTofu test suites across multiple modules in parallel, validating infrastructure code behavior and configurations.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| modules | JSON array of module paths to test | Yes | - |
| tofu_version | OpenTofu version to use | No | `1.10.6` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-test.yml@main
with:
  modules: '["modules/vpc", "modules/ecs"]'
  tofu_version: '1.10.6'
```

### pr-checks-docker

Validates Docker builds succeed in pull requests, catching build failures before code reaches main branch.

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

### pr-checks-go

Runs Go linting and tests for pull requests, ensuring code quality and preventing broken builds.

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

### pr-checks-node-npm

Validates Node.js projects using npm, running linting and tests to ensure code quality in pull requests.

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

### pr-checks-node-pnpm

Validates Node.js projects using pnpm package manager, optimized for monorepos and faster installations.

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

## 🔒 Security

### tfsec-security-scan

Scans Terraform/OpenTofu infrastructure code for security vulnerabilities, misconfigurations, and compliance violations. Uploads results to GitHub Security tab and posts comments on pull requests.

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

### docker-security-scan

Scans Docker images for known vulnerabilities using Trivy before pushing to registries, preventing vulnerable images from deployment.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| context | Build context directory | Yes | - |
| dockerfile | Path to Dockerfile relative to context | No | `Dockerfile` |
| image_name | Name for the scanned image (used for reporting) | Yes | - |
| severity | Minimum severity to report | No | `CRITICAL,HIGH` |
| build_args | Docker build arguments (multiline) | No | `` |
| exit_code | Exit code when vulnerabilities are found | No | `1` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/docker-security-scan.yml@main
with:
  context: ./services/api
  dockerfile: Dockerfile
  image_name: my-api
  severity: CRITICAL,HIGH
  exit_code: 1
```

### ecr-security-scan

Continuously monitors ECR images for security vulnerabilities, scanning latest versions and sending Slack alerts for critical findings.

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
  ecr_registry: public.ecr.aws/myorg
  severity: CRITICAL,HIGH
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
  slack_webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 🚀 Build & Deploy

### docker-build-push-ecr

Builds multi-architecture Docker images (amd64/arm64) and pushes to Amazon ECR Public registry with semantic versioning.

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
- `aws_role_arn` - AWS IAM Role ARN for OIDC authentication

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/docker-build-push-ecr.yml@main
with:
  image_name: my-app
  context: .
  dockerfile: Dockerfile
  tag: v1.2.3
  platforms: linux/amd64,linux/arm64
  build_args: |
    NODE_ENV=production
    API_VERSION=v2
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
```

## 📦 Release & Changelog

### Changelog and Release

Automatically generates changelogs from conventional commits, bumps semantic versions, updates version files, creates Git tags, and publishes GitHub releases. Supports Helm charts, npm packages, and generic projects.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| project-type | Type of project: helm-charts, npm, generic | No | `generic` |
| source-dir | Directory containing packages/charts | No | `.` |
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
secrets: inherit
```

### tofu-release

Automates Terraform module releases using Release Please, handling version bumping, changelog generation, and optionally updating version references across all README files.

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
secrets: inherit
```

### tofu-pre-release

Generates changelog preview in pull request comments using semantic-release, helping reviewers understand the impact of changes before merge.

**Secrets required**
- `GITHUB_TOKEN` (automatically provided)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pre-release.yml@main
secrets: inherit
```

## 📚 Documentation

### tofu-docs

Automatically generates Terraform module documentation using terraform-docs and injects it into README files between markers. Runs on every push or can be triggered manually.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tf-docs.yml@main
```

### readme-ai-generator-v2

Generates comprehensive, context-aware README documentation using AI for Terraform modules, TypeScript/JavaScript projects, and Python packages. Detects changed files or regenerates all documentation with support for multiple AI providers.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| base_dir | Base directory to search for projects | No | `.` |
| generator_type | Force generator type or leave empty for auto-detect | No | `` |
| generate_all | Generate README for all projects | No | `false` |
| file_patterns | File patterns to detect changes | No | `*.tf *.ts *.tsx *.js *.jsx *.py` |
| ai_provider | AI provider (groq, github, openai, anthropic) | No | `groq` |
| ai_model | AI model to use for generation | No | `` |
| run_post_generation | Commands to run after generation | No | `` |

**Secrets required**
- `GITHUB_TOKEN` (automatically provided)
- `GROQ_API_KEY` (if using Groq provider)
- `OPENAI_API_KEY` (if using OpenAI provider)
- `ANTHROPIC_API_KEY` (if using Anthropic

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
