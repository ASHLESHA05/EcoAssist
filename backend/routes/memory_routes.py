from flask import request, jsonify
from . import routes_bp  # Import the blueprint from __init__.py
from database.connection import get_db_connection  # Import database connection
import json

@routes_bp.route("/update-chat-memory", methods=["POST"])
def update_chat_memory():
    data = request.get_json()

    # Validate request body
    if not data or "req" not in data or "res" not in data or "userEmail" not in data:
        return jsonify({"error": "Missing required fields (req, res, userEmail)"}), 400

    user_email = data["userEmail"]
    req_text = data["req"]
    res_text = data["res"]

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        query = """
            INSERT INTO memory_requests (user_email, req, res) 
            VALUES (%s, %s, %s);
        """
        cursor.execute(query, (user_email, req_text, res_text))
        conn.commit()

        return jsonify({"message": "Chat memory updated successfully"}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

