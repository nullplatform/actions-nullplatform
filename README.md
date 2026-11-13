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
| [auto-merge-release-pr](#auto-merge-release-pr) | 📦 Release & Changelog | Waits for all checks to pass on a release-please PR, then merges it using a GitHub App token to trigger downstream workflows |
| [bot-prs-digest](#bot-prs-digest) | 📦 Release & Changelog | Posts a biweekly Slack digest of open bot PRs (Dependabot, Renovate, release-please), conformance failures, and broken releases across image repos |
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Validates PR branch names against a conventional prefix pattern, skipping release-please and Dependabot branches |
| [build-preview-comment](#build-preview-comment) | 🚀 Build & Deploy | Posts or updates a sticky PR comment with a Nullplatform build ID, asset URL, and import-map override preview link |
| [Changelog and Release](#changelog-and-release) | 📦 Release & Changelog | Generates a conventional changelog, bumps the version file, creates git tags, and optionally publishes a GitHub Release for npm, Helm chart, or generic projects |
| [ci-command](#ci-command) | 🔍 CI & Validation | Dispatches a build workflow on the PR branch when a repository member comments `/ci` on a pull request |
| [code-review-command](#code-review-command) | 🔍 CI & Validation | Handles `@claude`, `@claude deep`, and `@claude fix` commands in PR comments, routing each to the appropriate Claude-powered review or fix tier |
| [code-review](#code-review) | 🔍 CI & Validation | Runs an automated Claude review pass on every PR, posts a sticky comment with the result, publishes an outcome check, and signals when escalation is requested |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Validates all commits in a PR against the Conventional Commits specification using commitlint |
| [Docker Build and Push to ECR](#docker-build-and-push-to-ecr) | 🚀 Build & Deploy | Builds a multi-arch Docker image and pushes it to Amazon ECR Public, optionally promoting the `latest` tag only when the version is the highest stable release |
| [Docker Build and Push to ECR (Nullplatform)](#docker-build-and-push-to-ecr-nullplatform) | 🚀 Build & Deploy | Builds and pushes a Docker image using the Nullplatform CLI (`np build start/update`) and a Makefile-driven build/push flow |
| [Docker Security Scan](#docker-security-scan) | 🔒 Security | Builds the Docker image locally and scans it with Trivy for CRITICAL/HIGH CVEs, optionally uploading SARIF results to the GitHub Security tab |
| [ECR Security Scan](#ecr-security-scan) | 🔒 Security | Pulls the latest stable tag of each named ECR image and scans for vulnerabilities with Trivy, sending a Slack alert when findings exist |
| [PR Checks - Docker Build](#pr-checks---docker-build) | 🔍 CI & Validation | Builds the Docker image on every PR to verify the Dockerfile is valid, with optional GitHub App token for private dependency access |
| [PR Checks - Go](#pr-checks---go) | 🔍 CI & Validation | Runs `go vet` and `go test` on a Go module, with optional GitHub App token for private module access via GOPRIVATE |
| [PR Checks - Node (npm)](#pr-checks---node-npm) | 🔍 CI & Validation | Installs npm dependencies and runs lint and tests for a Node.js project using npm |
| [PR Checks - Node Build (pnpm)](#pr-checks---node-build-pnpm) | 🔍 CI & Validation | Installs pnpm dependencies and runs `pnpm build` to verify the project compiles cleanly |
| [PR Checks - Node (pnpm)](#pr-checks---node-pnpm) | 🔍 CI & Validation | Installs pnpm dependencies and runs lint and tests, with optional `--changed` filtering and vitest sharding for large suites |
| [tofu-pre-release](#tofu-pre-release) | 📦 Release & Changelog | Posts a changelog preview comment on a PR using `semantic-release-github-pr` to show what the next release would contain |
| [publish-package](#publish-package) | 🚀 Build & Deploy | Applies an OpenTofu publish stack at the release tag to register a nullplatform package revision, wiring the image digest and release tag as Terraform variables |
| [publish-test-image-oci](#publish-test-image-oci) | 🚀 Build & Deploy | Builds and pushes a test-tagged Docker image from a branch or PR, then registers it as a nullplatform artifact revision for pre-release validation |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | Generates or updates README files for changed directories using an AI provider (Groq, OpenAI, Anthropic, or GitHub Models), then commits the result |
| [register-oci-artifact](#register-oci-artifact) | 🚀 Build & Deploy | Registers an already-pushed OCI image as a nullplatform artifact revision using the `np artifact create` CLI command |
| [release-publish-oci](#release-publish-oci) | 📦 Release & Changelog | Full release pipeline: runs release-please, builds and pushes the Docker image to ECR, registers the nullplatform artifact, optionally publishes a package, and finalizes the GitHub Release with artifact metadata |
| [release](#release) | 📦 Release & Changelog | Runs release-please and optionally updates `?ref=vX.Y.Z` pins in README files after a release is created |
| [shellcheck](#shellcheck) | 🔍 CI & Validation | Runs ShellCheck on shell scripts, auto-discovering `.sh` files and extensionless files with a shell shebang when no paths are specified |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Generates and injects Terraform/OpenTofu module documentation into README files using terraform-docs |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Runs `tofu init`, `tofu fmt -check`, and `tofu validate` to lint and validate OpenTofu/Terraform configurations |
| [tofu-test](#tofu-test) | 📦 Release & Changelog | Runs `tofu test` in parallel across a matrix of module paths using a specified OpenTofu version |
| [trivy-tofu-scan](#trivy-tofu-scan) | 🔒 Security | Scans OpenTofu/Terraform configuration files with Trivy for CRITICAL/HIGH misconfigurations, optionally uploading SARIF results |
| [PR Checks - Terraform](#pr-checks---terraform) | 🔍 CI & Validation | Orchestrates Terraform/OpenTofu PR checks: lint/validate, tfsec security scan, and optional module tests |

---

## 🔍 CI & Validation

### branch-validation

Validates PR branch names against a configurable regex pattern. Branches from release-please (`release-please--*`) and Dependabot (`dependabot/*`) are automatically exempted. Use this as a lightweight gate on pull requests to enforce naming conventions like `feat/`, `fix/`, `chore/`, etc.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `pattern` | Regex pattern for branch name validation | No | `^(feat\|feature\|fix\|docs\|style\|refactor\|perf\|test\|build\|ci\|chore\|revert)/.+$` |

**Usage**

```yaml
jobs:
  branch-check:
    uses: nullplatform/actions-nullplatform/.github/workflows/branch-validation.yml@main
    with:
      pattern: '^(feat|fix|chore|docs)/.+$'
```

---

### conventional-commit

Validates every commit in a pull request against the Conventional Commits specification using `commitlint`. Accepts the standard type enum (`feat`, `fix`, `chore`, etc.) and relaxes body/footer line-length limits so Dependabot and Renovate commit messages do not fail. Use this on pull request triggers to prevent non-conformant commits from reaching the default branch.

**Usage**

```yaml
jobs:
  commit-check:
    uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

---

### ci-command

Dispatches a named build workflow on the PR branch when a repository member with an allowed `author_association` comments `/ci` on a pull request. The command is ignored for bots and unauthorized commenters. The dispatched workflow must already have a `workflow_dispatch` trigger on the branch. Use this to trigger on-demand builds for branches that are not normally built on push.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `workflow` | Workflow filename in the calling repo to dispatch (e.g. `ci.yml`) | Yes | — |
| `allowed_associations` | Comma-separated `author_association` values permitted to run `/ci` | No | `OWNER,MEMBER,COLLABORATOR` |

**Usage**

```yaml
name: CI Build Command (/ci)
on:
  issue_comment:
    types: [created]
jobs:
  ci:
    uses: nullplatform/actions-nullplatform/.github/workflows/ci-command.yml@main
    with:
      workflow: ci.yml
    permissions:
      contents: read
      pull-requests: write
      actions: write
```

---

### code-review

Runs an automated Claude review pass on every pull request. It posts or updates a single sticky comment with the review body, publishes an `Auto Review outcome` check, notifies the PR author, and exposes an `escalate` output the caller can use to trigger a deeper review. A spend limit or rate-limit produces an informational comment rather than a red check. Use this as the tier-1 automated review in any repository that ships a prompt file.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `prompt_file` | Path in the calling repo to the prompt the reviewer must follow | Yes | — |
| `prompt_context` | `KEY: value` lines prepended to the prompt, built by the caller | Yes | — |
| `model` | Full model ID for the review pass | No | `claude-sonnet-5-5` |
| `max_turns` | Turn budget per run | No | `25` |
| `max_budget_usd` | Spend cap per run in USD | No | `1.00` |
| `allowed_tools` | Tools the reviewer may use | No | `Bash(gh pr diff:*),Bash(gh pr view:*),Edit(/.claude-review-body.md)` |
| `allowed_bots` | Comma-separated bot actors whose pushes still receive a review | No | `''` |
| `comment_marker` | HTML marker identifying this workflow's review comment | No | `<!-- claude-auto-review -->` |
| `timeout_minutes` | Hard cap on the review job | No | `12` |
| `node_version_file` | File naming the Node version for the CI-status summary | No | `.node-version` |
| `scripts_ref` | Override the ref shared scripts are taken from | No | `''` |

**Secrets required**

- `claude_code_oauth_token` — OAuth token for `claude-code-action`

**Usage**

```yaml
jobs:
  review:
    uses: nullplatform/actions-nullplatform/.github/workflows/code-review.yml@main
    with:
      prompt_file: .github/review/prompts/auto-review.md
      prompt_context: |
        RISK: low
        AREAS: backend
      model: claude-sonnet-5-5
      max_budget_usd: '1.00'
    secrets:
      claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
```

---

### code-review-command

Handles `@claude`, `@claude deep`, and `@claude fix` commands posted in PR comments or reviews. It detects which tier was requested, verifies the commenter is authorized, and routes to the appropriate Claude-powered job. The `fix` tier checks out PR code, optionally installs dependencies, generates a fix branch, and opens a PR. The calling repo supplies only the prompt files; all gating and dispatch logic lives here. Use this as the single caller for all three on-demand review tiers.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `qa_prompt_file` | Path in the calling repo to the Q&A prompt | Yes | — |
| `deep_prompt_file` | Path in the calling repo to the deep review prompt | Yes | — |
| `fix_prompt_file` | Path in the calling repo to the fix prompt | Yes | — |
| `allowed_associations` | Comma-separated `author_association` values permitted to request a review | No | `OWNER,MEMBER,COLLABORATOR` |
| `ignored_commands` | Comma-separated `@claude <word>` commands handled by another workflow | No | `''` |
| `qa_model` | Full model ID for the Q&A tier | No | `claude-sonnet-5-5` |
| `qa_max_turns` | Turn budget for the Q&A tier | No | `10` |
| `qa_max_budget_usd` | Spend cap for the Q&A tier | No | `2.00` |
| `qa_allowed_tools` | Tools the Q&A tier may use | No | `Bash(gh pr diff:*),Bash(gh pr view:*),Edit(/.claude-qa-answer.md)` |
| `deep_model` | Full model ID for the deep review tier | No | `claude-opus-5-5` |
| `deep_max_turns` | Turn budget for the deep tier | No | `30` |
| `deep_max_budget_usd` | Spend cap for the deep tier | No | `5.00` |
| `deep_allowed_tools` | Tools the deep tier may use | No | `Bash(gh pr diff:*),Bash(gh pr view:*),Edit(/.claude-deep-review-body.md)` |
| `fix_model` | Full model ID for the fix tier | No | `claude-opus-5-5` |
| `fix_max_turns` | Turn budget for the fix tier | No | `25` |
| `fix_max_budget_usd` | Spend cap for the fix tier | No | `5.00` |
| `fix_allowed_tools` | Tools the fix tier may use | No | `Bash(gh pr comment:*),Bash(gh pr diff:*),Bash(gh pr view:*),Bash(gh pr create:*),Bash(git:*),Write,Edit,Read,Glob,Grep` |
| `fix_install_command` | Command run before the fixer starts (opt-in; executes PR package scripts) | No | `''` |
| `allow_fork_fix` | Permit `@claude fix` on a fork PR | No | `false` |
| `node_version_file` | Node version file | No | `.node-version` |
| `scripts_ref` | Override the ref shared scripts are taken from | No | `''` |

**Secrets required**

- `claude_code_oauth_token` — OAuth token for `claude-code-action`

**Usage**

```yaml
name: Code Review Commands
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  pull_request_review:
    types: [submitted]
jobs:
  review-command:
    uses: nullplatform/actions-nullplatform/.github/workflows/code-review-command.yml@main
    with:
      qa_prompt_file: .

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
| submodules | Check out git submodules before building | No | false |
| platforms | Target platforms for the multi-arch build | No | linux/amd64,linux/arm64 |
| ecr_registry | ECR registry URL prefix | No | public.ecr.aws/nullplatform |
| aws_region | AWS region for ECR | No | us-east-1 |
| build_args | Docker build arguments (newline-separated) | No | '' |
| also_tag_latest | Also tag and push the image as latest, only when the tag is a stable release and the highest version published | No | false |
| release-type | Release Please release type | No | simple |
| update_readme_versions | Move this repository's own `?ref=vX.Y.Z` references in READMEs to the new tag (refs to other repositories are left alone) | No | false |
| existing_tag | Skip release-please; publish + finalize this existing tag | No | '' |
| register_artifact | Register the image as a nullplatform oci_image artifact | No | true |
| artifact_visible_to | Visibility selector for the registered artifact | No | organization=* |
| np_cli_version | np CLI version/channel for artifact registration | No | alpha-packages |
| package_stack_dir | OpenTofu stack that publishes the package; empty = no package publishing. The job runs only once `package_state_bucket` is set, and is skipped until then | No | '' |
| package_tools | Extra tools the package stack needs (`gomplate`, `np`) | No | '' |

**Secrets**
- `aws_role_arn` (required): AWS IAM Role ARN for OIDC auth against ECR
- `artifact_np_api_key`: nullplatform API key (required while `register_artifact` is true)
- `package_np_api_key`: publisher organization API key (required with `package_stack_dir`)
- `package_state_aws_account_id`: AWS account of the repository's state role, `github-actions-<repository>-package-state` (with `package_stack_dir`, unless `package_state_role_arn` is set)
- `package_state_role_arn`: AWS IAM role ARN for the package stack's state bucket, for a role that does not follow the convention; it wins over the account
- `package_state_bucket`: S3 bucket for the package stack states (required with `package_stack_dir`)
- `package_state_region`: region of that bucket (required with `package_stack_dir`)

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
- `state_aws_account_id`: AWS account of the state role. The role is derived from the repository name, `github-actions-<repository>-package-state`
- `state_role_arn`: AWS IAM role ARN, assumed with OIDC, for a role that does not follow the convention. It wins over the account; one of the two is required
- `tfstate_bucket` (required): S3 bucket that keeps the stack states
- `tfstate_region` (required): region of that bucket

Each publishing repository has its own state role, which trusts only that repository's `main` branch and tags and writes only under its own key prefix, so one organization secret with the account serves every repository. The bucket and its region are secrets, not variables, on purpose: the caller repositories are public and so are their run logs, and GitHub masks only secrets. Reads the `NP_ARTIFACT_NRN` repository/organization variable, and fails when it or any secret is empty. It requires the caller to grant `contents: read` and `id-token: write`. State is one S3 object per repository and stack, with native locking (`use_lockfile`).

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
      # Organization secrets: the role is github-actions-<repository>-package-state.
      package_state_aws_account_id: ${{ secrets.PACKAGE_STATE_AWS_ACCOUNT_ID }}
      package_state_bucket: ${{ secrets.PACKAGE_TFSTATE_BUCKET }}
      package_state_region: ${{ secrets.PACKAGE_TFSTATE_REGION }}
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
