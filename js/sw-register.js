/**
 * RAMADAN PLANNER - SW REGISTRATION (Enterprise)
 */

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        let refreshing = false;

        // Detect controller change and reload only once
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            refreshing = true;
            console.log('[SW Registration] New version active, reloading...');
            window.location.reload();
        });

        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('[SW Registration] Scope:', registration.scope);

                // Check for updates periodically
                setInterval(() => {
                    registration.update();
                }, 1000 * 60 * 60); // Check every hour

                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // A new Service Worker is available!
                            notifyUserOfUpdate(registration);
                        }
                    });
                });
            })
            .catch((error) => {
                console.error('[SW Registration] Failed:', error);
            });
    });
}

/**
 * Notifies the user that a new version is available.
 * In a production app, this would show a toast/snackbar.
 */
function notifyUserOfUpdate(registration) {
    const message = "تحديث جديد متاح! هل تريد التحديث الآن؟\n\nNew version available! Refresh now?";
    if (window.confirm(message)) {
        if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
    }
}
