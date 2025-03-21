from flask import Blueprint

# Create a Blueprint for routes
routes_bp = Blueprint("routes", __name__)

# Import all route files to register them
from .user_routes import *
from .notification_routes import *
from .dashboard_routes import *
from .memory_routes import *