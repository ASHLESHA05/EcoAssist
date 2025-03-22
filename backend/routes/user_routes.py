from flask import request, jsonify
from . import routes_bp  # Import the blueprint from __init__.py
from database.connection import get_db_connection  # Import database connection
import json


@routes_bp.route("/isNewUser", methods=["GET"])
def is_new_user():
    # Extract the email from the request parameters
    email = request.args.get("email")

    # Validate if the email is provided
    if not email:
        return jsonify({"error": "Email parameter is required"}), 400

    # Get the database connection
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Query to check if the email exists in the users table
        cursor.execute("SELECT email FROM users WHERE email = %s", (email,))
        result = cursor.fetchone()

        if result:
            # If the email exists, the user is not new
            return jsonify({"value": False}), 200
        else:
            # If the email does not exist, the user is new
            return jsonify({"value": True}), 200

    except Exception as e:
        # If an error occurs, return an error message
        return jsonify({"error": str(e)}), 500
    finally:
        # Close the cursor and connection
        cursor.close()
        conn.close()


@routes_bp.route("/userLogin", methods=["POST"])
def user_login():
    # Extract the user data from the request body
    data = request.get_json()

    # Check if all required fields are present
    if not data or "name" not in data or "email" not in data or "Location" not in data:
        return jsonify({"error": "Missing required fields"}), 400

    name = data["name"]
    email = data["email"]
    location = data["Location"]

    # Get the database connection
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Check if the user already exists in the database
        cursor.execute("SELECT email FROM users WHERE email = %s", (email,))
        existing_user = cursor.fetchone()

        if existing_user:
            # If the user exists, return a message
            return jsonify({"message": "User already exists"}), 200
        else:
            # If the user does not exist, insert into the database
            cursor.execute(
                "INSERT INTO users (name, email, location) VALUES (%s, %s, %s)",
                (name, email, location),
            )
            conn.commit()
            return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        # If an error occurs, return an error message
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        # Close the cursor and connection
        cursor.close()
        conn.close()


@routes_bp.route("/get-userDetails", methods=["GET"])
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
                "Location": user[3],
                "Level": user[4],
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


@routes_bp.route("/update-user", methods=["PUT"])
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


@routes_bp.route("/update-profile-visibility", methods=["PUT"])
def update_profile_visibility():
    data = request.json
    email = data.get("email")  # Identify user by email
    profile_visibility = data.get(
        "profileVisibility"
    )  # New visibility state (True/False)

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


@routes_bp.route("/delete-user", methods=["DELETE"])
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


@routes_bp.route("/savePlan", methods=["PUT"])
def save_plan():
    # Extract the request data
    data = request.get_json()

    # Check if necessary parameters are present
    if (
        not data
        or "email" not in data
        or "title" not in data
        or "description" not in data
    ):
        return jsonify({"error": "Missing required fields"}), 400

    email = data["email"]
    title = data["title"]
    description = data["description"]

    # Get the database connection
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Check if a plan already exists for this user
        cursor.execute("SELECT email FROM user_plan WHERE email = %s", (email,))
        existing_plan = cursor.fetchone()

        if existing_plan:
            # If a plan exists, update it
            cursor.execute(
                """
                UPDATE user_plan 
                SET title = %s, description = %s, created_at = NOW()
                WHERE email = %s
            """,
                (title, description, email),
            )
            conn.commit()
            return jsonify({"message": "Plan updated successfully"}), 200
        else:
            # If no plan exists, insert a new one
            cursor.execute(
                """
                INSERT INTO user_plan (email, title, description)
                VALUES (%s, %s, %s)
            """,
                (email, title, description),
            )
            conn.commit()
            return jsonify({"message": "Plan created successfully"}), 201

    except Exception as e:
        # If an error occurs, return a message with the error
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        # Close the cursor and connection
        cursor.close()
        conn.close()


@routes_bp.route("/getMyPlan", methods=["GET"])
def get_my_plan():
    # Extract the email from the request parameters
    email = request.args.get("email")

    # Validate if the email is provided
    if not email:
        return jsonify({"error": "Email parameter is required"}), 400

    # Get the database connection
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Query to fetch the user's plan details from the user_plan table
        cursor.execute(
            "SELECT title, description FROM user_plan WHERE email = %s", (email,)
        )
        result = cursor.fetchone()

        if result:
            # If plan is found, return the plan details
            return jsonify({"title": result[0], "description": result[1]}), 200
        else:
            # If no plan is found for the user
            return jsonify({"message": "No plan found for this user"}), 404

    except Exception as e:
        # If an error occurs, return an error message
        return jsonify({"error": str(e)}), 500
    finally:
        # Close the cursor and connection
        cursor.close()
        conn.close()


@routes_bp.route("/clearPlan", methods=["DELETE"])
def clear_plan():
    # Extract the request parameters
    email = request.args.get("email")

    # Check if email is provided
    if not email:
        return jsonify({"error": "Email parameter is required"}), 400

    # Get the database connection
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Check if a plan exists for the provided email
        cursor.execute("SELECT email FROM user_plan WHERE email = %s", (email,))
        existing_plan = cursor.fetchone()

        if existing_plan:
            # If a plan exists, delete it
            cursor.execute("DELETE FROM user_plan WHERE email = %s", (email,))
            conn.commit()
            return jsonify({"message": "Plan cleared successfully"}), 200
        else:
            # If no plan exists for the user
            return jsonify({"message": "No plan found for this user"}), 404

    except Exception as e:
        # If an error occurs, return an error message
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        # Close the cursor and connection
        cursor.close()
        conn.close()


