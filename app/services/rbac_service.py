"""
app/services/rbac_service.py

Role, permission, and app membership management.
"""
from typing import Optional

from sqlalchemy.orm import Session, joinedload

from app.core.permissions import ALL_PERMISSIONS, ROLE_NAMES, ROLE_PERMISSIONS
from app.models.rbac import AppMember, Permission, Role
from app.models.user import User


class RbacService:
    def seed_roles_and_permissions(self, db: Session) -> None:
        """Ensure default roles and permissions exist."""
        for codename in ALL_PERMISSIONS:
            if not db.query(Permission).filter(Permission.codename == codename).first():
                db.add(Permission(codename=codename, description=codename.replace(".", " ")))

        db.flush()

        for role_name in ROLE_NAMES:
            role = db.query(Role).filter(Role.name == role_name).first()
            if not role:
                role = Role(
                    name=role_name,
                    description=f"Default {role_name} role",
                )
                db.add(role)
                db.flush()

            desired = {
                db.query(Permission)
                .filter(Permission.codename == codename)
                .one()
                for codename in ROLE_PERMISSIONS[role_name]
            }
            role.permissions = list(desired)

        db.commit()

    def get_role_by_name(self, db: Session, name: str) -> Optional[Role]:
        return db.query(Role).filter(Role.name == name).first()

    def get_member_for_user(self, db: Session, user_id: int) -> Optional[AppMember]:
        return (
            db.query(AppMember)
            .options(joinedload(AppMember.role).joinedload(Role.permissions))
            .filter(AppMember.user_id == user_id, AppMember.is_active.is_(True))
            .first()
        )

    def get_permissions_for_user(self, db: Session, user_id: int) -> tuple[str, list[str]]:
        member = self.get_member_for_user(db, user_id)
        if not member or not member.role:
            return "user", []
        codenames = sorted(p.codename for p in member.role.permissions)
        return member.role.name, codenames

    def assign_user_role(
        self,
        db: Session,
        user: User,
        role_name: str,
        *,
        entra_oid: Optional[str] = None,
    ) -> AppMember:
        role = self.get_role_by_name(db, role_name)
        if not role:
            raise ValueError(f"Unknown role '{role_name}'")

        member = self.get_member_for_user(db, user.id)
        if member:
            member.role_id = role.id
            if entra_oid:
                member.entra_oid = entra_oid
        else:
            member = AppMember(
                user_id=user.id,
                entra_oid=entra_oid,
                role_id=role.id,
                is_active=True,
            )
            db.add(member)

        user.role = role_name
        db.commit()
        db.refresh(member)
        return member

    def user_has_permission(self, db: Session, user_id: int, permission: str) -> bool:
        _, permissions = self.get_permissions_for_user(db, user_id)
        return permission in permissions


rbac_service = RbacService()
