import os

from dotenv import load_dotenv

load_dotenv()

DB_URL = os.getenv("DB_URL", "postgresql://usuario:clave@localhost:5432/agro_nayarit")
