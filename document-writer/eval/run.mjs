import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
import { SCORE_KEYS, validScores, autoCheck, passes, regressions as findRegressions } from './checks.mjs';

function option(name) {
  const i = process.argv.indexOf(name);
  return i < 0 ? null : process.argv[i + 1];
}
function load(file) {
  return JSON.parse(readFileSync(resolve(file), 'utf8'));
}
function main() {
  const inputPath = option('--input');
  if (!inputPath || !option('--output') || process.argv.some(a => ['--input','--output','--baseline'].includes(a) && (!process.argv[process.argv.indexOf(a)+1] || process.argv[process.argv.indexOf(a)+1].startsWith('--')))) {
    throw new Error('Usage: node eval/run.mjs --input evaluated-responses.json --output report.json [--baseline previous-report.json]');
  }
  const cases = JSON.parse(readFileSync(resolve(here, 'cases.json'), 'utf8'));
  const submitted = load(inputPath);
  if (!Array.isArray(submitted.results)) throw new Error('Input must contain a results array');
  for (const field of ['skillRevision', 'model', 'reviewer']) {
    if (typeof submitted[field] !== 'string' || !submitted[field].trim()) throw new Error('Missing evaluation metadata: ' + field);
  }
  const ids = submitted.results.map(row => row.id);
  if (new Set(ids).size !== ids.length) throw new Error('Duplicate result IDs');
  const unknown = ids.filter(id => !cases.some(c => c.id === id));
  if (unknown.length) throw new Error('Unknown result IDs: ' + unknown.join(', '));

  const priorPath = option('--baseline');
  const prior = priorPath ? load(priorPath) : null;
  if (prior && !Array.isArray(prior.results)) throw new Error('Baseline must be an evaluation report');

  const results = cases.map(c => {
    const record = submitted.results.find(r => r.id === c.id);
    const scores = record?.scores;
    const scoreValid = validScores(scores);
    const hasResponse = record && typeof record.response === 'string' && record.response.trim().length > 0;
    const automatic = hasResponse ? autoCheck(c, record.response) : { ok: false, check: 'missing response' };
    const total = scoreValid ? SCORE_KEYS.reduce((n,k) => n + scores[k],0) : null;
    const passed = Boolean(hasResponse && passes(c, scores, automatic.ok));
    const priorResult = prior?.results.find(r => r.id === c.id);
    const regressions = priorResult ? findRegressions(priorResult, {passed, scores}) : [];
    return { id:c.id, passed, scores:scoreValid ? scores : null, total, automatic, regressions, criteria: { mustKeep: c.mustKeep, mustAvoid: c.mustAvoid }, response: hasResponse ? record.response : null, notes:record?.notes || '', responsePresent:Boolean(hasResponse) };
  });
  const summary = {
    total:cases.length,
    passed:results.filter(r => r.passed).length,
    failed:results.filter(r => !r.passed).length,
    regressions:results.filter(r => r.regressions.length).length,
    ready:results.every(r => r.passed && r.regressions.length === 0)
  };
  const report = {
    kind:'document-writer-evaluation',
    skillRevision:submitted.skillRevision || null,
    model:submitted.model || null,
    reviewer:submitted.reviewer || null,
    baseline:priorPath || null,
    generatedAt:new Date().toISOString(),
    summary,
    results
  };
  const output = resolve(option('--output'));
  mkdirSync(dirname(output), {recursive:true});
  writeFileSync(output, JSON.stringify(report, null, 2) + '\n', 'utf8');
  console.log(JSON.stringify({output, summary}, null, 2));
  if (!summary.ready) process.exitCode = 1;
}
try { main(); } catch (error) { console.error('EVAL ERROR: ' + error.message); process.exitCode = 2; }
