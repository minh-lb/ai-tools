# Standards and Research Basis

The skill's operational rules are self-contained in `SKILL.md` and its references; the links below are supplemental source notes, not prerequisites to use the skill. They do not replace approved product/API/data contracts, the target technology's current official documentation, or a formal security/accessibility/compliance assessment. Apply only the portions relevant to the actual system and versions in use.

## Public sources reviewed

- [Google Engineering Practices: What to look for in a code review](https://google.github.io/eng-practices/review/reviewer/looking-for.html) — design, intended functionality, complexity, tests, names, comments, consistency, documentation, and code health. Used as broad quality guidance, not as a claim that every coding task is a code review.
- **Robert C. Martin, _Clean Code_** — meaningful names, functions, classes/cohesion, and code smells. These are maintainability heuristics; do not impose disputed numeric size limits or treat every recommendation as universal.
- [Microsoft Azure Architecture Center: Web API Design Best Practices](https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design) — resource-oriented URI patterns, HTTP method semantics, representation, async operations, and compatibility considerations. It is practical guidance, not a universal mandate to use REST.
- [Google API Improvement Proposal 121: Resource-oriented design](https://google.aip.dev/121) — resources, hierarchies, standard methods, and stateless interactions. It is an approved Google API design standard and should not be imposed on APIs with a different contract/style.
- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html) — normative semantics for HTTP methods, status codes, headers, and caching.
- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) — schema/range validation and allow-listing where appropriate; validation is not a substitute for authorization or context-safe output handling.
- [OWASP SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) — parameterized query values, safe handling of dynamic identifiers, and least privilege.
- [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html) — endpoint access control, content types, safe errors, workflow-state checks, and credential handling.
- [OWASP API Security Top 10 (2023)](https://owasp.org/API-Security/editions/2023/en/0x11-t10/) and [OWASP ASVS](https://owasp.org/projects/asvs) — structured API and application security risks/verification prompts; not proof of compliance or absence of vulnerabilities.
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/) — detailed defensive guidance for relevant boundaries such as XSS, CSRF, SSRF, file uploads, authentication, logging, and secrets. Select the current cheat sheet for the actual implementation rather than copying a generic checklist blindly.
- [Docker Build best practices](https://docs.docker.com/build/building/best-practices/) and [Build secrets](https://docs.docker.com/build/building/secrets/) — trusted and maintained base images, narrow build contexts, reproducible updates, image composition, and safe handling of build-time credentials.
- [Terraform `plan` command](https://developer.hashicorp.com/terraform/cli/commands/plan) and [Terraform state](https://developer.hashicorp.com/terraform/language/state) — reviewable plans, fresh-plan checks, sensitive state, locking/access control, and supported state operations.
- [AWS CDK v2 best practices](https://docs.aws.amazon.com/cdk/v2/guide/best-practices.html) — simple infrastructure code, logical constructs, testing and deployment review, and environment separation. Apply AWS-specific details only to AWS CDK projects.
- [GNU Bash Reference Manual](https://www.gnu.org/software/bash/manual/bash.html) and [The Open Group POSIX.1-2024 Shell Command Language](https://pubs.opengroup.org/onlinepubs/9799919799/utilities/V3_chap02.html) — distinguish Bash from POSIX `sh` and verify quoting, expansion, execution, and exit-status semantics for the intended interpreter.
- [web.dev: Web Vitals](https://web.dev/articles/vitals) — user-centric loading, interaction, and visual-stability measurements, field/lab distinction, and current Core Web Vitals guidance. Metrics and thresholds may evolve; re-check before setting targets.
- [W3C Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/) — web accessibility success criteria. The product's target and conformance level must be established separately; partial checks do not prove conformance.

## Applying the guidance

Many coding principles are context-sensitive. Do not turn heuristics about naming casing, line counts, table width, join count, whether every class needs an interface, or whether a particular database constraint is always needed into universal rules. Confirm fit against the target repository, language/platform conventions, measurements, and authoritative documentation.

## Stack-specific sources

Reviewed on 2026-10-28. Match the target project's pinned version before copying APIs; Laravel 12.x here is a reviewed reference, not a required upgrade. Keep these links optional during normal coding.

- [React rules](https://react.dev/reference/rules) and [useEffect](https://react.dev/reference/react/useEffect): render purity, hooks, dependencies, and external synchronization.
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) and [data security](https://nextjs.org/docs/app/guides/data-security): client import boundaries, serialization, and server entry-point authorization. Caching/request APIs must be checked against the installed version.
- [TypeScript narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html): safe refinement, truthiness pitfalls, and discriminated unions; static types do not validate network data.
- [PHP type declarations](https://www.php.net/manual/en/language.types.declarations.php), [PSR-12](https://www.php-fig.org/psr/psr-12/), and [PER Coding Style](https://www.php-fig.org/per/coding-style/): native typing, calling-file strictness, and declared style standards. Follow the project's adopted style rather than silently migrating it.
- Laravel 12.x [validation](https://laravel.com/docs/12.x/validation), [authorization](https://laravel.com/docs/12.x/authorization), [Eloquent](https://laravel.com/docs/12.x/eloquent), and [queues](https://laravel.com/docs/12.x/queues): validated input, policies, mass assignment, and after-commit delivery.
- NestJS [validation](https://docs.nestjs.com/techniques/validation) and [injection scopes](https://docs.nestjs.com/fundamentals/injection-scopes): runtime DTO metadata/pipes and provider lifetime.

## Clean Code and SOLID interpretation

The complete operational guidance is bundled in [Code structure and Clean Code](code-structure-and-clean-code.md). Apply intent-revealing names, cohesive responsibilities, explicit side effects, focused contracts, and policy/detail separation directly from that reference.

Numeric function-size/argument targets, blanket polymorphism, and absolute exception preferences are not mandatory rules. Avoid over-engineering; OCP does not prohibit fixing existing code or deliberately changing a contract.
