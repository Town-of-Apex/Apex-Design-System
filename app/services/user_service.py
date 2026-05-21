"""
app/services/user_service.py

Business logic service for Users.
Handles database operations, hashing, and duplicate checks.
"""
from typing import Optional, List
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import hash_password
from .base_service import BaseService


class UserService(BaseService[User, UserCreate, UserUpdate]):
    def get_by_username(self, db: Session, username: str) -> Optional[User]:
        """Fetch a user by their username."""
        return db.query(self.model).filter(self.model.username == username).first()

    def get_by_email(self, db: Session, email: str) -> Optional[User]:
        """Fetch a user by their email address."""
        return db.query(self.model).filter(self.model.email == email).first()

    def create_user(self, db: Session, data: UserCreate) -> User:
        """Create a user with hashed password and email/username validations."""
        if self.get_by_username(db, data.username):
            raise ValueError(f"Username '{data.username}' is already registered.")
        if data.email and self.get_by_email(db, data.email):
            raise ValueError(f"Email '{data.email}' is already registered.")

        # Hash the password
        hashed_pw = hash_password(data.password)
        
        # Prepare object parameters
        user_data = data.model_dump(exclude={"password"})
        user_data["hashed_password"] = hashed_pw
        
        # Create and persist
        db_obj = self.model(**user_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update_user(self, db: Session, user_id: int, data: UserUpdate) -> Optional[User]:
        """Update user fields, hashing password if updated."""
        user = self.get(db, user_id)
        if not user:
            return None

        update_data = data.model_dump(exclude_unset=True)
        
        # Check email uniqueness if email is being updated
        if "email" in update_data and update_data["email"] != user.email:
            existing = self.get_by_email(db, update_data["email"])
            if existing:
                raise ValueError(f"Email '{update_data['email']}' is already in use.")

        # Hash password if updated
        if "password" in update_data:
            plain_password = update_data.pop("password")
            if plain_password:
                update_data["hashed_password"] = hash_password(plain_password)

        # Apply updates
        for field, value in update_data.items():
            if hasattr(user, field):
                setattr(user, field, value)

        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def list_users(self, db: Session, skip: int = 0, limit: int = 100) -> List[User]:
        """List all users."""
        return self.list(db, skip=skip, limit=limit)


# Singleton service instance
user_service = UserService(User)
