const VERSION = "bestiario-live-v1";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

// O leitor sempre consulta a versão publicada: atualizações administrativas
// aparecem para site e aplicativo sem exigir uma nova instalação.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
