from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models import db
from routes.auth_routes import auth_bp
from routes.abonnement_routes import abonnement_bp
from sqlalchemy import text
from flask_jwt_extended import JWTManager  # ✅ Import du gestionnaire JWT
from apscheduler.schedulers.background import BackgroundScheduler

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # ✅ Activation CORS
    CORS(app)

    # ✅ Initialisation de la base de données
    db.init_app(app)

    # ✅ Initialisation JWT
    JWTManager(app)

    # ✅ Route de test
    @app.route("/ping")
    def ping():
        try:
            result = db.session.execute(text("SELECT 1")).scalar()
            return jsonify({"message": "Flask OK, PostgreSQL OK", "result": result})
        except Exception as e:
            return jsonify({"message": "Erreur base de données", "error": str(e)}), 500

    # ✅ Enregistrement des Blueprints
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(abonnement_bp, url_prefix="/abonnements")

    # ✅ Message au lancement
    print("🚀 Application Flask lancée avec succès !")
    print("🔑 JWT actif | 📦 Base PostgreSQL connectée")

    return app

# --- Création de l'app ---
app = create_app()

# --- Scheduler ---
scheduler = BackgroundScheduler()

def scheduled_job():
    from utils.notifications import send_notifications
    with app.app_context():  # ✅ Crée un contexte Flask pour accéder à la DB
        send_notifications()

# Exécution tous les jours à 9h
scheduler.add_job(scheduled_job, 'cron', hour=10, minute=29)
scheduler.start()
print("⏰ Scheduler démarré, envoi des notifications programmé à 9h chaque jour.")

# --- Lancement du serveur Flask ---
if __name__ == "__main__":
    app.run(debug=Config.DEBUG)
