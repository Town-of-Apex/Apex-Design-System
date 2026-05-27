---
name: apex-modern-ui-design
description: Enforces Apex UI standards for React applications using Tailwind and shadcn/ui-style component patterns with Town of Apex branding.
---

# Apex UI Design Standard (React Edition)

This skill defines UI standards for all Apex template-based apps built with React, Tailwind, and reusable component primitives.

## Design Goals

- Professional, institutional look and tone.
- Accessible, predictable interactions.
- Consistent visual language across all internal tools.
- Brand-aligned colors, typography, and spacing.

## Required UI Stack Practices

- Use Tailwind utility classes for layout/spacing and shared CSS variables/tokens from global styles.
- Build new UI from primitives in `frontend/src/components/ui` first (Button, Card, Input, Select, Tabs, Dialog, and similar controls).
- Follow shadcn/ui conventions for component organization: co-locate variants, use class composition helpers, keep component APIs minimal and explicit.
- Keep layout components (`AppShell`, `AppHeader`, `AppFooter`, `PageContainer`) as the page scaffold.

## Branding and Theming

- App title/version/brand metadata should come from `app_metadata.json` through existing metadata hooks/services.
- Avoid hardcoded product labels in reusable layout components when metadata is available.
- Preserve theme token usage patterns in `frontend/src/styles/globals.css` and related style files.

## Accessibility and UX Rules

- Ensure keyboard accessibility for dialogs, dropdowns, tabs, and form controls.
- Use semantic HTML and properly associated labels.
- Preserve visible focus states; never remove focus styles without replacement.
- Ensure color contrast remains accessible when adding variants/themes.

## UI Anti-Patterns to Reject

- Large inline style objects when Tailwind/utilities already solve the need.
- Copy-paste component forks instead of extending shared primitives.
- Direct DOM manipulation in React components for behavior that should be state-driven.
- New visual patterns that conflict with existing spacing, typography, or component conventions.
