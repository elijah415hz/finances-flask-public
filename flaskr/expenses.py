from flask import Blueprint, Response, request, send_file
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import pandas as pd
from io import BytesIO
from .db import engine
from .auth import checkAuth

# Create Blueprint
bp = Blueprint('expenses', __name__, url_prefix='/api/expenses')

# Helper function to return formatted numbers
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
        EXP_report = pd.read_sql(sql, con=engine, params=[valid_token['id'], start_date, end_date], parse_dates=['date'])
        EXP_report.set_index('date', inplace=True)
        EXP_report['amount'] = EXP_report['amount'].apply(format_numbers)
        return EXP_report.to_json(orient="table")

# Helper function to enter expense into the database (Used by post_expense and post_expenses_batch)
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

# Load in batch of expenses (Used when expenses have been logged offline and app reconnects)
@bp.route("/batch", methods=["POST"])
def post_batch_expense():
    json = request.get_json()
    valid_token = checkAuth(request)
    if not valid_token:
        return Response("Nice Try!", status=401)
    else:
        for row in json:
            json['user_id'] = valid_token['id']
            insert_expense(row)
        return Response('Records Inserted!', status=200)


# Edit an expense record by id
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
        vendor = json['vendor'] or ""
        notes = json['notes']
        
        with engine.connect() as con:
            insert_vendor_sql = "INSERT IGNORE INTO vendors(name, user_id) VALUES(%s, %s)"
            con.execute(insert_vendor_sql, [vendor, valid_token['id']])
            get_vendor_id_sql = "SELECT id FROM vendors WHERE name = %s"
            vendor_id = con.execute(get_vendor_id_sql, [vendor]).fetchone()[0]

            sql = "UPDATE expenses \
                SET date=DATE(%s), vendor_id=%s, \
                amount=%s, broad_category_id=%s, \
                narrow_category_id=%s, person_id=%s, \
                notes=%s\
                WHERE id=%s;"
            con.execute(sql, [date, vendor_id, amount, b_cat, n_cat, person, notes, id])
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

# Return Excel file
@bp.route("/file/<start>/<end>") # Dates formatted '%Y-%m-%d'
def expenses_file(start, end):
    validToken = checkAuth(request)
    if not validToken:
        return Response("Nice Try!", status=401)
    else:
        user_id = validToken['id']
        start_date = datetime.strptime(start, '%Y-%m-%d')
        end_date = datetime.strptime(end, '%Y-%m-%d')
        # Get Expenses
        EXP_sql = "SELECT e.id, e.person_id, e.broad_category_id, e.narrow_category_id, e.vendor_id, e.date, v.name AS vendor, e.amount, b.name AS broad_category, n.name AS narrow_category, p.name AS person, notes FROM expenses e \
                    LEFT JOIN vendors v ON v.id=e.vendor_id \
                    LEFT JOIN broad_categories b ON b.id=e.broad_category_id \
                    LEFT JOIN persons p ON p.id=e.person_id \
                    LEFT JOIN narrow_categories n ON n.id=e.narrow_category_id \
                    WHERE e.user_id=%s AND date > %s AND date < %s \
                    ORDER BY date;"
        EXP_report = pd.read_sql(EXP_sql, con=engine, params=[user_id, start_date, end_date], parse_dates=['date'])
        EXP_report['date'] = EXP_report['date'].dt.strftime("%m/%d/%Y")
        drop_columns = [c for c in EXP_report.columns if c[-2:] == 'id']
        EXP_report.drop(columns=drop_columns, inplace=True)
        EXP_report.columns = EXP_report.columns.str.title()
        EXP_report.set_index('Date', inplace=True)
        EXP_report.columns = EXP_report.columns.str.replace("_", " ")
        # Get Income
        INC_sql = "SELECT i.id, i.source_id, i.person_id as person_id, date, amount, s.name AS source, p.name AS person\
                    FROM income i\
                    LEFT JOIN sources s ON s.id=i.source_id\
                    LEFT JOIN persons p ON p.id=i.person_id\
                    WHERE i.user_id=%s AND date > %s AND date < %s\
                    ORDER BY date;"
        INC_report = pd.read_sql(INC_sql, con=engine, params=[user_id, start_date, end_date], parse_dates=['date'])
        INC_report['date'] = INC_report['date'].dt.strftime("%m/%d/%Y")
        drop_columns = [c for c in INC_report.columns if c[-2:] == 'id']
        INC_report.drop(columns=drop_columns, inplace=True)
        INC_report.columns = INC_report.columns.str.title()
        INC_report.set_index('Date', inplace=True)
        # Write to File
        buffer = BytesIO()
        writer = pd.ExcelWriter(buffer, engine='xlsxwriter')
        title_format = writer.book.add_format({'bold': True, 'font_size': 20})
        num_format = writer.book.add_format({'num_format': "$#,##0.00"})
        EXP_report.to_excel(writer, sheet_name='Expenses', startcol = 0, startrow = 2)
        INC_report.to_excel(writer, sheet_name='Income', startcol = 0, startrow = 2)
        # Styling Expenses
        expenses = writer.sheets['Expenses']
        expenses.set_column('A:G', 18)
        expenses.set_row(0, 30)
        expenses.set_column('C:C', None, num_format)
        expenses.write_string(0, 0, 'Expenses', title_format)
        # Styling Income
        income = writer.sheets['Income']
        income.set_column('A:G', 18)
        income.set_row(0, 30)
        income.set_column('B:B', None, num_format)
        income.write_string(0, 0, 'Income', title_format)
        writer.save()
        buffer.seek(0)
        return send_file(buffer, attachment_filename="reports.xlsx", cache_timeout=0)