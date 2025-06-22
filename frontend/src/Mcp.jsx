import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MessageCircle, Send, Bot, User } from "lucide-react";
import logo from './update.png';


export default function FastMCPChat({ username }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendMessage = async () => {
    if (!input.trim()) return;

    if (!username) {
      alert("שגיאה: שם המשתמש אינו זמין. אנא התחבר מחדש.");
      setLoading(false);
      return;
    }

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ query: input, username }),
      });

      const data = await response.json();
      const botMessage = { role: "assistant", content: data?.response ?? "[No response]" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("שגיאה בשליחת הודעה לשרת:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "[שגיאה ביצירת קשר עם השרת]" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff1f7] to-[#e9d8fd] flex flex-col" dir="rtl">
      <header className="bg-white/90 backdrop-blur-md border-b border-pink-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
               <img src={logo} alt="לוגו" className="h-12 w-auto" />
            <div className="h-12 w-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex justify-center items-center text-white">
              <Bot className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-xl font-semibold text-gray-800">שלומי</h1>
              <p className="text-sm text-gray-500">הבוט לתמיכה רגשית</p>
            </div>

          </div>
          <button
            onClick={() => navigate("/homePage")}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            חזרה לדף הבית
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 flex flex-col">
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
                <MessageCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">שלום! אני שלומי</h2>
              <p className="text-gray-600">
                אני כאן לעזור לכם עם תמיכה רגשית ועצות לזוגיות. <br />
                איך אני יכול לעזור לכם היום?
              </p>
            </div>
          </div>
        )}

        {messages.length > 0 && (
          <div className="flex-1 bg-white rounded-xl border border-pink-200 shadow-lg mb-6 overflow-hidden">
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-xs px-4 py-3 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                        : "bg-gray-100 text-gray-800 border border-gray-200"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  {msg.role === "user" && (
                    <div className="h-8 w-8 rounded-full bg-pink-200 flex items-center justify-center">
                      <User className="h-4 w-4 text-pink-700" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-pink-200 shadow-lg p-4">
          <div className="flex gap-3 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
              placeholder="כתבו את ההודעה שלכם כאן..."
              className="flex-1 resize-none border border-pink-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500"
              rows={1}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 rounded-xl"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
