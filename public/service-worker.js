// service-worker.js — mise en cache minimale de la coquille de l'app,
// pour un chargement instantané et un fonctionnement correct en réseau faible.
// Les appels /api/* ne sont jamais mis en cache (toujours réseau frais).

var CACHE_NAME = 'laflamme-v1';
var SHELL_FILES = [
  '/',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(SHELL_FILES);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE_NAME; }).map(function (k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  var url = new URL(event.request.url);
  if (url.pathname.indexOf('/api/') === 0) return; // jamais de cache pour l'API
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      return cached || fetch(event.request);
    })
  );
});
