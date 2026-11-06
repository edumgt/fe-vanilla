from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from python.app.core.config import settings
from python.app.api.v1.router import api_v1_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load ML models, warm-up caches, initialize connection pools
    print(f"[{settings.PROJECT_NAME}] Starting up microservice v{settings.VERSION}...")
    yield
    # Shutdown: Clean up connection pools and release GPU/CPU memory
    print(f"[{settings.PROJECT_NAME}] Shutting down gracefully...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    docs_url=f"{settings.API_V1_PREFIX}/docs",
    redoc_url=f"{settings.API_V1_PREFIX}/redoc",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(_request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "type": type(exc).__name__,
                "detail": str(exc),
            }
        }
    )

# Root Health & Info
@app.get("/health", tags=["Health"])
async def root_health():
    return {"status": "ok", "service": settings.PROJECT_NAME, "version": settings.VERSION}

# Mount Versioned Router
app.include_router(api_v1_router, prefix=settings.API_V1_PREFIX)
