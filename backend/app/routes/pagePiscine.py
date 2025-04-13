from app.models import CoursPiscine, PiscineStatus, Bassin
from flask import jsonify, Blueprint
from datetime import datetime

pagePiscine_bp = Blueprint('pagePiscine', __name__)
@pagePiscine_bp.route('/api/piscine-data')
def get_piscine_data():
    try:
        # Load data
        cours = CoursPiscine.query.order_by(CoursPiscine.jour, CoursPiscine.heure).all()
        statuses = PiscineStatus.query.all()
        bassins = Bassin.query.all()

        # Create a dictionary for bassin statuses
        bassin_status = {}
        for bassin in bassins:
            status = next((s for s in statuses if s.bassin_id == bassin.id), None)
            bassin_status[bassin.nom] = status.status if status else 0

        # Serialize bassins
        bassins_serialises = [{
            'id': b.id,
            'nom': b.nom,
            'description': b.description,
            'longueur': b.longueur,
            'profondeur': b.profondeur
        } for b in bassins]

        # Serialize cours
        cours_serialises = [{
            'id': c.id,
            'nom': c.nom,
            'description': c.description,
            'heure': c.heure.strftime("%H:%M"),
            'jour': c.jour, # Format the time
        } for c in cours]

        # Build response
        return jsonify({
            'success': True,
            'data': {
                'nombreBassins': len(bassins),
                'bassins': bassins_serialises,  # Added bassins data
                'cours': cours_serialises,
                'nombreParBassin': bassin_status,
                'stats': {
                    'total_cours': len(cours)
                }
            },
            'metadata': {
                'last_updated': datetime.now().isoformat(),
                'version': '1.0'
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'data': {
                'cours': [],
                'bassins': [],  # Added empty bassins array
                'nombreBassins': 0,
                'nombreParBassin': {},
                'stats': {'total_cours': 0}
            }
        }), 500