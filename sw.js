/* Драфт-асистент — service worker */
const VERSION = 'draft-v44';
const SHELL = VERSION + '-shell';
const RUNTIME = VERSION + '-runtime';

const SHELL_FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-192.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(SHELL)
      .then(cache => cache.addAll(SHELL_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== SHELL && k !== RUNTIME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Навігація: мережа першою, кеш як запасний варіант (щоб офлайн усе одно відкривалось)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(SHELL).then(c => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  // Шрифти Google + дані й портрети BrawlAPI/Brawlify: stale-while-revalidate у runtime-кеші
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com' ||
      url.hostname === 'api.brawlapi.com' || url.hostname === 'cdn.brawlify.com') {
    event.respondWith(
      caches.open(RUNTIME).then(cache =>
        cache.match(req).then(cached => {
          const network = fetch(req).then(res => {
            if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
            return res;
          }).catch(() => cached);
          return cached || network;
        })
      )
    );
    return;
  }

  // GoatCounter: аналітика має йти напряму в мережу, ніколи не кешується —
  // інакше рахуватиме офлайн-запити чи взагалі не рахуватиме нових відвідувань
  if (url.hostname === 'gc.zgo.at' || url.hostname.endsWith('.goatcounter.com')) {
    event.respondWith(fetch(req).catch(() => new Response(null, {status: 204})));
    return;
  }

  // Свої файли: кеш першим
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(SHELL).then(c => c.put(req, copy));
        return res;
      }))
    );
  }
});
