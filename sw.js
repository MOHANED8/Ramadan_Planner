const CACHE_NAME = 'ramadan-planner-v13';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './certificate.css',
    './js/app.js',
    './js/translations.js',
    './js/workouts.js',
    './manifest.json',
    './icon.svg'
];

// Install Event - Cache Files
self.addEventListener('install', (event) => {
    // Force the waiting service worker to become the active service worker
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activate Event - Clean old caches
self.addEventListener('activate', (event) => {
    // Force the active service worker to take control of the page immediately
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            ).then(() => self.clients.claim());
        })
    );
});

// Fetch Event - Serve from Cache, fall back to Network
self.addEventListener('fetch', (event) => {
    // 1. Handle Google Fonts (Runtime Caching)
    if (event.request.url.includes('googleapis.com') || event.request.url.includes('gstatic.com')) {
        event.respondWith(
            caches.open('ramadan-planner-fonts').then((cache) => {
                return cache.match(event.request).then((response) => {
                    return response || fetch(event.request).then((networkResponse) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            }).catch(() => {
                // Return nothing or fallback if offline and not in cache
                return new Response('', { status: 408, statusText: 'Request timed out' });
            })
        );
        return;
    }

    // 2. Handle App Shell & Local Assets
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // If found in cache, return it
                if (response) {
                    return response;
                }

                // If not in cache, fetch from network
                return fetch(event.request).catch((error) => {
                    // Check if the user is offline
                    console.warn('[SW] Network request failed (offline):', event.request.url);

                    // Optional: Return a custom offline page or JSON response if needed
                    // For now, we'll return a 503 so the app can handle it gracefully instead of crashing
                    return new Response(JSON.stringify({ error: "Network error (offline)" }), {
                        status: 503,
                        headers: { 'Content-Type': 'application/json' }
                    });
                });
            })
    );
});
