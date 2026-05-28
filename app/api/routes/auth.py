"""
app/api/routes/auth.py

Authentication routes for dev-mode login and session introspection.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import CurrentUser, get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.core.exceptions import AppException
from app.core.responses import ok
from app.schemas.auth import AuthConfigResponse, LoginRequest
from app.services.auth_service import auth_service

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.get("/config")
def auth_config():
    return ok(AuthConfigResponse(auth_enabled=settings.AUTH_ENABLED).model_dump())


@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    if not settings.AUTH_ENABLED:
        raise AppException("Authentication is disabled for this application.", status_code=400)

    try:
        result = auth_service.login(db, payload.username, payload.password)
    except ValueError as exc:
        raise AppException(str(exc), status_code=401, error_code="UNAUTHORIZED")

    return ok(result.model_dump())


@router.get("/me")
def me(current: CurrentUser = Depends(get_current_user)):
    return ok(
        {
            "user": current.user.model_dump(),
            "role": current.role,
            "permissions": current.permissions,
        }
    )
