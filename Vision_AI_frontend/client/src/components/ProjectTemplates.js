import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const Container = styled.div`
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const BackButton = styled.button`
  align-self: flex-start;
  background: transparent;
  border: 2px solid #ff0066;
  color: #ff0066;
  padding: 10px 20px;
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 30px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 15px #ff0066;
    text-shadow: 0 0 10px #ff0066;
  }
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  flex: 1;
  
  /* Apply responsive classes */
  &.project-grid {
    /* Styles will be overridden by responsive.css */
  }
`;

const ProjectCard = styled(motion.div)`
  border: 2px solid #00ffff;
  border-radius: 15px;
  padding: 25px;
  background: rgba(0, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: #ff0066;
    box-shadow: 
      0 0 30px rgba(255, 0, 102, 0.3),
      inset 0 0 30px rgba(255, 0, 102, 0.1);
    transform: translateY(-5px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.1), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }
`;

const ProjectTitle = styled.h3`
  color: #00ffff;
  margin-bottom: 15px;
  font-size: 24px;
  text-shadow: 0 0 10px #00ffff;
`;

const ProjectDescription = styled.p`
  color: #ccc;
  margin-bottom: 20px;
  line-height: 1.6;
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
`;

const TechTag = styled.span`
  background: rgba(255, 0, 102, 0.2);
  color: #ff0066;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid #ff0066;
`;

const StartButton = styled.button`
  width: 100%;
  background: transparent;
  border: 2px solid #00ff00;
  color: #00ff00;
  padding: 12px;
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 20px #00ff00;
    background: rgba(0, 255, 0, 0.1);
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: #0a0a0a;
  border: 2px solid #00ffff;
  border-radius: 20px;
  padding: 30px;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #1a1a1a;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #00ffff;
    border-radius: 4px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: 2px solid #ff0066;
  color: #ff0066;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 15px #ff0066;
  }
`;

const GuideSection = styled.div`
  margin-bottom: 30px;
  
  h3 {
    color: #00ffff;
    margin-bottom: 15px;
    font-size: 18px;
    text-shadow: 0 0 10px #00ffff;
  }
  
  p {
    color: #ccc;
    line-height: 1.6;
    margin-bottom: 15px;
  }
  
  ul {
    color: #ccc;
    padding-left: 20px;
    
    li {
      margin-bottom: 8px;
      line-height: 1.4;
    }
  }
  
  code {
    background: rgba(0, 255, 255, 0.1);
    color: #00ffff;
    padding: 2px 8px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
  }
`;

const ResourceLink = styled.a`
  color: #ff0066;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    color: #00ffff;
    text-shadow: 0 0 10px #00ffff;
  }
`;

const CommandBox = styled.div`
  background: #1a1a1a;
  border: 1px solid #00ffff;
  border-radius: 8px;
  padding: 15px;
  margin: 10px 0;
  font-family: 'Courier New', monospace;
  color: #00ffff;
  white-space: pre-wrap;
  overflow-x: auto;
`;

const ProjectTemplates = ({ onBack }) => {
  const [selectedProject, setSelectedProject] = useState(null);

  // Load voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      console.log('📢 ProjectTemplates - Available voices:', voices.map(v => ({ name: v.name, lang: v.lang })));
      
      // Find female voices
      const femaleVoices = voices.filter(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('alice') ||
        voice.name.toLowerCase().includes('victoria') ||
        voice.name.toLowerCase().includes('zira') ||
        voice.name.toLowerCase().includes('eva')
      );
      
      console.log('👩 ProjectTemplates - Female voices found:', femaleVoices.map(v => ({ name: v.name, lang: v.lang })));
    };

    // Load voices immediately if available
    if (speechSynthesis.getVoices().length > 0) {
      loadVoices();
    } else {
      // Wait for voices to be loaded
      speechSynthesis.addEventListener('voiceschanged', loadVoices);
    }

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const projects = [
    {
      id: 'react-dashboard',
      title: 'React Admin Dashboard',
      description: 'Modern admin dashboard with charts, tables, and real-time data visualization.',
      tech: ['React', 'Material-UI', 'Chart.js', 'Axios'],
      icon: '📊',
      difficulty: 'Intermediate',
      setupTime: '30-45 minutes',
      guide: {
        overview: 'Create a professional admin dashboard with data visualization, user management, and real-time analytics.',
        prerequisites: ['Basic knowledge of React and JavaScript', 'Node.js installed', 'Understanding of API integration'],
        steps: [
          'Create a new React app using Create React App',
          'Install Material-UI and Chart.js dependencies',
          'Set up routing with React Router',
          'Create dashboard layout with sidebar and header',
          'Implement data visualization with Chart.js',
          'Add user management functionality',
          'Integrate with REST API for data fetching',
          'Add authentication and authorization',
          'Style with Material-UI components',
          'Deploy to production'
        ],
        commands: `npx create-react-app admin-dashboard
