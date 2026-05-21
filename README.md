# 🛡️ Apex Application Template

The **Apex Application Template** is the standardized starting point for all web application development within the Town of Apex. 

This repository has been fully migrated to a modern **React + Vite + TypeScript** frontend architecture, utilizing a decoupled **FastAPI** backend serving as a clean REST API layer. The legacy server-rendered Jinja2 templates, static folders, and custom JavaScript routing engine (`pages/` and `static/`) have been completely retired.

---

## 🏗️ Architecture Overview

The system is split into two independent services operating over a shared API data contract:

```mermaid
graph TD
    Browser[Web Browser] -->|Routes /api & /app_metadata.json| Backend[FastAPI Backend :8080]
    Browser -->|Routes /*| Frontend[Vite/React Frontend :5173]
    Frontend -->|Typed Requests| Backend
    Backend -->|SQLAlchemy| DB[(SQLite Database)]
```

### 1. Frontend Architecture (`/frontend/src/`)
Located in the `frontend` folder, built on **React 19**, **Vite**, **TypeScript**, and **Tailwind CSS**.
*   **Routing (`App.tsx` & `AppShell.tsx`)**: Configured via React Router. The `AppShell` component establishes the common header, sidebar navigation, and footer layout globally.
*   **Branding & Metadata (`useAppMetadata.ts`)**: Instead of hardcoding text or manipulating the DOM with custom scripts, the application consumes `app_metadata.json` dynamically at runtime using the `useAppMetadata` hook. This updates the document tab title and populates footer versions and copyright details automatically.
*   **Service Layer (`services/` & `types/`)**: Centralized HTTP client methods (e.g. `permitService.ts`) manage communication with the backend. **No raw fetch calls** are written inside individual UI pages or components.
*   **Styling (`styles/globals.css`)**: Implements the official Town of Apex Design System v2.0 design tokens (color-mix state palettes, layered canvas surfaces, font styling, and standard spacing scales) combined with Tailwind CSS.

### 2. Backend Architecture (`/app/`)
A lean Python/FastAPI service serving as the single source of truth for data and metadata.
*   **Database Foundation**: Abstracted using SQLAlchemy 2.0. All models inherit from a common `Base` database model class that auto-adds tracking and keys. New models placed under `app/models/` are auto-discovered on startup by `init_db()`.
*   **Business Logic (Services)**: The service layer (`app/services/`) inherits from a generic `BaseService` template to provide standard CRUD, pagination, and text-based searches out-of-the-box.
*   **Clean API Registration**: Legacy Jinja2 mounts, template setups, and static page serving have been removed. The backend only registers the resource routers (e.g., `app/api/routes/permits.py`) and serves the global `/app_metadata.json` file.

---

## 🛠️ Local Development Workflow

The development environment is containerized using Docker and Orchestrated with Docker Compose.

### Running with Docker (Recommended)
1.  **Create the Internal Network** (if not already present):
    ```bash
    docker network create apex-internal
    ```
2.  **Start the Dev Containers**:
    ```bash
    docker compose up --build
    ```
    *Note: This mounts local directories via `docker-compose.override.yml`, meaning backend changes reload Uvicorn, and frontend changes trigger Vite's Hot Module Replacement (HMR) instantly in the browser.*
3.  **Access the Application**:
    *   Open `http://localhost:5173/` in your browser.
    *   Vite proxies `/api/*` and `/app_metadata.json` requests directly to the backend service container at port `8080`.

### Running Frontend Locally (Outside Docker)
If you prefer running the frontend server locally on your host machine (e.g., for direct npm debugging):
1.  Navigate to the directory: `cd frontend`
2.  Install packages: `npm install`
3.  Start the local dev server: `npm run dev`
    *Note: The `vite.config.ts` dynamically detects whether it is running inside a container or on the host machine. If on the host, the dev server automatically redirects API proxies to `http://localhost:8080` instead of `http://apex-backend:8080`.*

