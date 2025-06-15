"use client"

import { useState } from "react"
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

  const handleStartChat = () => {
    navigate("/chat")
  }

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
    <div className="min-h-screen bg-gradient-to-br from-[#fff1f7] to-[#e9d8fd] px-4 py-6 font-sans" dir="rtl">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-pink-200 shadow-sm">
        <div className="max-w-2xl mx-auto flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-full bg-pink-200 flex items-center justify-center text-pink-700">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">שלום, שרה ודני!</h1>
              <p className="text-sm text-gray-500">יחד כבר 2 שנים ו-3 חודשים 💕</p>
            </div>
          </div>
          <button className="text-gray-500 hover:text-gray-700 transition">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto space-y-6 mt-6">
        {showNotification && (
          <div className="relative rounded-xl bg-gradient-to-r from-pink-400 to-purple-500 text-white p-5 shadow-md">
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-start">
                <div className="bg-white/20 p-2 rounded-full">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">התזכורת היומית שלכם</p>
                  <p className="text-sm text-white/90 mt-1">
                    "אהבה אמיתית היא כשאתם מוצאים שלום בחברת האדם השני"
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="text-white/80 hover:text-white text-xl leading-none"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-pink-200 shadow-lg p-5 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center mb-3">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">בוט התמיכה הרגשית</h2>
          <p className="text-gray-600 text-sm mt-1">כאן בשבילכם 24/7 לשיחה, עצות ותמיכה</p>
          <button
            onClick={handleStartChat}
            className="mt-4 w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-2 rounded-xl hover:from-pink-600 hover:to-purple-700 transition"
          >
            התחילו שיחה עם שלומי עכשיו
          </button>
          <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            זמין עכשיו
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="bg-white border border-purple-200 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-purple-50 transition">
            <User className="h-6 w-6 text-purple-600" />
            <span className="text-sm font-medium">הפרופיל הזוגי</span>
          </button>
          <button className="bg-white border border-pink-200 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-pink-50 transition">
            <Settings className="h-6 w-6 text-pink-600" />
            <span className="text-sm font-medium">עדכון השאלון</span>
          </button>
        </div>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">פעילויות מומלצות לכם</h3>
            <span className="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full">חדש</span>
          </div>

          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex bg-white border rounded-xl overflow-hidden hover:shadow-md cursor-pointer transition"
              >
                <div className="w-20 h-20 flex items-center justify-center bg-gray-100 text-pink-500">
                  <activity.icon className="h-6 w-6" />
                </div>
                <div className="flex-1 p-4">
                  <h4 className="text-gray-800 font-semibold">{activity.title}</h4>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                    <Calendar className="h-3 w-3" />
                    {activity.duration}
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
