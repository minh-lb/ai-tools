/** A/B test an explicitly loaded document-rule with OpenAI Responses API.
 * This does not test automatic skill activation by an agent harness.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const dir = dirname(fileURLToPath(import.meta.url));
const root = resolve(dir, '..');
const args = process.argv.slice(2);
const get = (name, fallback = null) => {
  const i = args.indexOf(name);
  return i < 0 ? fallback : args[i + 1];
};
const has = (name) => args.includes(name);
const parse = file => JSON.parse(readFileSync(resolve(file), 'utf8'));
const model = get('--model', process.env.OPENAI_MODEL);
const judgeModel = get('--judge-model');
const outDir = resolve(get('--out-dir', './document-rule-eval-results'));
const casesFile = resolve(get('--cases', resolve(dir, 'cases.json')));
const skillFile = resolve(get('--skill', resolve(root, 'SKILL.md')));
const apiBase = get('--api-base', 'https://api.openai.com/v1').replace(/\/$/, '');
const key = process.env.OPENAI_API_KEY;
const limit = get('--limit') === null ? Infinity : Number(get('--limit'));
const instructions = 'Answer the user accurately. Follow their requested scope and output format. Never invent source facts.';
const rubric = 'You are a blind quality evaluator. You do NOT know whether the response was produced with a skill. Evaluate against the user task and explicit mustKeep/mustAvoid.\nGive integer scores 0, 1, or 2 for relevance, clarity, accuracy, contract.\nrelevance=2 only if directly useful without noise; clarity=2 only if understandable to the intended reader, natural and coherent, without boilerplate or forced lists; accuracy=2 only if no unsupported facts and no lost important conditions; contract=2 only if the user\'s scope and output constraints are met.\nIf unsure about facts not present in the input, do not award accuracy=2. Quote brief, concrete reasons.\nRespond ONLY as valid JSON: {"scores":{"relevance":0,"clarity":0,"accuracy":0,"contract":0},"notes":"short explanation"}. Do not add other keys.';
function extract(data) {
  if (typeof data.output_text === 'string' && data.output_text.trim()) return data.output_text;
  const parts = (data.output || []).flatMap(item => (item.content || []).filter(x => x.type === 'output_text').map(x => x.text));
  const text = parts.join('');
  if (!text.trim()) throw new Error('Responses API returned no output_text');
  return text;
}
async function callApi(input, whichModel) {
  const response = await fetch(apiBase + '/responses', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: whichModel, input, store: false }),
    signal: AbortSignal.timeout(120000)
  });
  if (!response.ok) throw new Error('Responses API HTTP ' + response.status + ': ' + (await response.text()).slice(0, 300));
  return extract(await response.json());
}
async function judge(c, response) {
  const raw = await callApi([
    {role:'developer',content:rubric},
    {role:'user',content:JSON.stringify({userPrompt:c.prompt,mustKeep:c.mustKeep,mustAvoid:c.mustAvoid,response})}
  ], judgeModel);
  let j;
  try { j = JSON.parse(raw); } catch { throw new Error('Judge output was not JSON for ' + c.id); }
  for (const k of ['relevance','clarity','accuracy','contract']) {
    if (!Number.isInteger(j?.scores?.[k]) || j.scores[k] < 0 || j.scores[k] > 2) throw new Error('Invalid judge score for '+ c.id + ':' + k);
  }
  return {scores:j.scores,notes:typeof j.notes==='string'?j.notes:''};
}
function checkAutomatic(c, response) {
  if (!c.automatic) return true;
  if (c.automatic.type === 'textExact') return response === c.automatic.value;
  if (c.automatic.type === 'jsonExact') {
    try {
      const j=JSON.parse(response), exp=c.automatic.value;
      return j!==null && typeof j==='object' && !Array.isArray(j) && Object.keys(j).length===Object.keys(exp).length && Object.keys(exp).every(k=>Object.hasOwn(j,k)&&j[k]===exp[k]);
    } catch { return false; }
  }
  return false;
}
function summary(results) {
  if (!judgeModel) return {total:results.length, judged:0, passed:null};
  const passed=results.filter(r => r.scores?.accuracy===2 && r.scores?.contract===2 && r.scores?.relevance>=1 && r.scores?.clarity>=1 && r.automaticPass).length;
  return {total:results.length,judged:results.length,passed};
}
function save(file,obj){mkdirSync(outDir,{recursive:true});writeFileSync(resolve(outDir,file),JSON.stringify(obj,null,2)+'\n');}
async function main(){
  if(!model || typeof model!=='string' || model.startsWith('--'))throw new Error('Specify --model MODEL or OPENAI_MODEL');
  if(!Number.isInteger(limit) && limit!==Infinity || limit<=0)throw new Error('--limit must be a positive integer');
  const cases=parse(casesFile);
  if(!Array.isArray(cases) || !cases.length)throw new Error('No cases available');
  const selected=cases.slice(0,limit);
  const skill=readFileSync(skillFile,'utf8');
  if(!skill.includes('name: document-rule'))throw new Error('Invalid skill source');
  const revision=createHash('sha256').update(skill).digest('hex').slice(0,12);
  if(has('--dry-run')){
    console.log(JSON.stringify({mode:'dry-run',cases:selected.length,model,judgeModel:judgeModel||null,skillSha256:revision,apiKeyConfigured:!!key,liveRequests:0},null,2));
    return;
  }
  if(!key)throw new Error('OPENAI_API_KEY is not configured; cannot run live model evaluation');
  const baseline=[], candidate=[];
  for(const [i,c] of selected.entries()){
    for(const arm of (i%2===0?['baseline','candidate']:['candidate','baseline'])){
      const dev=instructions + (arm==='candidate'?'\n\nThe following is the document-rule skill, to apply when relevant:\n'+skill:'');
      const response=await callApi([{role:'developer',content:dev},{role:'user',content:c.prompt}],model);
      const auto=checkAutomatic(c,response);
      const rated=judgeModel?await judge(c,response):{scores:undefined,notes:'Not graded; run with --judge-model or review manually'};
      (arm==='baseline'?baseline:candidate).push({id:c.id,response,scores:rated.scores,notes:rated.notes,automaticPass:auto});
    }
    console.log('Completed '+(i+1)+'/'+selected.length+': '+c.id);
  }
  const sorted=(list)=>list.sort((a,b)=>a.id.localeCompare(b.id));
  sorted(baseline);sorted(candidate);
  const metadata={skillRevision:revision,model,judgeModel:judgeModel||null,source:'live OpenAI Responses API',cases:selected.length,fullSuite:selected.length===cases.length};
  save('baseline.responses.json',{...metadata,reviewer:judgeModel?'blind AI judge':'manual review needed',results:baseline});
  save('candidate.responses.json',{...metadata,reviewer:judgeModel?'blind AI judge':'manual review needed',results:candidate});
  const comparison=selected.map(c=>{
    const a=baseline.find(r=>r.id===c.id),b=candidate.find(r=>r.id===c.id);
    const score=r=>r.scores?Object.values(r.scores).reduce((s,n)=>s+n,0):null;
    return {id:c.id,baselineScore:score(a),candidateScore:score(b),delta:score(a)===null?null:score(b)-score(a),baselineLength:a.response.length,candidateLength:b.response.length,baselineAutomaticPass:a.automaticPass,candidateAutomaticPass:b.automaticPass};
  });
  save('comparison.json',{...metadata,baseline:summary(baseline),candidate:summary(candidate),comparison});
  console.log(JSON.stringify({result:'completed',...metadata,baseline:summary(baseline),candidate:summary(candidate),outputDirectory:outDir},null,2));
}
main().catch(e=>{console.error('LIVE EVAL NOT COMPLETE: '+e.message);process.exitCode=2;});
