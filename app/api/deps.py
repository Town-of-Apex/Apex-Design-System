"""
app/api/deps.py

FastAPI dependencies for authentication and authorization.
"""
from dataclasses import dataclass

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.auth import decode_access_token
from app.core.config import settings
from app.core.database import get_db
from app.core.exceptions import AppException
from app.models.user import User
from app.schemas.user import UserRead
from app.services.rbac_service import rbac_service

_bearer = HTTPBearer(auto_error=False)


@dataclass
class CurrentUser:
    user: UserRead
    role: str
    permissions: list[str]


def _load_user(db: Session, user_id: int) -> User:
    user = db.query(User).filter(User.id == user_id, User.is_active.is_(True)).first()
    if not user:
        raise AppException("User not found or inactive.", status_code=401, error_code="UNAUTHORIZED")
    return user


def get_current_user(
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
) -> CurrentUser:
    if not settings.AUTH_ENABLED:
        raise AppException("Authentication is disabled.", status_code=401, error_code="AUTH_DISABLED")

    if not credentials or credentials.scheme.lower() != "bearer":
        raise AppException("Authentication required.", status_code=401, error_code="UNAUTHORIZED")

    try:
        payload = decode_access_token(credentials.credentials)
        user_id = int(payload["sub"])
    except Exception:
        raise AppException("Invalid or expired token.", status_code=401, error_code="UNAUTHORIZED")

    user = _load_user(db, user_id)
    role, permissions = rbac_service.get_permissions_for_user(db, user.id)

    return CurrentUser(
        user=UserRead.model_validate(user),
        role=role,
        permissions=permissions,
    )


def get_current_user_optional(
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
) -> CurrentUser | None:
    if not settings.AUTH_ENABLED:
        return None
    if not credentials:
        return None
    try:
        return get_current_user(db=db, credentials=credentials)
    except AppException:
        return None


def require_permission(permission: str):
    def dependency(
        db: Session = Depends(get_db),
        credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
    ) -> CurrentUser | None:
        if not settings.AUTH_ENABLED:
            return None

        current = get_current_user(db=db, credentials=credentials)
        if permission not in current.permissions:
            raise AppException(
                "You do not have permission to perform this action.",
                status_code=403,
                error_code="FORBIDDEN",
            )
        return current

    return dependency
