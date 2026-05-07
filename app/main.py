"""
app/main.py

FastAPI application factory.

Responsibilities:
  1. Mount static files and pages (AAS-1.0 standard)
  2. Register API routers
  3. Create DB tables on startup
  4. Serve core.html as the SPA shell
"""
from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, FileResponse

from app.core.config import settings, BASE_PATH
from app.core.database import init_db
from app.core.exceptions import AppException, app_exception_handler, http_exception_handler
from app.api.routes import permits as permit_router

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
# Static file mounts (AAS-1.0)
# ---------------------------------------------------------------------------
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/pages", StaticFiles(directory="pages"), name="pages")

# ---------------------------------------------------------------------------
# API Routers
# ---------------------------------------------------------------------------
app.include_router(permit_router.router)

# ---------------------------------------------------------------------------
# Jinja2 templates (only needed for core.html BASE_PATH injection)
# ---------------------------------------------------------------------------
templates = Jinja2Templates(directory="pages")

# ---------------------------------------------------------------------------
# Utility routes
# ---------------------------------------------------------------------------
@app.get("/app_metadata.json", include_in_schema=False)
async def get_metadata():
    return FileResponse("app_metadata.json")

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return FileResponse("static/favicon.svg")

# ---------------------------------------------------------------------------
# SPA shell — serves core.html for every non-API route
# ---------------------------------------------------------------------------
@app.get("/", response_class=HTMLResponse, include_in_schema=False)
async def read_index(request: Request):
    return templates.TemplateResponse(request, "core.html", {
        "BASE_PATH": BASE_PATH or ""
    })


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
