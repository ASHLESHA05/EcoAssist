from flask import Flask
from flask_cors import CORS
from routes import routes_bp  # Import the blueprint

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Register blueprint
app.register_blueprint(routes_bp)

if __name__ == "__main__":
    app.run(debug=True, port=8080)
