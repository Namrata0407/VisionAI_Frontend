@echo off
echo =====================================
echo    VisionAI - Face Recognition Setup
echo =====================================
echo Downloading face-api.js models...
echo.

REM Create models directory
if not exist "client\public\models" (
    echo Creating models directory...
    mkdir "client\public\models"
)

REM Base URL for models
set BASE_URL=https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights

echo.
echo [1/4] Downloading tiny_face_detector_model...
powershell -Command "try { Invoke-WebRequest -Uri '%BASE_URL%/tiny_face_detector_model-weights_manifest.json' -OutFile 'client\public\models\tiny_face_detector_model-weights_manifest.json' -ErrorAction Stop; Write-Host 'Manifest downloaded' } catch { Write-Host 'Error downloading manifest' -ForegroundColor Red }"
powershell -Command "try { Invoke-WebRequest -Uri '%BASE_URL%/tiny_face_detector_model-shard1' -OutFile 'client\public\models\tiny_face_detector_model-shard1' -ErrorAction Stop; Write-Host 'Shard1 downloaded' } catch { Write-Host 'Error downloading shard1' -ForegroundColor Red }"

echo.
echo [2/4] Downloading face_landmark_68_model...
powershell -Command "try { Invoke-WebRequest -Uri '%BASE_URL%/face_landmark_68_model-weights_manifest.json' -OutFile 'client\public\models\face_landmark_68_model-weights_manifest.json' -ErrorAction Stop; Write-Host 'Manifest downloaded' } catch { Write-Host 'Error downloading manifest' -ForegroundColor Red }"
powershell -Command "try { Invoke-WebRequest -Uri '%BASE_URL%/face_landmark_68_model-shard1' -OutFile 'client\public\models\face_landmark_68_model-shard1' -ErrorAction Stop; Write-Host 'Shard1 downloaded' } catch { Write-Host 'Error downloading shard1' -ForegroundColor Red }"

echo.
echo [3/4] Downloading face_recognition_model...
powershell -Command "try { Invoke-WebRequest -Uri '%BASE_URL%/face_recognition_model-weights_manifest.json' -OutFile 'client\public\models\face_recognition_model-weights_manifest.json' -ErrorAction Stop; Write-Host 'Manifest downloaded' } catch { Write-Host 'Error downloading manifest' -ForegroundColor Red }"
powershell -Command "try { Invoke-WebRequest -Uri '%BASE_URL%/face_recognition_model-shard1' -OutFile 'client\public\models\face_recognition_model-shard1' -ErrorAction Stop; Write-Host 'Shard1 downloaded' } catch { Write-Host 'Error downloading shard1' -ForegroundColor Red }"
powershell -Command "try { Invoke-WebRequest -Uri '%BASE_URL%/face_recognition_model-shard2' -OutFile 'client\public\models\face_recognition_model-shard2' -ErrorAction Stop; Write-Host 'Shard2 downloaded' } catch { Write-Host 'Error downloading shard2' -ForegroundColor Red }"

echo.
echo [4/4] Downloading face_expression_model...
powershell -Command "try { Invoke-WebRequest -Uri '%BASE_URL%/face_expression_model-weights_manifest.json' -OutFile 'client\public\models\face_expression_model-weights_manifest.json' -ErrorAction Stop; Write-Host 'Manifest downloaded' } catch { Write-Host 'Error downloading manifest' -ForegroundColor Red }"
powershell -Command "try { Invoke-WebRequest -Uri '%BASE_URL%/face_expression_model-shard1' -OutFile 'client\public\models\face_expression_model-shard1' -ErrorAction Stop; Write-Host 'Shard1 downloaded' } catch { Write-Host 'Error downloading shard1' -ForegroundColor Red }"

echo.
echo =====================================
echo ✅ All face recognition models downloaded successfully!
echo.
echo 🚀 Next steps:
echo    1. cd client ^&^& npm install
echo    2. cd ../server ^&^& npm install  
echo    3. npm run dev (from root directory)
echo.
echo 📝 Note: Models are ~20-50MB each and stored in client/public/models/
echo 🔒 These models are gitignored for security and space reasons
echo =====================================
pause
