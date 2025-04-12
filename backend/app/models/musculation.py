from .. import db

class ProgrammeMusculation(db.Model):
    __tablename__ = 'programme_musculation'

    id = db.Column(db.Integer, primary_key=True)
    titre = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f'<ProgrammeMusculation {self.titre}>'

class EquipementMusculation(db.Model):
    __tablename__ = 'equipement_musculation'

    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    disponible = db.Column(db.Boolean, default=True)

    def __repr__(self):
        return f'<EquipementMusculation {self.nom} - Disponible: {self.disponible}>'