cd admin-dashboard
npm install @mui/material @emotion/react @emotion/styled
npm install chart.js react-chartjs-2
npm install react-router-dom axios
npm start`,
        resources: [
          { name: 'React Admin Dashboard Tutorial', url: 'https://www.youtube.com/watch?v=jx5hdo50a2M' },
          { name: 'Material-UI Documentation', url: 'https://mui.com/getting-started/installation/' },
          { name: 'Chart.js Guide', url: 'https://www.chartjs.org/docs/latest/' },
          { name: 'React Router Tutorial', url: 'https://reactrouter.com/web/guides/quick-start' }
        ]
      }
    },
    {
      id: 'nextjs-ecommerce',
      title: 'Next.js E-commerce',
      description: 'Full-stack e-commerce platform with payment integration and admin panel.',
      tech: ['Next.js', 'Stripe', 'Prisma', 'Tailwind'],
      icon: '🛒',
      difficulty: 'Advanced',
      setupTime: '60-90 minutes',
      guide: {
        overview: 'Build a complete e-commerce website with product management, shopping cart, payment processing, and admin dashboard.',
        prerequisites: ['Strong knowledge of React and Next.js', 'Database fundamentals', 'Payment gateway understanding'],
        steps: [
          'Create Next.js app with TypeScript',
          'Set up Prisma with your database',
          'Configure Tailwind CSS for styling',
          'Create product catalog and search',
          'Implement shopping cart functionality',
          'Set up Stripe payment integration',
          'Build user authentication system',
          'Create admin panel for product management',
          'Add order management system',
          'Deploy to Vercel or similar platform'
        ],
        commands: `npx create-next-app@latest ecommerce --typescript --tailwind --eslint
cd ecommerce
npm install @prisma/client prisma stripe
npm install @stripe/stripe-js
npm install next-auth
npx prisma init
npm run dev`,
        resources: [
          { name: 'Next.js E-commerce Tutorial', url: 'https://www.youtube.com/watch?v=4mOkFXyxfsU' },
          { name: 'Stripe Integration Guide', url: 'https://stripe.com/docs/development' },
          { name: 'Prisma Documentation', url: 'https://www.prisma.io/docs/' },
          { name: 'Next.js Commerce Template', url: 'https://nextjs.org/commerce' }
        ]
      }
    },
    {
      id: 'react-chat',
      title: 'Real-time Chat App',
      description: 'WebSocket-based chat application with rooms, file sharing, and emoji support.',
      tech: ['React', 'Socket.io', 'Node.js', 'MongoDB'],
      icon: '💬',
      difficulty: 'Intermediate',
      setupTime: '45-60 minutes',
      guide: {
        overview: 'Create a real-time chat application with multiple rooms, file sharing, online users, and emoji support.',
        prerequisites: ['React knowledge', 'Node.js basics', 'Understanding of WebSockets'],
        steps: [
          'Set up React frontend and Node.js backend',
          'Install and configure Socket.io',
          'Create chat interface with message history',
          'Implement real-time messaging',
          'Add user authentication',
          'Create chat rooms functionality',
          'Add file sharing capabilities',
          'Implement emoji picker',
          'Show online users list',
          'Add message persistence with MongoDB'
        ],
        commands: `mkdir chat-app && cd chat-app
npx create-react-app client
mkdir server && cd server
npm init -y
npm install express socket.io cors
npm install mongoose bcryptjs jsonwebtoken
cd ../client
npm install socket.io-client emoji-picker-react
npm start`,
        resources: [
          { name: 'Socket.io Chat Tutorial', url: 'https://www.youtube.com/watch?v=ZKEqqIO7n-k' },
          { name: 'Socket.io Documentation', url: 'https://socket.io/docs/v4/' },
          { name: 'Real-time Chat with React', url: 'https://www.youtube.com/watch?v=NU_1StN5Tkk' },
          { name: 'MongoDB Integration', url: 'https://docs.mongodb.com/manual/tutorial/getting-started/' }
        ]
      }
    },
    {
      id: 'portfolio',
      title: 'Portfolio Website',
      description: 'Responsive portfolio website with animations and dark/light theme toggle.',
      tech: ['React', 'Framer Motion', 'Styled Components'],
      icon: '🎨',
      difficulty: 'Beginner',
      setupTime: '20-30 minutes',
      guide: {
        overview: 'Build a stunning personal portfolio website with smooth animations, responsive design, and modern UI.',
        prerequisites: ['Basic React knowledge', 'CSS fundamentals', 'Design basics'],
        steps: [
          'Create React app with required dependencies',
          'Set up Styled Components for styling',
          'Create responsive layout structure',
          'Add Framer Motion animations',
          'Build hero section with introduction',
          'Create projects showcase section',
          'Add skills and experience sections',
          'Implement contact form',
          'Add dark/light theme toggle',
          'Make it mobile responsive'
        ],
        commands: `npx create-react-app portfolio
