from flask import request, jsonify
import requests
from . import routes_bp
from database.connection import get_db_connection  # Import the database connection

@routes_bp.route('/fetchServer', methods=['GET'])
def fetchAdd():
    try:
        # Get email parameter from the request
        email = request.args.get("email")
        
        # Check if email is provided
        if not email:
            return jsonify({"error": "Email parameter is missing"}), 400
        
        # Make the request to the external API
        response = requests.get(f'https://smart-application-test-server.vercel.app/api/saveData?email={email}')
        response.raise_for_status()  # This will raise an exception for HTTP errors
        
        # Parse the response data
        response_data = response.json()
        data = {
            "email": response_data.get("email"),
            "energy": response_data.get("energy"),
            "waste": response_data.get("waste"),
            "water": response_data.get("water")
        }
        
        # Extract relevant metrics
        energy_data = data.get("energy", {})
        lights_count = energy_data.get("lights", {}).get("count", 0)
        lights_consumption = energy_data.get("lights", {}).get("consumption", 0)
        fan_count = energy_data.get("fan", {}).get("count", 0)
        fan_consumption = energy_data.get("fan", {}).get("consumption", 0)
        heater_count = energy_data.get("heater", {}).get("count", 0)
        heater_consumption = energy_data.get("heater", {}).get("consumption", 0)
        waste_generated = data.get("waste", 0)
        water_usage = data.get("water", 0)
        
        # Store the data in the database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Insert or update the dashboard_metrics table
        query = """
            INSERT INTO dashboard_metrics (
                user_id, 
                water_saved, 
                power_saved, 
                waste_reduced
            )
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (user_id) DO UPDATE
            SET 
                water_saved = EXCLUDED.water_saved,
                power_saved = EXCLUDED.power_saved,
                waste_reduced = EXCLUDED.waste_reduced;
        """
        
        cursor.execute("SELECT user_id FROM users WHERE email = %s", (email,))
        user_result = cursor.fetchone()

        if not user_result:
            return jsonify({"error": "User not found"}), 404

        user_id = user_result[0]
        
        # Execute the query
        cursor.execute(query, (
            user_id,  # Assuming email is the user_id
            water_usage,  # water_saved
            lights_consumption + fan_consumption + heater_consumption,  # power_saved
            waste_generated  # waste_reduced
        ))
        
        conn.commit()
        
        # Return the data to the client
        return jsonify({
            "status": "success",
            "data": data,
            "inserted_metrics": {
                "water_saved": water_usage,
                "power_saved": lights_consumption + fan_consumption + heater_consumption,
                "waste_reduced": waste_generated
            }
        }), 200
        
    except requests.exceptions.HTTPError as http_err:
        # Handle HTTP errors (like 404, 500, etc.)
        return jsonify({"error": f"HTTP error occurred: {http_err}"}), 500
        
    except requests.exceptions.ConnectionError as conn_err:
        # Handle connection errors
        return jsonify({"error": "Connection error occurred. Server might be down."}), 503
        
    except requests.exceptions.Timeout as timeout_err:
        # Handle timeout errors
        return jsonify({"error": "Request timed out. Try again later."}), 504
        
    except requests.exceptions.RequestException as req_err:
        # Handle any other requests-related errors
        return jsonify({"error": f"Request error occurred: {req_err}"}), 500
        
    except ValueError as val_err:
        # Handle JSON decoding errors
        return jsonify({"error": "Invalid JSON response from server"}), 500
        
    except Exception as e:
        # Handle any other unexpected errors
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500
        
    finally:
        # Close the database connection
        if 'conn' in locals():
            cursor.close()
            conn.close()
            