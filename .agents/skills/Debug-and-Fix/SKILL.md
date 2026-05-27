---
name: apex-debug-and-fix
description: Systematic debugging workflow for Apex React/FastAPI template applications, from root-cause isolation through verified fixes.
---

# Apex Debug and Fix Workflow

Use this skill for runtime failures, UI regressions, API mismatches, and data bugs.

## Workflow

### 1) Reproduce and Localize

- Reproduce the issue with exact steps.
- Identify affected layer: React page/component, frontend service, API route, backend service, schema, or model.
- Capture concrete evidence (error output, failing request/response, stack trace).

### 2) Root Cause Analysis

- Explain why the bug occurs, not only where.
- Validate assumptions against actual code paths and data payloads.
- Check contract mismatches between frontend `types/services` and backend `schemas/routes`.

### 3) Minimal Correct Fix

- Make the smallest change that resolves the root cause.
- Keep fixes inside appropriate layer boundaries.
- Reuse existing utilities/components/services before adding new abstractions.

### 4) Verify and Defend

- Re-test the failure path and adjacent flows.
- Add guards for null/undefined/error states where appropriate.
- Confirm no new lint/type errors are introduced.

## Common Template Failure Modes

- React UI expects fields not returned by API.
- Frontend service endpoint paths drift from backend routes.
- Theme/metadata hooks not initialized or consumed correctly in layout.
- Backend exceptions not converted to standard response format.
- Database config fallback behavior misunderstood between environments.

## Do Not

- Ship speculative fixes without reproduction evidence.
- Rewrite large modules for a small bug unless explicitly requested.
- Mask errors with empty catches or silent fallback behavior.
