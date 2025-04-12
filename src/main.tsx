
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Toaster } from "react-hot-toast";
import { ToastProvider } from './components/ui/use-toast';
import { SystemMessageProvider } from './context/SystemMessageContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <SystemMessageProvider>
        <Toaster />
        <App />
      </SystemMessageProvider>
    </ToastProvider>
  </React.StrictMode>,
);

// Only register service worker in production or when not in an iframe
// This prevents service worker conflicts in the editor environment
if ('serviceWorker' in navigator && 
    (process.env.NODE_ENV === 'production' || window.self === window.top)) {
  
  // Define interface for ServiceWorkerRegistration with sync
  interface SyncRegistration extends ServiceWorkerRegistration {
    sync: {
      register(tag: string): Promise<void>;
    }
  }

  // Enhanced service worker registration for better offline support
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
        
        // Check for updates to the service worker
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('Service Worker update found!');
          
          newWorker?.addEventListener('statechange', () => {
            console.log('Service Worker state changed:', newWorker.state);
            
            // When the new service worker is installed but waiting, notify user
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Dispatch an event that the UI can listen for
              const event = new CustomEvent('serviceWorkerUpdateReady');
              window.dispatchEvent(event);
            }
          });
        });
        
        // Handle service worker updates
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (refreshing) return;
          refreshing = true;
          console.log('Controller changed, refreshing page...');
          window.location.reload();
        });
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
      
    // Listen for network status changes
    window.addEventListener('online', () => {
      console.log('Application is online');
      // Attempt to trigger any background sync operations
      navigator.serviceWorker.ready.then(registration => {
        if ('sync' in registration) {
          (registration as SyncRegistration).sync.register('sync-knowledge-updates');
          (registration as SyncRegistration).sync.register('sync-workflow-updates');
        }
      });
    });
    
    window.addEventListener('offline', () => {
      console.log('Application is offline');
    });
  });
}
