# 🛡️ Apex Application Template

The **Apex Application Template** is the standardized starting point for all web application development within our team. It provides a pre-configured, visually consistent "App Shell" that adheres to the **Apex Design System (v2.0)**, allowing developers to focus on functionality rather than UI plumbing.

---

## 🚀 The Vision
The goal of this template is to provide a "copy-and-launch" foundation. By standardizing our architecture, we ensure:
- **Visual Consistency:** Every app feels like it belongs to the same municipal family.
- **Rapid Prototyping:** New features can be added as simple HTML files in seconds.
- **Interoperability:** Common auth, secret management, and package handling patterns.
- **AI-Ready:** Standardized "Skills" ensure coding AI agents (like Antigravity) have perfect context.

---

## 🏗️ Architecture Overview

### 1. The Core Shell (`pages/core.html`)
The `core.html` file is the entry point. It contains the persistent header, footer, and navigation logic. It acts as a frame that dynamically swaps out content based on the active tab.

### 2. The Application Layer (`/app`)
For larger applications, backend logic is stored in the `/app` directory. This is where business logic, API services, and data models reside.
- `app/main.py`: The entry point for the backend application.
- `app/services/`: Modular services for handling data and logic.
- `/storage`: A standardized directory for local data persistence and file uploads.

### 3. The Configuration (`static/apex-config.js`)
Everything about your app—title, version, author, and navigation tabs—is defined here.
```javascript
const APEX_CONFIG = {
    title: "My New Application",
    tabs: [
        { id: "home", label: "Overview", file: "home.html" },
        // Add more tabs here...
    ]
};
```

### 3. Page Partials (`pages/*.html`)
Individual pages are stored as simple HTML snippets. They should use the `.app-container` and `.stack` layout primitives for consistent alignment.

---

## 🛠️ Core Features

### 🧩 Standardized Component Library
Located in `static/apex-core.js`, the system provides global UI helpers:
- `apex.showModal(title, content, options)`: Standard and "Danger" confirmation modals.
- `apex.showToast(message, type)`: Temporary banners for feedback.

### 🌓 Theme Management
Dark and light mode are handled automatically via CSS variables and the `toggleApexTheme()` function. Preferences are persisted in local storage.

### 🗺️ Dynamic Routing
Uses URL hash routing (`#home`, `#config`). This supports page refreshes, browser back/forward navigation, and direct deep-linking to specific tabs.

---

## 📋 Development Standards

### 📦 Package Management
We use `uv` for lightning-fast Python and package management.
- Initialize: `uv init`
- Add dependency: `uv add [package]`
- Run dev server: `python -m http.server` (or `uv run python -m http.server`)

### 🔑 Secret Management
- **Never** commit secrets to version control.
- Use the `.env` file for local development.
- Use `.env.example` as a template for team members.

---

## 🗺️ Future Roadmap
- [ ] **MSAL Auth Integration:** Standardized Microsoft OAuth2 flow for organizational accounts.
- [ ] **AI Agent Skills Library:** A directory of `.md` files in `ai-skills/` to provide consistent coding guidance across different LLM agents.
- [ ] **Automated CI/CD:** Github Actions for linting and deployment.
- [ ] **Data Visualization:** Standardized Chart.js / D3 wrappers using the Apex color palette.

---

## 🏁 Getting Started
1. **Clone** this repository.
2. **Update** `static/apex-config.js` with your app details.
3. **Create** your pages in the `pages/` directory.
4. **Run** `python -m http.server` and start building!
