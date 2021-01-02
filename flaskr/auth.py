from flask import Blueprint, Response, request, jsonify, current_app
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from .db import engine
import bcrypt
import jwt
import sys

bp = Blueprint('auth', __name__, url_prefix='/auth')

# Helper function used by all routes to verify token
def checkAuth(request):
    try :
        token = request.headers['Authorization'].split(" ")[1].replace('"', '')
        decoded = jwt.decode(token, current_app.config['SECRET_KEY'])
        print("Token: ", decoded)
        return decoded
    except jwt.ExpiredSignatureError:
        print("Token has expired!")
        return False
    except jwt.InvalidSignatureError:
        print("Key mismatch")
        return False
    except:
        print("JWT Error:", sys.exc_info())
        return False

# Routes
@bp.route("/signup", methods=['POST'])
def signup():
    json = request.get_json()
    username = json['username']
    password = json['password']
    hashed = bcrypt.hashpw(password, bcrypt.gensalt())
    with engine.connect() as con:
        sql = "INSERT INTO users(username, password) VALUES(%s, %s)"
        con.execute(sql, [username, hashed])
    return Response("You're signed up!", status=200)

@bp.route("/login", methods=['POST'])
def login():
    json = request.get_json()
    username = json['username']
    password = json['password']
    with engine.connect() as con:
        sql = "SELECT * FROM users WHERE username=%s"
        try:
            user_info = con.execute(sql, [username]).fetchone()
            user_id = user_info[0]
            db_password = user_info[2]
            print(user_info)
        except:
            print("invalid username!")
            return Response("Invalid Username", status=401)
    if bcrypt.checkpw(password, db_password):
        token = jwt.encode({'username': username, 'id': user_id, 'exp' : datetime.utcnow() + timedelta(days=30)}, current_app.config['SECRET_KEY'])  
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
