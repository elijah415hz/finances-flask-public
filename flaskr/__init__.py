from flask import Flask, request, Response, render_template, send_file, jsonify
from sqlalchemy import create_engine
import pandas as pd
import numpy as np
from matplotlib.figure import Figure
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import base64
from io import BytesIO
import bcrypt
import jwt

import os
FLASK_DB_URI = os.environ.get("FLASK_DB_URI")
USER_NAME = os.environ.get("USER_NAME")
PASSWORD = os.environ.get("PASSWORD")

app = Flask(__name__, static_folder='../build', static_url_path="/")
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['SECRET_KEY'] = os.urandom(5)

def format_numbers(x):
    return "{:.2f}".format(x)

def checkAuth(request):
    try :
        token = request.headers['Authorization'].split(" ")[1]
        decoded = jwt.decode(token, app.config['SECRET_KEY'])
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

@app.route("/")
def index():
    return app.send_static_file('index.html')

@app.route("/api/login", methods=['POST'])
def login():
    json = request.get_json()
    username = json['username']
    password = json['password']
    if username == USER_NAME and bcrypt.checkpw(password, PASSWORD):
        token = jwt.encode({'username': username, 'exp' : datetime.utcnow() + timedelta(minutes=30)}, app.config['SECRET_KEY'])  
        return jsonify({'token' : token.decode('UTF-8')}) 
    else:
        return Response("Wrong credentials!", status=401)

@app.route("/api/checkAuth", methods=['GET'])
def callCheckAuth():
    validToken = checkAuth(request)
    if validToken:
        return validToken
    else:
        return Response("Nice try!", status=401)

@app.route("/api/income")
def api_income():
    engine = create_engine(FLASK_DB_URI)    
    year = request.args.get("year")
    month = request.args.get("month")
    year_month = year + "-" + month
    month = datetime.strptime(year_month, '%Y-%m')
    start_date = month.date()
    end_date = (month + relativedelta(months=+1)).date()
    sql = "SELECT i.id, i.source_id, i.earner_id, Date, Amount, s.name AS Source, p.name AS Person\
                FROM income i\
                LEFT JOIN source s ON s.id=i.source_id\
                LEFT JOIN person_earner p ON p.id=i.earner_id\
		        WHERE date > '{}' AND date < '{}'\
                ORDER BY date;".format(start_date, end_date)
    INC_report = pd.read_sql(sql, con=engine, parse_dates=['Date'])
    INC_report.set_index('Date', inplace=True)
    INC_report['Amount'] = INC_report['Amount'].apply(format_numbers)
    return INC_report.to_json(orient="table")

@app.route("/api/expenses")
def api_expenses():
    engine = create_engine(FLASK_DB_URI)    
    year = request.args.get("year")
    month = request.args.get("month")
    year_month = year + "-" + month    
    month = datetime.strptime(year_month, '%Y-%m')
    start_date = month.date()
    end_date = (month + relativedelta(months=+1)).date()
    sql = "SELECT entry_id, broad_category_id, narrow_category_id, Date, v.name AS Vendor, Amount, b.name AS Broad_category, n.name AS Narrow_category, p.name AS Person, Notes FROM expenses e \
                LEFT JOIN vendor v ON v.id=e.vendor_id \
                LEFT JOIN broad_category b ON b.id=e.broad_category_id \
                LEFT JOIN person_earner p ON p.id=e.person_id \
                LEFT JOIN narrow_category n ON n.id=e.narrow_category_id \
                WHERE date > '{}' AND date < '{}' \
                ORDER BY date;".format(start_date, end_date)
    EXP_report = pd.read_sql(sql, con=engine, parse_dates=['date'])
    EXP_report['Broad_category'] = EXP_report['Broad_category'].str.replace('_', ' ')
    EXP_report['Narrow_category'] = EXP_report['Narrow_category'].str.replace('_', ' ')
    EXP_report.set_index('Date', inplace=True)
    EXP_report['Amount'] = EXP_report['Amount'].apply(format_numbers)
    return EXP_report.to_json(orient="table")

@app.route("/api/pivot")
def api_pivot():
    engine = create_engine(FLASK_DB_URI)    
    year = request.args.get("year")
    month = request.args.get("month")
    year_month = year + "-" + month    
    month = datetime.strptime(year_month, '%Y-%m')
    start_date = month.date()
    end_date = (month + relativedelta(months=+1)).date()
    sql = "SELECT Date, v.name AS Vendor, Amount, b.name AS Broad_category, n.name AS Narrow_category, p.name AS Person, Notes FROM expenses e \
                   LEFT JOIN vendor v ON v.id=e.vendor_id \
                   LEFT JOIN broad_category b ON b.id=e.broad_category_id \
                   LEFT JOIN person_earner p ON p.id=e.person_id \
                   LEFT JOIN narrow_category n ON n.id=e.narrow_category_id \
		   WHERE date > '{}' AND date < '{}';".format(start_date, end_date)

    EXP_dataframe = pd.read_sql(sql, con=engine, parse_dates=['date'])
    EXP_dataframe['Broad_category'] = EXP_dataframe['Broad_category'].str.replace('_', ' ')
    EXP_dataframe['Narrow_category'] = EXP_dataframe['Narrow_category'].str.replace('_', ' ')
    PT_report = pd.pivot_table(EXP_dataframe, values='Amount', index=['Broad_category', 'Narrow_category'], aggfunc=np.sum)
    PT_report_broad = pd.pivot_table(EXP_dataframe, values='Amount', index='Broad_category', aggfunc=np.sum)
    PT_report_broad.index = pd.MultiIndex.from_product([PT_report_broad.index, ['x----TOTAL']], names=['Broad_category', 'Narrow_category'])
    PT_report = pd.concat([PT_report, PT_report_broad]).sort_index()
    PT_report['Amount'] = PT_report['Amount'].apply(format_numbers)
    return PT_report.to_json(orient="table")

@app.route("/api/wallchart")
def wallchart():
    engine = create_engine(FLASK_DB_URI)    
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
    ax = fig.subplots()
    df_wallchart.plot.line(figsize=(13, 4), color=['blue', 'red'], grid=True, ax=ax)
    buffer = BytesIO()
    fig.savefig(buffer, format="png")
    # Embed the result in the html output.
    buffer.seek(0)
    return send_file(buffer,  attachment_filename='plot.png',
                     mimetype='image/png')

@app.route("/api/sources")
def get_sources():
    engine = create_engine(FLASK_DB_URI)
    sql = "SELECT id, name FROM source ORDER BY name"
    dataframe = pd.read_sql(sql, con=engine)
    return dataframe.to_json(orient="table")

@app.route("/api/persons")
def get_persons():
    engine = create_engine(FLASK_DB_URI)
    sql = "SELECT id, name FROM person_earner ORDER BY name"
    dataframe = pd.read_sql(sql, con=engine)
    return dataframe.to_json(orient="table")

@app.route("/api/narrows")
def get_narrows():
    engine = create_engine(FLASK_DB_URI)
    sql = "SELECT id, name FROM narrow_category ORDER BY name"
    dataframe = pd.read_sql(sql, con=engine)
    return dataframe.to_json(orient="table")

@app.route("/api/broads")
def get_broads():
    engine = create_engine(FLASK_DB_URI)
    sql = "SELECT id, name FROM broad_category ORDER BY name"
    dataframe = pd.read_sql(sql, con=engine)
    return dataframe.to_json(orient="table")