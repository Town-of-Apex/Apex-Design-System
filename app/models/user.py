"""
app/models/user.py

SQLAlchemy ORM model for the users table.
This model is placed here as a template for user management.
In a multi-app production architecture, this table (or service) might be separated
into a central identity system (like Keycloak or a shared auth database schema).
"""
from sqlalchemy import Column, String, Boolean
from app.core.database import Base


class User(Base):
    """
    Standard User model.
    Automatically maps to 'users' table.
    Inherits 'id', 'created_at', and 'updated_at' audit fields from Base.
    """
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), nullable=True)
    full_name = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    
    # Roles: e.g. "Administrator", "Employee", "Citizen"
    role = Column(String(50), nullable=False, default="Employee")
    department = Column(String(100), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
