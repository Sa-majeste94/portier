// Service worker : met l'app en cache pour qu'elle s'ouvre sans réseau.
const CACHE = "portier-mwkur7cy";
const FICHIERS = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
// Cache d'abord (rapide, marche hors ligne) ; si le réseau répond, on met le cache à jour pour la prochaine ouverture.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(cache => {
    const reseau = fetch(e.request).then(r => { if (r && r.ok) { const copie = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copie)); } return r; }).catch(() => cache);
    return cache || reseau;
  }));
});
