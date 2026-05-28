"""
app/schemas/auth.py

Pydantic schemas for authentication and session responses.
"""
from typing import Literal

from pydantic import BaseModel, field_validator

from app.schemas.user import UserRead


class LoginRequest(BaseModel):
    username: str
    password: str

    @field_validator("username")
    @classmethod
    def username_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Username is required")
        return v.strip()


class AuthUserRead(BaseModel):
    user: UserRead
    role: str
    permissions: list[str]


class LoginResponse(AuthUserRead):
    access_token: str
    token_type: Literal["bearer"] = "bearer"


class AuthConfigResponse(BaseModel):
    auth_enabled: bool
