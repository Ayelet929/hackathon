from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
from pydantic import BaseModel
from fastmcp import FastMCP
import uvicorn
import google.generativeai as genai


#   connect to -Supabase
supabase_url: str = "https://vkvibzhdbdtilxjufgxx.supabase.co"
supabase_key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrdmliemhkYmR0aWx4anVmZ3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NzIxOTgsImV4cCI6MjA2NTI0ODE5OH0.AuNY0XaM5EKzBINOVR_DPXj0WUYhhRxhzyStYGjilLQ"
supabase = create_client(supabase_url, supabase_key)

#  FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mcp = FastMCP("relationship_bot")

# modelim for POST
class LoginRequest(BaseModel):
    username: str
    password: str

class UpdateAnswers(BaseModel):
    username: str
    a: str = None
    b: str = None
    c: str = None
    d: str = None

class QueryRequest(BaseModel):
    query: str

# call func to GEMINI
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
        return f"שגיאה בקריאה ל-Gemini: {e}"

# ✔️ endpoint for login
@app.post("/api/login")
async def login(login_data: LoginRequest):
    username = login_data.username
    password = login_data.password

    print(f"Username: {username}, Password: {password}")

    try:
        response = supabase.table('update').select('*').eq('id', username).execute()
        print(f"Supabase response: {response.data}")

        if response.data:
            user_data = response.data[0]
            if user_data.get("password", "").strip() == password.strip():
                return JSONResponse(content={"message": "ההתחברות בוצעה בהצלחה!"}, status_code=200)
            else:
                raise HTTPException(status_code=401, detail="שם המשתמש או הסיסמא לא נכונים!")
        else:
            raise HTTPException(status_code=401, detail="שם המשתמש או הסיסמא לא נכונים!")
    except Exception as e:
        print(f"Error during login: {e}")
        raise HTTPException(status_code=500, detail=f"שגיאה פנימית בשרת: {e}")

#  endpoint questions
@app.post("/api/query")
async def handle_user_query(user_query: QueryRequest):
    query_string = user_query.query
    print(f"Received user query: {query_string}")

    try:
        gemini_response = ask_gemini_rel(query_string)
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
@app.post("/api/update")
async def save_answers(update_data: UpdateAnswers):
    try:
        response = supabase.table("update").update({
            "a": update_data.a,
            "b": update_data.b,
            "c": update_data.c,
            "d": update_data.d
        }).eq("id", update_data.username).execute()

        return JSONResponse(
            content={"status": "success", "data": response.data},
            status_code=200
        )

    except Exception as e:
        print(f"שגיאה בשמירת תשובות: {e}")
        raise HTTPException(status_code=500, detail=f"שגיאה בשמירת תשובות: {e}")



# location
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
