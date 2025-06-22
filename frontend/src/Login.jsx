import React, { useState } from 'react';
import './Login.css';
import Header from "./Header";
import { useNavigate } from 'react-router-dom';

// שינוי 1: הוסף onLoginSuccess כ-prop
const Login = ({ onLoginSuccess }) => { // <--- שינוי כאן
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username, password }),
      });

      const data = await res.json();
      if (res.status === 200) {
          // שינוי 2: קרא לפונקציה onLoginSuccess והעבר לה את שם המשתמש
          if (onLoginSuccess) { // ודא שהפונקציה קיימת לפני הקריאה
              onLoginSuccess(username); // <--- קריטי: מעבירים את שם המשתמש לרכיב ההורה (App.js)
          }
          localStorage.setItem("username", username); // עדיין כדאי לשמור ליתר ביטחון/שימור
          navigate("/homePage"); // נווט לדף הבית כפי שאתה רוצה
      } else {
        setErrorMessage(data.message || 'שגיאה בהתחברות');
      }
    } catch (err) {
      console.log('Login failed', err);
      setErrorMessage('שגיאה בשרת');
    }
  };

  return (
    // ... שאר ה-JSX נשאר ללא שינוי בקובץ זה
    <>
      <Header />
      <div className="login-container">
        <form onSubmit={handleLogin} className="login-form">
          <h2>התחברות</h2>
          <label htmlFor="username">שם משתמש:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="password">סיסמה:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit">התחבר</button>

          <p className="register-link">
            אין לכם חשבון?{" "}
            <span
              style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => navigate('/register')}
            >
              הירשמו כאן
            </span>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;