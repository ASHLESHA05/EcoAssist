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

SCOPES = ["https://www.googleapis.com/auth/fitness.activity.read"]
DATABASE_FILE = "google_fit_users.db"
FIXED_PORT = 56903

class GoogleFitAuthManager:
    def __init__(self):
        self.database_file = DATABASE_FILE
        self.initialize_db()

    def initialize_db(self):
        try:
            with sqlite3.connect(self.database_file) as conn:
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

    def get_user_credentials(self, email):
        try:
            with sqlite3.connect(self.database_file) as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT access_token, refresh_token, expiry FROM users WHERE email = ?", (email,))
                row = cursor.fetchone()
                if row:
                    return {"access_token": row[0], "refresh_token": row[1], "expiry": row[2]}
        except sqlite3.Error as e:
            print(f"Database error: {e}")
        return None

    def save_user_credentials(self, email, credentials):
        try:
            with sqlite3.connect(self.database_file) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT OR REPLACE INTO users (email, access_token, refresh_token, expiry) VALUES (?, ?, ?, ?)",
                    (email, credentials.token, credentials.refresh_token, credentials.expiry),
                )
                conn.commit()
        except sqlite3.Error as e:
            print(f"Database error: {e}")


class GoogleFitService:
    def __init__(self, email):
        self.email = email
        self.auth_manager = GoogleFitAuthManager()
        self.creds = None

    def authenticate(self):
        stored_creds = self.auth_manager.get_user_credentials(self.email)
        if stored_creds:
            self.creds = Credentials(
                token=stored_creds["access_token"],
                refresh_token=stored_creds["refresh_token"],
                token_uri="https://oauth2.googleapis.com/token",
                client_id=os.getenv("GFIT_CLIENT_ID"),
                client_secret=os.getenv("GFIT_SECRET_KEY"),
                expiry=stored_creds["expiry"],
            )
            if self.creds.expired and self.creds.refresh_token:
                try:
                    self.creds.refresh(Request())
                    self.auth_manager.save_user_credentials(self.email, self.creds)
                except Exception as e:
                    print(f"Error refreshing token: {e}")
                    self.creds = None
        else:
            try:
                flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
                self.creds = flow.run_local_server(port=FIXED_PORT, open_browser=False)
                self.auth_manager.save_user_credentials(self.email, self.creds)
            except Exception as e:
                print(f"Error during OAuth flow: {e}")

    def check_google_fit_account(self):
        try:
            service = build("fitness", "v1", credentials=self.creds)
            service.users().dataSources().list(userId="me").execute()
            return True
        except HttpError as e:
            print(f"Google Fit API error: {e}")
            return False

    def get_step_count(self, start_time, end_time):
        try:
            service = build("fitness", "v1", credentials=self.creds)
            data_source = "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
            request_body = {
                "aggregateBy": [{"dataTypeName": "com.google.step_count.delta", "dataSourceId": data_source}],
                "bucketByTime": {"durationMillis": 86400000},
                "startTimeMillis": start_time,
                "endTimeMillis": end_time,
            }
            response = service.users().dataset().aggregate(userId="me", body=request_body).execute()
            steps = sum(value.get("intVal", 0) for bucket in response.get("bucket", [])
                         for dataset in bucket.get("dataset", [])
                         for point in dataset.get("point", [])
                         for value in point.get("value", []))
            return steps
        except HttpError as e:
            print(f"Google Fit API error: {e}")
            return 0

def get_google_fit_step_count(email):
    service = GoogleFitService(email)
    service.authenticate()

    if not service.creds:
        print("Authentication failed.")
        return 0

    if not service.check_google_fit_account():
        print("Google Fit account not found.")
        return 0

    start_time = int((datetime.datetime.now() - datetime.timedelta(days=1)).timestamp() * 1000)
    end_time = int(datetime.datetime.now().timestamp() * 1000)
    step_count = service.get_step_count(start_time, end_time)
    return step_count


