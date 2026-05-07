"""
app/models/permit.py

SQLAlchemy ORM model for the permits table.
Add new fields here and re-run init_db() (or run an Alembic migration later).
"""
from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func

from app.core.database import Base


def _utcnow():
    """Return a timezone-aware UTC datetime. Use this instead of utcnow()."""
    return datetime.now(timezone.utc)


class Permit(Base):
    # permit_number generation logic is in the service
    permit_number = Column(String(20), unique=True, nullable=False, index=True)

    # Core applicant info
    applicant_name = Column(String(200), nullable=False)
    applicant_email = Column(String(200), nullable=True)
    project_address = Column(String(500), nullable=False)

    # Work description
    permit_type = Column(String(100), nullable=False)  # e.g. "Building", "Electrical"
    description = Column(Text, nullable=False)

    # Workflow state
    status = Column(String(50), nullable=False, default="Submitted")
