from flask import request, jsonify
import requests
from . import routes_bp
from apscheduler.schedulers.background import BackgroundScheduler
from database.connection import get_db_connection 

# Initialize the scheduler
scheduler = BackgroundScheduler()
scheduler.start()

def fetch_and_store_data():
    """Function to fetch data from the external API and store it in the database."""
    try:
        # Example email (replace with dynamic logic if needed)
        email = "ashleshat5@gmail.com"

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
            print("User not found")
            return

        user_id = user_result[0]

        # Execute the query
        cursor.execute(query, (
            user_id,  # Assuming email is the user_id
            water_usage,  # water_saved
            lights_consumption + fan_consumption + heater_consumption,  # power_saved
            waste_generated  # waste_reduced
        ))

        conn.commit()
        print("Data fetched and stored successfully")

    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")

    except requests.exceptions.ConnectionError as conn_err:
        print("Connection error occurred. Server might be down.")

    except requests.exceptions.Timeout as timeout_err:
        print("Request timed out. Try again later.")

    except requests.exceptions.RequestException as req_err:
        print(f"Request error occurred: {req_err}")

    except ValueError as val_err:
        print("Invalid JSON response from server")

    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")

    finally:
        # Close the database connection
        if 'conn' in locals():
            cursor.close()
            conn.close()

# Schedule the task to run every 15 seconds
scheduler.add_job(fetch_and_store_data, 'interval', seconds=15)

# Flask route for manual triggering (optional)
@routes_bp.route('/fetchServer', methods=['GET'])
def fetchAdd():
    try:
        # Get email parameter from the request
        email = request.args.get("email")

        # Check if email is provided
        if not email:
            return jsonify({"error": "Email parameter is missing"}), 400

        # Call the fetch_and_store_data function
        fetch_and_store_data()

        return jsonify({"status": "success", "message": "Data fetched and stored successfully"}), 200

    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500
