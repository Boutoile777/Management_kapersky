# routes/auth_routes.py
from flask import Blueprint, request, jsonify
from models import db, Admin
from utils.security import verify_pin, hash_pin
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from datetime import datetime, timedelta
import jwt
import logging
from config import Config

# Configuration du logging
logging.basicConfig(level=logging.INFO)

auth_bp = Blueprint("auth", __name__)

# ----------------------------
# LOGIN (JWT)
# ----------------------------
@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        pin = data.get("pin")

        if not email or not pin:
            return jsonify({"error": "Email et PIN requis"}), 400

        admin = Admin.query.filter_by(email=email).first()
        if not admin or not verify_pin(pin, admin.pin_hash):
            return jsonify({"error": "Identifiants invalides"}), 401

        # Génération du token JWT
        payload = {
            "admin_id": admin.id,
            "exp": datetime.utcnow() + timedelta(hours=8)
        }
        token = jwt.encode(payload, Config.SECRET_KEY, algorithm="HS256")

        logging.info(f"Login successful for admin_id {admin.id}")

        # Retourne token + email
        return jsonify({
            "token": token,
            "email": admin.email  # <-- ajout de l'email
        }), 200

    except Exception as e:
        logging.error(f"Login exception: {str(e)}")
        return jsonify({"error": "Erreur serveur"}), 500


# ----------------------------
# LOGOUT
# ----------------------------
# routes/auth_routes.py
@auth_bp.route("/logout", methods=["POST"])
def logout():
    # Côté JWT, rien à faire côté serveur
    return jsonify({"message": "Déconnexion réussie"}), 200



# ----------------------------
# CREATE ADMIN (JWT)
# ----------------------------
@auth_bp.route("/create_admin", methods=["POST"])
def create_admin():
    try:
        data = request.get_json()
        email = data.get("email")
        pin = data.get("pin")

        if not email or not pin:
            return jsonify({"error": "Email et PIN requis"}), 400

        if Admin.query.filter_by(email=email).first():
            return jsonify({"error": "Admin déjà existant"}), 400

        pin_hash = hash_pin(pin)
        admin = Admin(email=email, pin_hash=pin_hash)
        db.session.add(admin)
        db.session.commit()
        logging.info(f"Admin créé: id {admin.id}, email {email}")

        # Créer un token JWT pour le nouvel admin
        token = create_access_token(identity=admin.id, expires_delta=timedelta(hours=8))
        return jsonify({"message": "Admin créé avec succès", "admin_id": admin.id, "token": token}), 201

    except Exception as e:
        db.session.rollback()
        logging.error(f"Create admin exception: {str(e)}")
        return jsonify({"error": "Erreur serveur"}), 500


# ----------------------------
# UPDATE ADMIN (JWT)
# ----------------------------
@auth_bp.route("/update_admin", methods=["PUT"])
@jwt_required()
def update_admin():
    try:
        admin_id = get_jwt_identity()
        admin = Admin.query.get(admin_id)
        logging.info(f"Update admin request for admin_id {admin_id}")

        if not admin:
            return jsonify({"error": "Admin introuvable"}), 404

        data = request.get_json() or {}
        new_email = data.get("email")
        old_pin = data.get("old_pin")
        new_pin = data.get("new_pin")

        if new_email:
            admin.email = new_email
            logging.info(f"Email updated to {new_email} for admin_id {admin_id}")

        if new_pin:
            if not old_pin or not verify_pin(old_pin, admin.pin_hash):
                return jsonify({"error": "Ancien PIN incorrect ou manquant"}), 401
            admin.pin_hash = hash_pin(new_pin)
            logging.info(f"PIN updated for admin_id {admin_id}")

        db.session.commit()
        return jsonify({"message": "Identifiants mis à jour avec succès"}), 200

    except Exception as e:
        db.session.rollback()
        logging.error(f"Update admin exception: {str(e)}")
        return jsonify({"error": "Erreur serveur"}), 500
