from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app import db

admin_bp = Blueprint('admin', __name__)

