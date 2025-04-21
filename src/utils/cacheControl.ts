
/**
 * Utility to control browser caching behavior
 */

/**
 * Force a refresh of the current page bypassing the cache
 */
export const forcePageRefresh = () => {
  // Clear any session storage cache
  sessionStorage.clear();
  
  // Force reload bypassing cache
  window.location.reload();
};

/**
 * Add cache control meta tags to the document head
 */
export const addCacheControlMetaTags = () => {
  const metaTags = [
    { httpEquiv: 'Cache-Control', content: 'no-cache, no-store, must-revalidate' },
    { httpEquiv: 'Pragma', content: 'no-cache' },
    { httpEquiv: 'Expires', content: '0' }
  ];
  
  metaTags.forEach(tag => {
    // Check if tag already exists
    const existingTag = document.querySelector(`meta[http-equiv="${tag.httpEquiv}"]`);
    if (!existingTag) {
      const meta = document.createElement('meta');
      meta.httpEquiv = tag.httpEquiv;
      meta.content = tag.content;
      document.head.appendChild(meta);
    }
  });
};

/**
 * Generate a cache-busting URL by appending a timestamp
 */
export const cacheBustUrl = (url: string) => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
};

/**
 * Clear all application caches
 */
export const clearAllCaches = async () => {
  // Clear localStorage
  localStorage.clear();
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Clear application cache via service worker
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CLEAR_CACHES'
    });
  }
  
  // Use the Cache API directly if available
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('All caches cleared successfully');
    } catch (error) {
      console.error('Error clearing caches:', error);
    }
  }
  
  console.log('Cache clearing complete');
  return true;
};

/**
 * Register event listener for service worker messages
 */
export const registerCacheEventListeners = () => {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CACHES_CLEARED') {
      console.log('All caches have been cleared by service worker');
    }
  });
};

/**
 * Update resources with cache-busting URLs 
 * @param resourceUrls Array of resource URLs to be updated with cache-busting
 */
export const updateResourcesWithCacheBusting = (resourceUrls: string[]) => {
  // For scripts
  const scripts = document.querySelectorAll('script[src]');
  scripts.forEach(script => {
    const src = script.getAttribute('src');
    if (src && resourceUrls.some(url => src.includes(url))) {
      script.setAttribute('src', cacheBustUrl(src));
    }
  });
  
  // For stylesheets
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && resourceUrls.some(url => href.includes(url))) {
      link.setAttribute('href', cacheBustUrl(href));
    }
  });
  
  // For images
  const images = document.querySelectorAll('img[src]');
  images.forEach(img => {
    const src = img.getAttribute('src');
    if (src && resourceUrls.some(url => src.includes(url))) {
      img.setAttribute('src', cacheBustUrl(src));
    }
  });
};
