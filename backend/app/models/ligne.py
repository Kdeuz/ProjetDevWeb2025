from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from app import db

db = SQLAlchemy()
bcrypt = Bcrypt()

class Ligne(db.Model):
    """
    Classe représentant une ligne de nage dans un bassin.
    """
    __tablename__ = 'ligne'
    
    id = db.Column(db.Integer, primary_key=True)
    numero = db.Column(db.Integer, nullable=False)
    longueur = db.Column(db.Float, nullable=False)  # en mètres
    bassin_id = db.Column(db.Integer, db.ForeignKey('bassins.id'), nullable=False)
    
    def __init__(self, numero, longueur, bassin_id):
        self.numero = numero
        self.longueur = longueur
        self.bassin_id = bassin_id
    
    def to_dict(self):
        """Convertit l'objet en dictionnaire pour JSON"""
        return {
            'id': self.id,
            'numero': self.numero,
            'longueur': self.longueur,
            'bassin_id': self.bassin_id
        }