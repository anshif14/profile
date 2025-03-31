import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const Nav = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5%;
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(10px);
  z-index: 1000;
  
  @media (max-width: 768px) {
    height: 70px;
  }
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  text-decoration: none;
  background: linear-gradient(45deg, var(--accent), var(--accent2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  z-index: 1001; /* Keep logo above mobile menu */
`;

const NavLinks = styled.div<{ $isOpen: boolean }>`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100vh;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgba(10, 10, 10, 0.95);
    backdrop-filter: blur(10px);
    transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(100%)')};
    transition: transform 0.3s ease-in-out;
    gap: 2rem;
    z-index: 999;
  }
`;

const NavLink = styled.a<{ $active: boolean }>`
  color: ${props => props.$active ? 'var(--accent)' : 'var(--text)'};
  text-decoration: none;
  font-weight: 500;
  position: relative;
  cursor: pointer;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    padding: 1rem;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: ${props => props.$active ? '100%' : '0'};
    height: 2px;
    background: var(--accent);
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const HamburgerButton = styled(motion.button)`
  display: none;
  background: transparent;
  border: none;
  width: 30px;
  height: 30px;
  cursor: pointer;
  position: relative;
  z-index: 1001; /* Ensure button stays above the menu */
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
`;

const HamburgerLine = styled(motion.span)<{ $isOpen?: boolean, $position?: string }>`
  width: 30px;
  height: 3px;
  background: ${props => props.$isOpen ? 'var(--accent)' : 'var(--text)'};
  border-radius: 5px;
  transform-origin: center;
  transition: transform 0.3s ease, opacity 0.3s ease;
  
  ${props => props.$isOpen && props.$position === 'top' && `
    transform: rotate(45deg) translate(5px, 5px);
  `}
  
  ${props => props.$isOpen && props.$position === 'middle' && `
    opacity: 0;
  `}
  
  ${props => props.$isOpen && props.$position === 'bottom' && `
    transform: rotate(-45deg) translate(6px, -6px);
  `}
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 998;
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

interface NavbarProps {
  scrollToSection?: (ref: React.RefObject<HTMLDivElement | null>) => void;
  aboutRef?: React.RefObject<HTMLDivElement | null>;
  projectsRef?: React.RefObject<HTMLDivElement | null>;
  contactRef?: React.RefObject<HTMLDivElement | null>;
}

const Navbar: React.FC<NavbarProps> = ({ scrollToSection, aboutRef, projectsRef, contactRef }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Determine active section based on scroll position
      const scrollPosition = window.scrollY;
      
      if (aboutRef?.current && projectsRef?.current && contactRef?.current) {
        const aboutOffset = aboutRef.current.offsetTop - 100;
        const projectsOffset = projectsRef.current.offsetTop - 100;
        const contactOffset = contactRef.current.offsetTop - 100;
        
        if (scrollPosition < aboutOffset) {
          setActiveSection('home');
        } else if (scrollPosition < projectsOffset) {
          setActiveSection('about');
        } else if (scrollPosition < contactOffset) {
          setActiveSection('projects');
        } else {
          setActiveSection('contact');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [aboutRef, projectsRef, contactRef]);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);
  
  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavClick = (_: string, ref?: React.RefObject<HTMLDivElement | null>) => {
    if (scrollToSection && ref) {
      scrollToSection(ref);
    }
    setIsOpen(false);
  };

  return (
    <Nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ 
        background: scrolled ? 'rgba(10, 10, 10, 0.9)' : 'rgba(10, 10, 10, 0.8)',
        boxShadow: scrolled ? '0 5px 20px rgba(0, 0, 0, 0.1)' : 'none',
      }}
    >
      <Logo to="/">MA</Logo>
      
      <HamburgerButton onClick={toggleMenu} aria-label="Menu">
        <HamburgerLine $isOpen={isOpen} $position="top" />
        <HamburgerLine $isOpen={isOpen} $position="middle" />
        <HamburgerLine $isOpen={isOpen} $position="bottom" />
      </HamburgerButton>
      
      <AnimatePresence>
        {isOpen && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
      
      <NavLinks $isOpen={isOpen}>
        <NavLink 
          onClick={() => handleNavClick('home')} 
          $active={activeSection === 'home'}
        >
          Home
        </NavLink>
        <NavLink 
          onClick={() => handleNavClick('about', aboutRef)} 
          $active={activeSection === 'about'}
        >
          About
        </NavLink>
        <NavLink 
          onClick={() => handleNavClick('projects', projectsRef)} 
          $active={activeSection === 'projects'}
        >
          Projects
        </NavLink>
        <NavLink 
          onClick={() => handleNavClick('contact', contactRef)} 
          $active={activeSection === 'contact'}
        >
          Contact
        </NavLink>
      </NavLinks>
    </Nav>
  );
};

export default Navbar; 