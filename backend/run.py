# Modified version of your file with init_db integration
from app import create_app, db
from app.models import *  # Import all models (important!)
from datetime import datetime
from database.init_db import init_database  # Correct import

app = create_app()

# Create tables and initialize data
with app.app_context():
    db.create_all()
    init_database()  # Call the initialization function

if __name__ == "__main__":
    app.run(debug=True)
