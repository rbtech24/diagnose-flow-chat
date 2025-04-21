
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
  if (!url) return url;
  
  // Skip cache busting for external URLs
  if (url.startsWith('http') && !url.includes(window.location.hostname)) {
    return url;
  }
  
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

/**
 * Preload critical assets to ensure they're cached
 * @param assetUrls Array of asset URLs to preload
 */
export const preloadCriticalAssets = (assetUrls: string[]) => {
  assetUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    
    // Determine the correct as attribute based on file extension
    if (url.endsWith('.js')) {
      link.as = 'script';
    } else if (url.endsWith('.css')) {
      link.as = 'style';
    } else if (/\.(png|jpg|jpeg|gif|webp|svg)$/.test(url)) {
      link.as = 'image';
    }
    
    link.href = cacheBustUrl(url);
    document.head.appendChild(link);
  });
};

/**
 * Test image loading and log results
 * @param imagePaths Array of image paths to test
 */
export const testImageLoading = (imagePaths: string[]) => {
  return Promise.all(imagePaths.map((path, index) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        console.log(`Image ${index + 1} loaded successfully:`, path);
        resolve(true);
      };
      img.onerror = (error) => {
        console.error(`Image ${index + 1} failed to load:`, path, error);
        reject(error);
      };
      img.src = cacheBustUrl(path);
    });
  }));
};

/**
 * Force reload of image with cache busting
 * @param imgElement Image element to reload
 */
export const reloadImage = (imgElement: HTMLImageElement) => {
  if (!imgElement || !imgElement.src) return;
  
  const originalSrc = imgElement.src.split('?')[0]; // Remove any existing query params
  imgElement.src = cacheBustUrl(originalSrc);
};
