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

This repository contains reusable GitHub Actions workflows for CI/CD automation across nullplatform projects.

## Summary

| Workflow | Category | Description |
|----------|----------|-------------|
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Validates branch names match conventional commit type prefixes |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Validates commit messages follow conventional commit format |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Runs OpenTofu formatting and validation checks |
| [tofu-test](#tofu-test) | 🔍 CI & Validation | Executes OpenTofu tests across multiple modules |
| [tfsec-security-scan](#tfsec-security-scan) | 🔒 Security | Scans Terraform/OpenTofu code for security vulnerabilities |
| [docker-security-scan](#docker-security-scan) | 🔒 Security | Builds Docker images and scans for vulnerabilities using Trivy |
| [ecr-security-scan](#ecr-security-scan) | 🔒 Security | Scans ECR images for vulnerabilities and sends Slack alerts |
| [docker-build-push-ecr](#docker-build-push-ecr) | 🚀 Build & Deploy | Builds multi-architecture Docker images and pushes to ECR Public |
| [Changelog and Release](#changelog-and-release) | 📦 Release & Changelog | Generates changelogs, bumps versions, creates tags and GitHub releases |
| [tofu-release](#tofu-release) | 📦 Release & Changelog | Automates releases for Terraform modules using Release Please |
| [tofu-pre-release](#tofu-pre-release) | 📦 Release & Changelog | Posts changelog preview comments on pull requests |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Auto-generates Terraform module documentation using terraform-docs |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | Generates AI-powered README documentation for code projects |

---

## 🔍 CI & Validation

### branch-validation

Enforces branch naming conventions by validating that branch names follow a conventional commit-style pattern. Use this in pull request workflows to ensure consistent branch naming across your team.

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

### conventional-commit

Validates that all commits in a pull request follow the conventional commit specification. Ensures consistent commit history and enables automated changelog generation.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

### tofu-lint

Performs OpenTofu/Terraform code quality checks including formatting validation and configuration validation. Run this before merging infrastructure changes.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-lint.yml@main
```

### tofu-test

Executes OpenTofu test suites across multiple modules in parallel. Use this to validate infrastructure changes with automated tests before deployment.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| modules | JSON array of module paths to test (e.g. ["module/a", "module/b"]) | Yes | - |
| tofu_version | OpenTofu version to use | No | 1.10.6 |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-test.yml@main
with:
  modules: '["modules/vpc", "modules/eks"]'
  tofu_version: '1.10.6'
```

---

## 🔒 Security

### tfsec-security-scan

Scans Terraform/OpenTofu infrastructure code for security misconfigurations and compliance issues. Automatically uploads results to GitHub Security tab and can post PR comments on failures.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| minimum_severity | Minimum severity level to report (CRITICAL, HIGH, MEDIUM, LOW) | No | HIGH |
| upload_sarif | Upload SARIF results to GitHub Security tab | No | true |
| post_comment | Post comment on PR if scan fails | No | true |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tfsec.yml@main
with:
  minimum_severity: 'HIGH'
  upload_sarif: true
  post_comment: true
```

### docker-security-scan

Builds Docker images and scans them for vulnerabilities using Trivy before deployment. Fails the build if vulnerabilities above the specified severity are found.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| context | Build context directory | Yes | - |
| dockerfile | Path to Dockerfile relative to context | No | Dockerfile |
| image_name | Name for the scanned image (used for reporting) | Yes | - |
| severity | Minimum severity to report (CRITICAL,HIGH,MEDIUM,LOW) | No | CRITICAL,HIGH |
| exit_code | Exit code when vulnerabilities are found (0 to not fail) | No | 1 |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/docker-security-scan.yml@main
with:
  context: './app'
  dockerfile: 'Dockerfile'
  image_name: 'my-application'
  severity: 'CRITICAL,HIGH'
```

### ecr-security-scan

Scans the latest versions of images in ECR Public for vulnerabilities and sends Slack alerts when issues are detected. Schedule this workflow to run periodically for continuous security monitoring.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| image_names | JSON array of image names to scan (e.g., ["k8s-logs-controller", "k8s-traffic-manager"]) | Yes | - |
| ecr_registry | ECR registry URL | No | public.ecr.aws/nullplatform |
| severity | Minimum severity to report (CRITICAL,HIGH,MEDIUM,LOW) | No | CRITICAL,HIGH |

**Secrets required**

- `aws_role_arn`: AWS IAM Role ARN for OIDC authentication to access ECR
- `slack_webhook_url`: Slack webhook URL for sending vulnerability alerts

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

---

## 🚀 Build & Deploy

### docker-build-push-ecr

Builds multi-architecture Docker images and pushes them to Amazon ECR Public. Supports ARM64 and AMD64 platforms with build caching for faster builds.

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
| build_args | Docker build arguments (newline-separated, e.g. "ARG1=val1\nARG2=val2") | No | '' |

**Secrets required**

- `aws_role_arn`: AWS IAM Role ARN for OIDC authentication to push to ECR

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/docker-build-push-ecr.yml@main
with:
  image_name: 'my-app'
  context: './src'
  dockerfile: 'Dockerfile'
  tag: 'v1.0.0'
  platforms: 'linux/amd64,linux/arm64'
  build_args: |
    VERSION=1.0.0
    BUILD_DATE=${{ github.event.repository.updated_at }}
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
```

---

## 📦 Release & Changelog

### Changelog and Release

Automates versioning, changelog generation, and GitHub releases based on conventional commits. Supports Helm charts, npm packages, and generic projects with configurable version file detection.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| project-type | Type of project: helm-charts, npm, generic | No | generic |
| source-dir | Directory containing packages/charts (use . for root) | No | . |
| version-file | Version file name (Chart.yaml, package.json, VERSION). Auto-detected if not specified. | No | '' |
| tag-prefix | Prefix for git tags (e.g., "v" for v1.0.0). Use empty for no prefix. | No | '' |
| create-github-release | Create a GitHub Release | No | true |
| commit-message | Commit message for version bump | No | chore(release): bump version and update changelog [skip ci] |

**Outputs**

- `has_changes`: Whether there were changes to release
- `new_version`: The new version number
- `changelog`: The generated changelog content

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/changelog-release.yml@main
with:
  project-type: 'npm'
  source-dir: 'packages'
  tag-prefix: 'v'
  create-github-release: true
```

### tofu-release

Automates releases for Terraform/OpenTofu modules using Google's Release Please. Creates release PRs with automated changelogs and optionally updates version references in README files.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| update_readme_versions | Update version references in README files after release | No | true |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/release.yml@main
with:
  update_readme_versions: true
```

### tofu-pre-release

Posts a changelog preview comment on pull requests showing what changes would be included in the next release. Helps reviewers understand the impact of changes before merging.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pre-release.yml@main
```

---

## 📚 Documentation

### tofu-docs

Automatically generates and updates Terraform module documentation using terraform-docs. Injects generated content between markers in README files and commits changes.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tf-docs.yml@main
```

### readme-ai-generator-v2

Generates comprehensive README documentation using AI for Terraform, TypeScript, Python, and other projects. Detects changes automatically or generates for all projects on demand.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| base_dir | Base directory to search for projects | No | . |
| generator_type | Force generator type (terraform, typescript, python, generic) or leave empty for auto-detect | No | '' |
| generate_all | Generate README for all projects (ignores changed files detection) | No | false |
| file_patterns | File patterns to detect changes (space-separated, e.g., "*.tf *.py") | No | *.tf *.ts *.tsx *.js *.jsx *.py |
| ai_provider | AI provider (groq, github, openai, anthropic) | No | groq |
| ai_model | AI model to use for generation (provider-specific, leave empty for default) | No | '' |
| run_post_generation | Commands to run after generation (e.g., terraform-docs) | No | '' |

**Secrets required**

- `GROQ_API_KEY`: API key for Groq AI (if using Groq provider)
- `OPENAI_API_KEY`: API key for OpenAI (if using OpenAI provider)
- `ANTHROPIC_API_KEY`: API key for Anthropic (if using Anthropic provider)
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/readme-ai-v2.yml@main
with:
  generator_type: 'terraform'
  generate_all: false
  ai_provider: 'groq'
  file_patterns: '*.tf *.md'
  run_post_generation: 'terraform-docs .'
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
