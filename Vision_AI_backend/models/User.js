const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  faceDescriptor: {
    type: [Number],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length === 128; 
      },
      message: 'Face descriptor must be exactly 128 numbers'
    }
  },
  moodLogs: [{
    emotion: {
      type: String,
      enum: ['happy', 'sad', 'angry', 'surprised', 'fearful', 'disgusted', 'neutral'],
      required: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    context: String 
  }],
  sessions: [{
    loginTime: {
      type: Date,
      default: Date.now
    },
    logoutTime: Date,
    duration: Number, 
    emotionsDetected: [String],
    voiceCommands: [String]
  }],
  preferences: {
    voiceEnabled: {
      type: Boolean,
      default: true
    },
    autoGreeting: {
      type: Boolean,
      default: true
    },
    backgroundAudio: {
      type: Boolean,
      default: true
    },
    emotionTracking: {
      type: Boolean,
      default: true
    }
  },
  stats: {
    totalLogins: {
      type: Number,
      default: 0
    },
    totalTimeSpent: {
      type: Number,
      default: 0 
    },
    mostCommonEmotion: String,
    lastLogin: Date,
    averageSessionDuration: Number
  }
}, {
  timestamps: true
});

// Instance methods
UserSchema.methods.logMood = function(emotion, confidence, context) {
  this.moodLogs.push({
    emotion,
    confidence,
    context,
    timestamp: new Date()
  });
  
  // Update stats
  this.updateMoodStats();
  return this.save();
};

UserSchema.methods.startSession = function() {
  const session = {
    loginTime: new Date(),
    emotionsDetected: [],
    voiceCommands: []
  };
  
  this.sessions.push(session);
  this.stats.totalLogins += 1;
  this.stats.lastLogin = new Date();
  
  return this.save();
};

UserSchema.methods.endSession = function() {
  if (this.sessions.length > 0) {
    const currentSession = this.sessions[this.sessions.length - 1];
    currentSession.logoutTime = new Date();
    currentSession.duration = Math.round(
      (currentSession.logoutTime - currentSession.loginTime) / (1000 * 60)
    ); // duration in minutes
    
    this.stats.totalTimeSpent += currentSession.duration;
    this.updateSessionStats();
  }
  
  return this.save();
};

UserSchema.methods.updateMoodStats = function() {
  if (this.moodLogs.length === 0) return;
  
  // Calculate most common emotion
  const emotionCounts = {};
  this.moodLogs.forEach(log => {
    emotionCounts[log.emotion] = (emotionCounts[log.emotion] || 0) + 1;
  });
  
  this.stats.mostCommonEmotion = Object.keys(emotionCounts).reduce((a, b) => 
    emotionCounts[a] > emotionCounts[b] ? a : b
  );
};

UserSchema.methods.updateSessionStats = function() {
  if (this.sessions.length === 0) return;
  
  const completedSessions = this.sessions.filter(s => s.duration);
  if (completedSessions.length > 0) {
    const totalDuration = completedSessions.reduce((sum, s) => sum + s.duration, 0);
    this.stats.averageSessionDuration = Math.round(totalDuration / completedSessions.length);
  }
};

// Static methods
UserSchema.statics.findByFaceDescriptor = async function(descriptor, threshold = 0.6) {
  const users = await this.find({});
  
  for (let user of users) {
    const distance = calculateEuclideanDistance(descriptor, user.faceDescriptor);
    if (distance < threshold) {
      return { user, confidence: 1 - distance };
    }
  }
  
  return null;
};

// Helper function to calculate Euclidean distance between face descriptors
function calculateEuclideanDistance(desc1, desc2) {
  if (desc1.length !== desc2.length) return Infinity;
  
  let sum = 0;
  for (let i = 0; i < desc1.length; i++) {
    sum += Math.pow(desc1[i] - desc2[i], 2);
  }
  
  return Math.sqrt(sum);
}

// Indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ 'sessions.loginTime': -1 });
UserSchema.index({ 'moodLogs.timestamp': -1 });

module.exports = mongoose.model('User', UserSchema);
