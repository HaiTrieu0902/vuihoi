from __future__ import annotations

from contextlib import asynccontextmanager
import logfire
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
from sqlalchemy import text

from api.routers.auth import router as auth_router

from core.middleware import (
    APIRateLimitMiddleware,
    RequestSizeLimitMiddleware,
    SecurityHeadersMiddleware,
)

from db import async_engine, create_all, seed_feature_presets
from settings import settings



def _get_cors_origins() -> list[str]:
    # Allow localhost dev ports by default
    # Avoid '*' when allow_credentials is True
    origins: list[str] = []
    # Add Railway public domain if provided
    railway_domain = settings.railway_public_domain
    if railway_domain:
        origins.append(f"https://{railway_domain}")
    # Add explicit HOST_URL if provided
    host_url = settings.host_url
    if host_url:
        origins.append(host_url)
    # Optional comma-separated ALLOWED_ORIGINS env
    extra = settings.allowed_origins
    if extra:
        for item in extra.split(","):
            val = item.strip()
            if val:
                origins.append(val)
    # Normalize: strip trailing slashes and whitespace
    normalized: list[str] = []
    for o in origins:
        try:
            oo = o.strip().rstrip("/")
        except Exception:
            oo = o
        if oo:
            normalized.append(oo)
    # De-duplicate while preserving order
    seen = set()
    unique: list[str] = []
    for o in normalized:
        if o not in seen:
            unique.append(o)
            seen.add(o)

    logger.info(f"Allowed origins: {unique}")

    return unique


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Verify DB connectivity on startup; dispose engine on shutdown
    async with async_engine.connect() as conn:
        await conn.execute(text("SELECT 1"))
    # Ensure database schema and seeds are initialized (idempotent)
    await create_all()
    await seed_feature_presets()
    try:
        yield
    finally:
        await async_engine.dispose()


app = FastAPI(title="Open AI Hay API", lifespan=lifespan)

logfire.configure(
    token=settings.logfire_token,
    scrubbing=False,
    environment=settings.env,
    send_to_logfire="if-token-present",
)
logfire.instrument_fastapi(app)
logfire.instrument_pydantic_ai()

# Security and rate limiting middleware
# app.add_middleware(SecurityHeadersMiddleware)
# app.add_middleware(RequestSizeLimitMiddleware, max_size=10 * 1024 * 1024)
# app.add_middleware(APIRateLimitMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Public routes
# app.include_router(health_router)
app.include_router(auth_router)

# Protected routes
# app.include_router(chat_router)
# app.include_router(featured_router)
# app.include_router(research_router)
# app.include_router(translate_router)
# app.include_router(contact_router)


# Convenience for `uvicorn api.main:app --reload`
__all__ = ["app"]
