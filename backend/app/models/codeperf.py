from app import db
from datetime import datetime, timedelta
from random import random, randint
class CodePerformance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(6), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    utilisé = db.Column(db.Boolean, default=False)
    machine_id = db.Column(db.Integer, db.ForeignKey('machine.id'), nullable=False)
    créé_le = db.Column(db.DateTime, default=datetime.utcnow)
    expiré_le = db.Column(db.DateTime, default=lambda: datetime.utcnow() + timedelta(minutes=1))

    user = db.relationship('User', backref='codes_performance')
    machine = db.relationship('Machine', backref='codes_performance')

    def is_expired(self):
        return datetime.utcnow() > self.expiré_le
    
    @staticmethod
    def generate_unique_code():
        while True:
            code = f"{randint(0, 999999):06}"
            if not CodePerformance.query.filter_by(code=code).first():
                return code
