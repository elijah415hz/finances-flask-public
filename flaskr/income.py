from flask import Blueprint, Response, request, jsonify, current_app
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import pandas as pd
from .db import engine
from .expenses import format_numbers
from .auth import checkAuth

bp = Blueprint('income', __name__, url_prefix='/api/income')

# Get Income by Month
@bp.route("/<year>/<month>")
def api_income(year, month):
    valid_token = checkAuth(request)
    if not valid_token:
        return Response("Nice Try!", status=401)
    else:
        year_month = year + "-" + month
        month = datetime.strptime(year_month, '%Y-%m')
        start_date = (month - timedelta(days=1)).date()
        end_date = (month + relativedelta(months=+1)).date()
        sql = "SELECT i.id, i.source_id, i.person_id as person_id, date, amount, s.name AS source, p.name AS person\
                    FROM income i\
                    LEFT JOIN sources s ON s.id=i.source_id\
                    LEFT JOIN persons p ON p.id=i.person_id\
                    WHERE i.user_id=%s AND date > %s AND date < %s\
                    ORDER BY date;"
        INC_report = pd.read_sql(sql, con=engine, params=[valid_token['id'], start_date, end_date], parse_dates=['date'])
        INC_report.set_index('date', inplace=True)
        INC_report['amount'] = INC_report['amount'].apply(format_numbers)
        return INC_report.to_json(orient="table")

# Used by post_income and post_batch_income
def insert_income(json):
    date = datetime.strptime(json['date'], "%m/%d/%Y").strftime("%Y-%m-%d")
    amount = json['amount'] or None
    person_id = json['person_id'] or  None
    source = json['source'] or None
    user_id = json['user_id']
    
    with engine.connect() as con:
        insert_source_sql = "INSERT IGNORE INTO sources(name, user_id) VALUES(%s, %s)"
        con.execute(insert_source_sql, [source, user_id])
        source_id = con.execute("SELECT id FROM sources WHERE name=%s", [source]).fetchone()[0]
        sql = "INSERT INTO income(date, amount, source_id, person_id, user_id)\
                VALUES(DATE(%s), %s, %s, %s, %s)"     
        con.execute(sql, [date, amount, source_id, person_id, user_id])

# Create Income Record
@bp.route("/", methods=["POST"])
def post_income():
    json = request.get_json()
    valid_token = checkAuth(request)
    if not valid_token:
        return Response("Nice Try!", status=401)
    else:
        json['user_id'] = valid_token['id']
        insert_income(json)
        return Response('Record Inserted!', status=200)

# Load in batch of income records
@bp.route("/batch", methods=["POST"])
def post_batch_income():
    json = request.get_json()
    valid_token = checkAuth(request)
    print("JSON: ", json)
    if not valid_token:
        return Response("Nice Try!", status=401)
    else:
        for row in json:
            json['user_id'] = valid_token['id']
            insert_income(row)
        return Response('Records Inserted!', status=200)


# Edit income
@bp.route("/<int:id>", methods=['PUT'])
def update_income(id):  
    valid_token = checkAuth(request)
    if not valid_token:
        return Response("Nice Try!", status=401)
    else:
        json = request.get_json()
        # Parse dates
        date = datetime.strptime(json['Date'], "%m/%d/%Y").strftime("%Y-%m-%d")
        # Convert any null values
        if json['amount']:
            amount = json['amount']
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

        sql = "UPDATE income \
            SET date=DATE(%s), \
            amount=%s, \
            earner_id=%s, \
            source_id=%s \
            WHERE id=%s;"
        engine.connect().execute(sql, [date, amount, person, source, id])
        return Response(f'id: {id} Updated', status=200)

@bp.route("/<int:id>", methods=['DELETE'])
def delete_income(id):
    valid_token = checkAuth(request)
    if not valid_token:
        return Response("Nice Try!", status=401)
    else:
        sql = "DELETE FROM income WHERE id=%s;"
        engine.connect().execute(sql, [id])
        return Response(f'id: {id} Deleted', status=200)
    