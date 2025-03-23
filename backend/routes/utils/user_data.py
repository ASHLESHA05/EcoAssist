def fetch_user_data(email):
    """
    Fetches user data (e.g., from a database or session).
    Replace this with your actual logic to retrieve user-specific data.
    """
    user_data = {
        "eco_score": 65.0,
        "carbon_footprint_total": 15000.0,
        "carbon_footprint_breakdown": {
            "Transport": 300000.0, 
            "Home": 5000.0, 
            "Food": 4000.0, 
            "Shopping": 3000.0
        },
        "water_saved": 50,
        "energy_saved": 1000.0,
        "waste_reduced": 2,
        "user_plan": "Implement a Home Energy Audit - Schedule a professional energy audit to assess your home's energy inefficiencies.",
        "current_activities": {
            "Mode of transport": "car, distance: 20.0 km/day",
            "Home Energy source": "grid electricity, Electricity Usage: 300.0 kWh/month, Heating Type: gas",
            "Food diet type": "omnivore, Food Waste: medium, Organic food consumption: occasional"
        }
    }
    # Example mock data
    return str(user_data)
