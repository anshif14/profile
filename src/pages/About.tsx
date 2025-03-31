import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const AboutContainer = styled.div`
  min-height: 100vh;
  padding: 100px 5% 50px;
  background: var(--secondary);
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
  margin-bottom: 2rem;
  background: linear-gradient(45deg, var(--accent), var(--accent2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TextContent = styled(motion.div)`
  color: var(--text);
  font-size: 1.1rem;
  line-height: 1.8;
`;

const SkillsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
`;

const SkillCard = styled(motion.div)`
  background: rgba(108, 99, 255, 0.1);
  padding: 1.5rem;
  border-radius: 15px;
  border: 1px solid rgba(108, 99, 255, 0.2);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-5px);
    border-color: var(--accent);
    box-shadow: 0 0 20px rgba(108, 99, 255, 0.2);
  }
`;

const SkillTitle = styled.h3`
  color: var(--accent);
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const SkillList = styled.ul`
  list-style: none;
  padding: 0;
`;

const SkillItem = styled.li`
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  
  &::before {
    content: '•';
    color: var(--accent);
    margin-right: 0.5rem;
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

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { opacity: contentOpacity, y: contentY } = useScrollAnimation(0, 300);
  const { opacity: skillsOpacity, y: skillsY } = useScrollAnimation(200, 500);

  return (
    <AboutContainer>
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
        <Title>About Me</Title>
        <Content>
          <TextContent
            style={{
              opacity: contentOpacity as unknown as number,
              y: contentY as unknown as number,
            }}
          >
            <p>
              I am Muhammad Anshif, a passionate Flutter developer with expertise in creating
              beautiful and functional mobile applications. With a strong foundation in software
              development and a keen eye for design, I specialize in building cross-platform
              applications that provide exceptional user experiences.
            </p>
            <br />
            <p>
              My journey in software development has equipped me with a deep understanding of
              modern development practices and tools. I'm constantly learning and exploring new
              technologies to stay at the forefront of mobile development.
            </p>
          </TextContent>
          
          <SkillsContainer
            style={{
              opacity: skillsOpacity as unknown as number,
              y: skillsY as unknown as number,
            }}
          >
            <SkillCard
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <SkillTitle>Flutter Development</SkillTitle>
              <SkillList>
                <SkillItem>Cross-platform app development</SkillItem>
                <SkillItem>State management (Provider, Bloc)</SkillItem>
                <SkillItem>Custom animations and transitions</SkillItem>
                <SkillItem>Firebase integration</SkillItem>
              </SkillList>
            </SkillCard>

            <SkillCard
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <SkillTitle>Technical Skills</SkillTitle>
              <SkillList>
                <SkillItem>Dart programming</SkillItem>
                <SkillItem>RESTful APIs</SkillItem>
                <SkillItem>Git version control</SkillItem>
                <SkillItem>CI/CD pipelines</SkillItem>
              </SkillList>
            </SkillCard>
          </SkillsContainer>
        </Content>
      </Section>
    </AboutContainer>
  );
};

export default About; 