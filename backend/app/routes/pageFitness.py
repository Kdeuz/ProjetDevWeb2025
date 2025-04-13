from flask import jsonify, Blueprint
import base64
import io
import matplotlib
matplotlib.use('Agg') 
from matplotlib import pyplot as plt
from datetime import datetime
from ..models import Coach, CoursFitness, FitnessStatus

pageFitness_bp = Blueprint('pageFitness', __name__)

def generate_bar_plot(labels, values, title, xlabel, ylabel, color):
    """Helper function to generate bar plots"""
    plt.figure(figsize=(10, 6))
    bars = plt.bar(labels, values, color=color)
    plt.title(title, fontsize=14)
    plt.xlabel(xlabel)
    plt.ylabel(ylabel)
    
    # Add value labels on top of each bar
    for bar in bars:
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2., height,
                 f'{int(height)}',
                 ha='center', va='bottom')
    
    img_stream = io.BytesIO()
    plt.savefig(img_stream, format='png')
    plt.close()
    img_stream.seek(0)
    return base64.b64encode(img_stream.getvalue()).decode('utf-8')

@pageFitness_bp.route('/api/fitness-data')
def get_all_fitness_data():
    """Renvoie toutes les données structurées pour la page fitness"""
    
    # 1. Récupération des coachs
    coachs = Coach.query.all()
    coachs_data = [{
        'id': coach.id,
        'nom': coach.nom,
        'prenom': coach.prenom,
        'description': coach.description,
    } for coach in coachs]

    # 2. Récupération des cours
    cours = CoursFitness.query.all()
    cours_data = [{
        'id': cours.id,
        'jour': cours.jour,
        'heure': cours.heure.strftime("%H:%M"),
        'activite': cours.activite,
    } for cours in cours]

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

@pageFitness_bp.route('/api/generate-fitness-plot')
def generate_fitness_plot():
    # Get all fitness activities and count participants
    cours = CoursFitness.query.all()
    activity_counts = {}
    
    for c in cours:
        if c.activite not in activity_counts:
            activity_counts[c.activite] = 0
        # Assuming each course has a participants count or you can query related data
        activity_counts[c.activite] += 1  # Or use actual participant count if available
    
    activities = list(activity_counts.keys())
    counts = list(activity_counts.values())

    img_base64 = generate_bar_plot(
        activities, counts, '🧘‍♀️ Popularité des Activités Fitness', 'Activité', 'Nombre de Participants', '#2ca02c'
    )
    return jsonify({'image': img_base64})
