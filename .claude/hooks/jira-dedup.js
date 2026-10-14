#!/usr/bin/env node
// PreToolUse hook: bloquea la creación de una issue en Jira si ya existe una equivalente
// en el mismo proyecto. Requiere JIRA_BASE_URL, JIRA_EMAIL y JIRA_API_TOKEN.
// Opcionales: JIRA_DEDUP_THRESHOLD (default 0.75), JIRA_DEDUP_MAX_ISSUES (default 500),
// JIRA_DEDUP_FAIL_OPEN=1 para permitir la creación si la búsqueda falla.

const THRESHOLD = parseFloat(process.env.JIRA_DEDUP_THRESHOLD || '0.75');
const MAX_ISSUES = parseInt(process.env.JIRA_DEDUP_MAX_ISSUES || '500', 10);
const FAIL_OPEN = process.env.JIRA_DEDUP_FAIL_OPEN === '1';

const STOPWORDS = new Set((
  'el la los las un una unos unas de del al a en y o u que para por con sin se su sus ' +
  'es ser como mas más este esta estos estas ese esa lo le les me mi mis tu nos ' +
  'the a an of to in on for and or with by is be as at from this that it'
).split(' '));

function decide(decision, reason) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: decision,
      permissionDecisionReason: reason,
    },
  }));
  process.exit(0);
}

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Raíz aproximada: "registro"/"registrar" -> "regis", "clientes"/"cliente" -> "clien".
function stem(word) {
  return word.length > 5 ? word.slice(0, 5) : word.replace(/(es|s)$/, '');
}

function tokens(text) {
  return new Set(normalize(text).split(' ').filter(t => t.length > 1 && !STOPWORDS.has(t)).map(stem));
}

// Coeficiente de Dice sobre tokens significativos.
function similarity(a, b) {
  const ta = tokens(a), tb = tokens(b);
  if (!ta.size || !tb.size) return 0;
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  return (2 * inter) / (ta.size + tb.size);
}

// Extrae texto plano de una descripción en ADF (API v3) o string.
function adfToText(node) {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(adfToText).join(' ');
  let out = node.text || '';
  if (node.content) out += ' ' + adfToText(node.content);
  return out;
}

async function fetchProjectIssues(projectKey) {
  const base = process.env.JIRA_BASE_URL.replace(/\/+$/, '');
  const auth = Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64');
  const issues = [];
  let nextPageToken;
  do {
    const res = await fetch(`${base}/rest/api/3/search/jql`, {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jql: `project = "${projectKey.replace(/"/g, '')}" ORDER BY created DESC`,
        fields: ['summary', 'description', 'status'],
        maxResults: 100,
        ...(nextPageToken ? { nextPageToken } : {}),
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) throw new Error(`Jira respondió HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const data = await res.json();
    issues.push(...(data.issues || []));
    nextPageToken = data.isLast ? undefined : data.nextPageToken;
  } while (nextPageToken && issues.length < MAX_ISSUES);
  return issues;
}

async function main() {
  let input = '';
  for await (const chunk of process.stdin) input += chunk;
  const payload = JSON.parse(input || '{}');
  let toolInput = payload.tool_input || {};

  // También cubre createJiraIssue invocado vía executeWrite.
  if (payload.tool_name === 'mcp__atlassian__executeWrite') {
    if (!/createJiraIssue/i.test(toolInput.name || '')) process.exit(0);
    toolInput = toolInput.inputs || {};
  }

  const projectKey = toolInput.projectKey;
  const summary = toolInput.summary || '';
  const description = toolInput.description || '';
  if (!projectKey || !summary) process.exit(0);

  const missing = ['JIRA_BASE_URL', 'JIRA_EMAIL', 'JIRA_API_TOKEN'].filter(v => !process.env[v]);
  if (missing.length) {
    if (FAIL_OPEN) process.exit(0);
    decide('deny', `Hook anti-duplicados de Jira: no se pudo verificar duplicados porque faltan las variables ${missing.join(', ')}. Configúralas en .claude/settings.local.json (env) o define JIRA_DEDUP_FAIL_OPEN=1.`);
  }

  let issues;
  try {
    issues = await fetchProjectIssues(projectKey);
  } catch (err) {
    if (FAIL_OPEN) process.exit(0);
    decide('deny', `Hook anti-duplicados de Jira: falló la búsqueda en el proyecto ${projectKey} (${err.message}). Creación bloqueada por precaución.`);
  }

  const newSummaryNorm = normalize(summary);
  const matches = [];
  for (const issue of issues) {
    const f = issue.fields || {};
    const existingSummary = f.summary || '';
    const existingDesc = adfToText(f.description);
    const sumSim = normalize(existingSummary) === newSummaryNorm ? 1 : similarity(summary, existingSummary);
    const descSim = description && existingDesc ? similarity(description, existingDesc) : 0;
    // Equivalente si el título es casi igual, o si título y descripción/criterios se parecen bastante.
    const score = description && existingDesc ? Math.max(sumSim, 0.5 * sumSim + 0.5 * descSim) : sumSim;
    // Una descripción/criterios casi idénticos bastan aunque el título difiera.
    const equivalent = sumSim >= THRESHOLD || descSim >= 0.85 || (sumSim >= 0.5 && descSim >= THRESHOLD) || score >= THRESHOLD;
    if (equivalent) matches.push({ key: issue.key, summary: existingSummary, status: f.status?.name, score });
  }

  if (!matches.length) process.exit(0); // No hay duplicado: se permite la creación.

  matches.sort((a, b) => b.score - a.score);
  const list = matches.slice(0, 5)
    .map(m => `- ${m.key} — "${m.summary}" [${m.status || 's/estado'}] (similitud ${(m.score * 100).toFixed(0)}%)`)
    .join('\n');
  decide('deny',
    `Creación bloqueada: ya existe una tarea equivalente en el proyecto ${projectKey}.\n` +
    `Tarea existente: ${matches[0].key}\n${list}\n` +
    `No crees la issue; informa al usuario la clave existente o actualiza esa tarea si corresponde.`);
}

main().catch(err => {
  if (FAIL_OPEN) process.exit(0);
  decide('deny', `Hook anti-duplicados de Jira: error inesperado (${err.message}). Creación bloqueada por precaución.`);
});
