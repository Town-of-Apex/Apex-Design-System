"""
app/models/user.py

Local user credentials for dev-mode authentication.

Production identity (Entra OID, profile) will live in a shared central database.
This table remains for local dev login until Entra is wired up; entra_oid links
the local row to the central identity when both exist.
"""
from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship

from app.core.database import Base


class User(Base):
    """
    Dev-mode user account (username/password).
    App authorization is stored separately in AppMember — not in User.role.
    """

    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), nullable=True)
    full_name = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=True)

    # Microsoft Entra object ID — populated when linked to central identity store
    entra_oid = Column(String(36), unique=True, nullable=True, index=True)

    # Legacy display field; use AppMember.role for authorization
    role = Column(String(50), nullable=False, default="user")
    department = Column(String(100), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)

    app_member = relationship("AppMember", back_populates="user", uselist=False)
