---
name: apex-app-architecture
description: Enforces the Apex React application architecture standard for template-derived apps using React, Tailwind CSS, shadcn/ui patterns, and FastAPI APIs.
---

# Apex Application Architecture Standard (AAS-2.0)

This skill defines the required architecture for all future Apex template-based apps. Use it whenever creating or refactoring project structure, routes, app shells, shared UI, data services, or backend API modules.

## Core Principles

1. React-first frontend architecture using Vite and TypeScript.
2. Tailwind utility styling with reusable component primitives (shadcn/ui style patterns in `frontend/src/components/ui`).
3. API-first backend architecture with FastAPI, service-layer business logic, and typed contracts.
4. Clear separation of concerns: pages compose UI, services handle network I/O, backend services handle domain logic.
5. Template fidelity: new apps should preserve this repository's structure unless a deliberate deviation is approved.

## Target Repository Structure

All template-based apps should target this structure:

- `app/`
  - `api/routes/`: FastAPI routers by domain.
  - `core/`: config, database, exceptions, responses, security.
  - `models/`: SQLAlchemy models.
  - `schemas/`: Pydantic request/response schemas.
  - `services/`: backend domain services and base service abstractions.
  - `main.py`: FastAPI app setup and router registration.
- `frontend/`
  - `src/components/layout/`: shell, header, footer, page container.
  - `src/components/shared/`: reusable composite UI helpers.
  - `src/components/ui/`: reusable primitive UI components (shadcn/ui style).
  - `src/pages/`: routed page views.
  - `src/services/`: API client wrappers and feature service modules.
  - `src/types/`: TypeScript contracts shared by pages/services.
  - `src/hooks/`: app-level reusable React hooks.
  - `src/lib/`: pure utilities, nav config, helpers.
  - `src/styles/`: global design tokens and app-wide CSS.
- `data/`: local runtime data (for example, SQLite fallback).
- `.env.example`: documented environment variable placeholders.
- `docker-compose.yml` (production) and `docker-compose.dev.yml` (local dev): container orchestration.
- `docs/template-guide.md`: canonical onboarding and feature-extension guidance.

## Frontend Standards (React + Tailwind + shadcn/ui)

- Use TypeScript React functional components.
- Keep route pages in `frontend/src/pages`; avoid embedding full-page route logic in shared components.
- Prefer composition with shared primitives from `frontend/src/components/ui` before introducing new bespoke components.
- Centralize fetch/network logic in `frontend/src/services`; no ad-hoc fetch calls inside pages when a service module is appropriate.
- Store navigation definitions in `frontend/src/lib/navigation.ts` and render from configuration.
- Keep app metadata/theme state in dedicated hooks (for example, `useAppMetadata`, `useTheme`).

## Backend Standards (FastAPI + SQLAlchemy)

- Use `app.core.config.settings` for environment-based configuration.
- Keep API route handlers thin; place business rules in `app/services`.
- Use Pydantic schemas in `app/schemas` for request validation and response contracts.
- Keep SQLAlchemy model definitions in `app/models` and inherit from shared base model conventions.
- Return consistent API envelopes using shared response helpers and exception classes.
- Register routes in `app/main.py`; avoid hidden side-effect imports for route exposure.

## Architectural Guardrails

- Do not reintroduce legacy `pages/` + `static/` server-rendered frontend patterns for new work.
- Do not mix unrelated concerns (for example, database queries directly in route handlers and React components).
- Do not hardcode environment-specific URLs; rely on config and frontend proxy configuration.
- Do not duplicate shared UI patterns when an existing primitive/component can be extended.
