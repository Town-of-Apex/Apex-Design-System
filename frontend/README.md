# Apex Modern Application System

Welcome to the newly migrated React + Vite + TypeScript frontend architecture for the Town of Apex.

This architecture replaces the old vanilla HTML/JS system with a robust, type-safe, and highly maintainable React application. It is designed to be simple, predictable, and easy to understand for developers moving from Python to frontend engineering.

---

## What are all these tools doing?

If you are new to modern frontend development, here is a quick breakdown of the stack:

- **React**: The UI library. Instead of writing raw HTML and manually updating it with `document.getElementById()`, React lets you build reusable UI "components" (like `<Button />`) that automatically update themselves when their underlying data changes.
- **Vite**: The build tool and development server. It serves your code locally incredibly fast, providing "Hot Module Replacement" (HMR) — meaning when you save a file, the changes instantly appear in the browser without a full reload.
- **TypeScript**: JavaScript with types. It prevents bugs by ensuring you don't pass the wrong kind of data to a function or component. For example, it ensures a `Permit` object always has a `project_address` property.
- **Tailwind CSS**: A utility-first CSS framework. Instead of writing separate `.css` files, you apply styling directly in your components using standard class names (like `flex` or `mt-4`). We have configured it to perfectly match the Apex Modern design tokens.
- **shadcn/ui**: A collection of highly accessible, unstyled UI primitives (built on Radix UI). We don't "install" shadcn as a dependency; instead, we copy its component code directly into `src/components/ui/` so we have total control over the styling and behavior.

---

## Project Structure

The codebase is organized to be flat, predictable, and easy to navigate:

```text
/frontend
  /src
    /components
      /ui         # Reusable low-level primitives (Button, Input, Dialog, etc.)
      /layout     # Application shell components (Header, Footer, Container)
      /shared     # Components shared across multiple pages (PageHeader, StatusBadge)
    /hooks        # Reusable React logic (useTheme, useAppMetadata)
    /lib          # Helper utilities (navigation setup, class merging)
    /pages        # The main views of the application (Home, Permits, Settings)
    /services     # Centralized API logic (no raw fetch calls in components!)
    /styles       # Global CSS defining the Apex Design System variables
    /types        # TypeScript interfaces defining data shapes
    App.tsx       # The root component that defines all application routing
    main.tsx      # The entry point that boots up the React application
```

---

## Developer Workflows

### How to Run the App (Docker)

We rely on Docker to provide a consistent development environment without requiring you to install Node.js locally.

1. Start the application:
   ```bash
   docker compose up -d --build
   ```
2. Open your browser to `http://localhost:5173`.
3. Open the codebase in your editor.
4. **Live Development**: Because of volume mounts in `docker-compose.override.yml`, any changes you save to the `frontend/src/` files will automatically and instantly hot-reload in the browser.

### How to Add a New Page

1. Create a new file in `src/pages/` (e.g., `ReportsPage.tsx`).
2. Use the standard layout components:
   ```tsx
   import { PageContainer } from "@/components/layout/PageContainer"
   import { PageHeader } from "@/components/shared/PageHeader"

   export function ReportsPage() {
     return (
       <PageContainer>
         <PageHeader title="Reports" subtitle="View system reports." />
         {/* Your content here */}
       </PageContainer>
     )
   }
   ```
3. Open `src/lib/navigation.ts` and add a new entry to the `NAV_ITEMS` array. This automatically adds it to the header navigation.
4. Open `src/App.tsx` and add the `<Route />` mapping your path to your new component.

### How to Create Reusable Components

If you build a piece of UI that will be used in multiple places (like a special card or a custom table), extract it into `src/components/shared/`.

Keep components small and focused. They should ideally accept data via "props" and return UI.

### How Production Builds Work

When building for production, Vite compiles all the React, TypeScript, and CSS into a small, optimized bundle of static HTML, JS, and CSS files.

You can run `npm run build` locally to see this output in the `dist/` folder. In a production environment, you would serve this `dist/` folder using a static file server (like Nginx) or configure the FastAPI backend to serve it directly.
