import os
import datetime
import json
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

# Define scopes
SCOPES = ["https://www.googleapis.com/auth/fitness.location.read"]

# Authenticate and authorize the user
def authenticate():
    creds = None
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
            creds = flow.run_local_server(port=0)
        with open("token.json", "w") as token:
            token.write(creds.to_json())
    return creds

# Fetch location history using Google Fit API
def fetch_location_history(service):
    end_time = datetime.datetime.utcnow()
    start_time_7_days = end_time - datetime.timedelta(days=7)
    start_time_12_months = end_time - datetime.timedelta(days=365)

    # Fetch data for the past 7 days
    data_7_days = service.users().dataset().aggregate(
        userId="me",
        body={
            "aggregateBy": [{
                "dataTypeName": "com.google.location.sample",
                "dataSourceId": "derived:com.google.location.sample:com.google.android.gms:merge_location_samples"
            }],
            "bucketByTime": {
                "durationMillis": 86400000  # 1 day in milliseconds
            },
            "startTimeMillis": int(start_time_7_days.timestamp() * 1000),
            "endTimeMillis": int(end_time.timestamp() * 1000)
        }
    ).execute()

    # Fetch data for the past 12 months
    data_12_months = service.users().dataset().aggregate(
        userId="me",
        body={
            "aggregateBy": [{
                "dataTypeName": "com.google.location.sample",
                "dataSourceId": "derived:com.google.location.sample:com.google.android.gms:merge_location_samples"
            }],
            "bucketByTime": {
                "durationMillis": 2592000000  # 30 days in milliseconds
            },
            "startTimeMillis": int(start_time_12_months.timestamp() * 1000),
            "endTimeMillis": int(end_time.timestamp() * 1000)
        }
    ).execute()

    return data_7_days, data_12_months

# Use Google Maps Directions API to infer trip details
def infer_trip_details(origin, destination, api_key):
    url = f"https://maps.googleapis.com/maps/api/directions/json?origin={origin}&destination={destination}&key={api_key}"
    response = requests.get(url)
    data = response.json()
    return data

# Process data and calculate averages
def process_data(data_7_days, data_12_months, api_key):
    past_7_days_avg = {}
    past_12_months_avg = {}

    # Process past 7 days data
    for bucket in data_7_days.get("bucket", []):
        day = bucket["startTimeMillis"]
        locations = bucket.get("dataset", [])
        for entry in locations:
            origin = (entry["value"][0]["fpVal"], entry["value"][1]["fpVal"])
            destination = (entry["value"][2]["fpVal"], entry["value"][3]["fpVal"])
            trip_details = infer_trip_details(origin, destination, api_key)
            # Add logic to infer mode of transport and distance
            # ...

    # Process past 12 months data
    for bucket in data_12_months.get("bucket", []):
        month = bucket["startTimeMillis"]
        locations = bucket.get("dataset", [])
        for entry in locations:
            origin = (entry["value"][0]["fpVal"], entry["value"][1]["fpVal"])
            destination = (entry["value"][2]["fpVal"], entry["value"][3]["fpVal"])
            trip_details = infer_trip_details(origin, destination, api_key)
            # Add logic to infer mode of transport and distance
            # ...

    return past_7_days_avg, past_12_months_avg

# Main function
def main():
    creds = authenticate()
    service = build("fitness", "v1", credentials=creds)

    data_7_days, data_12_months = fetch_location_history(service)
    api_key = "YOUR_GOOGLE_MAPS_API_KEY"
    past_7_days_avg, past_12_months_avg = process_data(data_7_days, data_12_months, api_key)

    # Print the output
    output = {
        "past7daysAvg": past_7_days_avg,
        "past12monthsAvg": past_12_months_avg
    }
    print(json.dumps(output, indent=4))

if __name__ == "__main__":
    main()