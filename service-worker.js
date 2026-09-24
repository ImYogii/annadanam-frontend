const CACHE_NAME = 'annadanam-shell-v1';
const SHELL_FILES = [
    '/index.html',
    '/css/style.css',
    '/js/config.js',
    '/js/api.js',
    '/js/public.js',
    '/js/menu.js',
    '/icons/icon-192.png',
    '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((names) =>
            Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
        )
    );
});

self.addEventListener('fetch', (event) => {
    // Only cache-fallback our own static files, never API calls -
    // events must always come fresh from the network, never stale from cache.
    if (event.request.url.includes('/api/')) return;

    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});