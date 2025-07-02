import React, { useState, useEffect } from 'react'; // <--- ודא שיש import React, useState, useEffect
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import HomePage from './HomePage';
import FastMCPChat from "./Mcp";
import Register from './Register';
import QuestionsPage from './QuestionsPage';


const App = () => {
  const [currentUser, setCurrentUser] = useState(null);


  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);


  const handleLoginSuccess = (username) => {
    setCurrentUser(username);
    localStorage.setItem('username', username);
  };

  return (
    <Router>
      <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={ <Login onLoginSuccess={handleLoginSuccess} />} />}
          <Route path="/homePage" element={<HomePage />} />
          <Route path="/chat" element={<FastMCPChat username={currentUser} />} />
          <Route path="/chat2" element={<FastMCPChat username={currentUser} />} /> 
          <Route path="/register" element={<Register />} />
          <Route path="/QuestionsPage" element={<QuestionsPage />} />

      </Routes>
    </Router>
  );
};

export default App;

