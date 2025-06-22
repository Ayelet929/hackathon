"use client"

import { useState } from "react"
import logo from './update.png';

import { useNavigate } from "react-router-dom"
import {
  Heart,
  MessageCircle,
  User,
  Settings,
  Calendar,
  Coffee,
  Camera,
  Music,
  Utensils,
} from "lucide-react"

export default function HomePage() {
  const [showNotification, setShowNotification] = useState(true)
  const navigate = useNavigate()

  // נווט לדף השיחה
  const handleStartChat = () => {
    navigate("/chat")
  }

  // מערך פעילויות מומלצות
  const activities = [
    {
      id: 1,
      title: "ערב בישול רומנטי",
      description: "הכינו ארוחה מיוחדת יחד",
      icon: Utensils,
      duration: "2-3 שעות",
    },
    {
      id: 2,
      title: "טיול צילום בעיר",
      description: "גלו פינות חדשות ותתעדו רגעים",
      icon: Camera,
      duration: "3-4 שעות",
    },
    {
      id: 3,
      title: "ערב מוזיקה ביתי",
      description: "שתפו פלייליסטים והקשיבו יחד",
      icon: Music,
      duration: "1-2 שעות",
    },
    {
      id: 4,
      title: "בית קפה חדש",
      description: "נסו מקום חדש בשכונה",
      icon: Coffee,
      duration: "1 שעה",
    },
  ]

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#fff1f7] to-[#e9d8fd] px-6 py-8 font-sans"
      dir="rtl"
    >
      {/* כותרת עליונה - פרופיל והגדרות */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-pink-200 shadow-sm">
        <div className="max-w-2xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-5">
            <div className="h-12 w-12 rounded-full bg-pink-200 flex items-center justify-center text-pink-700">

              <User className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                שלום, שרה ודני!
              </h1>
              <p className="text-sm text-gray-500">
                יחד כבר 2 שנים ו-3 חודשים 💕
              </p>
            </div>
          </div>
<img src={logo} alt="לוגו" className="h-20 w-auto" />
          <button
            aria-label="הגדרות"
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <Settings className="h-5 w-5" />
          </button>

        </div>
      </header>

      {/* תוכן ראשי */}
      <main className="max-w-2xl mx-auto space-y-8 mt-8">
        {/* תזכורת יומית */}
        {showNotification && (
          <div className="relative rounded-xl bg-gradient-to-r from-pink-400 to-purple-500 text-white p-6 shadow-lg">
            <div className="flex justify-between items-start">
              <div className="flex gap-4 items-start">
                <div className="bg-white/20 p-3 rounded-full">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-lg">התזכורת היומית שלכם</p>
                  <p className="text-sm text-white/90 mt-1 leading-relaxed max-w-xs">
                    "אהבה אמיתית היא כשאתם מוצאים שלום בחברת האדם השני"
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowNotification(false)}
                aria-label="סגור התראה"
                className="text-white/80 hover:text-white text-2xl font-bold leading-none"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* בוט התמיכה */}
        <div className="bg-white rounded-xl border border-pink-200 shadow-xl p-6 text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <MessageCircle className="h-10 w-10 text-white" />
          </div>

          <h2 className="text-2xl font-extrabold text-gray-800 mb-1">
            בוט התמיכה הרגשית
          </h2>
          <p className="text-gray-600 text-base mb-4">
            כאן בשבילכם 24/7 לשיחה, עצות ותמיכה
          </p>

          <button
            onClick={handleStartChat}
            className="mt-2 w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition"
          >
            התחילו שיחה עם שלומי עכשיו
          </button>

          <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-500">
            <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
            זמין עכשיו
          </div>
        </div>

        {/* כפתורי ניווט לפרופיל ולעדכון שאלון */}
        <div className="grid grid-cols-2 gap-5">
          <button
            className="bg-white border border-purple-200 rounded-xl p-5 flex flex-col items-center gap-3 hover:bg-purple-50 transition"
            aria-label="הפרופיל הזוגי"
          >
            <User className="h-7 w-7 text-purple-600" />
            <span className="text-sm font-semibold">הפרופיל הזוגי</span>
          </button>

          <button
            className="bg-white border border-pink-200 rounded-xl p-5 flex flex-col items-center gap-3 hover:bg-pink-50 transition"
            onClick={() => navigate("/QuestionsPage")} // navigate to the questionnaire page
            aria-label="עדכון השאלון"
          >
            <Settings className="h-7 w-7 text-pink-600" />
            <span className="text-sm font-semibold">עדכון השאלון</span>
          </button>
        </div>

        {/* פעילויות מומלצות */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              פעילויות מומלצות לכם
            </h3>
            <span className="bg-pink-100 text-pink-700 text-xs px-3 py-1 rounded-full font-semibold">
              חדש
            </span>
          </div>

          <div className="space-y-5">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg cursor-pointer transition"
                tabIndex={0}
                role="button"
                aria-label={`פעילות: ${activity.title}`}
              >
                <div className="w-24 h-24 flex items-center justify-center bg-gray-100 text-pink-500">
                  <activity.icon className="h-7 w-7" />
                </div>
                <div className="flex-1 p-5">
                  <h4 className="text-gray-800 font-semibold text-lg">
                    {activity.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                    <Calendar className="h-4 w-4" />
                    <span>{activity.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
