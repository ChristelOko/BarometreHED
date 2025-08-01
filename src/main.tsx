import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AppSettingsProvider } from './context/AppSettingsContext';
import App from './App';
import './index.css';

// Fonction pour masquer le loading screen plus rapidement
const hideLoadingScreen = () => {
  const loadingElement = document.getElementById('loading-screen');
  if (loadingElement) {
    loadingElement.style.opacity = '0';
    setTimeout(() => {
      loadingElement.remove();
    }, 500);
  }
};

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(registration => {
        console.log('SW registered:', registration);
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  });
}

// Masquer le loading screen après 1.5 secondes
setTimeout(hideLoadingScreen, 1000);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppSettingsProvider>
      <LanguageProvider>
        <Router>
          <App />
        </Router>
      </LanguageProvider>
    </AppSettingsProvider>
  </StrictMode>
);