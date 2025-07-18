import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled.div`
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: radial-gradient(circle, rgba(0, 100, 200, 0.1) 0%, transparent 70%);
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: transparent;
  border: 2px solid #ff0066;
  color: #ff0066;
  padding: 10px 20px;
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 15px #ff0066;
    text-shadow: 0 0 10px #ff0066;
  }
`;

const RelaxIcon = styled(motion.div)`
  font-size: 120px;
  margin-bottom: 30px;
  filter: drop-shadow(0 0 20px rgba(100, 150, 255, 0.8));
`;

const RelaxTitle = styled(motion.h2)`
  font-size: 2.5rem;
  background: linear-gradient(45deg, #6495ed, #87ceeb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 20px;
  text-shadow: 0 0 30px rgba(100, 149, 237, 0.5);
`;

const RelaxMessage = styled(motion.p)`
  font-size: 18px;
  color: #87ceeb;
  max-width: 600px;
  line-height: 1.8;
  margin-bottom: 40px;
`;

const ActivityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 800px;
  margin: 20px 0;
`;

const ActivityCard = styled(motion.div)`
  padding: 20px;
  border: 2px solid #6495ed;
  border-radius: 15px;
  background: rgba(100, 149, 237, 0.1);
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #87ceeb;
    box-shadow: 0 0 25px rgba(135, 206, 235, 0.4);
    transform: translateY(-5px);
  }
`;

const ActivityIcon = styled.div`
  font-size: 48px;
  margin-bottom: 15px;
`;

const ActivityTitle = styled.h4`
  color: #87ceeb;
  margin-bottom: 10px;
  font-size: 16px;
`;

const ActivityDescription = styled.p`
  color: #b0c4de;
  font-size: 14px;
  line-height: 1.4;
`;

const BreathingCircle = styled(motion.div)`
  width: 150px;
  height: 150px;
  border: 3px solid #6495ed;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30px auto;
  background: radial-gradient(circle, rgba(100, 149, 237, 0.2) 0%, transparent 70%);
`;

const BreathingText = styled.div`
  color: #87ceeb;
  font-weight: 700;
  font-size: 18px;
`;

const RelaxingMode = ({ onBack }) => {
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [isBreathing, setIsBreathing] = useState(false);

  const activities = [
    {
      id: 'breathing',
      icon: '🫁',
      title: 'Breathing Exercise',
      description: 'Guided 4-7-8 breathing technique for instant calm',
      action: () => startBreathing()
    },
    {
      id: 'meditation',
      icon: '🧘‍♀️',
      title: 'Quick Meditation',
      description: '5-minute mindfulness session',
      action: () => startMeditation()
    },
    {
      id: 'music',
      icon: '🎵',
      title: 'Ambient Sounds',
      description: 'Nature sounds and calming music',
      action: () => playAmbientSounds()
    },
    {
      id: 'stretching',
      icon: '🤸‍♀️',
      title: 'Desk Stretches',
      description: 'Simple exercises for your workspace',
      action: () => showStretches()
    },
    {
      id: 'eyerest',
      icon: '👁️',
      title: 'Eye Rest',
      description: '20-20-20 rule for eye strain relief',
      action: () => startEyeRest()
    },
    {
      id: 'quotes',
      icon: '💭',
      title: 'Inspiration',
      description: 'Motivational quotes and affirmations',
      action: () => showInspiration()
    }
  ];

  const startBreathing = () => {
    setIsBreathing(true);
    speakInstructions('Let\'s start with some deep breathing. Follow the circle.');
    
    const cycle = () => {
      // Inhale (4 seconds)
      setBreathingPhase('inhale');
      setTimeout(() => {
        // Hold (7 seconds)
        setBreathingPhase('hold');
        setTimeout(() => {
          // Exhale (8 seconds)
          setBreathingPhase('exhale');
          setTimeout(() => {
            if (isBreathing) cycle(); // Continue if still breathing
          }, 8000);
        }, 7000);
      }, 4000);
    };
    
    cycle();
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    setBreathingPhase('inhale');
  };

  const startMeditation = () => {
    speakInstructions('Close your eyes and focus on your breath. Let your thoughts flow without judgment.');
  };

  const playAmbientSounds = () => {
    speakInstructions('Imagine yourself in a peaceful forest with gentle rain and bird songs.');
  };

  const showStretches = () => {
    speakInstructions('Let\'s do some neck rolls. Slowly roll your head in a circle, then switch directions.');
  };

  const startEyeRest = () => {
    speakInstructions('Look at something 20 feet away for 20 seconds. This helps reduce eye strain.');
  };

  const showInspiration = () => {
    const quotes = [
      "Every expert was once a beginner.",
      "Progress, not perfection.",
      "The best time to plant a tree was 20 years ago. The second best time is now.",
      "Your future self will thank you for the rest you take today."
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    speakInstructions(randomQuote);
  };

  const speakInstructions = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  const getBreathingAnimation = () => {
    switch (breathingPhase) {
      case 'inhale':
        return {
          scale: [1, 1.3],
          transition: { duration: 4, ease: "easeInOut" }
        };
      case 'hold':
        return {
          scale: 1.3,
          transition: { duration: 7, ease: "easeInOut" }
        };
      case 'exhale':
        return {
          scale: [1.3, 1],
          transition: { duration: 8, ease: "easeInOut" }
        };
      default:
        return { scale: 1 };
    }
  };

  const getBreathingText = () => {
    switch (breathingPhase) {
      case 'inhale': return 'INHALE';
      case 'hold': return 'HOLD';
      case 'exhale': return 'EXHALE';
      default: return 'BREATHE';
    }
  };

  return (
    <Container>
      <BackButton onClick={onBack}>
        ← BACK TO DASHBOARD
      </BackButton>

      <RelaxIcon
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        🌙
      </RelaxIcon>

      <RelaxTitle
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        RELAXATION MODE
      </RelaxTitle>

      <RelaxMessage
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Take a moment to recharge. Your mind and body will thank you. 
        Choose an activity below to help you unwind and return refreshed.
      </RelaxMessage>

      {isBreathing && (
        <BreathingCircle
          animate={getBreathingAnimation()}
          onClick={stopBreathing}
          style={{ cursor: 'pointer' }}
        >
          <BreathingText>{getBreathingText()}</BreathingText>
        </BreathingCircle>
      )}

      <ActivityGrid>
        {activities.map((activity, index) => (
          <ActivityCard
            key={activity.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            onClick={activity.action}
          >
            <ActivityIcon>{activity.icon}</ActivityIcon>
            <ActivityTitle>{activity.title}</ActivityTitle>
            <ActivityDescription>{activity.description}</ActivityDescription>
          </ActivityCard>
        ))}
      </ActivityGrid>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{ 
          color: '#b0c4de', 
          fontSize: '14px', 
          marginTop: '30px',
          fontStyle: 'italic'
        }}
      >
        "Rest when you're weary. Refresh and renew yourself, your body, your mind, your spirit."
      </motion.p>
    </Container>
  );
};

export default RelaxingMode;
