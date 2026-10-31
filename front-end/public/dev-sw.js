// Remplace le worker vite-plugin-pwa encore enregistré sur ce port.
// Il vide le cache de l'autre application, puis se désinscrit.
self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
        await self.registration.unregister();
        const windows = await self.clients.matchAll({ type: 'window' });
        await Promise.all(windows.map((client) => client.navigate(client.url)));
    })());
});
