import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    
    # Construction du chemin absolu pour la base de données
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    DATABASE_PATH = os.path.join(BASE_DIR, '../database/database.db')
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{DATABASE_PATH}'  # Utilisation du format sqlite:///chemin/absolu/vers/db

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_TYPE = 'filesystem'  # On peut aussi utiliser redis, sql, etc.
    SESSION_PERMANENT = True
    PERMANENT_SESSION_LIFETIME = 3600  
    SESSION_COOKIE_SECURE = True        # Session uniquement en HTTPS
    SESSION_COOKIE_HTTPONLY = True      # Inaccessible au JavaScript
    SESSION_COOKIE_SAMESITE = 'Lax'     # Empêche certains attaques cross-site
