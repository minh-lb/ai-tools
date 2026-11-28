# Adaptive Writing Style

Choose a style from the intended audience, purpose, and explicit output contract. These are defaults, not templates or extra required sections. Do not infer facts from the examples. When genres overlap, use the style that best supports the reader's action.

| Document | Style | Avoid |
|---|---|---|
| Business Requirement | Business vocabulary; state rules, roles, conditions and effects in language stakeholders use. Explain rationale when it affects a decision. | Infrastructure details, generic business benefits. |
| SRS | Unambiguous, testable requirements; consistent actors, states and normative verbs. Distinguish required, optional and unresolved. | Vague adjectives, ambiguous pronouns, changing requirement strength to sound natural. |
| Basic Design | Explain the user/business flow in chronological or logical order; group permissions and exceptions near the relevant step. | Repeating the same rule in overview, flow and conclusion; premature implementation detail. |
| Technical Design | Precise engineering terms; mechanisms, boundaries, failure behavior, constraints and material trade-offs. | Introductory tutorials for engineers, invented mechanisms, unexplained project-specific abbreviations. |
| User Guide / Runbook | Direct instructions, explicit prerequisites, actions, outcomes and exception branches. Use numbered steps only when sequence matters. | Passive, vague directions; unsafe compression; unnecessary background. |
| README | Purpose, actual prerequisites, verified setup/usage and relevant limitations; retain exact commands. | Marketing, duplicated reference documentation, invented commands. |
| Status / Review Report | Outcome, evidence, impact and blocker or action when relevant; concise, neutral, concrete. | Process narration, inflated severity, claims beyond evidence. |

## Natural language and flow

- Write in the requested language and register. Keep established technical terms when they serve the reader, and use natural phrasing around them. For mixed audiences, explain the effect first and give the original term once if it helps readers recognize or look it up. See [plain language](plain-language.md) for an example.
- Prefer actor + action + condition + outcome where useful, not an obligatory sentence formula. Connect related sentences by actual relationships (sequence, cause, exception, contrast). Avoid mechanical transitions and repeated mini-summaries.
- Prefer active voice when it clarifies responsibility. Passive voice is fine when the actor is unknown or irrelevant. Use imperative language for actions and normative language for requirements; do not vary mandatory terms merely for variety.
- Use prose for explanation, lists for discrete rules or steps, tables for meaningful comparisons or mappings. Do not force prose for testable requirements or force headings for every sentence.
- Keep formal documents formal, and everyday instructions approachable. Do not imitate errors, fabricate personal experience, or use tricks intended to disguise AI authorship. Provided samples guide voice, not facts; explicit user and artifact contracts override these defaults.

## Editorial examples (illustrative, not test results)

| Genre | Less useful | Better |
|---|---|---|
| Business | Chức năng nhằm tối ưu hóa quy trình và tăng cường hiệu quả quản lý hóa đơn. | Quản lý kiểm tra hóa đơn trước khi phát hành. |
| SRS | Hệ thống nên đảm bảo người thuê chỉ xem được hóa đơn phù hợp. | Người thuê chỉ được xem hóa đơn đã phát hành thuộc phòng của mình. |
| Technical | Hệ thống thực hiện việc sử dụng SQS để tối ưu quá trình xử lý. | Worker đọc message từ SQS để gửi email. |
| Guide | Việc xác nhận sẽ cần được tiến hành trước khi thực hiện thao tác xóa. | Xác nhận trước khi xóa. |
| Report | Quá trình kiểm thử đã được thực hiện một cách thành công đối với unit test. Nhóm chưa tiến hành E2E. | Các unit test đã chạy thành công. Nhóm chưa chạy E2E. |

The better examples assume the corresponding facts are supplied. Never add missing conditions, results, or decisions to achieve a more natural sentence.

## Style check

Flag concrete friction: awkward or generic phrasing that obscures meaning, a register unsuited to the audience, inconsistent terms, disconnected reasoning, or formatting that makes rules hard to locate. Cite the affected text and explain its effect. A material style issue requires correction; subjective preferences and harmless wording variation do not. Style must never override factual fidelity, mandated format, or completeness.
