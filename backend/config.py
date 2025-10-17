import os
import configparser
import urllib.parse
from sqlalchemy import create_engine, text

# === Chargement du fichier .ini ===
INI_PATH = os.path.join(os.path.dirname(__file__), "config.ini")
config = configparser.ConfigParser()

read_files = config.read(INI_PATH, encoding="utf-8")
if not read_files:
    print(f"❌ Impossible de lire le fichier {INI_PATH}. Vérifie qu'il existe et qu'il est en UTF-8.")
    # On continue avec des valeurs par défaut pour éviter une exception immédiate


class Config:
    """Configuration principale de l'application Flask"""

    # === Section Flask ===
    SECRET_KEY = config.get("flask", "secret_key", fallback="default_secret_key")
    DEBUG = config.getboolean("flask", "debug", fallback=False)

    # === Section Database ===
    DB_HOST = config.get("database", "host", fallback="localhost")
    DB_PORT = config.get("database", "port", fallback="5432")
    DB_USER = config.get("database", "user", fallback="postgres")

    # Encodage du mot de passe PostgreSQL (pour éviter les erreurs avec @, :, /, etc.)
    DB_PASS_RAW = config.get("database", "password", fallback="postgres")
    DB_PASS = urllib.parse.quote_plus(DB_PASS_RAW)
    DB_NAME = config.get("database", "dbname", fallback="postgres")

    SQLALCHEMY_DATABASE_URI = (
        f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # === Section JWT ===
    JWT_SECRET_KEY = config.get("jwt", "secret_key", fallback=SECRET_KEY)
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"


# === Fonctions utilitaires ===

def _masked_uri():
    """Retourne une URI masquée pour l'affichage (sans mot de passe en clair)."""
    return f"postgresql://{Config.DB_USER}:***@{Config.DB_HOST}:{Config.DB_PORT}/{Config.DB_NAME}"


def test_connection():
    """Teste la connexion à la base PostgreSQL"""
    try:
        engine = create_engine(Config.SQLALCHEMY_DATABASE_URI, pool_pre_ping=True)
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("✅ Connexion PostgreSQL réussie !")
        print("URI (masquée) :", _masked_uri())
    except Exception as e:
        print("❌ Erreur de connexion PostgreSQL :", e)
        print("→ Vérifie : config.ini (chemin, encodage UTF-8), identifiants, port, et que le serveur PostgreSQL est démarré.")
        print("→ Si ton mot de passe contient des caractères spéciaux (ex: @, /, :), ils sont automatiquement encodés.")


# === Test direct ===
if __name__ == "__main__":
    test_connection()
