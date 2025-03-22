import os
import sqlite3
import datetime
import re
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Define the scopes required for accessing Google Fit data
SCOPES = ["https://www.googleapis.com/auth/fitness.activity.read"]

# SQLite database setup
DATABASE_FILE = "google_fit_users.db"

# Fixed port for OAuth redirect URI
FIXED_PORT = 56903

def initialize_db():
    """Initialize the SQLite database to store user credentials."""
    try:
        conn = sqlite3.connect(DATABASE_FILE)
        cursor = conn.cursor()
        cursor.execute(
            """CREATE TABLE IF NOT EXISTS users (
                email TEXT PRIMARY KEY,
                access_token TEXT,
                refresh_token TEXT,
                expiry TEXT
            )"""
        )
        conn.commit()
    except sqlite3.Error as e:
        print(f"Database error: {e}")
    finally:
        if conn:
            conn.close()

def get_user_credentials(email):
    """Fetch user credentials from the SQLite database."""
    try:
        conn = sqlite3.connect(DATABASE_FILE)
        cursor = conn.cursor()
        cursor.execute("SELECT access_token, refresh_token, expiry FROM users WHERE email = ?", (email,))
        row = cursor.fetchone()
        if row:
            return {
                "access_token": row[0],
                "refresh_token": row[1],
                "expiry": row[2],
            }
    except sqlite3.Error as e:
        print(f"Database error: {e}")
    finally:
        if conn:
            conn.close()
    return None

def save_user_credentials(email, credentials):
    """Save user credentials to the SQLite database."""
    try:
        conn = sqlite3.connect(DATABASE_FILE)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT OR REPLACE INTO users (email, access_token, refresh_token, expiry) VALUES (?, ?, ?, ?)",
            (email, credentials.token, credentials.refresh_token, credentials.expiry),
        )
        conn.commit()
    except sqlite3.Error as e:
        print(f"Database error: {e}")
    finally:
        if conn:
            conn.close()

def authenticate_google_fit(email):
    """Authenticate with Google Fit and fetch step count data."""
    creds = None
    # Check if credentials exist in the database
    stored_creds = get_user_credentials(email)
    if stored_creds:
        creds = Credentials(
            token=stored_creds["access_token"],
            refresh_token=stored_creds["refresh_token"],
            token_uri="https://oauth2.googleapis.com/token",
            client_id=os.getenv("GFIT_CLIENT_ID"),
            client_secret=os.getenv("GFIT_SECRET_KEY"),
            expiry=stored_creds["expiry"],
        )
        # Refresh the token if it's expired
        if creds.expired and creds.refresh_token:
            try:
                creds.refresh(Request())
                save_user_credentials(email, creds)
            except Exception as e:
                print(f"Error refreshing token: {e}")
                creds = None
    else:
        # If no credentials, prompt the user to log in
        try:
            flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
            creds = flow.run_local_server(port=FIXED_PORT, open_browser=False)
  # Use fixed port
            save_user_credentials(email, creds)
        except Exception as e:
            print(f"Error during OAuth flow: {e}")
            creds = None
    return creds

def check_google_fit_account(creds):
    """Check if the user has a Google Fit account."""
    try:
        service = build("fitness", "v1", credentials=creds)
        data_source = "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
        # Try to list data sources to check if Google Fit is set up
        service.users().dataSources().list(userId="me").execute()
        return True
    except HttpError as e:
        if "datasource not found or not readable" in str(e):
            return False
        else:
            print(f"Google Fit API error: {e}")
            return False
    except Exception as e:
        print(f"Error checking Google Fit account: {e}")
        return False

def get_step_count(creds, start_time, end_time):
    """Fetch step count data from Google Fit."""
    try:
        service = build("fitness", "v1", credentials=creds)
        data_source = "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
        request_body = {
            "aggregateBy": [{"dataTypeName": "com.google.step_count.delta", "dataSourceId": data_source}],
            "bucketByTime": {"durationMillis": 86400000},  # 1 day in milliseconds
            "startTimeMillis": start_time,
            "endTimeMillis": end_time,
        }
        response = service.users().dataset().aggregate(userId="me", body=request_body).execute()
        steps = 0
        for bucket in response.get("bucket", []):
            for dataset in bucket.get("dataset", []):
                for point in dataset.get("point", []):
                    for value in point.get("value", []):
                        steps += value.get("intVal", 0)
        return steps
    except HttpError as e:
        print(f"Google Fit API error: {e}")
        return 0
    except Exception as e:
        print(f"Error fetching step count: {e}")
        return 0

def is_valid_email(email):
    """Validate the email format."""
    pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    return re.match(pattern, email) is not None

def main():
    # Initialize the database
    initialize_db()

    # Ask for the user's email
    email = input("Enter your email: ").strip()
    if not is_valid_email(email):
        print("Invalid email format. Exiting...")
        return

    # Check if credentials exist for the user
    stored_creds = get_user_credentials(email)
    if stored_creds:
        print("Credentials found. Fetching step count data...")
    else:
        connect = input("No credentials found. Do you want to connect to Google Fit? (yes/no): ").strip().lower()
        if connect != "yes":
            print("Exiting...")
            return

    # Authenticate with Google Fit
    creds = authenticate_google_fit(email)
    if not creds:
        print("Authentication failed. Exiting...")
        return

    # Check if the user has a Google Fit account
    if not check_google_fit_account(creds):
        print("Google Fit account not found. Please create a Google Fit account and try again.")
        return

    # Define the date range for step count data
    start_time = int((datetime.datetime.now() - datetime.timedelta(days=1)).timestamp() * 1000)  # Yesterday
    end_time = int(datetime.datetime.now().timestamp() * 1000)  # Today

    # Fetch step count data
    step_count = get_step_count(creds, start_time, end_time)
    print(f"Step count for the last 24 hours: {step_count}")

if __name__ == "__main__":
    main()