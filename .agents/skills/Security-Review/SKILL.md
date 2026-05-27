---
name: apex-security-review
description: Practical security review checklist for Apex template apps using React frontend and FastAPI backend.
---

# Apex Security Review Standard

Use this skill when reviewing new features, bug fixes, or dependency changes.

## Critical Checks

### 1) Secrets and Configuration

- No secrets in source, logs, or sample data.
- Environment variables documented in `.env.example` without real credentials.
- Sensitive config loaded through backend settings modules.

### 2) API and Authorization

- Sensitive endpoints enforce backend authorization checks.
- No security assumptions based only on hidden or disabled frontend controls.
- CORS settings are explicit and environment-appropriate.

### 3) Input and Output Safety

- Validate request bodies via Pydantic schemas.
- Avoid raw SQL string construction; use ORM/query parameterization.
- Sanitize file paths and constrain upload/read targets.

### 4) Frontend Safety

- Avoid unsafe HTML injection patterns.
- Treat all API/user-provided text as untrusted.
- Keep auth/session tokens out of unsafe storage patterns when avoidable.

### 5) Dependency Risk

- New packages are vetted for maintenance and known vulnerabilities.
- Remove abandoned or unnecessary dependencies.

## Security Anti-Patterns

- Hardcoded credentials or tokens.
- Unauthenticated mutation endpoints.
- Overly permissive production CORS.
- Logging sensitive payloads without redaction.
