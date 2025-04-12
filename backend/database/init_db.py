from app import db
from datetime import time
from app.models.PageFitness import Coach, CoursFitness, FitnessStatus
from app.models.user import User
def init_database():
    """Initialize the database with sample data"""
    db.drop_all()  # Drop all tables
    db.create_all()  # Recreate the tables

    try:
        # Clear existing data (optional - be careful in production)
        db.session.query(Coach).delete()
        db.session.query(CoursFitness).delete()
        db.session.query(FitnessStatus).delete()
        db.session.query(User).delete()  # Clear existing users

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

        # Define users (without 'password' in constructor)
        users = [
            {"email": "admin@exemple.com", "username": "admin-1", "is_admin": True, "prenom": "AdminFirst", "nom": "AdminLast", "age": 35, "telephone": "9876543210", "password": "adminpassword"},
            {"email": "user@exemple.com", "username": "user-1", "is_admin": False, "prenom": "user", "nom": "1", "age": 20, "telephone": "123456789", "password": "userpassword"},
            {"email": "user2@exemple.com", "username": "user2", "is_admin": False, "prenom": "user2", "nom": "user2", "age": 22, "telephone": "222222222", "password": "user2password"},
            {"email": "user3@exemple.com", "username": "user3", "is_admin": False, "prenom": "user3", "nom": "user3", "age": 33, "telephone": "123456", "password": "user3password"}
        ]

        # Add users to the database and hash their passwords
        for user_data in users:
            user = User(
                email=user_data["email"],
                username=user_data["username"],
                is_admin=user_data["is_admin"],
                prenom=user_data["prenom"],
                nom=user_data["nom"],
                age=user_data["age"],
                telephone=user_data["telephone"]
            )
            user.set_password(user_data["password"])  # Hash the password using set_password
            db.session.add(user)

        # Commit the users to the database
        db.session.commit()

        print("Database initialized successfully!")
    except Exception as e:
        db.session.rollback()
        print(f"Error initializing database: {str(e)}")
        raise

