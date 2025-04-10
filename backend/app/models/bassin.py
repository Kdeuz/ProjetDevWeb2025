from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from app import db


class Bassin(db.Model):
    """
    Classe représentant un bassin dans le complexe sportif.
    Un bassin contient plusieurs lignes de nage.
    """
    __tablename__ = 'bassin'
    
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False, unique=True)
    
    # Relation one-to-many avec les lignes
    lignes = db.relationship('Ligne', backref='bassin', lazy=True, cascade='all, delete-orphan')
    
    def __init__(self, nom):
        self.nom = nom
    
    def ajouter_ligne(self, numero, longueur):
        """Méthode pour ajouter une ligne à ce bassin"""
        nouvelle_ligne = Ligne(
            numero=numero,
            longueur=longueur,
            bassin_id=self.id
        )
        db.session.add(nouvelle_ligne)
        return nouvelle_ligne
    
    def nombre_lignes(self):
        """Retourne le nombre de lignes dans ce bassin"""
        return len(self.lignes)
    
    def to_dict(self):
        """Convertit l'objet en dictionnaire pour JSON"""
        return {
            'id': self.id,
            'nom': self.nom,
            'nombre_lignes': self.nombre_lignes(),
            'lignes': [ligne.to_dict() for ligne in self.lignes]
        }