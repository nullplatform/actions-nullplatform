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

This repository provides reusable GitHub Actions workflows for CI/CD, security scanning, documentation generation, and release management.

## Summary

| Workflow | Category | Description |
|----------|----------|-------------|
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Validates PR branch names follow conventional commit type prefixes |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Validates commit messages follow conventional commit format |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Lints and validates OpenTofu/Terraform code with formatting checks |
| [tofu-test](#tofu-test) | 🔍 CI & Validation | Runs OpenTofu test suites across multiple modules in parallel |
| [docker-security-scan](#docker-security-scan) | 🔒 Security | Scans Docker images for vulnerabilities using Trivy before deployment |
| [ecr-security-scan](#ecr-security-scan) | 🔒 Security | Scans ECR images for vulnerabilities and sends Slack alerts |
| [tfsec-security-scan](#tfsec-security-scan) | 🔒 Security | Scans Terraform/OpenTofu for security misconfigurations with SARIF output |
| [docker-build-push-ecr](#docker-build-push-ecr) | 🚀 Build & Deploy | Builds multi-arch Docker images and pushes to Amazon ECR Public |
| [changelog-release](#changelog-release) | 📦 Release & Changelog | Generates changelogs, bumps versions, and creates releases from conventional commits |
| [tofu-release](#tofu-release) | 📦 Release & Changelog | Automates Terraform module releases with Release Please |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | Generates project documentation using AI for Terraform, TypeScript, Python projects |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Auto-generates Terraform module documentation with terraform-docs |

---

## 🔍 CI & Validation

### branch-validation

Enforces branch naming conventions for pull requests using regex patterns. Ensures branches follow type/description format (e.g., `feat/add-login`, `fix/bug-123`). Useful for maintaining clean Git history and enabling automated workflows based on branch types.

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
  pattern: '^(feat|fix|docs|chore)/.+$'
```

### conventional-commit

Validates that all commit messages in a pull request follow the Conventional Commits specification. Checks commit message format including type, optional scope, and description. Use this to maintain consistent commit history for automated changelog generation.

**Inputs**

None

**Secrets required**

None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

### tofu-lint

Performs formatting checks and validation on OpenTofu/Terraform configurations. Runs `tofu fmt -check` and `tofu validate` to ensure code consistency and correctness before deployment.

**Inputs**

None

**Secrets required**

None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-lint.yml@main
```

### tofu-test

Executes OpenTofu test suites across multiple modules in parallel. Supports testing multiple module paths with configurable OpenTofu versions. Use this for comprehensive infrastructure code testing before merging.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| modules | JSON array of module paths to test (e.g. ["module/a", "module/b"]) | Yes | - |
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

---

## 🔒 Security

### docker-security-scan

Scans Docker images for vulnerabilities using Trivy before pushing to registries. Builds the image locally and scans for security issues with configurable severity thresholds. Use this in CI pipelines to catch vulnerabilities before deployment.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| context | Build context directory | Yes | - |
| dockerfile | Path to Dockerfile relative to context | No | `Dockerfile` |
| image_name | Name for the scanned image (used for reporting) | Yes | - |
| severity | Minimum severity to report (CRITICAL,HIGH,MEDIUM,LOW) | No | `CRITICAL,HIGH` |
| exit_code | Exit code when vulnerabilities are found (0 to not fail) | No | `1` |

**Secrets required**

None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/docker-security-scan.yml@main
with:
  context: .
  dockerfile: Dockerfile
  image_name: my-application
  severity: 'CRITICAL,HIGH'
```

### ecr-security-scan

Scans images in Amazon ECR Public for vulnerabilities and sends alerts to Slack. Automatically finds the latest semver tags for specified images and scans them with Trivy. Use this for scheduled security audits of deployed container images.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| image_names | JSON array of image names to scan (e.g., ["k8s-logs-controller", "k8s-traffic-manager"]) | Yes | - |
| ecr_registry | ECR registry URL | No | `public.ecr.aws/nullplatform` |
| severity | Minimum severity to report (CRITICAL,HIGH,MEDIUM,LOW) | No | `CRITICAL,HIGH` |

**Secrets required**

- `aws_role_arn` - AWS IAM Role ARN for OIDC authentication to access ECR
- `slack_webhook_url` - Slack webhook URL for sending vulnerability alerts

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/ecr-security-scan.yml@main
with:
  image_names: '["my-app", "my-worker"]'
  ecr_registry: public.ecr.aws/myorg
  severity: 'CRITICAL,HIGH'
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
  slack_webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### tfsec-security-scan

Scans Terraform/OpenTofu code for security misconfigurations using tfsec. Generates SARIF reports for GitHub Security tab and posts PR comments on failures. Use this to enforce security best practices in infrastructure code.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| minimum_severity | Minimum severity level to report (CRITICAL, HIGH, MEDIUM, LOW) | No | `HIGH` |
| upload_sarif | Upload SARIF results to GitHub Security tab | No | `true` |
| post_comment | Post comment on PR if scan fails | No | `true` |

**Secrets required**

None

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

### docker-build-push-ecr

Builds multi-architecture Docker images and pushes them to Amazon ECR Public. Supports OIDC authentication, multi-platform builds (amd64/arm64), and build arguments. Use this for automated container image publishing with proper tagging strategies.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| image_name | Name of the Docker image (e.g., k8s-logs-controller) | Yes | - |
| context | Build context directory | Yes | - |
| dockerfile | Path to Dockerfile relative to context | No | `Dockerfile` |
| platforms | Target platforms for multi-arch build | No | `linux/amd64,linux/arm64` |
| ecr_registry | ECR registry URL | No | `public.ecr.aws/nullplatform` |
| tag | Additional tag for the image (latest and sha are always added) | No | - |
| aws_region | AWS region for ECR | No | `us-east-1` |
| build_args | Docker build arguments (newline-separated, e.g. "ARG1=val1\nARG2=val2") | No | - |

**Secrets required**

- `aws_role_arn` - AWS IAM Role ARN for OIDC authentication to push to ECR

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
    API_URL=https://api.example.com
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
```

---

## 📦 Release & Changelog

### changelog-release

Automates version bumping, changelog generation, and release creation based on conventional commits. Supports Helm charts, npm packages, and generic projects with automatic version detection. Creates Git tags and GitHub releases with detailed changelogs organized by commit type.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| project-type | Type of project: helm-charts, npm, generic | No | `generic` |
| source-dir | Directory containing packages/charts (use . for root) | No | `.` |
| version-file | Version file name (Chart.yaml, package.json, VERSION). Auto-detected if not specified. | No | - |
| tag-prefix | Prefix for git tags (e.g., "v" for v1.0.0). Use empty for no prefix. | No | - |
| create-github-release | Create a GitHub Release | No | `true` |
| commit-message | Commit message for version bump | No | `chore(release): bump version and update changelog [skip ci]` |

**Outputs**

| Name | Description |
|------|-------------|
| has_changes | Whether there were changes to release |
| new_version | The new version number |
| changelog | The generated changelog content |

**Secrets required**

None (uses `GITHUB_TOKEN` automatically)

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

Automates Terraform module releases using Google's Release Please. Creates version bumps based on conventional commits and optionally updates version references in README files. Use this for standardized Terraform module versioning.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| update_readme_versions | Update version references in README files after release | No | `true` |

**Outputs**

| Name | Description |
|------|-------------|
| release_created | Whether a release was created |
| tag_name | The created tag name |

**Secrets required**

None (uses `GITHUB_TOKEN` automatically)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/release.yml@main
with:
  update_readme_versions: true
```

---

## 📚 Documentation

### readme-ai-generator-v2

Generates comprehensive README files using AI for Terraform, TypeScript, and Python projects. Automatically detects project type, analyzes code structure, and creates documentation. Supports multiple AI providers (Groq, GitHub Models, OpenAI, Anthropic) and can process changed files only or regenerate all documentation.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| base_dir | Base directory to search for projects | No | `.` |
| generator_type | Force generator type (terraform, typescript, python, generic) or leave empty for auto-detect | No | - |
| generate_all | Generate README for all projects (ignores changed files detection) | No | `false` |
| file_patterns | File patterns to detect changes (space-separated, e.g., "*.tf *.py") | No | `*.tf *.ts *.tsx *.js *.jsx *.py` |
| ai_provider | AI provider (groq, github, openai, anthropic) | No | `groq` |
| ai_model | AI model to use for generation (provider-specific, leave empty for default) | No | - |
| run_post_generation | Commands to run after generation (e.g., terraform-docs) | No | - |

**Secrets required**

- One of: `GROQ_API_KEY`, `GITHUB_TOKEN` (for GitHub Models), `OPENAI_API_KEY`, or `ANTHROPIC_API_KEY` depending on the selected provider

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/readme-ai-v2.yml@main
with:
  generator_type: terraform
  generate_all: false
  ai_provider: groq
  file_patterns: '*.tf *.md'
secrets:
  GROQ_API_KEY: ${{ secrets.GROQ_API_KEY }}
```

### tofu-docs

Automatically generates and updates Terraform/OpenTofu module documentation using terraform-docs. Injects documentation between marker comments in README files and commits changes. Use this to keep module documentation synchronized with code changes.

**Inputs**

None

**Secrets required**

None (uses `GITHUB_TOKEN` automatically)

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
