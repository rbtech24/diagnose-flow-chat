
// Service Worker for Repair Auto Pilot

const CACHE_NAME = 'repair-auto-pilot-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/lovable-uploads/5e12430c-6872-485e-b07a-02b835f8e3d4.png',
  '/lovable-uploads/868fa51f-a29b-4816-a866-c3f9cbdfac9e.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
