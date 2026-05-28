"""
app/core/permissions.py

Application permission codenames and default role mappings.
Extend PERMISSIONS and ROLE_PERMISSIONS when adding new gated features.
"""

# Permission codenames — use dotted resource.action convention
SETTINGS_ACCESS = "settings.access"
USERS_MANAGE = "users.manage"

ALL_PERMISSIONS = (SETTINGS_ACCESS, USERS_MANAGE)

# Default role → permission mapping (seeded into the database on startup)
ROLE_PERMISSIONS: dict[str, tuple[str, ...]] = {
    "admin": ALL_PERMISSIONS,
    "user": (),
}

ROLE_NAMES = tuple(ROLE_PERMISSIONS.keys())
