---
name: apex-code-review
description: Ensures all code meets the Apex standards for readability, maintainability, and pragmatic implementation. Use this to audit AI-generated code before finalizing it.
---

# Apex Code Review Standards

This skill acts as the final quality gate for all code written for the Town of Apex. It enforces our "Gold Standard" of simple, reliable, and maintainable software.

## 🔍 Core Review Checklist

### 1. The "Pragmatism" Test
-   **Clarity > Cleverness**: Is the code easy to read for an amateur developer? Reject "exotic" one-liners or overly abstract patterns.
-   **Standard Libraries First**: Does the code use standard Python/JS libraries before reaching for a third-party package?
-   **Minimal Dependencies**: Are there any unnecessary packages added? If so, question their inclusion.

### 2. Architectural Alignment (AAS-1.0)
-   **Folder Structure**: Does the code follow the `app/`, `pages/`, `static/` layout?
-   **Routing**: Is the code "sub-path aware"? Does it use relative paths and respect `BASE_PATH`?
-   **Main Entry Point**: Is logic properly separated from `main.py`?

### 3. UI Consistency (Apex Modern)
-   **Class Usage**: Does the HTML use existing `.card`, `.btn`, and `.stack` classes?
-   **No Ad-hoc Styling**: Reject any inline styles or new CSS classes that could be handled by the design system variables.
-   **Alignment**: Is everything strictly left-aligned?

### 4. Robustness & Security
-   **Error Handling**: Are there `try/except` blocks around external calls (database, APIs, file I/O)?
-   **Input Validation**: Is user input being validated or sanitized?
-   **Environment Secrets**: Are API keys or passwords hardcoded? (MUST use `.env` or environment variables).

### 5. Documentation
-   **Meaningful Comments**: Do comments explain *why* something is done, rather than just *what* the code is doing?
-   **Docstrings**: Do functions have clear, concise docstrings?

## 🛑 Reject the Following:
-   ❌ **Overengineering**: If a simple function works, don't build a class hierarchy.
-   ❌ **Framework Bloat**: No React, Tailwind, or complex state management unless explicitly authorized.
-   ❌ **Hardcoded Paths**: Any path starting with `/` (e.g., `/static/...`) is a bug.
-   ❌ **Center Alignment**: Center-aligned UI elements are strictly forbidden.
-   ❌ **Emojis in UI**: UI elements must be professional. Icons only.
