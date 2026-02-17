/**
 * RAMADAN PLANNER - ENTERPRISE SERVICE WORKER (v15)
 * 
 * Strategies:
 * - HTML: Network-First (always fresh, offline fallback)
 * - Assets (JS/CSS/Fonts): Stale-While-Revalidate (instant load, background update)
 * - Images/Static: Cache-First (high performance)
 */

const VERSION = '15';
const CACHE_PREFIX = 'ramadan-planner';
const STATIC_CACHE = `${CACHE_PREFIX}-static-v${VERSION}`;
const ASSET_CACHE = `${CACHE_PREFIX}-assets-v${VERSION}`;
const IMAGE_CACHE = `${CACHE_PREFIX}-images`;

const ASSETS_TO_PRECACHE = [
    './',
    './index.html',
    './style.css?v=14',
    './certificate.css',
    './manifest.json',
    './icon.svg'
];

// 1. INSTALL: Pre-cache core shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            console.log('[SW] Pre-caching App Shell');
            return cache.addAll(ASSETS_TO_PRECACHE);
        }).then(() => self.skipWaiting()) // Force activation
    );
});

// 2. ACTIVATE: Cleanup old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== STATIC_CACHE && key !== ASSET_CACHE && key !== IMAGE_CACHE)
                    .map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// 3. FETCH: Hybrid Strategy
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // A. HTML - Network First
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const copy = response.clone();
                    caches.open(STATIC_CACHE).then(cache => cache.put(request, copy));
                    return response;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // B. Static Assets (JS, CSS, Fonts) - Stale While Revalidate
    if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.host.includes('fonts.gstatic.com')) {
        event.respondWith(
            caches.match(request).then((cached) => {
                const networked = fetch(request).then((response) => {
                    const copy = response.clone();
                    caches.open(ASSET_CACHE).then(cache => cache.put(request, copy));
                    return response;
                }).catch(() => null);
                return cached || networked;
            })
        );
        return;
    }

    // C. Images - Cache First
    if (request.destination === 'image') {
        event.respondWith(
            caches.match(request).then((cached) => {
                return cached || fetch(request).then((response) => {
                    const copy = response.clone();
                    caches.open(IMAGE_CACHE).then(cache => cache.put(request, copy));
                    return response;
                });
            })
        );
        return;
    }

    // D. Default - Network with Cache Fallback
    event.respondWith(
        caches.match(request).then(cached => cached || fetch(request))
    );
});

// 4. MESSAGE: Handle update commands
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
