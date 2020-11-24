from flask import Flask, request, render_template
from sqlalchemy import create_engine
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

import os
FLASK_DB_URI = os.environ.get("FLASK_DB_URI")

app = Flask(__name__)

def format_numbers(x):
    return "${:.2f}".format(x)

@app.route("/")
def index():
    return render_template('form.html')

@app.route("/react")
def react():
    return render_template('react_client/build/index.html')

@app.route("/api/income")
def api_income():
    engine = create_engine(FLASK_DB_URI)    
    year = request.args.get("year")
    month = request.args.get("month")
    year_month = year + "-" + month
    month = datetime.strptime(year_month, '%Y-%m')
    start_date = month.date()
    end_date = (month + relativedelta(months=+1)).date()
    sql = "SELECT i.id, Date, Amount, s.name AS Source, p.name AS Person\
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
    sql = "SELECT entry_id, Date, v.name AS Vendor, Amount, b.name AS Broad_category, n.name AS Narrow_category, p.name AS Person, Notes FROM expenses e \
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

# Figure out how to send matplotlib...
def wallchart(engine):
    # Pull selected month from expenses and income    
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
    df_wallchart.plot.line(figsize=(13, 4), color=['blue', 'red'], grid=True)
    plt.show()
    exit()

# if __name__ == "__main__":
#     app.run(host='0.0.0.0')