cd portfolio
npm install styled-components framer-motion
npm install react-icons
npm install emailjs-com
npm start`,
        resources: [
          { name: 'Portfolio Website Tutorial', url: 'https://www.youtube.com/watch?v=bmpI252DmiI' },
          { name: 'Framer Motion Guide', url: 'https://www.framer.com/motion/' },
          { name: 'Styled Components Docs', url: 'https://styled-components.com/' },
          { name: 'Portfolio Design Ideas', url: 'https://dribbble.com/shots/popular/web-design' }
        ]
      }
    },
    {
      id: 'task-manager',
      title: 'Task Management App',
      description: 'Kanban-style task manager with drag & drop, deadlines, and team collaboration.',
      tech: ['React', 'DnD Kit', 'Zustand', 'Date-fns'],
      icon: '✅',
      difficulty: 'Intermediate',
      setupTime: '40-55 minutes',
      guide: {
        overview: 'Create a Trello-like task management app with drag-and-drop, deadline tracking, and team features.',
        prerequisites: ['React experience', 'State management knowledge', 'UI/UX understanding'],
        steps: [
          'Set up React app with required libraries',
          'Configure Zustand for state management',
          'Create board and card components',
          'Implement drag and drop with DnD Kit',
          'Add task creation and editing',
          'Implement deadline management',
          'Add user assignment features',
          'Create progress tracking',
          'Add search and filter functionality',
          'Implement data persistence'
        ],
        commands: `npx create-react-app task-manager
cd task-manager
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install zustand date-fns
npm install react-datepicker
npm start`,
        resources: [
          { name: 'Kanban Board Tutorial', url: 'https://www.youtube.com/watch?v=DX9iplBfi2E' },
          { name: 'DnD Kit Documentation', url: 'https://dndkit.com/' },
          { name: 'Zustand State Management', url: 'https://github.com/pmndrs/zustand' },
          { name: 'Task Manager Design', url: 'https://www.figma.com/community/file/992611372896965624' }
        ]
      }
    },
    {
      id: 'weather-app',
      title: 'Weather Dashboard',
      description: 'Beautiful weather app with forecasts, maps, and location-based suggestions.',
      tech: ['React', 'OpenWeather API', 'Leaflet', 'PWA'],
      icon: '🌤️',
      difficulty: 'Beginner',
      setupTime: '25-35 minutes',
      guide: {
        overview: 'Build a modern weather app with current conditions, forecasts, interactive maps, and PWA capabilities.',
        prerequisites: ['Basic React knowledge', 'API integration basics', 'CSS skills'],
        steps: [
          'Create React app and install dependencies',
          'Get OpenWeather API key',
          'Set up location-based weather fetching',
          'Create weather display components',
          'Add 5-day forecast feature',
          'Integrate Leaflet maps',
          'Add geolocation support',
          'Implement search functionality',
          'Make it a Progressive Web App',
          'Add offline support'
        ],
        commands: `npx create-react-app weather-app
