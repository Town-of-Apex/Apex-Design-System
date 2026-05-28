"""
app/core/config.py

Central configuration for the application.
All environment variables are read here and nowhere else.
"""
from typing import Optional

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # App Routing
    BASE_PATH: str = ""

    # -------------------------------------------------------------------------
    # Database — set POSTGRES_* per app; DATABASE_URL overrides if provided
    # -------------------------------------------------------------------------
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "demo"
    POSTGRES_USER: str = "demo"
    POSTGRES_PASSWORD: str = "password"

    # Optional full connection string override (e.g. sqlite:///./data/app.db)
    DATABASE_URL: Optional[str] = None

    FALLBACK_DATABASE_URL: str = "sqlite:///./data/app.db"
    ALLOW_SQLITE_FALLBACK: bool = True

    # Dev vs production behavior
    DEV_MODE: bool = False
    AUTO_CREATE_TABLES: Optional[bool] = None
    RUN_MIGRATIONS: Optional[bool] = None
    AUTO_MIGRATE_DEV: Optional[bool] = None

    # Authentication (dev-mode JWT; replace with Entra in production)
    AUTH_ENABLED: bool = True
    JWT_SECRET_KEY: str = "change-me-in-production-use-openssl-rand-hex-32"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 480
    SEED_DEV_ADMIN: bool = True
    DEV_ADMIN_USERNAME: str = "admin"
    DEV_ADMIN_PASSWORD: str = "admin123"

    # Server
    PORT: int = 8080

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @model_validator(mode="after")
    def resolve_derived_settings(self) -> "Settings":
        if not self.DATABASE_URL:
            self.DATABASE_URL = (
                f"postgresql+psycopg2://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
                f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
            )
        elif self.DATABASE_URL.startswith("postgresql://"):
            self.DATABASE_URL = self.DATABASE_URL.replace(
                "postgresql://", "postgresql+psycopg2://", 1
            )

        if self.AUTO_CREATE_TABLES is None:
            self.AUTO_CREATE_TABLES = False

        if self.RUN_MIGRATIONS is None:
            self.RUN_MIGRATIONS = True

        if self.AUTO_MIGRATE_DEV is None:
            self.AUTO_MIGRATE_DEV = self.DEV_MODE

        return self


# Global settings instance
settings = Settings()

# Export common variables for backward compatibility if needed
BASE_PATH = settings.BASE_PATH.rstrip("/")
DATABASE_URL = settings.DATABASE_URL
PORT = settings.PORT
ALLOW_SQLITE_FALLBACK = settings.ALLOW_SQLITE_FALLBACK
FALLBACK_DATABASE_URL = settings.FALLBACK_DATABASE_URL
AUTO_CREATE_TABLES = settings.AUTO_CREATE_TABLES
DEV_MODE = settings.DEV_MODE
RUN_MIGRATIONS = settings.RUN_MIGRATIONS
AUTO_MIGRATE_DEV = settings.AUTO_MIGRATE_DEV
AUTH_ENABLED = settings.AUTH_ENABLED
