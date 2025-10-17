# routes/abonnement_routes.py
from flask import Blueprint, request, jsonify
from models import db, AbonnementKapersky
from datetime import date, datetime, timedelta
abonnement_bp = Blueprint("abonnement", __name__)

# Lister tous les abonnements
@abonnement_bp.route("/", methods=["GET"])
def list_abonnements():
    abonnements = AbonnementKapersky.query.all()
    return jsonify([a.to_dict() for a in abonnements])

# Ajouter un abonnement
@abonnement_bp.route("/", methods=["POST"])
def add_abonnement():
    data = request.json
    try:
        # Convertir la date string en objet date
        date_expiration = datetime.strptime(data["date_expiration"], "%Y-%m-%d").date()

        abonnement = AbonnementKapersky(
            direction=data["direction"],
            poste=data["poste"],
            nom_prenoms=data["nom_prenoms"],
            date_expiration=date_expiration,
            code_abonnement=data["code_abonnement"]
        )

        # Initialisation automatique de etat_abonnement et constat
        today = date.today()
        jours_restants = (date_expiration - today).days
        abonnement.etat_abonnement = "Inactif" if jours_restants < 0 else "Actif"

        if jours_restants < 0:
            abonnement.constat = "Besoin d'abonnement"
        elif jours_restants <= 30:
            abonnement.constat = "Bientot Expire"
        else:
            abonnement.constat = "RAS"


        db.session.add(abonnement)
        db.session.commit()
        return jsonify({"message": "Abonnement ajouté avec succès ✅"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
    

# Supprimer un abonnement par id
@abonnement_bp.route("/<int:id>", methods=["DELETE"])
def delete_abonnement(id):
    abonnement = AbonnementKapersky.query.get(id)
    if not abonnement:
        return jsonify({"error": "Abonnement introuvable"}), 404
    db.session.delete(abonnement)
    db.session.commit()
    return jsonify({"message": "Abonnement supprimé"})




@abonnement_bp.route("/<int:id>", methods=["PUT"])
def update_abonnement(id):
    abonnement = AbonnementKapersky.query.get(id)
    if not abonnement:
        return jsonify({"error": "Abonnement introuvable"}), 404

    data = request.json
    try:
        # --- Mettre à jour les champs simples ---
        if "direction" in data:
            abonnement.direction = data["direction"]
        if "poste" in data:
            abonnement.poste = data["poste"]
        if "nom_prenoms" in data:
            abonnement.nom_prenoms = data["nom_prenoms"]
        if "code_abonnement" in data:
            abonnement.code_abonnement = data["code_abonnement"]

        # --- Si la date d’expiration change, recalculer automatiquement ---
        if "date_expiration" in data:
            new_date = datetime.strptime(data["date_expiration"], "%Y-%m-%d").date()
            abonnement.date_expiration = new_date

            today = date.today()
            jours_restants = (new_date - today).days

            # Mettre à jour automatiquement etat_abonnement et constat
            abonnement.etat_abonnement = "Actif" if jours_restants >= 0 else "Inactif"

            if jours_restants < 0:
                abonnement.constat = "Besoin d'abonnement"
            elif jours_restants <= 30:
                abonnement.constat = "Bientot Expire"
            else:
                abonnement.constat = "RAS"

        db.session.commit()
        return jsonify({"message": "Abonnement modifié et mis à jour automatiquement ✅"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400



# routes/abonnement_routes.py de gestion journalière et hebdomadaire des abonnements

@abonnement_bp.route("/check_expirations", methods=["GET"])
def check_expirations():
    try:
        today = date.today()
        abonnements = AbonnementKapersky.query.all()

        notifications_hebdo = []
        notifications_journalier = []

        for ab in abonnements:
            if not ab.date_expiration:
                continue

            jours_restants = (ab.date_expiration - today).days

            # --- 1️⃣ Mise à jour automatique de etat_abonnement ---
            if jours_restants < 0:
                ab.etat_abonnement = "Inactif"
            else:
                ab.etat_abonnement = "Actif"

            # --- 2️⃣ Mise à jour automatique de constat ---
            if jours_restants < 0:
                ab.constat = "Besoin d'abonnement"
            elif jours_restants <= 30:
                ab.constat = "Bientot Expire"  # ✅ sans accent
            elif jours_restants > 90:
                ab.constat = "RAS"
            else:
                ab.constat = "RAS"

            # --- 3️⃣ Préparation des notifications ---
            info = {
                "nom_prenoms": ab.nom_prenoms,
                "direction": ab.direction,
                "poste": ab.poste,
                "date_expiration": ab.date_expiration.strftime("%Y-%m-%d"),
                "jours_restants": jours_restants,
                "etat_abonnement": ab.etat_abonnement,
                "constat": ab.constat,
            }

            if 10 <= jours_restants <= 30:
                notifications_hebdo.append(info)
            if 0 <= jours_restants <= 7:
                notifications_journalier.append(info)

        db.session.commit()

        return jsonify({
            "message": "Vérification effectuée avec succès ✅",
            "total_abonnements": len(abonnements),
            "notifications_hebdomadaires": notifications_hebdo,
            "notifications_journalières": notifications_journalier
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500



@abonnement_bp.route("/dashboard_stats", methods=["GET"])
def dashboard_stats():
    try:
        today = date.today()
        abonnements = AbonnementKapersky.query.all()

        actifs = 0
        bientot_expire = 0
        expires = 0

        graph_data = {"Actif": 0, "Bientôt Expire": 0, "Expiré": 0}

        for ab in abonnements:
            if not ab.date_expiration:
                continue

            jours_restants = (ab.date_expiration - today).days

            if jours_restants < 0:
                expires += 1
                graph_data["Expiré"] += 1
            else:
                actifs += 1   # ✅ tout ce qui n’est pas expiré est actif
                graph_data["Actif"] += 1

                if jours_restants <= 30:
                    bientot_expire += 1
                    graph_data["Bientôt Expire"] += 1

        return jsonify({
            "actifs": actifs,
            "bientot_expire": bientot_expire,
            "expirés": expires,
            "graph_data": graph_data
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

