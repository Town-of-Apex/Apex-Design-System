---
name: apex-dependency-advisor
description: Governs dependency decisions for Apex template apps with a pragmatic policy centered on maintainability, security, and React/FastAPI consistency.
---

# Apex Dependency and Package Management Standard

Use this skill when evaluating, adding, upgrading, or removing dependencies in backend or frontend code.

## Dependency Principles

1. Prefer existing stack capabilities before adding new packages.
2. Keep runtime dependency count intentionally low.
3. Choose mature, maintained libraries with clear value.
4. Keep dependency usage consistent across template-derived apps.

## Approved Baseline Stack

### Frontend

- React + TypeScript + Vite.
- Tailwind CSS.
- Reusable UI component system following shadcn/ui patterns.
- Router/state/tooling already present in template should be reused before new framework additions.

### Backend

- FastAPI + Uvicorn.
- Pydantic / pydantic-settings.
- SQLAlchemy.
- Existing project HTTP/database tooling from `requirements.txt`.

## Rules for Adding New Dependencies

Before adding any package:

1. Confirm no equivalent exists in current dependencies or standard library.
2. Document why the dependency is needed in the PR/task summary.
3. Validate maintenance health and security posture.
4. Add only where needed (frontend vs backend) and avoid cross-layer bleed.
5. Keep lockfiles and manifests in sync.

## Frontend-Specific Guidance

- Prefer extending `frontend/src/components/ui` and utility helpers over importing broad UI frameworks.
- Avoid overlapping packages that duplicate current stack responsibilities (for example, multiple data-fetching libraries without clear need).
- Prefer browser-native and existing app-service abstractions for API calls.

## Backend-Specific Guidance

- Prefer existing service and schema patterns over adding ORMs/validation frameworks that duplicate SQLAlchemy/Pydantic.
- Keep production/runtime dependencies separate from developer tooling where possible.

## Anti-Patterns

- Adding dependencies for trivial helpers.
- Adding unmaintained or high-risk packages without approval.
- Introducing alternative frameworks that conflict with React/Tailwind/shadcn or FastAPI architecture.
