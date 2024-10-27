import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './TaskFlow0.Web/App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);