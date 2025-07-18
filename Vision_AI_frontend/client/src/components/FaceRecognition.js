import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

const VideoContainer = styled.div`
  position: relative;
  border: 2px solid #00ffff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 
    0 0 30px rgba(0, 255, 255, 0.5),
    inset 0 0 30px rgba(0, 255, 255, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px solid #ff0066;
    border-radius: 8px;
    animation: borderPulse 2s ease-in-out infinite;
    pointer-events: none;
    z-index: 1;
  }

  @keyframes borderPulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
`;

const Video = styled.video`
  width: 400px;
  height: 300px;
  object-fit: cover;
  transform: scaleX(-1);
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  transform: scaleX(-1);
`;

const StatusText = styled(motion.div)`
  margin-top: 20px;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  color: ${props => props.status === 'success' ? '#00ff00' : 
                   props.status === 'error' ? '#ff0066' : '#00ffff'};
  text-shadow: 0 0 10px currentColor;
`;

const ScanningEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ffff, transparent);
  animation: scanning 2s linear infinite;
  z-index: 2;

  @keyframes scanning {
    0% { transform: translateY(0); }
    100% { transform: translateY(300px); }
  }
`;

const RegisterButton = styled.button`
  margin-top: 20px;
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

  &:hover {
    box-shadow: 
      0 0 20px #ff0066,
      inset 0 0 20px rgba(255, 0, 102, 0.1);
    text-shadow: 0 0 10px #ff0066;
  }
`;

const CyberButton = styled.button`
  background: transparent;
  border: 2px solid #00ffff;
  color: #00ffff;
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
      0 0 20px #00ffff,
      inset 0 0 20px rgba(0, 255, 255, 0.1);
    text-shadow: 0 0 10px #00ffff;
  }
