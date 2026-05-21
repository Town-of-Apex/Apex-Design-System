"""
app/core/config.py

Central configuration for the application.
All environment variables are read here and nowhere else.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # App Routing
    BASE_PATH: str = ""
    
    # Database
    # Primary: PostgreSQL. Fallback: SQLite
    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/apex_db"
    FALLBACK_DATABASE_URL: str = "sqlite:///./data/app.db"
    ALLOW_SQLITE_FALLBACK: bool = True
    
    # Server
    PORT: int = 8080
    
    # Load from .env file if it exists
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

# Global settings instance
settings = Settings()

# Export common variables for backward compatibility if needed
BASE_PATH = settings.BASE_PATH.rstrip("/")
DATABASE_URL = settings.DATABASE_URL
PORT = settings.PORT
ALLOW_SQLITE_FALLBACK = settings.ALLOW_SQLITE_FALLBACK
FALLBACK_DATABASE_URL = settings.FALLBACK_DATABASE_URL
