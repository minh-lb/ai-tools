# Discovery Checklist

Use this checklist when the business requirement is still fuzzy or distributed across code, tickets, UI, and user messages.

## 1. Business Context

- What business problem is being solved?
- What outcome does the stakeholder expect?
- What is in scope right now?
- What is explicitly out of scope?

## 2. Stakeholders And Actors

- Who requests or owns the feature?
- Who performs the workflow?
- Who approves, reviews, or monitors it?
- Which external systems participate?

## 3. Workflow Shape

- What event triggers the flow?
- What preconditions must already be true?
- What is the happy-path sequence?
- What alternate paths are valid?
- What exceptions or failure paths must be handled?
- What postconditions or side effects should exist at the end?

## 4. Business Rules

- What validations or eligibility rules apply?
- Which fields are required, optional, derived, or immutable?
- Are there thresholds, limits, statuses, approvals, or time windows?
- Are there notification, audit, retention, or reporting requirements?

## 5. Data And Integrations

- What inputs enter the flow?
- What outputs or artifacts are produced?
- Which APIs, databases, queues, files, or third-party systems are involved?
- Which entities or terms need a shared definition?

## 6. Non-Functional Concerns

- Are there permission or role constraints?
- Are there security, privacy, or compliance requirements?
- Are there SLA, latency, throughput, or availability expectations?
- Is traceability, idempotency, or audit history required?

## 7. Delivery Readiness

- What acceptance criteria would prove the workflow is correct?
- What assumptions are currently being made?
- What open questions still block confidence?
- What conflicts exist between docs, code, and stakeholder statements?
