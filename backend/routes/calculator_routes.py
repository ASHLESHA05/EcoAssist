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
    """Calculate separate carbon footprints for transport, home, food, and shopping."""
    additional_data = fetch_user_data(email)

    def safe_int(value, default=0):
        try:
            return int(value)
        except (ValueError, TypeError):
            return default

    def safe_float(value, default=0.0):
        try:
            return float(value)
        except (ValueError, TypeError):
            return default

    # Define the list of all columns (21 in total)
    all_columns = [
        "mode_of_transportation",        # object (string)
        "daily_commute_distance",        # int64
        "flights_per_month",            # int64
        "home_energy_source",           # object (string)
        "monthly_electricity_usage",     # int64
        "home_size",                    # object (string)
        "heating_type",                 # object (string)
        "water_usage",                  # int64
        "light",                        # int64
        "light_consumption",            # int64
        "fan",                          # int64
        "fan_consumption",              # int64
        "heater",                       # int64
        "heater_consumption",           # int64
        "diet",                        # object (string)
        "food_waste",                   # object (string)
        "organic_food_consumption",     # object (string)
        "waste_generated",              # int64
        "shopping_frequency",           # object (string)
        "recycling_habit",              # object (string)
        "fast_fashion_vs_sustainable",  # object (string)
    ]

    # Initialize all columns with default values based on their types
    default_data = {
        "mode_of_transportation": "",        # string
        "daily_commute_distance": 0,        # int
        "flights_per_month": 0,             # int
        "home_energy_source": "",           # string
        "monthly_electricity_usage": 0,     # int
        "home_size": "",                    # string
        "heating_type": "",                 # string
        "water_usage": 0,                   # int
        "light": 0,                         # int
        "light_consumption": 0,             # int
        "fan": 0,                           # int
        "fan_consumption": 0,               # int
        "heater": 0,                        # int
        "heater_consumption": 0,            # int
        "diet": "",                         # string
        "food_waste": "",                   # string
        "organic_food_consumption": "",     # string
        "waste_generated": 0,               # int
        "shopping_frequency": "",           # string
        "recycling_habit": "",              # string
        "fast_fashion_vs_sustainable": "",  # string
    }

    # Categories data
    categories = {
        "transport": {
            "mode_of_transportation": transport.get("transportationMode", "car"),
            "daily_commute_distance": safe_int(transport.get("commuteDistance"), 10),
            "flights_per_month": safe_int(transport.get("flightsCount"), 0),
        },
        "home": {
            "home_energy_source": home.get("energySource", "grid"),
            "monthly_electricity_usage": safe_int(home.get("electricityUsage"), 100),
            "home_size": home.get("homeSize", "medium"),
            "heating_type": home.get("heatingType", "electric"),
            "water_usage": safe_int(additional_data.get("water_usage"), 100),
            "light": safe_int(additional_data.get("light"), 5),
            "light_consumption": safe_int(additional_data.get("light_consumption"), 50),
            "fan": safe_int(additional_data.get("fan"), 2),
            "fan_consumption": safe_int(additional_data.get("fan_consumption"), 75),
            "heater": safe_int(additional_data.get("heater"), 1),
            "heater_consumption": safe_int(additional_data.get("heater_consumption"), 1000),
        },
        "food": {
            "diet": food.get("dietType", "mixed"),
            "food_waste": food.get("foodWaste", "medium"),
            "organic_food_consumption": food.get("OrganicFood", "some"),
            "waste_generated": safe_int(additional_data.get("waste_generated"), 10),
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
        # Create a copy of the default data
        category_data = default_data.copy()

        # Update the category data with the relevant values
        category_data.update(data)

        # Convert to DataFrame
        category_df = pd.DataFrame([category_data])
        print(category_data)

        # Predict emissions using the model
        try:
            # Convert float32 to float for JSON serialization
            prediction = model.predict(category_df)
            emissions[category] = float(np.round(prediction[0], 2) / 4)  # Convert to float
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
    conn = None
    cursor = None
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

        # Calculate emissions
        emission_data = calculate_emission(
            email, transport_data, home_data, food_data, shopping_data
        )

        # Connect to the database
        conn = get_db_connection()
        cursor = conn.cursor()

        # Insert or update the carbon_footprint table
        query = """
            INSERT INTO carbon_footprint 
            (user_email, transport_data, home_data, food_data, shopping_data, emission_data)
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
            (
                email,
                json.dumps(transport_data),
                json.dumps(home_data),
                json.dumps(food_data),
                json.dumps(shopping_data),
                json.dumps(emission_data),
            ),
        )

        # Calculate the total carbon footprint quantity
        total_carbon_footprint_qty = (
            emission_data.get("transport", 0)
            + emission_data.get("home", 0)
            + emission_data.get("food", 0)
            + emission_data.get("shopping", 0)
        )

        # Update the dashboard_metrics table with the total carbon footprint quantity
        update_dashboard_query = """
            UPDATE dashboard_metrics
            SET carbon_footprint_qty = %s
            WHERE user_id = (SELECT user_id FROM users WHERE email = %s);
        """
        cursor.execute(update_dashboard_query, (total_carbon_footprint_qty, email))

        conn.commit()

        return jsonify({"emissionData": emission_data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
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