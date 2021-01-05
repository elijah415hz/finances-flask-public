from flask import Blueprint, send_file, current_app, Response, request, jsonify
import pandas as pd
from matplotlib.figure import Figure
import base64
from io import BytesIO
from .db import engine
from .auth import checkAuth


bp = Blueprint('views', __name__, url_prefix='')

@bp.route("/")
def index():
    return current_app.send_static_file('index.html')

@bp.route("/wallchart")
def wallchart():
    valid_token = checkAuth(request)
    if not valid_token:
        return Response("Nice Try!", status=401)
    else:
        EXP_sql = "SELECT date, amount FROM expenses e \
                        WHERE user_id=%s;"
        EXP_dataframe = pd.read_sql(EXP_sql, con=engine, parse_dates=['date'], params=[valid_token['id']])

        INC_sql = "SELECT date, amount\
                        FROM income i\
                        WHERE user_id=%s;"
        INC_dataframe = pd.read_sql(INC_sql, con=engine, parse_dates=['date'], params=[valid_token['id']])
        if INC_dataframe.empty or EXP_dataframe.empty:
            return Response("No Data", status=404)
        # Convert dates to year-month and sum each month
        INC_dataframe['date'] = INC_dataframe['date'].dt.to_period('M')
        EXP_dataframe['date'] = EXP_dataframe['date'].dt.to_period('M')
        INC_wallchart = INC_dataframe.groupby(['date']).sum()
        EXP_wallchart = EXP_dataframe.groupby(['date']).sum()
        merged = pd.merge(INC_wallchart, EXP_wallchart, on='date')
        merged.reset_index(inplace=True)
        print(merged)
        wallchart_data = {}
        # Date column has to be converted from Period to string, then to datetime, then to string again...
        wallchart_data['labels'] = pd.to_datetime(merged['date'].astype(str)).dt.strftime("%b %y").tolist()
        wallchart_data['income'] = INC_wallchart['amount'].tolist()
        wallchart_data['expenses'] = EXP_wallchart['amount'].tolist()
        print(wallchart_data)
        return jsonify(wallchart_data)
       