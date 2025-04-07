from app import db
from .codebase import CodeBase

class CodePerformance(CodeBase):
    __mapper_args__ = {
        'polymorphic_identity': 'performance'
    }

    machine_id = db.Column(db.Integer, db.ForeignKey('machine.id'), nullable=False)
    machine = db.relationship('Machine', backref='codes_performance')
