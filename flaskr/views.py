from flask import Blueprint, send_file, current_app
import pandas as pd
from matplotlib.figure import Figure
import base64
from io import BytesIO
from .db import engine

bp = Blueprint('views', __name__, url_prefix='')

@bp.route("/")
def index():
    return current_app.send_static_file('index.html')

@bp.route("/wallchart")
def wallchart():
    EXP_sql = "SELECT Date, v.name AS Vendor, Amount, b.name AS Broad_category, n.name AS Narrow_category, p.name AS Person, Notes FROM expenses e \
                    LEFT JOIN vendor v ON v.id=e.vendor_id \
                    LEFT JOIN broad_category b ON b.id=e.broad_category_id \
                    LEFT JOIN person_earner p ON p.id=e.person_id \
                    LEFT JOIN narrow_category n ON n.id=e.narrow_category_id"
    EXP_dataframe = pd.read_sql(EXP_sql, con=engine, parse_dates=['Date'])

    INC_sql = "SELECT Date, Amount, s.name AS Source, p.name AS Person\
                    FROM income i\
                    LEFT JOIN source s ON s.id=i.source_id\
                    LEFT JOIN person_earner p ON p.id=i.earner_id;"
    INC_dataframe = pd.read_sql(INC_sql, con=engine, parse_dates=['Date'])

    # Convert dates to year-month and sum each month
    INC_dataframe['Date'] = INC_dataframe['Date'].dt.to_period('M')
    EXP_dataframe['Date'] = EXP_dataframe['Date'].dt.to_period('M')
    INC_wallchart = INC_dataframe.groupby(['Date']).sum()
    EXP_wallchart = EXP_dataframe.groupby(['Date']).sum()

    # Generate Plot
    df_wallchart = pd.merge(INC_wallchart, EXP_wallchart, on='Date')
    df_wallchart.rename(columns={'Amount_x': 'Income', 'Amount_y': 'Expenses'}, inplace=True)
    fig = Figure()
    # fig.set_facecolor("#263238")
    ax = fig.subplots()
    df_wallchart.plot.line(figsize=(13, 4), color=['blue', 'red'], grid=True, ax=ax)
    buffer = BytesIO()
    fig.savefig(buffer, format="png")
    # Embed the result in the html output.
    buffer.seek(0)
    return send_file(buffer,  attachment_filename='plot.png',
                    mimetype='image/png', cache_timeout=1200)