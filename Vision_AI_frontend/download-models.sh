#!/bin/bash
# Download face-api.js models script

echo "Downloading face-api.js models..."

# Create models directory
mkdir -p client/public/models

# Base URL for models
BASE_URL="https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"

# Model files to download
declare -a models=(
    "tiny_face_detector_model-weights_manifest.json"
    "tiny_face_detector_model-shard1"
    "face_landmark_68_model-weights_manifest.json"
    "face_landmark_68_model-shard1"
    "face_recognition_model-weights_manifest.json"
    "face_recognition_model-shard1"
    "face_recognition_model-shard2"
    "face_expression_model-weights_manifest.json"
    "face_expression_model-shard1"
)

# Download each model
for model in "${models[@]}"
do
    echo "Downloading $model..."
    curl -L "$BASE_URL/$model" -o "client/public/models/$model"
done

echo "All models downloaded successfully!"
echo "You can now start the application with: npm run dev"
