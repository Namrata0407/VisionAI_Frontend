import React, { useEffect, useRef } from 'react';

const BackgroundAudio = () => {
  const audioRef = useRef();

  useEffect(() => {
    // Create audio context for background hum
    const createBackgroundHum = () => {
      if (typeof window !== 'undefined' && window.AudioContext) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create low frequency oscillator for ambient hum
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        // Configure oscillators
        oscillator1.type = 'sine';
        oscillator1.frequency.setValueAtTime(60, audioContext.currentTime);
        
        oscillator2.type = 'sine';
        oscillator2.frequency.setValueAtTime(80, audioContext.currentTime); 
        
        // Set very low volume
        gainNode.gain.setValueAtTime(0.02, audioContext.currentTime);
        
        // Connect nodes
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Start oscillators
        oscillator1.start();
        oscillator2.start();
        
        // Add subtle frequency modulation
        const modulator = audioContext.createOscillator();
        const modulatorGain = audioContext.createGain();
        
        modulator.type = 'sine';
        modulator.frequency.setValueAtTime(0.1, audioContext.currentTime); 
        modulatorGain.gain.setValueAtTime(2, audioContext.currentTime);
        
        modulator.connect(modulatorGain);
        modulatorGain.connect(oscillator1.frequency);
        modulator.start();
        
        // Store references for cleanup
        return { audioContext, oscillator1, oscillator2, modulator };
      }
      return null;
    };

    let audioNodes = null;
    
    // Start audio after user interaction (required by browsers)
    const startAudio = () => {
      if (!audioNodes) {
        audioNodes = createBackgroundHum();
      }
    };

    // Add click listener to start audio
    document.addEventListener('click', startAudio, { once: true });
    document.addEventListener('keydown', startAudio, { once: true });

    return () => {
      // Cleanup audio nodes
      if (audioNodes) {
        try {
          audioNodes.oscillator1.stop();
          audioNodes.oscillator2.stop();
          audioNodes.modulator.stop();
          audioNodes.audioContext.close();
        } catch (error) {
          console.log('Audio cleanup error:', error);
        }
      }
      
      document.removeEventListener('click', startAudio);
      document.removeEventListener('keydown', startAudio);
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default BackgroundAudio;