cd weather-app
npm install axios react-leaflet leaflet
npm install workbox-webpack-plugin
npm install react-icons
npm start`,
        resources: [
          { name: 'Weather App Tutorial', url: 'https://www.youtube.com/watch?v=GuA0_Z1llYU' },
          { name: 'OpenWeather API Docs', url: 'https://openweathermap.org/api' },
          { name: 'React Leaflet Guide', url: 'https://react-leaflet.js.org/' },
          { name: 'PWA Implementation', url: 'https://web.dev/progressive-web-apps/' }
        ]
      }
    }
  ];

  const handleStartProject = (project) => {
    setSelectedProject(project);
    
    // Speak confirmation with female voice
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `Opening detailed guide for ${project.title}. This will take approximately ${project.setupTime} to complete.`
      );
      
      // Get available voices and select female voice
      const voices = speechSynthesis.getVoices();
      let selectedVoice = null;
      
      // Priority order for English female voices
      const englishVoiceNames = [
        'Microsoft Zira - English (United States)',
        'Microsoft Eva - English (United States)',
        'Google US English',
        'Samantha',
        'Alice',
        'Victoria',
        'Allison',
        'Ava',
        'Susan',
        'Vicki'
      ];
      
      // Try to find specific female English voices
      for (const voiceName of englishVoiceNames) {
        selectedVoice = voices.find(voice => voice.name.includes(voiceName));
        if (selectedVoice) break;
      }
      
      // If no specific voice found, try general patterns
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang.includes('en') && 
          (voice.name.toLowerCase().includes('female') || 
           voice.name.toLowerCase().includes('woman') ||
           voice.name.toLowerCase().includes('samantha') ||
           voice.name.toLowerCase().includes('alice') ||
           voice.name.toLowerCase().includes('victoria') ||
           voice.name.toLowerCase().includes('zira') ||
           voice.name.toLowerCase().includes('eva'))
        );
      }
      
      // If still no female voice found, use any English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.includes('en'));
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1.4; // Higher pitch for female voice
      utterance.volume = 0.8;
      
      speechSynthesis.speak(utterance);
      console.log('🔊 ProjectTemplates speaking with voice:', selectedVoice?.name);
    }
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  return (
    <Container>
      <BackButton onClick={onBack}>
        ← BACK TO DASHBOARD
      </BackButton>
      
      <motion.h2 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="neon-text"
        style={{ marginBottom: '30px', textAlign: 'center' }}
      >
        PROJECT TEMPLATES
      </motion.h2>

      <ProjectGrid className="project-grid">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="project-card"
          >
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>
              {project.icon}
            </div>
            
            <ProjectTitle className="project-title">{project.title}</ProjectTitle>
            
            <div style={{ 
              color: getDifficultyColor(project.difficulty), 
              fontSize: '12px', 
              fontWeight: 'bold',
              marginBottom: '8px',
              textTransform: 'uppercase'
            }}>
              {project.difficulty} • {project.setupTime}
            </div>
            
            <ProjectDescription>
              {project.description}
            </ProjectDescription>
            
            <TechStack className="tech-stack">
              {project.tech.map((tech, i) => (
                <TechTag key={i} className="tech-tag">{tech}</TechTag>
              ))}
            </TechStack>
            
            <StartButton onClick={() => handleStartProject(project)} className="cyber-button">
              VIEW GUIDE
            </StartButton>
          </ProjectCard>
        ))}
      </ProjectGrid>

      <AnimatePresence>
        {selectedProject && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="modal-content"
            >
              <CloseButton onClick={closeModal}>×</CloseButton>
              
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>
                {selectedProject.icon}
              </div>
              
              <ProjectTitle>{selectedProject.title}</ProjectTitle>
              
              <div style={{ 
                color: getDifficultyColor(selectedProject.difficulty), 
                fontSize: '14px', 
                fontWeight: 'bold',
                marginBottom: '20px',
                textTransform: 'uppercase'
              }}>
                {selectedProject.difficulty} • Setup Time: {selectedProject.setupTime}
              </div>

              <GuideSection>
                <h3>📋 Overview</h3>
                <p>{selectedProject.guide.overview}</p>
              </GuideSection>

              <GuideSection>
                <h3>✅ Prerequisites</h3>
                <ul>
                  {selectedProject.guide.prerequisites.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </GuideSection>

              <GuideSection>
                <h3>⚡ Quick Setup Commands</h3>
                <CommandBox>{selectedProject.guide.commands}</CommandBox>
              </GuideSection>

              <GuideSection>
                <h3>🚀 Step-by-Step Guide</h3>
                <ol style={{ color: '#ccc', paddingLeft: '20px' }}>
                  {selectedProject.guide.steps.map((step, i) => (
                    <li key={i} style={{ marginBottom: '8px', lineHeight: '1.4' }}>
                      {step}
                    </li>
                  ))}
                </ol>
              </GuideSection>

              <GuideSection>
                <h3>🔗 Helpful Resources</h3>
                <ul>
                  {selectedProject.guide.resources.map((resource, i) => (
                    <li key={i}>
                      <ResourceLink href={resource.url} target="_blank" rel="noopener noreferrer">
                        {resource.name}
                      </ResourceLink>
                    </li>
                  ))}
                </ul>
              </GuideSection>

              <GuideSection>
                <h3>🛠️ Tech Stack</h3>
                <TechStack>
                  {selectedProject.tech.map((tech, i) => (
                    <TechTag key={i}>{tech}</TechTag>
                  ))}
                </TechStack>
              </GuideSection>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </Container>
  );
};

const getDifficultyColor = (difficulty) => {
  const colors = {
    'Beginner': '#00ff00',
    'Intermediate': '#ffa500',
    'Advanced': '#ff0066'
  };
  return colors[difficulty] || '#00ffff';
};

export default ProjectTemplates;
