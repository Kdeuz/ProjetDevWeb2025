from app import create_app, db
from app.models import *  # importe tous les modèles (important !)

app = create_app()

# Création des tables si elles n'existent pas
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
