
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
