# [🤖 VisionAI - Futuristic AI Assistant Dashboard](https://visionai-chi.vercel.app/)

VisionAI is a cutting-edge web application that combines facial recognition, emotion detection, and voice interaction to create an immersive AI assistant experience. Built with the MERN stack and featuring a stunning futuristic UI inspired by sci-fi interfaces.

### 📝 Register Page
![Register Page](https://github.com/user-attachments/assets/c81c9a50-4dec-4c05-bb37-f12efa61385d)

### 🖼️ Landing Page
![Landing Page](https://github.com/user-attachments/assets/1c871cc7-84b0-4b30-be2f-4ff76d52d3e4)

### 🔮 Palm Reading
![Palm Reading](https://github.com/user-attachments/assets/a75cae0d-159f-4139-a7a4-15cd8b033363)

### 💻 Relaxation Mode
![Break Functionality](https://github.com/user-attachments/assets/c4a69a3e-9fc3-4f2b-995d-23c137a9f436)

### 📱 Responsiveness
![Responsive Screenshot 1](https://github.com/user-attachments/assets/fec25589-cab3-442e-a255-ef9ad3ab4d5e)
![Responsive Screenshot 2](https://github.com/user-attachments/assets/bd2eb7fe-c13e-4e5d-b317-6f511f538ea9)



## ✨ Features

### 🔐 Biometric Authentication
- **Face Recognition Login**: No passwords needed - your face is your key
- **Secure Face Descriptors**: 128-point facial feature vectors stored in MongoDB
- **Anti-Spoofing**: Live detection prevents photo-based attacks

### 😊 Emotion Intelligence
- **Real-time Emotion Detection**: Happy, sad, angry, surprised, fearful, disgusted, neutral
- **Contextual Greetings**: AI responds based on your current emotional state
- **Mood Analytics**: Track emotional patterns over time

### 🎙️ Voice Interaction
- **Voice Commands**: Control the app with natural speech
- **Text-to-Speech**: AI responds with synthesized voice
- **Smart Actions**: "Start a new React project", "I want to take a break"

### 🎨 Futuristic UI
- **Neon Console Theme**: Dark cyberpunk aesthetic with glowing elements
- **Animated Scan Lines**: Dynamic visual effects like sci-fi movies
- **Responsive Grid Layout**: Adapts to any screen size
- **Background Audio**: Subtle ambient hum for immersion

### 🛠️ Developer Tools
- **Project Templates**: Quick-start templates for React, Next.js, etc.
- **Relaxation Mode**: Break time with breathing exercises and ambient sounds
- **Session Tracking**: Monitor usage patterns and productivity

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Smooth animations
- **face-api.js** - Browser-based face recognition
- **React Speech Recognition** - Voice input
- **Web Speech API** - Text-to-speech output

### Backend
- **Node.js & Express** - RESTful API server
- **MongoDB & Mongoose** - Database and ODM
- **Face Recognition** - Custom face matching algorithms
- **Security** - Helmet, CORS, rate limiting

### DevOps
- **Concurrently** - Run client and server together
- **Nodemon** - Auto-restart development server
- **Environment Variables** - Secure configuration

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or Atlas)
- Webcam for face recognition

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/visionai-dashboard.git
   cd visionai-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm run install-deps
   ```

3. **Download face-api.js models**
   ```bash
   # Option 1: Download from GitHub
   cd client/public
   mkdir models
   # Download models from: https://github.com/justadudewhohacks/face-api.js/tree/master/weights
   
   # Option 2: Copy from node_modules (after installing face-api.js)
   cp -r node_modules/face-api.js/weights/* client/public/models/
   ```

4. **Configure environment**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   ```

5. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in server/.env
   ```

6. **Start the application**
   ```bash
   npm run dev
   ```

   This starts both client (http://localhost:3000) and server (http://localhost:5000)

## 📱 Usage Guide

### First Time Setup
1. **Access the app** at http://localhost:3000
2. **Click "NEW USER REGISTRATION"**
3. **Allow camera access** when prompted
4. **Fill out the registration form**
5. **Position your face** in the scanner frame
6. **Click "CAPTURE BIOMETRICS"** when face is detected
7. **Complete registration** - your face descriptor is now stored

### Daily Usage
1. **Open the app** - camera automatically activates
2. **Position your face** for scanning
3. **Click "INITIATE SCAN"** to authenticate
4. **Enjoy personalized greetings** based on your detected emotion
5. **Use voice commands** or click interface buttons
6. **Try saying:**
   - "Start a new React project"
   - "I want to take a break"
   - "Show me dashboard"
   - "Logout"

### Voice Commands
- **"New React project"** → Shows project templates
- **"Take a break"** → Activates relaxation mode
- **"Dashboard"** → Returns to main view
- **"Logout"** → Signs you out

## 🎨 UI Customization

### Color Themes
The app uses CSS custom properties for easy theming:

```css
:root {
  --primary-cyan: #00ffff;
  --primary-pink: #ff0066;
  --success-green: #00ff00;
  --warning-orange: #ffa500;
  --error-red: #ff0000;
  --background-dark: #000000;
  --glass-bg: rgba(0, 255, 255, 0.05);
}
```

### Animation Speed
Adjust animation timings in styled components:

```javascript
// Faster animations
animation: scanLines 2s linear infinite;

// Slower animations  
animation: scanLines 6s linear infinite;
```

## 🔧 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user with face biometrics.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "faceDescriptor": [128 numbers array]
}
```

#### POST /api/auth/verify-face
Authenticate user by face recognition.

**Body:**
```json
{
  "faceDescriptor": [128 numbers array],
  "emotion": "happy"
}
```

#### POST /api/auth/logout
End user session.

**Body:**
```json
{
  "userId": "user_id_here"
}
```

### User Endpoints

#### GET /api/users/:userId
Get user profile and statistics.

#### PUT /api/users/:userId/preferences
Update user preferences.

#### GET /api/users/:userId/analytics
Get mood and usage analytics.

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String,
  faceDescriptor: [Number], // 128-point face vector
  moodLogs: [{
    emotion: String,
    confidence: Number,
    timestamp: Date,
    context: String
  }],
  sessions: [{
    loginTime: Date,
    logoutTime: Date,
    duration: Number,
    emotionsDetected: [String],
    voiceCommands: [String]
  }],
  preferences: {
    voiceEnabled: Boolean,
    autoGreeting: Boolean,
    backgroundAudio: Boolean,
    emotionTracking: Boolean
  },
  stats: {
    totalLogins: Number,
    totalTimeSpent: Number,
    mostCommonEmotion: String,
    lastLogin: Date,
    averageSessionDuration: Number
  }
}
```

## 🔒 Security Features

- **Face Descriptor Encryption**: Biometric data is stored as mathematical vectors
- **Rate Limiting**: Prevents brute force attacks  
- **CORS Protection**: Restricts cross-origin requests
- **Input Validation**: Sanitizes all user inputs
- **Environment Variables**: Sensitive data not in code
- **Helmet.js**: Sets security headers

## 📈 Performance Optimization

- **Lazy Loading**: Components load when needed
- **Image Optimization**: Compressed assets
- **Database Indexing**: Fast queries on user data
- **Face Recognition Caching**: Reduces computation
- **WebRTC Optimization**: Efficient camera streaming

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use ESLint and Prettier
- Follow React best practices
- Write meaningful commit messages
- Add JSDoc comments for functions

## 🐛 Troubleshooting

### Camera Not Working
- **Chrome/Edge**: Check camera permissions in browser settings
- **Firefox**: Allow camera access when prompted
- **HTTPS Required**: Camera access requires secure connection in production

### Face Recognition Issues
- **Models Not Loading**: Ensure face-api.js models are in `/client/public/models/`
- **Poor Lighting**: Use good lighting for better detection
- **Distance**: Keep face 2-3 feet from camera
- **Angle**: Face camera directly for best results

### MongoDB Connection
- **Local MongoDB**: Ensure MongoDB service is running
- **Atlas**: Check network access and credentials
- **Firewall**: Open port 27017 for local MongoDB

### Voice Recognition
- **Microphone Access**: Grant microphone permissions
- **Browser Support**: Use Chrome/Edge for best compatibility
- **Noise**: Use in quiet environment for better accuracy

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **face-api.js** - Amazing browser-based face recognition
- **MongoDB** - Flexible document database
- **React Team** - Incredible frontend framework
- **Styled Components** - Beautiful CSS-in-JS solution
- **Framer Motion** - Smooth animations made easy

## 💬 Feedback & Contributions
This project is open to suggestions, improvements, and collaboration.  
If you find a bug, have an idea, or want to contribute — feel free to open an issue or pull request!

Your feedback is always welcome.
---
*Experience the future of human-computer interaction today!*
