from .. import db
from datetime import time

class Bassin(db.Model):
    __tablename__ = 'bassins'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200))
    longueur = db.Column(db.Float)  # en mètres
    profondeur = db.Column(db.Float)  # en mètres

class CoursPiscine(db.Model):
    __tablename__ = 'cours_piscine'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(300))
    jour = db.Column(db.String(10))  # Lundi, Mardi...
    heure = db.Column(db.Time)
    niveau = db.Column(db.String(50))  # Débutant, Intermédiaire...
    bassin = db.Column(db.String(50))  # Champ direct plutôt que relation

class PiscineStatus(db.Model):
    __tablename__ = 'piscine_status'
    id = db.Column(db.Integer, primary_key=True)
    bassin1 = db.Column(db.Integer)
    bassin2 = db.Column(db.Integer)
    bassin3 = db.Column(db.Integer)

class PagePiscine:
    """Classe qui agrège toutes les données pour la page piscine"""
    
    def __init__(self):
        self._load_data()

    def _load_data(self):
        """Charge toutes les données nécessaires"""
        self.cours = self._get_cours()
        self.status = PiscineStatus.query.first()

    def _get_cours(self):
        """Récupère les cours sans jointure"""
        return CoursPiscine.query.order_by(CoursPiscine.jour, CoursPiscine.heure).all()

    def to_dict(self):
        """Convertit les données au format attendu par le frontend"""
        return {
            'nombreBassins': 3,  # Valeur fixe ou pourrait venir d'une autre table
            'cours': [{
                'nom': c.nom,
                'description': c.description,
                'bassin': c.bassin  # Accès direct au champ
            } for c in self.cours],
            'nombreParBassin': self.status.personnes_par_bassin if self.status else 0,
            'stats': {
                'total_cours': len(self.cours)
            }
        }