from flask import request, jsonify
from . import routes_bp  # Import the blueprint from __init__.py
from database.connection import get_db_connection  # Import database connection
import json
import requests
import pandas as pd
import joblib

model = joblib.load('carbon_calculator.pkl')


def fetch_user_data(email):
    """Fetch additional data from the external API."""
    url = f'https://smart-application-test-server.vercel.app/api/saveData?email={email}'
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        return {
            "water_usage": data.get("water", 0),
            "light": data.get("energy", {}).get("lights", {}).get("count", 0),
            "light_consumption": data.get("energy", {}).get("lights", {}).get("consumption", 0),
            "fan": data.get("energy", {}).get("fan", {}).get("count", 0),
            "fan_consumption": data.get("energy", {}).get("fan", {}).get("consumption", 0),
            "heater": data.get("energy", {}).get("heater", {}).get("count", 0),
            "heater_consumption": data.get("energy", {}).get("heater", {}).get("consumption", 0),
            "waste_generated": data.get("waste", 0)
        }
    else:
        print("Error fetching data:", response.status_code)
        return {}

def calculate_emission(email, transport, home, food, shopping):
    """Calculate separate carbon footprints for transport, home, food, and shopping."""
    
    # Fetch additional user data (electricity, waste, water usage)
    additional_data = fetch_user_data(email)

    # Convert string numbers to proper types
    def safe_int(value, default=0):
        try:
            return int(value)
        except (ValueError, TypeError):
            return default

    # Prepare data for each category separately
    categories = {
        "transport": pd.DataFrame({
            'mode_of_transportation': [transport.get('transportationMode', 'car')],
            'daily_commute_distance': [safe_int(transport.get('commuteDistance'), 10)],
            'flights_per_month': [safe_int(transport.get('flightsCount'), 0)],
        }),

        "home": pd.DataFrame({
            'home_energy_source': [home.get('energySource', 'grid')],
            'monthly_electricity_usage': [safe_int(home.get('electricityUsage'), 100)],
            'home_size': [home.get('homeSize', 'medium')],
            'heating_type': [home.get('heatingType', 'electric')],
            'water_usage': [safe_int(additional_data.get('water_usage'), 100)],
            'light': [safe_int(additional_data.get('light'), 5)],
            'light_consumption': [safe_int(additional_data.get('light_consumption'), 50)],
            'fan': [safe_int(additional_data.get('fan'), 2)],
            'fan_consumption': [safe_int(additional_data.get('fan_consumption'), 75)],
            'heater': [safe_int(additional_data.get('heater'), 1)],
            'heater_consumption': [safe_int(additional_data.get('heater_consumption'), 1000)],
        }),

        "food": pd.DataFrame({
            'diet': [food.get('dietType', 'mixed')],
            'food_waste': [food.get('foodWaste', 'medium')],
            'organic_food_consumption': [food.get('OrganicFood', 'some')],
            'waste_generated': [safe_int(additional_data.get('waste_generated'), 10)]
        }),

        "shopping": pd.DataFrame({
            'shopping_frequency': [shopping.get('shoppingType', 'moderate')],
            'recycling_habit': [shopping.get('RecyclingHabbits', 'most')],
            'fast_fashion_vs_sustainable': [shopping.get('fashionVsustainable', 'mixed')],
        })
    }

    # Predict emissions for each category
    emissions = {}
    for category, data in categories.items():
        try:
            emissions[category] = round(model.predict(data)[0], 2)
        except Exception as e:
            print(f"Error predicting {category} emissions: {e}")
            emissions[category] = None

    # Return separate emissions
    return emissions

    
# def calculate_emission(email, transport, home, food, shopping):
#     """
#     Placeholder function for calculating carbon emissions.
#     Replace with actual logic for emission computation.
#     """
#     return {
#         "transport": 120 if transport else 0,
#         "home": 80 if home else 0,
#         "food": 60 if food else 0,
#         "shopping": 40 if shopping else 0
#     }


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
        emission_data = calculate_emission(email, transport_data, home_data, food_data, shopping_data)

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


@routes_bp.route("/calculate-carbon", methods=["GET"])
def calculate_carbon_emission():
    email = request.args.get("email")
    params_data = request.args.get("paramsData")

    try:
        # The paramsData is passed as a string, so we need to parse it as JSON
        params_data = json.loads(params_data)

        # Extract individual category data
        transport_data = params_data.get("transport", {})
        home_data = params_data.get("home", {})
        food_data = params_data.get("food", {})
        shopping_data = params_data.get("shopping", {})

        # Compute carbon emission
        emission_data = calculate_emission(email, transport_data, home_data, food_data, shopping_data)

        return jsonify({"emissionData": emission_data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
        

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
