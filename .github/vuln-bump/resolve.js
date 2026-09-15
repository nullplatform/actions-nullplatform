#!/usr/bin/env node
// resolve.js <tool> <current> [allowedMax]
// Returns the LOWEST version >= current that scans clean, within allowedMax.
// Strategy: probe the allowed ceiling first. If the ceiling is not clean there is
// no solution and we say so; if it is, binary search for the lowest clean one.
// Cost: O(log n) scans instead of O(n).
const { execSync } = require('child_process');
const fs = require('fs'), path = require('path');
const CACHE = process.env.CACHE_DIR || '/tmp/vuln-bump-cache';
fs.mkdirSync(CACHE, { recursive: true });

const sh = (c, o = {}) => execSync(c, { encoding: 'utf8', stdio: ['ignore','pipe','ignore'], ...o }).trim();
const cmp = (a, b) => { const A = a.split('.').map(Number), B = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) if ((A[i]||0) !== (B[i]||0)) return (A[i]||0) - (B[i]||0); return 0; };

// gh api uses GH_TOKEN: unauthenticated the limit is 60 req/hour per IP, and
// Actions runners share IPs. With plain curl this fails at random.
const gh = repo => sh(`gh api "repos/${repo}/releases?per_page=100" --jq '.[].tag_name'`)
  .split('\n').filter(t => /^v\d+\.\d+\.\d+$/.test(t)).map(t => t.slice(1));

const SOURCES = {
  // jq trims the response in the shell: the raw release list exceeds 1MB and
  // overflows execSync's maxBuffer.
  tofu: () => gh('opentofu/opentofu'),
  helm: () => gh('helm/helm'),
  // kubectl has no usable release list: query the stable pointer of each minor
  kubectl: () => { const out = [];
    for (let m = 28; m <= 40; m++) { try {
      const v = sh(`curl -sf "https://dl.k8s.io/release/stable-1.${m}.txt"`); if (v) out.push(v.replace(/^v/, ''));
    } catch {} } return out; },
};

const FETCH = {
  tofu: (v, d) => { sh(`curl -sSLf -o ${d}/x.zip "https://github.com/opentofu/opentofu/releases/download/v${v}/tofu_${v}_linux_amd64.zip"`);
                    sh(`unzip -oq ${d}/x.zip tofu -d ${d} && rm -f ${d}/x.zip`); },
  helm: (v, d) => sh(`curl -sSLf "https://get.helm.sh/helm-v${v}-linux-amd64.tar.gz" | tar xz -C ${d} --strip-components=1 linux-amd64/helm`),
  kubectl: (v, d) => sh(`curl -sSLf -o ${d}/kubectl "https://dl.k8s.io/release/v${v}/bin/linux/amd64/kubectl"`),
};

function scan(tool, v) {
  const mark = path.join(CACHE, `${tool}-${v}.count`);
  if (fs.existsSync(mark)) return Number(fs.readFileSync(mark, 'utf8'));
  const d = path.join(CACHE, `${tool}-${v}`); fs.mkdirSync(d, { recursive: true });
  try {
    if (!fs.existsSync(path.join(d, tool))) FETCH[tool](v, d);
    // Trivy only analyzes Go binaries with the execute bit set: without this it reports a false 0.
    fs.chmodSync(path.join(d, tool), 0o755);
    fs.writeFileSync(path.join(d, 'Dockerfile'), `FROM alpine:3.21\nCOPY ${tool} /usr/local/bin/${tool}\n`);
    sh(`docker build -q -t vb:${tool}-${v} ${d}`);
    // Native Trivy when installed (CI); otherwise the container (local).
    const flags = `--severity CRITICAL,HIGH --ignore-unfixed --scanners vuln --format json vb:${tool}-${v}`;
    let trivyBin = null; try { trivyBin = sh('command -v trivy'); } catch {}
    const j = trivyBin
      ? sh(`trivy image ${flags}`)
      : sh(`docker run --rm -v /tmp/trivycache:/root/.cache/ -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:0.74.0 image ${flags}`);
    const n = (JSON.parse(j).Results || [])
      .filter(r => (r.Target || '').includes(tool))
      .reduce((a, r) => a + (r.Vulnerabilities || []).length, 0);
    fs.writeFileSync(mark, String(n)); return n;
  } catch (e) {
    // null is neither 0 nor N: the caller MUST abort. Treating a network failure
    // as "vulnerable" would make the binary search overshoot, or report that no
    // safe version exists when one does.
    process.stderr.write(`  ERROR ${tool} ${v}: ${String(e.message || e).slice(0, 120)}\n`);
    return null;
  }
}

const [tool, current, allowed] = process.argv.slice(2);
const all = [...new Set(SOURCES[tool]())].sort(cmp);
const cand = all.filter(v => cmp(v, current) >= 0 && (!allowed || cmp(v, allowed) <= 0));
if (!cand.length) { console.log(JSON.stringify({ tool, current, status: 'NO_CANDIDATES' })); process.exit(0); }

const abort = (stage, v) => {
  console.log(JSON.stringify({ tool, current, status: 'ERROR', stage, version: v }));
  process.exit(2);
};

const cur = scan(tool, current);
if (cur === null) abort('current', current);
process.stderr.write(`  current ${tool} ${current} -> ${cur}\n`);
if (cur === 0) { console.log(JSON.stringify({ tool, current, status: 'ALREADY_CLEAN' })); process.exit(0); }

const top = cand[cand.length - 1], t = scan(tool, top);
if (t === null) abort('ceiling', top);
process.stderr.write(`  ceiling ${tool} ${top} -> ${t}\n`);
if (t !== 0) {
  // No version comes out clean. That does not always mean "do nothing": if the
  // ceiling improves materially the bump is still worth it, labelled as partial.
  // The threshold avoids opening PRs that move one or two findings (the kubectl
  // case, where the useful jump falls outside the allowed skew).
  const gain = cur - t, pct = cur > 0 ? gain / cur : 0;
  const status = (gain >= 10 && pct >= 0.5) ? 'BUMP_PARTIAL' : 'NO_MATERIAL_GAIN';
  console.log(JSON.stringify({ tool, current, current_findings: cur, status,
    target: status === 'BUMP_PARTIAL' ? top : null, remaining: t, gain }));
  process.exit(0);
}

let lo = 0, hi = cand.length - 1, probes = 0;
while (lo < hi) { const mid = (lo + hi) >> 1, v = cand[mid], n = scan(tool, v); probes++;
  process.stderr.write(`  probe  ${v} -> ${n}\n`);
  if (n === 0) hi = mid; else lo = mid + 1; }
console.log(JSON.stringify({ tool, current, current_findings: cur, status: 'BUMP', target: cand[lo], probes: probes + 2 }));
