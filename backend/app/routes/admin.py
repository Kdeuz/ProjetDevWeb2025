from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app import db
from app.models.code import CodeInscription
import random

admin_bp = Blueprint('admin', __name__)

# Route pour générer un code d'inscription (réservée aux admins)
@admin_bp.route('/admin/generate_code', methods=['POST'])
@login_required
def generate_code():
    #if not current_user.is_admin:
        #return jsonify({"error": "Vous devez être administrateur pour générer un code"}), 403

    # Générer un code d'inscription à 6 chiffres
    code = ''.join([str(random.randint(0, 9)) for _ in range(6)])

    new_code = CodeInscription(code=code)
    db.session.add(new_code)
    db.session.commit()

    return jsonify({"message": "Code généré", "code": code})


# Route pour voir les codes disponibles (non utilisés)
@admin_bp.route('/admin/view_codes', methods=['GET'])
@login_required
def view_codes():
    if not current_user.is_admin:
        return jsonify({"error": "Accès réservé aux administrateurs"}), 403

    codes = CodeInscription.query.filter_by(utilisé=False).all()
    codes_list = [
        {"id": code.id, "code": code.code, "cree_le": code.créé_le}
        for code in codes
    ]
    return jsonify(codes_list)
