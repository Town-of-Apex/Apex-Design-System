"""
app/schemas/user.py

Pydantic schemas for the User resource.
Identifies input shapes, update shapes, and standard database outputs.
"""
from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, field_validator

from app.core.permissions import ROLE_NAMES

AppRoleName = Literal["admin", "user"]


# ---------------------------------------------------------------------------
# Input Schemas
# ---------------------------------------------------------------------------

class UserCreate(BaseModel):
    username: str
    full_name: str
    password: str
    email: Optional[EmailStr] = None
    app_role: AppRoleName = "user"
    department: Optional[str] = None

    @field_validator("username", "full_name")
    @classmethod
    def not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Field cannot be blank")
        return v.strip()

    @field_validator("password")
    @classmethod
    def password_length(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters long")
        return v

    @field_validator("app_role")
    @classmethod
    def valid_app_role(cls, v: str) -> str:
        if v not in ROLE_NAMES:
            raise ValueError(f"Role must be one of: {', '.join(ROLE_NAMES)}")
        return v


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    app_role: Optional[AppRoleName] = None
    department: Optional[str] = None
    is_active: Optional[bool] = None

    @field_validator("password")
    @classmethod
    def password_length(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and len(v) < 6:
            raise ValueError("Password must be at least 6 characters long")
        return v

    @field_validator("app_role")
    @classmethod
    def valid_app_role(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in ROLE_NAMES:
            raise ValueError(f"Role must be one of: {', '.join(ROLE_NAMES)}")
        return v


# ---------------------------------------------------------------------------
# Output Schema
# ---------------------------------------------------------------------------

class UserRead(BaseModel):
    id: int
    username: str
    full_name: str
    email: Optional[str]
    role: str
    app_role: Optional[str] = None
    department: Optional[str]
    is_active: bool
    entra_oid: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
