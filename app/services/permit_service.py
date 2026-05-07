"""
app/services/permit_service.py

Business logic layer for permits.
Routes call these functions; they never touch the DB directly.

This is the layer where you'd add:
  - Business rule validation
  - Email notifications
  - Audit logging
  - Workflow transitions
"""
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.permit import Permit
from app.schemas.permit import PermitCreate, PermitUpdate


from .base_service import BaseService

VALID_STATUSES = {"Submitted", "Under Review", "Approved", "Rejected", "Closed"}
VALID_PERMIT_TYPES = {"Building", "Electrical", "Plumbing", "Mechanical", "Grading", "Sign", "Other"}

class PermitService(BaseService[Permit, PermitCreate, PermitUpdate]):
    def _generate_permit_number(self, db: Session) -> str:
        """
        Generate a sequential permit number like PERMIT-0042.
        """
        count = db.query(Permit).count()
        return f"PERMIT-{count + 1:04d}"

    def create_permit(self, db: Session, data: PermitCreate) -> Permit:
        """Create a new permit with a generated permit number."""
        extra_data = {
            "permit_number": self._generate_permit_number(db),
            "status": "Submitted"
        }
        return self.create(db, obj_in=data, extra_data=extra_data)

    def list_permits(
        self,
        db: Session,
        search: Optional[str] = None,
        status: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Permit]:
        """Return a filtered, paginated list of permits."""
        filters = {}
        if status:
            filters["status"] = status
            
        return self.list(
            db, 
            skip=skip, 
            limit=limit, 
            filters=filters,
            search_query=search,
            search_fields=["applicant_name", "project_address", "permit_number", "description"]
        )

    def get_permit(self, db: Session, permit_id: int) -> Optional[Permit]:
        return self.get(db, permit_id)

    def update_permit(self, db: Session, permit_id: int, data: PermitUpdate) -> Optional[Permit]:
        permit = self.get(db, permit_id)
        if not permit:
            return None
            
        # Business Rule Validation
        if data.status and data.status not in VALID_STATUSES:
            raise ValueError(f"Invalid status. Must be one of: {', '.join(VALID_STATUSES)}")
            
        return self.update(db, db_obj=permit, obj_in=data)

    def delete_permit(self, db: Session, permit_id: int) -> bool:
        return self.delete(db, id=permit_id)

# Singleton instance for export
permit_service = PermitService(Permit)
