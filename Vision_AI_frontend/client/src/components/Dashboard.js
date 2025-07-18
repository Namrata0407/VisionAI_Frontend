import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import * as faceapi from 'face-api.js';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import VoiceGreeting from './VoiceGreeting';
import ProjectTemplates from './ProjectTemplates';
import RelaxingMode from './RelaxingMode';
import PalmReading from './PalmReading';

const DashboardContainer = styled.div`
  min-height: 100vh;
  position: relative;
  z-index: 2;
  
  /* Desktop layout */
  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 280px 1fr 280px;
    grid-template-rows: auto 1fr;
    gap: 20px;
    padding: 20px;
    max-width: 1400px;
    margin: 0 auto;
  }
  
  /* Tablet layout */
  @media (min-width: 768px) and (max-width: 1023px) {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr auto;
    gap: 16px;
    padding: 16px 12px;
    max-width: 1000px;
    margin: 0 auto;
  }
  
  /* Mobile layout */
  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 8px;
    width: 100%;
    overflow-x: hidden;
  }
  
  /* Small mobile */
  @media (max-width: 479px) {
    gap: 8px;
    padding: 4px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border: 1px solid #00ffff;
  background: rgba(0, 255, 255, 0.05);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  
  /* Desktop */
  @media (min-width: 1024px) {
    grid-column: 1 / -1;
    padding: 20px;
  }
  
  /* Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    grid-row: 1;
    flex-wrap: wrap;
    gap: 12px;
    padding: 16px;
    justify-content: center;
  }
  
  /* Mobile */
  @media (max-width: 767px) {
    flex-direction: column;
    text-align: center;
    gap: 12px;
    padding: 12px;
    
    h2 {
      font-size: 16px;
      margin: 0;
    }
  }
  
  /* Small mobile */
  @media (max-width: 479px) {
    padding: 8px;
    gap: 8px;
    
    h2 {
      font-size: 14px;
    }
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  
  /* Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
  }
  
  /* Mobile */
  @media (max-width: 767px) {
    flex-direction: column;
    gap: 8px;
    width: 100%;
    
    h2 {
      font-size: 16px;
      margin: 0;
      text-align: center;
    }
  }
  
  /* Small mobile */
  @media (max-width: 479px) {
    gap: 6px;
    
    h2 {
      font-size: 14px;
    }
  }
`;

const EmotionDisplay = styled.div`
  padding: 10px 20px;
  border: 1px solid ${props => getEmotionColor(props.emotion)};
  color: ${props => getEmotionColor(props.emotion)};
  border-radius: 25px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 0 15px ${props => getEmotionColor(props.emotion)}33;
  animation: emotionPulse 2s ease-in-out infinite;

  @keyframes emotionPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  /* Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    padding: 8px 16px;
    font-size: 14px;
  }
  
  /* Mobile */
  @media (max-width: 767px) {
    padding: 6px 12px;
    font-size: 12px;
    letter-spacing: 0.5px;
  }
`;

const Sidebar = styled.div`
  border: 1px solid #00ffff;
  background: rgba(0, 255, 255, 0.03);
  border-radius: 10px;
  padding: 16px;
  backdrop-filter: blur(10px);
  
  /* Desktop */
  @media (min-width: 1024px) {
    padding: 20px;
  }
  
  /* Tablet layout */
  @media (min-width: 768px) and (max-width: 1023px) {
    padding: 16px;
    
    &:first-of-type {
      grid-row: 2;
    }
    
    &:last-of-type {
      grid-row: 4;
    }
  }
  
  /* Mobile layout */
  @media (max-width: 767px) {
    padding: 12px;
    
    &:first-of-type {
      order: 1;
    }
    
    &:last-of-type {
      order: 3;
    }
    
    h3 {
      font-size: 14px;
      margin-bottom: 12px;
    }
    
    h4 {
      font-size: 12px;
      margin-bottom: 8px;
    }
  }
  
  /* Small mobile */
  @media (max-width: 479px) {
    padding: 8px;
    
    h3 {
      font-size: 12px;
      margin-bottom: 8px;
    }
  }
`;

const MainContent = styled.div`
  border: 1px solid #00ffff;
  background: rgba(0, 255, 255, 0.03);
  border-radius: 10px;
  padding: 20px;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  /* Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    grid-row: 3;
    padding: 16px;
  }
  
  /* Mobile */
  @media (max-width: 767px) {
    order: 2;
    padding: 16px;
    
    h2 {
      font-size: 16px;
      margin-bottom: 20px;
    }
    
    ul {
      font-size: 12px;
      text-align: left;
      list-style: none;
      padding: 0;
      margin: 0;
      width: 100%;
      max-width: 300px;
      
      li {
        margin-bottom: 8px;
        padding: 4px 0;
        border-bottom: 1px solid rgba(0, 255, 255, 0.1);
        
        &:last-child {
          border-bottom: none;
        }
      }
    }
    
    p {
      font-size: 12px;
      margin-bottom: 12px;
    }
  }
  
  /* Small mobile */
  @media (max-width: 479px) {
    padding: 12px;
    
    h2 {
      font-size: 14px;
      margin-bottom: 16px;
    }
    
    ul {
      font-size: 11px;
      max-width: 250px;
      
      li {
        margin-bottom: 6px;
      }
    }
    
    p {
      font-size: 11px;
      margin-bottom: 10px;
    }
  }
`;

