from .. import db

class Abonnement(db.Model):
    __tablename__ = 'abonnements'

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(20), nullable=False)  

    users = db.relationship("User", back_populates="abonnement")

