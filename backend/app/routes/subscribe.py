from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from ..models import UserSubscription, CoursFitness, CoursPiscine, ProgrammeMusculation
from .. import db

subscribe_bp = Blueprint('subscribe', __name__)

@subscribe_bp.route('/api/subscribe', methods=['POST'])
@login_required
def subscribe_to_course():
    try:
        # Get the JSON data from the request
        data = request.get_json()

        # Check if course_id and course_type are in the request body
        if 'course_id' not in data or 'course_type' not in data:
            return jsonify({'error': 'Missing course_id or course_type'}), 400
        
        course_id = data['course_id']
        course_type = data['course_type']

        # Validate the course type
        if course_type not in ['fitness', 'piscine', 'muscu']:
            return jsonify({'error': 'Invalid course type'}), 400
        
        
        user_id = current_user.id  # This replaces the hardcoded user_id

        # Create a new subscription entry
        subscription = UserSubscription(user_id=user_id, course_id=course_id, course_type=course_type)
        
        # Add subscription to the database
        db.session.add(subscription)
        db.session.commit()

        return jsonify({'message': f'Inscription réussie ! {current_user.id}'}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Erreur lors de l\'inscription'}), 500

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Erreur lors de l\'inscription'}), 500


@subscribe_bp.route('/api/courses/<type>/<int:id>', methods=['GET'])
def get_course(type, id):
    # Check if the course type is 'fitness'
    if type == 'fitness':
        course = CoursFitness.query.get(id)
        if not course:
            return jsonify({'error': 'Course not found'}), 404
        return jsonify({
            'type': 'fitness',
            'id': course.id,
            'details': {
                'activite': course.activite,
                'jour': course.jour,
                'heure': course.heure.strftime('%H:%M') if course.heure else None
            }
        })
    
    # Check if the course type is 'piscine'
    elif type == 'piscine':
        course = CoursPiscine.query.get(id)
        if not course:
            return jsonify({'error': 'Course not found'}), 404
        return jsonify({
            'type': 'piscine',
            'id': course.id,
            'details': {
                'nom': course.nom,
                'description': course.description,
                'jour': course.jour,
                'heure': course.heure.strftime('%H:%M') if course.heure else None
            }
        })
    
    # Check if the course type is 'muscu'
    elif type == 'muscu':
        course = ProgrammeMusculation.query.get(id)
        if not course:
            return jsonify({'error': 'Course not found'}), 404
        return jsonify({
            'type': 'muscu',
            'id': course.id,
            'details': {
                'titre': course.titre,
                'description': course.description
            }
        })
    
    # Handle invalid course type
    return jsonify({'error': 'Invalid course type'}), 400

@subscribe_bp.route('/api/delete-subscription', methods=['DELETE'])
@login_required
def delete_subscription():
    try:
        data = request.get_json()
        
        if 'course_id' not in data or 'course_type' not in data:
            return jsonify({'error': 'Missing course_id or course_type'}), 400
        
        # Find and delete the subscription
        subscription = UserSubscription.query.filter_by(
            user_id=current_user.id,
            course_id=data['course_id'],
            course_type=data['course_type']
        ).first()

        if not subscription:
            return jsonify({'error': 'Subscription not found'}), 404

        db.session.delete(subscription)
        db.session.commit()

        return jsonify({'message': 'Unsubscribed successfully'}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return jsonify({'error': 'Error unsubscribing from course'}), 500