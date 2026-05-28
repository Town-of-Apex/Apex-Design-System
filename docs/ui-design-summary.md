# Town of Apex - UI & Design System Summary
> **Meeting Guide for Communications Department Collaboration**  
> *This document provides a single-source-of-truth summary of the **Apex Design System (v2.0)** currently implemented in our internal applications. Use this to answer quick-fire brand, color, font, and layout questions during your meeting.*

---

## Quick-Answer Cheat Sheet

| Question | Current Implementation / Answer | Technical Name / CSS Token |
| :--- | :--- | :--- |
| **"What green is that?"** | Official Forest Green: **`#3f873F`** (Primary brand color) | `var(--town-forest-green)` |
| **"What font is used for headers?"** | **`DM Serif Display`** (Serif, elegant, traditionalist) | `h1`, `.title-serif` |
| **"What font is used for UI/titles?"** | **`Montserrat`** (Sans-serif, geometric, bold) | `h2`, `h3`, `.title-ui` |
| **"What font is used for body text?"** | **`Inter`** (Sans-serif, clean, highly readable) | `p`, `.body-text` |
| **"What is the corner radius on cards?"**| **`12px`** (Generous, standard cards) | `var(--radius-card)` |
| **"What is the corner radius on buttons?"**| **`6px`** (Strict geometry, **No rounded pills**) | `var(--radius-btn)` |
| **"Does it support dark mode?"** | **Yes, natively.** Swaps canvas, surfaces, text, and strong borders. | `[data-theme="dark"]` |

---

## 1. Core Color Palette

The design system implements a **Layered Surface model (The Contrast Rule)** alongside the official municipal brand colors.

### A. Official Town Brand Palette
These are derived from the official municipal style guide and used for decorative highlights and brand recognition.

*   **Forest Green (Primary):** `#3f873F` (`var(--town-forest-green)`) - Represents the Town's identity. Used for primary buttons, active links, and brand accents.
*   **Hunter Green (Primary Hover):** `#40683C` (`var(--town-hunter-green)`) - Used as the hover state for primary elements to indicate interactive feedback.
*   **Sunflower Gold (Accent):** `#F3BD48` (`var(--town-sunflower-gold)`) - High-visibility accent color used for warnings, highlights, and subtle callouts.
*   **Baltic Blue (Info):** `#00586F` (`var(--town-baltic-blue)`) - Used for information banners and system notices. 
*   **Cinnabar (Error):** `#D75742` (`var(--town-cinnabar)`) - Used for errors, destructive buttons, and urgent alerts.
*   **Grey Olive (Borders):** `#968c83` (`var(--town-grey-olive)`) - Used for strong UI borders and dividers.
*   **Dim Grey (Muted Text):** `#796e65` (`var(--town-dim-grey)`) - Used for supporting metadata and secondary text.

### B. Layered Surfaces & Semantic Mapping
To maintain readability and premium aesthetics, elements are placed on distinct contrast layers:

| Layer Level | Light Mode Hex | Dark Mode Hex | Usage | CSS Token |
| :--- | :--- | :--- | :--- | :--- |
| **L0 (Canvas)** | `#f5f5f5` | `#202529` | Root background canvas | `--bg-canvas` |
| **L1 (Surface)** | `#ffffff` | `#171a1d` | Cards, Header, Sidebar, main containers | `--bg-surface` |
| **L2 (Inner Panel)** | `#ededed` | `#272a2e` | Recessed wells, inputs, slider tracks | `--bg-inner` |
| **Text (Main)** | `#1a1a1a` | `#f1f5f9` | Primary readability, labels, headers | `--text-main` |
| **Text (Muted)** | `#796e65` | `#94a3b8` | Supporting details, metadata, sub-labels | `--text-muted` |
| **Border (Subtle)** | `#f9f3ec` | `#2d3339` | Container dividers, card separation | `--border-subtle` |
| **Border (Strong)**| `#968c83` | `#475569` | High-contrast inputs, toggle switch outlines | `--border-strong` |

---

## 2. Typography System

The typography scale utilizes distinct font families to balance traditional, professional government aesthetics with modern UI readability.

### A. Font Families & Styling Roles

1.  **Serif Headings (`h1`, `.title-serif`):** 
    *   **Font Family:** `'DM Serif Display', serif`
    *   **Weight:** `400`
    *   **Letter Spacing:** `-0.01em`
    *   **Color:** `var(--brand-primary)` (Forest Green)
    *   *Usage:* Large page titles (e.g., "App Settings", "Permits").
2.  **UI Titles & Sub-headings (`h2`, `h3`, `.title-ui`):** 
    *   **Font Family:** `'Montserrat', sans-serif`
    *   **Weight:** `800` (Extra Bold)
    *   **Letter Spacing:** H2 uses `-0.02em` for tight, aggressive modern headings.
    *   *Usage:* Section headers inside cards, dashboard section titles.
3.  **Body Text (`p`, `.body-text`):** 
    *   **Font Family:** `'Inter', sans-serif`
    *   **Weight:** `400` (Regular)
    *   **Line Height:** `1.6` (for comfortable paragraph scanning)
    *   *Usage:* General paragraphs, explanations, instruction text.
4.  **Labels (`.label`, `.label-text`):** 
    *   **Font Family:** `'Inter', sans-serif`
    *   **Weight:** `600` (Semi-Bold)
    *   *Usage:* Input field labels, toggle switch labels.
5.  **Metadata (`.metadata`):** 
    *   **Font Family:** `'Inter', sans-serif`
    *   **Weight:** `600` (Semi-Bold)
    *   **Size:** `0.75rem` (Small)
    *   **Transform:** `uppercase`
    *   **Letter Spacing:** `0.05em` (Tracked out for readability)
    *   *Usage:* Footer credits, tiny categories/tags above page titles.

