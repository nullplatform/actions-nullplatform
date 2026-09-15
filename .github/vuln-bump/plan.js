#!/usr/bin/env node
// plan.js - reads pins.yml, resolves every pin and emits the bump plan.
// In dry-run it prints the table and touches no repo.
const { execSync } = require('child_process');
const fs = require('fs');

const sh = (c) => execSync(c, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).trim();
const yaml = (f) => JSON.parse(sh(`python3 -c "import yaml,json,sys; print(json.dumps(yaml.safe_load(open('${f}'))))"`));

const RESOLVE = process.env.RESOLVE_JS || require('path').join(__dirname, 'resolve.js');
const cfg = yaml(process.argv[2] || 'pins.yml');
const GH = (p) => JSON.parse(sh(`gh api "${p}"`));

// Read the live ARG value straight from the repo: the Dockerfile is the source
// of truth, not a copy in this file that drifts out of sync.
function currentValue(repo, path, arg) {
  const content = Buffer.from(GH(`repos/nullplatform/${repo}/contents/${path}`).content, 'base64').toString();
  const m = content.match(new RegExp(`^ARG ${arg}=(.*)$`, 'm'));
  return m ? m[1].trim() : null;
}

const plan = [];
for (const r of cfg.repos) for (const f of r.files) for (const p of f.pins) {
  const raw = currentValue(r.repo, f.path, p.arg);
  if (raw === null) { plan.push({ ...p, repo: r.repo, path: f.path, status: 'ARG_NOT_FOUND' }); continue; }
  const cur = p.prefix ? raw.replace(new RegExp(`^${p.prefix}`), '') : raw;
  const ceil = cfg.ceilings[p.tool] || '';
  process.stderr.write(`\n[${r.repo}/${f.path}] ${p.arg}=${raw}\n`);
  let out;
  try { out = JSON.parse(sh(`node ${RESOLVE} ${p.tool} ${cur} ${ceil}`)); }
  catch (e) { out = { status: 'ERROR', detail: String(e.message || e).slice(0, 100) }; }
  plan.push({ repo: r.repo, path: f.path, arg: p.arg, tool: p.tool, prefix: p.prefix, current: raw, ...out });
}

const W = (s, n) => String(s ?? '-').padEnd(n).slice(0, n);
console.log('\n' + W('REPO', 26) + W('ARG', 17) + W('CURRENT', 10) + W('STATUS', 22) + W('PROPOSED', 11) + 'LEFT');
console.log('-'.repeat(96));
for (const p of plan) {
  const target = p.target ? (p.prefix || '') + p.target : '-';
  const left = p.status === 'ALREADY_CLEAN' ? '0' : (p.remaining ?? p.current_findings ?? '-');
  console.log(W(p.repo, 26) + W(p.arg, 17) + W(p.current, 10) + W(p.status, 22) + W(target, 11) + left);
}
const prs = plan.filter(p => p.status === 'BUMP' || p.status === 'BUMP_PARTIAL');
console.log(`\nPRs it would open: ${prs.length}`);
for (const p of prs) console.log(`  ${p.repo}: ${p.arg} ${p.current} -> ${(p.prefix||'')+p.target}`);
fs.writeFileSync('plan.json', JSON.stringify(plan, null, 2));
