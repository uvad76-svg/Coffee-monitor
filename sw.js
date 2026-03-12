const CACHE = 'coffee-monitor-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Для API-запросоо не кэшируем server
  if (e.request.url.includes('api.investing.com') ||
      e.request.url.includes('yahoo.com') ||
      e.request.url.includes('frankfurter.app') ||
      e.request.url.includes('open-meteo.com')) {
    e.respondWith(fetch(e.request).catch(() => new Response('{}')));
    return;
  }
  e.respondWith(caches.match(e.request).then(c => c || fetch(e.request)));
});