from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
from pydantic import BaseModel
#from fastmcp import FastMCP
import uvicorn
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()
supabase_url = os.getenv("API_SUPABASE_URL")
supabase_key=os.getenv("API_SUPABASE_KEY")
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

#mcp = FastMCP("relationship_bot")

# modelim for POST
class LoginRequest(BaseModel):
    username: str
    password: str

class User(BaseModel):
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
    username: str

# call func to GEMINI
def ask_gemini_rel(prompt: str) -> str:
    try:
        genai.configure(api_key="AIzaSyDWiaqm-MKsOYslIhYn_EM_DdlqWc6kL5k")
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
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
    username = user_query.username
    print(f"Received user query: {query_string} from user: {username}")

    user_data = None
    # started one big try block to handle all the logic of the function
    # this includes fetching from Supabase, building the prompt, and calling Gemini.
    try:
        response = supabase.table('update').select('a, b, c, d').eq('id', username).execute()
        if response.data and response.data[0]:
            user_data = response.data[0]
            print(f"User data from Supabase: {user_data}")
        else:
            print(f"No user data found for {username} in Supabase.")

        full_prompt = (
            "אתה יועץ זוגי עם ניסיון של מעל 10 שנים. המטרה שלך היא לתת מענה ברור, רגשי, ומעשי לשאלות זוגיות. "
            "ענה בגובה העיניים, בקצרה, בלי לחזור על עצמך ובלי להשתמש בניסוחים כלליים או מורכבים מדי. "
            "אם יש מידע אישי על האדם, שלב אותו בתשובה רק אם הוא רלוונטי ישירות לשאלה – ואל תשלב מידע שאינו קשור. "
            "לעולם אל תמציא מידע שלא ניתן, ואל תניח הנחות שלא מבוססות. "
            "המענה שלך צריך להיות אישי אך ענייני, עם תובנה אחת ברורה או פעולה פשוטה שאפשר ליישם מיד. "
        )

        if user_data:
            full_prompt += (
                "הנה מידע אישי על האדם – השתמש רק במה שרלוונטי לשאלה, ואל תצטט את זה מילה במילה: "
            )
            if user_data.get('a'):
                full_prompt += f"קווים אדומים בזוגיות: {user_data['a']}. "
            if user_data.get('b'):
                full_prompt += f"תחביבים: {user_data['b']}. "
            if user_data.get('c'):
                full_prompt += f"הכי חשוב לו/לה בזוגיות: {user_data['c']}. "
            if user_data.get('d'):
                full_prompt += f"מה שעוזר לו/לה להירגע אחרי ריב: {user_data['d']}. "

        full_prompt += f"\n\nהשאלה: '{query_string}'"
        full_prompt += "\nענה בצורה ברורה, רגשית, ממוקדת – עם מסר אחד ברור או המלצה שאפשר לבצע בפועל."


        full_prompt += f" זאת השאלה שנשאלה : {query_string} תענה בצורה ממוקדת וקצרה ,  "


        gemini_response = ask_gemini_rel(full_prompt)
        print(f"Received Gemini response: {gemini_response}")

        # the returned response
        return JSONResponse(
            content={
                "query": query_string,
                "response": gemini_response,
                "status": "success"
            },
            status_code=200
        )

    except Exception as e:
        # this is the main except block that will catch any error that occurs inside the try block
        print(f"Error processing query or fetching data for user {username}: {e}")
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

users_db = {}
@app.post("/api/register")
def register(user: User):
    try:
        existing = supabase.table("update").select("*").eq("id", user.username).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="שם המשתמש כבר קיים")

        result = supabase.table("update").insert({
            "id": user.username.strip(),
            "password": user.password,
            "a": None,
            "b": None,
            "c": None,
            "d": None
        }).execute()

        print(f"הוספת משתמש חדשה: {result.data}")
        return {"message": "המשתמש נוצר בהצלחה"}

    except Exception as e:
        print(f"שגיאה בהרשמה: {e}")
        raise HTTPException(status_code=500, detail=f"שגיאה בהרשמה: {e}")

# location
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
