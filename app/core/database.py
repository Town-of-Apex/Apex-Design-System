import os
import pkgutil
import importlib
import logging
from datetime import datetime, timezone
from sqlalchemy import create_engine, Column, Integer, DateTime, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase, declared_attr
from sqlalchemy.sql import func

from app.core.config import settings

logger = logging.getLogger(__name__)

# Global database connection status info
db_status_info = {
    "connected": False,
    "engine": "Unknown",
    "url": settings.DATABASE_URL,
    "fallback_active": False,
    "error": None
}

# Configure primary database engine
is_sqlite = settings.DATABASE_URL.startswith("sqlite")
if is_sqlite:
    connect_args = {"check_same_thread": False}
    engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)
else:
    # PostgreSQL standard production connection pool configurations
    engine = create_engine(
        settings.DATABASE_URL,
        pool_size=10,
        max_overflow=20,
        pool_recycle=1800
    )

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
    global engine, SessionLocal

    primary_url = settings.DATABASE_URL
    is_primary_sqlite = primary_url.startswith("sqlite")
    
    db_status_info["engine"] = "SQLite" if is_primary_sqlite else "PostgreSQL"
    db_status_info["url"] = primary_url
    
    try:
        # Attempt to connect to check if the database is running and credentials work
        # Running a simple query check
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        
        db_status_info["connected"] = True
        db_status_info["fallback_active"] = False
        db_status_info["error"] = None
        logger.info(f"Successfully connected to primary database: {db_status_info['engine']}")

    except Exception as e:
        logger.error(f"Failed to connect to primary database at {primary_url}: {e}")
        
        if not is_primary_sqlite and settings.ALLOW_SQLITE_FALLBACK:
            fallback_url = settings.FALLBACK_DATABASE_URL
            logger.warning(f"ALLOW_SQLITE_FALLBACK is True. Re-binding database engine to SQLite at {fallback_url}")
            
            # Recreate engine for SQLite
            connect_args = {"check_same_thread": False}
            engine = create_engine(fallback_url, connect_args=connect_args)
            SessionLocal.configure(bind=engine)
            
            db_status_info["connected"] = True
            db_status_info["engine"] = "SQLite (Fallback)"
            db_status_info["url"] = fallback_url
            db_status_info["fallback_active"] = True
            db_status_info["error"] = f"Primary DB connection failed: {str(e)}"
            
            # Ensure the directory exists for SQLite fallback file
            db_path = fallback_url.replace("sqlite:///", "")
            if "/" in db_path or "\\" in db_path:
                os.makedirs(os.path.dirname(db_path), exist_ok=True)
        else:
            db_status_info["connected"] = False
            db_status_info["error"] = str(e)
            # Re-raise error if fallback is not allowed or if SQLite itself failed
            raise e

    # Automatically import all modules in app.models to register them with Base
    import app.models as models_pkg
    for _, name, _ in pkgutil.iter_modules(models_pkg.__path__):
        importlib.import_module(f"app.models.{name}")

    Base.metadata.create_all(bind=engine)
