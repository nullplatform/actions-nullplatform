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
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Enforces conventional commit-style branch naming patterns for PRs |
| [Changelog and Release](#changelog-and-release) | 📦 Release & Changelog | Generates changelogs and creates releases with automated version bumping |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Validates commit messages against Conventional Commits specification |
| [Docker Build and Push to ECR](#docker-build-and-push-to-ecr) | 🚀 Build & Deploy | Builds multi-arch Docker images and publishes them to Amazon ECR Public |
| [Docker Security Scan](#docker-security-scan) | 🔒 Security | Scans Docker images for vulnerabilities using Trivy before deployment |
| [ECR Security Scan](#ecr-security-scan) | 🔒 Security | Scans deployed ECR images for vulnerabilities and sends Slack alerts |
| [PR Checks - Docker Build](#pr-checks-docker-build) | 🔍 CI & Validation | Validates Docker builds in pull requests |
| [PR Checks - Go](#pr-checks-go) | 🔍 CI & Validation | Runs Go linting and tests for pull requests |
| [PR Checks - Node (npm)](#pr-checks-node-npm) | 🔍 CI & Validation | Runs npm-based linting and tests for Node.js projects |
| [PR Checks - Node (pnpm)](#pr-checks-node-pnpm) | 🔍 CI & Validation | Runs pnpm-based linting and tests for Node.js projects |
| [tofu-pre-release](#tofu-pre-release) | 📦 Release & Changelog | Posts changelog preview comments on PRs using semantic-release |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | AI-powered README generation for Terraform, TypeScript, Python, and other projects |
| [tofu-release](#tofu-release) | 📦 Release & Changelog | Automated releases for Terraform modules using Release Please |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Generates and updates Terraform documentation using terraform-docs |
| [tfsec-security-scan](#tfsec-security-scan) | 🔒 Security | Scans Terraform code for security issues and misconfigurations |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Validates and formats OpenTofu/Terraform code |
| [tofu-test](#tofu-test) | 🔍 CI & Validation | Runs OpenTofu native tests across multiple modules in parallel |

---

## 🔍 CI & Validation

### branch-validation

Validates branch names in pull requests against a configurable regex pattern, enforcing conventional commit-style prefixes (feat/, fix/, docs/, etc.). Use this to maintain consistent branch naming conventions across your team.

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
  pattern: '^(feat|fix|docs|chore)/.+$'
```

---

### conventional-commit

Validates all commits in a pull request against the Conventional Commits specification using commitlint. Ensures commit messages follow the format `type(scope): description` with allowed types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert.

**Inputs**
- None

**Secrets required**
- None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

---

### PR Checks - Docker Build

Validates that Docker images can be built successfully in pull requests. Useful for catching build errors before merge without pushing images to a registry.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| context | Docker build context path | No | `.` |
| dockerfile | Path to the Dockerfile | No | `Dockerfile` |

**Secrets required**
- None (uses `GITHUB_TOKEN` automatically)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-docker.yml@main
with:
  context: ./services/api
  dockerfile: Dockerfile.production
```

---

### PR Checks - Go

Runs Go linting (go vet) and tests for pull requests. Automatically detects Go version from go.mod or allows explicit version specification.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for go commands | No | `.` |
| go-version | Go version (overrides go.mod if set) | No | `` |

**Secrets required**
- None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-go.yml@main
with:
  working-directory: ./cmd/myapp
  go-version: '1.21'
```

---

### PR Checks - Node (npm)

Runs linting and tests for Node.js projects using npm. Automatically detects Node version from .node-version file or allows explicit specification.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for npm commands | No | `.` |
| node-version | Node.js version (overrides .node-version file if set) | No | `` |

**Secrets required**
- None (uses `GITHUB_TOKEN` for package registry access)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-npm.yml@main
with:
  working-directory: ./packages/frontend
  node-version: '20'
```

---

### PR Checks - Node (pnpm)

Runs linting and tests for Node.js projects using pnpm package manager. Supports the same features as npm workflow but optimized for pnpm workspaces.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| working-directory | Working directory for pnpm commands | No | `.` |
| node-version | Node.js version (overrides .node-version file if set) | No | `` |

**Secrets required**
- None (uses `GITHUB_TOKEN` for package registry access)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-pnpm.yml@main
with:
  working-directory: ./apps/web
```

---

### tofu-lint

Validates OpenTofu/Terraform code by running `tofu init`, `tofu fmt -check`, and `tofu validate`. Use this in pull requests to catch formatting and syntax errors before merge.

**Inputs**
- None

**Secrets required**
- None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-lint.yml@main
```

---

### tofu-test

Runs OpenTofu native tests across multiple modules in parallel with configurable concurrency. Accepts a JSON array of module paths and executes `tofu test` in each.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| modules | JSON array of module paths to test (e.g. ["module/a", "module/b"]) | Yes | - |
| tofu_version | OpenTofu version to use | No | `1.10.6` |

**Secrets required**
- None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tofu-test.yml@main
with:
  modules: '["modules/vpc", "modules/eks", "modules/rds"]'
  tofu_version: '1.10.6'
```

---

## 🔒 Security

### Docker Security Scan

Scans Docker images for vulnerabilities using Trivy before deployment. Builds the image locally and reports vulnerabilities at specified severity levels. Use this in pull requests to prevent vulnerable images from being deployed.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| context | Build context directory | Yes | - |
| dockerfile | Path to Dockerfile relative to context | No | `Dockerfile` |
| image_name | Name for the scanned image (used for reporting) | Yes | - |
| severity | Minimum severity to report (CRITICAL,HIGH,MEDIUM,LOW) | No | `CRITICAL,HIGH` |
| build_args | Docker build arguments (multiline, one per line: KEY=VALUE) | No | `` |
| exit_code | Exit code when vulnerabilities are found (0 to not fail) | No | `1` |

**Secrets required**
- None

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/docker-security-scan.yml@main
with:
  context: ./services/api
  image_name: my-api
  severity: 'CRITICAL,HIGH,MEDIUM'
  build_args: |
    NODE_ENV=production
    API_VERSION=2.0.0
```

---

### ECR Security Scan

Scans already-deployed images in Amazon ECR Public for vulnerabilities and sends Slack alerts when issues are found. Automatically detects the latest semver tag for each image and scans it with Trivy. Ideal for scheduled security audits.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| image_names | JSON array of image names to scan (e.g., ["k8s-logs-controller", "k8s-traffic-manager"]) | Yes | - |
| ecr_registry | ECR registry URL | No | `public.ecr.aws/nullplatform` |
| severity | Minimum severity to report (CRITICAL,HIGH,MEDIUM,LOW) | No | `CRITICAL,HIGH` |

**Secrets required**
- `aws_role_arn` - AWS IAM Role ARN for OIDC authentication
- `slack_webhook_url` - Slack webhook URL for vulnerability alerts

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/ecr-security-scan.yml@main
with:
  image_names: '["my-app", "my-worker", "my-api"]'
  ecr_registry: public.ecr.aws/myorg
  severity: 'CRITICAL,HIGH'
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
  slack_webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

### tfsec-security-scan

Scans Terraform code for security issues and misconfigurations using tfsec. Generates SARIF reports for GitHub Security tab, posts PR comments on failures, and supports configurable severity levels.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| minimum_severity | Minimum severity level to report (CRITICAL, HIGH, MEDIUM, LOW) | No | `HIGH` |
| upload_sarif | Upload SARIF results to GitHub Security tab | No | `true` |
| post_comment | Post comment on PR if scan fails | No | `true` |

**Secrets required**
- None (uses `GITHUB_TOKEN` automatically)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/tfsec.yml@main
with:
  minimum_severity: MEDIUM
  upload_sarif: true
  post_comment: true
```

---

## 🚀 Build & Deploy

### Docker Build and Push to ECR

Builds multi-architecture Docker images (amd64/arm64) and pushes them to Amazon ECR Public. Uses AWS OIDC authentication, supports custom build arguments, and implements build caching with GitHub Actions cache.

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
- `aws_role_arn` - AWS IAM Role ARN for OIDC authentication

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/docker-build-push-ecr.yml@main
with:
  image_name: my-app
  context: .
  dockerfile: Dockerfile
  tag: my-app-v2.0.0
  build_args: |
    NODE_ENV=production
    API_VERSION=2.0.0
secrets:
  aws_role_arn: ${{ secrets.AWS_ROLE_ARN }}
```

---

## 📦 Release & Changelog

### Changelog and Release

Generates conventional changelogs, bumps versions automatically based on commit types, and creates GitHub releases. Supports Helm charts, npm packages, and generic projects with customizable version files and tag prefixes.

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

**Secrets required**
- None (uses `GITHUB_TOKEN` automatically)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/changelog-release.yml@main
with:
  project-type: npm
  source-dir: packages
  tag-prefix: v
  create-github-release: true
```

---

### tofu-pre-release

Posts changelog preview comments on pull requests using semantic-release-github-pr. Shows what the release notes will look like before merging, helping reviewers understand the impact of changes.

**Inputs**
- None

**Secrets required**
- None (uses `GITHUB_TOKEN` automatically)

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pre-release.yml@main
```

---

### tofu-release

Automates releases for Terraform modules using Google's Release Please action. Creates release PRs with automated changelogs and optionally updates version references in all README files after release.

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
