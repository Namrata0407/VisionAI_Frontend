import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const PalmContainer = styled.div`
  min-height: 100vh;
  position: relative;
  z-index: 2;
  padding: 20px;
  border: 1px solid #00ffff;
  background: rgba(0, 255, 255, 0.03);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  
  @media (max-width: 767px) {
    padding: 12px;
    min-height: auto;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  @media (max-width: 767px) {
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
  }
`;

const Title = styled.h2`
  color: #00ffff;
  text-shadow: 0 0 20px #00ffff;
  font-family: 'Orbitron', monospace;
  margin: 0;
  
  @media (max-width: 767px) {
    font-size: 18px;
    text-align: center;
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
  transition: all 0.3s ease;
  border-radius: 5px;
  min-height: 44px;

  &:hover {
    box-shadow: 0 0 15px #ff0066;
    text-shadow: 0 0 10px #ff0066;
  }
  
  @media (max-width: 767px) {
    padding: 8px 16px;
    font-size: 12px;
  }
`;

const UploadSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 767px) {
    gap: 16px;
    margin-bottom: 20px;
  }
`;

const UploadArea = styled.div`
  border: 2px dashed #00ffff;
  border-radius: 10px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(0, 255, 255, 0.05);
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  &:hover {
    border-color: #ff0066;
    background: rgba(255, 0, 102, 0.05);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  }
  
  @media (max-width: 767px) {
    padding: 20px;
    min-height: 150px;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const AddMoreButton = styled.button`
  background: transparent;
  border: 2px solid #00ffff;
  color: #00ffff;
  padding: 10px 20px;
  font-family: 'Orbitron', monospace;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 5px;
  margin-top: 10px;
  
  &:hover {
    box-shadow: 0 0 15px #00ffff;
    text-shadow: 0 0 10px #00ffff;
  }
  
  @media (max-width: 767px) {
    padding: 8px 16px;
    font-size: 12px;
  }
`;

const UploadText = styled.p`
  color: #00ffff;
  font-size: 16px;
  margin: 10px 0;
  
  @media (max-width: 767px) {
    font-size: 14px;
  }
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 300px;
  border-radius: 10px;
  border: 2px solid #00ffff;
  margin: 10px 0;
  
  @media (max-width: 767px) {
    max-height: 200px;
  }
`;

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  width: 100%;
  margin: 20px 0;
  
  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 16px;
    margin: 16px 0;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  border: 2px solid #00ffff;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(0, 255, 255, 0.05);
  
  &:hover {
    border-color: #ff0066;
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
  }
`;

const ImageTitle = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: #00ffff;
  padding: 8px;
  font-size: 12px;
  text-align: center;
  font-family: 'Orbitron', monospace;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(255, 0, 102, 0.8);
  border: none;
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: #ff0066;
    transform: scale(1.1);
  }
  
  @media (max-width: 767px) {
    width: 25px;
    height: 25px;
    font-size: 14px;
  }
`;

const ClearButton = styled.button`
  background: transparent;
  border: 2px solid #ff0066;
  color: #ff0066;
  padding: 8px 16px;
  font-family: 'Orbitron', monospace;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 5px;
  margin-left: 10px;
  font-size: 14px;
  
  &:hover {
    box-shadow: 0 0 15px #ff0066;
    text-shadow: 0 0 10px #ff0066;
    background: rgba(255, 0, 102, 0.1);
  }
  
  @media (max-width: 767px) {
    margin-left: 0;
    margin-top: 10px;
    padding: 6px 12px;
    font-size: 12px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  @media (max-width: 767px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const AnalyzeButton = styled.button`
  background: linear-gradient(45deg, #ff0066, #00ffff);
  border: none;
  color: white;
  padding: 15px 30px;
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 25px;
  font-size: 16px;
  min-height: 44px;
  
  &:hover {
    box-shadow: 0 0 25px rgba(255, 0, 102, 0.5);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 767px) {
    padding: 12px 24px;
    font-size: 14px;
  }
`;

const ResultSection = styled.div`
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid #00ffff;
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
  
  @media (max-width: 767px) {
    padding: 16px;
    margin-top: 16px;
  }
`;

const PredictionCard = styled.div`
  background: rgba(255, 0, 102, 0.1);
  border: 1px solid #ff0066;
  border-radius: 8px;
  padding: 15px;
  margin: 10px 0;
  
  @media (max-width: 767px) {
    padding: 12px;
    margin: 8px 0;
  }
`;

const CategoryTitle = styled.h4`
  color: #ff0066;
  margin: 0 0 10px 0;
  font-family: 'Orbitron', monospace;
  
  @media (max-width: 767px) {
    font-size: 14px;
    margin-bottom: 8px;
  }
`;

const PredictionText = styled.p`
  color: #00ffff;
  margin: 0;
  line-height: 1.6;
  
  @media (max-width: 767px) {
    font-size: 13px;
    line-height: 1.5;
  }
`;

const LoadingSpinner = styled.div`
  border: 3px solid rgba(0, 255, 255, 0.1);
  border-top: 3px solid #00ffff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const PalmReading = ({ onBack }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = {
            file: file,
            preview: e.target.result,
            id: Date.now() + Math.random(), // Unique ID
            name: file.name
          };
          
          setSelectedImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
    
    setPrediction(null); // Clear previous prediction
  };

  const removeImage = (imageId) => {
    setSelectedImages(prev => {
      const updatedImages = prev.filter(img => img.id !== imageId);
      // Auto-clear prediction when any image is removed
      if (updatedImages.length === 0 || updatedImages.length !== prev.length) {
        setPrediction(null);
      }
      return updatedImages;
    });
  };

  const clearResults = () => {
    setPrediction(null);
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel(); // Stop any ongoing speech
    }
  };

  const clearAllData = () => {
    setSelectedImages([]);
    setPrediction(null);
    setIsAnalyzing(false);
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  };

  // Auto-clear results when all images are removed
  React.useEffect(() => {
    if (selectedImages.length === 0 && prediction) {
      setPrediction(null);
    }
  }, [selectedImages.length, prediction]);

  const analyzePalm = async () => {
    if (selectedImages.length === 0) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis with realistic delay
    setTimeout(() => {
      const predictions = generatePalmPrediction();
      setPrediction(predictions);
      setIsAnalyzing(false);
      
      // Speak the fortune in Hindi with more dynamic content
      if ('speechSynthesis' in window) {
        const imageCount = selectedImages.length;
        const fortuneText = `${imageCount} हस्तरेखा${imageCount > 1 ? 'ओं' : ''} का विश्लेषण पूरा हुआ। ${predictions.accuracy}% सटीकता के साथ, ${predictions.fortune.hindi}`;
        const utterance = new SpeechSynthesisUtterance(fortuneText);
        utterance.lang = 'hi-IN';
        utterance.rate = 0.7;
        utterance.pitch = 1.2;
        
        // Try to get a female Hindi voice
        const voices = speechSynthesis.getVoices();
        const hindiVoice = voices.find(voice => 
          voice.lang.includes('hi') && 
          (voice.name.toLowerCase().includes('female') || 
           voice.name.toLowerCase().includes('kalpana') ||
           voice.name.toLowerCase().includes('rashmi'))
        );
        if (hindiVoice) {
          utterance.voice = hindiVoice;
        }
        
        speechSynthesis.speak(utterance);
      }
    }, Math.floor(Math.random() * 2000) + 2000); // 2-4 seconds random delay
  };

  const generatePalmPrediction = () => {
    // Generate predictions based on all images properties and current time for uniqueness
    const combinedImageHash = selectedImages.reduce((acc, img) => 
      acc + (img.file.size + img.file.lastModified), 0) || Date.now();
    const timeBasedSeed = new Date().getHours() + new Date().getMinutes();
    const uniqueSeed = combinedImageHash + timeBasedSeed + selectedImages.length;
    
    // Use the seed to create deterministic but varied predictions
    const personalityTraits = [
      "रचनात्मक और कलात्मक", "बुद्धिमान और विश्लेषणात्मक", "दयालु और संवेदनशील", 
      "साहसी और निडर", "धैर्यवान और स्थिर", "उत्साही और ऊर्जावान",
      "व्यावहारिक और तर्कसंगत", "स्वतंत्र और आत्मनिर्भर", "सामाजिक और मिलनसार"
    ];
    
    const careerFields = [
      "तकनीक और इंजीनियरिंग", "कला और डिज़ाइन", "व्यापार और उद्यमिता",
      "शिक्षा और अनुसंधान", "स्वास्थ्य सेवा", "मीडिया और संचार",
      "वित्त और बैंकिंग", "कानून और न्याय", "खेल और फिटनेस"
    ];
    
    const loveStatuses = [
      "आने वाले 6 महीनों में", "इस वर्ष के अंत तक", "नए साल में",
      "वसंत के मौसम में", "आपके 25वें जन्मदिन के आसपास", "किसी त्योहार के दिन"
    ];
    
    const healthAdvices = [
      "योग और प्राणायाम", "नियमित व्यायाम", "संतुलित आहार",
      "ध्यान और तनाव प्रबंधन", "पर्याप्त नींद", "सकारात्मक सोच"
    ];
    
    const wealthTiming = [
      "अगले 2 वर्षों में", "35 की उम्र के बाद", "किसी नए प्रोजेक्ट से",
      "पारिवारिक व्यापार से", "विदेश से जुड़े काम से", "तकनीकी निवेश से"
    ];
    
    // Generate based on image characteristics
    const personality = personalityTraits[uniqueSeed % personalityTraits.length];
    const career = careerFields[(uniqueSeed * 3) % careerFields.length];
    const love = loveStatuses[(uniqueSeed * 5) % loveStatuses.length];
    const health = healthAdvices[(uniqueSeed * 7) % healthAdvices.length];
    const wealth = wealthTiming[(uniqueSeed * 11) % wealthTiming.length];
    
    const fortunes = [
      {
        category: "व्यक्तित्व (Personality)",
        hindi: `आप एक ${personality} व्यक्ति हैं। आपमें प्राकृतिक नेतृत्व क्षमता है और लोग आपकी सलाह मानते हैं।`,
        english: `You are a ${personality.split(' और ')[0]} person with natural leadership abilities and people value your advice.`
      },
      {
        category: "करियर (Career)", 
        hindi: `आपका करियर ${career} क्षेत्र में विशेष रूप से सफल होगा। ${Math.random() > 0.5 ? 'नई शुरुआत का समय बहुत अच्छा है।' : 'मौजूदा काम में प्रमोशन की संभावना है।'}`,
        english: `Your career will be especially successful in ${career} field. ${Math.random() > 0.5 ? "It's a great time for new beginnings." : "Promotion possibilities in current work."}`
      },
      {
        category: "प्रेम जीवन (Love Life)",
        hindi: `आपको सच्चा प्रेम ${love} मिलने की प्रबल संभावना है। ${Math.random() > 0.5 ? 'पहले से जान-पहचान वाले व्यक्ति से प्रेम हो सकता है।' : 'नए व्यक्ति से मुलाकात होगी।'}`,
        english: `You have strong chances of finding true love ${love}. ${Math.random() > 0.5 ? "It might be with someone you already know." : "You'll meet someone new."}`
      },
      {
        category: "स्वास्थ्य (Health)",
        hindi: `आपका स्वास्थ्य ${health} से और भी बेहतर होगा। ${Math.random() > 0.5 ? 'छोटी-मोटी समस्याओं से बचाव रहेगा।' : 'ऊर्जा का स्तर बढ़ेगा।'}`,
        english: `Your health will improve significantly with ${health}. ${Math.random() > 0.5 ? "You'll be protected from minor health issues." : "Your energy levels will increase."}`
      },
      {
        category: "धन (Wealth)",
        hindi: `आर्थिक उन्नति ${wealth} होगी। ${Math.random() > 0.5 ? 'पुराने निवेश से लाभ मिलेगा।' : 'नए आय के स्रोत खुलेंगे।'}`,
        english: `Financial growth will happen ${wealth}. ${Math.random() > 0.5 ? "Old investments will bring profits." : "New income sources will open."}`
      }
    ];

    const lifeLines = [
      `आपकी जीवन रेखा ${Math.random() > 0.5 ? 'लंबी और मजबूत' : 'गहरी और स्पष्ट'} है, जो ${Math.random() > 0.5 ? 'दीर्घायु' : 'स्वस्थ जीवन'} का संकेत है।`,
      `आपकी हृदय रेखा ${Math.random() > 0.5 ? 'बहुत गहरी' : 'साफ और स्पष्ट'} है, जो ${Math.random() > 0.5 ? 'भावनात्मक स्थिरता' : 'प्रेम में सफलता'} दर्शाती है।`,
      `आपकी मस्तिष्क रेखा ${Math.random() > 0.5 ? 'तीक्ष्ण और लंबी' : 'शाखाओं के साथ'} है, जो ${Math.random() > 0.5 ? 'तेज बुद्धि' : 'रचनात्मक सोच'} का प्रमाण है।`,
      `आपकी भाग्य रेखा ${Math.random() > 0.5 ? 'एकदम सीधी' : 'मजबूत और गहरी'} है, जो ${Math.random() > 0.5 ? 'निरंतर सफलता' : 'भाग्यशाली भविष्य'} का संकेत देती है।`,
      `आपके हाथ में ${Math.random() > 0.5 ? 'सूर्य रेखा' : 'बुध रेखा'} स्पष्ट दिख रही है, जो ${Math.random() > 0.5 ? 'प्रसिद्धि' : 'व्यापारिक सफलता'} का संकेत है।`
    ];

    const fortuneMessages = [
      {
        hindi: `आने वाले ${Math.floor(Math.random() * 6) + 1} महीने आपके लिए बहुत शुभ हैं। ${Math.random() > 0.5 ? 'सफलता आपके कदम चूमेगी' : 'खुशखबरी का इंतज़ार करें'}।`,
        english: `The next ${Math.floor(Math.random() * 6) + 1} months are very auspicious for you. ${Math.random() > 0.5 ? "Success will kiss your feet" : "Wait for good news"}.`
      },
      {
        hindi: `आपकी मेहनत ${Math.random() > 0.5 ? 'जल्द ही' : '3 महीने में'} रंग लाएगी। ${Math.random() > 0.5 ? 'धैर्य रखें और आगे बढ़ते रहें' : 'बड़ा मौका आने वाला है'}।`,
        english: `Your hard work will pay off ${Math.random() > 0.5 ? "soon" : "in 3 months"}. ${Math.random() > 0.5 ? "Be patient and keep moving forward" : "A big opportunity is coming"}.`
      },
      {
        hindi: `आपके जीवन में ${Math.random() > 0.5 ? 'नई खुशियां' : 'सकारात्मक बदलाव'} आने वाली हैं। ${Math.random() > 0.5 ? 'परिवार के साथ अच्छा समय बिताएं' : 'नए रिश्ते बनेंगे'}।`,
        english: `${Math.random() > 0.5 ? "New happiness" : "Positive changes"} are coming into your life. ${Math.random() > 0.5 ? "Spend good time with family" : "New relationships will form"}.`
      },
      {
        hindi: `${['शुक्र', 'बुध', 'बृहस्पति', 'मंगल'][Math.floor(Math.random() * 4)]} ग्रह आपके अनुकूल है। ${Math.random() > 0.5 ? 'यात्रा से लाभ होगा' : 'नया काम शुरू करने का समय है'}।`,
        english: `Planet ${['Venus', 'Mercury', 'Jupiter', 'Mars'][Math.floor(Math.random() * 4)]} is favorable for you. ${Math.random() > 0.5 ? "Travel will bring benefits" : "Time to start new work"}.`
      }
    ];

    // Generate unique predictions based on image and time
    const selectedPredictions = fortunes.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 3);
    const selectedLifeLine = lifeLines[(uniqueSeed * 13) % lifeLines.length];
    const selectedFortune = fortuneMessages[(uniqueSeed * 17) % fortuneMessages.length];
    
    // Add special predictions based on "image analysis"
    const specialPredictions = [];
    if (Math.random() > 0.7) {
      specialPredictions.push({
        category: "विशेष संकेत (Special Sign)",
        hindi: `आपके हाथ में ${['त्रिशूल का निशान', 'तारे का निशान', 'मछली का निशान', 'कमल का निशान'][Math.floor(Math.random() * 4)]} दिख रहा है, जो अत्यंत शुभ है।`,
        english: `A ${['trident mark', 'star mark', 'fish mark', 'lotus mark'][Math.floor(Math.random() * 4)]} is visible in your palm, which is extremely auspicious.`
      });
    }
    
    if (Math.random() > 0.6) {
      specialPredictions.push({
        category: "भाग्यशाली संख्या (Lucky Numbers)",
        hindi: `आपके लिए ${Math.floor(Math.random() * 9) + 1}, ${Math.floor(Math.random() * 9) + 10}, और ${Math.floor(Math.random() * 9) + 20} संख्याएं भाग्यशाली हैं।`,
        english: `Numbers ${Math.floor(Math.random() * 9) + 1}, ${Math.floor(Math.random() * 9) + 10}, and ${Math.floor(Math.random() * 9) + 20} are lucky for you.`
      });
    }

    return {
      predictions: [...selectedPredictions, ...specialPredictions],
      lifeLine: selectedLifeLine,
      fortune: selectedFortune,
      accuracy: Math.floor(Math.random() * 15) + 85, // 85-99% accuracy
      analysisDetails: {
        totalImages: selectedImages.length,
        imageNames: selectedImages.map(img => img.name).join(', '),
        combinedImageSize: selectedImages.reduce((acc, img) => acc + img.file.size, 0),
        timestamp: new Date().toLocaleTimeString(),
        uniqueFactors: Math.floor(Math.random() * 50) + 10 + (selectedImages.length * 5)
      }
    };
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <PalmContainer>
      <Header>
        <Title>🔮 हस्तरेखा विज्ञान - Palm Reading</Title>
        <BackButton onClick={onBack}>← BACK</BackButton>
      </Header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <UploadSection>
          <UploadArea onClick={handleUploadClick}>
            <HiddenInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
            />
            {selectedImages.length === 0 ? (
              <>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>🤚</div>
                <UploadText>अपने दोनों हाथों की तस्वीर अपलोड करें</UploadText>
                <UploadText style={{ fontSize: '14px', color: '#888' }}>
                  Upload photos of both your palms (JPG, PNG, WEBP)
                </UploadText>
                <UploadText style={{ fontSize: '12px', color: '#666' }}>
                  You can select multiple images at once
                </UploadText>
              </>
            ) : (
              <>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>📸</div>
                <UploadText>Click to add more palm images</UploadText>
                <UploadText style={{ fontSize: '12px', color: '#888' }}>
                  {selectedImages.length} image{selectedImages.length > 1 ? 's' : ''} selected
                </UploadText>
              </>
            )}
          </UploadArea>

          {selectedImages.length > 0 && (
            <>
              <ImagesGrid>
                {selectedImages.map((image, index) => (
                  <ImageContainer key={image.id}>
                    <ImagePreview src={image.preview} alt={`Palm ${index + 1}`} />
                    <RemoveButton onClick={() => removeImage(image.id)}>
                      ×
                    </RemoveButton>
                    <ImageTitle>
                      हाथ {index + 1} - {image.name.substring(0, 15)}
                      {image.name.length > 15 ? '...' : ''}
                    </ImageTitle>
                  </ImageContainer>
                ))}
              </ImagesGrid>
              
              <ButtonContainer>
                <AnalyzeButton 
                  onClick={analyzePalm} 
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? 'Analyzing...' : `🔍 ${selectedImages.length} हस्तरेखा${selectedImages.length > 1 ? 'ओं' : ''} का विश्लेषण करें`}
                </AnalyzeButton>
                
                {prediction && (
                  <ClearButton onClick={clearResults}>
                    🗑️ Clear Results
                  </ClearButton>
                )}
                
                <ClearButton onClick={clearAllData}>
                  ❌ Clear All
                </ClearButton>
              </ButtonContainer>
            </>
          )}
        </UploadSection>

        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center' }}
          >
            <LoadingSpinner />
            <p style={{ color: '#00ffff', marginTop: '10px' }}>
              🔮 आपकी हस्तरेखाओं का विश्लेषण हो रहा है... <br />
              <span style={{ fontSize: '12px', color: '#888' }}>
                Analyzing your palm lines with AI...
              </span>
            </p>
          </motion.div>
        )}

        {prediction && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ResultSection>
              <h3 style={{ 
                color: '#00ffff', 
                textAlign: 'center', 
                marginBottom: '20px',
                fontSize: '20px'
              }}>
                🌟 आपका भविष्यफल - Your Fortune
              </h3>
              
              <div style={{ 
                textAlign: 'center', 
                marginBottom: '20px',
                color: '#ff0066',
                fontSize: '14px'
              }}>
                Accuracy: {prediction.accuracy}% | Analysis Time: {prediction.analysisDetails.timestamp}<br/>
                <span style={{ fontSize: '12px', color: '#888' }}>
                  {prediction.analysisDetails.uniqueFactors} unique palm characteristics detected
                </span>
              </div>

              {prediction.predictions.map((pred, index) => (
                <PredictionCard key={index}>
                  <CategoryTitle>{pred.category}</CategoryTitle>
                  <PredictionText>{pred.hindi}</PredictionText>
                  <PredictionText style={{ 
                    fontSize: '12px', 
                    color: '#888', 
                    marginTop: '5px' 
                  }}>
                    {pred.english}
                  </PredictionText>
                </PredictionCard>
              ))}

              <PredictionCard style={{ background: 'rgba(0, 255, 255, 0.1)' }}>
                <CategoryTitle>जीवन रेखा विश्लेषण - Life Line Analysis</CategoryTitle>
                <PredictionText>{prediction.lifeLine}</PredictionText>
              </PredictionCard>

              <PredictionCard style={{ 
                background: 'linear-gradient(45deg, rgba(255, 0, 102, 0.1), rgba(0, 255, 255, 0.1))',
                border: '2px solid #ff0066'
              }}>
                <CategoryTitle>🎯 मुख्य भविष्यवाणी - Main Prediction</CategoryTitle>
                <PredictionText style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  {prediction.fortune.hindi}
                </PredictionText>
                <PredictionText style={{ 
                  fontSize: '13px', 
                  color: '#888', 
                  marginTop: '8px' 
                }}>
                  {prediction.fortune.english}
                </PredictionText>
              </PredictionCard>

              <div style={{ 
                textAlign: 'center', 
                marginTop: '20px',
                color: '#888',
                fontSize: '12px'
              }}>
                ⚠️ यह केवल मनोरंजन के लिए है। वास्तविक निर्णयों के लिए विशेषज्ञ सलाह लें।<br />
                This is for entertainment purposes only. Consult experts for real decisions.
              </div>
            </ResultSection>
          </motion.div>
        )}
      </motion.div>
    </PalmContainer>
  );
};

export default PalmReading;
