from app import db
from datetime import time
from app.models.PageFitness import Coach, CoursFitness, FitnessStatus

def init_database():
    """Initialize the database with sample data"""
    db.drop_all()  # Drop all tables
    db.create_all()  # Recreate the tables

    try:
        # Clear existing data (optional - be careful in production)
        db.session.query(Coach).delete()
        db.session.query(CoursFitness).delete()
        db.session.query(FitnessStatus).delete()

        # Define and add coaches
        coaches = [
            {
                "nom": "Dupont",
                "prenom": "Jean",
                "description": "Expert en musculation et nutrition. Jean vous aidera à construire votre force et à optimiser votre alimentation."
            },
            {
                "nom": "Curie",
                "prenom": "Marie",
                "description": "Spécialiste en yoga et bien-être. Marie vous guidera vers un équilibre parfait entre corps et esprit."
            },
            {
                "nom": "Martin",
                "prenom": "Paul",
                "description": "Coach cardio et endurance. Avec Paul, améliorez votre condition physique et repoussez vos limites."
            },
            {
                "nom": "Bernard",
                "prenom": "Emma",
                "description": "Instructrice de Pilates et stretching. Emma vous aidera à renforcer votre corps tout en améliorant votre souplesse."
            },
        ]

        for coach in coaches:
            db.session.add(Coach(**coach))

        # Commit coaches to ensure they are assigned IDs before using them
        db.session.commit()

        # Define and add fitness courses with correct coach_id references
        fitness_courses = [
            {"jour": "Lundi", "heure": time(18, 0), "activite": "Yoga", "coach_id": 1},
            {"jour": "Mardi", "heure": time(19, 0), "activite": "Cardio", "coach_id": 2},
            {"jour": "Mercredi", "heure": time(20, 0), "activite": "Musculation", "coach_id": 3},
            {"jour": "Jeudi", "heure": time(18, 30), "activite": "HIIT", "coach_id": 4},
            {"jour": "Vendredi", "heure": time(19, 0), "activite": "Pilates", "coach_id": 4},
            {"jour": "Samedi", "heure": time(10, 0), "activite": "Bootcamp", "coach_id": 1},
            {"jour": "Dimanche", "heure": time(11, 0), "activite": "Méditation", "coach_id": 2},
        ]

        for course in fitness_courses:
            db.session.add(CoursFitness(**course))

        # Initialize fitness status
        db.session.add(FitnessStatus(personnes=20))

        db.session.commit()
        print("Database initialized successfully!")
    except Exception as e:
        db.session.rollback()
        print(f"Error initializing database: {str(e)}")
        raise
