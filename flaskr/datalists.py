from flask import Blueprint, Response, request
import pandas as pd
from .auth import checkAuth
from .db import engine

bp = Blueprint('datalists', __name__, url_prefix='/api')

# Returns datalists for autofill use on front end
@bp.route("/datalists")
def get_datalist():
    valid_token = checkAuth(request)
    print("datalist token:", valid_token)
    if not valid_token:
        return Response("Nice Try!", status=401)
    else:
        data_lists = [
            "sources",
            "persons",
            "narrow_categories",
            "broad_categories",
            "vendors"
        ]

        response = {}
        for dl in data_lists:
            sql = f"SELECT id, name FROM {dl} WHERE user_id=%s ORDER BY name"
            dataframe = pd.read_sql(sql, con=engine, params=[valid_token['id']])
            dataframe = dataframe.to_dict(orient="records")
            response[dl] = dataframe
        return response
