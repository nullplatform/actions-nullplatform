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

# Reusable Workflows — nullplatform/actions-nullplatform

## Summary

| Workflow | Category | Description |
|---|---|---|
| [auto-merge-release-pr](#auto-merge-release-pr) | 📦 Release & Changelog | Automatically merges release-please PRs after all checks pass, using a GitHub App token to trigger downstream workflows |
| [bot-prs-digest](#bot-prs-digest) | 🔍 CI & Validation | Posts a biweekly Slack digest of open bot PRs (Dependabot, Renovate, release-please) and audits org repos for missing release infrastructure |
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Validates PR branch names against a conventional prefix pattern, skipping release-please and Dependabot branches |
| [Changelog and Release](#changelog-and-release) | 📦 Release & Changelog | Generates changelogs from conventional commits, bumps versions, and creates GitHub Releases for helm-charts, npm, or generic projects |
| [code-review-command](#code-review-command) | 📚 Documentation | Dispatches on-demand Claude AI review tiers (`@claude`, `@claude deep`, `@claude fix`) from PR comments, enforcing author permissions and fork safety |
| [code-review](#code-review) | 📚 Documentation | Runs an automated Claude AI review pass on every PR push, posting and updating a single review comment with escalation detection |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Validates all commits in a PR against the Conventional Commits spec using commitlint |
| [Docker Build and Push to ECR](#docker-build-and-push-to-ecr) | 🚀 Build & Deploy | Builds a multi-arch Docker image and pushes it to Amazon ECR Public, outputting the image digest and resolved tag |
| [Docker Build and Push to ECR (NP)](#docker-build-and-push-to-ecr-np) | 🚀 Build & Deploy | Builds and pushes a Docker image using the nullplatform CLI (`np build`), reporting build status back to the nullplatform platform |
| [Docker Security Scan](#docker-security-scan) | 🔒 Security | Builds a Docker image locally and scans it for vulnerabilities with Trivy, optionally uploading SARIF results to the GitHub Security tab |
| [ECR Security Scan](#ecr-security-scan) | 🔒 Security | Scans already-published ECR images for CRITICAL/HIGH vulnerabilities with Trivy and sends a Slack alert when findings or stale tags are detected |
| [pr-checks-actions](#pr-checks-actions) | 🔍 CI & Validation | Runs actionlint to validate GitHub Actions workflow syntax and Trivy secret scanning on every PR |
| [PR Checks - Docker Build](#pr-checks---docker-build) | 🚀 Build & Deploy | Validates a Dockerfile builds successfully on PRs, supporting GitHub App tokens, PAT fallback chains, and BuildKit secrets |
| [PR Checks - Go](#pr-checks---go) | 🔍 CI & Validation | Runs `go vet` and `go test` on PRs, with optional GitHub App token minting for private module access |
| [PR Checks - Node (npm)](#pr-checks---node-npm) | 🔍 CI & Validation | Installs npm dependencies, runs lint, and executes tests for Node.js projects using npm |
| [PR Checks - Node Build (pnpm)](#pr-checks---node-build-pnpm) | 🔍 CI & Validation | Installs pnpm dependencies and runs the build step for Node.js projects using pnpm |
| [PR Checks - Node (pnpm)](#pr-checks---node-pnpm) | 🔍 CI & Validation | Installs pnpm dependencies, runs lint, and executes tests with optional changed-file filtering and sharding for vitest |
| [pr-checks-renovate-config](#pr-checks-renovate-config) | 🔍 CI & Validation | Validates `renovate-config.js` against the exact Renovate version pinned in `renovate.yml` on PRs that touch either file |
| [PR Checks - Terraform](#pr-checks---terraform) | 🔍 CI & Validation | Orchestrates OpenTofu lint, tfsec security scan, and optional module tests for Terraform/OpenTofu PRs |
| [tofu-pre-release](#tofu-pre-release) | 📦 Release & Changelog | Posts a changelog preview comment on PRs using semantic-release dry-run |
| [publish-test-image-oci](#publish-test-image-oci) | 🚀 Build & Deploy | Builds and pushes a test-tagged Docker image from a branch or PR and registers it as a nullplatform artifact revision for pre-release validation |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | Generates or updates README files using AI for changed or all project directories, committing the results back to the branch |
| [register-oci-artifact](#register-oci-artifact) | 🚀 Build & Deploy | Registers an already-pushed OCI image as a nullplatform artifact revision via the `np` CLI, exposing artifact and revision IDs |
| [release-publish-oci](#release-publish-oci) | 📦 Release & Changelog | Full release pipeline: runs release-please, builds and pushes a Docker image to ECR, registers a nullplatform artifact, and finalizes the GitHub Release with image metadata |
| [release](#release) | 📦 Release & Changelog | Runs release-please to cut a release and optionally updates `ref=vX.Y.Z` version pins in README files |
| [renovate](#renovate) | 📦 Release & Changelog | Runs Renovate on a biweekly schedule to bump pinned binary versions in Dockerfiles across the org |
| [shellcheck](#shellcheck) | 🔍 CI & Validation | Runs ShellCheck on shell scripts, auto-discovering `.sh` files and extensionless files with a shell shebang |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Generates and injects Terraform/OpenTofu module documentation into README files using terraform-docs |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Runs `tofu init`, `tofu fmt -check`, and `tofu validate` to lint OpenTofu/Terraform configurations |
| [tofu-test](#tofu-test) | 🔍 CI & Validation | Runs `tofu test` in parallel across a matrix of specified module paths |
| [trivy-tofu-scan](#trivy-tofu-scan) | 🔒 Security | Scans OpenTofu/Terraform IaC files for CRITICAL/HIGH misconfigurations with Trivy, optionally uploading SARIF to the Security tab |
| [update-readme-actions](#update-readme-actions) | 📚 Documentation | Regenerates the repository README with current workflow documentation using AI and opens a PR with the changes |

---

## 🔍 CI & Validation

### branch-validation

Validates that PR branch names conform to a conventional prefix pattern (e.g. `feat/`, `fix/`, `chore/`). Automatically skips release-please (`release-please--*`) and Dependabot (`dependabot/*`) branches. Use this on `pull_request` events to enforce naming conventions across the team.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `pattern` | Regex pattern for branch name validation | No | `^(feat\|feature\|fix\|docs\|style\|refactor\|perf\|test\|build\|ci\|chore\|revert)/.+$` |

**Usage**

```yaml
jobs:
  branch-check:
    uses: nullplatform/actions-nullplatform/.github/workflows/branch-validation.yml@main
```

---

### conventional-commit

Validates every commit in a PR against the [Conventional Commits](https://www.conventionalcommits.org/) specification using `commitlint`. Allows extended type aliases (`feature`) and relaxes body/footer line-length limits so Dependabot and Renovate commit messages are not rejected.

**Usage**

```yaml
jobs:
  commit-lint:
    uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

---

### PR Checks - Go

Runs `go vet ./...` and `go test ./...` for Go projects. Supports reading the Go version from `go.mod` or an explicit override, configuring `GOPRIVATE` for private modules, and optionally minting a short-lived GitHub App token so `go get` can reach private repositories in the same org.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `working-directory` | Working directory for go commands | No | `.` |
| `go-version` | Go version (overrides go.mod if set) | No | `''` |
| `go-private` | GOPRIVATE glob for modules that must bypass the public proxy | No | `github.com/nullplatform/*` |
| `use-app-token` | Mint a GitHub App token for private module access | No | `false` |
| `require-private-modules` | Fail fast with a clear error if no credential is available | No | `false` |

**Usage**

```yaml
jobs:
  go-checks:
    uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-go.yml@main
    with:
      working-directory: .
      use-app-token: true
      require-private-modules: true
    secrets:
      CI_APP_ID: ${{ secrets.CI_APP_ID }}
      CI_APP_PRIVATE_KEY: ${{ secrets.CI_APP_PRIVATE_KEY }}
```

---

### PR Checks - Node (npm)

Installs npm dependencies with `npm ci`, runs the first available lint script (`test:static` or `lint`), and executes `npm test`. Resolves the Node.js version from `.node-version` by default or from an explicit override. Supports a token fallback chain (`CI_TOKEN` → `DEPENDABOT_TOKEN` → `GITHUB_TOKEN`) for private GitHub Packages registries.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `working-directory` | Working directory for npm commands | No | `.` |
| `node-version` | Node.js version (overrides `.node-version` if set) | No | `''` |

**Usage**

```yaml
jobs:
  node-checks:
    uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-npm.yml@main
    with:
      working-directory: .
```

---

### PR Checks - Node Build (pnpm)

Installs pnpm dependencies and runs `pnpm build`. Use this for packages that require a compilation step (TypeScript, bundlers) as part of PR validation. Node.js version is read from `.node-version` or an explicit input.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `working-directory` | Working directory for pnpm commands | No | `.` |
| `node-version` | Node.js version (overrides `.node-version` if set) | No | `''` |

**Usage**

```yaml
jobs:
  build-check:
    uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-pnpm-build.yml@main
    with:
      working-directory: packages/my-package
```

---

### PR Checks - Node (pnpm)

Installs pnpm dependencies, optionally runs lint, and executes the test suite. Supports running tests only against changed files (`--changed <ref>` for vitest) and splitting the suite across parallel runners with `--shard`. Disable lint on all-but-one shard to avoid duplicate runs.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `working-directory` | Working directory for pnpm commands | No | `.` |
| `node-version` | Node.js version (overrides `.node-version` if set) | No | `''` |
| `changed-since` | Git ref to diff against; runs only tests related to the diff | No | `''` |
| `shard` | Vitest shard index as `<index>/<count>` | No | `''` |
| `lint` | Run the lint step | No | `true` |

**Usage**

```yaml
jobs:
  node-checks:
    uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-node-pnpm.yml@main
    with:
      working-directory: .
      changed-since: ${{ github.event.pull_request.base.sha }}
```

---

### pr-checks-renovate-config

Validates `renovate-config.js` against the exact Renovate version pinned in `.github/workflows/renovate.yml` by extracting the action's commit SHA, resolving the bundled Renovate version, and running `renovate-config-validator --strict`. Triggered only on PRs that touch either file. Prevents a config change from landing silently broken before the next scheduled run.

**Usage**

```yaml
# This workflow has no workflow_call trigger — it runs on pull_request.
# Reference it directly in your own repo by copying or adapting it.
```

> **Note:** `pr-checks-renovate-config` uses `on: pull_request` directly and is not a reusable `workflow_call` workflow. Include it in your repository's own workflow files.

---

### PR Checks - Terraform

Orchestrates three checks for Terraform/OpenTofu PRs: lint & validate (via `tofu-lint`), tfsec security scan, and optional `tofu test` runs across a module matrix. Each check runs as a separate job so they can fail independently.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `minimum_severity` | Minimum severity for tfsec (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) | No | `HIGH` |
| `upload_sarif` | Upload SARIF results to the GitHub Security tab | No | `true` |
| `post_comment` | Post a PR comment when tfsec finds issues | No | `true` |
| `run_tests` | Run `tofu test` on specified modules | No | `false` |
| `modules` | JSON array of module paths to test | No | `''` |
| `tofu_version` | OpenTofu version for `tofu test` | No | `1.10.6` |
| `skip_backend` | Run `tofu init` with `-backend=false` | No | `false` |

**Usage**

```yaml
jobs:
  terraform-checks:
    uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-terraform.yml@main
    with:
      minimum_severity: HIGH
      upload_sarif: true
      run_tests: true
      modules: '["modules/vpc", "modules/iam"]'
    permissions:
      contents: read
      pull-requests: write
      security-events: write
```

---

### tofu-lint

Runs `tofu init`, `tofu fmt -check`, and `tofu validate` to catch formatting and configuration errors in OpenTofu/Terraform files. Use `skip_backend: true` for repos with remote backends that cannot be initialized in CI.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `skip_backend` | Run `tofu init` with `-backend=false` | No | `false` |

**Usage**

```yaml
jobs:
  lint:
    uses: nullplatform/actions-nullplatform/.github/workflows/tofu-lint.yml@main
    with:
      skip_backend: true
```

---

### tofu-test

Runs `tofu test` in parallel across a matrix of module paths, with a maximum concurrency of 2. Each module is initialized with `-backend=false`. Use this when your Terraform modules

<!-- ACTIONS-END -->

## 📦 Release & Changelog

### release-publish-oci

The standard release pipeline for service repos that ship an OCI image. Chains release-please, the ECR image publish, nullplatform artifact registration, and release finalization (artifact metadata appended to the body, release force-published) in a single workflow run — so the GitHub limitation that bot-token events never trigger workflows is structurally irrelevant, and no PAT is needed. Supports `existing_tag` for recovery/backfill of already-created tags. Registration runs through [register-oci-artifact](#register-oci-artifact).

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| image_name | Image name under the registry (e.g. scopes/lambda) | Yes | - |
| context | Docker build context | No | . |
| dockerfile | Dockerfile path relative to context | No | Dockerfile |
| platforms | Target platforms for the multi-arch build | No | linux/amd64,linux/arm64 |
| ecr_registry | ECR registry URL prefix | No | public.ecr.aws/nullplatform |
| aws_region | AWS region for ECR | No | us-east-1 |
| build_args | Docker build arguments (newline-separated) | No | '' |
| also_tag_latest | Also tag and push the image as latest | No | false |
| release-type | Release Please release type | No | simple |
| update_readme_versions | Update ref=vX.Y.Z references in READMEs after release | No | false |
| existing_tag | Skip release-please; publish + finalize this existing tag | No | '' |
| register_artifact | Register the image as a nullplatform oci_image artifact | No | true |
| artifact_visible_to | Visibility selector for the registered artifact | No | organization=* |
| np_cli_version | np CLI version/channel for artifact registration | No | alpha-packages |

**Secrets**
- `aws_role_arn` (required): AWS IAM Role ARN for OIDC auth against ECR
- `artifact_np_api_key`: nullplatform API key (required while `register_artifact` is true)

Also reads the `NP_ARTIFACT_NRN` repository/organization variable (artifact owner NRN), and requires the caller to grant `contents: write`, `pull-requests: write`, and `id-token: write` (a preflight job fails fast when `id-token` is missing).

**Usage**

```yaml
name: release
on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      existing_tag:
        description: 'Publish + finalize an existing tag (recovery/backfill)'
        required: true
        type: string
permissions:
  contents: write
  pull-requests: write
  id-token: write
jobs:
  release:
    uses: nullplatform/actions-nullplatform/.github/workflows/release-publish-oci.yml@main
    with:
      image_name: scopes/lambda
      existing_tag: ${{ inputs.existing_tag || '' }}
    secrets:
      aws_role_arn: ${{ secrets.AWS_ROLE_ARN_ECR_PUSH }}
      artifact_np_api_key: ${{ secrets.ARTIFACT_NP_API_KEY }}
```

### publish-test-image-oci

Builds a test image from the branch it is dispatched on (or from a same-repo pull request), pushes it to ECR with the tag `test-<branch-slug>-<short-sha>`, and registers it as an `oci_image` artifact so it can go into a package version and be rolled out to a test scope. No release-please, no git tag, no GitHub release, never `latest`. The run's job summary lists the image, digest, pinned reference, registry/repository, artifact ID and revision ID.

A test build registers exactly where a release does: the same owner (`NP_ARTIFACT_NRN`), the same registry and repository, and the same default visibility (`organization=*`). Artifacts are unique on (owner NRN, registry, repository), so a test build is one more revision of the release artifact. The image is already in the public registry, and the artifact is as visible as the image.

A test revision is told apart from a release by:

- The tag, which always starts with `test-` and never contains a dot, so it never looks like a version to `docker-build-push-ecr` or `ecr-security-scan`. Release tags must never start with `test-`.
- The `com.nullplatform.build.type=test`, `com.nullplatform.build.branch` and `com.nullplatform.build.run` annotations, next to `org.opencontainers.image.source` and `org.opencontainers.image.revision`.

Until the next release registers, the test revision is the artifact's newest one: the UI's **Existing artifact** picker and tag-less lookups default to it, and a package pinning the artifact sees it as the available update. Pin releases by tag or digest where that matters.

Fork pull requests and `pull_request_target` are refused, so fork code never runs with push credentials. ECR Public has no lifecycle policies and artifacts can't be deleted, so test tags stay until someone removes them (`aws ecr-public batch-delete-image`).

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| image_name | Image name under the registry (e.g. scopes/lambda) | Yes | - |
| context | Docker build context | No | . |
| dockerfile | Dockerfile path relative to context | No | Dockerfile |
| submodules | Check out git submodules before building | No | false |
| platforms | Target platforms for the multi-arch build | No | linux/amd64,linux/arm64 |
| ecr_registry | ECR registry URL prefix | No | public.ecr.aws/nullplatform |
| aws_region | AWS region for ECR | No | us-east-1 |
| build_args | Docker build arguments (newline-separated) | No | '' |
| register_artifact | Register the image as a revision of the artifact owned by `NP_ARTIFACT_NRN` | No | true |
| artifact_visible_to | Visibility selector for the registered artifact (same default as `release-publish-oci`) | No | organization=* |
| np_cli_version | np CLI version/channel for artifact registration | No | alpha |

**Secrets**
- `aws_role_arn` (required): AWS IAM Role ARN for OIDC auth against ECR
- `artifact_np_api_key`: nullplatform API key allowed to create artifacts at `NP_ARTIFACT_NRN`, the same one `release-publish-oci` uses (required while `register_artifact` is true)

**Outputs**: `image_tag`, `image_digest`, `artifact_id`, `artifact_revision_id`.

Reads the `NP_ARTIFACT_NRN` repository/organization variable (the one `release-publish-oci` reads), and requires the caller to grant `contents: read` and `id-token: write`. A preflight job checks the permissions and the artifact wiring before anything is built.

**Usage**

```yaml
name: test-image
on:
  workflow_dispatch:
permissions:
  contents: read
  id-token: write
jobs:
  test-image:
    uses: nullplatform/actions-nullplatform/.github/workflows/publish-test-image-oci.yml@v1
    with:
      image_name: scopes/lambda
    secrets:
      aws_role_arn: ${{ secrets.AWS_ROLE_ARN_ECR_PUSH }}
      artifact_np_api_key: ${{ secrets.ARTIFACT_NP_API_KEY }}
```

Run it from the branch to test: **Actions > test-image > Run workflow**, or `gh workflow run test-image.yml --ref <branch>`. To build pull requests that carry a label instead, trigger on `pull_request: types: [labeled, synchronize]` and guard the job with `if: contains(github.event.pull_request.labels.*.name, 'test-image')`.

### register-oci-artifact

Registers an image that is already in a registry as a nullplatform `oci_image` artifact revision with `np artifact create`, and outputs the artifact and revision IDs. `release-publish-oci` and `publish-test-image-oci` both call it. It always adds `org.opencontainers.image.source`, and can add the build commit (`source_ref`), a version, the notes of a GitHub release as the changelog, and extra `key=value` annotations. Registering the same digest and tag again returns the same revision and replaces its annotations.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| nrn | Owner NRN of the artifact | Yes | - |
| ecr_registry | Registry URL prefix the image was pushed under | No | public.ecr.aws/nullplatform |
| image_name | Image name under the registry | Yes | - |
| image_tag | Tag the image was pushed with | Yes | - |
| image_digest | Image digest (sha256:...) | Yes | - |
| source_ref | Git ref or commit the image was built from, recorded as `org.opencontainers.image.revision` | No | '' |
| version | Value for `org.opencontainers.image.version` | No | '' |
| changelog_release_tag | Use the notes of the GitHub release for this tag as the changelog | No | '' |
| annotations | Extra annotations, one `key=value` per line | No | '' |
| visible_to | Visibility NRN selectors, space or comma separated | No | '' (owner NRN only) |
| np_cli_version | np CLI version/channel | No | alpha |

**Secrets**
- `np_api_key`: nullplatform API key allowed to create artifacts at `nrn` (the job fails when it is empty)

**Outputs**: `artifact_id`, `artifact_revision_id`.

Workflows in this repo call it with the path form (`uses: ./.github/workflows/register-oci-artifact.yml`) so it runs from the same ref the caller pinned. Other repos can call it like any reusable workflow.

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
