---
id: "<unique-task-id-or-uuid>"
title: "<Issue> — Bug-fix Specification"
type: bug-fix-specification
status: draft
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
tags: []
---
# <Issue> — Bug-fix Specification

> **Document status:** `draft` | **Source:** <ticket/report/specification> | **Symptom:** <reproduced / reported only / unclear>
> Remove inapplicable sections. This document defines the behavior to fix and records the cause and its verification status (including `Unknown`); it does not replace a full RCA or an Implementation Plan.

## Problem and Scope

- Affected flow/users: <...>
- In scope: <behavior to fix>
- Out of scope: <related behavior that will not change>

## Current Behavior

- Description: <what the system does now>
- Evidence/reproduction status: <verified evidence, reported only, or unconfirmed>

## Desired Behavior

- Description: <observable behavior wanted>
- Source/decision: <approved requirement/contract/decision, or proposed and awaiting confirmation>

## Bug Cause

- Cause: <causal description or `Unknown`>
- Evidence/status: <source supporting the verified cause, or evidence still needed>
- Hypothesis (if any): <unverified explanation and how to check; never state it as the cause>

## Required Behavior and Acceptance Criteria

- `BR-001`: When <condition>, the system MUST <observable desired behavior>.
- `AC-001`: Given <reproducible state>, when <event>, then <observable result>.
- `AC-002` (if needed): Given <related unaffected case>, when <event>, then <behavior that must remain unchanged>.

## Constraints / Non-regression (if applicable)

<Interface contract, data/state invariants, access control, compatibility, or adjacent behavior to preserve.>

## Evidence and Open Questions

- Reproduction/source: <verified evidence, reported only, or unconfirmed>
- Question/blocker: <unresolved decision and impact; omit if none>
