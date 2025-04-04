from flask import Blueprint, request, jsonify
from app import db
from app.models.code import CodeInscription
import random

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/generate_code', methods=['POST'])
def generate_code():
    # Simuler que l'utilisateur est un admin (par exemple, vérifier un token, mais ici, juste un booléen pour l'exemple)
    is_admin = True  # À remplacer par une vraie vérification de rôle

    if not is_admin:
        return jsonify({"error": "Vous devez etre administrateur pour generer un code"}), 403

    # Générer un code d'inscription à 6 chiffres
    code = ''.join([str(random.randint(0, 9)) for _ in range(6)])

    new_code = CodeInscription(code=code)
    db.session.add(new_code)
    db.session.commit()

    return jsonify({"message": "Code genere", "code": code})


# Route pour voir les codes disponibles (non utilisés)
@admin_bp.route('/admin/view_codes', methods=['GET'])
def view_codes():
    codes = CodeInscription.query.filter_by(utilisé=False).all()
    codes_list = [{"id": code.id, "code": code.code, "cree_le": code.créé_le} for code in codes]
    return jsonify(codes_list)
