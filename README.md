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
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Validates branch names against conventional commit type patterns |
| [Changelog and Release](#changelog-and-release) | 📦 Release & Changelog | Generates changelogs from conventional commits and creates versioned releases |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Validates commit messages follow conventional commit format |
| [Docker Build and Push to ECR](#docker-build-and-push-to-ecr) | 🚀 Build & Deploy | Builds multi-arch Docker images and pushes to Amazon ECR Public |
| [Docker Security Scan](#docker-security-scan) | 🔒 Security | Scans Docker images for vulnerabilities using Trivy before deployment |
| [ECR Security Scan](#ecr-security-scan) | 🔒 Security | Scans published ECR images for vulnerabilities and alerts via Slack |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | Generates or updates README files using AI for changed or all projects |
| [tofu-release](#tofu-release) | 📦 Release & Changelog | Automates releases for Terraform modules using Release Please |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Auto-generates Terraform documentation in README files |
| [tfsec-security-scan](#tfsec-security-scan) | 🔒 Security | Scans Terraform/OpenTofu code for security misconfigurations |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Validates and formats OpenTofu/Terraform code |
| [tofu-test](#tofu-test) | 🔍 CI & Validation | Runs OpenTofu tests for specified modules in parallel |

---

## 🔍 CI & Validation

### branch-validation

Validates that pull request branch names follow conventional commit type prefixes (feat/, fix/, docs/, etc.). Use this in PR workflows to enforce consistent branch naming conventions across your team.

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

Validates that all commit messages in a pull request follow the conventional commit format. Essential for teams using semantic versioning and automated changelog generation.

**Inputs**
- None

**Secrets required**
- None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

### tofu-lint

Validates OpenTofu/Terraform code formatting and syntax. Runs `tofu fmt -check` and `tofu validate` to ensure code quality before merging.

**Inputs**
- None

**Secrets required**
- None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-lint.yml@main
```

### tofu-test

Executes OpenTofu test suites for multiple modules in parallel. Use this to validate infrastructure code changes with automated tests before deployment.

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

Scans locally built Docker images for vulnerabilities using Trivy before pushing to registries. Use this in CI to catch security issues early in the development cycle.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| context | Build context directory | Yes | - |
| dockerfile | Path to Dockerfile relative to context | No | `Dockerfile` |
| image_name | Name for the scanned image | Yes | - |
| severity | Minimum severity to report | No | `CRITICAL,HIGH` |
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

Scans images already published to Amazon ECR Public for vulnerabilities on a schedule. Sends Slack alerts when critical or high severity issues are found in production images.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| image_names | JSON array of image names to scan | Yes | - |
| ecr_registry | ECR registry URL | No | `public.ecr.aws/nullplatform` |
| severity | Minimum severity to report | No | `CRITICAL,HIGH` |

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

### tfsec-security-scan

Scans Terraform/OpenTofu code for security misconfigurations and compliance violations. Generates SARIF reports for GitHub Security tab and can post PR comments on failures.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| minimum_severity | Minimum severity level to report | No | `HIGH` |
| upload_sarif | Upload SARIF results to GitHub Security tab | No | `true` |
| post_comment | Post comment on PR if scan fails | No | `true` |

**Secrets required**
- None (uses `GITHUB_TOKEN` automatically)

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

Builds multi-architecture Docker images (amd64/arm64) and pushes them to Amazon ECR Public. Handles AWS authentication via OIDC and includes build caching for faster subsequent builds.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| image_name | Name of the Docker image | Yes | - |
| context | Build context directory | Yes | - |
| dockerfile | Path to Dockerfile relative to context | No | `Dockerfile` |
| platforms | Target platforms for multi-arch build | No | `linux/amd64,linux/arm64` |
| ecr_registry | ECR registry URL | No | `public.ecr.aws/nullplatform` |
| tag | Tag for the image | No | `''` |
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
  platforms: 'linux/amd64,linux/arm64'
  tag: 'v1.2.3'
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
```

---

## 📦 Release & Changelog

### Changelog and Release

Generates changelogs from conventional commits, bumps versions automatically, and creates GitHub releases. Supports multiple project types (helm-charts, npm, generic) and can handle monorepos with multiple packages.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| project-type | Type of project | No | `generic` |
| source-dir | Directory containing packages/charts | No | `.` |
| version-file | Version file name | No | `''` (auto-detected) |
| tag-prefix | Prefix for git tags | No | `''` |
| create-github-release | Create a GitHub Release | No | `true` |
| commit-message | Commit message for version bump | No | `chore(release): bump version and update changelog [skip ci]` |

**Outputs**
- `has_changes`: Whether there were changes to release
- `new_version`: The new version number
- `changelog`: The generated changelog content

**Secrets required**
- None (uses `GITHUB_TOKEN` automatically)

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

Automates semantic releases for Terraform/OpenTofu modules using Google's Release Please. Optionally updates version references in all README files after creating a release.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| update_readme_versions | Update version references in README files after release | No | `true` |

**Secrets required**
- None (uses `GITHUB_TOKEN` automatically)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/release.yml@main
with:
  update_readme_versions: true
```

---

## 📚 Documentation

### readme-ai-generator-v2

Generates or updates README files using AI models (Groq, GitHub Models, OpenAI, Anthropic). Detects project type automatically (Terraform, TypeScript, Python) and generates appropriate documentation. Can process only changed files or regenerate all project READMEs.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| base_dir | Base directory to search for projects | No | `.` |
| generator_type | Force generator type or leave empty for auto-detect | No | `''` |
| generate_all | Generate README for all projects | No | `false` |
| file_patterns | File patterns to detect changes | No | `*.tf *.ts *.tsx *.js *.jsx *.py` |
| ai_provider | AI provider | No | `groq` |
| ai_model | AI model to use | No | `''` (provider default) |
| run_post_generation | Commands to run after generation | No | `''` |

**Secrets required**
- `GROQ_API_KEY`: Required if using Groq provider
- `OPENAI_API_KEY`: Required if using OpenAI provider
- `ANTHROPIC_API_KEY`: Required if using Anthropic provider
- `GITHUB_TOKEN`: Automatically provided (required for GitHub Models)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/readme-ai-v2.yml@main
with:
  generate_all: false
  generator_type: 'terraform'
  ai_provider: 'groq'
  file_patterns: '*.tf *.md'
  run_post_generation: 'terraform-docs -c .terraform-docs.yml .'
secrets:
  GROQ_API_KEY: ${{ secrets.GROQ_API_KEY }}
```

### tofu-docs

Auto-generates Terraform/OpenTofu documentation by extracting inputs, outputs, and resources from code. Injects generated content into README files between special markers and commits changes automatically.

**Inputs**
- None

**Secrets required**
- None (uses `GITHUB_TOKEN` automatically)

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
