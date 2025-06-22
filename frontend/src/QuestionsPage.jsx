"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

const questions = [
  { id: 2, question: "מהם קווים אדומים עבורך בהתנהגות של בן/ בת הזוג?" },
  { id: 1, question: "מה התחביבים שלך?" },
  { id: 4, question: "מה הכי חשוב לך בזוגיות?" },
  { id: 3, question: "מה עוזר לך להירגע אחרי ריב?" }
];

// מיפוי של id לעמודה המתאימה בטבלה
const idToColumn = {
  1: "a",
  2: "b",
  3: "c",
  4: "d"
};

export default function QuestionnairePage() {
  const navigate = useNavigate()
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleAnswerChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async () => {
    const username = localStorage.getItem("username");

    const payload = { username };
    Object.entries(answers).forEach(([id, answer]) => {
      const col = idToColumn[String(id)];
      if (col) payload[col] = answer;
    });

    try {
      const response = await fetch("http://localhost:8000/api/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to send data to server");
      }

      const result = await response.json();
      console.log("Success:", result);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting:", error);
      alert("אירעה שגיאה בשליחת השאלון");
    }
  }

  if (submitted) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>✅ השאלון הושלם בהצלחה</h2>
        <button onClick={() => navigate("/")}>חזרה לדף הבית</button>
      </div>
    )
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }} dir="rtl">
      <h1>שאלון היכרות זוגי</h1>
      {questions.map((q, index) => (
        <div key={q.id} style={{ marginBottom: "2rem" }}>
          <h3>{index + 1}. {q.question}</h3>
          <textarea
            rows={4}
            style={{ width: "100%" }}
            value={answers[q.id] || ""}
            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
          />
        </div>
      ))}
      <button
        onClick={handleSubmit}
        disabled={questions.some(q => !answers[q.id]?.trim())}
        style={{ marginTop: "1rem" }}
      >
        שלח תשובות
      </button>
    </div>
  )
}
