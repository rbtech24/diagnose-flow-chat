
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { addCacheControlMetaTags, registerCacheEventListeners } from './utils/cacheControl';
import { BrowserRouter } from 'react-router-dom';

// For debugging purposes
console.log("Main.tsx is rendering, React version:", React.version);

// Make sure React is properly imported
if (!React) {
  console.error("React is not properly imported in main.tsx");
}

// Make React available globally for debugging
window.React = React;

// Apply cache control meta tags on startup
addCacheControlMetaTags();

// Register service worker cache event listeners if service worker is active
if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
  registerCacheEventListeners();
  
  // Register or update service worker
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });
}

// Create the root with explicit React reference
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Add a declaration for the window.React property
declare global {
  interface Window {
    React: typeof React;
  }
}
