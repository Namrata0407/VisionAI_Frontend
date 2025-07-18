# VisionAI Setup Guide

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd videoGenerator
```

### 2. Download Face Recognition Models
**For Windows:**
```bash
# Run the batch file to download required AI models
download-models.bat
```

**For macOS/Linux:**
```bash
# Create models directory
mkdir -p client/public/models

# Download models manually or create a shell script
cd client/public/models
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1
# ... (repeat for other models)
```

### 3. Install Dependencies
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies  
cd ../server
npm install
```

### 4. Environment Setup
```bash
# Copy environment files
cp server/.env.example server/.env
cp client/.env.example client/.env

# Edit the .env files with your configuration
```

### 5. Start Development
```bash
# From root directory
npm run dev
```

## 📁 Models Information

The `download-models.bat` script downloads these AI models:

- **tiny_face_detector_model** (~1.3MB) - Fast face detection
- **face_landmark_68_model** (~350KB) - Facial landmark detection  
- **face_recognition_model** (~6.2MB) - Face recognition and verification
- **face_expression_model** (~310KB) - Emotion detection

**Note:** These models are automatically excluded from Git via `.gitignore` to save repository space.

## 🔧 Troubleshooting

### Models Download Issues
- Ensure you have internet connection
- Run PowerShell as Administrator if needed
- Manually download from: https://github.com/justadudewhohacks/face-api.js/tree/master/weights

### Face Recognition Not Working
- Check if models are in `client/public/models/` directory
- Ensure camera permissions are granted
- Try in HTTPS environment for camera access

## 🛠️ Development Tools

- **download-models.bat** - Downloads face recognition models
- **.gitignore** - Excludes models and sensitive files
- **package.json** - Project dependencies and scripts
