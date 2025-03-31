import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { db } from '../firebaseconfig';
import { doc, getDoc } from 'firebase/firestore';

// Styled components with enhanced visuals and mobile optimization
const HomeContainer = styled.div`
  position: relative;
  background: linear-gradient(to bottom, #0a0a0a, #151515);
  overflow-x: hidden;
`;

const Section = styled(motion.section)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  padding: 80px 5%;
  overflow: hidden;
  will-change: transform;
  
  @media (max-width: 768px) {
    padding: 60px 5%;
    justify-content: flex-start;
    padding-top: 100px;
  }
`;

const HeroSection = styled(Section)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  min-height: 100vh;
  
  @media (max-width: 480px) {
    padding-top: 120px;
    justify-content: flex-start;
  }
`;

const Content = styled(motion.div)`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  z-index: 2;
  position: relative;
`;

const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 8vw, 5rem);
  margin-bottom: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #6c63ff, #ff6584);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const SubTitle = styled(motion.p)`
  font-size: clamp(1rem, 3vw, 1.6rem);
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2.5rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    margin-bottom: 2rem;
    font-size: 1.1rem;
  }
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 280px;
    margin: 0 auto;
  }
`;

const Button = styled(motion.button)`
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  background: transparent;
  border: 2px solid #6c63ff;
  color: #6c63ff;
  border-radius: 50px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  z-index: 1;
  
  @media (max-width: 480px) {
    width: 100%;
    padding: 0.9rem 1.5rem;
    font-size: 1rem;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #6c63ff, #ff6584);
    z-index: -1;
    transform: scaleX(0);
    transform-origin: 0 50%;
    transition: transform 0.5s ease;
  }
  
  &:hover::before {
    transform: scaleX(1);
  }
  
  &:hover {
    color: #fff;
    border-color: transparent;
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  
  &::before {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &:hover {
    color: #fff;
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const ScrollDown = styled(motion.div)`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
  
  @media (max-width: 768px) {
    bottom: 20px;
  }
  
  svg {
    width: 30px;
    height: 30px;
    margin-top: 8px;
  }
`;

const BackgroundCanvas = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(2rem, 5vw, 3rem);
  text-align: center;
  margin-bottom: 2.5rem;
  background: linear-gradient(135deg, #6c63ff, #ff6584);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  
  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(to right, #6c63ff, #ff6584);
    border-radius: 2px;
    
    @media (max-width: 768px) {
      width: 60px;
      height: 3px;
      bottom: -10px;
    }
  }
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2.5rem;
  margin-top: 4rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    margin-top: 2.5rem;
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    margin-top: 2rem;
    gap: 1.2rem;
  }
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 100%;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  /* Remove hover animations on mobile for better performance */
  @media (min-width: 769px) {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 10px 30px rgba(108, 99, 255, 0.2);
    }
  }
`;

const CardTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: #fff;
  background: linear-gradient(135deg, #6c63ff, #ff6584);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 0.8rem;
  }
`;

const CardContent = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const ProjectCard = styled(motion.div)`
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  /* Remove hover animations on mobile for better performance */
  @media (min-width: 769px) {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 10px 30px rgba(108, 99, 255, 0.2);
    }
  }
`;

const ProjectImage = styled.div`
  height: 200px;
  overflow: hidden;
  position: relative;
  
  @media (max-width: 768px) {
    height: 180px;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    
    /* Remove hover animations on mobile for better performance */
    @media (min-width: 769px) {
      transition: transform 0.5s ease;
      
      &:hover {
        transform: scale(1.1);
      }
    }
  }
`;

const ProjectContent = styled.div`
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

const ProjectTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  color: #fff;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const ProjectDescription = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
    margin-bottom: 0.8rem;
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.span`
  background: rgba(108, 99, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.8rem;
  color: #6c63ff;
  
  @media (max-width: 768px) {
    padding: 0.2rem 0.6rem;
    font-size: 0.75rem;
  }
`;

const ContactForm = styled(motion.form)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    margin-top: 2rem;
    gap: 1.2rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    gap: 0.4rem;
  }
`;

const Label = styled.label`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const Input = styled.input`
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 1rem;
  
  @media (max-width: 768px) {
    padding: 0.8rem;
    font-size: 0.95rem;
  }
  
  &:focus {
    outline: none;
    border-color: #6c63ff;
  }
`;

const TextArea = styled.textarea`
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  
  @media (max-width: 768px) {
    padding: 0.8rem;
    font-size: 0.95rem;
    min-height: 120px;
  }
  
  &:focus {
    outline: none;
    border-color: #6c63ff;
  }
`;

const FloatingShape = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, #6c63ff, #ff6584);
  filter: blur(80px);
  opacity: 0.1;
  z-index: 0;
  
  @media (max-width: 768px) {
    filter: blur(60px);
    opacity: 0.08;
  }
`;

// Main component
interface HomeProps {
  aboutRef: React.RefObject<HTMLDivElement | null>;
  projectsRef: React.RefObject<HTMLDivElement | null>;
  contactRef: React.RefObject<HTMLDivElement | null>;
  scrollToSection: (ref: React.RefObject<HTMLDivElement | null>) => void;
}

const Home: React.FC<HomeProps> = ({ aboutRef, projectsRef, contactRef, scrollToSection }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  
  // Check for mobile device on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Fetch resume URL from Firestore
  useEffect(() => {
    const fetchResumeUrl = async () => {
      try {
        const assetDocRef = doc(db, "assets", "assets");
        const assetDoc = await getDoc(assetDocRef);
        
        if (assetDoc.exists()) {
          const data = assetDoc.data();
          if (data.resume) {
            setResumeUrl(data.resume);
          }
        }
      } catch (error) {
        console.error("Error fetching resume URL:", error);
      }
    };
    
    fetchResumeUrl();
  }, []);
  
  // Animation controls for each section
  const aboutControls = useAnimation();
  const servicesControls = useAnimation();
  const projectsControls = useAnimation();
  const contactControls = useAnimation();

  // For section animations - use a lower threshold for better performance
  const aboutInView = useInView(aboutRef, { once: true, amount: 0.1 });
  const servicesInView = useInView(aboutRef, { once: true, amount: 0.1 }); // Using aboutRef for services
  const projectsInView = useInView(projectsRef, { once: true, amount: 0.1 });
  const contactInView = useInView(contactRef, { once: true, amount: 0.1 });

  // Optimize the trigger for animations
  useEffect(() => {
    if (aboutInView) aboutControls.start('visible');
    if (servicesInView) servicesControls.start('visible');
    if (projectsInView) projectsControls.start('visible');
    if (contactInView) contactControls.start('visible');
  }, [aboutInView, servicesInView, projectsInView, contactInView, aboutControls, servicesControls, projectsControls, contactControls]);

  // Optimized animation variants with shorter duration - even faster for mobile
  const sectionVariants = {
    hidden: { opacity: 0, y: isMobile ? 20 : 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: isMobile ? 0.4 : 0.6,
        staggerChildren: isMobile ? 0.08 : 0.1,
        delayChildren: isMobile ? 0.1 : 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: isMobile ? 10 : 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: isMobile ? 0.3 : 0.4 }
    }
  };

  // Service items
  const services = [
    {
      title: "Mobile App Development",
      description: "Building beautiful, high-performance mobile applications using Flutter for both Android and iOS platforms."
    },
    {
      title: "UI/UX Design",
      description: "Creating intuitive and engaging user interfaces with a focus on user experience and modern design principles."
    },
    {
      title: "Backend Integration",
      description: "Seamlessly integrating applications with backend services, APIs, and databases for complete solutions."
    },
    {
      title: "Maintenance & Support",
      description: "Providing ongoing support, updates, and maintenance to ensure your application stays current and functional."
    }
  ];

  // Project items
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "A comprehensive e-commerce solution with product management, cart functionality, and secure payment processing.",
      tags: ["Flutter", "Firebase", "Stripe"],
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      title: "Social Media App",
      description: "A feature-rich social platform with real-time messaging, story sharing, and robust user interactions.",
      tags: ["Flutter", "Firebase", "WebRTC"],
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      title: "Fitness Tracker",
      description: "A health-focused application with workout planning, progress monitoring, and nutritional guidance.",
      tags: ["Flutter", "SQLite", "Charts"],
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  return (
    <HomeContainer>
      {/* Background stars - optimized render with even lower particle count for mobile */}
      <BackgroundCanvas>
        <Canvas 
          frameloop="demand" 
          dpr={isMobile ? [0.5, 1] : [1, 1.5]} // Lower resolution on mobile
        >
          <Stars 
            radius={200} 
            depth={60} 
            count={isMobile ? 1500 : 2500} 
            factor={4} 
            saturation={0} 
            fade 
            speed={0.5} 
          />
        </Canvas>
      </BackgroundCanvas>
      
      {/* Background shapes - simplified for mobile */}
      {!isMobile && (
        <>
          <FloatingShape 
            style={{ 
              width: '300px', 
              height: '300px', 
              left: '10%', 
              top: '20%' 
            }}
            animate={{
              x: [0, 15, 0],
              y: [0, 10, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          <FloatingShape 
            style={{ 
              width: '250px', 
              height: '250px', 
              right: '10%', 
              top: '40%' 
            }}
            animate={{
              x: [0, -15, 0],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </>
      )}
      
      {/* Hero section */}
      <HeroSection>
        <Content>
          <Title
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Muhammad Anshif
          </Title>
          
          <SubTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Flutter Developer & Software Engineer creating beautiful, high-performance mobile applications.
          </SubTitle>
          
          <ButtonGroup
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              whileHover={!isMobile ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection(projectsRef)}
            >
              View Projects
            </Button>
            
            <SecondaryButton
              whileHover={!isMobile ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection(contactRef)}
            >
              Contact Me
            </SecondaryButton>
            
            {resumeUrl && (
              <Button
                as="a"
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={!isMobile ? { scale: 1.05 } : {}}
                whileTap={{ scale: 0.95 }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  style={{ width: '18px', height: '18px', marginRight: '8px' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4m-4 10v-6" />
                </svg>
                Resume
              </Button>
            )}
          </ButtonGroup>
        </Content>
        
        <ScrollDown
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          onClick={() => scrollToSection(aboutRef)}
          whileHover={!isMobile ? { y: 5 } : {}}
        >
          Scroll Down
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </ScrollDown>
      </HeroSection>
      
      {/* About section */}
      <Section
        ref={aboutRef}
        variants={sectionVariants}
        initial="hidden"
        animate={aboutControls}
      >
        <Content>
          <SectionTitle variants={itemVariants}>
            About Me
          </SectionTitle>
          
          <SubTitle
            variants={itemVariants}
            style={{ textAlign: 'center' }}
          >
            I'm a passionate Flutter developer with 5+ years of experience creating beautiful, 
            high-performance mobile applications.
          </SubTitle>
          
          <Grid variants={itemVariants}>
            <Card
              whileHover={!isMobile ? { y: -10 } : {}}
              transition={!isMobile ? { type: 'spring', stiffness: 300 } : {}}
            >
              <CardTitle>Background</CardTitle>
              <CardContent>
                With a solid foundation in Computer Science and a passion for mobile development,
                I've honed my skills in building applications that are both technically sound
                and visually stunning.
              </CardContent>
            </Card>
            
            <Card
              whileHover={!isMobile ? { y: -10 } : {}}
              transition={!isMobile ? { type: 'spring', stiffness: 300 } : {}}
            >
              <CardTitle>Expertise</CardTitle>
              <CardContent>
                I specialize in Flutter development, creating cross-platform applications
                with native performance. My projects range from e-commerce solutions to
                social media platforms and health apps.
              </CardContent>
            </Card>
            
            <Card
              whileHover={!isMobile ? { y: -10 } : {}}
              transition={!isMobile ? { type: 'spring', stiffness: 300 } : {}}
            >
              <CardTitle>Approach</CardTitle>
              <CardContent>
                I believe in user-centered design and development process. I start with
                understanding user needs and business goals, then translate them into
                elegant, functional applications.
              </CardContent>
            </Card>
          </Grid>
          
          {resumeUrl && (
            <motion.div 
              style={{ textAlign: 'center', marginTop: '2rem' }}
              variants={itemVariants}
            >
              <Button
                as="a"
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  style={{ width: '18px', height: '18px', marginRight: '8px' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4m-4 10v-6" />
                </svg>
                Download My Resume
              </Button>
            </motion.div>
          )}
        </Content>
      </Section>
      
      {/* Services section */}
      <Section
        ref={aboutRef}
        variants={sectionVariants}
        initial="hidden"
        animate={servicesControls}
      >
        <Content>
          <SectionTitle variants={itemVariants}>
            Services
          </SectionTitle>
          
          <Grid variants={itemVariants}>
            {services.map((service, index) => (
              <Card
                key={index}
                whileHover={!isMobile ? { y: -10 } : {}}
                transition={!isMobile ? { type: 'spring', stiffness: 300 } : {}}
              >
                <CardTitle>{service.title}</CardTitle>
                <CardContent>
                  {service.description}
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Content>
      </Section>
      
      {/* Projects section */}
      <Section
        ref={projectsRef}
        variants={sectionVariants}
        initial="hidden"
        animate={projectsControls}
      >
        <Content>
          <SectionTitle variants={itemVariants}>
            Projects
          </SectionTitle>
          
          <Grid variants={itemVariants}>
            {projects.map((project, index) => (
              <ProjectCard
                key={index}
                whileHover={!isMobile ? { y: -10 } : {}}
                transition={!isMobile ? { type: 'spring', stiffness: 300 } : {}}
              >
                <ProjectImage>
                  <img 
                    src={project.image} 
                    alt={project.title}
                    loading="lazy" // Add lazy loading for images
                  />
                </ProjectImage>
                <ProjectContent>
                  <ProjectTitle>{project.title}</ProjectTitle>
                  <ProjectDescription>
                    {project.description}
                  </ProjectDescription>
                  <TagContainer>
                    {project.tags.map((tag, tagIndex) => (
                      <Tag key={tagIndex}>{tag}</Tag>
                    ))}
                  </TagContainer>
                </ProjectContent>
              </ProjectCard>
            ))}
          </Grid>
        </Content>
      </Section>
      
      {/* Contact section */}
      <Section
        ref={contactRef}
        variants={sectionVariants}
        initial="hidden"
        animate={contactControls}
      >
        <Content>
          <SectionTitle variants={itemVariants}>
            Contact Me
          </SectionTitle>
          
          <SubTitle
            variants={itemVariants}
            style={{ textAlign: 'center' }}
          >
            Have a project in mind? Feel free to reach out and I'll get back to you as soon as possible.
          </SubTitle>
          
          <ContactForm
            variants={itemVariants}
            onSubmit={(e) => e.preventDefault()}
          >
            <FormGroup>
              <Label>Name</Label>
              <Input type="text" placeholder="Your Name" />
            </FormGroup>
            
            <FormGroup>
              <Label>Email</Label>
              <Input type="email" placeholder="Your Email" />
            </FormGroup>
            
            <FormGroup>
              <Label>Message</Label>
              <TextArea placeholder="Your Message" />
            </FormGroup>
            
            <Button
              type="submit"
              whileHover={!isMobile ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.95 }}
            >
              Send Message
            </Button>
          </ContactForm>
        </Content>
      </Section>
    </HomeContainer>
  );
};

export default Home; 