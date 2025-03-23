from flask import request, jsonify
from . import routes_bp  # Import the blueprint from __init__.py
from database.connection import get_db_connection  # Import database connection
import json
import requests
import pandas as pd
import joblib
import numpy as np

model = joblib.load(
    r"D:\Terrathon\backend\routes\carbon_calculator.pkl"
)

def fetch_user_data(email):
    """Fetch additional data from an external API."""
    url = f"https://smart-application-test-server.vercel.app/api/saveData?email={email}"
    try:
        response = requests.get(url, timeout=10)  # Add a timeout to avoid hanging
        if response.status_code == 200:
            data = response.json()
            return {
                "water_usage": data.get("water", 0),
                "light": data.get("energy", {}).get("lights", {}).get("count", 0),
                "light_consumption": data.get("energy", {})
                .get("lights", {})
                .get("consumption", 0),
                "fan": data.get("energy", {}).get("fan", {}).get("count", 0),
                "fan_consumption": data.get("energy", {})
                .get("fan", {})
                .get("consumption", 0),
                "heater": data.get("energy", {}).get("heater", {}).get("count", 0),
                "heater_consumption": data.get("energy", {})
                .get("heater", {})
                .get("consumption", 0),
                "waste_generated": data.get("waste", 0),
            }
        else:
            print(f"Error fetching data: {response.status_code}")
            return {}  # Return an empty dictionary if the API fails
    except Exception as e:
        print(f"Error fetching data: {e}")
        return {}  # Return an empty dictionary if there's an exception
    

def calculate_emission(email, transport, home, food, shopping):
    model = joblib.load(r"D:\Projects\Carbon_tracker\backend\routes\carbon_calculator.pkl")
    emissions = {}
    all_columns = [
        "mode_of_transportation",
        "daily_commute_distance",
        "flights_per_month",
        "home_energy_source",
        "monthly_electricity_usage",
        "home_size",
        "heating_type",
        "water_usage",
        "light",
        "light_consumption",
        "fan",
        "fan_consumption",
        "heater",
        "heater_consumption",
        "diet",
        "food_waste",
        "organic_food_consumption",
        "waste_generated",
        "shopping_frequency",
        "recycling_habit",
        "fast_fashion_vs_sustainable",
    ]

    # Initialize all columns with default values (0 or "")
    default_data = {col: 0 if isinstance(col, str) else "" for col in all_columns}

    # Categories data
    categories = {
        "transport": {
            "mode_of_transportation": transport.get("transportationMode", "car"),
            "daily_commute_distance": safe_float(transport.get("commuteDistance"), 10.0),
            "flights_per_month": safe_int(transport.get("flightsCount"), 0),
        },
        "home": {
            "home_energy_source": home.get("energySource", "grid"),
            "monthly_electricity_usage": safe_float(home.get("electricityUsage"), 100.0),
            "home_size": home.get("homeSize", "medium"),
            "heating_type": home.get("heatingType", "electric"),
            "water_usage": safe_float(additional_data.get("water_usage"), 100.0),
            "light": safe_int(additional_data.get("light"), 5),
            "light_consumption": safe_float(additional_data.get("light_consumption"), 50.0),
            "fan": safe_int(additional_data.get("fan"), 2),
            "fan_consumption": safe_float(additional_data.get("fan_consumption"), 75.0),
            "heater": safe_int(additional_data.get("heater"), 1),
            "heater_consumption": safe_float(additional_data.get("heater_consumption"), 1000.0),
        },
        "food": {
            "diet": food.get("dietType", "mixed"),
            "food_waste": food.get("foodWaste", "medium"),
            "organic_food_consumption": food.get("OrganicFood", "some"),
            "waste_generated": safe_float(additional_data.get("waste_generated"), 10.0),
        },
        "shopping": {
            "shopping_frequency": shopping.get("shoppingType", "moderate"),
            "recycling_habit": shopping.get("RecyclingHabbits", "most"),
            "fast_fashion_vs_sustainable": shopping.get("fashionVsustainable", "mixed"),
        },
    }

    emissions = {}

    # Iterate over each category
    for category, data in categories.items():
        category_data = default_values.copy()
        category_data.update(data)
        category_df = pd.DataFrame([category_data])

        # Predict emissions using the model
        try:
            emissions[category] = round(model.predict(category_df)[0], 2)
        except Exception as e:
            print(f"Error predicting {category} emissions: {e}")
            emissions[category] = None

    return emissions

