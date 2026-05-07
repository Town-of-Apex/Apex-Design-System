---
name: apex-modern-ui-design
description: Implements the 'Apex Modern' design system—a premium, professional, traditionalist-modern aesthetic for government and institutional tools. Use this to ensure all Apex tools share a consistent visual language, professional tone, and accessible layout.
---

# Apex Modern Design System (v2.0)

This skill enforces the visual and aesthetic standards for the Town of Apex. Our tools should feel robust, institutional, and high-end—avoiding the "playful" or "experimental" looks common in consumer tech.

## ⚠️ Baseline Requirements

All UI design work must be built upon the existing Apex baseline:
- **Core Files**: The `pages/core.html` (App Shell) and `static/apex-modern.css` (Design System) are the mandatory foundations.
- **Request if Missing**: If these files are not present in the workspace, you MUST stop and ask the user to provide them from the **Apex Design System** repository before proceeding with any UI or layout changes.
- **No Overrides without Reason**: Follow the styles in `apex-modern.css` exactly. Only suggest overrides if specifically requested by the user for a per-app customization.

## 🎨 Aesthetic Principles

1.  **Professional Traditionalism**: Use classic layouts and serif headers to convey authority and stability.
2.  **Strict Left Alignment**: All text, headers, and form elements must be left-aligned. No centered content unless it's a specific modal action.
3.  **Layered Surfaces**:
    -   **L0 (Canvas)**: `--bg-canvas` (#f5f5f5) - The root background.
    -   **L1 (Surface)**: `--bg-surface` (#ffffff) - Cards, main containers.
    -   **L2 (Inner)**: `--bg-inner` (#ededed) - Recessed areas, inputs, wells.
4.  **No Pills**: Use a consistent 6px radius (`--radius-btn`) for buttons and 12px (`--radius-card`) for containers. Avoid fully rounded "pill" shapes.
5.  **No Emojis**: Keep the interface professional. Use SVG icons for visual cues, not emojis.

## 🔠 Typography & Color

-   **Headings**: Use `<h1>` with `.app-title-text` or `.title-serif` (DM Serif Display).
-   **Body**: Use `.body-text` or standard tags (Inter).
-   **Primary Color**: Baltic Blue (`--town-baltic-blue`: #005f86).
-   **Accent Color**: Sunflower Gold (`--town-sunflower-gold`: #f1be48).
-   **Semantic Colors**:
    -   Success: Forest Green (`--town-forest-green`).
    -   Error: Cinnabar (`--town-cinnabar`).
    -   Warning: Sunflower Gold.

## 🧩 Standard Components

### Cards
-   `.card`: Standard white container.
-   `.card--interactive`: Adds hover lift and shadow.
-   `.card--highlight`: Adds a primary color border on the left.
-   `.card--subtle`: A recessed L2 surface.

### Buttons
-   `.btn-primary`: Baltic Blue background.
-   `.btn-secondary`: Recessed grey background.
-   `.btn-ghost`: Transparent with blue text.
-   `.btn-danger`: Cinnabar red.

### Forms
-   Inputs should always have a `<label class="label">` above them.
-   Use `input`, `textarea`, and `select` tags directly; they are styled by default to the recessed L2 look.

## 📐 Layout & Spacing

-   **Container**: Wrap all main content in `<div class="app-container">`.
-   **Vertical Flow**: Use `.stack` with `gap` or `.section` for vertical padding.
-   **Horizontal Flow**: Use `.cluster` for groups of buttons or tags.
-   **Utilities**: Use `.mt-1` through `.mt-12` for consistent top margins.

## 🛑 Common Mistakes to Avoid

-   ❌ **Reinventing Styles**: Do not write custom CSS for colors or margins. Use the variables and utility classes.
-   ❌ **Centering Everything**: Centered text looks "amateur." Stay strictly left-aligned.
-   ❌ **Complex Gradients**: Use solid colors and subtle shadows.
-   ❌ **External Fonts**: Only use 'Inter' and 'DM Serif Display' as defined in the system.
