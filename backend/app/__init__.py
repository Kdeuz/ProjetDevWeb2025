from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_login import LoginManager
from .config import Config
from dotenv import load_dotenv  
import os

load_dotenv()

print("SECRET_KEY:", os.getenv('SECRET_KEY'))  # Print the loaded SECRET_KEY

db = SQLAlchemy()
bcrypt = Bcrypt()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, supports_credentials=True)
    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)

    from app.routes.auth import auth_bp
    from app.routes.admin import admin_bp
    from app.routes.pageFitness import pageFitness_bp
    from app.routes.pageMusculation import pageMusculation_bp
    from app.routes.pagePiscine import pagePiscine_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(pageFitness_bp)
    app.register_blueprint(pageMusculation_bp)    
    app.register_blueprint(pagePiscine_bp, url_prefix='/api')


    @login_manager.user_loader
    def load_user(user_id):
        from app.models import User  
        return User.query.get(int(user_id))

    return app
