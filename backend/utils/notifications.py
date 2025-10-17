

# utils/notifications.py
from datetime import date
from models import db, AbonnementKapersky
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

ADMIN_EMAIL = "cesarboutoile@gmail.com"
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = "cesarboutoile@gmail.com"
SMTP_PASSWORD = 'ufnp rloc neqo accx'  # ton mot de passe app spécifique

def send_mail(abonnements, type_notification):
    if not abonnements:
        return

    sujet = f"Mis à jour {type_notification} des abonnements Kapersky"

    # --- Contenu HTML stylé ---
    html = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; }}
            h2 {{ color: #2E86C1; }}
            table {{
                border-collapse: collapse;
                width: 100%;
            }}
            th, td {{
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }}
            th {{
                background-color: #2E86C1;
                color: white;
            }}
            tr:nth-child(even) {{ background-color: #f2f2f2; }}
        </style>
    </head>
    <body>
        <h2>{sujet}</h2>
        <table>
            <tr>
                <th>Nom</th>
                <th>Direction</th>
                <th>Poste</th>
                <th>Date d'expiration</th>
                <th>Jours restants</th>
                <th>Constat</th>
            </tr>
    """

    for ab in abonnements:
        html += f"""
            <tr>
                <td>{ab['nom_prenoms']}</td>
                <td>{ab['direction']}</td>
                <td>{ab['poste']}</td>
                <td>{ab['date_expiration']}</td>
                <td>{ab['jours_restants']}</td>
                <td>{ab['constat']}</td>
            </tr>
        """

    html += """
        </table>
    </body>
    </html>
    """

    msg = MIMEMultipart()
    msg['From'] = SMTP_USER
    msg['To'] = ADMIN_EMAIL
    msg['Subject'] = sujet
    msg.attach(MIMEText(html, 'html'))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_USER, ADMIN_EMAIL, msg.as_string())
        server.quit()
        print(f"✅ Mail {type_notification} envoyé à {ADMIN_EMAIL}")
    except Exception as e:
        print(f"❌ Erreur lors de l'envoi du mail {type_notification}: {e}")


def send_notifications():
    today = date.today()
    abonnements = AbonnementKapersky.query.all()

    notifications_hebdo = []
    notifications_journalier = []
    notifications_expired = []

    for ab in abonnements:
        if not ab.date_expiration:
            continue

        jours_restants = (ab.date_expiration - today).days

        # --- Mise à jour automatique ---
        ab.etat_abonnement = "Inactif" if jours_restants < 0 else "Actif"
        if jours_restants < 0:
            ab.constat = "Besoin d'abonnement"
            notifications_expired.append({
                "nom_prenoms": ab.nom_prenoms,
                "direction": ab.direction,
                "poste": ab.poste,
                "date_expiration": ab.date_expiration.strftime("%Y-%m-%d"),
                "jours_restants": jours_restants,
                "constat": ab.constat
            })
        elif 10 <= jours_restants <= 30:
            ab.constat = "Bientot Expire"
            notifications_hebdo.append({
                "nom_prenoms": ab.nom_prenoms,
                "direction": ab.direction,
                "poste": ab.poste,
                "date_expiration": ab.date_expiration.strftime("%Y-%m-%d"),
                "jours_restants": jours_restants,
                "constat": ab.constat
            })
        if 0 <= jours_restants <= 7:
            notifications_journalier.append({
                "nom_prenoms": ab.nom_prenoms,
                "direction": ab.direction,
                "poste": ab.poste,
                "date_expiration": ab.date_expiration.strftime("%Y-%m-%d"),
                "jours_restants": jours_restants,
                "constat": ab.constat
            })

    db.session.commit()

    # --- Envoi mails ---
    send_mail(notifications_hebdo, "hebdomadaire")
    send_mail(notifications_journalier, "quotidienne")
    send_mail(notifications_expired, " des abonnements expirés parmi nos")
