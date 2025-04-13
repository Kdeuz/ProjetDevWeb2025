# routes/contact.py
from flask import Blueprint, request, jsonify
from ..models.Contact import ContactMessage
from .. import db

contact_bp = Blueprint('contact', __name__)

@contact_bp.route('/api/contact', methods=['POST'])
def post_contact_message():
    data = request.get_json()
    
    nom = data.get('name')
    email = data.get('email')
    message = data.get('message')

    if not nom or not email or not message:
        return jsonify({'success': False, 'error': 'Tous les champs sont requis'}), 400

    try:
        new_msg = ContactMessage(nom=nom, email=email, message=message, is_vip_message=False)
        db.session.add(new_msg)
        db.session.commit()
        return jsonify({'success': True}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500
    
@contact_bp.route('/api/contact/vip', methods=['POST'])
def post_contact_message_vip():
    data = request.get_json()
    
    nom = data.get('name')
    email = data.get('email')
    message = data.get('message')

    if not nom or not email or not message:
        return jsonify({'success': False, 'error': 'Tous les champs sont requis'}), 400

    try:
        new_msg = ContactMessage(nom=nom, email=email, message=message, is_vip_message=True)
        db.session.add(new_msg)
        db.session.commit()
        return jsonify({'success': True}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500