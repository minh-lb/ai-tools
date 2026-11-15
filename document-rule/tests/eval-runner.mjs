import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const cases = JSON.parse(readFileSync(join(root,'eval/cases.json'),'utf8'));
const temp = mkdtempSync(join(tmpdir(),'document-rule-eval-'));
const script = join(root,'eval/run.mjs');
function run(input, report, baseline) {
  writeFileSync(join(temp,'input.json'), JSON.stringify(input));
  const args = [script,'--input',join(temp,'input.json'),'--output',join(temp,report)];
  if (baseline) args.push('--baseline',join(temp,baseline));
  const result = spawnSync(process.execPath,args,{encoding:'utf8'});
  return {code:result.status, output:result.stdout + result.stderr};
}
const full = {
  skillRevision:'fixture',
  model:'fixture-only',
  reviewer:'synthetic test, not model evaluation',
  results:cases.map(c=>({
    id:c.id,
    response:c.automatic?.type==='textExact' ? c.automatic.value : c.automatic?.type==='jsonExact' ? JSON.stringify(c.automatic.value) : 'Synthetic response: manually scored for runner test only.',
    scores:{relevance:2,clarity:2,accuracy:2,contract:2}
  }))
};
try {
  assert.equal(run(full,'base.json').code,0,'baseline fixture must pass runner mechanics');
  const base = JSON.parse(readFileSync(join(temp,'base.json'),'utf8'));
  assert.equal(base.summary.total,cases.length);
  assert.equal(base.summary.regressions,0);

  const degraded = structuredClone(full);
  degraded.results[0].scores.clarity=1;
  assert.equal(run(degraded,'degraded.json','base.json').code,1,'score reduction must fail on regression');
  const regression = JSON.parse(readFileSync(join(temp,'degraded.json'),'utf8'));
  assert.equal(regression.summary.regressions,1);

  const missing = structuredClone(full);
  missing.results.pop();
  assert.equal(run(missing,'missing.json').code,1,'missing scenario must not pass');

  const wrongJson = structuredClone(full);
  wrongJson.results.find(r=>r.id==='E07').response='```json\n{}\n```';
  assert.equal(run(wrongJson,'json-fail.json').code,1,'JSON-only contract must be checked');

  const invalid = structuredClone(full);
  delete invalid.results[0].scores.accuracy;
  assert.equal(run(invalid,'score-fail.json').code,1,'missing score must not pass');
  console.log('PASS: evaluator baseline, regression, incomplete, strict JSON, missing score');
} finally {
  rmSync(temp,{recursive:true,force:true});
}
