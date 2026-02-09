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

# Summary Table
| Workflow | Category | Description |
| --- | --- | --- |
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Validates branch names against a regex pattern |
| [changelog-release](#changelog-and-release) | 📦 Release & Changelog | Generates changelog and creates a GitHub Release |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Validates commits against conventional commit rules |
| [docker-build-push-ecr](#docker-build-and-push-to-ecr) | 🚀 Build & Deploy | Builds and pushes a Docker image to ECR |
| [docker-security-scan](#docker-security-scan) | 🔒 Security | Scans a Docker image for vulnerabilities |
| [ecr-security-scan](#ecr-security-scan) | 🔒 Security | Scans ECR images for vulnerabilities and sends Slack alerts |
| [pre-release](#tofu-pre-release) | 📦 Release & Changelog | Creates a pre-release and posts a changelog preview comment |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | Generates README files using AI |
| [release](#tofu-release) | 📦 Release & Changelog | Creates a GitHub Release and updates README versions |
| [tf-docs](#tofu-docs) | 📚 Documentation | Generates Terraform documentation |
| [tfsec](#tfsec-security-scan) | 🔒 Security | Scans Terraform code for security issues |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Lints OpenTofu code |
| [tofu-test](#tofu-test) | 🔍 CI & Validation | Tests OpenTofu modules |
| [update-readme-actions](#update-readme-actions) | 📚 Documentation | Updates the README with available actions |

## 🔍 CI & Validation
### branch-validation
Validates branch names against a regex pattern. Use this workflow to enforce consistent branch naming conventions.

* **Inputs**:
	+ `pattern`: Regex pattern for branch name validation (default: `^(feat|feature|fix|docs|style|refactor|perf|test|build|ci|chore|revert)/.+$`)
* **Usage**:
```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/branch-validation.yml@main
with:
  pattern: '^(feat|feature|fix|docs|style|refactor|perf|test|build|ci|chore|revert)/.+$'
```

### conventional-commit
Validates commits against conventional commit rules. Use this workflow to enforce consistent commit messages.

* **Usage**:
```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

### tofu-lint
Lints OpenTofu code. Use this workflow to enforce coding standards and best practices.

* **Usage**:
```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-lint.yml@main
```

### tofu-test
Tests OpenTofu modules. Use this workflow to ensure your modules are working as expected.

* **Inputs**:
	+ `modules`: JSON array of module paths to test (required)
	+ `tofu_version`: OpenTofu version to use (default: `1.10.6`)
* **Usage**:
```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-test.yml@main
with:
  modules: '["module/a", "module/b"]'
  tofu_version: '1.10.6'
```

## 🔒 Security
### docker-security-scan
Scans a Docker image for vulnerabilities. Use this workflow to identify potential security issues in your Docker images.

* **Inputs**:
	+ `context`: Build context directory (required)
	+ `dockerfile`: Path to Dockerfile relative to context (default: `Dockerfile`)
	+ `image_name`: Name for the scanned image (required)
	+ `severity`: Minimum severity to report (default: `CRITICAL,HIGH`)
	+ `exit_code`: Exit code when vulnerabilities are found (default: `1`)
* **Usage**:
```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/docker-security-scan.yml@main
with:
  context: .
  dockerfile: Dockerfile
  image_name: my-image
  severity: CRITICAL,HIGH
  exit_code: 1
```

### ecr-security-scan
Scans ECR images for vulnerabilities and sends Slack alerts. Use this workflow to monitor your ECR images for security issues.

* **Inputs**:
	+ `image_names`: JSON array of image names to scan (required)
	+ `ecr_registry`: ECR registry URL (default: `public.ecr.aws/nullplatform`)
	+ `severity`: Minimum severity to report (default: `CRITICAL,HIGH`)
* **Secrets required**:
	+ `aws_role_arn`: AWS IAM Role ARN for OIDC authentication
	+ `slack_webhook_url`: Slack webhook URL for vulnerability alerts
* **Usage**:
```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/ecr-security-scan.yml@main
with:
  image_names: '["image1", "image2"]'
  ecr_registry: public.ecr.aws/nullplatform
  severity: CRITICAL,HIGH
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
  slack_webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### tfsec
Scans Terraform code for security issues. Use this workflow to identify potential security vulnerabilities in your Terraform code.

* **Inputs**:
	+ `minimum_severity`: Minimum severity level to report (default: `HIGH`)
	+ `upload_sarif`: Upload SARIF results to GitHub Security tab (default: `true`)
	+ `post_comment`: Post comment on PR if scan fails (default: `true`)
* **Usage**:
```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tfsec.yml@main
with:
  minimum_severity: HIGH
  upload_sarif: true
  post_comment: true
```

## 🚀 Build & Deploy
### docker-build-push-ecr
Builds and pushes a Docker image to ECR. Use this workflow to build and deploy your Docker images to ECR.

* **Inputs**:
	+ `image_name`: Name of the Docker image (required)
	+ `context`: Build context directory (required)
	+ `dockerfile`: Path to Dockerfile relative to context (default: `Dockerfile`)
	+ `platforms`: Target platforms for multi-arch build (default: `linux/amd64,linux/arm64`)
	+ `ecr_registry`: ECR registry URL (default: `public.ecr.aws/nullplatform`)
	+ `tag`: Additional tag for the image (default: ``)
	+ `aws_region`: AWS region for ECR (default: `us-east-1`)
* **Secrets required**:
	+ `aws_role_arn`: AWS IAM Role ARN for OIDC authentication
* **Usage**:
```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/docker-build-push-ecr.yml@main
with:
  image_name: my-image
  context: .
  dockerfile: Dockerfile
  platforms: linux/amd64,linux/arm64
  ecr_registry: public.ecr.aws/nullplatform
  tag: latest
  aws_region: us-east-1
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
```

## 📦 Release & Changelog
### changelog-release
Generates changelog and creates a GitHub Release. Use this workflow to automate your release process.

* **Inputs**:
	+ `project-type`: Type of project (default: `generic`)
	+ `source-dir`: Directory containing packages/charts (default: `.`)
	+ `version-file`: Version file name (default: ``)
	+ `tag-prefix`: Prefix for git tags (default: ``)
	+ `create-github-release`: Create a GitHub Release (default: `true`)
	+ `commit-message`: Commit message for version bump (default: `chore(release): bump version and update changelog [skip ci]`)
* **Usage**:
```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/changelog-release.yml@main
with:
  project-type: generic
  source-dir: .
  version-file: VERSION
  tag-prefix: v
  create-github-release: true
  commit-message: chore(release): bump version and update changelog [skip ci]
```

### pre-release
Creates a pre-release and posts a changelog preview comment. Use this workflow to automate your pre-release process.

* **Usage**:
```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pre-release.yml@main
```

### release
Creates a GitHub Release and updates README versions. Use this workflow to automate your release process.

* **Inputs**:
	+ `update_readme_versions`: Update version references in README files after release (default: `true`)
* **Usage**:
```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/release.yml@main
with:
  update_readme_versions: true
```

## 📚 Documentation
### readme-ai-generator-v2
Generates README files using AI. Use this workflow to automate your README generation process.

* **Inputs**:
	+ `base_dir`: Base directory to search for projects (default: `.`)
	+ `generator_type`: Force generator type (default: ``)
	+ `generate_all`: Generate README for all projects (default: `false`)
	+ `file_patterns`: File patterns to detect changes (default: `*.tf *.ts *.tsx *.js *.jsx *.py`)
	+ `ai_provider`: AI provider to use (default: `groq`)
	+ `ai_model`: AI model to use (default: ``)
	+ `run_post_generation`: Commands to run after generation (default: ``)
* **Usage**:
```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/readme-ai-generator-v2.yml@main
with:
  base_dir: .
  generator_type: terraform
  generate_all: false
  file_patterns: *.tf
  ai_provider: groq
  ai_model: default
  run_post_generation: terraform-docs
```

### tf-docs
Generates Terraform documentation. Use this workflow to automate your Terraform documentation process.

* **Usage**:
```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tf-docs.yml@main
```

### update-readme-actions
Updates the README with available actions. Use this workflow to automate your README update process.

* **Inputs**:
	+ `ai_provider`: AI provider to use (default: `groq`)
	+ `ai_model`: AI model to use (default: ``)
* **Usage**:
```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/update-readme-actions.yml@main
with:
  ai_provider: groq
  ai_model: default
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
