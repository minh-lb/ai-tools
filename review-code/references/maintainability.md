# Maintainability

## Focus

Review whether the code in scope—and, in `git-diff` mode, the proposed change—keeps the system understandable, localizes complexity, and reduces future defect risk. Assess changed functions, methods, classes, and modules in `git-diff` mode; in `codebase` mode, assess the in-scope critical units and entry points for coherent responsibility and name/contract alignment.

## Inspect

- Naming clarity and domain vocabulary
- Function, method, class, and module responsibility: intended purpose versus actual behavior, cohesion, and unrelated reasons to change
- Function size, branching complexity, and hidden state
- Duplication of business logic or policy decisions
- Comment quality, dead code, and feature-flag cleanup
- Encapsulation, module boundaries, and readability
- Whether a new helper, component, dependency, configuration, or abstraction is needed or duplicates an existing project/platform capability
- Error messages and diagnostics for future debugging

## Review Questions

- Will another engineer understand the invariant or intent from the code itself?
- For each changed function/method/class (`git-diff`) or critical in-scope unit (`codebase`), does its name and contract match its actual work? Is the work cohesive, or does the unit combine unrelated responsibilities with different reasons to change?
- Does a method/class hide important side effects or require callers to know undocumented sequencing rules?
- Does the change duplicate logic that will drift later?
- Is complexity growing in the right place or leaking into callers?
- Are important assumptions encoded in code, or only implied by comments or tribal knowledge?
- Does the code make the next likely change safer or riskier?
- For each new feature or custom utility, what stated requirement or defect makes it necessary? Does the target codebase already contain a suitable function/component/service?
- Can the language standard library, browser/platform API, or existing framework/dependency meet the requirement without custom machinery?
- Is a suitable dependency already declared in the project's manifest/lockfile? If a new one is added, is it justified against existing/native alternatives and its maintenance/security/license/runtime cost?
- Would a direct one-line call or smaller working implementation be clearer and sufficient? If not, what concrete behavior justifies the extra abstraction?

## Red Flags

- Functions/classes that mix unrelated responsibilities (for example, parsing, policy, persistence, network calls, and presentation) so a small change risks breaking unrelated behavior or makes focused tests difficult
- Names or public contracts that promise one behavior while the implementation performs additional, surprising work or side effects
- Duplicate conditional logic spread across multiple call sites
- Generic helper abstractions that obscure business meaning
- A new utility/package/component that duplicates an existing project or platform feature without a concrete need
- Extra wrappers, options, layers, or extension points around behavior that a clear direct call or small implementation already handles
- A “shorter” one-liner that hides important behavior, or a minimal patch that removes necessary validation, error handling, security, or applicable accessibility controls
- Commented-out code, stale flags, or TODOs on critical paths
- Ambiguous naming that hides units, ownership, or lifecycle
- Error handling that loses original context

## Evidence

A maintainability finding should identify:

- The source of unnecessary complexity, responsibility mismatch, or duplication
- The concrete future risk it creates: inconsistent fixes, harder debugging, difficult focused testing, or defect-prone edits
- Why it is significant enough to raise during review
- Why the issue is more than a preference about function length or an abstract “single responsibility” rule

## Remediation Direction

- Split responsibilities along domain boundaries when that makes behavior easier to understand, test, and change; keep focused orchestration when the steps form one coherent use case
- Centralize duplicated rules behind a single owner
- Rename values to make units, scope, and lifecycle explicit
- Preserve error context and remove stale code paths
- Reuse a suitable project dependency, standard-library function, or native platform/framework feature before adding custom machinery
- Keep the implementation to the smallest complete solution; use a direct call when it remains clear, and retain useful structure when it makes behavior or safety explicit
