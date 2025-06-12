from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client

# הגדרת ה-URL וה-API Key של Supabase ישירות בקוד
supabase_url = "https://vkvibzhdbdtilxjufgxx.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrdmliemhkYmR0aWx4anVmZ3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NzIxOTgsImV4cCI6MjA2NTI0ODE5OH0.AuNY0XaM5EKzBINOVR_DPXj0WUYhhRxhzyStYGjilLQ"

# יצירת הלקוח של Supabase
supabase = create_client(supabase_url, supabase_key)

app = Flask(__name__)
CORS(app)  # מאפשר ל-Frontend לשלוח בקשות לשרת הזה
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    print("username: " + username + "password: " + password)

    # שליפה מהטבלה ב-Supabase (users) לפי שם המשתמש
    response = supabase.table('update').select('*').eq('id', username).execute()
    print(response)

    if response.data:
        user_data = response.data[0]
        if user_data["password"].strip() == password.strip():
            return jsonify({"message": "ההתחברות בוצעה בהצלחה!"}), 200
        else:
            return jsonify({"message": "שם המשתמש או הסיסמא לא נכונים!"}), 401
    else:
        return jsonify({"message": "שם המשתמש או הסיסמא לא נכונים!"}), 500

if __name__ == "__main__":
    app.run(debug=True)
