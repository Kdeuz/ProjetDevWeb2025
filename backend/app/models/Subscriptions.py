from .. import db
from datetime import time

class UserSubscription(db.Model):
    __tablename__ = 'user_subscriptions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    course_type = db.Column(db.String(20), nullable=False)  # 'fitness', 'piscine', 'muscu'
    course_id = db.Column(db.Integer, nullable=False)

    def get_course(self):
        if self.course_type == 'fitness':
            from .PageFitness import CoursFitness
            return CoursFitness.query.get(self.course_id)
        elif self.course_type == 'piscine':
            from .PagePiscine import CoursPiscine
            return CoursPiscine.query.get(self.course_id)
        elif self.course_type == 'muscu':
            from .PageMusculation import ProgrammeMusculation
            return ProgrammeMusculation.query.get(self.course_id)
        return None

    def to_dict(self):
        course = self.get_course()
        if not course:
            return {'type': self.course_type, 'id': self.course_id, 'details': None}

        if self.course_type == 'fitness':
            return {
                'type': 'fitness',
                'id': self.course_id,
                'details': {
                    'activite': course.activite,
                    'jour': course.jour,
                    'heure': course.heure.strftime('%H:%M') if course.heure else None
                }
            }
        elif self.course_type == 'piscine':
            return {
                'type': 'piscine',
                'id': self.course_id,
                'details': {
                    'nom': course.nom,
                    'description': course.description,
                    'jour': course.jour,
                    'heure': course.heure.strftime('%H:%M') if course.heure else None
                }
            }
        elif self.course_type == 'muscu':
            return {
                'type': 'muscu',
                'id': self.course_id,
                'details': {
                    'titre': course.titre,
                    'description': course.description
                }
            }

        return {
            'type': self.course_type,
            'id': self.course_id,
            'details': None
        }

