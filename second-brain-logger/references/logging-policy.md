# Logging policy — preserve evidence and solution, not transcripts

A log should let a future agent reconstruct the *engineering approach* without recreating private model reasoning or reading the whole chat.

## Required causal narrative

1. **Problem**: observed symptom or intended improvement, short enough to avoid duplicating repository requirements.
2. **Investigation**: what was inspected, which hypotheses were checked, findings (verified vs suspected), and evidence (test/trace/file/commit).
3. **Implementation**: touched files/functions; the significant before/after behavior and mechanism by which changes solve the problem. Include data flow or tradeoffs only when material. No giant diff.
4. **Decisions**: for each **actual significant choice**, owner, approval, engineering rationale, observed supporting facts, impact, and alternatives **only if truly evaluated**. Label `autonomous`, `user_directed`, `user_approved`, or `proposed` accurately.
5. **Verification**: commands/tests/checks **actually run** and their observed results, with failures or missing coverage. No “passed” if not executed.
6. **Outcome**: completed, partial, failed, or aborted; delivered state, unresolved risk, next action, and reusable lesson only if supported.

Short fixes may have one compact paragraph or a few bullets per section. Complex investigations can include ordered evidence-driven steps. Important decisions must be explainable from external engineering evidence, **not from claims about hidden chain-of-thought**.

## Checkpoints and completion

- During long tasks, retain key observed events as the agent works. If **atomic create + guarded update** are exposed by MCP, store a short `in_progress` note and update at natural milestones. No per-command logging.
- If guarded update is missing, prepare a complete final log in-session and use create-only once at finish. A hard interruption can lose this record; report the limitation honestly.
- For partial/failed work, describe completed actions, exact blockers, and any tests that failed. Do not exaggerate delivery.
- When multiple agents work on a task, note which agent took each step when observed; do not attribute unobserved reasoning. Separate run logs to avoid shared editing.

## Do not store

Credentials, tokens, secrets, API keys, personal/customer data, private chat content, unreduced tool dumps, entire stack traces, whole source files, large code diffs, speculative root causes as fact, or other projects' notes. Redact sensitive snippets before using MCP; if redaction cannot make data safe, do not store it.
