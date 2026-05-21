"""
app/schemas/user.py

Pydantic schemas for the User resource.
Identifies input shapes, update shapes, and standard database outputs.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator


# ---------------------------------------------------------------------------
# Input Schemas
# ---------------------------------------------------------------------------

class UserCreate(BaseModel):
    username: str
    full_name: str
    password: str
    email: Optional[EmailStr] = None
    role: Optional[str] = "Employee"
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


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[str] = None
    department: Optional[str] = None
    is_active: Optional[bool] = None

    @field_validator("password")
    @classmethod
    def password_length(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and len(v) < 6:
            raise ValueError("Password must be at least 6 characters long")
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
    department: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
