import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const GreetingContainer = styled.div`
  text-align: center;
  padding: 30px;
  border: 1px solid ${props => getEmotionColor(props.emotion)};
  border-radius: 15px;
  background: rgba(0, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  margin: 20px 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, ${props => getEmotionColor(props.emotion)}22, transparent);
    animation: shimmer 3s ease-in-out infinite;
  }

  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }
`;

const GreetingText = styled(motion.p)`
  font-size: 18px;
  color: ${props => getEmotionColor(props.emotion)};
  font-weight: 700;
  margin: 0;
  text-shadow: 0 0 10px ${props => getEmotionColor(props.emotion)};
  line-height: 1.6;
  position: relative;
  z-index: 1;
`;

const EmotionIcon = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
  animation: emotionBob 2s ease-in-out infinite;

  @keyframes emotionBob {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
`;

const SpeakButton = styled.button`
  background: transparent;
  border: 2px solid ${props => getEmotionColor(props.emotion)};
  color: ${props => getEmotionColor(props.emotion)};
  padding: 12px 24px;
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  margin-top: 20px;
  border-radius: 25px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;

  &:hover {
    box-shadow: 0 0 20px ${props => getEmotionColor(props.emotion)};
    text-shadow: 0 0 10px ${props => getEmotionColor(props.emotion)};
  }
`;

const getEmotionColor = (emotion) => {
  const colors = {
    happy: '#00ff00',
    sad: '#4169e1',
    angry: '#ff0000',
    surprised: '#ffa500',
    fearful: '#800080',
    disgusted: '#008000',
    neutral: '#00ffff'
  };
  return colors[emotion] || '#00ffff';
};

const getEmotionIcon = (emotion) => {
  const icons = {
    happy: '😊',
    sad: '😔',
    angry: '😠',
    surprised: '😲',
    fearful: '😰',
    disgusted: '🤢',
    neutral: '😐'
  };
  return icons[emotion] || '🤖';
};

const VoiceGreeting = ({ greeting, emotion, userName }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);

  useEffect(() => {
    // Auto-speak greeting when component mounts or emotion changes
    if (!hasSpoken && greeting) {
      setTimeout(() => {
        speak(greeting);
        setHasSpoken(true);
      }, 1500);
    }
  }, [greeting, hasSpoken]);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      // Choose voice based on emotion
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Prefer female voice for friendly emotions, male for serious ones
        const preferFemale = ['happy', 'surprised', 'neutral'].includes(emotion);
        const voice = voices.find(v => 
          v.lang.includes('en') && 
          (preferFemale ? v.name.includes('Female') || v.name.includes('Zira') : v.name.includes('Male') || v.name.includes('David'))
        ) || voices.find(v => v.lang.includes('en')) || voices[0];
        utterance.voice = voice;
      }
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const handleSpeak = () => {
    speak(greeting);
  };

  return (
    <GreetingContainer emotion={emotion}>
      <EmotionIcon>
        {getEmotionIcon(emotion)}
      </EmotionIcon>
      
      <GreetingText
        emotion={emotion}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {greeting}
      </GreetingText>
      
      <SpeakButton 
        emotion={emotion}
        onClick={handleSpeak}
        disabled={isPlaying}
      >
        {isPlaying ? '🔊 SPEAKING...' : '🔊 REPEAT MESSAGE'}
      </SpeakButton>
    </GreetingContainer>
  );
};

export default VoiceGreeting;
