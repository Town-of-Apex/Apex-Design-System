---
name: apex-app-architecture
description: Implements the 'Apex Internal Application Standard (AAS-1.0)' for portable, deployment-agnostic web applications. Use this to ensure all Apex tools share a consistent backend structure, routing logic, and deployment pattern.
---

# Apex Internal Application Standard (AAS-1.0)

This skill enforces the structural and architectural standards for all applications built for the Town of Apex. Our goal is to create a "Gold Standard" ecosystem where any developer can jump into any project and immediately understand its layout, routing, and deployment.

## 🏗️ Core Principles

1.  **Simplicity First**: Favor Python (FastAPI), Vanilla Javascript, and Plain CSS. Avoid "magic" frameworks that add unnecessary complexity.
2.  **Deployment Portability**: Applications must run anywhere—locally, in a container, or behind a reverse proxy (Traefik) at a sub-path (e.g., `/my-app/`).
3.  **Modular Frontend**: Content is separated from the "App Shell" (`core.html`). New pages are added as snippets in the `pages/` directory.
4.  **Single Source of Truth**: Application identity (name, version, branding) lives in `app_metadata.json`.

## ⚠️ Baseline Requirements

Before starting any architectural changes or new project initialization:
- **Check for Baseline Files**: Verify that `pages/core.html` and `static/apex-modern.css` exist in the current workspace.
- **Request if Missing**: If these files are missing, you MUST ask the user to provide them from the **Apex Design System** repository. Do not attempt to recreate them or use placeholders. These files are the non-negotiable backbone of all Apex applications.

## 📂 Standard Directory Structure

Every project MUST follow this layout:

-   `app/`: Core backend logic (FastAPI routers, database models, services).
-   `pages/`: HTML templates.
    -   `core.html`: The persistent "App Shell".
    -   `*.html`: Modular page snippets loaded into the shell.
-   `static/`: Static assets (CSS, JS, Images).
    -   `apex-modern.css`: The required design system stylesheet.
    -   `apex-config.js`: Tab navigation and UI configuration.
    -   `apex-core.js`: Core logic for metadata, themes, and routing.
-   `app_metadata.json`: Project identity and branding.
-   `main.py`: The entry point for the FastAPI application.
-   `Dockerfile` & `docker-compose.yml`: Standardized containerization.

## 🐍 Backend Standards (FastAPI & SQLAlchemy)
-   **Configuration**: Use `pydantic-settings` for all environment variables. Access via `from app.core.config import settings`.
-   **Database Models**: All ORM models MUST inherit from `app.core.database.Base`. Do not manually define `id`, `created_at`, or `updated_at` unless specialized logic is required.
-   **Business Logic (Services)**: Always use the `BaseService` pattern located in `app/services/base_service.py`. This provides standard CRUD functionality for free.
-   **API Consistency**:
    -   **Success**: All successful API responses must be wrapped in `{"success": true, "data": ...}` using `app.core.responses.ok`.
    -   **Errors**: Never manually return a JSON error dict. Raise `app.core.exceptions.AppException`. A global exception handler ensures all errors follow the standard `{"success": false, "error": {...}}` format.
-   **Auto-Discovery**: Do not manually import every model in `main.py` or `database.py`. The `init_db()` function uses `pkgutil` to automatically discover models in `app/models/`.
-   **Environment Variables**: Use `settings.BASE_PATH` to handle sub-path routing.
-   **Static Files**: Mount `static/` and `pages/` directories using `StaticFiles`.
-   **Jinja2 Templates**: Use Jinja2 for the initial `core.html` render to inject the `BASE_PATH` into the `<base>` tag.
-   **Port**: Applications must default to port `8080` internally.

## 🌐 Frontend & Routing Standards

-   **Sub-path Awareness**: Every HTML page MUST use the `<base href="{{ BASE_PATH }}/">` tag in the `<head>` of the `core.html`.
-   **Relative Links**: All links in HTML/JS (e.g., `static/style.css` or `pages/home.html`) must be relative to the base.
-   **Tab Navigation**: Define the application's structure in `static/apex-config.js`. The `apex-core.js` script handles the logic of swapping pages without a full reload.
-   **Branding**: Never hardcode the app title or logo in HTML. Use the `.app-title-text`, `.app-version-text`, and `#app-logo-img` selectors which are auto-populated from `app_metadata.json`.

## 🚀 Deployment & Containers

-   **Dockerfile**: Use a multi-stage build or a clean Python base (e.g., `python:3.13-slim`).
-   **Traefik Integration**: Docker Compose labels must support path-prefix routing and middleware for stripping the prefix if necessary.
-   **Statelessness**: Favor ephemeral containers. Use volumes only for persistent data (like SQLite or uploaded files).

## 🛑 What NOT To Do

-   ❌ **No Hardcoded URLs**: Never use absolute paths like `/static/logo.svg`. Use `static/logo.svg`.
-   ❌ **No CSS Frameworks**: Do not add Tailwind, Bootstrap, or others unless explicitly requested. Use the built-in `apex-modern.css`.
-   ❌ **No Heavy JS Frameworks**: Do not introduce React, Vue, or Angular for internal tools unless the complexity truly warrants it.
-   ❌ **No Custom Headers/Footers**: Use the standardized shell in `core.html` to maintain brand consistency across the Town.
