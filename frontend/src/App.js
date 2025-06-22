import React, { useState, useEffect } from 'react'; // <--- ודא שיש import React, useState, useEffect
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import HomePage from './HomePage';
import FastMCPChat from "./Mcp"; // שם הרכיב שלך FastMCPChat, אבל הקובץ Mcp.jsx
import Register from './Register';
import QuestionsPage from './QuestionsPage';


const App = () => {
  // <--- הוספה חדשה: מצב לשמירת שם המשתמש המחובר
  const [currentUser, setCurrentUser] = useState(null);

  // <--- הוספה חדשה: שימוש ב-useEffect לשמירת המשתמש בין רענונים
  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []); // ריצה רק פעם אחת בטעינת הרכיב

  // <--- הוספה חדשה: פונקציה שתקבל את שם המשתמש מ-Login.jsx
  const handleLoginSuccess = (username) => {
    setCurrentUser(username);
    localStorage.setItem('username', username);
  };

  return (
    <Router>
      <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={ <Login onLoginSuccess={handleLoginSuccess} />} /> {/* <--- שינוי כאן: העבר את הפונקציה כ-prop */}
          <Route path="/homePage" element={<HomePage />} />
          <Route path="/chat" element={<FastMCPChat username={currentUser} />} />
          <Route path="/chat2" element={<FastMCPChat username={currentUser} />} /> {/* גם כאן */}
          <Route path="/register" element={<Register />} />
          <Route path="/QuestionsPage" element={<QuestionsPage />} />

      </Routes>
    </Router>
  );
};

export default App;

