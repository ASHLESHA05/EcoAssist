from flask import request, jsonify
from . import routes_bp  # Import the blueprint from __init__.py
from database.connection import get_db_connection  # Import database connection
import json

@routes_bp.route("/get-notificationSettings", methods=["GET"])
def get_notification_settings():
    email = request.args.get("email")
    print(email)
    if not email:
        return jsonify({"error": "Email parameter is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT preferences FROM users WHERE email = %s", (email,))
        result = cursor.fetchone()
        if result and result[0]:
            preferences = result[0]
            notification_settings = {
                "dailyTips": preferences.get("dailyTips", True),
                "achievementAlert": preferences.get("achievementAlert", True),
                "friendActivity": preferences.get("friendActivity", True),
            }
            return jsonify(notification_settings), 200
        else:
            return jsonify({"message": "User not found or preferences missing"}), 404
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@routes_bp.route("/update-notifications", methods=["PUT"])
def update_notifications():
    data = request.json
    key = data.get("key")  # "dailyTips", "achievementAlert", or "friendActivity"
    value = data.get("value")  # Boolean (True/False)
    email = data.get("email")

    if not key or value is None or not email:
        return jsonify({"error": "Missing required fields"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Update preferences JSONB column
        query = """
        UPDATE users 
        SET preferences = jsonb_set(preferences, %s, %s::jsonb, true)
        WHERE email = %s;
        """
        cursor.execute(query, [f"{{{key}}}", json.dumps(value), email])
        conn.commit()

        return (
            jsonify({"message": f"Notification setting '{key}' updated successfully"}),
            200,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
