import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const required = [
  'SKILL.md',
  'references/information-filtering.md',
  'references/plain-language.md',
  'references/output-formatting.md',
  'references/quality-checklist.md',
  'examples/before-after.md',
  'eval/scenarios.md',
  'eval/cases.json',
  'eval/run.mjs',
  'tests/eval-runner.mjs',
  'tests/live.test.mjs',
  'eval/live.mjs',
  'eval/live-guide.md',
];
const files = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const file = path.join(dir, name);
    if (statSync(file).isDirectory()) walk(file);
    else files.push(file);
  }
}
walk(root);
for (const file of required) assert.ok(existsSync(path.join(root, file)), file + ' is missing');
const skill = readFileSync(path.join(root, 'SKILL.md'), 'utf8');
assert.match(skill, /^---\nname: document-rule\n/m);
assert.match(skill, /communication\/output quality skill/i);
for (const dir of ['templates', 'references/plan', 'references/spec']) {
  assert.ok(!existsSync(path.join(root, dir)), 'Legacy workflow remains: ' + dir);
}
for (const file of files.filter(f => f.endsWith('.md'))) {
  const text = readFileSync(file, 'utf8');
  for (const [,target] of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    const dest = path.resolve(path.dirname(file), target.split('#')[0]);
    assert.ok(dest.startsWith(root + path.sep), 'Link escapes skill: ' + file);
    assert.ok(existsSync(dest), 'Broken link: ' + file + ' -> ' + target);
  }
}
const scenarios = JSON.parse(readFileSync(path.join(root,'eval/cases.json'),'utf8'));
const ids = scenarios.map(c=>c.id);
assert.equal(ids.length,22);
assert.equal(new Set(ids).size,ids.length,'duplicate eval IDs');
for (let n=1;n<=22;n++) {
  const id = 'E' + String(n).padStart(2,'0');
  const c = scenarios.find(c=>c.id===id);
  assert.ok(c,'missing '+id);
  for (const field of ['prompt','mustKeep','mustAvoid']) {
    assert.ok(typeof c[field]==='string' && c[field].trim(),id+' missing '+field);
  }
}
const examples = readFileSync(path.join(root,'examples/before-after.md'),'utf8');
assert.ok((examples.match(/^## \d+\. /gm)||[]).length>=16,'need bilingual rewrite examples');
assert.match(examples,/## 9\. Báo cáo công việc/);
assert.match(skill, /^## Human-like Writing$/m);
assert.match(skill, /^## Editorial Review \(internal\)$/m);
assert.match(examples, /## 16\. Biên tập văn phong/);
console.log('PASS: required files, links, 22 eval scenarios, natural-writing examples, legacy removal');
