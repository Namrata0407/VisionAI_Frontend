import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  position: relative;
  z-index: 2;
`;

const WelcomeText = styled(motion.div)`
  text-align: center;
  margin-bottom: 40px;
  
  h1 {
    font-size: 3rem;
    margin-bottom: 20px;
    background: linear-gradient(45deg, #00ffff, #ff0066);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
  }
  
  p {
    font-size: 1.2rem;
    color: #00ffff;
    margin-bottom: 10px;
    opacity: 0.9;
  }
  
  .subtitle {
    font-size: 1rem;
    color: #ff0066;
    opacity: 0.7;
  }
`;

const RegisterButton = styled(motion.button)`
  background: transparent;
  border: 2px solid #00ffff;
  color: #00ffff;
  padding: 16px 32px;
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    box-shadow: 
      0 0 30px #00ffff,
      inset 0 0 30px rgba(0, 255, 255, 0.1);
    text-shadow: 0 0 10px #00ffff;
    transform: translateY(-2px);
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

const LoginButton = styled(motion.button)`
  background: transparent;
  border: 2px solid #ff0066;
  color: #ff0066;
  padding: 12px 24px;
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;

  &:hover {
    box-shadow: 
      0 0 20px #ff0066,
      inset 0 0 20px rgba(255, 0, 102, 0.1);
    text-shadow: 0 0 10px #ff0066;
  }
`;

const WelcomeScreen = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/onboarding');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <Container className="container">
      <WelcomeText
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="neon-text">VISION AI</h1>
        <p>Advanced Biometric Authentication System</p>
        <p className="subtitle">Your AI-Powered Assistant Dashboard</p>
      </WelcomeText>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{ textAlign: 'center' }}
        className="welcome-buttons"
      >
        <RegisterButton
          onClick={handleRegister}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="welcome-button cyber-button"
        >
          Explore Features & Register
        </RegisterButton>

        <div style={{ 
          margin: '30px 0', 
          color: '#888', 
          fontSize: '14px',
          opacity: 0.6
        }}>
          Already registered?
        </div>

        <LoginButton
          onClick={handleLogin}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="welcome-button cyber-button"
        >
          Face Login
        </LoginButton>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{ 
          position: 'absolute', 
          bottom: '40px', 
          textAlign: 'center',
          color: '#00ffff',
          fontSize: '12px',
          opacity: 0.5
        }}
        className="hide-mobile"
      >
        <p>◆ No passwords required ◆</p>
        <p>◆ Secure biometric authentication ◆</p>
        <p>◆ Real-time emotion detection ◆</p>
      </motion.div>
    </Container>
  );
};

export default WelcomeScreen;
