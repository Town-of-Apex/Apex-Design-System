# App User Permissions

Authorization in this template is **app-local**. Each cloned app stores its own roles and permissions in its own database, independent of Microsoft Entra and the shared central users database.

Authorization answers: **"What can this person do in this app?"**

Authentication (proving identity) is covered in [Authentication](./authentication.md).

---

## Concepts

| Concept | Description | Stored in |
|---------|-------------|-----------|
| **Identity** | Who the person is (Entra OID, email, name) | Central users DB (future) + token claims |
| **App role** | Coarse access level in this app (`admin`, `user`) | `roles` + `app_members` |
| **Permission** | Fine-grained feature gate (`settings.access`) | `permissions` + `role_permissions` |
| **App member** | Links an identity to an app role | `app_members` |

```text
User signs in
    → app_members (user_id or entra_oid) → role (admin/user)
        → role_permissions → permissions (settings.access, users.manage, …)
```

---

## Database tables

| Table | Purpose |
|-------|---------|
| `roles` | Named roles: `admin`, `user` |
| `permissions` | Codenames: `settings.access`, `users.manage` |
| `role_permissions` | Many-to-many: which roles grant which permissions |
| `app_members` | Links `user_id` (dev) or `entra_oid` (future) to a `role_id` |

### Default permission map

Defined in `app/core/permissions.py`:

| Role | Permissions |
|------|-------------|
| `admin` | `settings.access`, `users.manage` |
| `user` | *(none by default)* |

### What's gated today

| Feature | Permission | Who has access |
|---------|------------|----------------|
| Settings page (`/settings`) | `settings.access` | admin |
| Settings gear menu item | `settings.access` | admin |
| DB status API (`/api/db-status`) | `settings.access` | admin |
| User management API (`/api/users`) | `users.manage` | admin |

---

## How to restrict a page (frontend)

### 1. Wrap the route

In `frontend/src/App.tsx`:

```tsx
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { PERMISSIONS } from "@/types/auth"

<Route
  path="/reports"
  element={
    <ProtectedRoute permission={PERMISSIONS.REPORTS_VIEW}>
      <ReportsPage />
    </ProtectedRoute>
  }
/>
```

- Not signed in → redirect to `/login`
- Signed in but missing permission → redirect to `/`
- `AUTH_ENABLED=false` → always allowed

### 2. Hide navigation items

In a component (e.g. `AppHeader.tsx`):

```tsx
const { hasPermission } = useAuth()

{hasPermission(PERMISSIONS.SETTINGS_ACCESS) && (
  <DropdownMenuItem onSelect={() => navigate("/settings")}>
    App Settings
  </DropdownMenuItem>
)}
```

### 3. Conditionally render UI sections

Inside a page that mixed public and admin content:

```tsx
const { hasPermission } = useAuth()

{hasPermission(PERMISSIONS.USERS_MANAGE) && (
  <section>{/* user management UI */}</section>
)}
```

Always enforce on the backend too — UI hiding alone is not security.

---

## How to restrict an API route (backend)

In any router file:

```python
from app.api.deps import CurrentUser, require_permission
from app.core.permissions import REPORTS_VIEW  # after you add it

@router.get("")
def list_reports(
    db: Session = Depends(get_db),
    _: CurrentUser = Depends(require_permission(REPORTS_VIEW)),
):
    ...
```

When `AUTH_ENABLED=false`, the dependency allows the request through.

---

## How to add a new permission

Example: gate a new Reports feature.

### Step 1 — Define the codename

In `app/core/permissions.py`:

```python
REPORTS_VIEW = "reports.view"

ALL_PERMISSIONS = (
    SETTINGS_ACCESS,
    USERS_MANAGE,
    REPORTS_VIEW,  # add here
)

ROLE_PERMISSIONS = {
    "admin": ALL_PERMISSIONS,
    "user": (),
    # or grant to user:  "user": (REPORTS_VIEW,),
}
```

Use the dotted convention: `resource.action`.

### Step 2 — Seed runs automatically

On startup, `rbac_service.seed_roles_and_permissions()` upserts roles and permissions from `ROLE_PERMISSIONS`. No manual SQL needed.

### Step 3 — Protect backend routes

```python
Depends(require_permission(REPORTS_VIEW))
```

### Step 4 — Mirror on frontend

In `frontend/src/types/auth.ts`:

```typescript
export const PERMISSIONS = {
  SETTINGS_ACCESS: "settings.access",
  USERS_MANAGE: "users.manage",
  REPORTS_VIEW: "reports.view",
} as const
```

Use `PERMISSIONS.REPORTS_VIEW` in `ProtectedRoute` and `hasPermission()`.

### Step 5 — Assign roles to users

Via the Settings page (admin only), create users with app role **admin** or **user**. Or update `app_members` directly in the database.

---

## Assigning roles to users

### Via Settings UI (admin)

Admins can create users and pick **Admin** or **User** as the app role. This creates both a `users` row (dev credentials) and an `app_members` row.

### Via dev admin seed

On startup with `SEED_DEV_ADMIN=true`, the default admin account is created with the `admin` role.

### Programmatically

```python
from app.services.rbac_service import rbac_service

rbac_service.assign_user_role(db, user, "admin")
```

### Future: Entra users

When Entra is integrated, create `app_members` rows keyed by `entra_oid` instead of `user_id`:

```python
AppMember(entra_oid="abc-123-from-entra", role_id=admin_role.id, is_active=True)
```

IT can assign app access by inserting/updating `app_members` when onboarding staff to an application.

---

## Apps with no auth

Set `AUTH_ENABLED=false` in `.env`. No login, no permission checks. Useful for public-facing tools.

You can skip creating permissions entirely for such apps.

---

## Key files reference

| File | Purpose |
|------|---------|
| `app/core/permissions.py` | Permission codenames and role map |
| `app/models/rbac.py` | Role, Permission, AppMember ORM models |
| `app/services/rbac_service.py` | Seed, assign roles, check permissions |
| `app/api/deps.py` | `require_permission()` FastAPI dependency |
| `frontend/src/types/auth.ts` | Frontend permission constants |
| `frontend/src/hooks/useAuth.tsx` | `hasPermission()` helper |
| `frontend/src/components/auth/ProtectedRoute.tsx` | Route guard component |
