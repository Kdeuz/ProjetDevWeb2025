from flask import Blueprint, request, jsonify
from flask_login import login_user, login_required, logout_user, current_user
from .. import db
from ..models import User, UserSubscription, CoursFitness, CoursPiscine, ProgrammeMusculation


auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/', methods=['GET'])
def index():
    return jsonify({"message": "API backend en ligne 🚀"})

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    required_fields = ['email', 'username', 'password', 'prenom', 'nom', 'age', 'telephone']

    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Champs manquants'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email déjà utilisé'}), 409

    is_admin = data.get('is_admin', False)

    new_user = User(
        email=data['email'],
        username=data['username'],
        prenom=data['prenom'],
        nom=data['nom'],
        age=int(data['age']),
        telephone=data['telephone'],
        is_admin=is_admin,
        avatar_id=1,
        avatar_url="/assets/images/avatar1.png",
        mes_records="Aucun record pour cet utilisateur.",
        abonnement_id=2  # Hardcoded Normal subscription
    )

    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        'message': 'Inscription réussie',
        'user': new_user.to_dict()
    }), 201

# --- Route : Connexion ---
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data.get('email')).first()

    if user and user.check_password(data.get('password')):
        login_user(user)
        return jsonify({'message': 'Connexion reussie', 'user': user.to_dict()}), 200

    return jsonify({'error': 'Identifiants invalides'}), 401

# --- Route : Déconnexion ---
@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Deconnexion reussie'}), 200

@auth_bp.route('/me', methods=['GET'])
@login_required
def me():
    user = current_user

    # Fetch the user's subscriptions
    subscriptions = UserSubscription.query.filter_by(user_id=user.id).all()

    courses = []
    for subscription in subscriptions:
        course_type = subscription.course_type
        course_id = subscription.course_id

        if course_type == 'fitness':
            course = CoursFitness.query.get(course_id)
            if course:
                courses.append({
                    'type': 'fitness',
                    'id': course.id,
                    'course_id': course.id,
                    'details': {
                        'activite': course.activite,
                        'jour': course.jour,
                        'heure': course.heure.strftime('%H:%M') if course.heure else None
                    }
                })
        elif course_type == 'piscine':
            course = CoursPiscine.query.get(course_id)
            if course:
                courses.append({
                    'type': 'piscine',
                    'id': course.id,
                    'course_id': course.id,
                    'details': {
                        'nom': course.nom,
                        'description': course.description,
                        'jour': course.jour,
                        'heure': course.heure.strftime('%H:%M') if course.heure else None
                    }
                })
        elif course_type == 'muscu':
            course = ProgrammeMusculation.query.get(course_id)
            if course:
                courses.append({
                    'type': 'muscu',
                    'id': course.id,
                    'course_id': course.id,
                    'details': {
                        'titre': course.titre,
                        'description': course.description
                    }
                })

    # Determine abonnement name
    abonnement_type = user.abonnement.type if user.abonnement else 'Non spécifié'


    # Create user data dict manually to control fields
    user_data = {
        'email': user.email,
        'username': user.username,
        'nom': user.nom,
        'prenom': user.prenom,
        'age': user.age,
        'telephone': user.telephone,
        'avatar_id': user.avatar_id,
        'mes_records': user.mes_records,  # renamed for frontend clarity
        'courses': courses,
        'abonnement': abonnement_type  # Now returns an object like to_dict()

    }

    return jsonify(user_data)



@auth_bp.route('/check-auth')
def check_auth():
    if current_user.is_authenticated:
        return jsonify({'authenticated': True}), 200
    else:
        return jsonify({'authenticated': False}), 401
    

@auth_bp.route('/update-avatar', methods=['POST'])
@login_required
def update_avatar():
    try:
        data = request.get_json()
        avatar_id = data.get('avatar_id')
        
        if not avatar_id:
            return jsonify({'success': False, 'error': 'Missing avatarId'}), 400
        
        # Validate avatar_id is within allowed range
        if avatar_id not in [1, 2, 3, 4, 5]:
            return jsonify({'success': False, 'error': 'Invalid avatar ID'}), 400
        
        current_user.avatar_id = avatar_id
        current_user.avatar_url = f"/assets/images/avatar{avatar_id}.png"
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Avatar updated successfully',
            'avatar_id': current_user.avatar_id,
            'avatar_url': current_user.avatar_url
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error updating avatar: {e}")
        return jsonify({'success': False, 'error': 'Failed to update avatar'}), 500
    
@auth_bp.route('/update-records', methods=['POST'])
@login_required
def update_records():
    try:
        data = request.get_json()
        records = data.get('mes_records')

        if records is None:
            return jsonify({'error': 'Missing mes_records'}), 400

        current_user.mes_records = records
        db.session.commit()

        return jsonify({
            'message': 'mes_records updated successfully',
            'mes_records': current_user.mes_records
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error updating mes_records: {e}")
        return jsonify({'error': 'An error occurred while updating mes_records'}), 500
    
@auth_bp.route('/update-profile', methods=['POST'])
@login_required
def update_profile():
    user = current_user
    data = request.get_json()

    try:
        print("Incoming profile update data:", data)  # Debug log

        if 'nom' in data:
            user.nom = data['nom']
        if 'prenom' in data:
            user.prenom = data['prenom']
        if 'email' in data:
            user.email = data['email']
        if 'username' in data:
            user.username = data['username']
        if 'age' in data:
            user.age = int(data['age']) if data['age'] else None
        if 'telephone' in data:
            user.telephone = data['telephone']
        if 'password' in data and data['password']:
            user.set_password(data['password'])

        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        print("Error updating profile:", str(e))  # Debug log
        return jsonify({'success': False, 'error': str(e)}), 400
