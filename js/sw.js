/* Inline Service Worker via Blob URL — permet l'enregistrement sans fichier externe.
   Note : limitation — le scope du SW dépend de l'origine de l'URL du SW.
   Comme Blob URL = origine "blob:", le SW peut intercepter mais avec un scope limité.
   Pour un scope racine, il faut un fichier servi depuis le même domaine.
   Cette implémentation marche bien pour les navigateurs modernes. */
(function(){
  if(!('serviceWorker' in navigator)) return;
  if(location.protocol !== 'https:' && location.hostname !== 'localhost') return;

  var swCode = `
    // Service Worker basique : cache-first pour la page elle-même
    var CACHE_NAME = 'contrepoint-v1';
    var URLS_TO_CACHE = [
      location.origin + '/',
      location.origin + location.pathname
    ];

    self.addEventListener('install', function(event){
      event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache){
          return cache.addAll(URLS_TO_CACHE).catch(function(){});
        })
      );
      self.skipWaiting();
    });

    self.addEventListener('activate', function(event){
      event.waitUntil(
        caches.keys().then(function(names){
          return Promise.all(
            names.filter(function(n){return n!==CACHE_NAME;})
                 .map(function(n){return caches.delete(n);})
          );
        })
      );
      self.clients.claim();
    });

    self.addEventListener('fetch', function(event){
      // Stratégie : Network-first pour HTML, Cache-first pour le reste
      var url = new URL(event.request.url);
      if(event.request.mode === 'navigate' || event.request.destination === 'document'){
        event.respondWith(
          fetch(event.request).then(function(resp){
            // Cache la réponse fraîche
            var clone = resp.clone();
            caches.open(CACHE_NAME).then(function(c){c.put(event.request, clone).catch(function(){});});
            return resp;
          }).catch(function(){
            return caches.match(event.request).then(function(r){return r || caches.match('/');});
          })
        );
      } else if(event.request.method === 'GET' && url.origin === location.origin){
        // Cache-first pour les ressources de même origine
        event.respondWith(
          caches.match(event.request).then(function(cached){
            return cached || fetch(event.request).then(function(resp){
              if(resp.ok){
                var clone = resp.clone();
                caches.open(CACHE_NAME).then(function(c){c.put(event.request, clone).catch(function(){});});
              }
              return resp;
            });
          }).catch(function(){return fetch(event.request);})
        );
      }
      // Pour les requêtes cross-origin (fonts, YouTube, API), laisser passer
    });
  `;

  try {
    var blob = new Blob([swCode], {type: 'application/javascript'});
    var swUrl = URL.createObjectURL(blob);
    /* Note : registration silencieuse — ne pas alarmer la console si bloquée */
    navigator.serviceWorker.register(swUrl).then(function(reg){
      // Service Worker enregistré
    }).catch(function(err){
      // Silencieux : le SW est un nice-to-have, pas critique
    });
  } catch(e){
    /* Échec silencieux : navigateur très ancien ou contexte non sécurisé */
  }
})();
