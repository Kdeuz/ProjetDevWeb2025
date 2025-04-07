from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from ..models.codebase import CodeBase
from ..models.codeperf import CodePerformance
from ..models.codeentree import CodeEntree
from app import db

validation_bp = Blueprint("validation", __name__)

@validation_bp.route("/valider-code", methods=["POST"])
@login_required
def valider_code():
    data = request.get_json()
    code_input = data.get("code")

    if not code_input or len(code_input) != 6:
        return jsonify({"success": False, "message": "Code invalide."}), 400

    code_obj = CodeBase.query.filter_by(code=code_input, utilisé=False).first()

    if not code_obj:
        return jsonify({"success": False, "message": "Code inconnu ou déjà utilisé."}), 404

    if code_obj.is_expired():
        return jsonify({"success": False, "message": "Code expiré."}), 410

    if isinstance(code_obj, CodePerformance):
        return jsonify({
            "success": True,
            "redirect": "/submit-performance",
            "code": code_obj.code
        })

    elif isinstance(code_obj, CodeEntree):
        return jsonify({
            "success": True,
            "redirect": f"/entree/{code_obj.salle}", #A FAIRE
            "code": code_obj.code
        })

    #FAIRE AVEC COURS AUSSI 
    return jsonify({"success": False, "message": "Type de code inconnu."}), 400