### B. CSS Custom Property (Variables) Management
To make global changes simple, the design system consolidates typography families under CSS Custom Properties in `:root`. Changing a font across the entire codebase requires modifying exactly one CSS variable:

*   **Display Font:** `var(--font-display)` -> `'DM Serif Display', serif`
*   **UI Elements Font:** `var(--font-ui)` -> `'Montserrat', sans-serif`
*   **Body & Inputs Font:** `var(--font-body)` -> `'Inter', sans-serif`

> [!NOTE]
> ### 🌐 Google Fonts Integration
> All three families are served dynamically from Google Fonts using a combined, single stylesheet request:
> ```css
> @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700;800&display=swap');
> ```
> This guarantees that regardless of the user's host environment or machine font configuration, the correct high-fidelity weights render immediately.

---

## 3. Geometry & Layout Rules

### A. The "No Pills" Border Radius Rule
To convey a traditionalist-modern, reliable municipal aesthetic, our design system **strictly avoids rounded pill shapes** (such as fully rounded buttons). We use precise, uniform corner radii instead:
*   **Buttons & Inputs:** `6px` (`--radius-btn`)
*   **Cards & Dropdown Menus:** `12px` (`--radius-card`)
*   **Modals:** `16px` (`--radius-modal`)

### B. Standard Spacing Scale
A progressive 12-step spacing scale is codified to eliminate arbitrary pixel values. Elements utilize CSS spacing variables for margins, paddings, and flexbox gaps:

*   `--space-1`: `0.25rem` (4px)
*   `--space-2`: `0.5rem` (8px)
*   `--space-3`: `0.75rem` (12px)
*   `--space-4`: `1.0rem` (16px) — *Standard layout gap / base unit*
*   `--space-5`: `1.25rem` (20px)
*   `--space-6`: `1.5rem` (24px)
*   `--space-7`: `1.75rem` (28px)
*   `--space-8`: `2.0rem` (32px)
*   `--space-9`: `2.5rem` (40px)
*   `--space-10`: `3.0rem` (48px)
*   `--space-11`: `4.0rem` (64px) — *Section block padding*
*   `--space-12`: `5.0rem` (80px)

### C. Layout Primitives
1.  **`.stack` (Vertical Flow):** A block level element that spaces its children out vertically using `margin-top: var(--gutter, var(--space-4))`.
2.  **`.cluster` (Horizontal Flow):** A flex-wrap row with a gap of `var(--gutter, var(--space-4))` used for lining up buttons, chips, and small cards.
3.  **`.app-container` (Layout Width):** Max width of `1152px` (`--container-width`) with `2rem` side padding.

---

## 4. UI Component Specifications

### A. Buttons (`.btn`)
*   **`btn-primary`:** Solid Forest Green (`#3f873F`), white text. Hovers to Hunter Green (`#40683C`) with a soft green drop shadow (`rgba(68, 105, 61, 0.2)`).
*   **`btn-secondary`:** Solid Inner Well color (`#ededed` light / `#272a2e` dark), Main text. Hovers to Surface color (`#ffffff` / `#171a1d`).
*   **`btn-ghost`:** Transparent background, Forest Green text. Hovers to a soft brand green tint (`--brand-primary-soft`).
*   **`btn-danger`:** Solid Cinnabar red (`#D75742`), white text. Hovers to slightly brighter variant.

### B. Inputs & Dropdowns
*   **Background:** Recessed panel (`#ededed` light / `#272a2e` dark).
*   **Border:** None (`transparent`).
*   **Focus State:** The input transitions to a white background (`#ffffff`), gains a Forest Green border (`#3f873F`), and displays a soft green highlight ring (`box-shadow: 0 0 0 4px var(--brand-primary-soft)`).

### C. Toggle Switch (`.switch`)
*   **Track:** A 44px × 24px box with a `6px` radius. Recessed grey background with a strong border outline.
*   **Thumb:** A `16px` × `16px` white square. **Note:** To maintain the strict geometric rule, the thumb is a rounded square (`4px` radius) rather than a circle!
*   **Active State:** Transitions track background to Forest Green and moves the thumb `20px` to the right.

### D. Modals (`.modal-card`)
*   **Overlay:** Semi-transparent dark background (`rgba(15, 17, 19, 0.6)`) with `backdrop-filter: blur(4px)` to blur the underlying application canvas.
*   **Card Structure:** Rounded `16px` card, clean border, and sharp header/body/footer divisions. Uses an animation that slides down from top (`translateY(20px)` to `0`) and fades in simultaneously.

### E. Toast Notifications (`.toast`)
*   Floating banner that slides in from the bottom-right corner.
*   Standardized with a `4px` colored left border reflecting semantic categories:
    *   **Success:** Forest Green left border.
    *   **Error:** Cinnabar red left border.
    *   **Info:** Baltic Blue left border.

---

## 5. Technical Implementation Details
*   **No Framework Overlords:** The frontend is styled using pure, vanilla CSS—avoiding TailwindCSS or Bootstrap to maintain custom branding control and avoid dependency bloat.
*   **Dynamic Theme Toggle:** Theme states are managed via a `data-theme="dark"` attribute on the `<html>` or `<body>` element. All colors transition smoothly when the user toggles dark mode via the header dropdown.
*   **Collapsible & Resizable Sidebar:** The application body has a collapsible and drag-resizable sidebar navigation. The width is stored in the CSS variable `--sidebar-width` which updates in real-time as the user drags.
