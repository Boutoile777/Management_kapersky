from werkzeug.security import generate_password_hash, check_password_hash

def hash_pin(pin: str) -> str:
    """Hash un PIN avec pbkdf2:sha256"""
    return generate_password_hash(pin, method="pbkdf2:sha256")

def verify_pin(pin: str, pin_hash: str) -> bool:
    """Vérifie le PIN par rapport au hash"""
    return check_password_hash(pin_hash, pin)
# utils/security.py