from flask import Blueprint, send_file, current_app, Response, request
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
        EXP_dataframe = pd.read_sql(EXP_sql, con=engine, parse_dates=['Date'], params=[valid_token['id']])

        INC_sql = "SELECT date, amount\
                        FROM income i\
                        WHERE user_id=%s;"
        INC_dataframe = pd.read_sql(INC_sql, con=engine, parse_dates=['Date'], params=[valid_token['id']])
        if INC_dataframe.empty or EXP_dataframe.empty:
            return Response("No Data", status=404)
        # Convert dates to year-month and sum each month
        INC_dataframe['date'] = INC_dataframe['date'].dt.to_period('M')
        EXP_dataframe['date'] = EXP_dataframe['date'].dt.to_period('M')
        INC_wallchart = INC_dataframe.groupby(['date']).sum()
        EXP_wallchart = EXP_dataframe.groupby(['date']).sum()

        # Generate Plot
        df_wallchart = pd.merge(INC_wallchart, EXP_wallchart, on='Date')
        df_wallchart.rename(columns={'Amount_x': 'Income', 'Amount_y': 'Expenses'}, inplace=True)
        print(df_wallchart.to_json(orient="records"))
        return df_wallchart.to_json(orient="records")
        # DEPRECATED METHOD FOR CREATING CHART
        # ==============================
        # fig = Figure()
        # ax = fig.subplots()
        # fig.set_facecolor("#263238")
        # ax.set_facecolor("#263238")
        # ax.spines['bottom'].set_color('white')
        # ax.spines['top'].set_visible(False) 
        # ax.spines['right'].set_visible(False)
        # ax.spines['left'].set_color('white')
        # ax.tick_params(axis='both', which='both', colors='white')
        # df_wallchart.plot.line(figsize=(13, 4), color=['#1b5e20', '#b71c1c'], grid=False, ax=ax, linewidth=4)
        # buffer = BytesIO()
        # fig.savefig(buffer, format="png")
        # Embed the result in the html output.
        # buffer.seek(0)
        # return send_file(buffer,  attachment_filename='plot.png',
        #                 mimetype='image/png', cache_timeout=0)