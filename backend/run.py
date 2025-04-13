from app import create_app, db
from app.models import * 
from datetime import datetime
from database.init_db import init_database 

app = create_app()

# Create tables and initialize data
with app.app_context():
    db.create_all()
    init_database() 

if __name__ == "__main__":
    app.run(debug=True)
