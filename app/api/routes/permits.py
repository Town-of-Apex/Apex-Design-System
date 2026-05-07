"""
app/api/routes/permits.py

FastAPI router for the /api/permits resource.
Routes are intentionally thin: validate input, call service, return response.
Business logic belongs in permit_service.py.
"""
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.responses import ok
from app.core.exceptions import AppException
from app.schemas.permit import PermitCreate, PermitUpdate, PermitRead
from app.services.permit_service import permit_service

router = APIRouter(prefix="/api/permits", tags=["permits"])


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("", status_code=201)
def create_permit(payload: PermitCreate, db: Session = Depends(get_db)):
    """Submit a new permit application."""
    permit = permit_service.create_permit(db, payload)
    return ok(PermitRead.model_validate(permit).model_dump())


@router.get("")
def list_permits(
    search: Optional[str] = Query(None, description="Free-text search across name, address, permit number"),
    status: Optional[str] = Query(None, description="Filter by exact status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    """Return a filtered, paginated list of permits."""
    permits = permit_service.list_permits(db, search=search, status=status, skip=skip, limit=limit)
    return ok([PermitRead.model_validate(p).model_dump() for p in permits])


@router.get("/{permit_id}")
def get_permit(permit_id: int, db: Session = Depends(get_db)):
    """Fetch a single permit by ID."""
    permit = permit_service.get_permit(db, permit_id)
    if not permit:
        raise AppException(f"Permit {permit_id} not found.", status_code=404)
    return ok(PermitRead.model_validate(permit).model_dump())


@router.put("/{permit_id}")
def update_permit(permit_id: int, payload: PermitUpdate, db: Session = Depends(get_db)):
    """Update one or more fields on an existing permit."""
    try:
        permit = permit_service.update_permit(db, permit_id, payload)
    except ValueError as e:
        raise AppException(str(e))

    if not permit:
        raise AppException(f"Permit {permit_id} not found.", status_code=404)
    return ok(PermitRead.model_validate(permit).model_dump())


@router.delete("/{permit_id}", status_code=200)
def delete_permit(permit_id: int, db: Session = Depends(get_db)):
    """Permanently delete a permit."""
    deleted = permit_service.delete_permit(db, permit_id)
    if not deleted:
        raise AppException(f"Permit {permit_id} not found.", status_code=404)
    return ok({"deleted": True, "id": permit_id})
