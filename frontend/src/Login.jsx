import React, { useState } from 'react';
import './Login.css'; // אפשרי - אם תרצה להוסיף עיצוב חיצוני
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.status === 200) {
        navigate("/homePage")
      } else {
        setErrorMessage(data.message || 'שגיאה בהתחברות');
      }
    } catch (err) {
      console.log('Login failed', err);
      setErrorMessage('שגיאה בשרת');
    }
  };

  return (
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
        <p className="register-link">אין לכם חשבון? <a href="#">הירשמו כאן</a></p>
      </form>
    </div>
  );
};

export default Login;