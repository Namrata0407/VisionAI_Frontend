import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const OnboardingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  padding: 20px;
  
  @media (max-width: 767px) {
    padding: 16px;
  }
`;

const SlideContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 800px;
  width: 100%;
  min-height: 500px;
  
  @media (max-width: 767px) {
    min-height: 400px;
    max-width: 100%;
  }
`;

const SlideCard = styled(motion.div)`
  background: rgba(0, 255, 255, 0.05);
  border: 2px solid #00ffff;
  border-radius: 15px;
  padding: 40px;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.2);
  width: 100%;
  
  @media (max-width: 767px) {
    padding: 24px;
    border-radius: 10px;
  }
`;

const FeatureIcon = styled.div`
  font-size: 80px;
  margin-bottom: 30px;
  text-shadow: 0 0 20px currentColor;
  animation: float 3s ease-in-out infinite;
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @media (max-width: 767px) {
    font-size: 60px;
    margin-bottom: 20px;
  }
`;

const FeatureTitle = styled.h2`
  color: #00ffff;
  font-family: 'Orbitron', monospace;
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-shadow: 0 0 20px #00ffff;
  
  @media (max-width: 767px) {
    font-size: 1.8rem;
    margin-bottom: 16px;
  }
`;

const FeatureDescription = styled.p`
  color: #ffffff;
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 30px;
  opacity: 0.9;
  
  @media (max-width: 767px) {
    font-size: 1rem;
    margin-bottom: 20px;
  }
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    color: #ff0066;
    font-size: 1.1rem;
    margin-bottom: 12px;
    position: relative;
    padding-left: 30px;
    
    &:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #00ffff;
      font-weight: bold;
      text-shadow: 0 0 10px #00ffff;
    }
    
    @media (max-width: 767px) {
      font-size: 0.95rem;
      margin-bottom: 8px;
      padding-left: 25px;
    }
  }
`;

const NavigationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin-top: 30px;
  
  @media (max-width: 767px) {
    flex-direction: column;
    gap: 16px;
    margin-top: 20px;
  }
