import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import axios from 'axios';
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

const RegistrationCard = styled.div`
  max-width: 500px;
  width: 100%;
  border: 2px solid #00ffff;
  border-radius: 15px;
  padding: 30px;
  background: rgba(0, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  text-align: center;
`;

const VideoContainer = styled.div`
  position: relative;
  border: 2px solid #ff0066;
  border-radius: 10px;
  overflow: hidden;
  margin: 20px 0;
  box-shadow: 0 0 30px rgba(255, 0, 102, 0.3);
`;

const Video = styled.video`
  width: 300px;
  height: 225px;
  object-fit: cover;
  transform: scaleX(-1);
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  transform: scaleX(-1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;

const Input = styled.input`
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid #00ffff;
  border-radius: 5px;
  padding: 12px;
  color: #00ffff;
  font-family: 'Orbitron', monospace;
  font-size: 16px;

  &::placeholder {
    color: #00ffff88;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  }
`;

const RegisterButton = styled.button`
  background: transparent;
  border: 2px solid #00ff00;
  color: #00ff00;
  padding: 15px 30px;
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;

  &:hover:not(:disabled) {
    box-shadow: 0 0 20px #00ff00;
    text-shadow: 0 0 10px #00ff00;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CyberButton = styled.button`
  background: transparent;
  border: 2px solid #ff0066;
  color: #ff0066;
  padding: 12px 25px;
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 10px 0;

  &:hover:not(:disabled) {
    box-shadow: 0 0 20px #ff0066;
    text-shadow: 0 0 10px #ff0066;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const BackButton = styled.button`
  background: transparent;
  border: 2px solid #ff0066;
  color: #ff0066;
  padding: 10px 20px;
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 20px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 15px #ff0066;
    text-shadow: 0 0 10px #ff0066;
  }
`;

const StatusText = styled.div`
  margin-top: 15px;
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.status === 'success' ? '#00ff00' : 
                   props.status === 'error' ? '#ff0066' : 
                   props.status === 'invalid-face' ? '#ff8800' : '#00ffff'};
  text-shadow: 0 0 10px currentColor;
`;

const Registration = ({ onRegister }) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const intervalRef = useRef();
  const navigate = useNavigate();
  
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Loading AI models...');
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    loadModels();
    startVideo();
    
    // Cleanup interval and video stream on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const loadModels = async () => {
    try {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
      ]);
      setModelsLoaded(true);
      setMessage('Ready to capture your biometric data');
      setStatus('ready');
    } catch (error) {
      console.error('Error loading models:', error);
      setMessage('Error loading AI models');
      setStatus('error');
    }
  };

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: 300, 
        height: 225,
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
      setMessage('Camera access required for registration');
      setStatus('error');
    });
  };

  const handleVideoPlay = () => {
    if (!modelsLoaded) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (canvas && video) {
      const displaySize = { width: 300, height: 225 };
      faceapi.matchDimensions(canvas, displaySize);
      
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Start new interval only if models are loaded and video is ready
      if (modelsLoaded && video.readyState === 4) {
        intervalRef.current = setInterval(async () => {
          if (!isCapturing && status !== 'captured' && status !== 'registering') {
            await detectFaces();
          }
        }, 150); // Slightly slower to reduce flickering
      }
    }
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
    const minFaceSize = 50;
    const maxFaceSize = 400;
    if (faceWidth < minFaceSize || faceHeight < minFaceSize || 
        faceWidth > maxFaceSize || faceHeight > maxFaceSize) {
      return false;
    }
    
    return true;
  };

  const detectFaces = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || !modelsLoaded) return;

    try {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      const displaySize = { width: 300, height: 225 };
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (detections.length > 0) {
        const detection = detections[0];
        
        // Validate if it's a human face
        if (isValidHumanFace(detection)) {
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
          
          if (!faceDescriptor && status !== 'captured' && status !== 'capturing') {
            setMessage('Human face detected! Fill out the form and capture your biometrics.');
            setStatus('detected');
          }
        } else {
          // Draw detection but show warning
          ctx.strokeStyle = '#ff0066';
          ctx.lineWidth = 2;
          ctx.strokeRect(
            detection.detection.box.x,
            detection.detection.box.y,
            detection.detection.box.width,
            detection.detection.box.height
          );
          
          if (status !== 'captured' && status !== 'capturing') {
            setMessage('Please use a human face for registration');
            setStatus('invalid-face');
          }
        }
      } else {
        if (status === 'detected' && !faceDescriptor) {
          setMessage('Position your face in the frame');
          setStatus('ready');
        } else if (status === 'invalid-face') {
          setMessage('Ready to capture your biometric data');
          setStatus('ready');
        }
      }
    } catch (error) {
      console.error('Face detection error:', error);
    }
  };

  const captureFaceData = async () => {
    if (isCapturing) return;
    
    console.log('🔍 [CLIENT] Starting face capture process...');
    
    // Stop face detection during capture
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsCapturing(true);
    setMessage('Capturing biometric data...');
    setStatus('capturing');

    try {
      const video = videoRef.current;
      console.log('📹 [CLIENT] Video element ready:', !!video);
      
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      console.log('👤 [CLIENT] Face detection result:', !!detection);

      if (!detection) {
        console.log('❌ [CLIENT] No face detected during capture');
        setMessage('No face detected. Please try again.');
        setStatus('error');
        setIsCapturing(false);
        // Restart detection
        handleVideoPlay();
        return;
      }

      // Validate if it's a human face
      if (!isValidHumanFace(detection)) {
        console.log('❌ [CLIENT] Invalid human face detected during capture');
        setMessage('Please use a human face for registration. Try again.');
        setStatus('error');
        setIsCapturing(false);
        // Restart detection
        handleVideoPlay();
        return;
      }

      const faceDescriptorArray = Array.from(detection.descriptor);
      console.log('🧬 [CLIENT] Face descriptor captured:', {
        length: faceDescriptorArray.length,
        sample: faceDescriptorArray.slice(0, 5)
      });

      setFaceDescriptor(faceDescriptorArray);
      setMessage('Human face biometric data captured successfully! Complete the form to register.');
      setStatus('captured');
      setIsCapturing(false);
      
    } catch (error) {
      console.error('❌ [CLIENT] Face capture error:', error);
      setMessage('Error capturing face data');
      setStatus('error');
      setIsCapturing(false);
      // Restart detection
      handleVideoPlay();
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('📝 [CLIENT] Form submission started');
    console.log('📝 [CLIENT] Form data:', formData);
    console.log('📝 [CLIENT] Face descriptor available:', !!faceDescriptor);
    
    if (!faceDescriptor) {
      console.log('❌ [CLIENT] No face descriptor available');
      setMessage('Please capture your biometric data first');
      setStatus('error');
      return;
    }

    if (!formData.name || !formData.email) {
      console.log('❌ [CLIENT] Missing form data:', { name: !!formData.name, email: !!formData.email });
      setMessage('Please fill out all fields');
      setStatus('error');
      return;
    }

    try {
      console.log('🚀 [CLIENT] Sending registration request to server...');
      setMessage('Registering new user...');
      setStatus('registering');

      const requestData = {
        name: formData.name,
        email: formData.email,
        faceDescriptor: faceDescriptor
      };

      console.log('📤 [CLIENT] Request payload:', {
        name: requestData.name,
        email: requestData.email,
        faceDescriptorLength: requestData.faceDescriptor.length
      });

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, requestData);


      if (response.data.success) {
        console.log('✅ [CLIENT] Registration successful!');
        setMessage('Registration successful! Redirecting to login...');
        setStatus('success');
        
        setTimeout(() => {
          onRegister(response.data.user);
          navigate('/login');
        }, 2000);
      } else {
        console.log('❌ [CLIENT] Registration failed:', response.data.message);
        setMessage(response.data.message || 'Registration failed');
        setStatus('error');
      }
    } catch (error) {
      console.error('❌ [CLIENT] Registration error:', error);
      console.error('❌ [CLIENT] Error details:', error.response?.data || error.message);
      setMessage('Registration failed. Please try again.');
      setStatus('error');
    }
  };

  const goBack = () => {
    navigate('/onboarding');
  };

  return (
    <Container>
      <BackButton onClick={goBack}>
        ← BACK TO FEATURES
      </BackButton>

      <motion.h1 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="neon-text"
        style={{ 
          fontSize: '2.5rem', 
          marginBottom: '30px',
          background: 'linear-gradient(45deg, #00ffff, #ff0066)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        USER REGISTRATION
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <RegistrationCard>
          <h3 className="neon-text" style={{ marginBottom: '20px' }}>
            Biometric Registration
          </h3>
          
          <VideoContainer>
            <Video
              ref={videoRef}
              autoPlay
              muted
              onPlay={handleVideoPlay}
            />
            <Canvas ref={canvasRef} width="300" height="225" />
          </VideoContainer>

          <StatusText status={status}>
            {message}
          </StatusText>

          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            
            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            {modelsLoaded && status !== 'captured' && (
              <CyberButton
                type="button"
                onClick={captureFaceData}
                disabled={isCapturing || (status !== 'detected') || status === 'invalid-face'}
              >
                {isCapturing ? 'CAPTURING...' : 'CAPTURE BIOMETRICS'}
              </CyberButton>
            )}

            <RegisterButton
              type="submit"
              disabled={!faceDescriptor || status === 'registering'}
            >
              {status === 'registering' ? 'REGISTERING...' : 'COMPLETE REGISTRATION'}
            </RegisterButton>
          </Form>
        </RegistrationCard>
      </motion.div>
    </Container>
  );
};

export default Registration;