const VideoFeed = styled.video`
  width: 180px;
  height: 135px;
  border: 1px solid #ff0066;
  border-radius: 10px;
  object-fit: cover;
  transform: scaleX(-1);
  margin-bottom: 15px;
  
  /* Desktop */
  @media (min-width: 1024px) {
    width: 200px;
    height: 150px;
  }
  
  /* Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    width: 160px;
    height: 120px;
  }
  
  /* Mobile */
  @media (max-width: 767px) {
    width: 140px;
    height: 105px;
    margin-bottom: 12px;
  }
  
  /* Small mobile */
  @media (max-width: 479px) {
    width: 120px;
    height: 90px;
    margin-bottom: 10px;
  }
  
  /* Very small mobile */
  @media (max-width: 380px) {
    width: 100px;
    height: 75px;
  }
`;

const VoiceButton = styled.button`
  background: ${props => props.listening ? 'linear-gradient(45deg, #ff0066, #00ffff)' : 'transparent'};
  border: 2px solid ${props => props.listening ? '#ff0066' : '#00ffff'};
  color: ${props => props.listening ? '#fff' : '#00ffff'};
  padding: 15px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 24px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;

  &:hover {
    box-shadow: 0 0 20px ${props => props.listening ? '#ff0066' : '#00ffff'};
  }
  
  &:active {
    transform: scale(0.95);
  }

  ${props => props.listening && `
    animation: voicePulse 1s ease-in-out infinite;
    
    @keyframes voicePulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
  `}
  
  /* Desktop */
  @media (min-width: 1024px) {
    width: 60px;
    height: 60px;
    font-size: 24px;
    padding: 15px;
  }
  
  /* Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    width: 52px;
    height: 52px;
    font-size: 20px;
    padding: 12px;
  }
  
  /* Mobile */
  @media (max-width: 767px) {
    width: 48px;
    height: 48px;
    font-size: 18px;
    padding: 10px;
  }
  
  /* Small mobile */
  @media (max-width: 479px) {
    width: 44px;
    height: 44px;
    font-size: 16px;
    padding: 8px;
  }
`;

const CommandHistory = styled.div`
  margin-top: 16px;
  max-height: 160px;
  overflow-y: auto;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 255, 255, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: #00ffff;
    border-radius: 2px;
  }
  
  /* Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    max-height: 140px;
    margin-top: 14px;
  }
  
  /* Mobile */
  @media (max-width: 767px) {
    max-height: 100px;
    margin-top: 12px;
    font-size: 10px;
    
    &::-webkit-scrollbar {
      width: 3px;
    }
  }
  
  /* Small mobile */
  @media (max-width: 479px) {
    max-height: 80px;
    margin-top: 10px;
    font-size: 9px;
  }
`;

const Command = styled.div`
  padding: 6px 8px;
  margin: 4px 0;
  background: rgba(0, 255, 255, 0.1);
  border-left: 3px solid #00ffff;
  border-radius: 5px;
  font-size: 11px;
  color: #00ffff;
  word-break: break-word;
  
  /* Mobile */
  @media (max-width: 767px) {
    padding: 4px 6px;
    margin: 3px 0;
    font-size: 10px;
    border-left-width: 2px;
  }
  
  /* Small mobile */
  @media (max-width: 479px) {
    padding: 3px 5px;
    margin: 2px 0;
    font-size: 9px;
  }
`;

