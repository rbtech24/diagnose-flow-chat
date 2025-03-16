// Service Worker for Repair Auto Pilot

const CACHE_NAME = 'repair-auto-pilot-v2';
const DYNAMIC_CACHE = 'dynamic-cache-v1';
const KNOWLEDGE_CACHE = 'knowledge-cache-v1';

// Assets that should be cached immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/lovable-uploads/5e12430c-6872-485e-b07a-02b835f8e3d4.png',
  '/lovable-uploads/868fa51f-a29b-4816-a866-c3f9cbdfac9e.png'
];

// URLs that should be cached separately for knowledge base data
const KNOWLEDGE_URLS = [
  '/api/knowledge'
];

// Background sync registration
const SYNC_KNOWLEDGE_TAG = 'sync-knowledge-updates';
const SYNC_WORKFLOW_TAG = 'sync-workflow-updates';

// Install event - cache core assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Pre-caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Successfully installed');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating Service Worker...');
  const currentCaches = [CACHE_NAME, DYNAMIC_CACHE, KNOWLEDGE_CACHE];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!currentCaches.includes(cacheName)) {
            console.log('[Service Worker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('[Service Worker] Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Helper function to determine if a request is for an API
const isApiRequest = (url) => {
  return url.includes('/api/');
};

// Helper function to determine if a request is for knowledge data
const isKnowledgeRequest = (url) => {
  return url.includes('/api/knowledge');
};

// Cache then network strategy for knowledge requests
const handleKnowledgeRequest = (event) => {
  // Try to get from network and update cache
  const networkResponse = fetch(event.request)
    .then(response => {
      const clonedResponse = response.clone();
      caches.open(KNOWLEDGE_CACHE)
        .then(cache => {
          cache.put(event.request, clonedResponse);
        });
      return response;
    })
    .catch(err => {
      console.log('[Service Worker] Knowledge fetch failed:', err);
    });

  // Return cached response if available, otherwise wait for network
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        return cachedResponse || networkResponse;
      })
  );
};

// Fetch event - implement different strategies based on request type
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Handle knowledge API requests with cache-then-network strategy
  if (isKnowledgeRequest(url.pathname)) {
    return handleKnowledgeRequest(event);
  }
  
  // For API requests, use network-first strategy
  if (isApiRequest(url.pathname)) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache successful GET responses in dynamic cache
          if (event.request.method === 'GET') {
            const clonedResponse = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                cache.put(event.request, clonedResponse);
              });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try to return from cache
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // For static assets, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Not in cache, get from network
        return fetch(event.request)
          .then(response => {
            // Cache successful GET responses in dynamic cache
            if (event.request.method === 'GET') {
              const clonedResponse = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then(cache => {
                  cache.put(event.request, clonedResponse);
                });
            }
            return response;
          });
      })
      .catch(error => {
        console.log('[Service Worker] Fetch failed:', error);
        // For navigation requests, return offline page if we have one
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
        
        // Otherwise just return error
        return new Response('Network error', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' }
        });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('[Service Worker] Background Sync event:', event.tag);
  
  if (event.tag === SYNC_KNOWLEDGE_TAG) {
    event.waitUntil(syncKnowledgeUpdates());
  } else if (event.tag === SYNC_WORKFLOW_TAG) {
    event.waitUntil(syncWorkflowUpdates());
  }
});

// Function to sync knowledge updates when back online
const syncKnowledgeUpdates = async () => {
  try {
    const dbName = 'offlineKnowledgeDb';
    const storeName = 'pendingKnowledgeUpdates';
    
    // Open IndexedDB
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
      request.onerror = reject;
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
      };
    });
    
    // Get all pending updates
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const pendingUpdates = await new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onerror = reject;
      request.onsuccess = () => resolve(request.result);
    });
    
    // Process each update
    for (const update of pendingUpdates) {
      try {
        const response = await fetch(update.url, {
          method: update.method,
          headers: update.headers,
          body: update.body
        });
        
        if (response.ok) {
          // Remove from pending updates if successful
          store.delete(update.id);
        }
      } catch (error) {
        console.error('[Service Worker] Failed to sync update:', error);
      }
    }
    
    await new Promise((resolve) => {
      tx.oncomplete = resolve;
    });
    
    console.log('[Service Worker] Knowledge base updates synced successfully');
    
  } catch (error) {
    console.error('[Service Worker] Error syncing knowledge updates:', error);
  }
};

// Function to sync workflow updates when back online
const syncWorkflowUpdates = async () => {
  try {
    const dbName = 'offlineWorkflowDb';
    const storeName = 'pendingWorkflowUpdates';
    
    // Open IndexedDB
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
      request.onerror = reject;
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
      };
    });
    
    // Get all pending updates
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const pendingUpdates = await new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onerror = reject;
      request.onsuccess = () => resolve(request.result);
    });
    
    // Process each update
    for (const update of pendingUpdates) {
      try {
        const response = await fetch(update.url, {
          method: update.method,
          headers: update.headers,
          body: update.body
        });
        
        if (response.ok) {
          // Remove from pending updates if successful
          store.delete(update.id);
        }
      } catch (error) {
        console.error('[Service Worker] Failed to sync workflow update:', error);
      }
    }
    
    await new Promise((resolve) => {
      tx.oncomplete = resolve;
    });
    
    console.log('[Service Worker] Workflow updates synced successfully');
    
  } catch (error) {
    console.error('[Service Worker] Error syncing workflow updates:', error);
  }
};

// Listen for messages from the client
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
