from app import db  # Import db from app

class SalleFitness(db.Model):
    __tablename__ = 'salles_fitness'
    
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    # Add other fields as necessary
