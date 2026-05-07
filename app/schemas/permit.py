"""
app/schemas/permit.py

Pydantic schemas for the Permit resource.

Three distinct shapes:
  - PermitCreate  : what the client sends when creating a permit
  - PermitUpdate  : what the client sends to update (all fields optional)
  - PermitRead    : what we return to the client (includes DB-generated fields)
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, field_validator


# ---------------------------------------------------------------------------
# Input Schemas
# ---------------------------------------------------------------------------

class PermitCreate(BaseModel):
    applicant_name: str
    applicant_email: Optional[str] = None
    project_address: str
    permit_type: str
    description: str

    @field_validator("applicant_name", "project_address", "permit_type", "description")
    @classmethod
    def not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Field cannot be blank")
        return v.strip()


class PermitUpdate(BaseModel):
    """All fields optional so callers can PATCH individual fields."""
    applicant_name: Optional[str] = None
    applicant_email: Optional[str] = None
    project_address: Optional[str] = None
    permit_type: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None


# ---------------------------------------------------------------------------
# Output Schema
# ---------------------------------------------------------------------------

class PermitRead(BaseModel):
    id: int
    permit_number: str
    applicant_name: str
    applicant_email: Optional[str]
    project_address: str
    permit_type: str
    description: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