@routes_bp.route("/leaderboard", methods=["GET"])
def get_leaderboard():
    # Get email from request params
    email = request.args.get("email")
    
    print("email: ", email)

    if not email:
        return jsonify({"error": "Email parameter is required"}), 400

    # Get database connection
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Fetch user_id from email
        cursor.execute("SELECT user_id FROM users WHERE email = %s", (email,))
        user_result = cursor.fetchone()

        if not user_result:
            return jsonify({"error": "User not found"}), 404


        # Query to get friends' leaderboard data (name, score, badges)
        query = """
        SELECT 
            u2.name AS friend_name, 
            e.score AS ecoscore, 
            json_agg(b.name) AS badges
        FROM users u
        JOIN connections c ON u.user_id = c.user_id
        JOIN users u2 ON c.friend_id = u2.user_id
        LEFT JOIN ecoscoredata e ON u2.user_id = e.user_id
        LEFT JOIN user_badges ub ON u2.user_id = ub.user_id
        LEFT JOIN badges b ON ub.badge_id = b.badge_id
        WHERE u.email = %s
        GROUP BY u2.name, e.score;
        """

        cursor.execute(query, (email,))
        leaderboard = cursor.fetchall()

        # Formatting response
        leaderboard_data = [
            {"name": row[0], "score": row[1], "badges": row[2]} for row in leaderboard
        ]
        
        print(leaderboard_data)

        return jsonify(leaderboard_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()


@routes_bp.route("/search-friends", methods=["GET"])
def search_friends():
    # Get email and search query from request params
    email = request.args.get("email")
    search_query = request.args.get("query")

    if not email or not search_query:
        return jsonify({"error": "Both email and query parameters are required"}), 400

    # Get database connection
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Fetch user_id from email
        cursor.execute("SELECT user_id FROM users WHERE email = %s", (email,))
        user_result = cursor.fetchone()

        if not user_result:
            return jsonify({"error": "User not found"}), 404

        user_id = user_result[0]
        like_pattern = f"%{search_query}%"  # Use LIKE for partial match

        # Query to search users by name or email and check if they are friends
        query = """
        SELECT 
            u.name, 
            u.email,
            EXISTS (
                SELECT 1 FROM connections c 
                WHERE (c.user_id = %s AND c.friend_id = u.user_id) 
                   OR (c.friend_id = %s AND c.user_id = u.user_id)
            ) AS is_friend
        FROM users u
        WHERE (u.name ILIKE %s OR u.email ILIKE %s)
          AND u.email != %s
        ORDER BY is_friend DESC, u.name ASC;
        """

        cursor.execute(query, (user_id, user_id, like_pattern, like_pattern, email))
        results = cursor.fetchall()

        # Formatting response
        search_results = [
            {"name": row[0], "email": row[1], "isFriend": row[2]} for row in results
        ]

        return jsonify(search_results), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()


@routes_bp.route("/add-friend", methods=["POST"])
def add_friend():
    data = request.get_json()
    email = data.get("email")
    friend_email = data.get("friendEmail")

    if not email or not friend_email:
        return jsonify({"error": "Both email and friendEmail are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Get user_id of the requester
        cursor.execute("SELECT user_id FROM users WHERE email = %s", (email,))
        user_result = cursor.fetchone()

        # Get user_id of the friend
        cursor.execute("SELECT user_id FROM users WHERE email = %s", (friend_email,))
        friend_result = cursor.fetchone()

        if not user_result or not friend_result:
            return jsonify({"error": "One or both users not found"}), 404

        user_id = user_result[0]
        friend_id = friend_result[0]

        # Check if the friendship already exists
        cursor.execute(
            """
            SELECT 1 FROM connections 
            WHERE (user_id = %s AND friend_id = %s) 
               OR (user_id = %s AND friend_id = %s)
        """,
            (user_id, friend_id, friend_id, user_id),
        )

        if cursor.fetchone():
            return jsonify({"message": "Already friends"}), 200

        # Insert friendship in both directions (ensuring unique constraint)
        cursor.execute(
            "INSERT INTO connections (user_id, friend_id) VALUES (%s, %s)",
            (user_id, friend_id),
        )
        cursor.execute(
            "INSERT INTO connections (user_id, friend_id) VALUES (%s, %s)",
            (friend_id, user_id),
        )

        conn.commit()
        return jsonify({"message": "Friend added successfully"}), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

@routes_bp.route("/check-subscription", methods=["GET"])
def check_subscription():
    email = request.args.get("email")
    if not email:
        return jsonify({"error": "Email parameter is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Check subscription status
        cursor.execute("SELECT is_subscribed FROM users WHERE email = %s", (email,))
        result = cursor.fetchone()
        print(result)
        if not result:
            return jsonify({"error": "User not found"}), 404

        is_subscribed = result[0]  # Extract boolean value

        return jsonify({"isSubscribed": is_subscribed}), 200

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()
        
@routes_bp.route("/subscribe", methods=["POST"])
def subscribe():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Check if the user exists
        cursor.execute("SELECT email FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "User not found"}), 404

        # Update the isSubscribed field to True
        cursor.execute("UPDATE users SET is_subscribed = TRUE WHERE email = %s", (email,))
        conn.commit()

        return jsonify({"message": "Subscription successful", "is_subscribed": True}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()