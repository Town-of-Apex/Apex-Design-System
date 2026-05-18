---
name: apex-dependency-advisor
description: Enforces a pragmatic, minimal-dependency approach to software development for the Town of Apex. Use this to evaluate package additions, favor standard libraries, and prevent dependency bloat.
---

# Apex Dependency & Package Management Standards

This skill defines our standard policy on third-party packages and software dependencies. 

For a small municipal IT department like the Town of Apex, **every dependency introduced is future maintenance debt.** A larger dependency footprint means more security vulnerabilities to monitor, higher chances of deployment failure, and more complexity for our developers.

---

## 🔍 When to Use This Skill

Use this skill when:
-   **Implementing a New Feature**: Deciding whether to write a custom solution or import a library.
-   **Reviewing Code / PRs**: Auditing proposed changes to ensure no unauthorized or redundant packages have been introduced.
-   **Upgrading or Patching**: Reviewing existing dependencies for updates or security vulnerabilities.

---

## 🏗️ Core Dependency Principles

1.  **Standard Library First**: Python and modern JavaScript have incredibly powerful standard libraries. Always attempt to solve a problem with standard tools first (e.g., standard `json`, `datetime`, `pathlib`, `urllib.request`, or standard JS `fetch`).
2.  **The "10-Line Rule"**: If a task can be achieved using a few lines of clean, readable standard Python or JavaScript, write the code yourself. Do not install a library to do simple tasks like padding strings, parsing basic CSVs, or formatting dates.
3.  **Reproducible & Pinned**: We never allow "floating" dependency versions in production. All dependencies must be strictly pinned to ensure that a deployment today behaves exactly like a deployment next year.
4.  **No Redundancy**: Do not add multiple packages that do the same thing. For example, if we use `pydantic` for validation, do not introduce `marshmallow` or custom validators.

---

## 📦 Town of Apex Approved Stack

To keep our skills sharp and our applications consistent, all internal projects are standardized on this core set of vetted packages. Deviations require explicit approval from the IT Lead.

### 🐍 Python (Backend)
-   **Web Server / API**: `fastapi` + `uvicorn[standard]`
-   **HTML Rendering**: `jinja2` (used to serve our standard `core.html` shell)
-   **Data Validation & Environment**: `pydantic` + `pydantic-settings`
-   **Database Access**: `sqlalchemy`
    -   *Local / Lightweight Dev*: Standard `sqlite3` (built-in)
    -   *Production / Server-based*: `psycopg2-binary` (for PostgreSQL connectivity)
-   **HTTP Client**: `httpx` (preferred over `requests` for native async compatibility)
-   **Date & Time Zones**: Standard `datetime` and `zoneinfo` (built-in to Python 3.9+; do not install `pytz` or `moment`)

### 🌐 JavaScript (Frontend)
-   **No Build Step / Vanilla JS**: We do not use React, Vue, or Angular for internal tools. Frontend logic is written in plain, accessible vanilla JavaScript.
-   **HTTP Calls**: Use the browser's standard `fetch()` API. Do not import `axios` or `jquery`.

---

## ⚙️ How to Add a Dependency (Vetting Process)

Before adding any package to `requirements.txt` or `package.json`, AI agents and developers must complete this checklist:

1.  **Exhaust Standard Options**: Prove that the task cannot be easily or cleanly done using standard libraries.
2.  **Check Transitive Footprint**: Ensure the library does not pull in dozens of secondary dependencies (e.g., installing a simple utility should not install half of the internet).
3.  **Security Check**: Verify the package is actively maintained and has no outstanding critical CVEs (Common Vulnerabilities and Exposures).
4.  **Pin the Version**: Add the package using explicit pinning:
    ```text
    # In requirements.txt
    httpx==0.27.0
    ```
5.  **Document the Justification**: Add a brief comment above the package in `requirements.txt` explaining *why* it is there:
    ```text
    # Used for non-blocking async HTTP calls to Apex GIS Server
    httpx==0.27.0
    ```

---

## 🛑 What NOT to Do

-   ❌ **No Floating Versions**: Never add a bare package name like `fastapi` or `sqlalchemy` without `==x.y.z`.
-   ❌ **No Unapproved CSS/JS Frameworks**: Never add Tailwind, Bootstrap, React, or jQuery via CDN or npm unless explicitly requested. Rely strictly on `apex-modern.css`.
-   ❌ **No Dev Dependencies in Prod**: Keep runtime requirements separate from testing utilities (like `pytest` or `black`).
-   ❌ **No "Cool-Looking" Libraries**: Just because a package is trending on GitHub does not mean we need it. Prioritize boring, rock-solid, widely supported technologies.
