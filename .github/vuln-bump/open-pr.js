#!/usr/bin/env node
// open-pr.js <plan.json>
// Aplica los bumps del plan y abre un PR por repo.
//
// Un PR por repo, no por pin: scopes declara tres pines en el mismo Dockerfile y
// tres PRs sobre el mismo archivo conflictuarian entre si.
//
// Idempotente: si ya hay un PR abierto con la misma rama, no abre otro. Sin esto
// cada lunes acumularia un PR identico mientras el anterior espera review.
const { execSync } = require('child_process');
const fs = require('fs');

const sh = (c) => execSync(c, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).trim();
const api = (args) => JSON.parse(sh(`gh api ${args}`));
const b64 = (s) => Buffer.from(s, 'utf8').toString('base64');
const os = require('os'), path = require('path');
// Todo texto libre va al shell por archivo, nunca inline. JSON.stringify NO
// escapa backticks, y el markdown del body esta lleno: el shell los tomaba como
// sustitucion de comandos y las celdas de la tabla salian vacias.
const tmpfile = (content) => { const f = path.join(os.tmpdir(), `vb-${process.pid}-${Math.random().toString(36).slice(2)}`); fs.writeFileSync(f, content); return f; };

const plan = JSON.parse(fs.readFileSync(process.argv[2] || 'plan.json', 'utf8'));
const actionable = plan.filter(p => p.status === 'BUMP' || p.status === 'BUMP_PARCIAL');

const byRepo = {};
for (const p of actionable) (byRepo[p.repo] ||= []).push(p);

const results = [];
const failures = [];
for (const [repo, pins] of Object.entries(byRepo)) {
  try {
    processRepo(repo, pins);
  } catch (e) {
    // Un repo que falla (App no instalada ahi, rama protegida, API caida) no
    // debe frenar a los demas ni dejar el reporte sin prs.json.
    const reason = String(e.stderr || e.message || e).split('\n')[0].slice(0, 160);
    console.log(`  ${repo}: FALLO — ${reason}`);
    failures.push({ repo, pins, error: reason });
  }
}

function processRepo(repo, pins) {
  // La rama nombra el conjunto de bumps, no la fecha: si el PR de la semana
  // pasada sigue abierto con los mismos targets, esta corrida lo reconoce.
  const slug = pins.map(p => `${p.tool}-${p.target}`).sort().join('_');
  const branch = `fix/vuln-bump-${slug}`.slice(0, 240);

  try {
    const open = api(`repos/nullplatform/${repo}/pulls?state=open&head=nullplatform:${branch}`);
    if (open.length) {
      console.log(`  ${repo}: PR ya abierto ${open[0].html_url}`);
      results.push({ repo, pins, url: open[0].html_url, reused: true });
      return;
    }
  } catch { /* sin PR previo */ }

  const base = api(`repos/nullplatform/${repo}`).default_branch;
  const head = api(`repos/nullplatform/${repo}/git/ref/heads/${base}`).object.sha;
  try { sh(`gh api -X POST repos/nullplatform/${repo}/git/refs -f ref="refs/heads/${branch}" -f sha="${head}"`); }
  catch { /* la rama ya existe: se reusa */ }

  const lines = [];
  for (const p of pins) {
    const file = api(`repos/nullplatform/${repo}/contents/${p.path}?ref=${branch}`);
    const content = Buffer.from(file.content, 'base64').toString();
    const newVal = (p.prefix || '') + p.target;
    const re = new RegExp(`^ARG ${p.arg}=.*$`, 'm');
    if (!re.test(content)) { console.log(`  ${repo}: no encontre ARG ${p.arg} en ${p.path}, salteo`); continue; }
    const updated = content.replace(re, `ARG ${p.arg}=${newVal}`);
    if (updated === content) continue;

    const msg = `fix(deps): bump ${p.tool} to ${newVal}\n\n` +
      `Trivy reports ${p.current_findings} fixable CRITICAL/HIGH findings against ` +
      `${p.tool} ${p.current} as shipped in the published image` +
      (p.status === 'BUMP_PARCIAL'
        ? `. ${newVal} brings that down to ${p.remaining}; no version clears it entirely yet.`
        : `. ${newVal} is the lowest version that scans clean.`) +
      `\n\nOpened by the vuln-bump workflow.\n\nCo-Authored-By: Claude Opus 5 <noreply@anthropic.com>`;

    const msgFile = tmpfile(msg);
    sh(`gh api -X PUT repos/nullplatform/${repo}/contents/${p.path} ` +
       `-F message=@${msgFile} -f content="${b64(updated)}" ` +
       `-f sha="${file.sha}" -f branch="${branch}"`);
    fs.unlinkSync(msgFile);
    lines.push(`| \`${p.arg}\` | \`${p.current}\` | \`${newVal}\` | ${p.current_findings} → ${p.status === 'BUMP' ? '0' : p.remaining} |`);
  }

  if (!lines.length) { console.log(`  ${repo}: sin cambios que commitear`); return; }

  const title = pins.length === 1
    ? `fix(deps): bump ${pins[0].tool} to ${(pins[0].prefix || '') + pins[0].target}`
    : `fix(deps): bump ${pins.map(p => p.tool).join(', ')}`;

  const body = [
    '## Qué',
    '',
    '| Pin | Actual | Propuesto | Hallazgos |',
    '|---|---|---|---|',
    ...lines,
    '',
    '## Por qué',
    '',
    'Estos binarios se bajan con `curl` dentro del Dockerfile, así que no aparecen en ningún `go.mod` ni `package.json` y **Dependabot no los ve**. Trivy sí, porque lee la metadata del binario Go compilado.',
    '',
    'La versión propuesta es **la más baja que deja de estar vulnerable** dentro del techo declarado en `pins.yml` — no la última. Eso evita saltos que rompen: Helm 4 es breaking, y kubectl fuera del skew de ±1 rompe contra clusters de clientes.',
    '',
    'Al mergear, release-please corta la versión y la cadena republica la imagen a ECR.',
    '',
    '---',
    '_Abierto automáticamente por [vuln-bump](https://github.com/nullplatform/actions-nullplatform/blob/main/.github/workflows/vuln-bump.yml). Verificá el cambio antes de aprobar._',
    '',
    '🤖 Generated with [Claude Code](https://claude.com/claude-code)',
  ].join('\n');

  const bodyFile = tmpfile(body), titleFile = tmpfile(title);
  const url = sh(`gh pr create -R nullplatform/${repo} --base ${base} --head ${branch} ` +
                 `--title "$(cat ${titleFile})" --body-file ${bodyFile}`);
  fs.unlinkSync(bodyFile); fs.unlinkSync(titleFile);
  console.log(`  ${repo}: ${url}`);
  results.push({ repo, pins, url, reused: false });
}

fs.writeFileSync('prs.json', JSON.stringify({ opened: results, failed: failures }, null, 2));
if (failures.length) console.log(`\nFALLARON ${failures.length} repo(s): ${failures.map(f => f.repo).join(', ')}`);
console.log(`\nPRs: ${results.length} (${results.filter(r => r.reused).length} ya existian)`);
