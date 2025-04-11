from app import db
from flask import Blueprint, request, jsonify
from flask_login import login_user, login_required, logout_user, current_user

coach_bp = Blueprint('coach', __name__)

@coach_bp.route('add_coach', methods=['POST'])
@login_required
def add_coach():
    if not current_user.is_admin:
        return jsonify({'error': 'Accès refusé : administrateur uniquement'}), 403
    
    data = request.json

    nom = data.get("Nom")
    prenom = data.get("Prenom")
    specialite = data.get("Specialite")

    if not nom or not prenom or not specialite:
        return jsonify({'error': 'Nom et description requis'}), 400

    coach = Coach(nom, prenom, specialite)
    db.session.add(coach)
    db.session.commit()

    return jsonify({'message':'Ajout validé'}), 201


@coach_bp.route('/remove_coach/<int:coach_id>', methods=['DELETE'])
@login_required
def remove_coach(coach_id):
    if not current_user.is_admin:
        return jsonify({'error': 'Accès refusé : administrateur uniquement'}), 403

    # Vérifier si le coach existe
    coach = Coach.query.get(coach_id)
    if not coach:
        return jsonify({'error': 'Coach non trouvé'}), 404

    # Vérifier si le coach est associé à des cours
    if coach.cours:
        cours_list = [c.nom for c in coach.cours]
        return jsonify({
            'error': 'Suppression impossible - coach associé à des cours',
            'cours': cours_list,
            'solution': 'Supprimez d\'abord les cours associés ou réaffectez-les'
        }), 409

    try:
        db.session.delete(coach)
        db.session.commit()
        return jsonify({
            'message': f'Coach {coach.prenom} {coach.nom} supprimé avec succès',
            'coach_id': coach_id
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Erreur lors de la suppression',
            'details': str(e)
        }), 500