@routes_bp.route("/calculate-carbon", methods=["GET"])
def calculate_carbon_emission():
    """Calculate carbon emissions from request query parameters."""
    try:
        email = request.args.get("email")
        if not email:
            return jsonify({"error": "Email is required"}), 400

        # Extract transport, home, food, and shopping data from query parameters
        transport_data = {
            "transportationMode": request.args.get("transportdata[transportationMode]"),
            "commuteDistance": request.args.get("transportdata[commuteDistance]"),
            "flightsCount": request.args.get("transportdata[flightsCount]"),
        }

        home_data = {
            "energySource": request.args.get("homedata[energySource]"),
            "electricityUsage": request.args.get("homedata[electricityUsage]"),
            "homeSize": request.args.get("homedata[homeSize]"),
            "heatingType": request.args.get("homedata[heatingType]"),
        }

        food_data = {
            "dietType": request.args.get("fooddata[dietType]"),
            "localFoodPercentage": request.args.get("fooddata[localFoodPercentage]"),
            "foodWaste": request.args.get("fooddata[foodWaste]"),
            "OrganicFood": request.args.get("fooddata[OrganicFood]"),
        }

        shopping_data = {
            "shoppingType": request.args.get("shoppingdata[shoppingType]"),
            "sustainableProducts": request.args.get("shoppingdata[sustainableProducts]"),
            "RecyclingHabbits": request.args.get("shoppingdata[RecyclingHabbits]"),
            "fashionVsustainable": request.args.get("shoppingdata[fashionVsustainable]"),
        }

        emission_data = calculate_emission(
            email, transport_data, home_data, food_data, shopping_data
        )

        return jsonify({"emissionData": emission_data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@routes_bp.route("/calculate-carbon-update", methods=["GET"])
def get_carbon_emission():
    """Calculate carbon emissions and update database."""
    try:
        email = request.args.get("email")
        if not email:
            return jsonify({"error": "Email is required"}), 400

        # Extract transport, home, food, and shopping data from query parameters
        transport_data = {
            "transportationMode": request.args.get("transportdata[transportationMode]"),
            "commuteDistance": request.args.get("transportdata[commuteDistance]"),
            "flightsCount": request.args.get("transportdata[flightsCount]"),
        }

        home_data = {
            "energySource": request.args.get("homedata[energySource]"),
            "electricityUsage": request.args.get("homedata[electricityUsage]"),
            "homeSize": request.args.get("homedata[homeSize]"),
            "heatingType": request.args.get("homedata[heatingType]"),
        }

        food_data = {
            "dietType": request.args.get("fooddata[dietType]"),
            "localFoodPercentage": request.args.get("fooddata[localFoodPercentage]"),
            "foodWaste": request.args.get("fooddata[foodWaste]"),
            "OrganicFood": request.args.get("fooddata[OrganicFood]"),
        }

        shopping_data = {
            "shoppingType": request.args.get("shoppingdata[shoppingType]"),
            "sustainableProducts": request.args.get("shoppingdata[sustainableProducts]"),
            "RecyclingHabbits": request.args.get("shoppingdata[RecyclingHabbits]"),
            "fashionVsustainable": request.args.get("shoppingdata[fashionVsustainable]"),
        }

        emission_data = calculate_emission(
            email, transport_data, home_data, food_data, shopping_data
        )

        # conn = get_db_connection()
        # cursor = conn.cursor()

        # query = """
        #     INSERT INTO carbon_footprint 
        #     (user_email, transport_data, home_data, food_data, shopping_data, emission_data)
        #     VALUES (%s, %s, %s, %s, %s, %s)
        #     ON CONFLICT (user_email) DO UPDATE
        #     SET transport_data = EXCLUDED.transport_data,
        #         home_data = EXCLUDED.home_data,
        #         food_data = EXCLUDED.food_data,
        #         shopping_data = EXCLUDED.shopping_data,
        #         emission_data = EXCLUDED.emission_data;
        # """
        # cursor.execute(
        #     query,
        #     (
        #         email,
        #         json.dumps(transport_data),
        #         json.dumps(home_data),
        #         json.dumps(food_data),
        #         json.dumps(shopping_data),
        #         json.dumps(emission_data),
        #     ),
        # )
        # conn.commit()

        return jsonify({"emissionData": emission_data}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        print(e)
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