import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { useRef } from 'react';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AdminProvider } from './context/AdminContext';
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
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
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
    <AdminProvider>
      <AppContainer>
        <GlobalStyles />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <>
                <Navbar
                  scrollToSection={scrollToSection}
                  aboutRef={aboutRef}
                  projectsRef={projectsRef}
                  contactRef={contactRef}
                />
                <Home
                  aboutRef={aboutRef}
                  projectsRef={projectsRef}
                  contactRef={contactRef}
                  scrollToSection={scrollToSection}
                />
              </>
            }
          />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            {/* Add other protected routes here */}
          </Route>
          
          {/* Fallback Route */}
          <Route
            path="*"
            element={
              <>
                <Navbar
                  scrollToSection={scrollToSection}
                  aboutRef={aboutRef}
                  projectsRef={projectsRef}
                  contactRef={contactRef}
                />
                <Home
                  aboutRef={aboutRef}
                  projectsRef={projectsRef}
                  contactRef={contactRef}
                  scrollToSection={scrollToSection}
                />
              </>
            }
          />
        </Routes>
      </AppContainer>
    </AdminProvider>
  );
}

export default App;
