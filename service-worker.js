var cacheName = 'weatherPWA-step-6-4';
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
        caches.open(cacheName).then(function(cache) {
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
                if (key !== cacheName) {
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
    e.respondWith(
        // return cached response or fetch new
        caches.match(e.request).then(function(response) {
            return response || fetch(e.request);
        })
    );
});