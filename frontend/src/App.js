import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react';
import Login from './Login'; // אם יש לך קובץ Login.jsx
import HomePage from './HomePage'; // אם יש לך קובץ Chat.jsx
import ChatPage from './ChatPage'
import FastMCPChat from "./Mcp";
const App = () => {
  return (
      <Router>
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={ <Login />} />
            <Route path="/homePage" element={<HomePage />} />
            <Route path="/chat" element={<FastMCPChat />} />
            <Route path="/chat2" element={<FastMCPChat />} />

        </Routes>
    </Router>
  );
};

export default App;

