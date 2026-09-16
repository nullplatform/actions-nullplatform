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
  enabledManagers: ['custom.regex'],

  // The workflow cron is the scheduler; Renovate itself must not add a second gate.
  schedule: ['at any time'],
  // dryRun is driven by the RENOVATE_DRY_RUN env var set in the workflow, not here:
  // one source of truth, and it is the only form the action forwards into the container.

  // The App deliberately has no "vulnerability alerts" permission, and this run does
  // not use Dependabot alerts to decide anything. Without this Renovate warns on every repo.
  vulnerabilityAlerts: { enabled: false },

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
