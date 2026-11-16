const CACHE = "ecomind-offline-v1";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) =>
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys())
        if (key.startsWith("ecomind-offline-") && key !== CACHE) await caches.delete(key);
      await self.clients.claim();
    })(),
  ),
);
self.addEventListener("fetch", (event) => {
  const request = event.request,
    url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  const safePage = ["/game", "/quests"].includes(url.pathname);
  const asset = url.pathname.startsWith("/assets/");
  if (!safePage && !asset) return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      if (asset) {
        const saved = await cache.match(request);
        if (saved) return saved;
      }
      try {
        const response = await fetch(request);
        if (response.ok) await cache.put(request, response.clone());
        return response;
      } catch {
        const saved = await cache.match(request);
        return (
          saved ||
          new Response("Open EcoSort once online to save it for offline play.", {
            status: 503,
            headers: { "Content-Type": "text/plain" },
          })
        );
      }
    })(),
  );
});
