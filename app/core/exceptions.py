from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse

class AppException(Exception):
    def __init__(self, message: str, status_code: int = 400, error_code: str = "BAD_REQUEST"):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code

async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "message": exc.message,
                "code": exc.error_code
            }
        }
    )

async def http_exception_handler(request: Request, exc: HTTPException):
    """Ensure standard HTTP exceptions also return the standard error envelope."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "message": str(exc.detail),
                "code": "HTTP_ERROR"
            }
        }
    )
