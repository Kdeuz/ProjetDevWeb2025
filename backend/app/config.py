import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_TYPE = 'filesystem'  # tu peux aussi mettre redis, sql, etc.
    SESSION_PERMANENT = True
    PERMANENT_SESSION_LIFETIME = 3600  # en secondes (1h ici)
    SESSION_COOKIE_SECURE = True        # en HTTPS uniquement
    SESSION_COOKIE_HTTPONLY = True      # inaccessible au JS
    SESSION_COOKIE_SAMESITE = 'Lax'     # empêche certains cross-site attacks
