from datetime import time
from flask_sqlalchemy import SQLAlchemy
from app import db
from flask import jsonify


# Table d'association pour la relation many-to-many entre Cours et Coach
cours_coach = db.Table('cours_coach',
    db.Column('cours_id', db.Integer, db.ForeignKey('cours.id'), primary_key=True),
    db.Column('coach_id', db.Integer, db.ForeignKey('coachs.id'), primary_key=True)
)

# Table d'association pour la relation many-to-many entre Cours et Ligne
cours_ligne = db.Table('cours_ligne',
    db.Column('cours_id', db.Integer, db.ForeignKey('cours.id'), primary_key=True),
    db.Column('ligne_id', db.Integer, db.ForeignKey('lignes.id'), primary_key=True)
)

cours_user = db.Table('cours_user',
    db.Column('cours_id', db.Integer, db.ForeignKey('cours.id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True)
)

class Cours(db.Model):
    """
    Classe représentant un cours dans le complexe sportif.
    Peut être lié à des lignes (piscine) ou à une salle de fitness.
    """
    __tablename__ = 'cours'
    
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    heure_debut = db.Column(db.Time, nullable=False)
    heure_fin = db.Column(db.Time, nullable=False)
    description = db.Column(db.Text)
    capacite_max = db.Column(db.Integer)
    salle_fitness_id = db.Column(db.Integer, db.ForeignKey('salles_fitness.id'))
    
    # Relations
    coachs = db.relationship('Coach', secondary=cours_coach, backref='cours', lazy=True)
    lignes = db.relationship('Ligne', secondary=cours_ligne, backref='cours', lazy=True)
    user = db.relationship('User', secondary=cours_user, backref='cours', lazy=True)

    def __init__(self, nom, date, heure_debut, heure_fin, description, capacite_max):
        self.nom = nom
        self.date = date
        self.heure_debut = heure_debut
        self.heure_fin = heure_fin
        self.description = description
        self.capacite_max = capacite_max
        for key, value in kwargs.items():
            setattr(self, key, value)
    
    def ajouter_coach(self, coach):
        """Ajoute un coach à ce cours"""
        if coach not in self.coachs:
            self.coachs.append(coach)
    
    def ajouter_ligne(self, ligne):
        """Ajoute une ligne (piscine) à ce cours"""
        if ligne not in self.lignes:
            self.lignes.append(ligne)
    
    def ajout_salle_fitness(self, salle):
        """Définit la salle de fitness pour ce cours"""
        if self.salle_fitness is None:
            self.salle_fitness_id = salle.id
            return jsonify({'message','ajout salle fitness validé'}), 201
        else:
            return jsonify({'error','Ajout impossible'}), 400
            
    def ajout_user(self, user):
        """" Ajoute un user au cours"""
        if (user not in self.user) and (len(self.user) < self.capacite_max) :
            self.user.append(user)
            return jsonify({'message':'ajout user validé'}), 201
        return jsonify({'error':'Ajout impossible'}), 400
    
    def to_dict(self):
        """Sérialisation en dictionnaire pour JSON"""
        return {
            'id': self.id,
            'nom': self.nom,
            'date': self.date.isoformat() if self.date else None,
            'heure_debut': self.heure_debut.strftime('%H:%M') if self.heure_debut else None,
            'heure_fin': self.heure_fin.strftime('%H:%M') if self.heure_fin else None,
            'type_cours': self.type_cours,
            'description': self.description,
            'capacite_max': self.capacite_max,
            'coachs': [coach.to_dict() for coach in self.coachs],
            'lignes': [ligne.to_dict() for ligne in self.lignes],
            'salle_fitness_id': self.salle_fitness_id
        }


