import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Login'; //  Login.jsx
import HomePage from './HomePage'; //  Chat.jsx
import FastMCPChat from "./Mcp";

import Register from './Register';

const App = () => {
  return (
      <Router>
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={ <Login />} />
            <Route path="/homePage" element={<HomePage />} />
            <Route path="/chat" element={<FastMCPChat />} />
            <Route path="/chat2" element={<FastMCPChat />} />
            <Route path="/register" element={<Register />} />

        </Routes>
    </Router>
  );
};

export default App;

