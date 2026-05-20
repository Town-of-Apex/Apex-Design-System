"""
app/main.py

FastAPI application factory.

Responsibilities:
  1. Mount static files and pages (AAS-1.0 standard)
  2. Register API routers
  3. Create DB tables on startup
  4. Serve core.html as the SPA shell
"""
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse

from app.core.config import settings
from app.core.database import init_db
from app.core.exceptions import AppException, app_exception_handler, http_exception_handler
from app.api.routes import permits as permit_router
from app.api.routes import users as user_router
from app.api.routes import db_status as db_status_router

# ---------------------------------------------------------------------------
# App instance
# ---------------------------------------------------------------------------
app = FastAPI(
    root_path=settings.BASE_PATH,
    title="Apex Permit Tracker",
    description="Template CRUD application built on the Apex App Standard (AAS-1.0).",
    version="1.0.0",
)

# Exception handlers
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)

# ---------------------------------------------------------------------------
# Startup: create DB tables
# ---------------------------------------------------------------------------
@app.on_event("startup")
def on_startup():
    init_db()

# ---------------------------------------------------------------------------
# API Routers
# ---------------------------------------------------------------------------
app.include_router(permit_router.router)
app.include_router(user_router.router)
app.include_router(db_status_router.router)

# ---------------------------------------------------------------------------
# Utility routes
# ---------------------------------------------------------------------------
@app.get("/app_metadata.json", include_in_schema=False)
async def get_metadata():
    return FileResponse("app_metadata.json")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
