#!/usr/bin/env node
// report.js <plan.json> [prs.json]
// Arma el mensaje de Slack. SIEMPRE emite, aunque este todo limpio: si el lunes
// no llega el mensaje, eso es la alerta. Un reporte que solo habla cuando
// encuentra algo es indistinguible de uno muerto — es exactamente como estuvo
// este escaneo cuatro meses sin que nadie lo notara.
const fs = require('fs');

const plan = JSON.parse(fs.readFileSync(process.argv[2] || 'plan.json', 'utf8'));
// Tolerante a propósito: si open-pr no corrió (dry-run, o falta la App) el
// archivo puede no existir o estar vacío. El reporte debe salir igual — es la
// senal de vida del lunes, y perderla por un JSON vacio seria el mismo bug que
// ya nos costo cuatro meses.
let prs = [];
try { prs = JSON.parse(fs.readFileSync(process.argv[3] || 'prs.json', 'utf8')) || []; }
catch { prs = []; }
const prByRepo = Object.fromEntries(prs.map(p => [p.repo, p.url]));

const pick = (...s) => plan.filter(p => s.includes(p.status));
const bumped = pick('BUMP', 'BUMP_PARCIAL');
const stuck  = pick('SIN_MEJORA_MATERIAL');
const errors = pick('ERROR', 'ARG_NO_ENCONTRADO');
const clean  = pick('YA_LIMPIA');

const lines = [];
const push = (s) => lines.push(s);

if (bumped.length) {
  push('*Para aprobar*');
  const seen = new Set();
  for (const p of bumped) {
    const url = prByRepo[p.repo];
    const key = `${p.repo}|${url}`;
    if (url && seen.has(key)) continue;
    seen.add(key);
    const same = bumped.filter(x => x.repo === p.repo);
    const what = same.map(x => `${x.tool} ${x.current} → ${(x.prefix || '') + x.target}`).join(', ');
    const left = same.reduce((a, x) => a + (x.status === 'BUMP' ? 0 : (x.remaining || 0)), 0);
    push(`• \`${p.repo}\` — ${what}${left ? ` (quedan ${left})` : ''}` + (url ? ` → <${url}|PR>` : ' → _sin PR: falta la App_'));
    if (url) for (const x of same) seen.add(`${x.repo}|${url}`);
  }
  push('');
}

if (stuck.length) {
  // Agrupado por herramienta+version: sin esto la misma linea aparece una vez por
  // repo (tofu sale 6 veces identico) y el mensaje se vuelve ruido que se ignora.
  push('*Sin remediación automática*');
  const groups = {};
  for (const p of stuck) (groups[`${p.tool} ${p.current}`] ||= []).push(p);
  for (const [k, ps] of Object.entries(groups)) {
    const repos = [...new Set(ps.map(p => p.repo))];
    const each = ps[0].remaining || 0;
    const shown = repos.slice(0, 4).map(r => `\`${r}\``).join(', ');
    const more = repos.length > 4 ? ` +${repos.length - 4}` : '';
    push(`• *${k}* — ${each} hallazgos × ${ps.length} ${ps.length > 1 ? 'pines' : 'pin'} = ${each * ps.length}`);
    push(`   ${shown}${more} · ninguna versión permitida mejora`);
  }
  push('');
}

if (errors.length) {
  push('*No se pudo resolver*');
  for (const p of errors) push(`• \`${p.repo}\` — ${p.tool || p.arg}: ${p.status}${p.stage ? ` en ${p.stage}` : ''}`);
  push('');
}

if (clean.length) {
  const names = [...new Set(clean.map(p => `${p.tool} ${p.current}`))];
  push(`*Al día* (${clean.length}): ${names.join(', ')}`);
}

const total = plan.length;
const headline = bumped.length
  ? `${bumped.length} bump${bumped.length > 1 ? 's' : ''} propuesto${bumped.length > 1 ? 's' : ''}`
  : 'sin bumps disponibles';
const runUrl = process.env.GITHUB_SERVER_URL && process.env.GITHUB_RUN_ID
  ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}` : null;

// Slack corta los bloques de texto en 3000 caracteres.
const chunks = [];
let buf = '';
for (const l of lines) {
  if ((buf + l + '\n').length > 2900) { chunks.push(buf); buf = ''; }
  buf += l + '\n';
}
if (buf.trim()) chunks.push(buf);

const payload = {
  blocks: [
    { type: 'header', text: { type: 'plain_text', text: `Bumps de seguridad — ${total} pines revisados, ${headline}`, emoji: true } },
    ...chunks.map(c => ({ type: 'section', text: { type: 'mrkdwn', text: c.trim() || '_sin detalle_' } })),
    ...(runUrl ? [{ type: 'context', elements: [{ type: 'mrkdwn', text: `<${runUrl}|Ver la corrida>` }] }] : []),
  ],
};

fs.writeFileSync('slack.json', JSON.stringify(payload));
console.log(lines.join('\n'));
