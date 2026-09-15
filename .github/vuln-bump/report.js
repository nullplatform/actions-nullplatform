#!/usr/bin/env node
// report.js <plan.json> [prs.json]
// Builds the Slack message. It ALWAYS emits, even when everything is clean: if
// Monday's message does not arrive, that is the alert. A report that only speaks
// when it finds something is indistinguishable from a dead one - which is exactly
// how this scan sat for four months without anyone noticing.
const fs = require('fs');

const plan = JSON.parse(fs.readFileSync(process.argv[2] || 'plan.json', 'utf8'));
// Deliberately tolerant: if open-pr did not run (dry-run, or the App is
// missing) the file may not exist or be empty. The report must go out anyway -
// it is Monday's sign of life, and losing it to an empty JSON would be the same
// bug that already cost us four months.
let prs = [], prFailures = [];
try {
  const raw = JSON.parse(fs.readFileSync(process.argv[3] || 'prs.json', 'utf8'));
  if (Array.isArray(raw)) prs = raw;
  else { prs = raw.opened || []; prFailures = raw.failed || []; }
} catch { prs = []; }
const prByRepo = Object.fromEntries(prs.map(p => [p.repo, p.url]));
const failedRepos = new Set(prFailures.map(f => f.repo));

const pick = (...s) => plan.filter(p => s.includes(p.status));
const bumped = pick('BUMP', 'BUMP_PARTIAL');
const stuck  = pick('NO_MATERIAL_GAIN');
const errors = pick('ERROR', 'ARG_NOT_FOUND');
const clean  = pick('ALREADY_CLEAN');

const lines = [];
const push = (s) => lines.push(s);

if (bumped.length) {
  push('*Ready to approve*');
  const seen = new Set();
  for (const p of bumped) {
    const url = prByRepo[p.repo];
    const key = `${p.repo}|${url}`;
    if (url && seen.has(key)) continue;
    seen.add(key);
    const same = bumped.filter(x => x.repo === p.repo);
    const what = same.map(x => `${x.tool} ${x.current} → ${(x.prefix || '') + x.target}`).join(', ');
    const left = same.reduce((a, x) => a + (x.status === 'BUMP' ? 0 : (x.remaining || 0)), 0);
    const tail = url ? ` → <${url}|PR>`
      : failedRepos.has(p.repo) ? ` → :warning: _could not open the PR_`
      : ' → _no PR: App not configured_';
    push(`• \`${p.repo}\` — ${what}${left ? ` (${left} left)` : ''}` + tail);
    if (url) for (const x of same) seen.add(`${x.repo}|${url}`);
  }
  push('');
}

if (stuck.length) {
  // Grouped by tool+version: without this the same line appears once per repo
  // (tofu shows up 6 times identically) and the message becomes ignorable noise.
  push('*No automatic remediation*');
  const groups = {};
  for (const p of stuck) (groups[`${p.tool} ${p.current}`] ||= []).push(p);
  for (const [k, ps] of Object.entries(groups)) {
    const repos = [...new Set(ps.map(p => p.repo))];
    const each = ps[0].remaining || 0;
    const shown = repos.slice(0, 4).map(r => `\`${r}\``).join(', ');
    const more = repos.length > 4 ? ` +${repos.length - 4}` : '';
    push(`• *${k}* - ${each} findings x ${ps.length} ${ps.length > 1 ? 'pins' : 'pin'} = ${each * ps.length}`);
    push(`   ${shown}${more} · no allowed version improves on it`);
  }
  push('');
}

if (errors.length) {
  push('*Could not resolve*');
  for (const p of errors) push(`• \`${p.repo}\` - ${p.tool || p.arg}: ${p.status}${p.stage ? ` at ${p.stage}` : ''}`);
  push('');
}

if (clean.length) {
  const names = [...new Set(clean.map(p => `${p.tool} ${p.current}`))];
  push(`*Up to date* (${clean.length}): ${names.join(', ')}`);
}

const total = plan.length;
const headline = bumped.length
  ? `${bumped.length} bump${bumped.length > 1 ? 's' : ''} proposed`
  : 'no bumps available';
const runUrl = process.env.GITHUB_SERVER_URL && process.env.GITHUB_RUN_ID
  ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}` : null;

// Slack truncates text blocks at 3000 characters.
const chunks = [];
let buf = '';
for (const l of lines) {
  if ((buf + l + '\n').length > 2900) { chunks.push(buf); buf = ''; }
  buf += l + '\n';
}
if (buf.trim()) chunks.push(buf);

const payload = {
  blocks: [
    { type: 'header', text: { type: 'plain_text', text: `Security bumps - ${total} pins checked, ${headline}`, emoji: true } },
    ...chunks.map(c => ({ type: 'section', text: { type: 'mrkdwn', text: c.trim() || '_no detail_' } })),
    ...(runUrl ? [{ type: 'context', elements: [{ type: 'mrkdwn', text: `<${runUrl}|View the run>` }] }] : []),
  ],
};

fs.writeFileSync('slack.json', JSON.stringify(payload));
console.log(lines.join('\n'));
