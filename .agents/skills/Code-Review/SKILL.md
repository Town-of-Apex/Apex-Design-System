---
name: apex-code-review
description: Review checklist for Apex template applications focused on correctness, maintainability, architectural consistency, and frontend/backend standards.
---

# Apex Code Review Standard

Use this skill to review AI-generated or human-authored code before merge.

## Review Priorities

1. Correctness and regression risk.
2. Alignment with template architecture.
3. Security and data-handling safety.
4. Readability and maintainability.
5. Testability and operational readiness.

## Architecture Compliance Checks

- Frontend changes respect `frontend/src` layering (`pages`, `components`, `services`, `types`, `hooks`, `lib`).
- Backend changes respect `app` layering (`api/routes`, `services`, `schemas`, `models`, `core`).
- Route handlers are thin and business logic remains in services.
- UI pages consume shared primitives from `components/ui` when feasible.

## React/Tailwind/shadcn Checks

- Components are state-driven and avoid unnecessary DOM mutation.
- Tailwind usage is consistent with existing patterns and avoids random one-off styling.
- Shared UI primitives are reused or carefully extended, not duplicated.
- Accessibility basics exist (labels, keyboard interaction, focus behavior).

## API and Data Contract Checks

- Frontend service modules match backend schema/API envelopes.
- TypeScript interfaces align with backend response fields.
- Error handling is consistent and user-facing states are handled gracefully.

## Reject or Block If

- Code bypasses established layering and introduces tight coupling.
- New dependencies are added without clear need.
- Secrets, unsafe query patterns, or insecure defaults are introduced.
- Large style or component rewrites happen without rationale when existing primitives suffice.
