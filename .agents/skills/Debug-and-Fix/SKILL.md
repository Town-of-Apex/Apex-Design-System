---
name: apex-debug-and-fix
description: Guides systematic troubleshooting, root-cause analysis, and fixing of bugs or broken behavior in Town of Apex applications. Use this to analyze error logs, stack traces, and UI glitches to produce permanent, non-destructive fixes.
---

# Apex Debug & Fix Guidelines

This skill defines the systematic troubleshooting and debugging workflow for the Town of Apex development team. It shifts development from a "guess-and-check" cycle to a disciplined, analytical approach. 

Junior developers and AI agents must follow this structure when investigating any bug, regression, or crash.

---

## 🔍 When to Use This Skill

Use this skill when you encounter:
-   **Runtime Crashes**: Python tracebacks, unhandled FastAPI exceptions, or database connection failures.
-   **Logic Errors**: Code executes without crashing, but yields incorrect outputs or database states.
-   **UI/UX Glitches**: Pages failing to render, broken tab navigation, responsive layout issues, or JavaScript console errors.
-   **API Integration Failures**: HTTP 4xx/5xx status codes, invalid JSON payloads, or CORS blocks.

---

## ⚙️ The Three-Step Debugging Workflow

Every bug fix MUST follow this sequence before modifying any code. Do not skip straight to code generation.

### Step 1: Explain the Issue (Root Cause Analysis)
Identify exactly *why* and *where* the failure occurs.
-   **Locate the Source**: Pinpoint the file, class, method, and line number responsible.
-   **Explain the Mechanics**: In plain terms, explain what happened (e.g., "A database query returned `None` because the user ID didn't exist, and the service attempted to read `.name` on a `NoneType` object").
-   **Identify the Trigger**: Under what conditions does this bug manifest (e.g., only when dark mode is enabled, or only when a new user registers without an email address)?

### Step 2: Propose the Fix (Pragmatic & Minimal)
Suggest the cleanest, most non-destructive fix that solves the root problem.
-   **Minimize Scope**: Favor the smallest code change required to fix the issue. Avoid massive rewrites of surrounding functional code unless requested.
-   **Align with Standards**: Ensure the fix uses existing patterns (e.g., FastAPI's `AppException` for errors, standard database session management, or `pydantic-settings` for config).
-   **Show Before / After**: Always document a clear side-by-side or diff preview of the proposed change.

### Step 3: Prevent & Defend (Future-Proofing)
Implement safety nets to ensure this bug—and similar bugs—do not return.
-   **Defensive Coding**: Add bounds checking, type assertions, or sensible default values (e.g., `data.get("role", "guest")` instead of `data["role"]`).
-   **Graceful Degradation**: If an optional operation fails, log it and let the core app continue running (e.g., a failed weather-widget API fetch should not crash the entire permit tracker portal).
-   **Actionable Logging**: Write clear, localized log messages with relevant context (like user IDs or transaction numbers), rather than generic "Error occurred" statements.

---

## 🛠️ Common Apex Scenarios & Quick Fixes

### 1. Sub-path / Traefik Routing Issues
-   **Symptoms**: CSS styles don't load, page tabs show "404 Not Found", or JavaScript assets fail to fetch when deployed.
-   **Root Cause**: Hardcoded absolute paths (e.g., `/static/style.css`) ignore the sub-path routing rules (e.g., `/permit-tracker/`).
-   **The Fix**:
    -   Ensure `pages/core.html` has `<base href="{{ BASE_PATH }}/">` in the `<head>`.
    -   Make sure all asset tags use relative paths without a leading slash: `<link rel="stylesheet" href="static/apex-modern.css">`.

### 2. FastAPI Pydantic Validation Errors (422 Unprocessable Entity)
-   **Symptoms**: Forms fail to submit, and the API returns a `422` with a detailed validation message.
-   **Root Cause**: The data payload sent by the JavaScript frontend does not perfectly match the Pydantic schema expected by the backend (e.g., a missing required field, an empty string where a valid email is needed, or a string where an integer is expected).
-   **The Fix**:
    -   Verify the Pydantic model (`app/schemas/`) matches the payload keys.
    -   Use `Optional[T] = None` or standard Pydantic defaults for non-mandatory fields.
    -   Log incoming payloads on the server when validation fails to quickly inspect formatting.

### 3. Database "PendingRollbackError"
-   **Symptoms**: The database freezes, returns errors, or complains that "this transaction is rolled back."
-   **Root Cause**: A database query failed inside a session block, but the code did not rollback the transaction before attempting another operation on the same session.
-   **The Fix**:
    -   Always wrap database transactions in try-except blocks.
    -   Call `db.rollback()` in the `except` block, then raise the standard `AppException`.
    -   Ensure database sessions are automatically closed using FastAPI's dependency injection (`db: Session = Depends(get_db)`).

---

## 🛑 What NOT to Do

-   ❌ **No Blind Guesswork**: Do not change random lines of code to see "if it works." Find the trace, explain the error, and modify only what is necessary.
-   ❌ **No Bare Exceptions**: Never write `except: pass` or `except Exception: pass`. If you catch an exception, you must log it or handle it. Silenced errors are the hardest bugs to fix.
-   ❌ **No Heroic Rewrites**: If a single line of code is broken, do not rewrite the entire function or module. Fix the bug first, then propose a refactor if maintainability is poor.
-   ❌ **No Hardcoded Parameter Fixes**: Do not write fixes like `if user_id == 5: return`. Address the underlying logic flaw that made user ID 5 break in the first place.
-   ❌ **No Silent Console Failures**: On the frontend, always use `.catch(err => console.error("Standard description:", err))` on fetch promises. Do not let requests fail invisibly.
