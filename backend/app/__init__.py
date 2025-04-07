from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_login import LoginManager
from .config import Config

db = SQLAlchemy()
bcrypt = Bcrypt()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Configuration CORS
    CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:3000"}})

    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)

    from app.routes.auth import auth_bp
    from app.routes.admin import admin_bp
    from app.routes.performances import performance_bp
    from app.routes.validation import validation_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(performance_bp)
    app.register_blueprint(validation_bp)

    @login_manager.user_loader
    def load_user(user_id):
        from app.models import User  
        return User.query.get(int(user_id))

    @login_manager.unauthorized_handler #Vérifier que l'utilisateur est connecté, sinon flask-login envoie cette erreur avant
    def unauthorized():
        return jsonify({"error": "Vous devez être connecté pour accéder à cette ressource"}), 401

    return app
