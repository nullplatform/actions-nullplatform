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

# GitHub Actions Reusable Workflows — nullplatform/actions-nullplatform

## Summary Table

| Workflow | Category | Description |
|---|---|---|
| [auto-merge-release-pr](#auto-merge-release-pr) | 📦 Release & Changelog | Automatically merges release-please PRs after all CI checks pass, using a GitHub App token to bypass bot-event restrictions |
| [bot-prs-digest](#bot-prs-digest) | 📦 Release & Changelog | Posts a biweekly Slack digest of open bot PRs (Dependabot, Renovate, release-please) and audits release-pipeline conformance across the org |
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Validates PR branch names against a conventional-commits-style regex pattern |
| [Changelog and Release](#changelog-and-release) | 📦 Release & Changelog | Generates changelogs from conventional commits, bumps versions, creates git tags, and optionally publishes GitHub Releases for helm-charts, npm, or generic projects |
| [code-review-command](#code-review-command) | 🔍 CI & Validation | Routes `@claude`, `@claude deep`, and `@claude fix` PR comment commands to the appropriate Claude AI review tier |
| [code-review](#code-review) | 🔍 CI & Validation | Runs an automated Claude AI review pass on every PR, posting and updating a single review comment with escalation detection |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Validates that all commits in a PR follow the Conventional Commits specification |
| [Docker Build and Push to ECR](#docker-build-push-to-ecr) | 🚀 Build & Deploy | Builds a multi-arch Docker image and pushes it to Amazon ECR Public with OIDC authentication |
| [Docker Build and Push to ECR (NP)](#docker-build-and-push-to-ecr-np) | 🚀 Build & Deploy | Builds and pushes a Docker image using the nullplatform CLI (`np build`/`make`) and reports the build status back to nullplatform |
| [Docker Security Scan](#docker-security-scan) | 🔒 Security | Builds a Docker image locally and scans it with Trivy, optionally uploading SARIF results to the GitHub Security tab |
| [ECR Security Scan](#ecr-security-scan) | 🔒 Security | Pulls the latest versioned image for each named ECR repository, scans with Trivy, and sends a Slack alert when CRITICAL or HIGH vulnerabilities are found |
| [pr-checks-actions](#pr-checks-actions) | 🔍 CI & Validation | Runs actionlint to validate GitHub Actions workflow syntax and Trivy to scan for secrets in the repository |
| [PR Checks - Docker Build](#pr-checks---docker-build) | 🔍 CI & Validation | Validates that the Docker image builds successfully on a PR, supporting both `--build-arg` and BuildKit `--secret` token injection |
| [PR Checks - Go](#pr-checks---go) | 🔍 CI & Validation | Runs `go vet` and `go test` with optional private module access via GitHub App or PAT credentials |
| [PR Checks - Node (npm)](#pr-checks---node-npm) | 🔍 CI & Validation | Installs npm dependencies, runs lint, and executes the test suite for Node.js npm-managed projects |
| [PR Checks - Node Build (pnpm)](#pr-checks---node-build-pnpm) | 🔍 CI & Validation | Installs pnpm dependencies and runs a production build for Node.js pnpm-managed projects |
| [PR Checks - Node (pnpm)](#pr-checks---node-pnpm) | 🔍 CI & Validation | Installs pnpm dependencies, runs lint, and executes tests with optional vitest `--changed` filtering and sharding |
| [pr-checks-renovate-config](#pr-checks-renovate-config) | 🔍 CI & Validation | Validates `renovate-config.js` against the exact Renovate version pinned in the repository's renovate workflow |
| [PR Checks - Terraform](#pr-checks---terraform) | 🔍 CI & Validation | Orchestrates Terraform/OpenTofu PR checks: lint/validate, tfsec security scan, and optional `tofu test` on specified modules |
| [tofu-pre-release](#tofu-pre-release) | 📦 Release & Changelog | Posts a semantic-release changelog preview as a PR comment without cutting a release |
| [publish-test-image-oci](#publish-test-image-oci) | 🚀 Build & Deploy | Builds and pushes a `test-<branch>-<sha>`-tagged Docker image from a branch or same-repo PR and optionally registers it as a nullplatform artifact revision |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | Generates or updates README files with AI for changed or all project directories, supporting multiple AI providers |
| [register-oci-artifact](#register-oci-artifact) | 🚀 Build & Deploy | Registers an already-pushed OCI image as a nullplatform artifact revision via the `np artifact create` CLI |
| [release-publish-oci](#release-publish-oci) | 📦 Release & Changelog | Full release pipeline: runs release-please, builds and pushes to ECR, registers the nullplatform artifact, and finalizes the GitHub Release with image metadata |
| [release](#release) | 📦 Release & Changelog | Runs release-please to cut a release and optionally updates `ref=vX.Y.Z` version references in README files |
| [shellcheck](#shellcheck) | 🔍 CI & Validation | Runs ShellCheck on explicit paths or auto-discovers `.sh` files and extensionless scripts with a shell shebang |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Generates terraform-docs documentation and injects it into README files for all modules, committing the result on push/dispatch |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Runs `tofu init`, `tofu fmt -check`, and `tofu validate` to lint OpenTofu/Terraform configurations |
| [tofu-test](#tofu-test) | 🔍 CI & Validation | Runs `tofu test` in parallel across a matrix of module paths |
| [trivy-tofu-scan](#trivy-tofu-scan) | 🔒 Security | Scans OpenTofu/Terraform IaC files with Trivy for CRITICAL and HIGH misconfigurations, optionally uploading SARIF to the Security tab |
| [update-readme-actions](#update-readme-actions) | 📚 Documentation | Regenerates the repository README with current workflow documentation using AI and opens a PR with the changes |

---

## 🔍 CI & Validation

### branch-validation

Validates the branch name of a pull request against a configurable regex pattern. Automatically skips `release-please--*` and `dependabot/*` branches. Use this as a PR check to enforce naming conventions like `feat/`, `fix/`, `chore/`, etc. before code is merged.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `pattern` | Regex pattern for branch name validation | No | `^(feat\|feature\|fix\|docs\|style\|refactor\|perf\|test\|build\|ci\|chore\|revert)/.+$` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/branch-validation.yml@main
```

---

### conventional-commit

Validates that every commit in a pull request conforms to the Conventional Commits specification using `commitlint`. Accepts an extended type list and relaxes body/footer line-length limits so Dependabot and Renovate commits (which paste long release notes) are not rejected.

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

---

### code-review

Runs an automated Claude AI review pass on a PR, posting a single comment that is edited in place on subsequent pushes. Classifies the outcome (`ok`, `unavailable`, `skipped`, `missing`), publishes a companion check run, notifies the PR author, and reports an `escalate` output when the review body signals it. Use this as the first automated review tier on `pull_request` events.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `prompt_file` | Path in the calling repo to the prompt the reviewer must follow | Yes | — |
| `prompt_context` | Context lines (`KEY: value`) prepended to the prompt | Yes | — |
| `model` | Full model ID for the review pass | No | `claude-sonnet-5-5` |
| `max_turns` | Turn budget for the model | No | `25` |
| `max_budget_usd` | Spend cap in USD for one run | No | `1.00` |
| `allowed_tools` | Tools the reviewer may use | No | `Bash(gh pr diff:*),Bash(gh pr view:*),Edit(/.claude-review-body.md)` |
| `allowed_bots` | Comma-separated bot actors whose pushes still get a review | No | `''` |
| `comment_marker` | HTML marker identifying this workflow's review comment | No | `<!-- claude-auto-review -->` |
| `timeout_minutes` | Hard cap on the review job in minutes | No | `12` |
| `node_version_file` | File naming the Node version for CI-status summary | No | `.node-version` |
| `scripts_ref` | Override ref for shared scripts (defaults to the workflow's own commit) | No | `''` |

**Secrets required**

- `claude_code_oauth_token` — OAuth token for claude-code-action

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/code-review.yml@main
with:
  prompt_file: .github/review/prompts/auto-review.md
  prompt_context: |
    RISK: medium
    AREAS: backend,api
  model: claude-sonnet-5-5
  max_budget_usd: '1.00'
secrets:
  claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
```

---

### code-review-command

Routes `@claude` (question), `@claude deep` (deep review), and `@claude fix` (automated fix PR) PR comment commands to the appropriate Claude AI tier. Enforces author association allowlists, bot filtering, and fork protection for the `fix` tier. Call this from `issue_comment`, `pull_request_review_comment`, or `pull_request_review` events.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `qa_prompt_file` | Path in the calling repo to the Q&A prompt | Yes | — |
| `deep_prompt_file` | Path in the calling repo to the deep-review prompt | Yes | — |
| `fix_prompt_file` | Path in the calling repo to the fix prompt | Yes | — |
| `allowed_associations` | Comma-separated author associations permitted to trigger reviews | No | `OWNER,MEMBER,COLLABORATOR` |
| `ignored_commands` | Comma-separated `@claude <word>` commands handled by another workflow | No | `''` |
| `qa_model` | Full model ID for Q&A tier | No | `claude-sonnet-5-5` |
| `qa_max_turns` | Turn budget for Q&A | No | `10` |
| `qa_max_budget_usd` | Spend cap for Q&A in USD | No | `2.00` |
| `qa_allowed_tools` | Tools available to the Q&A tier | No | `Bash(gh pr diff:*),Bash(gh pr view:*),Edit(/.claude-qa-answer.md)` |
| `deep_model` | Full model ID for deep review tier | No | `claude-opus-5-5` |
| `deep_max_turns` | Turn budget for deep review | No | `30` |
| `deep_max_budget_usd` | Spend cap for deep review in USD | No | `5.00` |
| `deep_allowed_tools` | Tools available to the deep review tier | No | `Bash(gh pr diff:*),Bash(gh pr view:*),Edit(/.claude-deep-review-body.md)` |
| `fix_model` | Full model ID for fix tier | No | `claude-opus-5-5` |
| `fix_max_turns` | Turn budget for fix | No | `25` |
| `fix_max_budget_usd` | Spend cap for fix in USD | No | `5.00` |
| `fix_allowed_tools` | Tools available to the fix tier | No | `Bash(gh pr comment:*),Bash(gh pr diff:*),Bash(gh pr view:*),Bash(gh pr create:*),Bash(git:*),Write,Edit,Read,Glob,Grep` |
| `fix_install_command` | Optional command run before the fixer (executes PR code) | No | `''` |
| `allow_fork_fix` | Permit `@claude fix` on fork PRs | No | `false` |
| `node_version_file` | Node version file for the deep and fix tiers | No | `.node-version` |
| `scripts_ref` | Override ref for shared scripts | No | `''` |

**Secrets required**

- `claude_code_oauth_token` — OAuth token for claude-code-action

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/code-review-command.yml@main
with:
  qa_prompt_file: .github/review/prompts/qa.md
  deep_prompt_file: .github/review/prompts/deep.md
  fix_prompt_file: .github/review/prompts/fix.md
  allowed_associations: OWNER,MEMBER,COLLABORATOR
secrets:
  claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
```

---

### pr-checks-actions

Validates GitHub Actions workflow files in the repository using `actionlint` and scans the codebase for accidentally committed secrets using Trivy. Not a reusable workflow (`workflow_call`); it is triggered directly on `pull_request` events in the actions-nullplatform repository.

---

### PR Checks - Docker Build

Verifies that the Docker image builds successfully on a PR without pushing it. Supports injecting a GitHub token either as a `--build-arg` (default) or as a BuildKit `--secret`, and can mint a short-lived GitHub App token for private source access.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `context` | Docker build context path | No | `.` |
| `dockerfile` | Path to the Dockerfile | No | `Dockerfile` |
| `use-app-token` | Mint a GitHub App token for private source access | No | `false` |
| `use_buildkit_secret` | Use BuildKit `--secret` instead of `--build-arg` for the token | No | `false` |

**Usage**

```yaml
uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-docker.yml@main
with:
  context: .
  dockerfile: Dockerfile
```

---

### PR Checks - Go

Runs `go vet ./...` and `go test ./...` for Go projects. Configures `GOPRIVATE` and a git credential for private module access via a GitHub App token or PAT fallback. Fails fast with a clear message when `require-private-modules` is set but no credential is available.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `working-directory` | Working directory for go commands | No | `.` |
| `go-version` | Go version (overrides go.

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
