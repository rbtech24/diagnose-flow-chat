
/**
 * Utility functions for cache control
 */

// Add cache busting parameter to URL to prevent caching
export const cacheBustUrl = (url: string): string => {
  if (!url) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${Date.now()}`;
};

// Add cache control meta tags to document head
export const addCacheControlMetaTags = (): void => {
  // Add cache control meta tags if they don't exist
  if (!document.querySelector('meta[http-equiv="Cache-Control"]')) {
    const cacheControlMeta = document.createElement('meta');
    cacheControlMeta.setAttribute('http-equiv', 'Cache-Control');
    cacheControlMeta.setAttribute('content', 'no-cache, no-store, must-revalidate');
    document.head.appendChild(cacheControlMeta);
  }
  
  if (!document.querySelector('meta[http-equiv="Pragma"]')) {
    const pragmaMeta = document.createElement('meta');
    pragmaMeta.setAttribute('http-equiv', 'Pragma');
    pragmaMeta.setAttribute('content', 'no-cache');
    document.head.appendChild(pragmaMeta);
  }
  
  if (!document.querySelector('meta[http-equiv="Expires"]')) {
    const expiresMeta = document.createElement('meta');
    expiresMeta.setAttribute('http-equiv', 'Expires');
    expiresMeta.setAttribute('content', '0');
    document.head.appendChild(expiresMeta);
  }
};

// Register cache event listeners for service workers
export const registerCacheEventListeners = (): void => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'CACHE_UPDATED') {
        console.log('Cache updated:', event.data.url);
      }
    });
  }
};

// Clear all browser caches - useful for troubleshooting
export const clearAllCaches = async (): Promise<void> => {
  if ('caches' in window) {
    try {
      const cacheNames = await window.caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => window.caches.delete(cacheName))
      );
      console.log('All caches cleared successfully');
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to clear caches:', error);
      return Promise.reject(error);
    }
  } else {
    console.warn('Cache API not supported in this browser');
    return Promise.resolve();
  }
};
