// Self-hosted Renovate config. Runs from .github/workflows/renovate.yml with the
// renovate-app-nullplatform App token: the repos it processes are exactly the ones the App is
// installed on, so the App installation is both the scope and the write boundary.
//
// Why Renovate and not the in-house resolver it replaces: that resolver hardcoded
// one download URL pattern per tool, one ARG naming convention, and a code-search
// based discovery that misses files. Each was a way for a Monday to pass with no
// PR and no one noticing. Renovate maintains the datasources, handles every
// naming variation we declare, and has been doing exactly this for years.
//
// What stays ours is the policy: which ARGs map to which upstream, and how far a
// bump may go. No tool can infer that Helm 4 is breaking or that kubectl must
// stay within one minor of the clusters.

const DOCKERFILES = ['/(^|/)Dockerfile[^/]*$/'];

// ARG <TOOL>_VERSION=<version>. The leading "v" stays outside the capture group
// so a repo that pins "v3.22.0" keeps its prefix after the bump.
const arg = (name, depName) => ({
  customType: 'regex',
  managerFilePatterns: DOCKERFILES,
  matchStrings: [`ARG ${name}_VERSION=v?(?<currentValue>[0-9][0-9.]*)`],
  depNameTemplate: depName,
  datasourceTemplate: 'github-releases',
  extractVersionTemplate: '^v?(?<version>.*)$',
});

