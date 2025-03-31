import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --primary: #0a0a0a;
    --secondary: #1a1a1a;
    --accent: #6c63ff;
    --accent2: #ff6b6b;
    --text: #ffffff;
    --text-secondary: #b3b3b3;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: var(--primary);
    color: var(--text);
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--secondary);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--accent);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--accent2);
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