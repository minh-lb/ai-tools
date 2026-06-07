# Project Overview

## Description

This repository is an AI-agent workflow kit for software projects. It provides agent rules, reusable skills, workflow selectors, and lightweight project context files.

## Goals

- Convert requirements into reviewed specs before implementation.
- Keep implementation work scoped, testable, and easy to review.
- Reduce token use by loading only the workflow, skill, reference, and template files needed for the current task.
- Support Laravel backend projects using DDD-style modules when applicable.

## Tech Stack

- Frontend: N/A
- Backend: Laravel-oriented templates where applicable
- Database: Project-dependent
- Other: Markdown/YAML agent instructions and reusable skill templates

## Users

Software engineers and AI coding agents using this repository as a reusable project workflow framework.

## Modules

- Agent Rules: root operating rules and context loading contract.
- Workflows: task routing, execution steps, and approval gates.
- Skills: reusable domain-specific instructions, references, and templates.
- Context Docs: project overview, coding standards, active feature tracker, and generated specs.

## Structure

- `AGENTS.md`: root operating rules for agents.
- `.agents/workflows/`: task-level routing and execution gates.
- `.agents/skills/`: reusable task instructions and code templates.
- `docs/current-feature.md`: active spec tracker and chronological history.
- `docs/specs/`: generated feature/fix specs.
