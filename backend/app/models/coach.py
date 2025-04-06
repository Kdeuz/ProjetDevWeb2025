from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from app import db

class Coach(db.Model):
    __tablename__ = 'coachs'
    
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    prenom = db.Column(db.String(100), nullable=False)
    specialite = db.Column(db.String(100))
    
    def __init__(self, nom, prenom, specialite):
        self.nom = nom
        self.prenom = prenom
        self.specialite = specialite
            
    def to_dict(self):
        return {
            'id': self.id,
            'nom': self.nom,
            'prenom': self.prenom,
            'specialite': self.specialite
        }


