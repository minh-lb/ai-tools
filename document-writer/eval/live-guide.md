# Live A/B evaluation for document-writer

The runner compares the same model and test prompts in two independent requests: baseline without skill instructions (or an older SKILL.md via --baseline-skill), candidate with SKILL.md explicitly loaded. A separate blind judge scores the answers; strict JSON and verbatim checks run automatically.

## Run locally

Prerequisites: Node.js 22+, outbound HTTPS access, and a valid OPENAI_API_KEY held in the runtime environment (never commit credentials).

```bash
node document-writer/tests/validate.mjs
node --test document-writer/tests/live.test.mjs
node document-writer/tests/eval-runner.mjs

# Validate setup without sending any model request:
node document-writer/eval/live.mjs --model <supported-model-id> --dry-run

# 36-case A/B evaluation; uses 72 generation and 72 judge requests:
node document-writer/eval/live.mjs --model <supported-model-id> --judge-model <supported-judge-model-id> --out-dir ./document-writer-eval-results

# Compare against a previous version (save the old SKILL.md first):
node document-writer/eval/live.mjs --model <supported-model-id> --judge-model <supported-judge-model-id> --baseline-skill /path/to/old-SKILL.md --out-dir ./document-writer-version-comparison
```

Results: baseline.responses.json, candidate.responses.json and comparison.json in the output directory. Each answer includes judge scores, comments, automatic-format checks and complete response text.

Exit codes: 0 = selected judged cases pass without regressions, or an ungraded collection with no automatic failure; 1 = candidate automatic/quality failure or score regression; 2 = execution/configuration error. Without a judge, ready is null (not a quality pass). A partial run is not a full-suite pass. Reports record separate skill fingerprints and the cases fingerprint.

## Interpret results

- E30–E36 test full-document economy. Compare character counts and section counts only alongside semantic scores and pass status; shorter failing answers are not improvements.
- Compare factual accuracy, preservation of business conditions, natural wording, conversational continuity, response depth, noise reduction and format compliance; do not reward shorter answers that lose material information.
- E25–E26 supply fixed prior user/assistant turns in both conditions, not a fully free-form conversation.
- Blind AI judging is fallible. Manually review all failures and representative successes before treating a result as confirmed.
- The runner loads only the core SKILL.md. It measures quality with the skill explicitly loaded; it does not verify whether a real agent automatically activates the skill or loads optional references.
- A single run is preliminary; repeat tests to assess consistency. Record the same model settings and skill revision.
- The mocked test does not call a real AI model and cannot establish behavior improvements.
- Without API credentials or outbound network access, a live run is blocked. Do not describe a dry-run or mock run as real model evaluation.

## Data safety

Only use fictional, non-sensitive eval prompts unless an approved data-handling arrangement exists. The script sends model input and answers to the selected API endpoint with store=false, but service retention policies still apply. Do not commit generated outputs if they may contain sensitive material.
