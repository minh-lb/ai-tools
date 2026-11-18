# Live A/B evaluation for document-rule

The runner compares the same model and test prompts in two independent requests: baseline without skill instructions, candidate with SKILL.md explicitly loaded. A separate blind judge scores the answers; strict JSON and verbatim checks run automatically.

## Run locally

Prerequisites: Node.js 22+, outbound HTTPS access, and a valid OPENAI_API_KEY held in the runtime environment (never commit credentials).

```bash
node document-rule/tests/validate.mjs
node --test document-rule/tests/live.test.mjs
node document-rule/tests/eval-runner.mjs

# Validate setup without sending any model request:
node document-rule/eval/live.mjs --model <supported-model-id> --dry-run

# 22-case A/B evaluation; uses 44 generation and 44 judge requests:
node document-rule/eval/live.mjs --model <supported-model-id> --judge-model <supported-judge-model-id> --out-dir ./document-rule-eval-results
```

Results: baseline.responses.json, candidate.responses.json and comparison.json in the output directory. Each answer includes judge scores, comments, automatic-format checks and complete response text.

## Interpret results

- Compare factual accuracy, preservation of business conditions, natural wording, noise reduction and format compliance; do not reward shorter answers that lose material information.
- Blind AI judging is fallible. Manually review all failures and representative successes before treating a result as confirmed.
- The runner loads only the core SKILL.md. It measures quality with the skill explicitly loaded; it does not verify whether a real agent automatically activates the skill or loads optional references.
- A single run is preliminary; repeat tests to assess consistency. Record the same model settings and skill revision.
- The mocked test does not call a real AI model and cannot establish behavior improvements.
- Without API credentials or outbound network access, a live run is blocked. Do not describe a dry-run or mock run as real model evaluation.

## Data safety

Only use fictional, non-sensitive eval prompts unless an approved data-handling arrangement exists. The script sends model input and answers to the selected API endpoint with store=false, but service retention policies still apply. Do not commit generated outputs if they may contain sensitive material.
