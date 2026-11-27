import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const runner = resolve(fileURLToPath(new URL('../eval/live.mjs', import.meta.url)));
function spawnNode(args, env) {
 return new Promise(resolve => {
  const c=spawn(process.execPath,[runner,...args],{env:{...process.env,...env}});
  let out='';c.stdout.on('data',d=>out+=d);c.stderr.on('data',d=>out+=d);
  c.on('close',code=>resolve({code,out}));
 });
}
test('live A/B runner isolates conditions, stores evidence, and rejects missing credentials', async () => {
 const dir=mkdtempSync(join(tmpdir(),'live-eval-test-'));
 const cases=[
  {id:'E07',prompt:'Return only JSON with keys status and reason. status=blocked; reason=missing approval.',mustKeep:'exact JSON',mustAvoid:'code fence',automatic:{type:'jsonExact',value:{status:'blocked',reason:'missing approval'}}},
  {id:'E09',prompt:'Extract only this string, verbatim: ERR_AUTH_403',mustKeep:'exact string',mustAvoid:'explanation',automatic:{type:'textExact',value:'ERR_AUTH_403'}},
  {id:'E25',prompt:'Vậy có thể nói hiệu năng đã cải thiện chưa?',messages:[
    {role:'user',content:'Redis mới là đề xuất và chưa đo hiệu năng.'},
    {role:'assistant',content:'Đúng, hiện chưa có số liệu đo.'},
    {role:'user',content:'Vậy có thể nói hiệu năng đã cải thiện chưa?'}
  ],mustKeep:'Chưa có bằng chứng',mustAvoid:'Bịa số liệu'}
 ];
 writeFileSync(join(dir,'cases.json'),JSON.stringify(cases));
 writeFileSync(join(dir,'SKILL.md'),'---\nname: document-writer\n---\n# Readable output\n');
 const seen=[];
 let degradeCandidate=false;
 let candidateAnswer='Chưa, vì chưa có kết quả đo hiệu năng.';
 writeFileSync(join(dir,'old.md'),'---\nname: document-writer\n---\n# Older output\n');
 const server=createServer(async (req,res)=>{
  let raw='';for await(const buf of req)raw+=buf;
  const body=JSON.parse(raw);seen.push(body);
  const dev=body.input[0]?.content||'';
  let text;
  if(dev.includes('blind quality evaluator')) text=JSON.stringify({scores:{relevance:2,clarity:degradeCandidate&&JSON.parse(body.input.at(-1).content).response==='Candidate regression'?1:2,accuracy:2,contract:2},notes:'Fixture-only scoring; not a real model.'});
  else if(body.input.at(-1).content.includes('JSON'))text='{"status":"blocked","reason":"missing approval"}';
  else if(body.input.at(-1).content.includes('ERR_AUTH_403'))text='ERR_AUTH_403';
  else text=dev.includes('# Readable output')?candidateAnswer:'Chưa, vì chưa có kết quả đo hiệu năng.';
  res.writeHead(200,{'content-type':'application/json'});
  res.end(JSON.stringify({output:[{content:[{type:'output_text',text}]}]}));
 });
 try {
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const url='http://127.0.0.1:'+server.address().port+'/v1';
  const common=['--model','fixture','--judge-model','fixture-judge','--cases',join(dir,'cases.json'),'--skill',join(dir,'SKILL.md'),'--out-dir',join(dir,'results'),'--api-base',url];
  const noKey=await spawnNode(common,{OPENAI_API_KEY:''});
  assert.equal(noKey.code,2);assert.match(noKey.out,/OPENAI_API_KEY/);
  const dry=await spawnNode([...common,'--dry-run'],{OPENAI_API_KEY:''});
  assert.equal(dry.code,0);assert.match(dry.out,/'liveRequests': 0|"liveRequests": 0/);
  const run=await spawnNode(common,{OPENAI_API_KEY:'fixture-only'});
  assert.equal(run.code,0,run.out);
  const baseline=JSON.parse(readFileSync(join(dir,'results/baseline.responses.json')));
  const candidate=JSON.parse(readFileSync(join(dir,'results/candidate.responses.json')));
  const comparison=JSON.parse(readFileSync(join(dir,'results/comparison.json')));
  assert.equal(baseline.results.length,3);
  assert.equal(candidate.results.length,3);
  assert.equal(candidate.results.every(x=>x.automaticPass),true);
  assert.equal(comparison.comparison.length,3);
  assert.equal(comparison.comparison.every(x=>x.lengthDelta===0 && x.shorterWithQualityPreserved===false && Number.isInteger(x.baselineHeadings) && Number.isInteger(x.candidateHeadings)),true);
  assert.equal(seen.length,12);
  assert.equal(seen.filter(x=>x.input[0].content.includes('document-writer skill')).length,3);
  assert.equal(seen.filter(x=>x.input[0].content.includes('blind quality evaluator')).length,6);
  assert.equal(seen.filter(x=>x.input.length===4 && x.input.at(-1).content==='Vậy có thể nói hiệu năng đã cải thiện chưa?').length,2,'prior conversation must be separate turns in both arms');
  assert.equal(seen.every(x=>x.store===false),true);
  assert.equal(comparison.ready,true);
  assert.equal(baseline.skillRevision,'no-skill');
  assert.notEqual(candidate.skillRevision,baseline.skillRevision);

  seen.length=0;
  degradeCandidate=true;
  candidateAnswer='Candidate regression';
  const priorRun=await spawnNode([...common,'--baseline-skill',join(dir,'old.md')],{OPENAI_API_KEY:'fixture-only'});
  assert.equal(priorRun.code,1,priorRun.out);
  const report=JSON.parse(readFileSync(join(dir,'results/comparison.json')));
  assert.equal(report.ready,false);
  assert.equal(report.regressionCount,1);
  assert.equal(report.candidate.passed,3,'a passing score regression still fails the gate');
  assert.equal(seen.filter(x=>x.input[0].content.includes('# Older output')).length,3);
  assert.equal(seen.filter(x=>x.input[0].content.includes('# Readable output')).length,3);
  assert.notEqual(report.baselineRevision,report.candidateRevision);
 } finally {
  await new Promise(r=>server.close(r));rmSync(dir,{recursive:true,force:true});
 }
});
