import base64
import io
from flask import Blueprint, jsonify
import matplotlib
matplotlib.use('Agg')  # Set the backend to Agg before importing pyplot
from matplotlib import pyplot as plt
from ..models.PageMusculation import ProgrammeMusculation, EquipementMusculation

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

@pageMusculation_bp.route('/api/generate-musculation-plot')
def generate_musculation_plot():
    # Get equipment availability data
    equipements = EquipementMusculation.query.all()
    
    available = sum(1 for eq in equipements if eq.disponible)
    unavailable = len(equipements) - available
    
    labels = ['Disponible', 'Non disponible']
    sizes = [available, unavailable]
    colors = ['#4CAF50', '#F44336']
    
    fig, ax = plt.subplots()
    ax.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90, colors=colors)
    ax.set_title('🏋️ État des Équipements de Musculation')
    ax.axis('equal')  # Equal aspect ratio ensures the pie chart is circular
    
    img_stream = io.BytesIO()
    fig.savefig(img_stream, format='png')
    plt.close(fig)
    img_stream.seek(0)

    img_base64 = base64.b64encode(img_stream.getvalue()).decode('utf-8')
    return jsonify({'image': img_base64})