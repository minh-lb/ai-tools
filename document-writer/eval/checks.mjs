export function autoCheck(caseDef, response) {
  if (!caseDef.automatic) return { ok: true, check: 'manual semantic review required' };
  if (caseDef.automatic.type === 'textExact') {
    return { ok: response === caseDef.automatic.value, check: 'exact text' };
  }
  if (caseDef.automatic.type === 'maxLines') {
    return { ok: response.trim().split(/\r?\n/).length <= caseDef.automatic.value, check: 'maximum lines' };
  }
  if (caseDef.automatic.type === 'headingsExact') {
    // The contract is exact ATX Markdown headings; ignore headings in fenced code.
    const headings = [];
    let fence = null;
    for (const line of response.split(/\r?\n/)) {
      const marker = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
      if (fence) {
        if (marker && marker[1][0] === fence[0] && marker[1].length >= fence.length && !marker[2].trim()) fence = null;
        continue;
      }
      if (marker) { fence = marker[1]; continue; }
      if (/^ {0,3}#{1,6}(?:\s|$)/.test(line)) headings.push(line.trim());
    }
    return { ok: JSON.stringify(headings) === JSON.stringify(caseDef.automatic.value), check: 'exact ATX headings and order' };
  }
  if (caseDef.automatic.type === 'jsonExact') {
    try {
      const got = JSON.parse(response);
      const expected = caseDef.automatic.value;
      const ok = got !== null && typeof got === 'object' && !Array.isArray(got)
        && Object.keys(got).length === Object.keys(expected).length
        && Object.keys(expected).every(k => Object.hasOwn(got, k) && got[k] === expected[k]);
      return { ok, check: 'exact JSON keys and values' };
    } catch {
      return { ok: false, check: 'invalid raw JSON' };
    }
  }
  return { ok: false, check: 'unknown automatic check type' };
}

export const SCORE_KEYS = ['relevance', 'clarity', 'accuracy', 'contract'];
export function validScores(scores) {
  return Boolean(scores && SCORE_KEYS.every(k => Number.isInteger(scores[k]) && scores[k] >= 0 && scores[k] <= 2));
}
export function passes(caseDef, scores, automaticPass) {
  return validScores(scores) && automaticPass && scores.accuracy === 2 && scores.contract === 2 &&
    scores.relevance >= (caseDef.documentEconomy ? 2 : 1) && scores.clarity >= 1;
}
export function regressions(baseline, candidate) {
  const issues = [];
  if (baseline.passed && !candidate.passed) issues.push('previously passed case now fails');
  if (validScores(baseline.scores) && validScores(candidate.scores)) {
    for (const k of SCORE_KEYS) if (candidate.scores[k] < baseline.scores[k])
      issues.push(k + ' decreased from ' + baseline.scores[k] + ' to ' + candidate.scores[k]);
  }
  return issues;
}
