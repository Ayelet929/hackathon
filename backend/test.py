import os
import requests
import json
from dotenv import load_dotenv
from fastmcp import FastMCP
from google import genai

# טעינת משתני סביבה מהקובץ .env
load_dotenv()

# הגדרת משתנים ל-Azure OpenAI
# חשוב לוודא שמשתנים אלו מוגדרים בקובץ .env שלך
AZURE_OPENAI_KEY = os.getenv("AZURE_OPENAI_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")  # חייב להסתיים ב־ /
AZURE_OPENAI_DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT")
AZURE_OPENAI_API_VERSION = "2024-02-01" # ודאי שזו הגרסה הנכונה
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# וודא שכל המשתנים קיימים
if not all([AZURE_OPENAI_KEY, AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_DEPLOYMENT]):
    print("שגיאה: חסרים משתני סביבה עבור Azure OpenAI. ודאי שקובץ .env מוגדר כראוי.")
    exit(1)

# יצירת מופע MCP לבוט זוגיות
mcp = FastMCP("relationship_bot")

from fastapi.middleware.cors import CORSMiddleware
#
# mcp.middleware = CORSMiddleware = FastMCP(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# TOOL 1 - טיפ זוגי לפי נושא
@mcp.tool()
def relationship_tip(topic: str) -> str:
    tips = {
        "תקשורת": "דברו בגוף ראשון ושתפו רגשות בלי להאשים. זה בונה אמון 💬",
        "אמון": "אמון נבנה דרך עקביות, כנות ועמידה בהבטחות קטנות 🤝",
        "ריחוק": "תכננו זמן איכות קצר כל יום — אפילו 10 דקות יקרבו ביניכם 💑",
        "כעס": "לפני שאתם מגיבים — שאלו את עצמכם 'מה באמת אני מרגיש/ה?' 🌿"
    }
    return tips.get(topic, "נושא חשוב! נסו לגשת אליו ברגישות ובסבלנות ❤️")

# TOOL 2 - תגובה לרגש של אחד מבני הזוג
@mcp.tool()
def handle_feeling(feeling: str) -> str:
    feelings = {
        "כעס": "זה טבעי לכעוס. נסו לא לומר דברים קשים כשאתם כועסים. דברו כשתירגעו 🕊️",
        "עצב": "עצוב לשמוע. שתפו את בן/בת הזוג — אולי זו הזדמנות לקרבה 💞",
        "שמחה": "מעולה! שתפו רגעים טובים — זה מחזק את הקשר ☀️",
        "תסכול": "נסו להבין מה בדיוק גרם לתסכול. שיחה פתוחה תעזור להבין אחד את השני 🤝"
    }
    return feelings.get(feeling, "כל רגש הוא תקף. שיתוף פתוח עם בן/בת הזוג יכול לעזור מאוד.")

# TOOL 3 - בדיקה יומית רגשית
@mcp.tool()
def daily_checkin(name: str) -> str:
    return f"{name}, איך את/ה מרגיש/ה היום לגבי הקשר שלכם? האם יש משהו שהיית רוצה לחזק או לשפר יחד? 🌱"

# TOOL 4 - שליחת שאלה ל-Azure OpenAI
@mcp.tool()
def ask_openai(prompt: str) -> str:


    gemini_client = genai.Client(api_key="AIzaSyDWiaqm-MKsOYslIhYn_EM_DdlqWc6kL5k")


    response = gemini_client.models.generate_content(
        model="gemini-2.0-flash", contents=prompt
    )
    return(response.text)

    url = f"{AZURE_OPENAI_ENDPOINT}openai/deployments/{AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version={AZURE_OPENAI_API_VERSION}"
    headers = {
        "Content-Type": "application/json",
        "api-key": AZURE_OPENAI_KEY
    }
    data = {
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 500,
        "top_p": 0.95,
        "frequency_penalty": 0,
        "presence_penalty": 0
    }

    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        return result["choices"][0]["message"]["content"]
    except requests.exceptions.RequestException as e:
        return f"שגיאה בבקשה ל-Azure OpenAI: {e}"
    except KeyError:
        return "שגיאה: מבנה תשובה לא צפוי מ-Azure OpenAI."

    # TOOL 4 - שליחת שאלה ל-Azure OpenAI
@mcp.tool()
def ask_openaiRel(prompt: str) -> str:

        gemini_client = genai.Client(api_key="AIzaSyDWiaqm-MKsOYslIhYn_EM_DdlqWc6kL5k")

        response = gemini_client.models.generate_content(
            model="gemini-2.0-flash", contents="אתה מומחה לזגיות זוג שאל שאלה בנושא מריבה  "+prompt+"תן לו תשובה ממוקדת וקצרה "
        )
        return (response.text)

        url = f"{AZURE_OPENAI_ENDPOINT}openai/deployments/{AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version={AZURE_OPENAI_API_VERSION}"
        headers = {
            "Content-Type": "application/json",
            "api-key": AZURE_OPENAI_KEY
        }
        data = {
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7,
            "max_tokens": 500,
            "top_p": 0.95,
            "frequency_penalty": 0,
            "presence_penalty": 0
        }

        try:
            response = requests.post(url, headers=headers, json=data)
            response.raise_for_status()
            result = response.json()
            return result["choices"][0]["message"]["content"]
        except requests.exceptions.RequestException as e:
            return f"שגיאה בבקשה ל-Azure OpenAI: {e}"
        except KeyError:
            return "שגיאה: מבנה תשובה לא צפוי מ-Azure OpenAI."

@mcp.resource("openai-rel://{prompt}")
def ask_openaiRel(prompt: str) -> str:
    try:
        # קריאה ל-Gemini
        gemini_client = genai.Client(api_key="AIzaSyDWiaqm-MKsOYslIhYn_EM_DdlqWc6kL5k")

        response = gemini_client.models.generate_content(
            model="gemini-2.0-flash",
            contents=f"אתה מומחה לזוגיות. זוג שאל שאלה בנושא מריבה: {prompt}. תן תשובה ממוקדת וקצרה."
        )
        return response.text

    except Exception as e:
        return f"שגיאה ב-Gemini: {e}"

    # אם את רוצה להפעיל גם את Azure במקום/בנוסף:
    # [הקוד של Azure OpenAI – אפשר לשלב אם צריך]


@mcp.tool(
    name="general_relationship_tip",
    description=(
        "הכלי הזה נותן טיפ זוגי כללי לפי ההודעה של המשתמש. "
        "למשל, לשפר תקשורת, לבנות אמון, תכנון זמן איכות, וכו׳."
    )
)
def general_relationship_tip(message: str) -> str:
    if "תקשורת" in message:
        return "נסו לדבר בגוף ראשון, שתפו רגשות מבלי להאשים 💬"
    if "אמון" in message:
        return "אמון נבנה דרך עקביות וכנות 🤝"
    return "כל מערכת יחסים משתפרת כשמקדישים זמן איכות יומי של 10 דקות 💑"


if __name__ == "__main__":
    print("שרת FastMCP פועל. פתח את FastMCP Inspector או שלח בקשות.")
    # כאן את יכולה לשלוט ב-host וב-port
    mcp.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allows all origins
        allow_credentials=True,
        allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE, etc.)
        allow_headers=["*"],  # Allows all headers
    )
    mcp.run(transport="streamable-http", port=8080,host='localhost', path="/mcp/")