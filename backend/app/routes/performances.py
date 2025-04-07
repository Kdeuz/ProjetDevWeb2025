from flask import Blueprint, request, jsonify
from app import db
from flask_login import login_required, current_user
from ..models import CodePerformance, Machine, Performance, CodeBase
from datetime import datetime, timedelta
import random

performance_bp = Blueprint('performance', __name__)

@performance_bp.route('/add-machine', methods=['POST'])
@login_required
def add_machine():
    if not current_user.is_admin:
        return jsonify({'error': 'Accès refusé : administrateur uniquement'}), 403

    data = request.json
    nom = data.get('nom')
    description = data.get('description')

    if not nom or not description:
        return jsonify({'error': 'Nom et description requis'}), 400

    if Machine.query.filter_by(nom=nom).first():
        return jsonify({'error': 'Une machine avec ce nom existe déjà'}), 409

    machine = Machine(nom=nom, description=description)
    db.session.add(machine)
    db.session.commit()

    return jsonify({'message': 'Machine créée avec succès', 'machine': {'id': machine.id, 'nom': machine.nom}}), 201



@performance_bp.route('/generate-code-perf', methods=['POST'])
@login_required
def generate_code_perf():
    data = request.json
    machine_id = data.get('machine_id')

    if not machine_id:
        return jsonify({'error': 'ID de la machine requis'}), 400

    machine = Machine.query.get(machine_id)
    if not machine:
        return jsonify({'error': 'Machine introuvable'}), 404

    code = CodeBase.generate_unique_code()

    new_code = CodePerformance(
        code=code,
        user_id=current_user.id,
        machine_id=machine_id,
        expiré_le=datetime.utcnow() + timedelta(minutes=1)
    )

    db.session.add(new_code)
    db.session.commit()

    return jsonify({
        'message': 'Code généré avec succès',
        'code': code,
        'expire_a': new_code.expiré_le.isoformat()
    }), 201

# Route fictive pour simuler l'enregistrement d'une performance à partir d'un code
@performance_bp.route('/submit-performance', methods=['POST'])
@login_required
def submit_performance():
    data = request.json
    code_input = data.get('code')

    code_perf = CodePerformance.query.filter_by(code=code_input, utilisé=False).first()

    if not code_perf:
        return jsonify({'error': 'Code invalide'}), 404

    machine = code_perf.machine
    reps = random.randint(6, 15)
    poids = random.choice([20, 30, 40, 50, 60, 70, 80])

    performance = Performance(
        user_id=current_user.id,
        machine_id=machine.id,
        reps=reps,
        poids=poids,
        date=datetime.utcnow()
    )

    code_perf.utilisé = True
    db.session.add(performance)
    db.session.commit()

    return jsonify({
        'message': 'Performance enregistrée avec succès 🏋️',
        'performance': {
            'machine': machine.nom,
            'description': machine.description,
            'reps': reps,
            'poids': poids
        }
    }), 201

@performance_bp.route('/my-performances', methods=['GET'])
@login_required
def my_performances():
    performances = Performance.query.filter_by(user_id=current_user.id).order_by(Performance.date.desc()).all()

    result = []
    for perf in performances:
        result.append({
            'machine': perf.machine.nom,
            'description_machine': perf.machine.description,
            'reps': perf.reps,
            'poids': perf.poids,
            'date': perf.date.isoformat()
        })

    return jsonify({'performances': result})

@login_required
@performance_bp.route('/top-performances/<int:machine_id>', methods=['GET'])
def top_performances(machine_id):
    machine = Machine.query.get(machine_id)
    if not machine:
        return jsonify({'error': 'Machine non trouvée'}), 404

    unique = request.args.get('unique_par_user', 'false').lower() == 'true'

    if not unique:
        # Version simple (pas filtrée par utilisateur)
        top_perfs = Performance.query \
            .filter_by(machine_id=machine_id) \
            .order_by(Performance.poids.desc(), Performance.reps.desc()) \
            .limit(10) \
            .all()
    else:
        # Version unique par utilisateur
        all_perfs = Performance.query \
            .filter_by(machine_id=machine_id) \
            .order_by(Performance.poids.desc(), Performance.reps.desc()) \
            .all()

        seen_users = set()
        top_perfs = []

        for perf in all_perfs:
            if perf.user_id not in seen_users:
                top_perfs.append(perf)
                seen_users.add(perf.user_id)
            if len(top_perfs) == 10:
                break

    result = []
    for perf in top_perfs:
        result.append({
            'utilisateur': f"{perf.user.prenom} {perf.user.nom}" if perf.user.prenom and perf.user.nom else perf.user.username,
            'reps': perf.reps,
            'poids': perf.poids,
            'date': perf.date.isoformat()
        })

    return jsonify({
        'machine': machine.nom,
        'top_performances': result,
        'filtrage_unique_par_utilisateur': unique
    })



@performance_bp.route('/top-personnel', methods=['GET'])
@login_required
def top_personnel():
    # Récupérer toutes les machines
    machines = Machine.query.all()
    random.shuffle(machines)  # Mélange aléatoire

    top_perfs = []

    for machine in machines:
        # Meilleure perf de l’utilisateur sur cette machine
        perf = Performance.query \
            .filter_by(user_id=current_user.id, machine_id=machine.id) \
            .order_by(Performance.poids.desc(), Performance.reps.desc()) \
            .first()

        if perf:
            top_perfs.append({
                'machine': machine.nom,
                'description': machine.description,
                'reps': perf.reps,
                'poids': perf.poids,
                'date': perf.date.isoformat()
            })

    return jsonify({
        'utilisateur': f"{current_user.prenom} {current_user.nom}" if current_user.prenom and current_user.nom else current_user.username,
        'top_personnel': top_perfs
    })


