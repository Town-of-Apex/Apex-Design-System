---
name: apex-pre-deploy-check
description: Performs final sanity checks, manual testing verification, and quality gates before code is committed or deployed. Use this to ensure there is no debug code left, environments are clean, and basic operations work.
---

# Apex "Ship It" Pre-Deploy Checklist

This skill is the final quality gate for all Town of Apex software projects. 

Rather than relying on complex, expensive automated CI/CD pipelines, we implement a practical, high-value **"are we being dumb?" filter**. Every developer and AI agent must run through these basic verification steps before declaring a task complete, pushing code, or submitting a project for deployment.

---

## 🔍 When to Use This Skill

Use this skill:
-   **Before Committing Code**: As a final checklist to clean up your workspace.
-   **Before Proposing a Pull Request**: To ensure the reviewer gets clean, working code.
-   **Before Local/Container Deployments**: To verify the app boots and functions as expected.

---

## 🚀 The 5-Step "Ship It" Sanity Checklist

Follow these steps in order before signing off on any code changes.

### 1. Clean out the Debug Junk
We do not ship messy code. Audit your changes to ensure:
-   **No print/console spam**: Remove all temporary `print(...)` statements in Python or `console.log(...)` statements in JavaScript. (Proper, structured logging using a logger is encouraged; raw print statements are not).
-   **No active breakpoints**: Double-check that all debugging break lines (like `import pdb; pdb.set_trace()` or JS `debugger;`) have been completely deleted.
-   **No workspace clutter**: Ensure temporary scratch scripts, database backups (`.db-journal`, `.bak`), or junk text files are deleted or added to `.gitignore`.

### 2. Verify AAS-1.0 Architecture & Paths
Ensure the application follows the core **Apex Internal Application Standard**:
-   **Folder Layout**: Verify directories are structured properly:
    -   `app/` for Python backend code.
    -   `pages/` for HTML modular snippets.
    -   `static/` for JS/CSS assets.
-   **Relative Path Check**: Confirm all assets in HTML/JS are relative. Every link must look like `static/logo.svg` or `pages/colors.html`. There should be **no leading slashes** (`/static/...`) which break sub-path routing behind Traefik.
-   **Base Tag present**: Ensure `pages/core.html` contains the `<base href="{{ BASE_PATH }}/">` tag in its `<head>`.

### 3. Audit Config & Environment Variables
Prevent configuration errors in production:
-   **App Metadata**: Verify `app_metadata.json` is updated with the correct application name, version number, and color configurations.
-   **Example Environment Files**: If you added a new environment variable to the code (e.g., `DATABASE_URL` or `API_KEY`), make sure you added a matching placeholder entry in `.env.example`.
-   **No Hardcoded Secrets**: Ensure no active API keys, database passwords, or secret tokens are left in any committed files.

### 4. Run a Manual Boot Test
Never deploy code that hasn't been run.
-   **Launch the App**: Run the app locally via Uvicorn (`uvicorn main:app --port 8080 --reload`) or Docker Compose (`docker compose up --build`).
-   **Inspect the Startup Logs**: Watch the terminal output. Check for:
    -   Database connection errors or unapplied migration warnings.
    -   Pydantic validation errors during configuration loading.
    -   Python syntax or import errors.

### 5. Perform a Visual Check & Console Audit
Open the application in a local browser (e.g., `http://localhost:8080/` or the configured sub-path) and check:
-   **Standard Layout**: Verify the Town of Apex header, footer, brand colors, and serif typography render correctly.
-   **Tab Navigation**: Click through each navigation tab. Ensure they swap smoothly without triggering a full browser reload.
-   **F12 Developer Console**: Open your browser's Developer Tools (F12) and inspect the Console. Confirm there are **no red error messages** indicating missing CSS/JS assets, failed API fetch calls, or uncaught JS exceptions.

---

## 🛑 What NOT to Do

-   ❌ **No "It Works on My Machine" Excuses**: If you haven't tested the exact code in a clean terminal state or within the local Docker environment, it is not ready.
-   ❌ **No Leftover "TODOs"**: Do not commit code with comments like `# TODO: fix this before deploying`. Fix it now.
-   ❌ **No Local Database Commits**: Never commit actual SQLite database files (`*.db` or `*.sqlite`) containing live data to the repository. Ensure database files are excluded in `.gitignore`.
-   ❌ **No Center-Aligned Elements**: Ensure any new UI pages strictly follow the "Strict Left Alignment" rule from our UI-Design standard.
