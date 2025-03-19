from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import os
import json
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Database Configuration
DATABASE_URL = os.getenv("DATABASE_URL")


# Function to get a database connection
def get_db_connection():
    conn = psycopg2.connect(DATABASE_URL)
    return conn


# Routes
@app.route("/")
def home():
    return jsonify({"message": "Welcome to the Carbon Footprint API"})


@app.route("/get-userDetails", methods=["GET"])
def get_user_details():
    email = request.args.get("email")
    if not email:
        return jsonify({"error": "Email parameter is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "SELECT name, email, created_at, location, level, level_progress, is_public FROM users WHERE email = %s",
            (email,),
        )
        user = cursor.fetchone()

        if user:
            user_data = {
                "name": user[0],
                "email": user[1],
                "joinedDate": user[2].isoformat() if user[2] else None,
                "location": user[3],
                "level": user[4],
                "levelProgress": user[5],
                "profileVisibility": user[6],
            }
            return jsonify(user_data), 200
        else:
            return jsonify({"message": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@app.route("/get-notificationSettings", methods=["GET"])
def get_notification_settings():
    email = request.args.get("email")
    if not email:
        return jsonify({"error": "Email parameter is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT preferences FROM users WHERE email = %s", (email,))
        result = cursor.fetchone()

        if result and result[0]:
            preferences = json.loads(result[0])
            notification_settings = {
                "dailyTips": preferences.get("dailyTips", True),
                "achievementAlert": preferences.get("achievementAlert", True),
                "friendActivity": preferences.get("friendActivity", True),
            }
            return jsonify(notification_settings), 200
        else:
            return jsonify({"message": "User not found or preferences missing"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@app.route("/update-notifications", methods=["PUT"])
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
        SET preferences = jsonb_set(
            COALESCE(preferences, '{}'::jsonb),
            %s, %s::jsonb, true
        )
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


@app.route("/update-user", methods=["PUT"])
def update_user():
    data = request.json
    email = data.get("email")  # Identify user by email
    user_data = data.get("userData")

    if not email or not user_data:
        return jsonify({"error": "Missing required fields"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Construct dynamic SQL query based on provided fields
        update_fields = []
        values = []

        if "name" in user_data:
            update_fields.append("name = %s")
            values.append(user_data["name"])
        if "email" in user_data:
            update_fields.append("email = %s")
            values.append(user_data["email"])
        if "location" in user_data:
            update_fields.append("location = %s")
            values.append(user_data["location"])
        if "level" in user_data:
            update_fields.append("level = %s")
            values.append(user_data["level"])
        if "levelProgress" in user_data:
            update_fields.append("level_progress = %s")
            values.append(user_data["levelProgress"])
        if "profileVisibility" in user_data:
            update_fields.append("is_public = %s")
            values.append(user_data["profileVisibility"])

        # Ensure at least one field is being updated
        if not update_fields:
            return jsonify({"error": "No valid fields provided for update"}), 400

        # Finalize query
        values.append(email)
        query = f"UPDATE users SET {', '.join(update_fields)} WHERE email = %s"

        cursor.execute(query, values)
        conn.commit()

        return jsonify({"message": "User updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@app.route("/update-profile-visibility", methods=["PUT"])
def update_profile_visibility():
    data = request.json
    email = data.get("email")  # Identify user by email
    profile_visibility = data.get("profileVisibility")  # New visibility state (True/False)

    if not email or profile_visibility is None:
        return jsonify({"error": "Missing required fields"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Update profile visibility in the database
        query = "UPDATE users SET is_public = %s WHERE email = %s"
        cursor.execute(query, (profile_visibility, email))
        conn.commit()

        return jsonify({"message": "Profile visibility updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route("/delete-user", methods=["DELETE"])
def delete_user():
    data = request.json
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email parameter is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Delete the user from the database
        query = "DELETE FROM users WHERE email = %s"
        cursor.execute(query, (email,))
        conn.commit()

        # Check if the user was deleted
        if cursor.rowcount > 0:
            return jsonify({"message": "User deleted successfully"}), 200
        else:
            return jsonify({"message": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()



if __name__ == "__main__":
    app.run(debug=True, port=8080)
