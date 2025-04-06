// Minimal placeholder service worker

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

// You can add fetch event listeners and caching logic here later
