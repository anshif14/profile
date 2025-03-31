import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';

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
  return (
    <AppContainer>
      <GlobalStyles />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} /> */}
          <Route path="*" element={<Home />} />
        </Routes>
      </AnimatePresence>
    </AppContainer>
  );
}

export default App;
