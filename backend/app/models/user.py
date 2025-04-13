from .. import db, bcrypt
from flask_login import UserMixin

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    # Additional registration info
    prenom = db.Column(db.String(80))
    nom = db.Column(db.String(80))
    age = db.Column(db.Integer)
    telephone = db.Column(db.String(20))
    # Add avatar fields
    avatar_id = db.Column(db.Integer, default=1)  # Default to first avatar
    avatar_url = db.Column(db.String(255))  # Optional: if you want to store full URL

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'prenom': self.prenom,
            'nom': self.nom,
            'age': self.age,
            'telephone': self.telephone,
            'is_admin': self.is_admin,
            'avatar_id': self.avatar_id,
            'avatar_url': self.avatar_url or self.get_avatar_url()  # Use method if URL not stored
        }
    
    def get_avatar_url(self):
        # Example function to generate the avatar URL
        return f"/avatars/{self.avatar_id}.png" 