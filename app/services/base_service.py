from typing import Generic, Type, TypeVar, Optional, List, Any, Union
from sqlalchemy.orm import Session
from sqlalchemy import or_
from pydantic import BaseModel
from app.core.database import Base

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)

class BaseService(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    """
    Generic CRUD service layer.
    Inherit from this to get standard GET, LIST, CREATE, UPDATE, DELETE for free.
    """
    def __init__(self, model: Type[ModelType]):
        self.model = model

    def get(self, db: Session, id: Any) -> Optional[ModelType]:
        """Fetch a single record by ID."""
        return db.query(self.model).filter(self.model.id == id).first()

    def list(
        self, 
        db: Session, 
        *, 
        skip: int = 0, 
        limit: int = 100,
        filters: Optional[dict] = None,
        search_query: Optional[Any] = None,
        search_fields: Optional[List[str]] = None
    ) -> List[ModelType]:
        """Return a filtered, paginated list of records."""
        query = db.query(self.model)
        
        if filters:
            for field, value in filters.items():
                if hasattr(self.model, field):
                    query = query.filter(getattr(self.model, field) == value)
        
        if search_query and search_fields:
            search_filters = []
            term = f"%{search_query}%"
            for field in search_fields:
                if hasattr(self.model, field):
                    search_filters.append(getattr(self.model, field).ilike(term))
            if search_filters:
                query = query.filter(or_(*search_filters))

        return query.offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: CreateSchemaType, extra_data: Optional[dict] = None) -> ModelType:
        """Create and persist a new record."""
        obj_in_data = obj_in.model_dump()
        if extra_data:
            obj_in_data.update(extra_data)
            
        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self, 
        db: Session, 
        *, 
        db_obj: ModelType, 
        obj_in: Union[UpdateSchemaType, dict]
    ) -> ModelType:
        """Update a record with only the provided fields."""
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
            
        for field, value in update_data.items():
            if hasattr(db_obj, field):
                setattr(db_obj, field, value)
        
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, *, id: Any) -> bool:
        """Delete a record by ID. Returns True if deleted, False if not found."""
        obj = self.get(db, id)
        if not obj:
            return False
        db.delete(obj)
        db.commit()
        return True
