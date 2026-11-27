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
  'references/writing-styles.md',
  'references/independent-reader-review.md',
  'examples/before-after.md',
  'eval/scenarios.md',
  'eval/reader-scenarios.md',
  'eval/cases.json',
  'eval/run.mjs',
  'eval/checks.mjs',
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
assert.match(skill, /^---\nname: document-writer\n/m);
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
assert.equal(ids.length,43);
assert.equal(new Set(ids).size,ids.length,'duplicate eval IDs');
for (let n=1;n<=43;n++) {
  const id = 'E' + String(n).padStart(2,'0');
  const c = scenarios.find(c=>c.id===id);
  assert.ok(c,'missing '+id);
  for (const field of ['prompt','mustKeep','mustAvoid']) {
    assert.ok(typeof c[field]==='string' && c[field].trim(),id+' missing '+field);
  }
}
for (const c of scenarios) {
  if (!c.messages) continue;
  assert.ok(Array.isArray(c.messages) && c.messages.length >= 3, c.id + ' needs prior turns');
  for (const [i, turn] of c.messages.entries()) {
    assert.equal(turn.role, i % 2 === 0 ? 'user' : 'assistant', c.id + ' invalid turn order');
    assert.ok(typeof turn.content === 'string' && turn.content.trim(), c.id + ' empty turn');
  }
  assert.equal(c.messages.at(-1).content, c.prompt, c.id + ' final turn must match prompt');
}
for (const id of ['E25','E26']) assert.ok(scenarios.find(c=>c.id===id)?.messages, id + ' missing conversation');
assert.deepEqual(scenarios.find(c=>c.id==='E28').automatic, {type:'maxLines',value:1});
assert.deepEqual(scenarios.find(c=>c.id==='E32').automatic, {type:'headingsExact',value:['## Phạm vi','## Quy tắc','## Ngoại lệ']});
assert.ok(scenarios.slice(29).every(c=>c.documentEconomy===true),'document cases must require full relevance');
const examples = readFileSync(path.join(root,'examples/before-after.md'),'utf8');
assert.ok((examples.match(/^## \d+\. /gm)||[]).length>=20,'need conversational examples');
assert.match(examples,/## 9\. Báo cáo công việc/);
assert.match(skill, /^## Human-like Writing$/m);
assert.match(skill, /^## Adaptive Writing Style$/m);
assert.ok(scenarios.slice(38).every(c=>c.styleSensitive===true),'style cases must require full clarity');
assert.match(skill, /^## Editorial Review \(internal\)$/m);
assert.match(skill, /^## Minimum Sufficient Documentation$/m);
assert.match(skill, /^## Adaptive Response Depth$/m);
assert.match(skill, /^## Conversational Behavior$/m);
assert.match(skill, /^## First-read Comprehension$/m);
assert.match(skill, /^## Independent Reader Review \(internal\)$/m);
const readerReview = readFileSync(path.join(root,'references/independent-reader-review.md'),'utf8');
assert.match(readerReview,/At most two independent review rounds/i);
assert.match(readerReview,/fresh isolated Reader/i);
assert.match(readerReview,/answer key outside Reader context/i);
assert.match(readerReview,/self-review/i);
const readerScenarios = readFileSync(path.join(root,'eval/reader-scenarios.md'),'utf8');
assert.deepEqual([...readerScenarios.matchAll(/^\| (R\d{2}) \|/gm)].map(m=>m[1]),Array.from({length:11},(_,i)=>'R'+String(i+1).padStart(2,'0')));
assert.match(examples, /## 16\. Biên tập văn phong/);
console.log('PASS: required files, links, 43 eval scenarios, conversational examples, legacy removal');
