from flask import request, jsonify
from . import routes_bp  # Import the blueprint from __init__.py
from database.connection import get_db_connection  # Import database connection
import json
from datetime import datetime


def calculate_emission(transport, home, food, shopping):
    """
    Placeholder function for calculating carbon emissions.
    Replace with actual logic for emission computation.
    """
    return {
        "transport": 120 if transport else 0,
        "home": 80 if home else 0,
        "food": 60 if food else 0,
        "shopping": 40 if shopping else 0
    }


@routes_bp.route("/calculate-carbon-update", methods=["GET"])
def get_carbon_emission():
    email = request.args.get("email")
    params_data = request.args.get("paramsData")

    if not email or not params_data:
        return jsonify({"error": "Missing required parameters"}), 400

    try:
        # The paramsData is passed as a string, so we need to parse it as JSON
        params_data = json.loads(params_data)

        # Extract individual category data
        transport_data = params_data.get("transport", {})
        home_data = params_data.get("home", {})
        food_data = params_data.get("food", {})
        shopping_data = params_data.get("shopping", {})

        # Compute carbon emission
        emission_data = calculate_emission(transport_data, home_data, food_data, shopping_data)

        # Database insertion
        conn = get_db_connection()
        cursor = conn.cursor()

        # Insert into carbon_footprint table
        query = """
            INSERT INTO carbon_footprint (user_email, transport_data, home_data, food_data, shopping_data, emission_data)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (user_email) DO UPDATE
            SET transport_data = EXCLUDED.transport_data,
                home_data = EXCLUDED.home_data,
                food_data = EXCLUDED.food_data,
                shopping_data = EXCLUDED.shopping_data,
                emission_data = EXCLUDED.emission_data;
        """
        cursor.execute(
            query, 
            (email, json.dumps(transport_data), json.dumps(home_data), json.dumps(food_data), 
             json.dumps(shopping_data), json.dumps(emission_data))
        )
        conn.commit()

        return jsonify({"emissionData": emission_data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@routes_bp.route("/get-calcData", methods=["GET"])
def get_calc_data():
    email = request.args.get("email")

    if not email:
        return jsonify({"error": "Email parameter is required"}), 400

    try:
        # Database connection
        conn = get_db_connection()
        cursor = conn.cursor()

        # Query to retrieve the carbon footprint data for the user
        query = """
            SELECT transport_data, home_data, food_data, shopping_data, emission_data
            FROM carbon_footprint
            WHERE user_email = %s;
        """
        cursor.execute(query, (email,))
        result = cursor.fetchone()

        if result:
            # Prepare response in the desired structure
            transport_data = result[0]
            home_data = result[1]
            food_data = result[2]
            shopping_data = result[3]
            emission_data = result[4]

            # Format the data for response
            response = {
                "transportData": transport_data,
                "homeData": home_data,
                "foodData": food_data,
                "shoppingData": shopping_data,
                "emissionData": emission_data,
            }

            return jsonify(response), 200
        else:
            return jsonify({"error": "User data not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