`;

const FaceRecognition = ({ onLogin }) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const intervalRef = useRef();
  const navigate = useNavigate();
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [status, setStatus] = useState('initializing');
  const [message, setMessage] = useState('Initializing AI systems...');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    loadModels();
    startVideo();
    
    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const loadModels = async () => {
    try {
      setMessage('Loading neural networks...');
      const MODEL_URL = '/models';
      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
      ]);
      
      setModelsLoaded(true);
      setMessage('AI systems online. Position your face in the scanner.');
      setStatus('ready');
    } catch (error) {
      console.error('Error loading models:', error);
      setMessage('Error loading AI models. Please refresh.');
      setStatus('error');
    }
  };

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: 400, 
        height: 300,
        facingMode: 'user'
      } 
    })
    .then(stream => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    })
    .catch(err => {
      console.error('Error accessing camera:', err);
      setMessage('Camera access denied. Please enable camera permissions.');
      setStatus('error');
    });
  };

  // Function to validate if detected face is a human face
  const isValidHumanFace = (detection) => {
    if (!detection.landmarks || !detection.detection) return false;
    
    const landmarks = detection.landmarks;
    const box = detection.detection.box;
    
    // Check if face has proper proportions
    const faceWidth = box.width;
    const faceHeight = box.height;
    const aspectRatio = faceWidth / faceHeight;
    
    // Human faces typically have aspect ratio between 0.6 and 1.2
    if (aspectRatio < 0.6 || aspectRatio > 1.2) {
      return false;
    }
    
    // Check if landmarks are properly positioned
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
    const nose = landmarks.getNose();
    const mouth = landmarks.getMouth();
    
    // Basic validation: eyes should be above nose, nose above mouth
    if (leftEye.length === 0 || rightEye.length === 0 || nose.length === 0 || mouth.length === 0) {
      return false;
    }
    
    const leftEyeY = leftEye.reduce((sum, point) => sum + point.y, 0) / leftEye.length;
    const rightEyeY = rightEye.reduce((sum, point) => sum + point.y, 0) / rightEye.length;
    const noseY = nose.reduce((sum, point) => sum + point.y, 0) / nose.length;
    const mouthY = mouth.reduce((sum, point) => sum + point.y, 0) / mouth.length;
    
    // Eyes should be above nose, nose above mouth
    if (leftEyeY >= noseY || rightEyeY >= noseY || noseY >= mouthY) {
      return false;
    }
    
    // Check face detection confidence
    if (detection.detection.score < 0.5) {
      return false;
    }
    
    // Check if face is too small or too large
    const minFaceSize = 60;
    const maxFaceSize = 350;
    if (faceWidth < minFaceSize || faceHeight < minFaceSize || 
        faceWidth > maxFaceSize || faceHeight > maxFaceSize) {
      return false;
    }
    
    return true;
  };

  const handleVideoPlay = () => {
    if (!modelsLoaded) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (canvas && video) {
      const displaySize = { width: 400, height: 300 };
      faceapi.matchDimensions(canvas, displaySize);
      
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Start new interval
      intervalRef.current = setInterval(async () => {
        if (!isScanning && status !== 'error' && status !== 'success') {
          await detectFaces();
        }
      }, 100);
    }
  };

  const detectFaces = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || status === 'error' || status === 'success' || isScanning) return;

    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
      .withFaceDescriptors();

    const displaySize = { width: 400, height: 300 };
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (detections.length > 0) {
      const detection = detections[0];
      
      // Validate if it's a human face
      if (isValidHumanFace(detection)) {
        // Draw face detection box
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        
        if (status === 'ready') {
          setMessage('Human face detected. Ready for authentication.');
          setStatus('ready');
        }
      } else {
        // Draw red box for invalid face
        ctx.strokeStyle = '#ff0066';
        ctx.lineWidth = 2;
        ctx.strokeRect(
          detection.detection.box.x,
          detection.detection.box.y,
          detection.detection.box.width,
          detection.detection.box.height
        );
        
        if (status === 'ready') {
          setMessage('Please use a human face for authentication.');
          setStatus('invalid-face');
        }
      }
    } else {
      if (status === 'ready' || status === 'invalid-face') {
        setMessage('Position your face in the scanner.');
        setStatus('ready');
      }
    }
  };

  const authenticateUser = async () => {
    if (isScanning) return;
    
    console.log('🔐 [CLIENT] Starting authentication process...');
    setIsScanning(true);
    setMessage('Authenticating...');
    setStatus('scanning');

    // Stop face detection interval during authentication
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    try {
      const video = videoRef.current;
      console.log('📹 [CLIENT] Video element ready for auth:', !!video);
      
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withFaceDescriptor();

      console.log('👤 [CLIENT] Face detection result for auth:', !!detection);

      if (!detection) {
        console.log('❌ [CLIENT] No face detected during authentication');
        setMessage('No face detected. Please position your face properly and try again.');
        setStatus('ready');
        setIsScanning(false);
        // Restart face detection
        handleVideoPlay();
        return;
      }

      // Validate if the detected face is a human face
      if (!isValidHumanFace(detection)) {
        console.log('❌ [CLIENT] Invalid human face detected during authentication');
        setMessage('Detected face is not a valid human face. Please try again.');
        setStatus('error');
        setIsScanning(false);
        // Clear canvas to stop showing detection boxes
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        return;
      }

      // Get emotion
      const emotions = detection.expressions;
      const topEmotion = Object.keys(emotions).reduce((a, b) => 
        emotions[a] > emotions[b] ? a : b
      );

      // Send to backend for authentication
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/verify-face`, {
        faceDescriptor: Array.from(detection.descriptor),
        emotion: topEmotion
      });


      if (response.data.success) {
        console.log('✅ [CLIENT] Authentication successful!');
        setMessage(`Welcome back, ${response.data.user.name}!`);
        setStatus('success');
        
        // Clear the detection interval permanently
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        setTimeout(() => {
          console.log('🚀 [CLIENT] Calling onLogin callback...');
          onLogin({
            ...response.data.user,
            currentEmotion: topEmotion
          });
          // Navigate to dashboard after successful login
          navigate('/');
        }, 1500);
      } else {
        console.log('❌ [CLIENT] Authentication failed:', response.data.message);
        setMessage('Face recognition failed. Please register first.');
        setStatus('error');
        setIsScanning(false);
        // Clear canvas to stop showing detection boxes
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    } catch (error) {
      console.error('❌ [CLIENT] Authentication error:', error);
      console.error('❌ [CLIENT] Error details:', error.response?.data || error.message);
      setMessage('Authentication failed. Please try again.');
      setStatus('error');
      setIsScanning(false);
      // Clear canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const goToRegistration = () => {
    navigate('/register');
  };

  const goToWelcome = () => {
    navigate('/');
  };

  const tryAgain = () => {
    setStatus('ready');
    setMessage('AI systems online. Position your face in the scanner.');
    setIsScanning(false);
    // Restart face detection
    handleVideoPlay();
  };

  return (
    <Container>
      <motion.h1 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="neon-text"
        style={{ 
          fontSize: '3rem', 
          marginBottom: '30px',
          background: 'linear-gradient(45deg, #00ffff, #ff0066)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center'
        }}
      >
        FACE LOGIN
      </motion.h1>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <VideoContainer>
          <Video
            ref={videoRef}
            autoPlay
            muted
            onPlay={handleVideoPlay}
          />
          <Canvas ref={canvasRef} width="400" height="300" />
          {status === 'scanning' && <ScanningEffect />}
        </VideoContainer>
      </motion.div>

      <StatusText
        status={status}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {message}
      </StatusText>

      {status === 'ready' && modelsLoaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{ textAlign: 'center' }}
        >
          <CyberButton
            onClick={authenticateUser}
            style={{ marginTop: '20px' }}
          >
            INITIATE FACE SCAN
          </CyberButton>
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', marginTop: '20px' }}
        >
          <p style={{ 
            color: '#ff0066', 
            fontSize: '16px', 
            marginBottom: '20px',
            fontWeight: 'bold'
          }}>
            Face not found in database. Please register first.
          </p>
          
          <RegisterButton onClick={goToRegistration}>
            REGISTER NEW USER
          </RegisterButton>
          
          <div style={{ margin: '20px 0', color: '#888', fontSize: '14px' }}>
            --- OR ---
          </div>
          
          <CyberButton onClick={tryAgain}>
            TRY AGAIN
          </CyberButton>
          
          <div style={{ margin: '20px 0', color: '#888', fontSize: '14px' }}>
            --- OR ---
          </div>
          
          <CyberButton onClick={goToWelcome}>
            BACK TO WELCOME
          </CyberButton>
        </motion.div>
      )}
    </Container>
  );
};

export default FaceRecognition;