`;

const NavButton = styled(motion.button)`
  background: transparent;
  border: 2px solid ${props => props.primary ? '#ff0066' : '#00ffff'};
  color: ${props => props.primary ? '#ff0066' : '#00ffff'};
  padding: 12px 24px;
  font-family: 'Orbitron', monospace;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  font-size: 14px;
  min-width: 120px;
  
  &:hover {
    box-shadow: 0 0 20px ${props => props.primary ? '#ff0066' : '#00ffff'};
    text-shadow: 0 0 10px ${props => props.primary ? '#ff0066' : '#00ffff'};
    background: ${props => props.primary ? 'rgba(255, 0, 102, 0.1)' : 'rgba(0, 255, 255, 0.1)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 767px) {
    width: 100%;
    padding: 10px 20px;
    font-size: 12px;
  }
`;

const ProgressIndicator = styled.div`
  display: flex;
  gap: 8px;
  
  @media (max-width: 767px) {
    gap: 6px;
  }
`;

const ProgressDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.active ? '#00ffff' : 'rgba(0, 255, 255, 0.3)'};
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? '0 0 10px #00ffff' : 'none'};
  
  @media (max-width: 767px) {
    width: 10px;
    height: 10px;
  }
`;

const WelcomeTitle = styled(motion.h1)`
  font-size: 3.5rem;
  background: linear-gradient(45deg, #00ffff, #ff0066);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
  margin-bottom: 20px;
  font-family: 'Orbitron', monospace;
  
  @media (max-width: 767px) {
    font-size: 2.2rem;
    margin-bottom: 16px;
  }
`;

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'welcome',
      icon: '🤖',
      title: 'Welcome to VisionAI',
      description: 'Experience the future of AI-powered assistance with our cyberpunk-themed dashboard.',
      features: [
        'Biometric face authentication - no passwords needed',
        'Real-time emotion detection and analysis',
        'Voice commands in Hindi and English',
        'Futuristic cyberpunk UI with neon effects',
        'Personalized AI responses based on your mood'
      ]
    },
    {
      id: 'face-auth',
      icon: '👤',
      title: 'Face Authentication',
      description: 'Secure, passwordless login using advanced face recognition technology.',
      features: [
        'Register your face in seconds',
        'Instant biometric authentication',
        'No passwords to remember',
        'Secure face descriptor storage',
        'Works in various lighting conditions'
      ]
    },
    {
      id: 'emotion-detection',
      icon: '😊',
      title: 'Emotion Detection',
      description: 'AI analyzes your facial expressions to understand your mood and provide personalized responses.',
      features: [
        'Real-time emotion analysis',
        'Detects happy, sad, angry, surprised, and more',
        'Personalized greetings based on your mood',
        'Mood-aware AI responses',
        'Continuous emotion monitoring'
      ]
    },
    {
      id: 'voice-commands',
      icon: '🎤',
      title: 'Voice Commands',
      description: 'Control your dashboard with natural voice commands in Hindi and English.',
      features: [
        'Voice recognition in multiple languages',
        'Natural language understanding',
        'Start projects with voice commands',
        'Ask about your mood and get insights',
        'Hands-free dashboard navigation'
      ]
    },
    {
      id: 'palm-reading',
      icon: '🔮',
      title: 'Palm Reading',
      description: 'Upload palm images and get AI-powered fortune predictions and personality insights.',
      features: [
        'Upload multiple palm images',
        'AI-powered palm line analysis',
        'Fortune predictions in Hindi and English',
        'Personality, career, and love insights',
        'Voice narration of predictions'
      ]
    },
    {
      id: 'features',
      icon: '⚡',
      title: 'Additional Features',
      description: 'Explore more powerful features designed for productivity and entertainment.',
      features: [
        'Project templates for quick starts',
        'Relaxing mode for break times',
        'Ambient sci-fi background audio',
        'Responsive design for all devices',
        'Continuous updates with new features'
      ]
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToRegister = () => {
    navigate('/register');
  };

  const skipOnboarding = () => {
    navigate('/login');
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <OnboardingContainer>
      <SlideContainer>
        <AnimatePresence mode="wait" custom={currentSlide}>
          <SlideCard
            key={currentSlide}
            custom={currentSlide}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
          >
            {currentSlide === 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <WelcomeTitle>
                  VisionAI
                </WelcomeTitle>
              </motion.div>
            )}
            
            <FeatureIcon>{slides[currentSlide].icon}</FeatureIcon>
            
            <FeatureTitle>{slides[currentSlide].title}</FeatureTitle>
            
            <FeatureDescription>
              {slides[currentSlide].description}
            </FeatureDescription>
            
            <FeaturesList>
              {slides[currentSlide].features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  {feature}
                </motion.li>
              ))}
            </FeaturesList>
          </SlideCard>
        </AnimatePresence>
        
        <NavigationContainer>
          <NavButton
            onClick={prevSlide}
            disabled={currentSlide === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Previous
          </NavButton>
          
          <ProgressIndicator>
            {slides.map((_, index) => (
              <ProgressDot key={index} active={index === currentSlide} />
            ))}
          </ProgressIndicator>
          
          {currentSlide === slides.length - 1 ? (
            <NavButton
              primary
              onClick={goToRegister}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started →
            </NavButton>
          ) : (
            <NavButton
              onClick={nextSlide}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next →
            </NavButton>
          )}
        </NavigationContainer>
      </SlideContainer>
      
      <motion.div
        style={{ position: 'absolute', top: '20px', right: '20px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <NavButton
          onClick={skipOnboarding}
          style={{ fontSize: '12px', padding: '8px 16px' }}
        >
          Skip & Login
        </NavButton>
      </motion.div>
    </OnboardingContainer>
  );
};

export default Onboarding;
