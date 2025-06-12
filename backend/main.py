from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
from pydantic import BaseModel
from fastmcp import FastMCP
import uvicorn
import os
import google.generativeai as genai

supabase_url: str = "https://vkvibzhdbdtilxjufgxx.supabase.co"
supabase_key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrdmliemhkYmR0aWx4anVmZ3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NzIxOTgsImV4cCI6MjA2NTI0ODE5OH0.AuNY0XaM5EKzBINOVR_DPXj0WUYhhRxhzyStYGjilLQ"

supabase = create_client(supabase_url, supabase_key)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # מאפשר לכל המקורות (אתרים) לשלוח בקשות
    allow_credentials=True,
    allow_methods=["*"],  # מאפשר את כל השיטות (GET, POST, וכו')
    allow_headers=["*"],  # מאפשר את כל הכותרות
)

mcp = FastMCP("relationship_bot")


class LoginRequest(BaseModel):
    username: str
    password: str


class QueryRequest(BaseModel):
    query: str


def ask_openaiRel(prompt: str) -> str:
    try:
        genai.configure(api_key="AIzaSyDWiaqm-MKsOYslIhYn_EM_DdlqWc6kL5k")

        model = genai.GenerativeModel("gemini-1.5-flash")  # או "gemini-1.5-pro" או אחר

        response = model.generate_content(
            f"אתה מומחה לזוגיות. שאלו אותך: {prompt}. תן תשובה קצרה וממוקדת."
        )

        return response.text
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return f"שגיאה בקריאה ל-Gemini: {e}"


def ask_gemini_rel(prompt: str) -> str:
    try:
        genai.configure(api_key="AIzaSyDWiaqm-MKsOYslIhYn_EM_DdlqWc6kL5k")

        model = genai.GenerativeModel("gemini-1.5-flash")

        response = model.generate_content(
            f"אתה מומחה לזוגיות. שאלו אותך: {prompt}. תן תשובה קצרה וממוקדת."
        )

        if response and hasattr(response, 'text'):
            return response.text.strip()
        else:
            return "לא התקבלה תשובה תקפה מהמודל."

    except Exception as e:
        print(f"שגיאה בקריאה ל-Gemini: {e}")
        print(f"שגיאה בקריאה ל-Gemini: {e}")
        return f"שגיאה בקריאה ל-Gemini: {e}"


@app.post("/api/login")
async def login(login_data: LoginRequest):
    """
    נקודת קצה לטיפול בבקשות התחברות.
    מקבל שם משתמש וסיסמה, מאמת מול Supabase ומחזיר סטטוס התחברות.
    """
    username = login_data.username
    password = login_data.password

    print(f"Username: {username}, Password: {password}")

    try:
        # שליפה מהטבלה ב-Supabase ('update') לפי מזהה המשתמש (id)
        response = supabase.table('update').select('*').eq('id', username).execute()
        print(f"Supabase response: {response.data}")

        if response.data:
            user_data = response.data[0]
            # השוואת הסיסמה (מומלץ לאחסן סיסמאות מוצפנות ולבצע השוואה מוצפנת)
            if user_data.get("password", "").strip() == password.strip():
                return JSONResponse(content={"message": "ההתחברות בוצעה בהצלחה!"}, status_code=200)
            else:
                raise HTTPException(status_code=401, detail="שם המשתמש או הסיסמא לא נכונים!")
        else:
            raise HTTPException(status_code=401, detail="שם המשתמש או הסיסמא לא נכונים!")
    except Exception as e:
        print(f"Error during login: {e}")
        # במקרה של שגיאה ב-Supabase או אחרת, מחזיר שגיאת שרת פנימית
        raise HTTPException(status_code=500, detail=f"שגיאה פנימית בשרת: {e}")


@app.post("/api/query")
async def handle_user_query(user_query: QueryRequest):
    """
    נקודת קצה לטיפול בשאלות משתמש.
    מקבל שאלה מהמשתמש, שולח ל-Gemini ומחזיר תשובה.
    """
    query_string = user_query.query
    print(f"Received user query: {query_string}")

    try:
        # שליחת השאלה ל-Gemini וקבלת תשובה
        gemini_response = ask_openaiRel(query_string)
        print(f"Received: {gemini_response}")

        return JSONResponse(
            content={
                "query": query_string,
                "response": gemini_response,
                "status": "success"
            },
            status_code=200
        )
    except Exception as e:
        print(f"Error processing query: {e}")
        raise HTTPException(status_code=500, detail=f"שגיאה בעיבוד השאלה: {e}")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)