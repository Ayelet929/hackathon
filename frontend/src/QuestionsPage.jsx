"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Heart, Send, CheckCircle, ArrowRight } from "lucide-react"

const questions = [
  { id: 2, question: "מהם קווים אדומים עבורך בהתנהגות של בן/ בת הזוג?" },
  { id: 1, question: "מה התחביבים שלך?" },
  { id: 4, question: "מה הכי חשוב לך בזוגיות?" },
  { id: 3, question: "מה עוזר לך להירגע אחרי ריב?" },
]

// מיפוי של id לעמודה המתאימה בטבלה
const idToColumn = {
  1: "a",
  2: "b",
  3: "c",
  4: "d",
}

export default function QuestionnairePage() {
  const navigate = useNavigate()
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAnswerChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const username = localStorage.getItem("username")

    const payload = { username }
    Object.entries(answers).forEach(([id, answer]) => {
      const col = idToColumn[String(id)]
      if (col) payload[col] = answer
    })

    try {
      const response = await fetch("http://localhost:8000/api/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to send data to server")
      }

      const result = await response.json()
      console.log("Success:", result)
      setSubmitted(true)
    } catch (error) {
      console.error("Error submitting:", error)
      alert("אירעה שגיאה בשליחת השאלון")
    } finally {
      setIsSubmitting(false)
    }
  }

  const completedAnswers = Object.keys(answers).filter((id) => answers[id]?.trim()).length
  const progressPercentage = (completedAnswers / questions.length) * 100

  if (submitted) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-[#fff1f7] to-[#e9d8fd] flex items-center justify-center px-6"
        dir="rtl"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full border border-pink-200">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🎉 השאלון הושלם בהצלחה!</h2>
          <p className="text-gray-600 mb-6">
            תודה שחלקתם איתנו את המחשבות שלכם. התשובות שלכם יעזרו לנו להכיר אתכם טוב יותר.
          </p>
          <button
            onClick={() => navigate("/homePage")}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition flex items-center justify-center gap-2"
          >
            <ArrowRight className="h-5 w-5" />
            חזרה לדף הבית
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff1f7] to-[#e9d8fd] px-6 py-8" dir="rtl">
      {/* כותרת עליונה */}
      <header className="max-w-2xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-pink-200 shadow-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">שאלון היכרות זוגי</h1>
              <p className="text-gray-600">חלקו איתנו את המחשבות והרגשות שלכם</p>
            </div>
          </div>

          {/* מד התקדמות */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>התקדמות</span>
              <span>
                {completedAnswers} מתוך {questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* תוכן השאלון */}
      <main className="max-w-2xl mx-auto space-y-6">
        {questions.map((q, index) => (
          <div key={q.id} className="bg-white rounded-2xl border border-pink-200 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-6 py-4 border-b border-pink-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{q.question}</h3>
              </div>
            </div>

            <div className="p-6">
              <textarea
                rows={4}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none transition-colors resize-none text-gray-700 placeholder-gray-400"
                placeholder="שתפו את המחשבות שלכם כאן..."
                value={answers[q.id] || ""}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
              />
              {answers[q.id]?.trim() && (
                <div className="flex items-center gap-2 mt-3 text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>תשובה נשמרה</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* כפתור שליחה */}
        <div className="bg-white rounded-2xl border border-pink-200 shadow-lg p-6">
          <button
            onClick={handleSubmit}
            disabled={questions.some((q) => !answers[q.id]?.trim()) || isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
              questions.some((q) => !answers[q.id]?.trim()) || isSubmitting
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                שולח תשובות...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                שלח תשובות
              </>
            )}
          </button>

          {questions.some((q) => !answers[q.id]?.trim()) && (
            <p className="text-center text-gray-500 text-sm mt-3">אנא השלימו את כל השאלות לפני השליחה</p>
          )}
        </div>

        {/* כפתור חזרה */}
        <div className="text-center">
          <button
            onClick={() => navigate("/homePage")}
            className="text-gray-600 hover:text-gray-800 transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowRight className="h-4 w-4" />
            חזרה לדף הבית
          </button>
        </div>
      </main>
    </div>
  )
}
