from datetime import datetime
from flask import Blueprint, request, jsonify

# Define the Blueprint for pageMusculation
from flask_login import login_required
from app import db
import app
from app.models.PageFitness import Coach, CoursFitness, FitnessStatus
from app.models.PageMusculation import ProgrammeMusculation, EquipementMusculation  # Import ProgrammeMusculation and EquipementMusculation
from app.models.PagePiscine import CoursPiscine, PiscineStatus, Bassin
from datetime import time


admin_bp = Blueprint('admin', __name__)

# Fetch data for the admin page (coaches and courses)
@admin_bp.route('/api/admin/get-fitness-data', methods=['GET'])
@login_required
def get_fitness_data():
    try:
        # Fetch coaches and courses data
        coaches = Coach.query.all()
        courses = CoursFitness.query.all()

        # Format the data to send it to the frontend
        coaches_data = [{
            'id': coach.id,
            'nom': coach.nom,
            'prenom': coach.prenom,
            'description': coach.description
        } for coach in coaches]

        courses_data = [{
            'id': course.id,
            'activite': course.activite,
            'heure': course.heure.strftime("%H:%M"),
            'jour': course.jour,
        } for course in courses]

        return jsonify({
            'coachs': coaches_data,
            'cours': courses_data
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Update coaches and courses data (and stats) from frontend
@admin_bp.route('/api/admin/update-fitness', methods=['POST'])
def update_fitness_data():
    try:
        data = request.get_json()

        # Update coaches
        for coach in data.get('coachs', []):
            # Update each coach's details based on the provided ID
            existing_coach = Coach.query.get(coach['id'])
            if existing_coach:
                existing_coach.nom = coach['nom']
                existing_coach.prenom = coach['prenom']
                existing_coach.description = coach['description']
            else:
                # If the coach does not exist, create a new one
                db.session.add(Coach(
                    id=coach['id'],
                    nom=coach['nom'],
                    prenom=coach['prenom'],
                    description=coach['description']
                ))

        # Update courses
        for cour in data.get('cours', []):
            # Update each course's details based on the provided ID
            existing_course = CoursFitness.query.get(cour['id'])
            if existing_course:
                existing_course.activite = cour['activite']
                existing_course.jour = cour['jour']
                existing_course.heure = datetime.strptime(cour['heure'], "%H:%M").time()
            else:
                # If the course does not exist, create a new one
                db.session.add(CoursFitness(
                    id=cour['id'],
                    activite=cour['activite'],
                    jour=cour['jour'],
                    heure=datetime.strptime(cour['heure'], "%H:%M").time()
                ))

        # Update stats (FitnessStatus)
        stats = FitnessStatus.query.first()
        if not stats:
            stats = FitnessStatus()
            db.session.add(stats)
        stats.personnes = data.get('interval', 0)

        db.session.commit()  # Commit all changes to the database
        return jsonify({"message": "Fitness data updated successfully"}), 200

    except Exception as e:
        db.session.rollback()  # Rollback the transaction in case of an error
        app.logger.error(f"Error updating fitness data: {str(e)}")  # Log the error
        return jsonify({"error": str(e)}), 500


# Delete a coach by ID
@admin_bp.route('/api/admin/delete-coach/<int:coach_id>', methods=['DELETE'])
def delete_coach(coach_id):
    try:
        # Find the coach by ID
        coach = Coach.query.get(coach_id)
        
        if not coach:
            return jsonify({"error": "Coach not found"}), 404
        
        # Delete the coach
        db.session.delete(coach)
        db.session.commit()

        return jsonify({"message": "Coach deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()  # Rollback if there's an error
        return jsonify({"error": str(e)}), 500
    
@admin_bp.route('/api/admin/delete-course/<int:course_id>', methods=['DELETE'])
def delete_course(course_id):
    try:
        # Print the course_id to check if it's being passed correctly
        print(f"Deleting course with ID: {course_id}")
        
        # Find the course by ID
        course = CoursFitness.query.filter_by(id=course_id).first()

        
        if not course:
            return jsonify({"error": "Course not found"}), 404
        
        # Delete the course
        db.session.delete(course)
        db.session.commit()

        return jsonify({"message": "Course deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()  # Rollback if there's an error
        return jsonify({"error": str(e)}), 500



# Add a new coach
@admin_bp.route('/api/admin/add-coach', methods=['POST'])
def add_new_coach():
    try:
        # Get the data from the request body
        data = request.get_json()
        # Extract the coach's details
        nom = data.get('nom')
        prenom = data.get('prenom')
        description = data.get('description')
        coach_id = data.get('id')

        # Check if coach already exists by ID
        existing_coach = Coach.query.get(coach_id)
        if existing_coach:
            return jsonify({"error": "Coach with this ID already exists"}), 400
        
        # Create a new coach
        new_coach = Coach(
            id=coach_id,
            nom=nom,
            prenom=prenom,
            description=description
        )

        # Add the coach to the session and commit
        db.session.add(new_coach)
        db.session.commit()

        return jsonify({"message": "Coach added successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# Add a new course
@admin_bp.route('/api/admin/add-course', methods=['POST'])
def add_new_course():
    try:
        # Get the data from the request body
        data = request.get_json()
        # Extract the course's details
        activite = data.get('activite')
        heure = data.get('heure')
        jour = data.get('jour')
        course_id = data.get('id')

        # Check if course already exists by ID
        existing_course = CoursFitness.query.get(course_id)
        if existing_course:
            return jsonify({"error": "Course with this ID already exists"}), 400

        # Convert the heure to a time object
        heure = datetime.strptime(heure, "%H:%M").time()

        # Create a new course
        new_course = CoursFitness(
            id=course_id,
            activite=activite,
            jour=jour,
            heure=heure
        )

        # Add the course to the session and commit
        db.session.add(new_course)
        db.session.commit()

        return jsonify({"message": "Course added successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@admin_bp.route('/api/admin/update-programme', methods=['POST'])
def update_programme():
    data = request.get_json()

    try:
        # Loop through all programmes in the request and update them
        for prog_data in data['programmes']:
            programme = ProgrammeMusculation.query.get(prog_data['id'])
            if programme:
                programme.titre = prog_data['titre']
                programme.description = prog_data['description']
                db.session.commit()

        return jsonify({'message': 'Programmes updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@admin_bp.route('/api/admin/update-equipement', methods=['POST'])
def update_equipement():
    data = request.get_json()

    try:
        # Loop through all equipements in the request and update them
        for eq_data in data['equipements']:
            equipement = EquipementMusculation.query.get(eq_data['id'])
            if equipement:
                equipement.nom = eq_data['nom']
                equipement.description = eq_data['description']
                equipement.disponible = eq_data['disponible']
                db.session.commit()

        return jsonify({'message': 'Equipements updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@admin_bp.route('/api/admin/add-programme', methods=['POST'])
def add_programme():
    data = request.get_json()

    try:
        new_programme = ProgrammeMusculation(
            titre=data['titre'],
            description=data['description']
        )
        db.session.add(new_programme)
        db.session.commit()

        return jsonify({'message': 'Programme added successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@admin_bp.route('/api/admin/add-equipement', methods=['POST'])
def add_equipement():
    data = request.get_json()

    try:
        new_equipement = EquipementMusculation(
            nom=data['nom'],
            description=data['description'],
            disponible=data['disponible']
        )
        db.session.add(new_equipement)
        db.session.commit()

        return jsonify({'message': 'Equipement added successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


@admin_bp.route('/api/admin/delete-programme/<int:programme_id>', methods=['DELETE'])
def delete_programme(programme_id):
    try:
        programme = ProgrammeMusculation.query.get(programme_id)
        if programme:
            db.session.delete(programme)
            db.session.commit()
            return jsonify({'message': 'Programme deleted successfully'}), 200
        else:
            return jsonify({'error': 'Programme not found'}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@admin_bp.route('/api/admin/delete-equipement/<int:equipement_id>', methods=['DELETE'])
def delete_equipement(equipement_id):
    try:
        equipement = EquipementMusculation.query.get(equipement_id)
        if equipement:
            db.session.delete(equipement)
            db.session.commit()
            return jsonify({'message': 'Equipement deleted successfully'}), 200
        else:
            return jsonify({'error': 'Equipement not found'}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# Update multiple bassins
@admin_bp.route('/api/admin/update-bassins', methods=['POST'])
def update_bassins():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
    
    data = request.get_json()
    bassins = data.get('bassins', [])
    
    try:
        for bassin_data in bassins:
            bassin = Bassin.query.get(bassin_data['id'])
            if bassin:
                bassin.nom = bassin_data.get('nom', bassin.nom)
                bassin.description = bassin_data.get('description', bassin.description)
                bassin.longueur = bassin_data.get('longueur', bassin.longueur)
                bassin.profondeur = bassin_data.get('profondeur', bassin.profondeur)
                db.session.add(bassin)
        
        db.session.commit()
        return jsonify({"message": "Bassins updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Add new bassin
@admin_bp.route('/api/admin/add-bassin', methods=['POST'])
def add_bassin():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
    
    data = request.get_json()
    
    try:
        new_bassin = Bassin(
            nom=data.get('nom', 'Nouveau Bassin'),
            description=data.get('description', ''),
            longueur=data.get('longueur', 0),
            profondeur=data.get('profondeur', 0)
        )
        db.session.add(new_bassin)
        db.session.commit()
        
        # Create default status for the new bassin
        new_status = PiscineStatus(
            bassin_id=new_bassin.id,
            status=0
        )
        db.session.add(new_status)
        db.session.commit()
        
        return jsonify({
            "message": "Bassin added successfully",
            "id": new_bassin.id,
            "nom": new_bassin.nom
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Delete bassin
@admin_bp.route('/api/admin/delete-bassin/<int:id>', methods=['DELETE'])
def delete_bassin(id):
    try:
        bassin = Bassin.query.get(id)
        if not bassin:
            return jsonify({"error": "Bassin not found"}), 404
        
        # First delete related status
        PiscineStatus.query.filter_by(bassin_id=id).delete()
        # Then delete the bassin (no need to update courses since no relation exists)
        db.session.delete(bassin)
        db.session.commit()
        return jsonify({"message": "Bassin deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/api/admin/update-cours-piscine', methods=['POST'])
def update_cours_piscine():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
    
    data = request.get_json()
    if not data or 'cours' not in data:
        return jsonify({"error": "Missing 'cours' in request data"}), 400
    
    cours_list = data.get('cours', [])
    
    try:
        for cours_data in cours_list:
            if 'id' not in cours_data:
                return jsonify({"error": "Missing 'id' in cours data"}), 400
                
            cours = CoursPiscine.query.get(cours_data['id'])
            if not cours:
                return jsonify({"error": f"Cours with id {cours_data['id']} not found"}), 404
                
            # Update only the specified fields
            if 'nom' in cours_data:
                cours.nom = cours_data['nom']
            if 'description' in cours_data:
                cours.description = cours_data['description']
            if 'jour' in cours_data:
                cours.jour = cours_data['jour']
            
            # Handle time conversion
            if 'heure' in cours_data and cours_data['heure']:
                try:
                    if isinstance(cours_data['heure'], str):
                        heure_parts = list(map(int, cours_data['heure'].split(':')))
                        cours.heure = time(heure_parts[0], heure_parts[1])
                except Exception as e:
                    db.session.rollback()
                    return jsonify({
                        "error": f"Invalid time format for cours {cours.id}",
                        "details": str(e)
                    }), 400
            
            db.session.add(cours)
        
        db.session.commit()
        return jsonify({"message": "Cours updated successfully"}), 200
        
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error updating cours: {str(e)}")
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500

# Add new cours
@admin_bp.route('/api/admin/add-cours-piscine', methods=['POST'])
def add_cours_piscine():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
    
    data = request.get_json()
    
    required_fields = ['nom', 'jour']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    try:
        # Handle time conversion
        heure = None
        if 'heure' in data and data['heure']:
            if isinstance(data['heure'], str):
                heure_parts = list(map(int, data['heure'].split(':')))
                heure = time(heure_parts[0], heure_parts[1])
        
        new_cours = CoursPiscine(
            nom=data['nom'],
            description=data.get('description', ''),
            heure=heure,
            jour=data['jour']
        )
        db.session.add(new_cours)
        db.session.commit()
        return jsonify({
            "message": "Cours added successfully", 
            "id": new_cours.id,
            "nom": new_cours.nom
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Delete cours
@admin_bp.route('/api/admin/delete-cours-piscine/<int:id>', methods=['DELETE'])
def delete_cours_piscine(id):
    try:
        cours = CoursPiscine.query.get(id)
        if not cours:
            return jsonify({"error": "Cours not found"}), 404
        
        db.session.delete(cours)
        db.session.commit()
        return jsonify({"message": "Cours deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Update pool status
@admin_bp.route('/api/admin/update-pool-status', methods=['POST'])
def update_pool_status():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
    
    data = request.get_json()
    status_updates = data.get('nombreParBassin', {})
    
    try:
        # Get all bassins to map names to IDs
        bassins = {bassin.nom: bassin.id for bassin in Bassin.query.all()}
        
        for bassin_name, status in status_updates.items():
            bassin_id = bassins.get(bassin_name)
            if bassin_id:
                # Update or create status
                existing_status = PiscineStatus.query.filter_by(bassin_id=bassin_id).first()
                if existing_status:
                    existing_status.status = int(status) if status is not None else 0
                    db.session.add(existing_status)
                else:
                    new_status = PiscineStatus(bassin_id=bassin_id, status=int(status) if status is not None else 0)
                    db.session.add(new_status)
        
        db.session.commit()
        return jsonify({"message": "Pool status updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Get all bassins with their status
@admin_bp.route('/api/admin/get-bassins-status', methods=['GET'])
def get_bassins_status():
    try:
        bassins = Bassin.query.all()
        result = []
        
        for bassin in bassins:
            status = PiscineStatus.query.filter_by(bassin_id=bassin.id).first()
            result.append({
                "id": bassin.id,
                "nom": bassin.nom,
                "status": status.status if status else 0
            })
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500