import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read=p=>readFileSync(resolve(root,p),'utf8');
const skill=read('SKILL.md'), consent=read('references/publication-consent.md'),
  delivery=read('references/pull-request.md'), output=read('references/output-delivery.md'),
  template=read('templates/review-report.template.md'), history=read('references/review-history.md'),
  snapshot=read('references/review-snapshot.md');

// These tests check static instructions, not agent execution.
test('PR/MR review defaults to read-only; publication requires preview and consent',()=>{
  assert.match(skill,/read-only by default/i);
  assert.match(skill,/preview first/i);
  assert.match(delivery,/never post anything merely because review was requested/i);
  assert.match(consent,/full text of EVERY planned comment/i);
  assert.match(consent,/unambiguous consent/i);
});
test('comment, reply, resolve and approve are independently permissioned',()=>{
  for(const op of ['POST COMMENTS','REPLY','RESOLVE THREADS','APPROVE'])
    assert.ok(consent.includes(op),op);
  assert.match(delivery,/only if REPLY was authorized/i);
  assert.match(delivery,/only if RESOLVE THREADS was authorized/i);
  assert.match(delivery,/never automatic/i);
});
test('material snapshot drift requires fresh preview and consent',()=>{
  assert.match(snapshot,/new preview requiring fresh permission/i);
  assert.match(consent,/request fresh permission/i);
  assert.match(delivery,/re-preview\/reconfirm/i);
});
test('Ready can retain evidenced nonblocking Low without auto approval',()=>{
  assert.match(skill,/Ready permits evidenced Low nonblocking/i);
  assert.match(delivery,/Evidenced Low nonblocking issues may remain/i);
  assert.match(delivery,/Provider `APPROVE` is \*\*never automatic\*\*/i);
  assert.match(history,/separate user consent/i);
});
test('GitHub PR and GitLab MR fallback requires explicit permission',()=>{
  assert.match(delivery,/GitHub Pull Request.*GitLab Merge Request/i);
  assert.match(delivery,/base_sha.*start_sha.*head_sha/s);
  assert.match(delivery,/explicit fallback permission/i);
  assert.match(delivery,/unposted/i);
});
test('reports real verification and scope even without findings',()=>{
  assert.match(output,/Scope & Verification/);
  assert.match(template,/### 🔎 Scope & Verification/);
  assert.match(output,/even with zero Problems/i);
  assert.match(template,/Chưa chạy kiểm thử runtime/);
});
test('frontmatter and bundled relative references exist',()=>{
  assert.match(skill,/^---\nname: reviewer\n/m);
  assert.match(read('agents/openai.yaml'),/allow_implicit_invocation: false/);
  let checked=0;
  for(const p of ['SKILL.md','README.md','references/pull-request.md',
    'references/output-delivery.md','references/review-process.md',
    'references/review-history.md','references/review-snapshot.md',
    'references/publication-consent.md']){
    for(const match of read(p).matchAll(/\]\(([^)]+)\)/g)){
      const link=match[1].split('#')[0];
      if(!link||/^[a-z]+:\/\//i.test(link))continue;
      const target=resolve(root,dirname(p),link);
      assert.ok(target.startsWith(root+'/')&&existsSync(target),p+' -> '+link);
      checked++;
    }
  }
  assert.ok(checked>=15);
});

test('approval action is named consistently in the process instructions',()=>{
  const process=read('references/review-process.md');
  assert.doesNotMatch(process,/APPPROVE/i);
  assert.match(process,/APPROVE requires separately previewed explicit consent/i);
});
