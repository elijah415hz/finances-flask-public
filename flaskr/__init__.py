from flask import Flask
from sqlalchemy import create_engine
import os
FLASK_DB_URI = os.environ.get("FLASK_DB_URI")

# Create database connection
engine = create_engine(FLASK_DB_URI) 

def create_app():
    app = Flask(__name__, static_folder='../build', static_url_path="/")
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    app.config['SECRET_KEY'] = os.urandom(5)

    from . import auth, expenses, income, datalists, views
    app.register_blueprint(auth.bp)
    app.register_blueprint(expenses.bp)
    app.register_blueprint(income.bp)
    app.register_blueprint(datalists.bp)
    app.register_blueprint(views.bp)

    return app