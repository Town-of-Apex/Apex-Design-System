---
name: apex-template-skill-template
description: Canonical blueprint for creating new Apex agent skills aligned to the React/Tailwind/shadcn + FastAPI application template.
---

# Apex Skill Template

Use this file as the base format when creating a new skill in `.agents/skills/<Skill-Name>/SKILL.md`.

## Required Frontmatter

```yaml
---
name: short-kebab-skill-name
description: One sentence on what the skill enforces and when to use it.
---
```

## Recommended Sections

1. Purpose and scope.
2. When to use this skill.
3. Mandatory standards and patterns.
4. Repository-specific implementation guidance.
5. Anti-patterns / do-not-do rules.
6. Verification checklist.

## Template Alignment Requirements

New skills should explicitly account for:

- React + TypeScript frontend in `frontend/src`.
- Tailwind styling and shared UI primitives in `frontend/src/components/ui` (shadcn/ui style).
- FastAPI backend layering in `app`.
- Service-first data access patterns (`frontend/src/services` and `app/services`).
- Shared configuration and metadata patterns (`.env.example`, `app_metadata.json`, `docs/template-guide.md`).

## Writing Style Guidance

- Keep guidance actionable and unambiguous.
- Prefer concrete repository paths over generic statements.
- Prioritize maintainability and consistency across future cloned apps.
- Keep policy strict where needed, but avoid unnecessary process overhead.
