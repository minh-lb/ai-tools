---
id: "<unique-task-id-or-uuid>"
title: "<Feature> — Implementation Plan"
type: implementation-plan
status: draft
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
tags: []
---
# <Feature> — Implementation Plan

> **Document status:** `draft` | **Baseline Spec:** <ID/version> | **Repository inspection:** <Verified/Not inspected>

## 1. Goal and Requirement Coverage

**Goal:** <State the concrete end outcome: target actor/system + specific behavior/state/artifact + key scope/constraint + observable success signal. Trace it to the baseline IDs. Avoid “implement/improve X” without an end state; if a fact is unknown, state the condition and blocker instead of guessing.>

**Coverage:** <FR/BR/NFR/AC IDs. Do not duplicate the full Specification.>

## 2. Baseline / Impact / Prerequisites

- Confirmed code paths: <only if inspected>
- Components to inspect: <if paths are unknown>
- Potential impact: <API/domain/persistence/security/tests>
- Dependencies/decisions: <...>
- Risk warnings: <only when applicable>

## 3. Ordered Tasks

### IMP-01 — <Discovery / prerequisite>

- Covers: <IDs>
- Prerequisites: <...>
- Actions:
  1. <concrete action>
- Expected: <observable artifact/state>
- Verification: <review/check>

### IMP-02 — <Implementation>

- Covers: <IDs>
- Depends on: IMP-01
- Actions:
  1. <...>
- Expected: <...>
- Verification: <tests, status planned>
- Recovery: <only if risk and feasible>

## 4. Spec → Plan → Verification

| Spec/AC ID | Task | Verification |
|---|---|---|
| FR-001 / AC-001 | IMP-02 | <test/check> |

## 5. Test and Rollout (if applicable)

- Test scenarios: <success/error/boundary>
- CLI/environment: <only if verified>
- Rollout/stop/recovery: <if risk warrants it>

## 6. Definition of Done

- [ ] Every in-scope Spec ID is covered or an exception is stated.
- [ ] Verification was run and evidence recorded (not merely planned).
- [ ] Related contracts/docs were updated.

## 7. Open Questions / Blockers (if any)

- <...>
