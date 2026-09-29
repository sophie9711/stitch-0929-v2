const CACHE_NAME = 'mediterra-android-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './_1/screen.png',
  './_2/screen.png',
  './_3/screen.png',
  './_4/screen.png',
  './ai/screen.png',
  './mediterra_olive_mark/screen.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    }).catch(() => caches.match('./index.html'))
  );
});
