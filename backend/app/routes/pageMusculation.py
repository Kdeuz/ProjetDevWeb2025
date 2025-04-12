from flask import Blueprint, jsonify
from ..models.musculation import ProgrammeMusculation, EquipementMusculation

pageMusculation_bp = Blueprint('pageMusculation', __name__)

@pageMusculation_bp.route('/api/programmes')
def get_programmes():
    """Renvoie tous les programmes de musculation"""
    programmes = ProgrammeMusculation.query.all()
    data = [{
        'id': prog.id,
        'titre': prog.titre,
        'description': prog.description
    } for prog in programmes]
    return jsonify(data)

@pageMusculation_bp.route('/api/equipements')
def get_equipements():
    """Renvoie tous les équipements de musculation"""
    equipements = EquipementMusculation.query.all()
    data = [{
        'id': eq.id,
        'nom': eq.nom,
        'description': eq.description,
        'disponible': eq.disponible
    } for eq in equipements]
    return jsonify(data)
