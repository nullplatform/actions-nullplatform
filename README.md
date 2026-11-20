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

# Nullplatform Actions — Reusable Workflows

## Summary

| Workflow | Category | Description |
|---|---|---|
| [auto-merge-release-pr](#auto-merge-release-pr) | 📦 Release & Changelog | Automatically merges a release-please PR once all checks pass, using a GitHub App token to trigger downstream workflows |
| [bot-prs-digest](#bot-prs-digest) | 🔍 CI & Validation | Posts a biweekly Slack digest of open bot PRs (Dependabot, Renovate, release-please) across image repos, plus release conformance and failed release checks |
| [branch-validation](#branch-validation) | 🔍 CI & Validation | Validates PR branch names against a conventional commit type pattern, skipping release-please and Dependabot branches |
| [build-preview-comment](#build-preview-comment) | 🚀 Build & Deploy | Comments a Nullplatform build ID, asset URL, and import-map override preview link on the PR that triggered the build |
| [Changelog and Release](#changelog-and-release) | 📦 Release & Changelog | Generates a conventional-commit changelog, bumps the version, and creates a GitHub Release for helm-charts, npm, or generic projects |
| [ci-command](#ci-command) | 🔍 CI & Validation | Dispatches a build workflow on the PR branch when an authorized member comments `/ci` on a pull request |
| [code-review-command](#code-review-command) | 📚 Documentation | Handles on-demand Claude AI review tiers (`@claude`, `@claude deep`, `@claude fix`) triggered by PR comments, routing each to its appropriate model and prompt |
| [code-review](#code-review) | 📚 Documentation | Runs an automated Claude AI review pass on every PR, posting a single sticky comment with findings and an optional escalation signal |
| [conventional-commit](#conventional-commit) | 🔍 CI & Validation | Validates all commits in a PR against the Conventional Commits specification using commitlint |
| [Docker Build and Push to ECR](#docker-build-push-to-ecr) | 🚀 Build & Deploy | Builds a multi-platform Docker image and pushes it to Amazon ECR Public, with optional native-runner builds and automatic `latest` tag management |
| [Docker Build and Push to ECR (NP)](#docker-build-and-push-to-ecr-np) | 🚀 Build & Deploy | Builds and pushes a Docker image to ECR using the Nullplatform CLI (`np build start/update`) and a Makefile-based build |
| [Docker Security Scan](#docker-security-scan) | 🔒 Security | Builds a Docker image locally and scans it with Trivy, uploading SARIF results to the GitHub Security tab |
| [ECR Security Scan](#ecr-security-scan) | 🔒 Security | Pulls the latest published version of each named ECR image and scans it with Trivy, sending a Slack alert when CRITICAL or HIGH vulnerabilities are found |
| [pr-checks-actions](#pr-checks-actions) | 🔍 CI & Validation | Validates GitHub Actions workflow syntax with actionlint and scans for hardcoded credentials with Trivy |
| [PR Checks - Docker Build](#pr-checks---docker-build) | 🔍 CI & Validation | Builds a Docker image on PRs to verify the Dockerfile is valid, with optional GitHub App token for private dependency access |
| [PR Checks - Go](#pr-checks---go) | 🔍 CI & Validation | Runs `go vet` and `go test` on PRs, with optional GitHub App token and GOPRIVATE configuration for private module access |
| [PR Checks - Node (npm)](#pr-checks---node-npm) | 🔍 CI & Validation | Runs lint and tests for npm-based Node.js projects on PRs |
| [PR Checks - Node Build (pnpm)](#pr-checks---node-build-pnpm) | 🔍 CI & Validation | Runs `pnpm install` and `pnpm build` to verify a pnpm project builds successfully on PRs |
| [PR Checks - Node (pnpm)](#pr-checks---node-pnpm) | 🔍 CI & Validation | Runs lint and tests for pnpm-based Node.js projects on PRs, with optional changed-file filtering and test sharding |
| [pr-checks-renovate-config](#pr-checks-renovate-config) | 🔍 CI & Validation | Validates `renovate-config.js` using the exact Renovate version pinned in the caller's `renovate.yml` |
| [PR Checks - Terraform](#pr-checks---terraform) | 🔍 CI & Validation | Runs OpenTofu lint, tfsec security scan, and optional module tests on PRs containing Terraform changes |
| [tofu-pre-release](#tofu-pre-release) | 📦 Release & Changelog | Posts a changelog preview comment on the PR using `semantic-release-github-pr` |
| [publish-package](#publish-package) | 🚀 Build & Deploy | Applies an OpenTofu publish stack at a release tag to register a Nullplatform package revision, pinning the released image digest |
| [publish-test-image-oci](#publish-test-image-oci) | 🚀 Build & Deploy | Builds and registers a test OCI image from a branch or PR with a `test-<slug>-<sha>` tag, for pre-release validation in test scopes |
| [readme-ai-generator-v2](#readme-ai-generator-v2) | 📚 Documentation | Generates or updates README files using an AI provider (Groq, GitHub, OpenAI, or Anthropic) for changed or all project directories |
| [register-oci-artifact](#register-oci-artifact) | 🚀 Build & Deploy | Registers an already-pushed OCI image as a Nullplatform artifact revision using the `np artifact create` CLI command |
| [release-publish-oci](#release-publish-oci) | 📦 Release & Changelog | Full release pipeline: runs release-please, builds and pushes the Docker image to ECR, registers the artifact, optionally publishes a package, and finalizes the GitHub Release |
| [release](#release) | 📦 Release & Changelog | Runs release-please to cut a release and optionally updates `?ref=vX.Y.Z` README references on the release PR |
| [shellcheck](#shellcheck) | 🔍 CI & Validation | Runs ShellCheck on shell scripts, auto-discovering `.sh` files and extensionless files with a shell shebang |
| [tofu-docs](#tofu-docs) | 📚 Documentation | Generates and injects Terraform/OpenTofu module documentation into README files using terraform-docs |
| [tofu-lint](#tofu-lint) | 🔍 CI & Validation | Runs `tofu init`, `tofu fmt -check`, and `tofu validate` to lint OpenTofu/Terraform configurations |
| [tofu-test](#tofu-test) | 🔍 CI & Validation | Runs `tofu test` in parallel across a matrix of module paths |
| [trivy-tofu-scan](#trivy-tofu-scan) | 🔒 Security | Scans OpenTofu/Terraform configurations with Trivy IaC rules, uploading SARIF results to the GitHub Security tab |
| [update-readme-actions](#update-readme-actions) | 📚 Documentation | Regenerates the repository README with AI-generated documentation of available workflows whenever workflow files change on `main` |

---

## 🔍 CI & Validation

### auto-merge-release-pr

Automatically merges a release-please pull request once all required checks pass. It resolves the release PR by label and author (supporting both `workflow_run` and `pull_request` triggers), waits for every check except its own to turn green, then merges using a GitHub App token so the resulting push triggers downstream tag-based workflows that `GITHUB_TOKEN` pushes cannot. Designed to be called from `on: workflow_run` targeting your release workflow.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `release_pr_label` | Label release-please sets on its release PR | No | `autorelease: pending` |
| `release_pr_author` | Comma-separated author logins accepted for the release PR | No | `github-actions[bot],release-application[bot]` |
| `merge_method` | Merge method: `merge`, `squash`, or `rebase` | No | `merge` |
| `pr_number` | Force a specific PR number to merge (0 = auto-resolve) | No | `0` |

**Secrets required**

- `app-id` — GitHub App ID used to mint a token
- `app-private-key` — GitHub App private key

**Usage**

```yaml
jobs:
  automerge:
    uses: nullplatform/actions-nullplatform/.github/workflows/auto-merge-release.yml@main
    secrets:
      app-id: ${{ secrets.APP_RELEASE_ID }}
      app-private-key: ${{ secrets.APP_RELEASE_PRIVATE_KEY }}
```

---

### bot-prs-digest

Posts a Slack digest listing every open bot PR (Dependabot, Renovate, release-please) across image repos in the organization, PRs merged or closed since the last digest, repos missing the standard auto-release setup, and release workflows currently failing on `main`. Runs on the 2nd and 16th of each month, 90 minutes after Renovate's scheduled run, and is silent when there is nothing to report.

> **Note:** This workflow is an internal scheduled digest rather than a general-purpose reusable workflow. It is not designed for external callers.

---

### branch-validation

Validates that a PR's branch name matches a conventional type/description pattern (e.g. `feat/add-login`, `fix/bug-123`). Automatically passes release-please branches (`release-please--*`) and Dependabot branches (`dependabot/*`) without validation.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `pattern` | Regex pattern for branch name validation | No | `^(feat\|feature\|fix\|docs\|style\|refactor\|perf\|test\|build\|ci\|chore\|revert)/.+$` |

**Usage**

```yaml
jobs:
  validate-branch:
    uses: nullplatform/actions-nullplatform/.github/workflows/branch-validation.yml@main
```

---

### build-preview-comment

Posts a sticky comment on the PR that triggered a frontend build, containing the Nullplatform build ID, the asset HTTPS URL, the commit, and a preview link that opens the app with the build loaded via import-map override. Updates the existing comment in place on each new build. Skips builds on `main` and `stage` (or other configured skip-branches) and branches with no open PR.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `build-id` | Nullplatform build ID from `github-action-setup-ci` | Yes | — |
| `application-id` | Nullplatform application ID | Yes | — |
| `asset-file` | Entry JS file of the module relative to the build folder | Yes | — |
| `import-map-key` | Import-map key the host loads the module under | Yes | — |
| `preview-base-url` | App URL that serves build folders and honours `?imo=` | No | `https://kwik-e-mart.app.nullplatform.io` |
| `skip-branches` | Comma-separated branches whose builds are not commented | No | `main,stage` |

**Usage**

```yaml
jobs:
  preview:
    needs: build
    uses: nullplatform/actions-nullplatform/.github/workflows/build-preview-comment.yml@main
    with:
      build-id: ${{ needs.build.outputs.build-id }}
      application-id: ${{ needs.build.outputs.application-id }}
      asset-file: nullplatform-my-module.js
      import-map-key: '@nullplatform/my-module'
    permissions:
      pull-requests: write
```

---

### ci-command

Triggers a specified build workflow on the PR branch when an authorized collaborator comments `/ci` on a pull request. Reacts to the comment with 👀, dispatches the workflow via `gh workflow run --ref`, and posts a follow-up comment with a link to the running workflow. Refuses dispatch from fork PRs and reports failures as a PR comment.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `workflow` | Build workflow filename in the calling repo (e.g. `ci.yml`); must have `workflow_dispatch` | Yes | — |
| `allowed_associations` | Comma-separated `author_association` values permitted to run `/ci` | No | `OWNER,MEMBER,COLLABORATOR` |

**Usage**

```yaml
# In the frontend repo: .github/workflows/ci-command.yml
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

### conventional-commit

Validates all commits in a pull request against the Conventional Commits specification using `commitlint` with `@commitlint/config-conventional`. Accepts the extended type list (`feat`, `feature`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`) and disables line-length limits on body and footer to accommodate Dependabot and Renovate commit messages.

**Usage**

```yaml
jobs:
  conventional-commit:
    uses: nullplatform/actions-nullplatform/.github/workflows/conventional-commit.yml@main
```

---

### pr-checks-actions

Validates all GitHub Actions workflow files in the repository with `actionlint` and scans the codebase for hardcoded credentials and secrets with Trivy. Triggered directly on `pull_request` events — not a reusable workflow.

---

### PR Checks - Docker Build

Builds a Docker image on PRs to verify the Dockerfile is syntactically and logically valid, without pushing the result. Optionally mints a short-lived GitHub App installation token for builds that need access to private source repositories.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `context` | Docker build context path | No | `.` |
| `dockerfile` | Path to the Dockerfile | No | `Dockerfile` |
| `use-app-token` | Mint a GitHub App token (`CI_APP_ID`) for private source access | No | `false` |
| `use_buildkit_secret` | Pass `GITHUB_TOKEN` as a BuildKit `--secret` instead of `--build-arg` | No | `false` |

**Usage**

```yaml
jobs:
  docker-check:
    uses: nullplatform/actions-nullplatform/.github/workflows/pr-checks-docker.yml@main
    with:
      context: .
      dockerfile: Dockerfile
```

---

### PR Checks - Go

Runs `go vet ./...` and `go test ./...` on pull requests. Configures `GOPRIVATE` and a git credential helper for private module access, with an optional GitHub App token (`CI_APP_ID`) or PAT fallback. Set `require-private-modules: true` to fail fast with a clear message when no credential is available.

**Inputs**

| Name | Description | Required | Default |
|---|---|---|---|
| `working-directory` | Working directory for go commands | No | `.` |
| `go-version` | Go version override (uses `go.mod` if unset) | No | `''` |
| `go-private` | `GOPRIVATE` glob for private modules | No | `github.com/nullplatform/*` |
| `use-app-token` |

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
| native_runners | Build each platform on a runner of its own architecture instead of emulating it with QEMU (linux/amd64 and linux/arm64 only). For images that compile code | No | false |
| ecr_registry | ECR registry URL prefix | No | public.ecr.aws/nullplatform |
| aws_region | AWS region for ECR | No | us-east-1 |
| build_args | Docker build arguments (newline-separated) | No | '' |
| also_tag_latest | Also tag and push the image as latest, only when the tag is a stable release and the highest version published | No | true |
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
- `app-id` / `app-private-key`: GitHub App that opens the release PR. Without them the PR is opened by `github-actions[bot]` and its checks are held for approval

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
| native_runners | Build each platform on a runner of its own architecture instead of emulating it with QEMU (linux/amd64 and linux/arm64 only). For images that compile code | No | false |
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
