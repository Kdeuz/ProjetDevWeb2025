from flask import Blueprint, request, jsonify
from flask_login import login_user, login_required, logout_user, current_user
from .. import db
from ..models import User
from ..models import CodeInscription

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/', methods=['GET'])
def index():
    return jsonify({"message": "API backend en ligne 🚀"})

# --- Route : Inscription (avec vérification code d'invitation) ---
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    required_fields = ['email', 'username', 'password', 'prenom', 'nom', 'age', 'telephone', 'code']

    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Champs manquants'}), 400

    code_obj = CodeInscription.query.filter_by(code=data.get('code'), utilisé=False).first()

    if not code_obj or code_obj.is_expired():
        return jsonify({"error": "Code d'inscription invalide, expire ou déjà utilise"}), 400

    # Marque le code comme utilisé
    code_obj.utilisé = True

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email déjà utilise'}), 409

    new_user = User(
        email=data['email'],
        username=data['username'],
        prenom=data['prenom'],
        nom=data['nom'],
        age=int(data['age']),
        telephone=data['telephone']
    )
    new_user.set_password(data['password'])

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'Inscription reussie'}), 201

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

# --- Route : Données utilisateur connecté ---
@auth_bp.route('/me', methods=['GET'])
@login_required
def me():
    return jsonify(current_user.to_dict())


