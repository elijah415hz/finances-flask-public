from flask import Flask
import os
from . import auth, expenses, income, views, categories

# Setup app: Serve build folder at "/"
app = Flask(__name__, static_folder='../build', static_url_path="/")
# Config
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 2592000
# Register Routes
app.register_blueprint(auth.bp)
app.register_blueprint(expenses.bp)
app.register_blueprint(income.bp)
app.register_blueprint(views.bp)
app.register_blueprint(categories.bp)

