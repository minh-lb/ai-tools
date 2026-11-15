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
  const content = readFileSync(file, 'utf8');
  const links = content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g);
  for (const [, target] of links) {
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    const dest = path.resolve(path.dirname(file), target.split('#')[0]);
    assert.ok(dest.startsWith(root + path.sep), 'Link escapes root: ' + file);
    assert.ok(existsSync(dest), 'Broken link: ' + file + ' -> ' + target);
  }
}
const scenarios = readFileSync(path.join(root, 'eval/scenarios.md'), 'utf8');
for (let n = 1; n <= 12; n++) {
  assert.match(scenarios, new RegExp('E' + String(n).padStart(2, '0') + ' \\|'));
}
console.log('PASS: required files, skill metadata, legacy removal, links, 12 eval scenarios');
