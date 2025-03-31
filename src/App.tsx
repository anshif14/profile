import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { useRef } from 'react';

import Navbar from './components/Navbar';
import Home from './pages/Home';
// import About from './pages/About';
// import Projects from './pages/Projects';
// import Contact from './pages/Contact';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: var(--primary);
  color: var(--text);
`;

function App() {
  // Create refs for scrolling to sections
  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  // Smooth scroll behavior function
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const yOffset = -70; // Adjusted for navbar height
    const elementPosition = ref.current.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY + yOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  return (
    <AppContainer>
      <GlobalStyles />
      <Navbar 
        scrollToSection={scrollToSection}
        aboutRef={aboutRef}
        projectsRef={projectsRef}
        contactRef={contactRef}
      />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={
            <Home 
              aboutRef={aboutRef}
              projectsRef={projectsRef}
              contactRef={contactRef}
              scrollToSection={scrollToSection}
            />
          } />
          {/* <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} /> */}
          <Route path="*" element={
            <Home 
              aboutRef={aboutRef}
              projectsRef={projectsRef}
              contactRef={contactRef}
              scrollToSection={scrollToSection}
            />
          } />
        </Routes>
      </AnimatePresence>
    </AppContainer>
  );
}

export default App;
