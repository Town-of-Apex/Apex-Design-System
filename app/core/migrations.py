"""
app/core/migrations.py

Alembic migration runner integrated with app configuration.
In dev mode, detects schema drift and autogenerates a revision before upgrading.
"""
import logging
from pathlib import Path

from alembic import command
from alembic.autogenerate import compare_metadata
from alembic.config import Config
from alembic.migration import MigrationContext
from alembic.script import ScriptDirectory

from app.core.config import settings
from app.core.database import Base, engine, import_models

logger = logging.getLogger(__name__)

PROJECT_ROOT = Path(__file__).resolve().parents[2]


def get_alembic_config() -> Config:
    cfg = Config(str(PROJECT_ROOT / "alembic.ini"))
    cfg.set_main_option("script_location", str(PROJECT_ROOT / "migrations"))
    cfg.set_main_option("sqlalchemy.url", settings.DATABASE_URL)
    return cfg


def _schema_differs() -> bool:
    import_models()
    with engine.connect() as connection:
        context = MigrationContext.configure(connection)
        diff = compare_metadata(context, Base.metadata)
        return bool(diff)


def _has_revisions() -> bool:
    cfg = get_alembic_config()
    script = ScriptDirectory.from_config(cfg)
    return bool(script.get_revisions("head"))


def run_migrations() -> None:
    """Apply pending migrations, autogenerating in dev when the schema has drifted."""
    if not settings.RUN_MIGRATIONS:
        logger.info("RUN_MIGRATIONS=False — skipping Alembic")
        return

    import_models()
    cfg = get_alembic_config()

    # Apply existing revisions before autogenerate (empty DB looks like "drift").
    logger.info("Running alembic upgrade head")
    command.upgrade(cfg, "head")

    if settings.AUTO_MIGRATE_DEV and settings.DEV_MODE:
        if not _has_revisions():
            logger.info("No Alembic revisions found — creating initial autogenerate revision")
            command.revision(cfg, message="initial_schema", autogenerate=True)
            command.upgrade(cfg, "head")
        elif _schema_differs():
            logger.info("Schema drift detected — autogenerating dev migration revision")
            command.revision(cfg, message="auto_dev_sync", autogenerate=True)
            command.upgrade(cfg, "head")
