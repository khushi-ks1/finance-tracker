from flask import Flask, render_template, request, redirect, url_for
import sqlite3

# Tell Flask to serve static files from project root
app = Flask(__name__, static_url_path='', static_folder='.')

DATABASE = 'transactions.db'

# Initialize database
def init_db():
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            type TEXT,
            category TEXT,
            amount REAL,
            description TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# Home route
@app.route('/')
def index():
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('SELECT * FROM transactions')
    transactions = c.fetchall()
    
    # Calculate totals
    total_income = sum(t[4] for t in transactions if t[2] == 'Income')
    total_expense = sum(t[4] for t in transactions if t[2] == 'Expense')
    balance = total_income - total_expense
    
    # Prepare data for chart
    category_data = {}
    for t in transactions:
        if t[2] == 'Expense':
            category_data[t[3]] = category_data.get(t[3], 0) + t[4]
    
    conn.close()
    return render_template('index.html', transactions=transactions, 
                           total_income=total_income, total_expense=total_expense, 
                           balance=balance, category_data=category_data)

# Add transaction
@app.route('/add', methods=['POST'])
def add_transaction():
    date = request.form['date']
    type_ = request.form['type']
    category = request.form['category']
    amount = float(request.form['amount'])
    description = request.form['description']
    
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('INSERT INTO transactions (date, type, category, amount, description) VALUES (?, ?, ?, ?, ?)',
              (date, type_, category, amount, description))
    conn.commit()
    conn.close()
    return redirect(url_for('index'))

# Delete transaction
@app.route('/delete/<int:id>')
def delete_transaction(id):
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('DELETE FROM transactions WHERE id=?', (id,))
    conn.commit()
    conn.close()
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
