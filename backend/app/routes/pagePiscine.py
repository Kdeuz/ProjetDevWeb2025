from flask import jsonify, Blueprint
from datetime import datetime
from app.models import CoursPiscine, PiscineStatus, Bassin
from app.utils.plot_utils import generate_bar_plot

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
            'jour': c.jour,
        } for c in cours]

        # Build response
        return jsonify({
            'success': True,
            'data': {
                'nombreBassins': len(bassins),
                'bassins': bassins_serialises,
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
                'bassins': [],
                'nombreBassins': 0,
                'nombreParBassin': {},
                'stats': {'total_cours': 0}
            }
        }), 500

@pagePiscine_bp.route('/api/generate-piscine-plot')
def generate_piscine_plot():
    try:
        # Get current pool occupancy data
        bassins = Bassin.query.all()
        statuses = PiscineStatus.query.all()
        
        bassin_names = []
        occupancy_counts = []

        for bassin in bassins:
            status = next((s for s in statuses if s.bassin_id == bassin.id), None)
            bassin_names.append(bassin.nom)
            occupancy_counts.append(status.status * 10 if status else 0)

        img_base64 = generate_bar_plot(
            bassin_names, 
            occupancy_counts, 
            '👥 Fréquentation des Bassins', 
            'Nom du Bassin', 
            'Nombre de personnes', 
            '#1f77b4'
        )
        return jsonify({'image': img_base64})
    
    except Exception as e:
        print(f"Error generating piscine plot: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Failed to generate pool occupancy plot'
        }), 500