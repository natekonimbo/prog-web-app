// cache names
var cache_shell = 'shell_cache_v1',
    cache_data = 'data_cache_v1';
var filesToCache = [
    '/',
    '/index.html',
    '/scripts/app.js',
    '/styles/inline.css',
    '/images/clear.png',
    '/images/cloudy-scattered-showers.png',
    '/images/cloudy.png',
    '/images/fog.png',
    '/images/ic_add_white_24px.svg',
    '/images/ic_refresh_white_24px.svg',
    '/images/partly-cloudy.png',
    '/images/rain.png',
    '/images/scattered-showers.png',
    '/images/sleet.png',
    '/images/snow.png',
    '/images/thunderstorm.png',
    '/images/wind.png'
];

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(cache_shell).then(function(cache) {
            // caching app shell
            return cache.addAll(filesToCache);
        })
    );
});

// activate fires when SW starts
self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cache_shell && key !== cache_data) {
                    // remove old cache
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

// serve app shell from cache
self.addEventListener('fetch', function(e) {
    var dataUrl = 'https://query.yahooapis.com/v1/public/yql';
    if (e.request.url.indexOf(dataUrl) > -1) {
        // 1. fetch fresh data
        e.respondWith(
          caches.open(cache_data).then(function (cache) {
            return fetch(e.request).then(function (response) {
              cache.put(e.request.url, response.clone());
              return response;
            })
          })
        )
    } else {
        e.respondWith(
            // 2. fetch cached data
            caches.match(e.request).then(function(response) {
                return response || fetch(e.request);
            })
        );
    }
});