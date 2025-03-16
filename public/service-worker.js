// Service Worker for Repair Auto Pilot

const CACHE_NAME = 'repair-auto-pilot-v2';
const DYNAMIC_CACHE = 'dynamic-cache-v1';
const KNOWLEDGE_CACHE = 'knowledge-cache-v1';
const COMMUNITY_CACHE = 'community-cache-v1';

// Assets that should be cached immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/lovable-uploads/5e12430c-6872-485e-b07a-02b835f8e3d4.png',
  '/lovable-uploads/868fa51f-a29b-4816-a866-c3f9cbdfac9e.png',
  '/offline.html'
];

// URLs that should be cached separately
const API_PATHS = {
  KNOWLEDGE: '/api/knowledge',
  COMMUNITY: '/api/community'
};

// Background sync registration
const SYNC_KNOWLEDGE_TAG = 'sync-knowledge-updates';
const SYNC_WORKFLOW_TAG = 'sync-workflow-updates';
const SYNC_COMMUNITY_TAG = 'sync-community-updates';

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
  const currentCaches = [CACHE_NAME, DYNAMIC_CACHE, KNOWLEDGE_CACHE, COMMUNITY_CACHE];
  
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

// Helper function to determine request type
const getRequestType = (url) => {
  if (url.includes(API_PATHS.KNOWLEDGE)) return 'knowledge';
  if (url.includes(API_PATHS.COMMUNITY)) return 'community';
  return 'other';
};

// Cache then network strategy for API requests
const handleApiRequest = (event, cacheKey) => {
  // Try to get from network and update cache
  const networkResponse = fetch(event.request)
    .then(response => {
      const clonedResponse = response.clone();
      caches.open(cacheKey)
        .then(cache => {
          cache.put(event.request, clonedResponse);
        });
      return response;
    })
    .catch(err => {
      console.log(`[Service Worker] ${cacheKey} fetch failed:`, err);
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
  const requestType = getRequestType(url.pathname);
  
  // Handle API requests with cache-then-network strategy
  if (requestType === 'knowledge') {
    return handleApiRequest(event, KNOWLEDGE_CACHE);
  } else if (requestType === 'community') {
    return handleApiRequest(event, COMMUNITY_CACHE);
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
  } else if (event.tag === SYNC_COMMUNITY_TAG) {
    event.waitUntil(syncCommunityUpdates());
  }
});

// Function to sync knowledge updates when back online
const syncKnowledgeUpdates = async () => {
  try {
    const dbName = 'offlineKnowledgeDb';
    const storeName = 'pendingUpdates';
    
    // Open IndexedDB
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
      request.onerror = reject;
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        }
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
    const successfulUpdates = [];
    
    for (const update of pendingUpdates) {
      try {
        // Create the request options
        const options = {
          method: update.method,
          headers: update.headers,
        };
        
        if (update.body && (update.method === 'POST' || update.method === 'PUT')) {
          options.body = update.body;
        }
        
        // Make the request
        const response = await fetch(update.url, options);
        
        if (response.ok) {
          // Add to successful updates to remove later
          successfulUpdates.push(update.id);
          
          // Broadcast success message to any open clients
          const clients = await self.clients.matchAll({ type: 'window' });
          for (const client of clients) {
            client.postMessage({
              type: 'SYNC_SUCCESS',
              tag: SYNC_KNOWLEDGE_TAG,
              updateId: update.id
            });
          }
        } else {
          // If failed, increment attempts counter
          const updatedRecord = { ...update, attempts: (update.attempts || 0) + 1 };
          store.put(updatedRecord);
          
          console.error(`[Service Worker] Failed to sync update ${update.id}: ${response.status}`);
        }
      } catch (error) {
        console.error('[Service Worker] Error processing update:', error);
      }
    }
    
    // Remove successful updates
    for (const id of successfulUpdates) {
      store.delete(id);
    }
    
    await new Promise((resolve) => {
      tx.oncomplete = resolve;
    });
    
    // Close the database
    db.close();
    
    // Notify clients that sync is complete
    const clients = await self.clients.matchAll({ type: 'window' });
    for (const client of clients) {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        tag: SYNC_KNOWLEDGE_TAG,
        syncedCount: successfulUpdates.length,
        remainingCount: pendingUpdates.length - successfulUpdates.length
      });
    }
    
    console.log('[Service Worker] Knowledge base updates synced successfully');
    
  } catch (error) {
    console.error('[Service Worker] Error syncing knowledge updates:', error);
  }
};

