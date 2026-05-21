"""
app/api/routes/db_status.py

FastAPI router for verifying the active database connection.
Returns connection details, table names, and engine statistics.
"""
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

import app.core.database as db_core
from app.core.database import get_db, db_status_info
from app.core.responses import ok

router = APIRouter(prefix="/api/db-status", tags=["db-status"])


@router.get("")
def get_db_status(db: Session = Depends(get_db)):
    """
    Check the current database connection.
    Retrieves dialect-specific parameters, table list, and warnings.
    """
    status = db_status_info.copy()

    # Mask credentials in the displayed connection URL
    url_str = str(status["url"])
    if "@" in url_str:
        try:
            prefix, suffix = url_str.split("@", 1)
            if "://" in prefix:
                proto, creds = prefix.split("://", 1)
                if ":" in creds:
                    user, _ = creds.split(":", 1)
                    url_str = f"{proto}://{user}:******@{suffix}"
                else:
                    url_str = f"{proto}://******@{suffix}"
        except Exception:
            url_str = "******"
            
    status["url"] = url_str

    if status["connected"]:
        try:
            dialect_name = db_core.engine.dialect.name
            status["dialect"] = dialect_name

            # Query list of non-system tables
            if dialect_name == "postgresql":
                tables_query = text(
                    "SELECT table_name FROM information_schema.tables "
                    "WHERE table_schema = 'public' AND table_type = 'BASE TABLE'"
                )
                tables = db.execute(tables_query).fetchall()
                status["tables"] = [row[0] for row in tables if row[0] not in ('spatial_ref_sys',)]

                # Postgres-specific metrics
                version = db.execute(text("SELECT version()")).scalar()
                connections = db.execute(text("SELECT count(*) FROM pg_stat_activity")).scalar()
                db_size = db.execute(text("SELECT pg_size_pretty(pg_database_size(current_database()))")).scalar()

                status["details"] = {
                    "version": version.split(",")[0] if version else "PostgreSQL",
                    "active_connections": connections,
                    "database_size": db_size
                }
            else:
                tables_query = text("SELECT name FROM sqlite_master WHERE type='table'")
                tables = db.execute(tables_query).fetchall()
                status["tables"] = [row[0] for row in tables if row[0] not in ('sqlite_sequence',)]

                status["details"] = {
                    "version": "SQLite " + db.execute(text("SELECT sqlite_version()")).scalar()
                }

        except Exception as e:
            status["meta_error"] = f"Failed to retrieve database metadata: {str(e)}"

    if status["fallback_active"]:
        status["warning"] = (
            "⚠️ SQLite Fallback Active: PostgreSQL database could not be reached. "
            "Data is currently being stored locally inside a SQLite file."
        )

    return ok(status)
