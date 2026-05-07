"""
app/core/database.py

SQLAlchemy engine and session setup.
Import `get_db` as a FastAPI dependency in your routes.
"""
import os
import pkgutil
import importlib
from datetime import datetime, timezone
from sqlalchemy import create_engine, Column, Integer, DateTime
from sqlalchemy.orm import sessionmaker, DeclarativeBase, declared_attr
from sqlalchemy.sql import func

from app.core.config import DATABASE_URL

# SQLite needs check_same_thread=False; other drivers ignore this kwarg.
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """
    All ORM models inherit from this base.
    Includes standard fields by default to avoid repetition.
    """
    id = Column(Integer, primary_key=True, index=True)
    
    # Audit fields
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    @declared_attr
    def __tablename__(cls) -> str:
        """Automatically generate table name from class name (lowercase)."""
        return cls.__name__.lower() + "s"


def get_db():
    """
    FastAPI dependency that yields a DB session and ensures it's closed
    after the request, even if an exception is raised.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Create all tables defined in ORM models.
    Called once at application startup.
    Automatically discovers all models in the app.models package.
    """
    # Ensure the data directory exists for SQLite
    if DATABASE_URL.startswith("sqlite"):
        db_path = DATABASE_URL.replace("sqlite:///", "")
        if "/" in db_path or "\\" in db_path:
            os.makedirs(os.path.dirname(db_path), exist_ok=True)

    # Automatically import all modules in app.models to register them with Base
    import app.models as models_pkg
    for _, name, _ in pkgutil.iter_modules(models_pkg.__path__):
        importlib.import_module(f"app.models.{name}")

    Base.metadata.create_all(bind=engine)
