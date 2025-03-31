import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const HomeContainer = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: radial-gradient(circle at center, var(--primary) 0%, #0a0a0a 100%);
`;

const Section = styled(motion.section)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 100px 5%;
  overflow: hidden;
`;

const HeroSection = styled(Section)`
  padding-top: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(108,99,255,0.1) 100%);
`;

const Content = styled(motion.div)`
  text-align: center;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`;

const Title = styled(motion.h1)`
  font-size: 5rem;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, var(--accent), var(--accent2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(108,99,255,0.3);
  letter-spacing: -1px;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.8rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButton = styled(motion.button)`
  padding: 1.2rem 3rem;
  font-size: 1.2rem;
  background: transparent;
  border: 2px solid var(--accent);
  color: var(--accent);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, var(--accent), var(--accent2));
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }
  
  &:hover {
    color: var(--primary);
    border-color: transparent;
    box-shadow: 0 0 30px rgba(108,99,255,0.3);
    
    &::before {
      opacity: 1;
    }
  }
`;

const BackgroundCanvas = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.8;
`;

const ScrollButton = styled(motion.button)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: transparent;
  border: none;
  color: var(--accent);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  transition: all 0.3s ease;

  &:hover {
    color: var(--accent2);
  }
`;

const ScrollText = styled.span`
  font-size: 1rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const ScrollLine = styled(motion.div)`
  width: 2px;
  height: 60px;
  background: linear-gradient(to bottom, var(--accent), var(--accent2));
  border-radius: 2px;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 3.5rem;
  margin-bottom: 3rem;
  text-align: center;
  background: linear-gradient(45deg, var(--accent), var(--accent2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(108,99,255,0.3);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
  }
`;

const SkillsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const SkillCard = styled(motion.div)`
  background: rgba(108,99,255,0.05);
  padding: 2.5rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(108,99,255,0.1);
  transition: all 0.3s ease;
  
  h3 {
    color: var(--accent);
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--text-secondary);
    font-size: 1.1rem;
    line-height: 1.6;
  }
  
  &:hover {
    border-color: var(--accent);
    box-shadow: 0 0 30px rgba(108,99,255,0.1);
    transform: translateY(-5px);
  }
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  margin-top: 2rem;
`;

const ProjectCard = styled(motion.div)`
  background: rgba(108,99,255,0.05);
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(108,99,255,0.1);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--accent);
    box-shadow: 0 0 30px rgba(108,99,255,0.1);
    transform: translateY(-5px);
  }
`;

const ProjectImage = styled.div`
  width: 100%;
  height: 250px;
  background: #2a2a2a;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.8));
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  &:hover img {
    transform: scale(1.1);
  }
`;

const ProjectContent = styled.div`
  padding: 2rem;
`;

const ProjectTitle = styled.h3`
  color: var(--text);
  font-size: 1.8rem;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, var(--accent), var(--accent2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ProjectDescription = styled.p`
  color: var(--text-secondary);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`;

const TechTag = styled.span`
  background: rgba(108,99,255,0.1);
  color: var(--accent);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(108,99,255,0.2);
    transform: translateY(-2px);
  }
`;

const FloatingShape = styled(motion.div)`
  position: absolute;
  width: 300px;
  height: 300px;
  background: linear-gradient(45deg, var(--accent), var(--accent2));
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.1;
  z-index: 0;
`;

const Home = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const isAboutInView = useInView(aboutRef, { once: true, margin: "-100px" });
  const isProjectsInView = useInView(projectsRef, { once: true, margin: "-100px" });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const { opacity: buttonOpacity, y: buttonY } = useScrollAnimation(0, 300);

  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  const projects = [
    {
      title: "E-Commerce App",
      description: "A full-featured e-commerce application built with Flutter, featuring real-time inventory management and secure payment processing.",
      tech: ["Flutter", "Firebase", "Stripe", "Provider"],
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2088&q=80"
    },
    {
      title: "Social Media Platform",
      description: "A social media platform with real-time messaging, story sharing, and user interactions.",
      tech: ["Flutter", "Firebase", "WebRTC", "Bloc"],
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2087&q=80"
    },
    {
      title: "Fitness Tracking App",
      description: "A comprehensive fitness tracking application with workout planning and progress monitoring.",
      tech: ["Flutter", "SQLite", "Charts", "GetX"],
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    }
  ];

  return (
    <HomeContainer ref={containerRef}>
      <BackgroundCanvas>
        <Canvas>
          <OrbitControls enableZoom={false} enablePan={false} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </Canvas>
      </BackgroundCanvas>
      
      <FloatingShape
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          top: '10%',
          left: '10%',
        }}
      />
      
      <FloatingShape
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          bottom: '10%',
          right: '10%',
        }}
      />
      
      <HeroSection>
        <Content
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ y: contentY, opacity: contentOpacity }}
        >
          <Title>Muhammad Anshif</Title>
          <Subtitle>Flutter Developer & Software Engineer</Subtitle>
          <CTAButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToNextSection}
          >
            Explore My Work
          </CTAButton>
        </Content>

        <ScrollButton
          onClick={scrollToNextSection}
          style={{ opacity: buttonOpacity, y: buttonY }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ScrollText>Scroll to explore</ScrollText>
          <ScrollLine
            animate={{
              scaleY: [1, 0.5, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </ScrollButton>
      </HeroSection>

      <Section ref={aboutRef}>
        <Content
          initial={{ opacity: 0, y: 50 }}
          animate={isAboutInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SectionTitle>About Me</SectionTitle>
          <Subtitle>
            I'm a passionate Flutter developer with expertise in creating beautiful and functional mobile applications.
            With a strong foundation in software engineering principles, I focus on delivering high-quality,
            scalable solutions that provide exceptional user experiences.
          </Subtitle>
          <SkillsGrid>
            <SkillCard 
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              animate={isAboutInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3>Mobile Development</h3>
              <p>Flutter, Dart, iOS, Android</p>
            </SkillCard>
            <SkillCard 
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              animate={isAboutInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3>Backend Development</h3>
              <p>Node.js, Firebase, REST APIs</p>
            </SkillCard>
            <SkillCard 
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              animate={isAboutInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <h3>UI/UX Design</h3>
              <p>Figma, Adobe XD, Material Design</p>
            </SkillCard>
          </SkillsGrid>
        </Content>
      </Section>

      <Section ref={projectsRef}>
        <Content
          initial={{ opacity: 0, y: 50 }}
          animate={isProjectsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SectionTitle>My Projects</SectionTitle>
          <ProjectsGrid>
            {projects.map((project, index) => (
              <ProjectCard 
                key={index}
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 20 }}
                animate={isProjectsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.2 }}
              >
                <ProjectImage>
                  <img src={project.image} alt={project.title} />
                </ProjectImage>
                <ProjectContent>
                  <ProjectTitle>{project.title}</ProjectTitle>
                  <ProjectDescription>{project.description}</ProjectDescription>
                  <TechStack>
                    {project.tech.map((tech, techIndex) => (
                      <TechTag key={techIndex}>{tech}</TechTag>
                    ))}
                  </TechStack>
                </ProjectContent>
              </ProjectCard>
            ))}
          </ProjectsGrid>
        </Content>
      </Section>
    </HomeContainer>
  );
};

export default Home; 