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
    
    new_cours = Cours(nom, date, heure_debut, heure_fin, description, capacite_max)
    db.session.add(new_cours)
    db.session.commit()
    return jsonify({'message' : 'Cours créé avec succès', 'cours' : {'id' : cours.id}}), 201

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
    db.session.commit()
    return jsonify({'message' : 'Ligne(s) ajoutée(s)'})

@cours_bp.route('/add_user', methods=['POST'])
@login_required
def add_user():
    if not current_user.is_admin:
        return jsonify({'error': 'Accès refusé : administrateur uniquement'}), 403
    
    data = request.json
    exit = False
    while not exit:

        user = data.get("User ou FIN pour terminer")
        if user == "FIN":
            exit = True
        else:
            cours.ajout_user(user)
    db.session.commit()
    return jsonify({'message':'ajout(s) terminé(s)'}), 201

@cours_bp.route('/remove_cours/<int:cours_id>', methods=['DELETE'])
@login_required
def remove_cours(cours_id):
    if not current_user.is_admin:
        return jsonify({'error': 'Accès refusé : administrateur uniquement'}), 403

    cours = Cours.query.get(cours_id)
    if not cours:
        return jsonify({'error': 'Cours non trouvé'}), 404

    try:
        # Suppression automatique des relations many-to-many grâce à SQLAlchemy
        db.session.delete(cours)
        db.session.commit()
        return jsonify({
            'message': 'Cours supprimé avec succès',
            'deleted_id': cours_id,
            'details': {
                'nom': cours.nom,
                'date': cours.date.isoformat()
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Erreur lors de la suppression',
            'details': str(e)
        }), 500

@cours_bp.route('/remove_user/<int:cours_id>/<int:user_id>', methods=['DELETE'])
@login_required
def remove_user(cours_id, user_id):
    cours = Cours.query.get(cours_id)
    if not cours:
        return jsonify({'error': 'Cours non trouvé'}), 404

    # Vérification si l'utilisateur est admin OU le user concerné
    if not (current_user.is_admin or current_user.id == user_id):
        return jsonify({'error': 'Permission refusée'}), 403

    user = next((u for u in cours.user if u.id == user_id), None)
    if not user:
        return jsonify({'error': 'Utilisateur non inscrit à ce cours'}), 404

    try:
        cours.user.remove(user)
        db.session.commit()
        return jsonify({
            'message': 'Utilisateur désinscrit',
            'details': {
                'cours_id': cours_id,
                'user_id': user_id,
                'places_restantes': cours.capacite_max - len(cours.user)
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500