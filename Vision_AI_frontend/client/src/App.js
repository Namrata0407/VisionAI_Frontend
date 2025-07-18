import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Dashboard from './components/Dashboard';
import FaceRecognition from './components/FaceRecognition';
import Registration from './components/Registration';
import WelcomeScreen from './components/WelcomeScreen';
import Onboarding from './components/Onboarding';
import BackgroundAudio from './components/BackgroundAudio';
import axios from 'axios';
import './App.css';
import './responsive.css';

const AppContainer = styled.div`
  min-height: 100vh;
  background: radial-gradient(ellipse at center, #0f1419 0%, #000000 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      linear-gradient(90deg, transparent 0%, #00ffff11 50%, transparent 100%),
      linear-gradient(0deg, transparent 0%, #ff006611 50%, transparent 100%);
    animation: scanLines 4s linear infinite;
    pointer-events: none;
    z-index: 1;
  }

  @keyframes scanLines {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
`;

const GridOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridPulse 3s ease-in-out infinite;
  pointer-events: none;

  @keyframes gridPulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.1; }
  }
`;

function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasRegisteredUsers, setHasRegisteredUsers] = useState(false);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('visionai_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    
    // Check if there are any registered users
    checkForRegisteredUsers();
  }, []);

  const checkForRegisteredUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/check-users`);
      setHasRegisteredUsers(response.data.hasUsers);
    } catch (error) {
      console.error('Error checking for users:', error);
      setHasRegisteredUsers(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('visionai_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('visionai_user');
  };

  const handleRegistrationComplete = (userData) => {
    setHasRegisteredUsers(true);
    // Don't auto-login after registration, redirect to login
  };

  return (
    <Router>
      <AppContainer>
        <GridOverlay />
        <BackgroundAudio />
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <Dashboard user={user} onLogout={handleLogout} /> : 
                <WelcomeScreen />
            } 
          />
          <Route 
            path="/onboarding" 
            element={<Onboarding />} 
          />
          <Route 
            path="/register" 
            element={<Registration onRegister={handleRegistrationComplete} />} 
          />
          <Route 
            path="/login" 
            element={<FaceRecognition onLogin={handleLogin} />} 
          />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
