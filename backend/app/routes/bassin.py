from app import db
from flask import Blueprint, request, jsonify
from flask_login import login_user, login_required, logout_user, current_user
from ..models import Bassin, User

bassin_bp = Blueprint('bassin', __name__)

@bassin_bp.route('/add_user/<int:bassin_id>', methods=['POST'])
@login_required
def add_user(bassin_id):
    """
    Ajoute un utilisateur à un bassin avec vérification de capacité
    """
    bassin = Bassin.query.get(bassin_id)
    if not bassin:
        return jsonify({'error': 'Bassin non trouvé'}), 404

    data = request.json
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'ID utilisateur requis'}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Utilisateur non trouvé'}), 404

    # Vérification capacité
    if bassin.capacite_max and len(bassin.users) >= bassin.capacite_max:
        return jsonify({
            'error': 'Capacité maximale atteinte',
            'capacite_max': bassin.capacite_max,
            'inscrits': len(bassin.users)
        }), 403

    # Vérification si déjà inscrit
    if user in bassin.users:
        return jsonify({'warning': 'Utilisateur déjà inscrit à ce bassin'}), 200

    try:
        bassin.users.append(user)
        db.session.commit()
        return jsonify({
            'message': 'Utilisateur ajouté avec succès',
            'bassin': bassin.nom,
            'places_restantes': bassin.capacite_max - len(bassin.users) if bassin.capacite_max else None
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bassin_bp.route('/remove_user/<int:bassin_id>/<int:user_id>', methods=['DELETE'])
@login_required
def remove_user(bassin_id, user_id):
    """
    Retire un utilisateur d'un bassin
    """
    bassin = Bassin.query.get(bassin_id)
    if not bassin:
        return jsonify({'error': 'Bassin non trouvé'}), 404

    # Autorisation: admin ou utilisateur concerné
    if not (current_user.is_admin or current_user.id == user_id):
        return jsonify({'error': 'Permission refusée'}), 403

    user = next((u for u in bassin.users if u.id == user_id), None)
    if not user:
        return jsonify({'error': 'Utilisateur non inscrit à ce bassin'}), 404

    try:
        bassin.users.remove(user)
        db.session.commit()
        return jsonify({
            'message': 'Utilisateur retiré du bassin',
            'places_restantes': bassin.capacite_max - len(bassin.users) if bassin.capacite_max else None
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500