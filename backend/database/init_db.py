import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import db
from datetime import time
from app.models.PageFitness import Coach, CoursFitness, FitnessStatus
from app.models.user import User
from app.models.PageMusculation import ProgrammeMusculation, EquipementMusculation
from app.models.PagePiscine import Bassin, CoursPiscine, PiscineStatus
from app.models import Abonnement

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
        db.session.query(Abonnement).delete()
        db.session.query(Bassin).delete()
        db.session.query(CoursPiscine).delete()
        db.session.query(PiscineStatus).delete()

        # --- Abonnements
        abonnements = [
            {"id": 1, "type": "VIP"},
            {"id": 2, "type": "Normal"}
        ]

        for ab in abonnements:
            db.session.add(Abonnement(**ab))
        db.session.commit()

        # --- Coaches
        coaches = [
            {"id": 1, "nom": "Dupont", "prenom": "Jean", "description": "Expert en musculation et nutrition. Jean vous aidera à construire votre force et à optimiser votre alimentation."},
            {"id": 2, "nom": "Curie", "prenom": "Marie", "description": "Spécialiste en yoga et bien-être. Marie vous guidera vers un équilibre parfait entre corps et esprit."},
            {"id": 3, "nom": "Martin", "prenom": "Paul", "description": "Coach cardio et endurance. Avec Paul, améliorez votre condition physique et repoussez vos limites."},
            {"id": 4, "nom": "Bernard", "prenom": "Emma", "description": "Instructrice de Pilates et stretching. Emma vous aidera à renforcer votre corps tout en améliorant votre souplesse."},
        ]

        for coach in coaches:
            db.session.add(Coach(**coach))
        db.session.commit()

        # --- Fitness Courses
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

        # --- Fitness status
        db.session.add(FitnessStatus(personnes=20))

        # --- Users
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
                "avatar_id": 1,
                "avatar_url": "/assets/images/avatar1.png",
                "mes_records": "",
                "abonnement_id": 1 
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
                "avatar_url": "/assets/images/avatar2.png",
                "mes_records": "",
                "abonnement_id": 1  
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
                "avatar_url": "/assets/images/avatar3.png",
                "mes_records": "",
                "abonnement_id": 2
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
                avatar_url=user_data["avatar_url"],
                mes_records=user_data["mes_records"],
                abonnement_id=user_data["abonnement_id"]
            )
            user.set_password(user_data["password"])
            db.session.add(user)

        # --- Bassins
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

        # --- Piscine Status
        for bassin in bassins:
            status = PiscineStatus(bassin_id=bassin.id, status=10)
            db.session.add(status)

        # --- Cours Piscine
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

        # --- Programmes de musculation
        programmes = [
            {"titre": "Force maximale", "description": "Développement de la force brute via des charges lourdes."},
            {"titre": "Prise de masse", "description": "Programme pour développer un volume musculaire massif."},
            {"titre": "Endurance musculaire", "description": "Série longue et répétitions pour renforcer l'endurance."},
        ]
        for prog in programmes:
            db.session.add(ProgrammeMusculation(**prog))

        # --- Équipements de musculation
        equipements = [
            {"nom": "Banc de musculation", "description": "Idéal pour le développé couché", "disponible": True},
            {"nom": "Haltères", "description": "Indispensables pour les exercices libres", "disponible": False},
            {"nom": "Barre olympique", "description": "Utilisée pour le soulevé de terre et squat", "disponible": True},
            {"nom": "Poulie vis-à-vis", "description": "Machine polyvalente pour les câbles", "disponible": True},
        ]
        for eq in equipements:
            db.session.add(EquipementMusculation(**eq))

        # Commit all changes
        db.session.commit()

        print("Database initialized successfully!")
        
    except Exception as e:
        db.session.rollback()
        print(f"Error initializing database: {str(e)}")
        raise