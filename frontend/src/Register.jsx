import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.status === 200) {
        localStorage.setItem('username', username);
        navigate('/QuestionsPage');
      } else {
        setErrorMessage(data.detail || 'שגיאה ביצירת משתמש');
      }
    } catch (err) {
      console.error('Register failed:', err);
      setErrorMessage('שגיאה בשרת');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleRegister} className="login-form">
        <h2>צור חשבון</h2>
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

        <button type="submit">צור חשבון והמשך לשאלון</button>
      </form>
    </div>
  );
};

export default Register;
