from flask import Blueprint, Response, request, jsonify
import pandas as pd
from .auth import checkAuth
from .db import engine

bp = Blueprint('categories', __name__, url_prefix='/api/categories')

# Post persons and categories to customize user categories
@bp.route('/', methods=['POST'])
def add_category():
    json = request.get_json()
    valid_token = checkAuth(request)
    if not valid_token:
        return Response("Nice Try!", status=401)
    else:
        if json['person']:
            with engine.connect() as con:
                sql = "INSERT INTO persons(name, user_id) VALUES(%s, %s)"
                con.execute(sql, [json['person'], valid_token['id']])
            return Response(f"{json['person']} added", status=200)
        if json['broad_category']:
            with engine.connect() as con:
                sql = "INSERT INTO broad_categories(name, user_id) VALUES(%s, %s)"
                con.execute(sql, [json['broad_category'], valid_token['id']])
            return Response(f"{json['broad_category']} added", status=200)
        if json['narrow_category']:
            with engine.connect() as con:
                sql = "INSERT INTO narrow_categories(name, user_id) VALUES(%s, %s)"
                con.execute(sql, [json['narrow_category'], valid_token['id']])
            return Response(f"{json['narrow_category']} added", status=200)
        
# Returns datalists for autofill use on front end
@bp.route("/", methods=['GET'])
def get_categories():
    valid_token = checkAuth(request)
    if not valid_token:
        return Response("Nice Try!", status=401)
    else:
        data_lists = [
            # "sources",
            "persons",
            "narrow_categories",
            "broad_categories",
            # "vendors"
        ]

        response = {}
        for dl in data_lists:
            sql = f"SELECT id, name FROM {dl} WHERE user_id=%s ORDER BY name"
            dataframe = pd.read_sql(sql, con=engine, params=[valid_token['id']])
            data_dict = dataframe.to_dict(orient="records")
            response[dl] = data_dict
        print("Categories: ", response)
        return response