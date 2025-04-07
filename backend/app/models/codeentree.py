from app import db
from .codebase import CodeBase

class CodeEntree(CodeBase):
    __mapper_args__ = {
        'polymorphic_identity': 'entree'
    }

    salle = db.Column(db.String(50), nullable=False)  # ex: "musculation", "fitness", "piscine"


