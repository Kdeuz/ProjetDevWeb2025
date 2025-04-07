from app import db
from datetime import datetime, timedelta
from random import randint

class CodeBase(db.Model):
    __tablename__ = 'codes'

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(6), unique=True, nullable=False)
    utilisé = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    créé_le = db.Column(db.DateTime, default=datetime.utcnow)
    expiré_le = db.Column(db.DateTime, default=lambda: datetime.utcnow() + timedelta(minutes=1))
    type = db.Column(db.String(50))

    __mapper_args__ = {
        'polymorphic_on': type,
        'polymorphic_identity': 'base'
    }

    user = db.relationship('User')

    def is_expired(self):
        return datetime.utcnow() > self.expiré_le

    @staticmethod
    def generate_unique_code():
        while True:
            code = f"{randint(0, 999999):06}"
            if not CodeBase.query.filter_by(code=code).first():
                return code
