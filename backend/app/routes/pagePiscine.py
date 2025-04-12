from flask import jsonify, Blueprint
from datetime import datetime
from app.models.PagePiscine import PagePiscine  # Notez le 'app.' ajouté

# Gardez le même nom que les autres blueprints
pagePiscine_bp = Blueprint('pagePiscine', __name__)

@pagePiscine_bp.route('/piscine-data')  # ❌ Enlevez '/api' ici
def get_piscine_data():
    try:
        page_data = PagePiscine()
        return jsonify({
            'success': True,
            'data': page_data.to_dict(),
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
                'nombreBassins': 3,
                'cours': [],
                'nombreParBassin': 0,
                'stats': {'total_cours': 0}
            }
        }), 500