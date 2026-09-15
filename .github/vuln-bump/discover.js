#!/usr/bin/env node
// discover.js - finds every ARG <TOOL>_VERSION pin across the org's Dockerfiles.
//
// Replaces a hand-written inventory. That inventory was already stale 24h after
// it was written: it declared 12 pins while the org had 20, and three of the
// eight it missed were still on the vulnerable tofu 1.10.10.
//
// Only the ceilings stay declared, in pins.yml - which version of Kubernetes we
// stop supporting is policy, and no tool can infer it.
const { execSync } = require('child_process');
const fs = require('fs');

const sh = (c) => execSync(c, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).trim();
const yaml = (f) => JSON.parse(sh(`python3 -c "import yaml,json;print(json.dumps(yaml.safe_load(open('${f}'))))"`));

const cfg = yaml(process.argv[2] || '.github/vuln-bump/pins.yml');
const known = cfg.tools || {};

// Code search is the only way to find these without cloning every repo.
const hits = JSON.parse(sh(
  `gh api -X GET search/code -f q='"ARG" "_VERSION=" org:nullplatform filename:Dockerfile' ` +
  `-f per_page=100 --jq '[.items[] | {repo: .repository.name, path: .path}]'`));

const seen = new Set(), pins = [];
for (const h of hits) {
  const key = `${h.repo}|${h.path}`;
  if (seen.has(key)) continue;
  seen.add(key);
  let body;
  try {
    body = Buffer.from(JSON.parse(sh(
      `gh api "repos/nullplatform/${h.repo}/contents/${h.path}"`)).content, 'base64').toString();
  } catch { continue; }

  for (const line of body.split('\n')) {
    const m = line.match(/^ARG ([A-Z_]+)_VERSION=(.*)$/);
    if (!m) continue;
    const [, name, raw] = m;
    const tool = known[name];
    // An unmapped ARG is reported, not guessed: TOFU_VERSION means opentofu only
    // because pins.yml says so. Guessing would have the bot edit pins nobody mapped.
    if (!tool) { pins.push({ repo: h.repo, path: h.path, arg: `${name}_VERSION`, status: 'UNMAPPED', current: raw.trim() }); continue; }
    if (!raw.trim()) { pins.push({ repo: h.repo, path: h.path, arg: `${name}_VERSION`, tool, status: 'NO_DEFAULT' }); continue; }
    pins.push({
      repo: h.repo, path: h.path, arg: `${name}_VERSION`, tool,
      prefix: raw.trim().startsWith('v') ? 'v' : '',
      current: raw.trim(),
    });
  }
}

pins.sort((a, b) => (a.repo + a.path + a.arg).localeCompare(b.repo + b.path + b.arg));
fs.writeFileSync('discovered.json', JSON.stringify(pins, null, 2));

const ok = pins.filter(p => !p.status);
console.log(`Discovered ${pins.length} pins across ${new Set(pins.map(p => p.repo)).size} repos (${ok.length} mapped)`);
for (const p of pins.filter(p => p.status)) console.log(`  ${p.status}: ${p.repo}/${p.path} ${p.arg}`);
