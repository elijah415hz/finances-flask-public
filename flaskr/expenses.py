from flask import Blueprint, Response, request
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import pandas as pd
import numpy as np
from .db import engine
from .auth import checkAuth

bp = Blueprint('expenses', __name__, url_prefix='/api/expenses')

def format_numbers(x):
    return "{:.2f}".format(x)

# Get expenses by month
@bp.route("/<year>/<month>")
def api_expenses(year, month):
    valid_token = checkAuth(request)
    if not valid_token:
        return Response("Nice Try!", status=401)
    else:
        year_month = year + "-" + month    
        month = datetime.strptime(year_month, '%Y-%m')
        start_date = (month - timedelta(days=1)).date()
        end_date = (month + relativedelta(months=+1)).date()
        sql = "SELECT e.id, e.person_id, e.broad_category_id, e.narrow_category_id, e.vendor_id, e.date, v.name AS vendor, e.amount, b.name AS broad_category, n.name AS narrow_category, p.name AS person, notes FROM expenses e \
                    LEFT JOIN vendors v ON v.id=e.vendor_id \
                    LEFT JOIN broad_categories b ON b.id=e.broad_category_id \
                    LEFT JOIN persons p ON p.id=e.person_id \
                    LEFT JOIN narrow_categories n ON n.id=e.narrow_category_id \
                    WHERE e.user_id=%s AND date > %s AND date < %s \
                    ORDER BY date;"
        print("ID:", valid_token['id'])
        EXP_report = pd.read_sql(sql, con=engine, params=[valid_token['id'], start_date, end_date], parse_dates=['date'])
        EXP_report.set_index('date', inplace=True)
        EXP_report['amount'] = EXP_report['amount'].apply(format_numbers)
        print(EXP_report)
        return EXP_report.to_json(orient="table")

# Used by post_expense and post_expenses_batch
def insert_expense(json):
    date = datetime.strptime(json['date'], "%m/%d/%Y").strftime("%Y-%m-%d")
    amount = json['amount'] or None
    person = json['person_id'] or  None
    b_cat = json['broad_category_id'] or None
    n_cat = json['narrow_category_id'] or None
    vendor = json['vendor'] or None
    notes = json['notes']
    user_id = json['user_id']
    
    with engine.connect() as con:
        insert_vendor_sql = "INSERT IGNORE INTO vendors(name, user_id) VALUES(%s, %s)"
        con.execute(insert_vendor_sql, [vendor, user_id])
        vendor_id = con.execute("SELECT id FROM vendors WHERE name=%s", [vendor]).fetchone()[0]
        sql = "INSERT INTO expenses(date, vendor_id, amount, broad_category_id, narrow_category_id, person_id, notes, user_id)\
                VALUES(DATE(%s), %s, %s, %s, %s, %s, %s, %s)"     
        con.execute(sql, [date, vendor_id, amount, b_cat, n_cat, person, notes, user_id])

# Create Expense
@bp.route("/", methods=["POST"])
def post_expense():
    json = request.get_json()
    valid_token  = checkAuth(request)
    if not valid_token:
        return Response("Nice Try!", status=401)
    else:
        json['user_id'] = valid_token['id']
        insert_expense(json)
        return Response('Record Inserted!', status=200)

# Load in batch of expenses
@bp.route("/batch", methods=["POST"])
def post_batch_expense():
    json = request.get_json()
    valid_token = checkAuth(request)
    print("JSON: ", json)
    if not valid_token:
        return Response("Nice Try!", status=401)
    else:
        for row in json:
            json['user_id'] = valid_token['id']
            insert_expense(row)
        return Response('Records Inserted!', status=200)


# Edit expenses
@bp.route("/<int:id>", methods=['PUT'])
def update_expenses(id):
    valid_token = checkAuth(request)
    if not valid_token:
        return Response("Nice Try!", status=401)
    else:  
        json = request.get_json()
        # Parse dates
        date = datetime.strptime(json['date'], "%m/%d/%Y").strftime("%Y-%m-%d")
        # Convert any null values
        amount = json['amount'] or None
        person = json['person_id'] or  None
        b_cat = json['broad_category_id'] or None
        n_cat = json['narrow_category_id'] or None
        vendor = json['vendor_id'] or None
        notes = json['Notes']
        
        sql = "UPDATE expenses \
            SET date=DATE(%s), vendor_id=%s, \
            amount=%s, broad_category_id=%s, \
            narrow_category_id=%s, person_id=%s, \
            notes=%s\
            WHERE id=%s;"
        engine.connect().execute(sql, [date, vendor, amount, b_cat, n_cat, person, notes, id])
        return Response(f'id: {id} Updated', status=200)

# Delete expenses
@bp.route("/<int:id>", methods=['DELETE'])
def delete_expenses(id):
    valid_token = checkAuth(request)
    if not valid_token:
        return Response("Nice Try!", status=401)
    else:
        sql = "DELETE FROM expenses WHERE id=%s;"
        engine.connect().execute(sql, [id])
        return Response(f'id: {id} Deleted', status=200)

# Return Pivot Table
# DEPRICATED
@bp.route("/pivot/<year>/<month>")
def api_pivot(year, month):
    valid_token = checkAuth(request)
    if not valid_token:
        return Response("Nice Try!", status=401)
    else:
        year_month = year + "-" + month    
        month = datetime.strptime(year_month, '%Y-%m')
        start_date = (month - timedelta(days=1)).date()
        end_date = (month + relativedelta(months=+1)).date()
        sql = "SELECT date, v.name AS vendor, amount, b.name AS broad_category, n.name AS narrow_category, p.name AS Person, notes FROM expenses e \
                    LEFT JOIN vendors v ON v.id=e.vendor_id \
                    LEFT JOIN broad_categories b ON b.id=e.broad_category_id \
                    LEFT JOIN persons p ON p.id=e.person_id \
                    LEFT JOIN narrow_categories n ON n.id=e.narrow_category_id \
            WHERE user_id=%s AND date > %s AND date < %s;"

        EXP_dataframe = pd.read_sql(sql, con=engine, params=[valid_token['id'], start_date, end_date], parse_dates=['date'])
        EXP_dataframe['broad_category'] = EXP_dataframe['broad_category'].str.replace('_', ' ')
        EXP_dataframe['narrow_category'] = EXP_dataframe['narrow_category'].str.replace('_', ' ')
        PT_report = pd.pivot_table(EXP_dataframe, values='amount', index=['broad_category', 'narrow_category'], aggfunc=np.sum)
        PT_report_broad = pd.pivot_table(EXP_dataframe, values='amount', index='broad_category', aggfunc=np.sum)
        PT_report_broad.index = pd.MultiIndex.from_product([PT_report_broad.index, ['x----TOTAL']], names=['broad_category', 'narrow_category'])
        PT_report = pd.concat([PT_report, PT_report_broad]).sort_index()
        PT_report['amount'] = PT_report['amount'].apply(format_numbers)
        return PT_report.to_json(orient="table")
