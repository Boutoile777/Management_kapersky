# models.py
from flask_sqlalchemy import SQLAlchemy
from datetime import date

db = SQLAlchemy()

class Admin(db.Model):
    __tablename__ = "admin"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    pin_hash = db.Column(db.Text, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email
            # On ne renvoie pas pin_hash pour la sécurité
        }

class AbonnementKapersky(db.Model):
    __tablename__ = "abonnement_kapersky"

    id = db.Column(db.Integer, primary_key=True)
    direction = db.Column(db.String(100), nullable=False)
    poste = db.Column(db.String(100), nullable=False)
    nom_prenoms = db.Column(db.String(150), nullable=False)
    etat_abonnement = db.Column(db.String(10), nullable=False)  # 'Actif' ou 'Inactif'
    date_expiration = db.Column(db.Date, nullable=False)
    constat = db.Column(db.String(30), nullable=False)  # 'RAS', 'Bientôt Expiré', 'Besoin d\'abonnement'
    code_abonnement = db.Column(db.String(50), unique=True, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "direction": self.direction,
            "poste": self.poste,
            "nom_prenoms": self.nom_prenoms,
            "etat_abonnement": self.etat_abonnement,
            "date_expiration": self.date_expiration.strftime("%Y-%m-%d") if isinstance(self.date_expiration, date) else self.date_expiration,
            "constat": self.constat,
            "code_abonnement": self.code_abonnement
        }
