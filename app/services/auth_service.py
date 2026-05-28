"""
app/services/auth_service.py

Authentication business logic for dev-mode username/password login.
"""
from typing import Optional

from sqlalchemy.orm import Session

from app.core.auth import create_access_token
from app.core.config import settings
from app.core.security import verify_password
from app.models.user import User
from app.schemas.auth import AuthUserRead, LoginResponse
from app.schemas.user import UserRead
from app.services.rbac_service import rbac_service


class AuthService:
    def authenticate(self, db: Session, username: str, password: str) -> Optional[User]:
        user = db.query(User).filter(User.username == username).first()
        if not user or not user.is_active:
            return None
        if not user.hashed_password or not verify_password(password, user.hashed_password):
            return None
        return user

    def build_auth_user(self, db: Session, user: User) -> AuthUserRead:
        role, permissions = rbac_service.get_permissions_for_user(db, user.id)
        return AuthUserRead(
            user=UserRead.model_validate(user),
            role=role,
            permissions=permissions,
        )

    def login(self, db: Session, username: str, password: str) -> LoginResponse:
        user = self.authenticate(db, username, password)
        if not user:
            raise ValueError("Invalid username or password")

        auth_user = self.build_auth_user(db, user)
        token = create_access_token(
            str(user.id),
            role=auth_user.role,
            permissions=auth_user.permissions,
        )
        return LoginResponse(
            access_token=token,
            user=auth_user.user,
            role=auth_user.role,
            permissions=auth_user.permissions,
        )

    def ensure_dev_admin(self, db: Session) -> None:
        """Create a default admin account in dev when none exists."""
        if not settings.DEV_MODE or not settings.SEED_DEV_ADMIN:
            return

        admin = db.query(User).filter(User.username == settings.DEV_ADMIN_USERNAME).first()
        if admin:
            rbac_service.assign_user_role(db, admin, "admin")
            return

        from app.core.security import hash_password
        from app.schemas.user import UserCreate
        from app.services.user_service import user_service

        admin = user_service.create_user(
            db,
            UserCreate(
                username=settings.DEV_ADMIN_USERNAME,
                full_name="Dev Administrator",
                password=settings.DEV_ADMIN_PASSWORD,
                email=None,
            ),
        )
        rbac_service.assign_user_role(db, admin, "admin")


auth_service = AuthService()
