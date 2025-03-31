import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --primary: #0a0a0a;
    --secondary: #151515;
    --accent: #6c63ff;
    --accent2: #ff6584;
    --text: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.7);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: var(--primary);
    color: var(--text);
    line-height: 1.6;
    font-size: 16px;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: var(--primary);
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  a {
    color: var(--accent);
    text-decoration: none;
    transition: all 0.3s ease;
    
    &:hover {
      color: var(--accent2);
    }
  }

  .gradient-text {
    background: linear-gradient(45deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .neon-border {
    box-shadow: 0 0 10px var(--accent),
                0 0 20px var(--accent),
                0 0 30px var(--accent);
  }
`; 