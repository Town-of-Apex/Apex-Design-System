from typing import Any, Callable, Coroutine
from fastapi import Request, Response
from fastapi.routing import APIRoute

class EnvelopeRoute(APIRoute):
    def get_route_handler(self) -> Callable[[Request], Coroutine[Any, Any, Response]]:
        original_route_handler = super().get_route_handler()

        async def custom_route_handler(request: Request) -> Response:
            response: Response = await original_route_handler(request)
            
            # If the response is already a standard Response object (like FileResponse), 
            # don't wrap it.
            if isinstance(response, Response) and not hasattr(response, "body"):
                return response

            # If it's a JSON response, we can wrap the body
            # This is a bit tricky with FastAPI's internals, 
            # so often it's easier to just use a decorator or a custom response class.
            return response

        return custom_route_handler

def ok(data: Any) -> dict:
    """Standard success envelope."""
    return {"success": True, "data": data}

def err(message: str, error_code: str = "ERROR") -> dict:
    """Standard error envelope."""
    return {
        "success": False, 
        "error": {
            "message": message,
            "code": error_code
        }
    }
