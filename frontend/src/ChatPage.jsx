import { useState } from "react"

const ChatPage = () => {
  const [userInput, setUserInput] = useState("")
  const [messages, setMessages] = useState([])

  // סימולציה של צ'אטבוט - תחליפי בקריאה אמיתית ל-API שלך
  const sendMessageToBot = async (message) => {
    // כאן מחזירים תשובה מדומה מהבוט
    return `הבוט עונה: קיבלתי את "${message}"`
  }

  const handleSend = async () => {
    if (!userInput.trim()) return

    const userMessage = { from: "user", text: userInput }
    setMessages((prev) => [...prev, userMessage])
    setUserInput("")

    const botReplyText = await sendMessageToBot(userMessage.text)
    const botMessage = { from: "bot", text: botReplyText }
    setMessages((prev) => [...prev, botMessage])
  }

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "1rem", direction: "rtl" }}>
      <h2>צ'אט עם הבוט הזוגי 💬</h2>
      <div style={{ border: "1px solid #ccc", padding: "1rem", minHeight: "300px", overflowY: "auto", marginBottom: "1rem" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.from === "user" ? "right" : "left", margin: "0.5rem 0" }}>
            <span><strong>{msg.from === "user" ? "את/ה" : "הבוט"}:</strong> {msg.text}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="כתוב/י הודעה לבוט..."
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button onClick={handleSend} style={{ padding: "0.5rem 1rem" }}>שלח</button>
      </div>
    </div>
  )
}

export default ChatPage
