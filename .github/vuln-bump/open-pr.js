#!/usr/bin/env node
// open-pr.js <plan.json>
// Applies the plan's bumps and opens one PR per repo.
//
// One PR per repo, not per pin: scopes declares three pins in the same Dockerfile
// and three PRs against the same file would conflict with each other.
//
// Idempotent: if a PR with the same branch is already open, it does not open
// another. Without this, every Monday would stack an identical PR while the
// previous one waits for review.
const { execSync, execFileSync } = require('child_process');
const fs = require('fs');

const sh = (c) => execSync(c, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).trim();
// Repo names and paths reach here from discover.js, i.e. from repo content.
// execFileSync passes argv with no shell in between.
const ghArgs = (...a) => execFileSync('gh', a, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).trim();
const api = (args) => JSON.parse(sh(`gh api ${args}`));
const b64 = (s) => Buffer.from(s, 'utf8').toString('base64');
const os = require('os'), path = require('path');
// All free text reaches the shell through a file, never inline. JSON.stringify
// does NOT escape backticks, and the markdown body is full of them: the shell
// read them as command substitution and the table cells came out empty.
const tmpfile = (content) => { const f = path.join(os.tmpdir(), `vb-${process.pid}-${Math.random().toString(36).slice(2)}`); fs.writeFileSync(f, content); return f; };

const plan = JSON.parse(fs.readFileSync(process.argv[2] || 'plan.json', 'utf8'));
const actionable = plan.filter(p => p.status === 'BUMP' || p.status === 'BUMP_PARTIAL');

const byRepo = {};
for (const p of actionable) (byRepo[p.repo] ||= []).push(p);

const results = [];
const failures = [];
for (const [repo, pins] of Object.entries(byRepo)) {
  try {
    processRepo(repo, pins);
  } catch (e) {
    // A repo that fails (App not installed there, protected branch, API down)
    // must not stop the others or leave the report without prs.json.
    const reason = String(e.stderr || e.message || e).split('\n')[0].slice(0, 160);
    console.log(`  ${repo}: FAILED - ${reason}`);
    failures.push({ repo, pins, error: reason });
  }
}

function processRepo(repo, pins) {
  // The branch names the set of bumps, not the date: if last week's PR is still
  // open with the same targets, this run recognizes it.
  const slug = pins.map(p => `${p.tool}-${p.target}`).sort().join('_');
  const branch = `fix/vuln-bump-${slug}`.slice(0, 240);

  try {
    const open = api(`repos/nullplatform/${repo}/pulls?state=open&head=nullplatform:${branch}`);
    if (open.length) {
      console.log(`  ${repo}: PR already open ${open[0].html_url}`);
      results.push({ repo, pins, url: open[0].html_url, reused: true });
      return;
    }
  } catch { /* no previous PR */ }

  const base = api(`repos/nullplatform/${repo}`).default_branch;
  const head = api(`repos/nullplatform/${repo}/git/ref/heads/${base}`).object.sha;
  try { ghArgs('api', '-X', 'POST', `repos/nullplatform/${repo}/git/refs`,
               '-f', `ref=refs/heads/${branch}`, '-f', `sha=${head}`); }
  catch { /* branch already exists: reuse it */ }

  const lines = [];
  for (const p of pins) {
    const file = JSON.parse(ghArgs('api', `repos/nullplatform/${repo}/contents/${p.path}?ref=${branch}`));
    const content = Buffer.from(file.content, 'base64').toString();
    const newVal = (p.prefix || '') + p.target;
    const re = new RegExp(`^ARG ${p.arg}=.*$`, 'm');
    if (!re.test(content)) { console.log(`  ${repo}: ARG ${p.arg} not found in ${p.path}, skipping`); continue; }
    const updated = content.replace(re, `ARG ${p.arg}=${newVal}`);
    if (updated === content) continue;

    const msg = `fix(deps): bump ${p.tool} to ${newVal}\n\n` +
      `Trivy reports ${p.current_findings} fixable CRITICAL/HIGH findings against ` +
      `${p.tool} ${p.current} as shipped in the published image` +
      (p.status === 'BUMP_PARTIAL'
        ? `. ${newVal} brings that down to ${p.remaining}; no version clears it entirely yet.`
        : `. ${newVal} is the lowest version that scans clean.`) +
      `\n\nOpened by the vuln-bump workflow.\n\nCo-Authored-By: Claude Opus 5 <noreply@anthropic.com>`;

    const msgFile = tmpfile(msg);
    ghArgs('api', '-X', 'PUT', `repos/nullplatform/${repo}/contents/${p.path}`,
           '-F', `message=@${msgFile}`, '-f', `content=${b64(updated)}`,
           '-f', `sha=${file.sha}`, '-f', `branch=${branch}`);
    fs.unlinkSync(msgFile);
    lines.push(`| \`${p.arg}\` | \`${p.current}\` | \`${newVal}\` | ${p.current_findings} → ${p.status === 'BUMP' ? '0' : p.remaining} |`);
  }

  if (!lines.length) { console.log(`  ${repo}: nothing to commit`); return; }

  const title = pins.length === 1
    ? `fix(deps): bump ${pins[0].tool} to ${(pins[0].prefix || '') + pins[0].target}`
    : `fix(deps): bump ${pins.map(p => p.tool).join(', ')}`;

  const body = [
    '## What',
    '',
    '| Pin | Current | Proposed | Findings |',
    '|---|---|---|---|',
    ...lines,
    '',
    '## Why',
    '',
    'These binaries are `curl`ed inside the Dockerfile, so they appear in no `go.mod` or `package.json` and **Dependabot cannot see them**. Trivy can, because it reads the metadata of the compiled Go binary.',
    '',
    'The proposed version is **the lowest one that is no longer vulnerable** within the ceiling declared in `pins.yml` - not the latest. That avoids jumps that break things: Helm 4 is breaking, and kubectl outside the +-1 skew breaks against customer clusters.',
    '',
    'On merge, release-please cuts the version and the chain republishes the image to ECR.',
    '',
    '---',
    '_Opened automatically by [vuln-bump](https://github.com/nullplatform/actions-nullplatform/blob/main/.github/workflows/vuln-bump.yml). Review the change before approving._',
    '',
    '🤖 Generated with [Claude Code](https://claude.com/claude-code)',
  ].join('\n');

  const bodyFile = tmpfile(body);
  const url = ghArgs('pr', 'create', '-R', `nullplatform/${repo}`, '--base', base,
                     '--head', branch, '--title', title, '--body-file', bodyFile);
  fs.unlinkSync(bodyFile);
  console.log(`  ${repo}: ${url}`);
  results.push({ repo, pins, url, reused: false });
}

fs.writeFileSync('prs.json', JSON.stringify({ opened: results, failed: failures }, null, 2));
if (failures.length) console.log(`\nFAILED on ${failures.length} repo(s): ${failures.map(f => f.repo).join(', ')}`);
console.log(`\nPRs: ${results.length} (${results.filter(r => r.reused).length} already existed)`);
