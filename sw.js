const cacheFileName = 'cache-v1';
const cacheUrls = [
'/',
'/index.html',
'/restaurant.html',
'css/main.css',
'css/styles.css',
'css/view-styles.css',
'js/main.js',
'js/dbhelper.js',
'js/restaurant_info.js',
'js/sw_register.js',
'data/restaurants.json',
'img/1.jpg',
'img/2.jpg',
'img/3.jpg',
'img/4.jpg',
'img/5.jpg',
'img/6.jpg',
'img/7.jpg',
'img/8.jpg',
'img/9.jpg',
'img/10.jpg',
'favicon.ico',
'https://fonts.googleapis.com/css?family=Karla:400,400i,700,700i',
'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css'
];

//installing service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheFileName).then((cache) => {
      return cache.addAll(cacheUrls);
    }).catch((err) => {
      console.log(err);
    })
  );
});

//if not found in cache, fetch from the network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      } else {
        return fetch(event.request).then((response) => {
          return caches.open(cacheFileName).then((cache) => {
            let responseClone = response.clone();
            cache.put(event.request, responseClone);
              return response;
          });
        }).catch((err) => {
          console.log(err);
        });
      }
    })
  );
});

//activate cache, delete previous cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName.startsWith('restaurant-') &&
            cacheName != cacheFileName;
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});