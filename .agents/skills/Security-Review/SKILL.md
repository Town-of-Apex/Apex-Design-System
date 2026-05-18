---
name: apex-security-review
description: Provides a lightweight, practical security audit focusing on common vulnerabilities in municipal internal web tools. Use this to screen for hardcoded secrets, injection vectors, and unsafe access controls.
---

# Apex Lightweight Security Audit Guidelines

This skill enforces security baselines for all applications built for the Town of Apex. 

As a local government agency handling municipal operations, employee utilities, and resident data, **security is non-negotiable.** We do not need NSA-level complexity, but we absolutely require robust, common-sense guardrails to protect our systems. 

This guide outlines the critical, practical security checks that junior developers and AI agents must verify before any code is approved.

---

## 🔍 When to Use This Skill

Use this skill when writing or reviewing:
-   **Database Queries**: Checking for SQL injection risks.
-   **File Uploads / Downloads**: Ensuring files cannot be written or read outside of designated folders.
-   **Authentication & Access Control**: Verifying backend enforcement of user permissions.
-   **Configuration & Credentials**: Ensuring no passwords or tokens are exposed.
-   **API Endpoints**: Reviewing CORS policies and cookie configurations.

---

## 🔐 Core Security Audit Checklist

Every code modification must pass these six basic security gates.

### 1. Zero Hardcoded Secrets (Credential Hygiene)
-   **The Threat**: Storing passwords, API keys, database connection strings, or encryption keys in source code leads to catastrophic leaks when code is pushed to Git.
-   **The Check**:
    -   Scan the diff for any string literals containing credentials, tokens, or private paths.
    -   Ensure all configuration data is loaded via environment variables using `pydantic-settings` (e.g., `settings.DATABASE_URL`).
    -   Verify that `.env` files are explicitly listed in `.gitignore` and only `.env.example` (containing dummy variables) is committed.

### 2. Injection Prevention (Data & Input Safety)
-   **The Threat**: SQL Injection (malicious input running database commands) and Cross-Site Scripting (XSS; malicious scripts running in our users' browsers).
-   **The Check**:
    -   **SQL Injection**: Never construct queries using string formatting or concatenation (e.g., `f"SELECT * FROM users WHERE name = '{user_input}'"`). All database queries MUST use SQLAlchemy's parameterized ORM methods (e.g., `db.query(User).filter(User.name == user_input)`).
    -   **XSS**: When injecting user input into HTML in JavaScript, favor `element.textContent` over `element.innerHTML` to automatically escape special characters. When using Jinja2, rely on its built-in auto-escaping for variable interpolation.

### 3. Safe File Handling (Path Traversal Blockers)
-   **The Threat**: Attackers uploading a file named `../../../etc/passwd` or trying to read sensitive operating system files.
-   **The Check**:
    -   Never trust a user-provided filename directly for local disk storage.
    -   Use Python’s standard `pathlib.Path` to resolve target directories.
    -   Verify that a resolved path lies strictly inside the intended upload folder:
        ```python
        from pathlib import Path
        
        # Ensure path is confined to designated folder
        base_dir = Path("/data/uploads").resolve()
        target_path = base_dir.joinpath(user_provided_filename).resolve()
        
        if not target_path.is_relative_to(base_dir):
            raise ValueError("Path traversal attempt detected!")
        ```
    -   Consider generating a unique UUID for the filename on disk, and store the original filename safely in the database.

### 4. Backend Access Controls (No UI-Only Security)
-   **The Threat**: Hiding an "Admin" button on the frontend does not make an application secure. Tech-savvy users can easily inspect the DOM, unhide the button, or make direct HTTP calls to the backend endpoints.
-   **The Check**:
    -   Every sensitive API route in `app/api/` must enforce role checks on the backend (e.g., checking tokens or session data).
    -   Never assume a request is safe because "only admins can see that tab in the UI."

### 5. CORS and Network Restrictions
-   **The Threat**: Overly permissive Cross-Origin Resource Sharing (CORS) rules allow external, malicious websites open in a town employee's browser to send requests and steal data from our internal tools.
-   **The Check**:
    -   Never use `allow_origins=["*"]` in production environments for tools handling sensitive municipal or resident data.
    -   Restrict CORS origins strictly to our internal subdomains (e.g., `https://*.apexnc.org` or specific trusted internal IP ranges).

### 6. Secure Cookies and Sessions
-   **The Threat**: Intercepted session tokens leading to unauthorized access.
-   **The Check**:
    -   When setting session cookies, always enforce these security flags:
        -   `HttpOnly=True`: Prevents client-side scripts from reading the cookie, stopping XSS-based token theft.
        -   `Secure=True`: Ensures the cookie is only transmitted over encrypted HTTPS connections (enable in production).
        -   `SameSite="Lax"` or `"Strict"`: Protects against Cross-Site Request Forgery (CSRF) attacks.

---

## 🛑 What NOT to Do

-   ❌ **No `os.system()` with User Input**: Never pass unsanitized user inputs to operating system terminal commands. Use `subprocess.run()` with shell-escaping if system execution is absolutely required.
-   ❌ **No Default Production Passwords**: Never write "admin" or "password123" as default admin credentials in database seeding or migrations.
-   ❌ **No Unauthenticated Delete/Update APIs**: Ensure any endpoint that mutates database state requires active authentication.
-   ❌ **No Public Access to PII Folders**: Make sure directories containing PII (personally identifiable information like resident phone numbers, addresses, or tax documents) are never mapped to the public `/static/` folder of the web server.
