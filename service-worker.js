const CACHE_NAME = "prenota-intervento-v2"; // <--- Cambiato in v2 per forzare l'aggiornamento

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// Fase di installazione: scarica i nuovi file
self.addEventListener("install", event => {
  self.skipWaiting(); // Forza l'attivazione immediata
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Cache aperta: salvataggio nuovi file...");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fase di attivazione: cancella la vecchia cache (v1)
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log("Cancellazione vecchia cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Prende il controllo della pagina subito
  );
});

// Gestione richieste: prova la cache, se manca vai in rete
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
