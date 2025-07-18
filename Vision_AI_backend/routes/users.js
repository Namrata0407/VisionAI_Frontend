const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Get user profile and stats
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-faceDescriptor');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        stats: user.stats,
        preferences: user.preferences,
        recentMoods: user.moodLogs.slice(-10).reverse(), 
        recentSessions: user.sessions.slice(-5).reverse() 
      }
    });

  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user data',
      error: error.message
    });
  }
});

// Update user preferences
router.put('/:userId/preferences', async (req, res) => {
  try {
    const { userId } = req.params;
    const { preferences } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update preferences
    Object.keys(preferences).forEach(key => {
      if (user.preferences.hasOwnProperty(key)) {
        user.preferences[key] = preferences[key];
      }
    });

    await user.save();

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });

  } catch (error) {
    console.error('❌ Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences',
      error: error.message
    });
  }
});

// Get user mood analytics
router.get('/:userId/analytics', async (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 30 } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    // Filter mood logs within the specified timeframe
    const recentMoods = user.moodLogs.filter(mood => 
      mood.timestamp >= cutoffDate
    );

    // Calculate mood distribution
    const moodDistribution = {};
    recentMoods.forEach(mood => {
      moodDistribution[mood.emotion] = (moodDistribution[mood.emotion] || 0) + 1;
    });

    // Calculate daily mood trends
    const dailyMoods = {};
    recentMoods.forEach(mood => {
      const date = mood.timestamp.toISOString().split('T')[0];
      if (!dailyMoods[date]) {
        dailyMoods[date] = [];
      }
      dailyMoods[date].push(mood.emotion);
    });

    // Calculate session analytics
    const recentSessions = user.sessions.filter(session => 
      session.loginTime >= cutoffDate
    );

    const sessionStats = {
      totalSessions: recentSessions.length,
      averageDuration: recentSessions.length > 0 ? 
        recentSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / recentSessions.length : 0,
      totalTimeSpent: recentSessions.reduce((sum, s) => sum + (s.duration || 0), 0)
    };

    res.json({
      success: true,
      analytics: {
        timeframe: `${days} days`,
        moodDistribution,
        dailyMoods,
        sessionStats,
        totalMoodsLogged: recentMoods.length,
        mostCommonEmotion: user.stats.mostCommonEmotion
      }
    });

  } catch (error) {
    console.error('❌ Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
});

// Delete user account
router.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await User.findByIdAndDelete(userId);

    console.log(`🗑️ User account deleted: ${user.name} (${user.email})`);

    res.json({
      success: true,
      message: 'User account deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user account',
      error: error.message
    });
  }
});

module.exports = router;
