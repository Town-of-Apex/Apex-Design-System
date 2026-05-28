"""
app/models/rbac.py

App-local roles, permissions, and member assignments.

Identity (name, email, Entra OID) will eventually live in a shared central database.
This app database stores only authorization: which identities may access which features.
"""
from sqlalchemy import Boolean, Column, ForeignKey, String, Table, UniqueConstraint
from sqlalchemy.orm import relationship

from app.core.database import Base

role_permissions = Table(
    "role_permissions",
    Base.metadata,
    Column(
        "role_id",
        ForeignKey("roles.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "permission_id",
        ForeignKey("permissions.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)


class Role(Base):
    """App role (e.g. admin, user)."""

    name = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(String(255), nullable=True)

    permissions = relationship(
        "Permission",
        secondary=role_permissions,
        back_populates="roles",
    )
    members = relationship("AppMember", back_populates="role")


class Permission(Base):
    """Fine-grained permission codename (e.g. settings.access)."""

    codename = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(String(255), nullable=True)

    roles = relationship(
        "Role",
        secondary=role_permissions,
        back_populates="permissions",
    )


class AppMember(Base):
    """
    Links an identity to an app role.

    During local dev, user_id references the template users table.
    After Entra integration, entra_oid references the shared identity store.
    """

    __tablename__ = "app_members"
    __table_args__ = (
        UniqueConstraint("user_id", name="uq_app_members_user_id"),
        UniqueConstraint("entra_oid", name="uq_app_members_entra_oid"),
    )

    user_id = Column(ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    entra_oid = Column(String(36), nullable=True, index=True)
    role_id = Column(ForeignKey("roles.id", ondelete="RESTRICT"), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)

    role = relationship("Role", back_populates="members")
    user = relationship("User", back_populates="app_member")
