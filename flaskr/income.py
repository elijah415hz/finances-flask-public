from flask import Blueprint, Response, request, jsonify, current_app
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import pandas as pd
from . import engine
from .expenses import format_numbers

bp = Blueprint('income', __name__, url_prefix='/api/income')

@bp.route("/<year>/<month>")
def api_income(year, month):
    year_month = year + "-" + month
    month = datetime.strptime(year_month, '%Y-%m')
    start_date = (month - timedelta(days=1)).date()
    end_date = (month + relativedelta(months=+1)).date()
    sql = "SELECT i.id, i.source_id, i.earner_id as person_id, Date, Amount, s.name AS Source, p.name AS Person\
                FROM income i\
                LEFT JOIN source s ON s.id=i.source_id\
                LEFT JOIN person_earner p ON p.id=i.earner_id\
                WHERE date > %s AND date < %s\
                ORDER BY date;"
    INC_report = pd.read_sql(sql, con=engine, params=[start_date, end_date], parse_dates=['Date'])
    INC_report.set_index('Date', inplace=True)
    INC_report['Amount'] = INC_report['Amount'].apply(format_numbers)
    return INC_report.to_json(orient="table")

# Edit income
@bp.route("/<int:id>", methods=['PUT'])
def update_income(id):  
    json = request.get_json()
    # Parse dates
    date = datetime.strptime(json['Date'], "%m/%d/%Y").strftime("%Y-%m-%d")
    # Convert any null values
    if json['Amount']:
        amount = json['Amount']
    else :
        amount = 0
    if json['person_id']:
        person = json['person_id']
    else:
        person = 'NULL'
    if json['source_id']:
        source = json['source_id']
    else:
        source = 'NULL'

    print(json)
    sql = "UPDATE income \
        SET date=DATE(%s), \
        amount=%s, \
        earner_id=%s, \
        source_id=%s \
        WHERE id=%s;"
    print(sql)
    executed = engine.connect().execute(sql, [date, amount, person, source, id])
    print(executed)
    return Response(f'id: {id} Updated', status=200)

@bp.route("/<int:id>", methods=['DELETE'])
def delete_income(id):
    try: 
        sql = "DELETE FROM income WHERE id=%s;"
        executed = engine.connect().execute(sql, [id])
        print(executed)
        return Response(f'id: {id} Deleted', status=200)
    except:
        return Response("Server Error", status=500)
