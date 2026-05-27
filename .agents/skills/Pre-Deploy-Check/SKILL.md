---
name: apex-pre-deploy-check
description: Final delivery checklist for Apex template apps to verify code quality, runtime readiness, and standards alignment before handoff or deployment.
---

# Apex Pre-Deploy Checklist

Use this skill before commit, PR, release tagging, or deployment.

## 1) Workspace Cleanliness

- Remove temporary debug statements and dead code.
- Ensure no accidental artifacts are staged (local DB dumps, temp files, scratch scripts).
- Confirm only intentional files are modified.

## 2) Architecture and Standards Validation

- Confirm project still follows target template structure (`app/`, `frontend/`, `data/`, env/docs, compose files).
- Verify frontend changes align with React + Tailwind + shared `components/ui` conventions.
- Verify backend changes align with FastAPI routes + service-layer patterns.

## 3) Quality Gates

- Run lint and type checks for frontend.
- Run relevant backend checks/tests if present.
- Validate changed flows manually (UI behavior + API behavior).

## 4) Configuration and Security Sanity

- `.env.example` updated for newly introduced environment variables.
- No secrets in code or committed config.
- Production-sensitive defaults reviewed (CORS, auth, cookie/session settings).

## 5) Run and Smoke Test

- Start app via standard local workflow (Docker Compose or project scripts).
- Confirm frontend boot, key navigation/routes, and primary API flows.
- Confirm backend startup has no critical errors.

## Release Blockers

- Failing lint/type/test checks.
- Contract mismatch between frontend and backend.
- Unreviewed dependency additions.
- Missing documentation for behavior/config changes.
