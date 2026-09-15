#!/usr/bin/env node
// plan.js - reads pins.yml, resolves every pin and emits the bump plan.
// In dry-run it prints the table and touches no repo.
const { execSync, execFileSync } = require('child_process');
const fs = require('fs');

const sh = (c) => execSync(c, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).trim();
const yaml = (f) => JSON.parse(sh(`python3 -c "import yaml,json,sys; print(json.dumps(yaml.safe_load(open('${f}'))))"`));

const RESOLVE = process.env.RESOLVE_JS || require('path').join(__dirname, 'resolve.js');
const cfg = yaml(process.argv[2] || '.github/vuln-bump/pins.yml');

// discover.js already read the live ARG value from each Dockerfile, so there is
// no inventory here to drift out of sync with the repos.
const discovered = JSON.parse(fs.readFileSync(process.argv[3] || 'discovered.json', 'utf8'));

const plan = [];
for (const p of discovered) {
  // UNMAPPED / NO_DEFAULT pass straight through to the report: visible, never guessed.
  if (p.status) { plan.push(p); continue; }
  const cur = p.prefix ? p.current.replace(new RegExp(`^${p.prefix}`), '') : p.current;
  const ceil = cfg.ceilings[p.tool] || '';
  process.stderr.write(`\n[${p.repo}/${p.path}] ${p.arg}=${p.current}\n`);
  let out;
  // cur comes from a Dockerfile: argv, never a shell string.
  try { out = JSON.parse(execFileSync('node', [RESOLVE, p.tool, cur, ceil], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).trim()); }
  catch (e) { out = { status: 'ERROR', detail: String(e.message || e).slice(0, 100) }; }
  plan.push({ ...p, ...out });
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
