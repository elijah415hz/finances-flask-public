from sqlalchemy import create_engine
import os

# Create database connection
FLASK_DB_URI = os.environ.get("FLASK_DB_URI")
engine = create_engine(FLASK_DB_URI) 