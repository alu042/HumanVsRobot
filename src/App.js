import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserContext from './components/UserContext';
import LandingPage from './components/LandingPage';
import QuestionPage from './components/QuestionPage';
import ProgressPage from './components/ProgressPage';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [userData, setUserData] = useState({});

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/question" element={<QuestionPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;