import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { LMS_ACCENT } from './config/theme';
import './index.css';

if (LMS_ACCENT) document.documentElement.style.setProperty('--lms-accent', LMS_ACCENT);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
