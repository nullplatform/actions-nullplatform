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

This repository provides production-ready, reusable GitHub Actions workflows for CI/CD, security, documentation, and release management.

## Summary

| Workflow | Category | Description |
|----------|----------|-------------|
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Validates branch names follow conventional commit type prefixes |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Validates commit messages follow conventional commit format |
| [tfsec-security-scan](#tfsec-security-scan) | 🔒 Security | Scans Terraform/OpenTofu code for security vulnerabilities |
| [docker-security-scan](#docker-security-scan) | 🔒 Security | Scans Docker images for vulnerabilities using Trivy |
| [ecr-security-scan](#ecr-security-scan) | 🔒 Security | Scans ECR public registry images and sends Slack alerts |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Lints and validates OpenTofu/Terraform code |
| [tofu-test](#tofu-test) | 🔍 CI & Validation | Runs OpenTofu tests for multiple modules in parallel |
| [docker-build-push-ecr](#docker-build-push-ecr) | 🚀 Build & Deploy | Builds multi-arch Docker images and pushes to ECR Public |
| [Changelog and Release](#changelog-and-release) | 📦 Release & Changelog | Generates changelogs, bumps versions, creates releases for multi-package repos |
| [tofu-release](#tofu-release) | 📦 Release & Changelog | Creates releases using Release Please for Terraform modules |
| [tofu-pre-release](#tofu-pre-release) | 📦 Release & Changelog | Posts changelog preview comments on pull requests |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Generates and updates Terraform module documentation |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | AI-powered README generation for projects |

---

## 🔍 CI & Validation

### branch-validation

Validates that branch names follow a conventional commit type prefix pattern (e.g., `feat/`, `fix/`, `docs/`). Useful for enforcing Git workflow standards and ensuring consistent branch naming across teams.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `pattern` | Regex pattern for branch name validation | No | `^(feat\|feature\|fix\|docs\|style\|refactor\|perf\|test\|build\|ci\|chore\|revert)/.+$` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/branch-validation.yml@main
with:
  pattern: '^(feat|fix|docs)/.+$'  # Optional: customize allowed types
```

---

### conventional-commit

Validates that all commit messages in a pull request follow the conventional commit format (e.g., `feat:`, `fix:`, `docs:`). Uses commitlint to enforce semantic versioning-compatible commit messages.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

---

### tofu-lint

Runs OpenTofu/Terraform formatting checks and validation. Ensures code is properly formatted (`tofu fmt -check`) and syntactically valid (`tofu validate`).

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-lint.yml@main
```

---

### tofu-test

Executes OpenTofu tests for multiple modules in parallel. Supports testing multiple module paths simultaneously with configurable OpenTofu version.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `modules` | JSON array of module paths to test (e.g. `["module/a", "module/b"]`) | Yes | - |
| `tofu_version` | OpenTofu version to use | No | `1.10.6` |

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

Scans Terraform/OpenTofu code for security vulnerabilities and misconfigurations using tfsec. Generates SARIF reports and can post comments on pull requests when issues are found.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `minimum_severity` | Minimum severity level to report (CRITICAL, HIGH, MEDIUM, LOW) | No | `HIGH` |
| `upload_sarif` | Upload SARIF results to GitHub Security tab | No | `true` |
| `post_comment` | Post comment on PR if scan fails | No | `true` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tfsec.yml@main
with:
  minimum_severity: CRITICAL
  upload_sarif: true
  post_comment: true
```

---

### docker-security-scan

Scans Docker images for vulnerabilities using Trivy before pushing to registries. Builds the image locally and performs comprehensive security scanning with configurable severity thresholds.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `context` | Build context directory | Yes | - |
| `dockerfile` | Path to Dockerfile relative to context | No | `Dockerfile` |
| `image_name` | Name for the scanned image (used for reporting) | Yes | - |
| `severity` | Minimum severity to report (CRITICAL,HIGH,MEDIUM,LOW) | No | `CRITICAL,HIGH` |
| `exit_code` | Exit code when vulnerabilities are found (0 to not fail) | No | `1` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/docker-security-scan.yml@main
with:
  context: ./app
  dockerfile: Dockerfile
  image_name: my-app
  severity: CRITICAL,HIGH
  exit_code: 1
```

---

### ecr-security-scan

Scans images in ECR Public registry for vulnerabilities and sends Slack alerts when critical or high severity issues are found. Automatically discovers latest semver tags and performs scheduled scanning.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `image_names` | JSON array of image names to scan (e.g., `["k8s-logs-controller", "k8s-traffic-manager"]`) | Yes | - |
| `ecr_registry` | ECR registry URL | No | `public.ecr.aws/nullplatform` |
| `severity` | Minimum severity to report (CRITICAL,HIGH,MEDIUM,LOW) | No | `CRITICAL,HIGH` |

**Secrets required**

- `aws_role_arn`: AWS IAM Role ARN for OIDC authentication to access ECR
- `slack_webhook_url`: Slack webhook URL for vulnerability alerts

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/ecr-security-scan.yml@main
with:
  image_names: '["my-app", "my-service"]'
  ecr_registry: public.ecr.aws/myorg
  severity: CRITICAL,HIGH
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
  slack_webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

## 🚀 Build & Deploy

### docker-build-push-ecr

Builds multi-architecture Docker images and pushes them to AWS ECR Public. Supports arm64 and amd64 platforms with layer caching for faster builds.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `image_name` | Name of the Docker image (e.g., k8s-logs-controller) | Yes | - |
| `context` | Build context directory | Yes | - |
| `dockerfile` | Path to Dockerfile relative to context | No | `Dockerfile` |
| `platforms` | Target platforms for multi-arch build | No | `linux/amd64,linux/arm64` |
| `ecr_registry` | ECR registry URL | No | `public.ecr.aws/nullplatform` |
| `tag` | Additional tag for the image (latest and sha are always added) | No | - |
| `aws_region` | AWS region for ECR | No | `us-east-1` |

**Secrets required**

- `aws_role_arn`: AWS IAM Role ARN for OIDC authentication to push to ECR

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/docker-build-push-ecr.yml@main
with:
  image_name: my-app
  context: .
  dockerfile: Dockerfile
  platforms: linux/amd64,linux/arm64
  tag: v1.0.0
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
```

---

## 📦 Release & Changelog

### Changelog and Release

Generates changelogs from conventional commits, bumps versions, and creates GitHub releases. Supports monorepos with multiple packages (Helm charts, npm packages, or generic versioned projects). Automatically determines semantic version bump based on commit types and creates appropriate git tags.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `project-type` | Type of project: helm-charts, npm, generic | No | `generic` |
| `source-dir` | Directory containing packages/charts (use . for root) | No | `.` |
| `version-file` | Version file name (Chart.yaml, package.json, VERSION). Auto-detected if not specified. | No | - |
| `tag-prefix` | Prefix for git tags (e.g., "v" for v1.0.0). Use empty for no prefix. | No | - |
| `create-github-release` | Create a GitHub Release | No | `true` |
| `commit-message` | Commit message for version bump | No | `chore(release): bump version and update changelog [skip ci]` |

**Outputs**

| Name | Description |
|------|-------------|
| `has_changes` | Whether there were changes to release |
| `new_version` | The new version number |
| `changelog` | The generated changelog content |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/changelog-release.yml@main
with:
  project-type: helm-charts
  source-dir: charts
  tag-prefix: v
  create-github-release: true
```

---

### tofu-release

Creates releases for Terraform modules using Google's Release Please action. Automatically generates changelogs, bumps versions, and optionally updates version references in all README files across the repository.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `update_readme_versions` | Update version references in README files after release | No | `true` |

**Outputs**

| Name | Description |
|------|-------------|
| `release_created` | Whether a release was created |
| `tag_name` | The created release tag name |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/release.yml@main
with:
  update_readme_versions: true
```

---

### tofu-pre-release

Posts a changelog preview comment on pull requests using semantic-release. Shows what the next release will contain before merging.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pre-release.yml@main
```

---

## 📚 Documentation

### tofu-docs

Automatically generates and updates Terraform module documentation using terraform-docs. Injects documentation into README.md files between special markers, keeping module documentation synchronized with code changes.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tf-docs.yml@main
```

---

### readme-ai-generator-v2

Generates or updates README.md files using AI (Groq, GitHub Models, OpenAI, or Anthropic). Automatically detects project type (Terraform, TypeScript, Python) and generates contextual documentation. Can target changed files in PRs or regenerate all project READMEs.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `base_dir` | Base directory to search for projects | No | `.` |
| `generator_type` | Force generator type (terraform, typescript, python, generic) or leave empty for auto-detect | No | - |
| `generate_all` | Generate README for all projects (ignores changed files detection) | No | `false` |
| `file_patterns` | File patterns to detect changes (space-separated, e.g., "*.tf *.py") | No | `*.tf *.ts *.tsx *.js *.jsx *.py` |
| `ai_provider` | AI provider (groq, github, openai, anthropic) | No | `groq` |
| `ai_model` | AI model to use for generation (provider-specific, leave empty for default) | No | - |
| `run_post_generation` | Commands to run after generation (e.g., terraform-docs) | No | - |

**Secrets required**

At least one of these API keys based on your chosen provider:
- `GROQ_API_KEY`: For Groq provider
- `GITHUB_TOKEN`: For GitHub Models (also used for git operations)
- `OPENAI_API_KEY`: For OpenAI provider
- `ANTHROPIC_API_KEY`: For Anthropic provider

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/readme-ai-v2.yml@main
with:
  base_dir: .
  generator_type: terraform
  generate_all: false
  ai_provider: groq
  ai_model: llama-3.3-70b-versatile
  run_post_generation: terraform-docs .
secrets:
  GROQ_API_KEY: ${{ secrets.GROQ_API_KEY }}
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
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
