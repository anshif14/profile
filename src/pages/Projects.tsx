import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ProjectsContainer = styled.div`
  min-height: 100vh;
  padding: 100px 5% 50px;
  background: var(--primary);
  position: relative;
  overflow: hidden;
`;

const Section = styled(motion.section)`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Title = styled(motion.h2)`
  font-size: 3rem;
  margin-bottom: 3rem;
  text-align: center;
  background: linear-gradient(45deg, var(--accent), var(--accent2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

const ProjectCard = styled(motion.div)`
  background: var(--secondary);
  border-radius: 15px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  backdrop-filter: blur(10px);
  
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
    z-index: 1;
  }
  
  &:hover::before {
    opacity: 0.1;
  }
`;

const ProjectImage = styled(motion.div)`
  width: 100%;
  height: 200px;
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

const ProjectContent = styled(motion.div)`
  padding: 1.5rem;
  position: relative;
  z-index: 2;
`;

const ProjectTitle = styled.h3`
  color: var(--text);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const ProjectDescription = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const TechTag = styled(motion.span)`
  background: rgba(108, 99, 255, 0.1);
  color: var(--accent);
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(108, 99, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const BackgroundShape = styled(motion.div)`
  position: absolute;
  width: 300px;
  height: 300px;
  background: linear-gradient(45deg, var(--accent), var(--accent2));
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.1;
  z-index: 0;
`;

const projects = [
  {
    title: "E-Commerce App",
    description: "A full-featured e-commerce application built with Flutter, featuring real-time inventory management and secure payment processing.",
    tech: ["Flutter", "Firebase", "Stripe", "Provider"],
    image: "https://via.placeholder.com/400x200"
  },
  {
    title: "Social Media Platform",
    description: "A social media platform with real-time messaging, story sharing, and user interactions.",
    tech: ["Flutter", "Firebase", "WebRTC", "Bloc"],
    image: "https://via.placeholder.com/400x200"
  },
  {
    title: "Fitness Tracking App",
    description: "A comprehensive fitness tracking application with workout planning and progress monitoring.",
    tech: ["Flutter", "SQLite", "Charts", "GetX"],
    image: "https://via.placeholder.com/400x200"
  }
];

const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { opacity: titleOpacity, y: titleY } = useScrollAnimation(0, 200);
  const { opacity: gridOpacity, y: gridY } = useScrollAnimation(200, 500);

  return (
    <ProjectsContainer>
      <BackgroundShape
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
      <BackgroundShape
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

      <Section
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <Title style={{ opacity: titleOpacity as unknown as number, y: titleY as unknown as number }}>
          My Projects
        </Title>
        <ProjectsGrid
          style={{
            opacity: gridOpacity as unknown as number,
            y: gridY as unknown as number,
          }}
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ProjectImage>
                <img
                  src={project.image}
                  alt={project.title}
                />
              </ProjectImage>
              <ProjectContent>
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectDescription>{project.description}</ProjectDescription>
                <TechStack>
                  {project.tech.map((tech, techIndex) => (
                    <TechTag
                      key={techIndex}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {tech}
                    </TechTag>
                  ))}
                </TechStack>
              </ProjectContent>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      </Section>
    </ProjectsContainer>
  );
};

export default Projects; 