module.exports = {
  platform: 'github',
  autodiscover: true,
  autodiscoverFilter: ['nullplatform/*'],
  onboarding: false,
  requireConfig: 'optional',
  dependencyDashboard: false,

  // Only the managers below. No npm, no go.mod, no docker FROM: those layers are
  // owned elsewhere (Dependabot / the base-image work), and this must never open
  // a PR nobody asked for.
  // No dockerfile manager: the FROM line belongs to the base-image owner, who bumps it with Dependabot
  // (package-ecosystem: docker, label base-image). Two bots on one line means two PRs for one change.
  enabledManagers: ['custom.regex', 'gomod', 'npm', 'github-actions'],
  postUpdateOptions: ['gomodTidy'],
  // Nobody watches these repos and there is no CODEOWNERS: without this a PR notifies no one.
  reviewers: ['gdrojas'],

  // The workflow cron is the scheduler; Renovate itself must not add a second gate.
  schedule: ['at any time'],
  // dryRun is driven by the RENOVATE_DRY_RUN env var set in the workflow, not here:
  // one source of truth, and it is the only form the action forwards into the container.

  // The App deliberately has no "vulnerability alerts" permission, and this run does
  // not use Dependabot alerts to decide anything. Without this Renovate warns on every repo.
  vulnerabilityAlerts: { enabled: false },
  // OSV knows the CVEs of gomod/npm deps: those updates are raised immediately and labelled as security.
  osvVulnerabilityAlerts: true,

  automerge: false,
  prConcurrentLimit: 10,
  prHourlyLimit: 0,
  labels: ['dependencies', 'security'],
  // The org's branch-validation check only accepts conventional-commit prefixes
  // (feat|fix|chore|...). A "renovate/" branch fails it before anyone reads the PR.
  // branchPrefixOld lets Renovate migrate the branch it already opened under the
  // old prefix instead of abandoning that PR and opening a duplicate.
  branchPrefix: 'fix/renovate-',
  branchPrefixOld: 'renovate/',

  // fix(deps): is what release-please needs to cut a patch and republish the image.
  semanticCommits: 'enabled',
  semanticCommitType: 'fix',
  semanticCommitScope: 'deps',

  customManagers: [
    // Renovate keeps its own version current: the action pulls ghcr.io/renovatebot/renovate:<renovate-version>.
    { customType: 'regex', managerFilePatterns: ['/^\\.github/workflows/renovate\\.ya?ml$/'],
      matchStrings: ['renovate-version:\\s*(?<currentValue>[0-9]+\\.[0-9]+\\.[0-9]+)'],
      depNameTemplate: 'ghcr.io/renovatebot/renovate', datasourceTemplate: 'docker', versioningTemplate: 'docker' },
    // np is installed from its CDN; releases on GitHub are stale, tags are current.
    { customType: 'regex', managerFilePatterns: DOCKERFILES,
      matchStrings: ['ARG NP_VERSION=v?(?<currentValue>[0-9][0-9.]*)'],
      depNameTemplate: 'nullplatform/cli', datasourceTemplate: 'github-tags', extractVersionTemplate: '^v?(?<version>.*)$' },
    // Go toolchain that compiles the CDN binaries (np, np-agent): stdlib CVEs live here.
    { customType: 'regex', managerFilePatterns: ['/^\\.github/workflows/.+\\.ya?ml$/'],
      matchStrings: ['go-version:\\s*[\'"]?(?<currentValue>1\\.[0-9.]+)[\'"]?'],
      depNameTemplate: 'go', datasourceTemplate: 'golang-version' },
    // np-nginx takes the tag of the shared base (worker-bridge) from main-config.json, not from the Dockerfile.
    { customType: 'regex', managerFilePatterns: ['/(^|/)main-config\\.json$/'],
      matchStrings: ['"base_version":\\s*"(?<currentValue>[0-9][0-9.]*)"'],
      depNameTemplate: 'public.ecr.aws/nullplatform/scopes/worker-bridge', datasourceTemplate: 'docker', versioningTemplate: 'docker' },
    // fluent-bit on the customer AMI: install.sh honours FLUENT_BIT_RELEASE_VERSION; releases are tagged vX.Y.Z.
    { customType: 'regex', managerFilePatterns: ['/(^|/)main-config\\.json$/'],
      matchStrings: ['"binary_version":\\s*"(?<currentValue>[0-9][0-9.]*)"'],
      depNameTemplate: 'fluent/fluent-bit', datasourceTemplate: 'github-releases', extractVersionTemplate: '^v?(?<version>.*)$' },
    // cloudwatch.so is copied out of aws-for-fluent-bit at this tag.
    { customType: 'regex', managerFilePatterns: ['/(^|/)main-config\\.json$/'],
      matchStrings: ['"cloudwatch_plugin_image":\\s*"(?<currentValue>[0-9][0-9.]*)"'],
      depNameTemplate: 'public.ecr.aws/aws-observability/aws-for-fluent-bit', datasourceTemplate: 'docker', versioningTemplate: 'docker' },
    arg('TOFU', 'opentofu/opentofu'),
    arg('HELM', 'helm/helm'),
    arg('KUBECTL', 'kubernetes/kubernetes'),
    {
      // A version written straight into the download URL, with no ARG. Five of
      // these exist today (performance-prometheus, traffic-kong-gateway-base-image)
      // and the ARG-only approach could not see them.
      customType: 'regex',
      managerFilePatterns: DOCKERFILES,
      matchStrings: [
        'https://github\\.com/(?<depName>[^/\\s]+/[^/\\s]+)/releases/download/v?(?<currentValue>[0-9][0-9.]*)/',
      ],
      datasourceTemplate: 'github-releases',
      extractVersionTemplate: '^v?(?<version>.*)$',
    },
  ],

  packageRules: [
    // github-actions: only in this repo for now (the renovate action SHA and the reusables' own uses:).
    { matchManagers: ['github-actions'], enabled: false },
    { matchManagers: ['github-actions'], matchRepositories: ['nullplatform/actions-nullplatform'], enabled: true, groupName: 'github actions' },
    { matchDepNames: ['ghcr.io/renovatebot/renovate', 'renovatebot/github-action'], groupName: 'renovate' },
    { matchManagers: ['gomod'], groupName: 'go modules' },
    { matchManagers: ['npm'], groupName: 'npm packages' },
    // Already covered by Dependabot there.
    { matchManagers: ['npm'], matchRepositories: ['nullplatform/platform-feature-flag'], enabled: false },
    // One PR per repo with every pin in it: scopes declares three in the same
    // Dockerfile, and three PRs against one file would conflict with each other.
    { matchManagers: ['custom.regex'], groupName: 'pinned binaries' },

    // Majors are never proposed automatically, for anything. A major is a
    // compatibility decision, not a dependency bump.
    { matchUpdateTypes: ['major'], enabled: false },

    // Ceilings measured in Sep 2026. Raising either one is a policy change.
    // Helm 4 carries breaking changes; 3.22.0 already scans clean.
    { matchDepNames: ['helm/helm'], allowedVersions: '<4' },
    // kubectl supports +-1 minor against the cluster. No version <=1.31 improves
    // on the current findings; 1.37.0 clears them but is seven minors away.
    // Moving this decides which Kubernetes version we stop supporting.
    { matchDepNames: ['kubernetes/kubernetes'], allowedVersions: '<1.32' },
  ],
};
