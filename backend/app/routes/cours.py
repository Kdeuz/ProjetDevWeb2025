from app import db
from flask import Blueprint, request, jsonify
from flask_login import login_user, login_required, logout_user, current_user

cours_bp = Blueprint('cours', __name__)

@cours_bp.route('/add_cours', methods=['POST'])
@login_required
def add_cours():
    if not current_user.is_admin:
        return jsonify({'error': 'Accès refusé : administrateur uniquement'}), 403

    data = request.json

    nom = data.get("Nom")
    date = data.get("Date")
    heure_debut = data.get("Heure de début")
    heure_fin = data.get("Heure de fin")
    description = data.get("Description")
    capacite_max = data.get("Capacité max")

    if not nom or not date or not heure_debut or not heure_fin or not capacite_max or not type_cours :
        return jsonify({'error': 'Nom et description requis'}), 400
    
    return jsonify({'message' : 'Cours créé avec succès', 'cours' : {'id' : cours.id}})

@cours_bp.route('/add_cours', methods=['POST'])
@login_required
def add_ligne():
    if not current_user.is_admin:
        return jsonify({'error': 'Accès refusé : administrateur uniquement'}), 403

    data = request.json
    exit = False
    while not exit:
        ligne = data.get("Donne une ligne que tu veux ajouter au cours (écris FIN pour terminer)")
        if ligne == "FIN":
            exit = True
        else:
            self.ajouter_ligne(ligne)
        
    

    
