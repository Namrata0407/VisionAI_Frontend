const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Check if any users exist in the system
router.get('/check-users', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({
      success: true,
      hasUsers: userCount > 0
    });
  } catch (error) {
    console.error('Error checking users:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking users'
    });
  }
});

// Register new user with face descriptor
router.post('/register', async (req, res) => {
  try {
    const { name, email, faceDescriptor } = req.body;
    // Validate input
    if (!name || !email || !faceDescriptor) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and face descriptor are required'
      });
    }

    if (!Array.isArray(faceDescriptor) || faceDescriptor.length !== 128) {
      return res.status(400).json({
        success: false,
        message: 'Invalid face descriptor format'
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    console.log('🔍 [SERVER] Checking for existing face...');
    // Check if face is already registered
    const existingFace = await User.findByFaceDescriptor(faceDescriptor);
    if (existingFace) {
      return res.status(400).json({
        success: false,
        message: 'This face is already registered to another account'
      });
    }

    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      faceDescriptor
    });

    await user.save();
    
    // Start first session
    await user.startSession();
    const responseData = {
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        stats: user.stats
      }
    };

    res.status(201).json(responseData);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// Verify face for authentication
router.post('/verify-face', async (req, res) => {
  try {
    const { faceDescriptor, emotion } = req.body;
    if (!Array.isArray(faceDescriptor) || faceDescriptor.length !== 128) {
      return res.status(400).json({
        success: false,
        message: 'Invalid face descriptor format'
      });
    }
    // Find user by face descriptor
    const result = await User.findByFaceDescriptor(faceDescriptor);
    
    if (!result) {
      return res.status(401).json({
        success: false,
        message: 'Face not recognized'
      });
    }

    const { user, confidence } = result;

    // Log the mood if emotion is provided
    if (emotion) {
      await user.logMood(emotion, confidence, 'Login authentication');
    }

    // Start new session
    await user.startSession();

    res.json({
      success: true,
      message: 'Authentication successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        stats: user.stats,
        currentEmotion: emotion
      },
      confidence
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
});

// Log user session data
router.post('/log-session', async (req, res) => {
  try {
    const { userId, emotion, voiceCommand, context } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Log emotion if provided
    if (emotion) {
      await user.logMood(emotion, 0.8, context || 'Session activity');
    }

    // Add voice command to current session
    if (voiceCommand && user.sessions.length > 0) {
      const currentSession = user.sessions[user.sessions.length - 1];
      currentSession.voiceCommands.push(voiceCommand);
      
      if (emotion && !currentSession.emotionsDetected.includes(emotion)) {
        currentSession.emotionsDetected.push(emotion);
      }
      
      await user.save();
    }

    res.json({
      success: true,
      message: 'Session data logged successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to log session data',
      error: error.message
    });
  }
});

// End user session
router.post('/logout', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // End current session
    await user.endSession();

    console.log(`👋 User logged out: ${user.name}`);

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('❌ Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message
    });
  }
});

module.exports = router;
