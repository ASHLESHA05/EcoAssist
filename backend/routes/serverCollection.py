from flask import request, jsonify
import requests  # You need to import the requests library
from . import routes_bp

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
        
        # Update the application data
        response_data = response.json()
        data = {
            "email": response_data.get("email"),
            "energy": response_data.get("energy"),
            "waste": response_data.get("waste"),
            "water": response_data.get("water")
        }
        
        # TODO: Store the data in db
        # @varuns store the data in db
        
        # Return the data to the client
        return jsonify({"status": "success", "data": data}), 200
        
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