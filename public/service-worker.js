
// Service Worker for Repair Auto Pilot

const CACHE_NAME = 'repair-auto-pilot-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/lovable-uploads/894f58ab-c3aa-45ba-9ea3-e3a2d9ddf247.png',
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
