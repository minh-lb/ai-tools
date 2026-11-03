## Trace method

1. **Find the real entry.** Search exact symbols/paths first, then registrations and direct callers. Verify relevant authorization/permission guards; do not infer their absence from partial results. For protected UI/API behavior, state the authorized session as a precondition when login is out of scope.
2. **Follow the executed path.** Record only decisions, transformations, validations, persistence, messages, side effects, and error behavior that affect the requested flow. Follow local catch/retry/rollback/mapping/acknowledgment logic before labeling an error terminal. A write or event publish is a side effect, not automatically the end of local execution.
3. **Classify each downstream call.**
   - **Internal:** its handler/source is in the project tree; trace it when it changes the requested behavior.
   - **External:** local evidence shows a remote/managed/separately deployed boundary; stop at that boundary and continue tracing the local caller after return when visible.
   - **Unresolved:** target/topology is not established; mark the exact cutoff and continue visible caller logic. Do not guess that a target is external.
   Do not descend into standard-library or third-party implementations. For a material external response, record only the local handling that is visible.
4. **Model asynchronous work honestly.** A publish/submit does not prove consumer completion. Trace an in-scope consumer as its own `Path` only when local registration and source are confirmed; never draw it as a synchronous continuation. Record acknowledgments, retries, dead-lettering, and other terminals only when supported by code.
5. **Stop at real outcomes.** Each path should reach a response, successful return, message acknowledgment, normal job/command completion, observable failure, external boundary with no local continuation, or a clearly labeled unresolved cutoff. If further work is out of scope, state why in open questions rather than presenting an incomplete path as end-to-end.