const LogoutButton = styled.button`
  background: transparent;
  border: 2px solid #ff0066;
  color: #ff0066;
  padding: 10px 20px;
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 5px;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    box-shadow: 0 0 15px #ff0066;
    text-shadow: 0 0 10px #ff0066;
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  /* Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    padding: 8px 16px;
    font-size: 12px;
  }
  
  /* Mobile */
  @media (max-width: 767px) {
    padding: 8px 16px;
    font-size: 12px;
    font-weight: 600;
  }
  
  /* Small mobile */
  @media (max-width: 479px) {
    padding: 6px 12px;
    font-size: 11px;
    min-width: 60px;
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

const Dashboard = ({ user, onLogout }) => {
  const videoRef = useRef();
  const [currentEmotion, setCurrentEmotion] = useState(user.currentEmotion || 'neutral');
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [commands, setCommands] = useState([]);
  const [currentMode, setCurrentMode] = useState('dashboard');
  const [greeting, setGreeting] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isAnalyzingEmotion, setIsAnalyzingEmotion] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState('hi-IN'); // Default to Hindi
  const timeoutRef = useRef(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    loadModels();
    startVideo();
    generateGreeting();
    loadVoices();
  }, []);

  const loadVoices = () => {
    // Load voices and log available ones
    const loadVoicesFunc = () => {
      const voices = speechSynthesis.getVoices();
      console.log('📢 Available voices:', voices.map(v => ({ name: v.name, lang: v.lang })));
      
      // Find female voices
      const femaleVoices = voices.filter(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('kalpana') ||
        voice.name.toLowerCase().includes('rashmi') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('alice') ||
        voice.name.toLowerCase().includes('victoria') ||
        voice.name.toLowerCase().includes('zira')
      );
      
      console.log('👩 Female voices found:', femaleVoices.map(v => ({ name: v.name, lang: v.lang })));
    };

    // Load voices immediately if available
    if (speechSynthesis.getVoices().length > 0) {
      loadVoicesFunc();
    } else {
      // Wait for voices to be loaded
      speechSynthesis.addEventListener('voiceschanged', loadVoicesFunc);
    }
  };

  useEffect(() => {
    if (transcript && isListening) {
      setCurrentTranscript(transcript);
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set a timeout to process the command after 4 seconds of silence
      // This gives users enough time to complete their sentences
      timeoutRef.current = setTimeout(async () => {
        if (transcript.trim()) {
          await handleVoiceCommand(transcript);
          addCommand(transcript);
          stopListening();
        }
      }, 4000);
    }
  }, [transcript, isListening]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const loadModels = async () => {
    try {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
      ]);
      setModelsLoaded(true);
    } catch (error) {
      console.error('Error loading emotion detection models:', error);
    }
  };

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ 
      video: { width: 200, height: 150, facingMode: 'user' } 
    })
    .then(stream => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    })
    .catch(err => {
      console.error('Error accessing camera:', err);
    });
  };

  const detectEmotion = async () => {
    if (!modelsLoaded || !videoRef.current) return;

    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detection) {
        const emotions = detection.expressions;
        const topEmotion = Object.keys(emotions).reduce((a, b) => 
          emotions[a] > emotions[b] ? a : b
        );
        console.log('🎭 Emotion Detection:', {
          detected: topEmotion,
          confidence: emotions[topEmotion].toFixed(2),
          allEmotions: Object.keys(emotions).map(e => ({ emotion: e, confidence: emotions[e].toFixed(2) }))
        });
        setCurrentEmotion(topEmotion);
      }
    } catch (error) {
      console.error('Error detecting emotion:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(detectEmotion, 3000);
    return () => clearInterval(interval);
  }, [modelsLoaded]);

  const generateGreeting = () => {
    const emotion = currentEmotion;
    const greetings = {
      happy: `Hello ${user.name}, you look energetic today! Ready to build something amazing?`,
      sad: `Hello ${user.name}, you seem a bit down. Would you like to take a break or work on something uplifting?`,
      angry: `Hello ${user.name}, you look frustrated. Want to channel that energy into solving a challenging problem?`,
      surprised: `Hello ${user.name}, you look curious! Perfect time to explore new technologies.`,
      fearful: `Hello ${user.name}, feeling uncertain? Let's start with something familiar and build confidence.`,
      disgusted: `Hello ${user.name}, ready to clean up some code and make things better?`,
      neutral: `Hello ${user.name}, ready to continue with your projects?`
    };
    
    setGreeting(greetings[emotion] || greetings.neutral);
  };

  useEffect(() => {
    generateGreeting();
  }, [currentEmotion]);

  const handleVoiceCommand = async (command) => {
    const lowerCommand = command.toLowerCase().trim();
    
    // Detect the language of the command
    const detectedLanguage = detectLanguage(command);
    console.log('🌐 Language detected:', detectedLanguage, 'for command:', command);
    
    // Hindi Commands
    if (lowerCommand.includes('मेरा मूड') || lowerCommand.includes('मेरी इमेज') || lowerCommand.includes('मेरा mood') || lowerCommand.includes('mera mood') || lowerCommand.includes('mood kaisa hai')) {
      console.log('🎤 Mood query received:', { command: lowerCommand, currentEmotion });
      
      // Get fresh emotion detection result
      let freshEmotion = currentEmotion;
      setIsAnalyzingEmotion(true);
      
      if (modelsLoaded && videoRef.current) {
        try {
          const detection = await faceapi
            .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();

          if (detection) {
            const emotions = detection.expressions;
            freshEmotion = Object.keys(emotions).reduce((a, b) => 
              emotions[a] > emotions[b] ? a : b
            );
            console.log('🎭 Fresh emotion detected for mood query:', { freshEmotion, confidence: emotions[freshEmotion] });
            // Update the state as well
            setCurrentEmotion(freshEmotion);
          }
        } catch (error) {
          console.error('Error getting fresh emotion:', error);
        }
      }
      
      setIsAnalyzingEmotion(false);
      const moodAnalysis = analyzeMoodFromEmotion(freshEmotion);
      console.log('🎭 Mood analysis:', moodAnalysis);
      speak(moodAnalysis.hindi, 'hi-IN');
      return;
    }
    
    if (lowerCommand.includes('हिंदी में बोलो') || lowerCommand.includes('hindi mein bolo') || lowerCommand.includes('speak hindi')) {
      speak("जी हाँ, मैं हिंदी में बोल सकता हूँ। आपकी क्या सेवा कर सकता हूँ?", 'hi-IN');
      return;
    }
    
    if (lowerCommand.includes('प्रोजेक्ट') || lowerCommand.includes('नया प्रोजेक्ट') || lowerCommand.includes('project banao')) {
      setCurrentMode('projects');
      speak("प्रोजेक्ट टेम्प्लेट्स खोल रहा हूँ। आप क्या बनाना चाहते हैं?", 'hi-IN');
      return;
    }
    
    if (lowerCommand.includes('आराम') || lowerCommand.includes('ब्रेक') || lowerCommand.includes('break chahiye')) {
      setCurrentMode('relax');
      speak("आराम का समय! रिलैक्सेशन मोड शुरू कर रहा हूँ।", 'hi-IN');
      return;
    }
    
    if (lowerCommand.includes('हस्तरेखा') || lowerCommand.includes('भविष्य') || lowerCommand.includes('palm reading') || lowerCommand.includes('fortune') || lowerCommand.includes('hastrekha')) {
      setCurrentMode('palmreading');
      speak("हस्तरेखा विज्ञान शुरू कर रहा हूँ। अपने हाथ की तस्वीर अपलोड करें।", 'hi-IN');
      return;
    }
    
    if (lowerCommand.includes('जोक') || lowerCommand.includes('मजाक') || lowerCommand.includes('joke sunao')) {
      const hindiJokes = [
        "एक आदमी दुकान में गया और बोला - भाई दो किलो खुशी दे दो। दुकानदार बोला - साहब, यहाँ मिठाई की दुकान है, खुशी की नहीं!",
        "पत्नी: आज खाने में क्या बनाऊँ? पति: जो भी बनाओ, प्यार से बनाना। पत्नी: अच्छा तो फिर मैगी बना देती हूँ!",
        "टीचर: बताओ 'आम' का अंग्रेजी में क्या होता है? छात्र: कॉमन सर! टीचर: नहीं, मैंगो। छात्र: सॉरी सर, कॉमन मिस्टेक!",
        "डॉक्टर: आपको क्या तकलीफ है? मरीज: डॉक्टर साहब, मुझे भूलने की बीमारी है। डॉक्टर: कब से? मरीज: कौन सी बीमारी?"
      ];
      const randomJoke = hindiJokes[Math.floor(Math.random() * hindiJokes.length)];
      speak(randomJoke, 'hi-IN');
      return;
    }
    
    // Navigation commands (English)
    if (lowerCommand.includes('what is my mood') || lowerCommand.includes('how is my mood') || lowerCommand.includes('my mood') || lowerCommand.includes('current mood')) {
      console.log('🎤 English mood query received:', { command: lowerCommand, currentEmotion });
      
      // Get fresh emotion detection result
      let freshEmotion = currentEmotion;
      setIsAnalyzingEmotion(true);
      
      if (modelsLoaded && videoRef.current) {
        try {
          const detection = await faceapi
            .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();

          if (detection) {
            const emotions = detection.expressions;
            freshEmotion = Object.keys(emotions).reduce((a, b) => 
              emotions[a] > emotions[b] ? a : b
            );
            console.log('🎭 Fresh emotion detected for English mood query:', { freshEmotion, confidence: emotions[freshEmotion] });
            // Update the state as well
            setCurrentEmotion(freshEmotion);
          }
        } catch (error) {
          console.error('Error getting fresh emotion:', error);
        }
      }
      
      setIsAnalyzingEmotion(false);
      const moodAnalysis = analyzeMoodFromEmotion(freshEmotion);
      console.log('🎭 Mood analysis (English):', moodAnalysis);
      speak(moodAnalysis.english, 'en-US');
      return;
    }
    
    if (lowerCommand.includes('project') || lowerCommand.includes('create') || lowerCommand.includes('build')) {
      setCurrentMode('projects');
      speak("Opening project templates for you!", 'en-US');
      return;
    }
    
    if (lowerCommand.includes('break') || lowerCommand.includes('relax') || lowerCommand.includes('rest')) {
      setCurrentMode('relax');
      speak("Time to relax! Opening relaxation mode.", 'en-US');
      return;
    }
    
    if (lowerCommand.includes('palm') || lowerCommand.includes('fortune') || lowerCommand.includes('future') || lowerCommand.includes('prediction')) {
      setCurrentMode('palmreading');
      speak("Opening palm reading mode. Upload your palm photos to know your future!", 'en-US');
      return;
    }
    
    if (lowerCommand.includes('dashboard') || lowerCommand.includes('home')) {
      setCurrentMode('dashboard');
      speak("Returning to dashboard.", 'en-US');
      return;
    }
    
    if (lowerCommand.includes('logout') || lowerCommand.includes('sign out')) {
      speak("Logging you out. Goodbye!", 'en-US');
      setTimeout(() => onLogout(), 2000);
      return;
    }
    
    // Greeting responses
    if (lowerCommand.includes('hello') || lowerCommand.includes('hi') || lowerCommand.includes('hey') || lowerCommand.includes('नमस्ते') || lowerCommand.includes('हैलो')) {
      if (detectedLanguage === 'hi') {
        speak(`नमस्ते ${user.name}! मैं आपका AI असिस्टेंट हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?`, 'hi-IN');
      } else {
        speak(`Hello ${user.name}! I'm your AI assistant. How can I help you today?`, 'en-US');
      }
      return;
    }
    
    if (lowerCommand.includes('how are you') || lowerCommand.includes('how do you feel') || lowerCommand.includes('कैसे हो') || lowerCommand.includes('कैसी हो')) {
      console.log('🎤 How are you query received:', { command: lowerCommand, currentEmotion });
      if (detectedLanguage === 'hi') {
        speak(`मैं बहुत अच्छा हूँ ${user.name}! आपका मूड ${currentEmotion === 'happy' ? 'खुश' : currentEmotion === 'sad' ? 'उदास' : 'सामान्य'} लग रहा है।`, 'hi-IN');
      } else {
        speak(`I'm doing great ${user.name}! Your mood looks ${currentEmotion === 'happy' ? 'happy' : currentEmotion === 'sad' ? 'sad' : 'normal'}.`, 'en-US');
      }
      return;
    }
    
    // Jokes
    if (lowerCommand.includes('joke') || lowerCommand.includes('funny') || lowerCommand.includes('जोक') || lowerCommand.includes('हंसी')) {
      if (detectedLanguage === 'hi') {
        const hindiJokes = [
          "प्रोग्रामर का पसंदीदा ड्रिंक क्या है? Java!",
          "कंप्यूटर डॉक्टर के पास क्यों गया? क्योंकि उसे वायरस हो गया था!",
          "प्रोग्रामर अपनी पत्नी से क्या कहता है? 'बेबी, तुम मेरे लिए बग नहीं हो, तुम फीचर हो!'",
          "HTML और CSS में क्या अंतर है? HTML घर है, CSS सजावट है!",
          "क्यों प्रोग्रामर्स को चाय पसंद नहीं? क्योंकि वो कॉफी स्क्रिप्ट पसंद करते हैं!"
        ];
        const randomJoke = hindiJokes[Math.floor(Math.random() * hindiJokes.length)];
        speak(randomJoke, 'hi-IN');
      } else {
        const englishJokes = [
          "Why don't scientists trust atoms? Because they make up everything!",
          "Why did the developer go broke? Because they used up all their cache!",
          "Why do programmers prefer dark mode? Because light attracts bugs!",
          "What do you call a programmer from Finland? Nerdic!",
          "Why do Java developers wear glasses? Because they don't C sharp!"
        ];
        const randomJoke = englishJokes[Math.floor(Math.random() * englishJokes.length)];
        speak(randomJoke, 'en-US');
      }
      return;
    }
    
    // Time and date
    if (lowerCommand.includes('time') || lowerCommand.includes('what time') || lowerCommand.includes('समय') || lowerCommand.includes('kitne baje')) {
      const now = new Date();
      if (detectedLanguage === 'hi') {
        const timeString = now.toLocaleTimeString('hi-IN');
        speak(`अभी समय है ${timeString}`, 'hi-IN');
      } else {
        const timeString = now.toLocaleTimeString('en-US');
        speak(`The current time is ${timeString}`, 'en-US');
      }
      return;
    }
    
    if (lowerCommand.includes('date') || lowerCommand.includes('what date') || lowerCommand.includes('today') || lowerCommand.includes('आज कौन सा दिन') || lowerCommand.includes('tarikh')) {
      const now = new Date();
      if (detectedLanguage === 'hi') {
        const dateString = now.toLocaleDateString('hi-IN', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        speak(`आज है ${dateString}`, 'hi-IN');
      } else {
        const dateString = now.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        speak(`Today is ${dateString}`, 'en-US');
      }
      return;
    }
    
    // Help and capabilities
    if (lowerCommand.includes('help') || lowerCommand.includes('what can you do') || lowerCommand.includes('commands') || lowerCommand.includes('मदद') || lowerCommand.includes('क्या कर सकते हो')) {
      if (detectedLanguage === 'hi') {
        speak("मैं आपका मूड देखकर बता सकता हूँ, प्रोजेक्ट बनाने में मदद कर सकता हूँ, जोक सुना सकता हूँ, समय बता सकता हूँ, और आपकी हस्तरेखा देखकर भविष्य बता सकता हूँ। बस कहिए 'मेरा मूड कैसा है' या 'हस्तरेखा देखो'!", 'hi-IN');
      } else {
        speak("I can detect your mood, help create projects, tell jokes, give time and date, and read your palm for fortune telling. Just say 'what's my mood' or 'palm reading'!", 'en-US');
      }
      return;
    }
    
    // Name questions
    if (lowerCommand.includes('your name') || lowerCommand.includes('who are you') || lowerCommand.includes('तुम्हारा नाम') || lowerCommand.includes('कौन हो')) {
      if (detectedLanguage === 'hi') {
        speak("मैं Vision AI हूँ, आपका बुद्धिमान सहायक। मैं आपके दैनिक कार्यों में मदद करने के लिए यहाँ हूँ!", 'hi-IN');
      } else {
        speak("I am Vision AI, your intelligent assistant. I'm here to help you with your daily tasks!", 'en-US');
      }
      return;
    }
    
    // User asking about their own name
    if (lowerCommand.includes('my name') || lowerCommand.includes('do you know my name') || lowerCommand.includes('मेरा नाम') || lowerCommand.includes('मेरा नाम क्या है') || lowerCommand.includes('क्या तुम मेरा नाम जानते हो')) {
      if (detectedLanguage === 'hi') {
        speak(`जी हाँ, आपका नाम ${user.name} है। मैं आपको अच्छी तरह से जानता हूँ!`, 'hi-IN');
      } else {
        speak(`Yes, your name is ${user.name}. I know you well!`, 'en-US');
      }
      return;
    }
    
    // Compliments
    if (lowerCommand.includes('thank you') || lowerCommand.includes('thanks') || lowerCommand.includes('धन्यवाद') || lowerCommand.includes('शुक्रिया')) {
      if (detectedLanguage === 'hi') {
        speak("आपका स्वागत है! मुझे आपकी मदद करके खुशी होती है।", 'hi-IN');
      } else {
        speak("You're welcome! I'm happy to help you.", 'en-US');
      }
      return;
    }
    
    // Default response for unrecognized commands - language-aware
    if (detectedLanguage === 'hi') {
      const hindiResponses = [
        "मैं अभी भी सीख रहा हूँ। कृपया पूछें कि मैं क्या कर सकता हूँ।",
        "मुझे समझ नहीं आया। कृपया 'मदद' कहकर मेरी क्षमताएं जानें।",
        "यह दिलचस्प है! आप मुझसे अपना मूड पूछ सकते हैं या जोक सुनने को कह सकते हैं।",
        "मैं अभी भी सीख रहा हूँ! आप कह सकते हैं 'मेरा मूड कैसा है' या 'प्रोजेक्ट बनाओ'।"
      ];
      const randomResponse = hindiResponses[Math.floor(Math.random() * hindiResponses.length)];
      speak(randomResponse, 'hi-IN');
    } else {
      const englishResponses = [
        "I am still in a learning phase, please ask what can I do.",
        "I didn't understand that. Please say 'help' to know my capabilities.",
        "That's interesting! You can ask about your mood or request a joke.",
        "I'm still learning! Try saying 'what's my mood' or 'create project'."
      ];
      const randomResponse = englishResponses[Math.floor(Math.random() * englishResponses.length)];
      speak(randomResponse, 'en-US');
    }
  };

  const analyzeMoodFromEmotion = (emotion) => {
    const moodAnalysis = {
      happy: {
        hindi: `आपका मूड बहुत खुश लग रहा है! आप बहुत अच्छी तरह से हैं। आपकी मुस्कान से पता चलता है कि आप प्रसन्न हैं।`,
        english: "You look very happy! Your smile shows you're in a great mood today."
      },
      sad: {
        hindi: `आप थोड़े उदास लग रहे हैं। क्या आप ठीक हैं? क्या मैं कोई जोक सुनाकर आपका मूड बेहतर कर सकता हूँ?`,
        english: "You seem a bit sad. Are you okay? Would you like me to tell a joke to cheer you up?"
      },
      angry: {
        hindi: `आप गुस्से में लग रहे हैं। क्या कोई परेशानी है? थोड़ा आराम कर लीजिए।`,
        english: "You look frustrated. Is something bothering you? Maybe take a short break."
      },
      surprised: {
        hindi: `आप चौंके हुए लग रहे हैं! कुछ दिलचस्प हुआ है क्या?`,
        english: "You look surprised! Did something interesting happen?"
      },
      fearful: {
        hindi: `आप चिंतित लग रहे हैं। सब कुछ ठीक है, मैं यहाँ आपकी मदद के लिए हूँ।`,
        english: "You look worried. Everything is fine, I'm here to help you."
      },
      disgusted: {
        hindi: `आप नाराज़ लग रहे हैं। क्या कुछ गलत हुआ है?`,
        english: "You look displeased. Did something go wrong?"
      },
      neutral: {
        hindi: `आपका मूड सामान्य लग रहा है। आप शांत और केंद्रित दिख रहे हैं।`,
        english: "Your mood looks neutral. You appear calm and focused."
      }
    };
    
    return moodAnalysis[emotion] || moodAnalysis.neutral;
  };

  const addCommand = (command) => {
    const newCommand = { 
      text: command, 
      timestamp: new Date().toLocaleTimeString() 
    };
    setCommands(prev => [newCommand, ...prev.slice(0, 9)]);
  };

  const speak = (text, forcedLanguage = null) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Use forced language if provided, otherwise detect from text
      let language = forcedLanguage;
      if (!language) {
        // Check if text contains Hindi characters
        const isHindi = /[\u0900-\u097F]/.test(text);
        language = isHindi ? 'hi-IN' : 'en-US';
      }
      
      utterance.lang = language;
      
      // Get available voices and select female voice
      const voices = speechSynthesis.getVoices();
      let selectedVoice = null;
      
      if (language === 'hi-IN') {
        // Priority order for Hindi female voices
        const hindiVoiceNames = [
          'Microsoft Kalpana - Hindi (India)',
          'Microsoft Rashmi - Hindi (India)',
          'Google हिन्दी',
          'Hindi (India)',
          'hi-IN-Wavenet-A',
          'hi-IN-Wavenet-B',
          'hi-IN-Standard-A',
          'hi-IN-Standard-B'
        ];
        
        // Try to find specific female Hindi voices
        for (const voiceName of hindiVoiceNames) {
          selectedVoice = voices.find(voice => voice.name.includes(voiceName));
          if (selectedVoice) break;
        }
        
        // If no specific voice found, try general patterns
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.lang.includes('hi') && 
            (voice.name.toLowerCase().includes('female') || 
             voice.name.toLowerCase().includes('woman') ||
             voice.name.toLowerCase().includes('kalpana') ||
             voice.name.toLowerCase().includes('rashmi'))
          );
        }
        
        // If still no female voice found, use any Hindi voice
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang.includes('hi'));
        }
        
        utterance.rate = 0.7;
        utterance.pitch = 1.2; // Higher pitch for female voice
      } else {
        // Priority order for English female voices
        const englishVoiceNames = [
          'Microsoft Zira - English (United States)',
          'Microsoft Eva - English (United States)',
          'Google US English',
          'Samantha',
          'Alice',
          'Victoria',
          'Allison',
          'Ava',
          'Susan',
          'Vicki'
        ];
        
        // Try to find specific female English voices
        for (const voiceName of englishVoiceNames) {
          selectedVoice = voices.find(voice => voice.name.includes(voiceName));
          if (selectedVoice) break;
        }
        
        // If no specific voice found, try general patterns
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.lang.includes('en') && 
            (voice.name.toLowerCase().includes('female') || 
             voice.name.toLowerCase().includes('woman') ||
             voice.name.toLowerCase().includes('samantha') ||
             voice.name.toLowerCase().includes('alice') ||
             voice.name.toLowerCase().includes('victoria') ||
             voice.name.toLowerCase().includes('zira') ||
             voice.name.toLowerCase().includes('eva'))
          );
        }
        
        // If still no female voice found, use any English voice
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang.includes('en'));
        }
        
        utterance.rate = 0.8;
        utterance.pitch = 1.4; // Higher pitch for female voice
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('🔊 Selected voice:', selectedVoice.name, selectedVoice.lang);
      }
      
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
      
      console.log('🔊 Speaking:', { text, language, voice: selectedVoice?.name });
    }
  };

  const detectLanguage = (text) => {
    // Simple language detection based on character sets
    const hindiPattern = /[\u0900-\u097F]/;
    const englishPattern = /[a-zA-Z]/;
    
    const hindiMatches = (text.match(hindiPattern) || []).length;
    const englishMatches = (text.match(englishPattern) || []).length;
    
    if (hindiMatches > englishMatches) {
      return 'hi';
    } else if (englishMatches > hindiMatches) {
      return 'en';
    } else {
      // Default based on current voice language setting
      return voiceLanguage === 'hi-IN' ? 'hi' : 'en';
    }
  };

  const startListening = () => {
    if (!isListening) {
      setIsListening(true);
      setCurrentTranscript('');
      resetTranscript();
      
      // Start continuous listening with current language
      SpeechRecognition.startListening({ 
        continuous: true,
        language: voiceLanguage,
        interimResults: true
      });
    }
  };

  const toggleLanguage = () => {
    const newLanguage = voiceLanguage === 'hi-IN' ? 'en-US' : 'hi-IN';
    setVoiceLanguage(newLanguage);
    
    // If currently listening, restart with new language
    if (isListening) {
      SpeechRecognition.stopListening();
      setTimeout(() => {
        SpeechRecognition.startListening({ 
          continuous: true,
          language: newLanguage,
          interimResults: true
        });
      }, 100);
    }
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
    
    // Clear timeout if user manually stops
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Process current transcript if available
    if (currentTranscript.trim()) {
      handleVoiceCommand(currentTranscript).catch(console.error);
      addCommand(currentTranscript);
    }
    
    resetTranscript();
    setCurrentTranscript('');
  };

  const renderMainContent = () => {
    switch (currentMode) {
      case 'projects':
        return <ProjectTemplates onBack={() => setCurrentMode('dashboard')} />;
      case 'relax':
        return <RelaxingMode onBack={() => setCurrentMode('dashboard')} />;
      case 'palmreading':
        return <PalmReading onBack={() => setCurrentMode('dashboard')} />;
      default:
        return (
          <MainContent className="dashboard-main">
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="neon-text"
              style={{ marginBottom: '30px', textAlign: 'center' }}
            >
              AI Assistant Ready
            </motion.h2>
            
            <VoiceGreeting 
              greeting={greeting} 
              emotion={currentEmotion}
              userName={user.name}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              style={{ textAlign: 'center', marginTop: '30px' }}
              className="text-center-mobile"
            >
              <p style={{ color: '#00ffff', marginBottom: '20px' }}>
                Voice commands available (Hindi & English):
              </p>
              <ul style={{ color: '#888', textAlign: 'left', maxWidth: '500px', fontSize: '14px' }}>
                <li>"मेरा मूड कैसा है?" / "How is my mood?"</li>
                <li>"जोक सुनाओ" / "Tell me a joke"</li>
                <li>"समय क्या है?" / "What time is it?"</li>
                <li>"नया प्रोजेक्ट बनाओ" / "Start a new project"</li>
                <li>"आराम चाहिए" / "I want to take a break"</li>
                <li>"हस्तरेखा देखो" / "Read my palm"</li>
                <li>"मदद" / "Help"</li>
                <li>"नमस्ते" / "Hello"</li>
                <li>"धन्यवाद" / "Thank you"</li>
              </ul>
              
              {/* Mobile Quick Actions */}
              <div style={{ 
                marginTop: '20px',
                display: 'none',
                width: '100%',
                maxWidth: '300px'
              }} 
              className="mobile-quick-actions">
                <h4 style={{ color: '#ff0066', marginBottom: '12px', fontSize: '14px' }}>Quick Actions</h4>
                <button 
                  className="cyber-button" 
                  style={{ 
                    width: '100%', 
                    marginBottom: '8px',
                    padding: '12px',
                    minHeight: '44px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                  onClick={() => setCurrentMode('projects')}
                >
                  NEW PROJECT
                </button>
                <button 
                  className="cyber-button" 
                  style={{ 
                    width: '100%', 
                    marginBottom: '8px',
                    padding: '12px',
                    minHeight: '44px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                  onClick={() => setCurrentMode('relax')}
                >
                  BREAK MODE
                </button>
                <button 
                  className="cyber-button" 
                  style={{ 
                    width: '100%', 
                    marginBottom: '8px',
                    padding: '12px',
                    minHeight: '44px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                  onClick={() => setCurrentMode('palmreading')}
                >
                  🔮 PALM READING
                </button>
              </div>
            </motion.div>
          </MainContent>
        );
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <div>Browser doesn't support speech recognition.</div>;
  }

  return (
    <DashboardContainer>
      <Header>
        <UserInfo>
          <h2 className="neon-text">Welcome, {user.name}</h2>
          <EmotionDisplay emotion={currentEmotion}>
            {isAnalyzingEmotion ? 'Analyzing...' : currentEmotion}
          </EmotionDisplay>
        </UserInfo>
        <LogoutButton onClick={onLogout} className="cyber-button">
          LOGOUT
        </LogoutButton>
      </Header>

      <Sidebar>
        <h3 className="neon-text" style={{ marginBottom: '16px', fontSize: '16px' }}>Live Feed</h3>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <VideoFeed
            ref={videoRef}
            autoPlay
            muted
          />
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: '10px',
            flexWrap: 'wrap'
          }}>
            <VoiceButton 
              listening={isListening}
              onClick={isListening ? stopListening : startListening}
              title={isListening ? 'Click to stop listening' : 'Click to start voice command'}
            >
              {isListening ? '🔴' : '🎤'}
            </VoiceButton>
            
            <button
              onClick={toggleLanguage}
              style={{
                background: 'transparent',
                border: '2px solid #00ffff',
                color: '#00ffff',
                padding: '8px 10px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '10px',
                fontFamily: 'Orbitron, monospace',
                fontWeight: 'bold',
                minWidth: '44px',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
              title={`Switch to ${voiceLanguage === 'hi-IN' ? 'English' : 'Hindi'}`}
            >
              {voiceLanguage === 'hi-IN' ? 'हिं' : 'ENG'}
            </button>
          </div>
          
          <p style={{ 
            marginTop: '8px', 
            fontSize: '11px', 
            color: '#888',
            textAlign: 'center',
            lineHeight: '1.3'
          }}>
            {isListening ? `Listening in ${voiceLanguage === 'hi-IN' ? 'Hindi' : 'English'}... Click mic to stop` : 'Click microphone for voice commands'}
          </p>
          {currentTranscript && (
            <div style={{ 
              marginTop: '8px', 
              padding: '6px 8px', 
              background: 'rgba(0, 255, 255, 0.1)',
              borderRadius: '5px',
              fontSize: '10px',
              color: '#00ffff',
              border: '1px solid #00ffff33',
              wordBreak: 'break-word'
            }}>
              <strong>You said:</strong> "{currentTranscript}"
            </div>
          )}
          {!browserSupportsSpeechRecognition && (
            <p style={{ color: '#ff0066', fontSize: '10px', marginTop: '8px' }}>
              Browser doesn't support speech recognition
            </p>
          )}
        </div>

        <CommandHistory className="command-history">
          <h4 style={{ color: '#00ffff', marginBottom: '8px', fontSize: '12px' }}>Recent Commands</h4>
          <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
            {commands.map((cmd, index) => (
              <Command key={index}>
                <div style={{ fontSize: '9px', color: '#888', marginBottom: '2px' }}>{cmd.timestamp}</div>
                <div style={{ fontSize: '10px', wordBreak: 'break-word' }}>{cmd.text}</div>
              </Command>
            ))}
          </div>
        </CommandHistory>
      </Sidebar>

      {renderMainContent()}

      <Sidebar className="dashboard-sidebar">
        <h3 className="neon-text" style={{ marginBottom: '16px', fontSize: '16px' }}>System Status</h3>
        <div style={{ fontSize: '13px', color: '#00ffff', lineHeight: '1.4' }}>
          <div style={{ marginBottom: '8px' }}>
            🟢 Face Recognition: Online
          </div>
          <div style={{ marginBottom: '8px' }}>
            🟢 Emotion Detection: Active
          </div>
          <div style={{ marginBottom: '8px' }}>
            🟢 Voice Recognition: Ready
          </div>
          <div style={{ marginBottom: '8px' }}>
            🟢 AI Assistant: Connected
          </div>
        </div>
        
        <div style={{ marginTop: '24px' }} className="hide-mobile">
          <h4 style={{ color: '#ff0066', marginBottom: '12px', fontSize: '14px' }}>Quick Actions</h4>
          <button 
            className="cyber-button" 
            style={{ 
              width: '100%', 
              marginBottom: '8px', 
              fontSize: '11px',
              padding: '8px',
              minHeight: '44px',
              fontWeight: '600'
            }}
            onClick={() => setCurrentMode('projects')}
          >
            NEW PROJECT
          </button>
          <button 
            className="cyber-button" 
            style={{ 
              width: '100%', 
              marginBottom: '8px', 
              fontSize: '11px',
              padding: '8px',
              minHeight: '44px',
              fontWeight: '600'
            }}
            onClick={() => setCurrentMode('relax')}
          >
            BREAK MODE
          </button>
          <button 
            className="cyber-button" 
            style={{ 
              width: '100%', 
              marginBottom: '8px', 
              fontSize: '11px',
              padding: '8px',
              minHeight: '44px',
              fontWeight: '600'
            }}
            onClick={() => setCurrentMode('palmreading')}
          >
            🔮 PALM READING
          </button>
        </div>
      </Sidebar>
    </DashboardContainer>
  );
};

export default Dashboard;
