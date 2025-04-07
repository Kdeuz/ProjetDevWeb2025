from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from app import db

class CodeInscription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(6), unique=True, nullable=False)
    utilisé = db.Column(db.Boolean, default=False)
    créé_le = db.Column(db.DateTime, default=datetime.utcnow)
    expiré_le = db.Column(db.DateTime, default=lambda: datetime.utcnow() + timedelta(minutes=2))  # Correction ici

    def is_expired(self):
        return datetime.utcnow() > self.expiré_le
