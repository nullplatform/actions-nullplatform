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
|---|---|---|
| [auto-merge-release-pr](#auto-merge-release-pr) | 📦 Release & Changelog | Automatically merges a release-please PR after all other checks pass, using a GitHub App token to bypass bot-token event suppression |
| [bot-prs-digest](#bot-prs-digest) | 📦 Release & Changelog | Posts a biweekly Slack digest of open bot PRs (Dependabot, Renovate, release-please), release conformance issues, and failed releases across the org |
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Validates PR branch names against a conventional-commit prefix pattern, skipping release-please and Dependabot branches |
| [Changelog and Release](#changelog-and-release) | 📦 Release & Changelog | Generates a conventional-commit changelog, bumps the version file, creates git tags, and optionally publishes a GitHub Release |
| [code-review-command](#code-review-command) | 🔍 CI & Validation | Routes `@claude`, `@claude deep`, and `@claude fix` PR comment commands to Claude AI, enforcing author permissions and fork safety |
| [code-review](#code-review) | 🔍 CI & Validation | Runs an automated Claude AI review pass on every PR push, posting or updating a single advisory comment and publishing the outcome as a check |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Validates all commits in a PR against the Conventional Commits specification using commitlint |
| [Docker Build and Push to ECR](#docker-build-and-push-to-ecr) | 🚀 Build & Deploy | Builds a multi-arch Docker image and pushes it to Amazon ECR Public with semver tag normalization and GHA layer caching |
| [Docker Build and Push to ECR (nullplatform)](#docker-build-and-push-to-ecr-nullplatform) | 🚀 Build & Deploy | Builds and pushes a Docker image using the nullplatform CLI (`make build` / `make push`) and reports build status back to nullplatform |
| [Docker Security Scan](#docker-security-scan) | 🔒 Security | Builds an image locally and scans it with Trivy for CRITICAL/HIGH CVEs, uploading SARIF results to the GitHub Security tab |
| [ECR Security Scan](#ecr-security-scan) | 🔒 Security | Pulls each image's latest semver tag from ECR Public, scans with Trivy, and sends a Slack alert when CRITICAL or HIGH vulnerabilities are found |
| [pr-checks-actions](#pr-checks-actions) | 🔍 CI & Validation | Lints GitHub Actions workflow syntax with actionlint and scans for hardcoded credentials with Trivy |
| [PR Checks - Docker Build](#pr-checks---docker-build) | 🚀 Build & Deploy | Validates that a Dockerfile builds successfully on PRs, with optional GitHub App token minting for private dependency access |
| [PR Checks - Go](#pr-checks---go) | 🔍 CI & Validation | Runs `go vet` and `go test` on PRs, with configurable private-module authentication via a GitHub App token |
| [PR Checks - Node (npm)](#pr-checks---node-npm) | 🔍 CI & Validation | Installs npm dependencies and runs lint and tests on PRs, with token fallback for private GitHub Packages access |
| [PR Checks - Node Build (pnpm)](#pr-checks---node-build-pnpm) | 🚀 Build & Deploy | Installs pnpm dependencies and runs `pnpm build` to verify the project compiles on PRs |
| [PR Checks - Node (pnpm)](#pr-checks---node-pnpm) | 🔍 CI & Validation | Installs pnpm dependencies and runs lint and tests on PRs, with optional `--changed` filtering and vitest sharding |
| [pr-checks-renovate-config](#pr-checks-renovate-config) | 🔍 CI & Validation | Validates `renovate-config.js` against the exact Renovate version pinned in `renovate.yml` |
| [PR Checks - Terraform](#pr-checks---terraform) | 🔍 CI & Validation | Runs OpenTofu lint, tfsec security scan, and optional module tests on Terraform/OpenTofu PRs |
| [tofu-pre-release](#tofu-pre-release) | 📦 Release & Changelog | Posts a changelog preview comment on a PR using `semantic-release-github-pr` |
| [publish-package](#publish-package) | 🚀 Build & Deploy | Applies an OpenTofu publish stack at a release tag to register a nullplatform package revision, pinning the image digest |
| [publish-test-image-oci](#publish-test-image-oci) | 🚀 Build & Deploy | Builds and pushes a test-tagged Docker image from a branch or PR and optionally registers it as a nullplatform artifact revision |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | Generates or updates README files using an AI provider for changed directories or all projects in a repository |
| [register-oci-artifact](#register-oci-artifact) | 🚀 Build & Deploy | Registers an already-pushed OCI image as a nullplatform artifact revision using the `np artifact create` CLI command |
| [release-publish-oci](#release-publish-oci) | 📦 Release & Changelog | Full release pipeline: runs release-please, builds and pushes to ECR, registers the artifact, optionally publishes a package, and finalizes the GitHub Release |
| [release](#release) | 📦 Release & Changelog | Runs release-please to cut a release and optionally updates `ref=vX.Y.Z` pins in all README files |
| [shellcheck](#shellcheck) | 🔍 CI & Validation | Runs ShellCheck on explicit directories or auto-discovered shell scripts (by extension and shebang) |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Generates and injects Terraform/OpenTofu module documentation into README files using terraform-docs |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Runs `tofu init`, `tofu fmt -check`, and `tofu validate` to lint OpenTofu configurations |
| [tofu-test](#tofu-test) | 🔍 CI & Validation | Runs `tofu test` in parallel across a matrix of module paths |
| [trivy-tofu-scan](#trivy-tofu-scan) | 🔒 Security | Scans OpenTofu/Terraform configurations for CRITICAL and HIGH misconfigurations using Trivy IaC scanning |
| [update-readme-actions](#update-readme-actions) | 📚 Documentation | Regenerates the repository README to document available reusable workflows using an AI provider, then opens a PR |

---

## 🔍 CI & Validation

### branch-validation

Validates that the source branch of a pull request matches a conventional-commit prefix pattern (e.g. `feat/`, `fix/`). Release-please branches (`release-please--*`) and Dependabot branches (`dependabot/*`) are automatically skipped. Use this on the `pull_request` event to enforce branch naming conventions across your repositories.

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

### code-review-command

Handles on-demand AI review commands posted as PR comments: `@claude` (answer a question), `@claude deep` (full deep review), and `@claude fix` (generate a fix branch and PR). It enforces author association allowlists, detects bot comments, guards against fork code execution on `fix`, and delegates to caller-supplied prompt files that live on the default branch so a PR cannot alter the review criteria. Use this workflow on `issue_comment`, `pull_request_review_comment`, or `pull_request_review` events.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `qa_prompt_file` | Path in the calling repo to the prompt for answering a question | Yes | — |
| `deep_prompt_file` | Path in the calling repo to the prompt for a deep review | Yes | — |
| `fix_prompt_file` | Path in the calling repo to the prompt for generating a fix | Yes | — |
| `allowed_associations` | Comma-separated `author_association` values permitted to trigger reviews | No | `OWNER,MEMBER,COLLABORATOR` |
| `ignored_commands` | Comma-separated `@claude <word>` commands handled by another workflow | No | `''` |
| `qa_model` | Full model ID for the Q&A tier | No | `claude-sonnet-5-5` |
| `qa_max_turns` | Turn budget for Q&A | No | `10` |
| `qa_max_budget_usd` | Spend cap for Q&A, in USD | No | `2.00` |
| `qa_allowed_tools` | Tools the Q&A model may use | No | `Bash(gh pr diff:*),Bash(gh pr view:*),Edit(/.claude-qa-answer.md)` |
| `deep_model` | Full model ID for the deep review tier | No | `claude-opus-5-5` |
| `deep_max_turns` | Turn budget for deep review | No | `30` |
| `deep_max_budget_usd` | Spend cap for deep review, in USD | No | `5.00` |
| `deep_allowed_tools` | Tools the deep review model may use | No | `Bash(gh pr diff:*),Bash(gh pr view:*),Edit(/.claude-deep-review-body.md)` |
| `fix_model` | Full model ID for the fix tier | No | `claude-opus-5-5` |
| `fix_max_turns` | Turn budget for fix generation | No | `25` |
| `fix_max_budget_usd` | Spend cap for fix generation, in USD | No | `5.00` |
| `fix_allowed_tools` | Tools the fix model may use | No | `Bash(gh pr comment:*),Bash(gh pr diff:*),Bash(gh pr view:*),Bash(gh pr create:*),Bash(git:*),Write,Edit,Read,Glob,Grep` |
| `fix_install_command` | Optional command run before the fixer starts (e.g. `pnpm install`) | No | `''` |
| `allow_fork_fix` | Permit `@claude fix` on fork PRs | No | `false` |
| `node_version_file` | File naming the Node version | No | `.node-version` |
| `scripts_ref` | Override ref for shared scripts | No | `''` |

**Secrets required**

- `claude_code_oauth_token` — OAuth token for claude-code-action

**Usage**

```yaml
jobs:
  review-command:
    uses: nullplatform/actions-nullplatform/.github/workflows/code-review-command.yml@main
    with:
      qa_prompt_file: .github/review/prompts/qa.md
      deep_prompt_file: .github/review/prompts/deep.md
      fix_prompt_file: .github/review/prompts/fix.md
      allowed_associations: 'OWNER,MEMBER,COLLABORATOR'
    secrets:
      claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
```

---

### code-review

Runs a single automated Claude AI review pass on every PR push. The workflow handles the mechanism—running the action, detecting whether the model produced an answer, posting or updating exactly one review comment, publishing an outcome check run, and optifying the PR author. The calling repo supplies the prompt and any classification context. A newer push cancels an in-flight review so stale results never overwrite a newer commit's review.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `prompt_file` | Path in the calling repo to the prompt the reviewer must follow | Yes | — |
| `prompt_context` | Context prepended to the prompt, as `KEY: value` lines | Yes | — |
| `model` | Full model ID for the review pass | No | `claude-sonnet-5-5` |
| `max_turns` | Turn budget | No | `25` |
| `max_budget_usd` | Spend cap per run, in USD | No | `1.00` |
| `allowed_tools` | Tools the reviewer may use | No | `Bash(gh pr diff:*),Bash(gh pr view:*),Edit(/.claude-review-body.md)` |
| `allowed_bots` | Comma-separated bot actors whose pushes still get a review | No | `''` |
| `comment_marker` | HTML marker identifying this workflow's review comment | No | `<!-- claude-auto-review -->` |
| `timeout_minutes` | Hard cap on the review job | No | `12` |
| `node_version_file` | File naming the Node version | No | `.node-version` |
| `scripts_ref` | Override ref for shared scripts | No | `''` |

**Secrets required**

- `claude_code_oauth_token` — OAuth token for claude-code-action

**Usage**

```yaml
jobs:
  auto-review:
    uses: nullplatform/actions-nullplatform/.github/workflows/code-review.yml@main
    with:
      prompt_file: .github/review/prompts/auto-review.md
      prompt_context: |
        RISK: medium
        AREAS: backend,api
    secrets:
      claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
```

---

### conventional-commit

Validates all commits in a pull request against the Conventional Commits specification using commitlint. Enforces the standard type list (`feat`, `fix`, `docs`, etc.) and prevents upper-case subjects, while relaxing body and footer line-length limits to accommodate Dependabot and Renovate commit messages.

**Usage**

```yaml
jobs:
  commit-lint:
    uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

---

### branch-validation

*(See above under CI & Validation)*

---

### pr-checks-actions

Validates GitHub Actions workflow files in a repository using two checks: `actionlint` for syntax correctness and Trivy secret scanning to detect accidentally committed credentials. Run this on pull requests that modify workflow files. Known false positives for `create-github-app-token` and `job.workflow_sha` are suppressed.

**Usage**

```yaml
# This workflow triggers on pull_request directly and is not reusable via workflow_call.
# Reference the source for self-hosted or forked use.
```

> **Note:** `pr-checks-actions` triggers on `pull_request` only, not `workflow_call`. It is not a reusable workflow and cannot be called with `uses:`.

---

### PR Checks - Go

Runs `go vet ./...` and `go test ./...` on pull requests. Supports optional private module authentication by minting a short-lived GitHub App installation token and configuring `GOPRIVATE`, so private modules bypass the public proxy. Use `require-private-modules: true` to fail fast with a clear error when no credential is configured.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `working-directory` | Working directory for go commands | No | `.` |
| `go-version` | Go version (overrides `go.mod` if set) | No | `''` |
| `

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
| package_stack_dir | OpenTofu stack that publishes the package; empty = no package publishing | No | '' |
| package_tools | Extra tools the package stack needs (`gomplate`, `np`) | No | '' |

**Secrets**
- `aws_role_arn` (required): AWS IAM Role ARN for OIDC auth against ECR
- `artifact_np_api_key`: nullplatform API key (required while `register_artifact` is true)
- `package_np_api_key`: publisher organization API key (required with `package_stack_dir`)
- `package_state_role_arn`: AWS IAM role ARN for the package stack's state bucket (required with `package_stack_dir`)

With `package_stack_dir`, a `publish-package` job runs after the artifact is registered: see [publish-package](#publish-package).

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

### publish-package

Publishes a nullplatform package revision for a release. It checks out the release tag and applies the caller's OpenTofu **publish stack** with the image digest the same release pushed, so the revision pins exactly that tag's specs and image. `release-publish-oci` calls it after registering the artifact when `package_stack_dir` is set. Other repos can call it like any reusable workflow.

The stack, in the caller repository, decides **what** is published: specs, artifacts, and visibility (`organization=*` for a package every organization can install). This workflow decides **how**: the tag checkout, the state backend, the tools and the credentials. The contract is four variables, passed as `TF_VAR_*`. A stack declares the ones it uses; undeclared ones are ignored.

| Variable | Value |
|---|---|
| `publisher_nrn` | `NP_ARTIFACT_NRN`, the organization that owns the package |
| `release_tag` | The release tag (`vX.Y.Z`). The stack should refuse to publish when its own version does not match it |
| `image_digest` | Digest of the released image (`sha256:<64 hex>`) |
| `np_api_key` | The publisher key, for stacks that run `np` in a local-exec |

The provider gets the same key from `NULLPLATFORM_API_KEY`. Only the apply step sees it.

A published revision is immutable. Re-running a release whose image was rebuilt (a new digest for the same version) fails at the apply instead of re-pointing the version.

**Inputs**

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| stack_dir | Path of the OpenTofu publish stack in the caller repository | Yes | - |
| tag | Release tag to publish; the stack is applied from its commit | Yes | - |
| image_digest | Digest of the image the release pushed | Yes | - |
| state_key | S3 key of the stack state | No | `<repository>/<stack_dir>.tfstate` |
| tools | Extra tools the stack needs, space or comma separated: `gomplate`, `np` | No | '' |
| tofu_version | OpenTofu version | No | 1.13.1 |
| gomplate_version | gomplate version (checksum verified) | No | v5.0.0 |
| np_cli_version | np CLI version | No | 2.10.0 |

**Secrets**
- `np_api_key` (required): API key of the publisher organization, allowed to write the specs and packages the stack publishes
- `state_role_arn` (required): AWS IAM role ARN, assumed with OIDC, with access to the state bucket

Reads the `NP_ARTIFACT_NRN`, `PACKAGE_TFSTATE_BUCKET` and `PACKAGE_TFSTATE_REGION` repository/organization variables, and fails when any of them is empty. It requires the caller to grant `contents: read` and `id-token: write`. State is one S3 object per repository and stack, with native locking (`use_lockfile`).

**Usage** (through `release-publish-oci`)

```yaml
jobs:
  release:
    uses: nullplatform/actions-nullplatform/.github/workflows/release-publish-oci.yml@v1
    with:
      image_name: services/s3
      existing_tag: ${{ inputs.existing_tag || '' }}
      package_stack_dir: aws-s3-bucket/publish
    secrets:
      aws_role_arn: ${{ secrets.AWS_ROLE_ARN_ECR_PUSH }}
      artifact_np_api_key: ${{ secrets.ARTIFACT_NP_API_KEY }}
      # The publisher key that registers the artifact also works here, as long
      # as it may write specs and packages.
      package_np_api_key: ${{ secrets.ARTIFACT_NP_API_KEY }}
      package_state_role_arn: ${{ secrets.AWS_ROLE_ARN_PACKAGE_STATE }}
```

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
