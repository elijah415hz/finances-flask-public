from flask import Blueprint, Response, request, jsonify, current_app
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import bcrypt
import jwt

import os
USER_NAME = os.environ.get("USER_NAME")
PASSWORD = os.environ.get("PASSWORD")

bp = Blueprint('auth', __name__, url_prefix='/auth')

def checkAuth(request):
    try :
        token = request.headers['Authorization'].split(" ")[1]
        decoded = jwt.decode(token, current_app.config['SECRET_KEY'])
        print(decoded)
        return decoded
    except jwt.ExpiredSignatureError:
        print("Token has expired!")
        return False
    except jwt.InvalidSignatureError:
        print("Key mismatch")
        return False
    except:
        print("Invalid Token")
        return False

# Routes
@bp.route("/login", methods=['POST'])
def login():
    json = request.get_json()
    username = json['username']
    password = json['password']
    if username == USER_NAME and bcrypt.checkpw(password, PASSWORD):
        token = jwt.encode({'username': username, 'exp' : datetime.utcnow() + timedelta(minutes=30)}, current_app.config['SECRET_KEY'])  
        return jsonify({'token' : token.decode('UTF-8')}) 
    else:
        return Response("Wrong credentials!", status=401)

@bp.route("/checkAuth", methods=['GET'])
def callCheckAuth():
    validToken = checkAuth(request)
    if validToken:
        return validToken
    else:
        return Response("Nice try!", status=401)
