import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import db
from datetime import time
from app.models.PageFitness import Coach, CoursFitness, FitnessStatus
from app.models.user import User
from app.models.PageMusculation import ProgrammeMusculation, EquipementMusculation
from app.models.PagePiscine import Bassin, CoursPiscine, PiscineStatus

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
        db.session.query(ProgrammeMusculation).delete()
        db.session.query(EquipementMusculation).delete()

        # --- Coaches (from the first code)
        # Define and add coaches with manually assigned IDs
        coaches = [
            {"id": 1, "nom": "Dupont", "prenom": "Jean", "description": "Expert en musculation et nutrition. Jean vous aidera à construire votre force et à optimiser votre alimentation."},
            {"id": 2, "nom": "Curie", "prenom": "Marie", "description": "Spécialiste en yoga et bien-être. Marie vous guidera vers un équilibre parfait entre corps et esprit."},
            {"id": 3, "nom": "Martin", "prenom": "Paul", "description": "Coach cardio et endurance. Avec Paul, améliorez votre condition physique et repoussez vos limites."},
            {"id": 4, "nom": "Bernard", "prenom": "Emma", "description": "Instructrice de Pilates et stretching. Emma vous aidera à renforcer votre corps tout en améliorant votre souplesse."},
        ]

        for coach in coaches:
            db.session.add(Coach(**coach))

        # Commit coaches to ensure they are assigned IDs before using them
        db.session.commit()

        # Define and add fitness courses with correct coach_id references
        fitness_courses = [
            {"id": 1, "jour": "Lundi", "heure": time(18, 0), "activite": "Yoga"},
            {"id": 2, "jour": "Mardi", "heure": time(19, 0), "activite": "Cardio"},
            {"id": 3, "jour": "Mercredi", "heure": time(20, 0), "activite": "Musculation"},
            {"id": 4, "jour": "Jeudi", "heure": time(18, 30), "activite": "HIIT"},
            {"id": 5, "jour": "Vendredi", "heure": time(19, 0), "activite": "Pilates"},
            {"id": 6, "jour": "Samedi", "heure": time(10, 0), "activite": "Bootcamp"},
            {"id": 7, "jour": "Dimanche", "heure": time(11, 0), "activite": "Méditation"},
        ]

        for course in fitness_courses:
            db.session.add(CoursFitness(**course))

        # --- Fitness status (from the first code)
        db.session.add(FitnessStatus(personnes=20))

        # --- Users (from the second code)
        users = [
    {
        "email": "admin@exemple.com", 
        "username": "admin-1", 
        "is_admin": True, 
        "prenom": "AdminFirst", 
        "nom": "AdminLast", 
        "age": 35, 
        "telephone": "9876543210", 
        "password": "adminpassword",
        "avatar_id": 1,  # Admin gets avatar1 by default
        "avatar_url": "/assets/images/avatar1.png"
    },
    {
        "email": "user@exemple.com", 
        "username": "user-1", 
        "is_admin": False, 
        "prenom": "user", 
        "nom": "1", 
        "age": 20, 
        "telephone": "123456789", 
        "password": "userpassword",
        "avatar_id": 2,
        "avatar_url": "/assets/images/avatar2.png"
    },
    {
        "email": "user2@exemple.com", 
        "username": "user2", 
        "is_admin": False, 
        "prenom": "user2", 
        "nom": "user2", 
        "age": 22, 
        "telephone": "222222222", 
        "password": "user2password",
        "avatar_id": 3,
        "avatar_url": "/assets/images/avatar3.png"
    },
    {
        "email": "user3@exemple.com", 
        "username": "user3", 
        "is_admin": False, 
        "prenom": "user3", 
        "nom": "user3", 
        "age": 33, 
        "telephone": "123456", 
        "password": "user3password",
        "avatar_id": 4,
        "avatar_url": "/assets/images/avatar4.png"
    },
]
        for user_data in users:
            user = User(
                email=user_data["email"],
                username=user_data["username"],
                is_admin=user_data["is_admin"],
                prenom=user_data["prenom"],
                nom=user_data["nom"],
                age=user_data["age"],
                telephone=user_data["telephone"],
                avatar_id=user_data["avatar_id"],
                avatar_url=user_data["avatar_url"]
            )
            user.set_password(user_data["password"])  # Hash the password
            db.session.add(user)

        bassins_data = [
            {"nom": "Fosse", "description": "Un bassin de plongée de 25 mètres de profondeur sublimé par un décor magnifique", "longueur": 20.0, "profondeur": 25.0},
            {"nom": "Normal", "description": "Un bassin de 25 mètres et 4 lignes", "longueur": 25.0, "profondeur": 2.0},
            {"nom": "Olympique", "description": "Un bassin de 50 mètres et 10 lignes", "longueur": 50.0, "profondeur": 3.0}
        ]

        bassins = []
        for data in bassins_data:
            b = Bassin(**data)
            db.session.add(b)
            bassins.append(b)

        db.session.commit()
        # --- Inside init_database() function ---
        # After adding the bassins to the database:
        # --- Inside init_database() function ---
        # After adding the bassins to the database:
        db.session.commit()

        # Retrieve the number of bassins in the database (instead of hardcoding 3)
        bassins = Bassin.query.all()

        # Initialize PiscineStatus dynamically for each bassin
        for bassin in bassins:
            # Example: Setting the status to 10 for each bassin (you can change this as needed)
            status = PiscineStatus(bassin_id=bassin.id, status=10)  # Adjust the status value as needed
            db.session.add(status)

        # Commit to save the PiscineStatus entries
        db.session.commit()



        # --- Cours
        cours_data = [
        {
            "nom": "Aquagym",
            "description": "Venez vous dépenser dans ce cours d'aquagym, idéal pour le maintien de la forme !",
            "jour": "Lundi",
            "heure": time(18, 0)
        },
        {
            "nom": "J'apprends à nager",
            "description": "À tout âge, rejoignez-nous et apprenez l'aisance aquatique",
            "jour": "Mardi",
            "heure": time(12, 30)
        },
        {
            "nom": "Natation course",
            "description": "Développez votre vitesse et endurance",
            "jour": "Mercredi",
            "heure": time(14, 0)
        },
        {
            "nom": "Natation adulte",
            "description": "Faites perdurer le plaisir de la natation",
            "jour": "Jeudi",
            "heure": time(17, 30)
        },
        {
            "nom": "Réveil aquatique",
            "description": "Réveillez-vous de bon matin, à la fraîche",
            "jour": "Vendredi",
            "heure": time(6, 30)
        },
        {
            "nom": "Neaucture",
            "description": "Détendez-vous dans notre fosse au travers de l'apnée",
            "jour": "Vendredi",
            "heure": time(21, 15)
        }
        ]

        for c in cours_data:
            db.session.add(CoursPiscine(**c))

        # --- Piscine Status
        # Assuming PiscineStatus requires a `bassin_id` and `status` attribute
        for bassin in bassins:
            status = PiscineStatus(bassin_id=bassin.id, status=10)  # Adjust the status value as needed
            db.session.add(status)

        # --- Programmes de musculation (new from first code)
        programmes = [
            {"titre": "Force maximale", "description": "Développement de la force brute via des charges lourdes."},
            {"titre": "Prise de masse", "description": "Programme pour développer un volume musculaire massif."},
            {"titre": "Endurance musculaire", "description": "Série longue et répétitions pour renforcer l'endurance."},
        ]
        for prog in programmes:
            db.session.add(ProgrammeMusculation(**prog))

        # --- Équipements de musculation (new from first code)
        equipements = [
            {"nom": "Banc de musculation", "description": "Idéal pour le développé couché", "disponible": True},
            {"nom": "Haltères", "description": "Indispensables pour les exercices libres", "disponible": False},
            {"nom": "Barre olympique", "description": "Utilisée pour le soulevé de terre et squat", "disponible": True},
            {"nom": "Poulie vis-à-vis", "description": "Machine polyvalente pour les câbles", "disponible": True},
        ]
        for eq in equipements:
            db.session.add(EquipementMusculation(**eq))

        # Commit the users and other data to the database
        db.session.commit()

        print("Database initialized successfully!")
        
    except Exception as e:
        db.session.rollback()
        print(f"Error initializing database: {str(e)}")
        raise
