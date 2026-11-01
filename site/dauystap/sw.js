/* DauysTap service worker: opens instantly and works offline for the page shell.
   Speech requests (key server, Soniox, Google) are never cached. */
const CACHE = 'dauystap-v1';
const SHELL = [
  '/dauystap/', '/dauystap/app.css?v=3', '/dauystap/app.js?v=3', '/dauystap/config.js?v=3',
  '/home.css?v=aqsuek6', '/liquid-glass.css?v=lg27', '/dauystap/icon-192.png'
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  if (req.mode === 'navigate') {
    // network first so updates show up, cached page when offline
    e.respondWith(fetch(req).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put('/dauystap/', copy)); return res; })
      .catch(() => caches.match('/dauystap/')));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => {
    const net = fetch(req).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); } return res; }).catch(() => hit);
    return hit || net;
  }));
});
