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
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Validates branch names follow conventional naming patterns |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Enforces conventional commit message format using commitlint |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Lints OpenTofu code with formatting, initialization, and validation checks |
| [tofu-test](#tofu-test) | 🔍 CI & Validation | Runs OpenTofu test suites across multiple modules in parallel |
| [tfsec-security-scan](#tfsec-security-scan) | 🔒 Security | Scans Terraform/OpenTofu code for security vulnerabilities and misconfigurations |
| [docker-security-scan](#docker-security-scan) | 🔒 Security | Performs Trivy security scanning on Docker images during build |
| [ecr-security-scan](#ecr-security-scan) | 🔒 Security | Scans ECR images for vulnerabilities and sends Slack alerts |
| [docker-build-push-ecr](#docker-build-push-ecr) | 🚀 Build & Deploy | Builds multi-arch Docker images and pushes to Amazon ECR Public |
| [changelog-release](#changelog-release) | 📦 Release & Changelog | Generates conventional changelogs, bumps versions, and creates GitHub releases |
| [tofu-release](#tofu-release) | 📦 Release & Changelog | Automated releases for Terraform modules using Release Please |
| [tofu-pre-release](#tofu-pre-release) | 📦 Release & Changelog | Posts changelog preview comments on pull requests using semantic-release |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Generates Terraform module documentation using terraform-docs |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | AI-powered README generation for projects with support for multiple providers |

---

## 🔍 CI & Validation

### branch-validation

Validates that branch names follow conventional patterns, typically used in pull request workflows to enforce consistent naming conventions like `feat/description` or `fix/issue-123`.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| pattern | Regex pattern for branch name validation | No | `^(feat|feature|fix|docs|style|refactor|perf|test|build|ci|chore|revert)/.+$` |

**Secrets required**

None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/branch-validation.yml@main
with:
  pattern: '^(feat|feature|fix|hotfix|docs)/.+$'
```

### conventional-commit

Enforces conventional commit message format using commitlint to ensure consistent commit history and enable automated changelog generation.

**Inputs**

None

**Secrets required**

None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

### tofu-lint

Performs comprehensive linting of OpenTofu code including format checking, initialization, and validation to ensure code quality and consistency.

**Inputs**

None

**Secrets required**

None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-lint.yml@main
```

### tofu-test

Executes OpenTofu test suites across multiple modules in parallel, enabling comprehensive testing of infrastructure code with configurable module selection.

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
  modules: '["modules/vpc", "modules/security-group"]'
  tofu_version: '1.10.6'
```

---

## 🔒 Security

### tfsec-security-scan

Scans Terraform and OpenTofu code for security vulnerabilities, misconfigurations, and compliance issues with configurable severity levels and SARIF reporting.

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
  minimum_severity: 'CRITICAL'
  upload_sarif: true
  post_comment: true
```

### docker-security-scan

Performs comprehensive Trivy security scanning on Docker images during the build process to identify vulnerabilities before deployment.

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
  image_name: my-app
  dockerfile: Dockerfile
  severity: 'CRITICAL,HIGH'
```

### ecr-security-scan

Continuously scans ECR images for vulnerabilities using Trivy and sends automated Slack alerts when critical or high-severity issues are found.

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
  ecr_registry: 'public.ecr.aws/nullplatform'
  severity: 'CRITICAL,HIGH'
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
  slack_webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

## 🚀 Build & Deploy

### docker-build-push-ecr

Builds multi-architecture Docker images with QEMU/Buildx and pushes them to Amazon ECR Public with automated tagging and caching.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| image_name | Name of the Docker image | Yes | - |
| context | Build context directory | Yes | - |
| dockerfile | Path to Dockerfile relative to context | No | `Dockerfile` |
| platforms | Target platforms for multi-arch build | No | `linux/amd64,linux/arm64` |
| ecr_registry | ECR registry URL | No | `public.ecr.aws/nullplatform` |
| tag | Additional tag for the image | No | - |
| aws_region | AWS region for ECR | No | `us-east-1` |

**Secrets required**

- `aws_role_arn`: AWS IAM Role ARN for OIDC authentication

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/docker-build-push-ecr.yml@main
with:
  image_name: my-app
  context: .
  dockerfile: Dockerfile
  tag: v1.0.0
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
```

---

## 📦 Release & Changelog

### changelog-release

Generates conventional changelogs, performs semantic versioning, and creates GitHub releases with support for Helm charts, npm packages, and generic projects.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| project-type | Type of project: helm-charts, npm, generic | No | `generic` |
| source-dir | Directory containing packages/charts (use . for root) | No | `.` |
| version-file | Version file name (Chart.yaml, package.json, VERSION) | No | - |
| tag-prefix | Prefix for git tags | No | - |
| create-github-release | Create a GitHub Release | No | `true` |
| commit-message | Commit message for version bump | No | `chore(release): bump version and update changelog [skip ci]` |

**Secrets required**

None (uses `GITHUB_TOKEN` automatically)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/changelog-release.yml@main
with:
  project-type: 'helm-charts'
  source-dir: 'charts'
  tag-prefix: 'v'
  create-github-release: true
```

### tofu-release

Automated release management for Terraform modules using Google's Release Please action with automatic version updates in README files.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| update_readme_versions | Update version references in README files after release | No | `true` |

**Secrets required**

None (uses `GITHUB_TOKEN` automatically)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/release.yml@main
with:
  update_readme_versions: true
```

### tofu-pre-release

Posts automated changelog preview comments on pull requests using semantic-release to show what changes will be included in the next release.

**Inputs**

None

**Secrets required**

None (uses `GITHUB_TOKEN` automatically)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pre-release.yml@main
```

---

## 📚 Documentation

### tofu-docs

Automatically generates and updates Terraform module documentation using terraform-docs with configurable output injection into README files.

**Inputs**

None

**Secrets required**

None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tf-docs.yml@main
```

### readme-ai-generator-v2

AI-powered README generation that automatically detects project types and creates comprehensive documentation using multiple AI providers (Groq, GitHub, OpenAI, Anthropic).

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| base_dir | Base directory to search for projects | No | `.` |
| generator_type | Force generator type (terraform, typescript, python, generic) | No | - |
| generate_all | Generate README for all projects | No | `false` |
| file_patterns | File patterns to detect changes | No | `*.tf *.ts *.tsx *.js *.jsx *.py` |
| ai_provider | AI provider (groq, github, openai, anthropic) | No | `groq` |
| ai_model | AI model to use for generation | No | - |
| run_post_generation | Commands to run after generation | No | - |

**Secrets required**

- `GROQ_API_KEY`: Groq API key (if using groq provider)
- `OPENAI_API_KEY`: OpenAI API key (if using openai provider)
- `ANTHROPIC_API_KEY`: Anthropic API key (if using anthropic provider)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/readme-ai-v2.yml@main
with:
  base_dir: './modules'
  generator_type: 'terraform'
  ai_provider: 'groq'
  generate_all: false
secrets:
  GROQ_API_KEY: ${{ secrets.GROQ_API_KEY }}
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
