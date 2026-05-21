"""
app/core/security.py

Password hashing and verification utilities.
Uses only Python standard libraries (hashlib, secrets).
"""
import hashlib
import secrets

def hash_password(password: str) -> str:
    """
    Hash a password using PBKDF2 HMAC SHA256.
    Format: pbkdf2_sha256$iterations$salt$hash
    """
    salt = secrets.token_hex(16)
    iterations = 100000
    
    key = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        iterations
    )
    
    return f"pbkdf2_sha256${iterations}${salt}${key.hex()}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against its hashed version.
    """
    if not hashed_password:
        return False
        
    try:
        parts = hashed_password.split("$")
        if len(parts) != 4 or parts[0] != "pbkdf2_sha256":
            return False
            
        iterations = int(parts[1])
        salt = parts[2]
        stored_hash = parts[3]
        
        new_key = hashlib.pbkdf2_hmac(
            "sha256",
            plain_password.encode("utf-8"),
            salt.encode("utf-8"),
            iterations
        )
        
        return secrets.compare_digest(new_key.hex(), stored_hash)
    except Exception:
        return False
