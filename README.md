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

## Summary

| Workflow | Category | Description |
|----------|----------|-------------|
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Validates PR branch names follow conventional commit prefixes |
| [Changelog and Release](#changelog-and-release) | 📦 Release & Changelog | Generates changelogs from conventional commits and manages semantic versioning |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Validates commit messages follow conventional commit format |
| [Docker Build and Push to ECR](#docker-build-and-push-to-ecr) | 🚀 Build & Deploy | Builds multi-architecture Docker images and pushes to Amazon ECR Public |
| [Docker Security Scan](#docker-security-scan) | 🔒 Security | Scans Docker images for vulnerabilities using Trivy before deployment |
| [ECR Security Scan](#ecr-security-scan) | 🔒 Security | Scans existing ECR images for vulnerabilities and alerts via Slack |
| [PR Checks - Docker Build](#pr-checks---docker-build) | 🔍 CI & Validation | Validates Docker builds on pull requests |
| [PR Checks - Go](#pr-checks---go) | 🔍 CI & Validation | Runs linting and tests for Go projects |
| [PR Checks - Node (npm)](#pr-checks---node-npm) | 🔍 CI & Validation | Runs linting and tests for Node.js projects using npm |
| [PR Checks - Node (pnpm)](#pr-checks---node-pnpm) | 🔍 CI & Validation | Runs linting and tests for Node.js projects using pnpm |
| [tofu-pre-release](#tofu-pre-release) | 📦 Release & Changelog | Posts semantic release changelog preview as PR comment |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | Generates or updates README files using AI for changed projects |
| [tofu-release](#tofu-release) | 📦 Release & Changelog | Creates releases for Terraform modules and optionally updates README versions |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Generates and injects Terraform documentation into README files |
| [tfsec-security-scan](#tfsec-security-scan) | 🔒 Security | Scans Terraform/OpenTofu code for security issues and uploads results to GitHub Security |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Validates OpenTofu code formatting and syntax |
| [tofu-test](#tofu-test) | 🔍 CI & Validation | Runs OpenTofu tests across multiple modules in parallel |

---

## 🔍 CI & Validation

### branch-validation

Validates that pull request branch names follow a structured naming convention using conventional commit type prefixes. Ensures branches follow the pattern `type/description` (e.g., `feat/add-login`, `fix/bug-123`) before allowing merge.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| pattern | Regex pattern for branch name validation | No | `^(feat\|feature\|fix\|docs\|style\|refactor\|perf\|test\|build\|ci\|chore\|revert)/.+$` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/branch-validation.yml@main
with:
  pattern: '^(feat|fix|docs)/.+$'  # Optional: customize allowed types
```

---

### conventional-commit

Validates that all commit messages in a pull request follow the Conventional Commits specification. Enforces commit format like `feat: add feature`, `fix(scope): bug fix`, preventing merges with improperly formatted commits.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

---

### PR Checks - Docker Build

Validates that Docker images can be built successfully in pull requests. Useful for catching build errors early without pushing to registries.

**Secrets required**
- `GITHUB_TOKEN` (automatically provided)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-docker.yml@main
```

---

### PR Checks - Go

Runs linting (`go vet`) and tests for Go projects on pull requests. Validates code quality before merge.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-go.yml@main
```

---

### PR Checks - Node (npm)

Runs linting and tests for Node.js projects using npm. Automatically detects and runs linting commands (`test:static` or `lint`) and executes test suite.

**Secrets required**
- `GITHUB_TOKEN` (for private package access)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-npm.yml@main
```

---

### PR Checks - Node (pnpm)

Runs linting and tests for Node.js projects using pnpm package manager. Automatically detects and runs linting commands (`test:static` or `lint`) and executes test suite.

**Secrets required**
- `GITHUB_TOKEN` (for private package access)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-pnpm.yml@main
```

---

### tofu-lint

Validates OpenTofu/Terraform code formatting and syntax. Checks that code is properly formatted (`tofu fmt`) and syntactically valid (`tofu validate`).

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-lint.yml@main
```

---

### tofu-test

Runs OpenTofu tests across multiple modules in parallel. Executes `tofu test` for each specified module to validate infrastructure code.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| modules | JSON array of module paths to test | Yes | - |
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

### Docker Security Scan

Scans Docker images for vulnerabilities using Trivy before deployment. Builds the image locally and performs comprehensive security scanning to catch issues early in the development cycle.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| context | Build context directory | Yes | - |
| dockerfile | Path to Dockerfile relative to context | No | Dockerfile |
| image_name | Name for the scanned image (used for reporting) | Yes | - |
| severity | Minimum severity to report | No | CRITICAL,HIGH |
| build_args | Docker build arguments (multiline) | No | '' |
| exit_code | Exit code when vulnerabilities are found | No | 1 |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/docker-security-scan.yml@main
with:
  context: .
  dockerfile: Dockerfile
  image_name: my-app
  severity: 'CRITICAL,HIGH,MEDIUM'
  exit_code: 1
```

---

### ECR Security Scan

Continuously scans existing images in Amazon ECR Public for vulnerabilities. Finds the latest semantic version tag for each image, scans it with Trivy, and sends Slack alerts if critical or high vulnerabilities are detected.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| image_names | JSON array of image names to scan | Yes | - |
| ecr_registry | ECR registry URL | No | public.ecr.aws/nullplatform |
| severity | Minimum severity to report | No | CRITICAL,HIGH |

**Secrets required**
- `aws_role_arn` - AWS IAM Role ARN for OIDC authentication
- `slack_webhook_url` - Slack webhook URL for vulnerability alerts

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

### tfsec-security-scan

Scans Terraform/OpenTofu code for security misconfigurations and vulnerabilities using tfsec. Uploads results to GitHub Security tab (SARIF format) and optionally posts PR comments when issues are found.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| minimum_severity | Minimum severity level to report | No | HIGH |
| upload_sarif | Upload SARIF results to GitHub Security tab | No | true |
| post_comment | Post comment on PR if scan fails | No | true |

**Secrets required**
- `GITHUB_TOKEN` (automatically provided)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tfsec.yml@main
with:
  minimum_severity: 'CRITICAL'
  upload_sarif: true
  post_comment: true
```

---

## 🚀 Build & Deploy

### Docker Build and Push to ECR

Builds multi-architecture Docker images and pushes them to Amazon ECR Public. Supports custom build arguments, multiple platforms (amd64/arm64), and automatic tagging with semantic versions.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| image_name | Name of the Docker image | Yes | - |
| context | Build context directory | Yes | - |
| dockerfile | Path to Dockerfile relative to context | No | Dockerfile |
| platforms | Target platforms for multi-arch build | No | linux/amd64,linux/arm64 |
| ecr_registry | ECR registry URL | No | public.ecr.aws/nullplatform |
| tag | Additional tag for the image | No | '' |
| aws_region | AWS region for ECR | No | us-east-1 |
| build_args | Docker build arguments (newline-separated) | No | '' |

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
  tag: 'v1.0.0'
  build_args: |
    NODE_ENV=production
    APP_VERSION=1.0.0
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
```

---

## 📦 Release & Changelog

### Changelog and Release

Generates conventional commit changelogs, bumps semantic versions, and creates GitHub releases. Supports Helm charts, npm packages, and generic projects. Automatically determines version bump type (major/minor/patch) from commit messages and creates git tags.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| project-type | Type of project: helm-charts, npm, generic | No | generic |
| source-dir | Directory containing packages/charts | No | . |
| version-file | Version file name (auto-detected if not specified) | No | '' |
| tag-prefix | Prefix for git tags | No | '' |
| create-github-release | Create a GitHub Release | No | true |
| commit-message | Commit message for version bump | No | 'chore(release): bump version and update changelog [skip ci]' |

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
  project-type: 'helm-charts'
  source-dir: 'charts'
  tag-prefix: 'v'
  create-github-release: true
```

---

### tofu-pre-release

Posts a semantic release changelog preview as a comment on pull requests. Shows what changes will be released when the PR is merged, helping reviewers understand the release impact.

**Secrets required**
- `GITHUB_TOKEN` (automatically provided)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pre-release.yml@main
```

---

### tofu-release

Creates releases for Terraform/OpenTofu modules using release-please. Automatically generates changelogs, creates tags, and optionally updates version references in all README files across the repository.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| update_readme_versions | Update version references in README files after release | No | true |

**Outputs**
- `release_created` - Whether a release was created
- `tag_name` - The created tag name

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

Generates or updates README files using AI for projects with code changes. Automatically detects project type (Terraform, TypeScript, Python) and generates comprehensive documentation. Can process only changed files or regenerate all READMEs.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| base_dir | Base directory to search for projects | No | . |
| generator_type | Force generator type or leave empty for auto-detect | No | '' |
| generate_all | Generate README for all projects | No | false |
| file_patterns | File patterns to detect changes | No | *.tf *.ts *.tsx *.js *.jsx *.py |
| ai_provider | AI provider (groq, github, openai, anthropic) | No | groq |
| ai_model | AI model to use for generation | No | '' |
| run_post_generation | Commands to run after generation | No | '' |

**Secrets required**
- `GROQ_API_KEY` or `GITHUB_TOKEN` or `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` (depending on ai_provider)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/readme-ai-v2.yml@main
with:
  base_dir: 'modules'
  generator_type: 'terraform'
  generate_all: false
  ai_provider: 'groq'
  file_patterns: '*.tf *.tfvars'
secrets:
  GROQ_API_KEY: ${{ secrets.GROQ_API_KEY }}
```

---

### tofu-docs

Generates and injects Terraform/OpenTofu documentation into README files using terraform-docs. Automatically finds all modules and updates documentation sections marked with `<!-- BEGIN_TF_DOCS -->` and `<!-- END_TF_DOCS -->` comments.

**Secrets required**
- `GITHUB_TOKEN` (automatically provided)

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
