from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
import os

# Respect the BASE_PATH for Traefik routing
# If running locally without a proxy, this is usually empty or '/'
BASE_PATH = os.getenv("BASE_PATH", "").rstrip('/')

app = FastAPI(root_path=BASE_PATH)

# Setup templates (pointing to the pages directory)
templates = Jinja2Templates(directory="pages")

# 1. Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/pages", StaticFiles(directory="pages"), name="pages")

# 2. Special route for app_metadata.json and favicon.ico
@app.get("/app_metadata.json")
async def get_metadata():
    from fastapi.responses import FileResponse
    return FileResponse("app_metadata.json")

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    from fastapi.responses import FileResponse
    return FileResponse("static/favicon.svg")


# 3. Main entry point using Jinja2 to inject the BASE_PATH
@app.get("/", response_class=HTMLResponse)
async def read_index(request: Request):
    # We pass BASE_PATH to the template so the <base> tag can use it
    return templates.TemplateResponse(request, "core.html", {
        "BASE_PATH": BASE_PATH or ""
    })


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
