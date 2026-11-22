# Behavior Evaluation — Plain Language and Noise Filtering

**Source of truth:** [cases.json](cases.json) contains 29 prompts (E01–E29), including Vietnamese, long noisy inputs, preservation of business conditions, exact-output contracts and untrusted quotes.

| Group | Cases | What they challenge |
|---|---|---|
| Plain-language explanation | E01, E05, E12, E18 | Non-developer comprehension; no invented mechanisms |
| Fidelity and evidence | E02, E03, E04, E08, E10 | Keep conditions, uncertainty, statuses and accurate comparisons |
| Exact output and source safety | E06, E07, E09, E11 | Do not invent commands, add wrappers, or follow quoted instructions |
| Long/noisy Vietnamese source | E13, E14, E15, E16, E17 | Remove background and repetition; preserve permissions, risks, outcomes and unknowns |
| Natural writing and editorial review | E19, E20, E21, E22 | Remove stiff phrasing, avoid forced lists, respect voice and retain conditions |
| Adaptive depth and reader expertise | E23, E24, E28, E29 | Brief when sufficient; complete for consequential decisions; one-line contract |
| Conversational continuity and judgment | E25, E26, E27 | Use prior-turn context without repetition and challenge unsafe assumptions |

## Evaluation workflow

1. Enable the skill and run **each scenario** from cases.json with the same model/settings being tested. For cases with `messages`, send them as separate prior user/assistant turns and the final user question, not as a flattened transcript. Record the complete response verbatim, model and skill revision.
2. Independently evaluate the actual response against that case's **mustKeep** / **mustAvoid** criteria. Give 0–2 for each: relevance, clarity, accuracy, contract. Include notes/evidence for scores below 2 and any unsupported claim.
3. Run [the evaluator](run.mjs) on the collected results. The evaluator checks scores and exact JSON/verbatim outputs automatically, **saves a report**, and can compare with a previous report to flag regressions. It cannot automatically judge all semantic nuances.
4. Review failures and regressions; adjust the skill then rerun the same scenarios. **Do not mark an unrun case as passed.**

Cases E25–E26 use fixed prior turns; they do not simulate an organically generated conversation. Evaluate whether the answer uses that history without repetition.

**Pass:** accuracy and contract both 2; relevance and clarity each at least 1; no automatic check failure or invented material fact. Target is 8/8. A lower score compared with the baseline is a regression even when the case still meets the minimum.

## Input format

Store a JSON file containing all 29 results. Each item needs a real response and human-review scores:

```json
{
  "skillRevision": "<tested commit>",
  "model": "<actual model>",
  "reviewer": "<reviewer>",
  "results": [
    {
      "id": "E01",
      "response": "<actual model response>",
      "scores": { "relevance": 2, "clarity": 2, "accuracy": 2, "contract": 2 },
      "notes": "Explanation of the scores, if needed"
    }
  ]
}
```

The single result above is an **illustration**, not a valid full-suite PASS or a claimed model result. Results missing a score or scenario cannot pass.

## Commands

```bash
node document-writer/tests/validate.mjs
node document-writer/tests/eval-runner.mjs
node document-writer/eval/run.mjs --input /path/to/evaluated-responses.json --output /path/to/report.json
node document-writer/eval/run.mjs --input /path/to/new-responses.json --output /path/to/new-report.json --baseline /path/to/previous-report.json
```

This workflow does not require a particular model provider or paid evaluation service; it processes **actual model outputs collected separately**. The runner does not generate model responses, does not treat human scores as automatic truth, and does not publish reports to the repository by default.

## Live model A/B test

Use [the live evaluation guide](live-guide.md) to compare baseline and explicitly loaded skill responses. Unlike the mocked tests, this requires real API credentials and outbound network access.
