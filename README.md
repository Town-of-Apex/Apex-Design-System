# 🛡️ Apex Application Template

The **Apex Application Template** is the standardized starting point for all web application development within our team. It provides a pre-configured, visually consistent "App Shell" that adheres to the **Apex Design System (v2.0)** and handles the complexities of sub-path routing and containerized deployment out-of-the-box.

---

## 🏗️ Architecture Overview

### 1. Project Metadata (`app_metadata.json`)
The source of truth for project-wide information.
- **Fields:** `title`, `version`, `author`, `logo`, and `favicon`.
- **Usage:** Dynamically loaded by the frontend at runtime.

### 2. UI Configuration (`static/apex-config.js`)
Handles the visual structure of the app shell.
- **Usage:** Define your navigation `tabs` here. Use paths relative to the base (e.g., `pages/home.html`).

### 3. Application Shell (`pages/core.html` & `app/main.py`)
- **Backend:** A FastAPI server that handles `BASE_PATH` injection and serves static files.
- **Frontend:** A Jinja2-powered HTML shell that uses a `<base>` tag for seamless sub-path routing.

---

## 🛠️ Local Development

For the best experience, use Docker with the provided override file.

1. **Clone the Repo.**
2. **Create the Internal Network** (if it doesn't exist):
   ```powershell
   docker network create apex-internal
   ```
3. **Start the Dev Server:**
   ```powershell
   docker compose up --build
   ```
   *Note: This uses `docker-compose.override.yml` to volume-mount your code, meaning changes you make to HTML/JS reflect instantly without a rebuild.*
4. **Access the App:**
   - **Default:** `http://localhost:8080/demo/`
   - **IMPORTANT:** Always include the trailing slash when testing sub-paths locally.

---

## 🚀 Deployment (VM + Traefik)

To deploy on a VM behind an Apex Traefik router:

1. **Update the Base Path:**
   If you want to move the app from `/demo` to `/my-app`:
   - **`docker-compose.yml`**: Update the `BASE_PATH` environment variable and the Traefik `PathPrefix` labels.
   - **`.env`**: Update your `BASE_PATH` variable.
2. **Launch in Production Mode:**
   ```bash
   docker compose -f docker-compose.yml up -d --build
   ```
   *Note: This "bakes" the code into the image for immutability.*

---

## 🎨 Branding & Customization

To update the application's look and feel:
1. **Logo & Favicon:** Replace the files in `static/` and update the paths in `app_metadata.json`.
2. **Navigation:** Add or remove objects in the `tabs` array in `static/apex-config.js`.
3. **Content:** Create or edit HTML snippets in the `pages/` directory.

---

## 📋 Technical Stack
- **Backend:** Python 3.13 / FastAPI (Standardized on port `8080`)
- **Templates:** Jinja2
- **Styling:** Apex Modern CSS (Vanilla)
- **Deployment:** Docker / Docker Compose / Traefik

## AI Agent Skills
- apex-app-architecture (v1 complete)
- apex-code-review (v1 complete)
- apex-modern-ui-design (v1 complete)
- apex-debug-and-fix (not complete)
- apex-dependencies (not complete)
- apex-pre-deploy (not complete)
- apex-security (not complete)
- apex-template-skill (v1 complete)

## To-Dos for this Project
- Add user authentication placeholder and profile system
- Add notification system (maybe?)
- Add Microsoft authentication stub for Azure AD integration
- Add settings page placeholder
- Add API starter file (maybe?)