---

## 🚀 Adding New Features & Resources

To add a new entity to this project (e.g., a "Vehicle Logs" feature), follow this flow:

### Step 1: Backend Setup
1.  **Model**: Create a SQLAlchemy model in `app/models/vehicle_log.py` inheriting from `Base`.
2.  **Schema**: Create Pydantic schemas in `app/schemas/vehicle_log.py` (e.g., `VehicleLogCreate`, `VehicleLogUpdate`, `VehicleLogRead`).
3.  **Service**: Create `app/services/vehicle_log_service.py` extending `BaseService`.
4.  **Route**: Create a router in `app/api/routes/vehicle_logs.py` and register it inside `app/main.py`.

### Step 2: Frontend Setup
1.  **Types**: Create TypeScript interface files in `frontend/src/types/vehicleLog.ts` defining data shapes that match your Pydantic schemas.
2.  **Service**: Create `frontend/src/services/vehicleLogService.ts` utilizing the shared client `get`/`post`/`put`/`del` functions from `api.ts`.
3.  **Page**: Create your page component (e.g., `VehicleLogsPage.tsx`) in `frontend/src/pages/` utilizing your UI layout elements.
4.  **Route**: Add a route map pointing to your new page in `frontend/src/App.tsx`.
5.  **Navigation**: Register the new page inside `frontend/src/lib/navigation.ts` to automatically display it in the navigation header.

---

## 📋 Technical Stack
*   **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS, Lucide icons, Sonner toasts
*   **Backend**: Python 3.13, FastAPI, SQLAlchemy 2.0 (Primary: PostgreSQL 15, Fallback: SQLite 3)
*   **Reverse Proxy**: Traefik (routes `/api` to Python and all other traffic to React)
*   **Containerization**: Docker & Docker Compose

---

## 🗄️ Database Connection & Fallback Architecture

The template app is configured to use **PostgreSQL** as its primary database system. To facilitate rapid, zero-config local prototyping, it implements an **automatic fallback mechanism to SQLite**.

### Configuration variables (`.env` or docker environment)
- `DATABASE_URL`: Connection string for PostgreSQL (e.g. `postgresql+psycopg2://postgres:postgres@localhost:5432/apex_db`).
- `ALLOW_SQLITE_FALLBACK`: Set to `True` (default) to fallback to a local SQLite file if the PostgreSQL database is unreachable.
- `FALLBACK_DATABASE_URL`: Location of the fallback database (default `sqlite:///./data/app.db`).

If the primary PostgreSQL server is down or unreachable, the system will log a warning and automatically configure itself to run using local SQLite storage, making the warning visible in the frontend Settings page.

---

## To-Dos
* **Adjust for Dev and Production Workflows**: Separate paths for using the app in the development process (using npm run dev) and in a deployment environment (npm run build + docker)
* **Authentication**: Build a standardized, out-of-the-box tool for authenticating applications using Microsoft AD for staff user verification. Preferably to include basic role-based permissions on a per-app basis as well. 
* **Sidebar**: Add a collapsible sidebar in addition to the header for additional navigation and customization space. 

## Completed
* [x] **PostgreSQL Migration**: Convert the default template database to PostgreSQL connection structures and containerize a database instance. Implemented robust SQLite automatic fallback behavior with visual warning alerts.

## Fixes and Tweaks
* Non-theme settings don't persist (may want a useSettings script instead of just useTheme)
* Buttons' hover state doesn't change based on the theme being used (primary color should be modified to set the hover color or something like that) (probably need whole palette for each theme)
* Include links to documentation or custom-made pages for each of the core technologies listed in the tech stack
* Write up a detailed guide document for how to take the template app and build out a new application inside it (going through dev-mode testing, processes, checks, deployment configuration, and launch)
* Review CSS files and figure out how to consolidate or simplify (do we need both App.css and index.css? How do we add color themes? Do we need a full palette or can the shades be calculated?)