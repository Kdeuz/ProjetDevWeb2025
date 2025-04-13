from flask_sqlalchemy import SQLAlchemy
from datetime import time
from app import db
from datetime import datetime
from .. import db, bcrypt
from flask_login import UserMixin

class Coach(db.Model):
    __tablename__ = 'coachs'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(80), nullable=False)
    prenom = db.Column(db.String(80))
    description = db.Column(db.String(100))


class CoursFitness(db.Model):
    __tablename__ = 'cours_fitness'
    id = db.Column(db.Integer, primary_key=True)
    jour = db.Column(db.String(10))  # Ex: 'Lundi', 'Mardi'
    heure = db.Column(db.Time)       # Ex: '18:00:00'
    activite = db.Column(db.String(50))  # Ex: 'Yoga', 'Boxe'
    
    

class FitnessStatus(db.Model):
    __tablename__ = 'fitness_status'
    personnes = db.Column(db.Integer, default=0)
    id = db.Column(db.Integer, primary_key=True)

class PageFitness:
    """Agrège les données pour la page web"""
    
    def __init__(self):
        self.coachs = self._get_coachs()
        self.cours = self._get_cours()
        self.stats = self._get_stats()
        self.personnes = self._get_personnes()

    def _get_personnes(self):
        fitness_status = FitnessStatus.query.first() 
        return fitness_status.personnes if fitness_status else 0
    
    def _get_coachs(self):
        return Coach.query.all()  # Retourne la liste des coachs
    
    def _get_cours(self):
        # Simply fetch courses without loading coach info
        cours = CoursFitness.query.all()  # No joinedload here, courses don't have a coach relationship
        return [{
            'id': c.id,
            'jour': c.jour,
            'heure': c.heure.strftime("%H:%M"),
            'activite': c.activite,
        } for c in cours]
    
    def _get_stats(self):
        return {
            'total_cours': CoursFitness.query.count(),
            'total_coachs': Coach.query.count()
        }

    def to_dict(self):
        """Formatage pour le frontend"""
        return {
            'coachs': [{
                'id': c.id,
                'nom_complet': f"{c.prenom} {c.nom}",
                'description': c.description
            } for c in self.coachs],
            'cours': self.cours,
            'stats': self.stats
        }