// Function to sync workflow updates when back online
const syncWorkflowUpdates = async () => {
  try {
    const dbName = 'offlineWorkflowDb';
    const storeName = 'pendingUpdates';
    
    // Open IndexedDB
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
      request.onerror = reject;
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        }
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
    const successfulUpdates = [];
    
    for (const update of pendingUpdates) {
      try {
        // Create the request options
        const options = {
          method: update.method,
          headers: update.headers,
        };
        
        if (update.body && (update.method === 'POST' || update.method === 'PUT')) {
          options.body = update.body;
        }
        
        // Make the request
        const response = await fetch(update.url, options);
        
        if (response.ok) {
          // Add to successful updates to remove later
          successfulUpdates.push(update.id);
        } else {
          // If failed, increment attempts counter
          const updatedRecord = { ...update, attempts: (update.attempts || 0) + 1 };
          store.put(updatedRecord);
        }
      } catch (error) {
        console.error('[Service Worker] Failed to sync workflow update:', error);
      }
    }
    
    // Remove successful updates
    for (const id of successfulUpdates) {
      store.delete(id);
    }
    
    await new Promise((resolve) => {
      tx.oncomplete = resolve;
    });
    
    // Close the database
    db.close();
    
    // Notify clients that sync is complete
    const clients = await self.clients.matchAll({ type: 'window' });
    for (const client of clients) {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        tag: SYNC_WORKFLOW_TAG,
        syncedCount: successfulUpdates.length,
        remainingCount: pendingUpdates.length - successfulUpdates.length
      });
    }
    
    console.log('[Service Worker] Workflow updates synced successfully');
    
  } catch (error) {
    console.error('[Service Worker] Error syncing workflow updates:', error);
  }
};

// Function to sync community updates when back online
const syncCommunityUpdates = async () => {
  try {
    const dbName = 'offlineCommunityDb';
    const storeName = 'pendingUpdates';
    
    // Open IndexedDB
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
      request.onerror = reject;
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        }
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
    const successfulUpdates = [];
    
    for (const update of pendingUpdates) {
      try {
        // Create the request options
        const options = {
          method: update.method,
          headers: update.headers,
        };
        
        if (update.body && (update.method === 'POST' || update.method === 'PUT')) {
          options.body = update.body;
        }
        
        // Make the request
        const response = await fetch(update.url, options);
        
        if (response.ok) {
          // Add to successful updates to remove later
          successfulUpdates.push(update.id);
          
          // Broadcast success message to any open clients
          const clients = await self.clients.matchAll({ type: 'window' });
          for (const client of clients) {
            client.postMessage({
              type: 'SYNC_SUCCESS',
              tag: SYNC_COMMUNITY_TAG,
              updateId: update.id
            });
          }
        } else {
          // If failed, increment attempts counter
          const updatedRecord = { ...update, attempts: (update.attempts || 0) + 1 };
          store.put(updatedRecord);
          
          console.error(`[Service Worker] Failed to sync community update ${update.id}: ${response.status}`);
          
          // Notify clients of error
          const clients = await self.clients.matchAll({ type: 'window' });
          for (const client of clients) {
            client.postMessage({
              type: 'SYNC_ERROR',
              tag: SYNC_COMMUNITY_TAG,
              updateId: update.id,
              error: `Status ${response.status}`
            });
          }
        }
      } catch (error) {
        console.error('[Service Worker] Error processing community update:', error);
        
        // Notify clients of error
        const clients = await self.clients.matchAll({ type: 'window' });
        for (const client of clients) {
          client.postMessage({
            type: 'SYNC_ERROR',
            tag: SYNC_COMMUNITY_TAG,
            error: error.message
          });
        }
      }
    }
    
    // Remove successful updates
    for (const id of successfulUpdates) {
      store.delete(id);
    }
    
    await new Promise((resolve) => {
      tx.oncomplete = resolve;
    });
    
    // Close the database
    db.close();
    
    // Notify clients that sync is complete
    const clients = await self.clients.matchAll({ type: 'window' });
    for (const client of clients) {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        tag: SYNC_COMMUNITY_TAG,
        syncedCount: successfulUpdates.length,
        remainingCount: pendingUpdates.length - successfulUpdates.length
      });
    }
    
    console.log('[Service Worker] Community updates synced successfully');
    
  } catch (error) {
    console.error('[Service Worker] Error syncing community updates:', error);
    
    // Notify clients of error
    const clients = await self.clients.matchAll({ type: 'window' });
    for (const client of clients) {
      client.postMessage({
        type: 'SYNC_ERROR',
        tag: SYNC_COMMUNITY_TAG,
        error: error.message
      });
    }
  }
};

// Listen for messages from the client
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Handle manual sync requests
  if (event.data && event.data.type === 'MANUAL_SYNC') {
    if (event.data.tag === SYNC_KNOWLEDGE_TAG) {
      syncKnowledgeUpdates();
    } else if (event.data.tag === SYNC_WORKFLOW_TAG) {
      syncWorkflowUpdates();
    } else if (event.data.tag === SYNC_COMMUNITY_TAG) {
      syncCommunityUpdates();
    }
  }
});
