from flask import jsonify, Blueprint
from datetime import time
from sqlalchemy.orm import joinedload
from datetime import datetime
from ..models import Coach, CoursFitness, User, FitnessStatus

pageFitness_bp = Blueprint('pageFitness', __name__)


@pageFitness_bp.route('/api/fitness-data')
def get_all_fitness_data():
    """Renvoie toutes les données structurées pour la page fitness"""
    
    # 1. Récupération des coachs
    coachs = Coach.query.all()
    coachs_data = [{
        'id': coach.id,
        'nom_complet': f"{coach.prenom} {coach.nom}",
        'description': coach.description,
    } for coach in coachs]

    # 2. Récupération des cours avec coach et participants
    cours = CoursFitness.query.options(
        joinedload(CoursFitness.coach),
    ).order_by(CoursFitness.jour, CoursFitness.heure).all()

    cours_data = []
    for cours in cours:
        cours_data.append({
            'id': cours.id,
            'jour': cours.jour,
            'heure': cours.heure.strftime("%H:%M"),  # Formatage de l'heure
            'activite': cours.activite,
        })

    # 3. Récupération du nombre de personnes
    fitness_status = FitnessStatus.query.first()
    personnes = fitness_status.personnes if fitness_status else 0

    # 4. Statistiques globales
    stats = {
        'total_coachs': len(coachs_data),
        'total_cours': len(cours_data),
        'personnes': personnes
    }

    # 5. Renvoi de toutes les données structurées
    return jsonify({
        'coachs': coachs_data,
        'cours': cours_data,
        'stats': stats,
        'metadata': {
            'last_updated': datetime.now().isoformat(),
            'version': '1.0'
        }
    })