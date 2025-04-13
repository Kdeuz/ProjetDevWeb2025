from .. import db
from datetime import time

# --- MODELES ---
class Bassin(db.Model):
    __tablename__ = 'bassins'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200))
    longueur = db.Column(db.Float)  # en mètres
    profondeur = db.Column(db.Float)  # en mètres



class CoursPiscine(db.Model):
    __tablename__ = 'coursPiscine'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(300))
    heure = db.Column(db.Time)  # Heure du cours
    jour = db.Column(db.String(10))  # Ex: 'Lundi', 'Mardi'



class PiscineStatus(db.Model):
    __tablename__ = 'piscineStatus'
    id = db.Column(db.Integer, primary_key=True)
    bassin_id = db.Column(db.Integer, db.ForeignKey('bassins.id'), nullable=False)
    status = db.Column(db.Integer)  # Status for each bassin (can be 0, 1, etc.)

    bassin = db.relationship('Bassin', backref='status', lazy=True)


class PagePiscine:
    """Classe qui agrège toutes les données pour la page piscine"""

    def __init__(self):
        self._load_data()

    def _load_data(self):
        """Charge toutes les données nécessaires"""
        self.cours = self._get_cours()
        self.status = PiscineStatus.query.all()  # Get all statuses
        self.bassins = Bassin.query.all()  # Get all bassins

    def _get_cours(self):
        """Récupère les cours avec leurs bassins"""
        return CoursPiscine.query.order_by(CoursPiscine.jour, CoursPiscine.heure).all()

    def to_dict(self):
        """Convertit les données au format attendu par le frontend"""
        # Create a dictionary dynamically for the number of bassins
        bassin_status = {}
        for bassin in self.bassins:
            status = next((s for s in self.status if s.bassin_id == bassin.id), None)
            bassin_status[bassin.nom] = status.status if status else 0  # Default to 0 if no status

        return {
            'nombreBassins': len(self.bassins),  # Dynamically count the number of bassins
            'cours': [{
                'id': c.id,
                'nom': c.nom,
                'description': c.description,
                'heure': c.heure.strftime("%H:%M"),  # Format the time
                'jour': c.jour,
            } for c in self.cours],
            'nombreParBassin': bassin_status,  # Dynamic bassin status
            'stats': {
                'total_cours': len(self.cours)
            }
        }

