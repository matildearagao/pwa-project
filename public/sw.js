const staticCacheName = 'site-static-v4';
const dynamicCache = 'site-dynamic-v9'

const assets = [
    '/pages/fallback.html',
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/styles.css',
    '/css/materialize.min.css',
    '/img/dish.png',
    'https://fonts.gstatic.com/s/materialicons/v48/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
]

// cache size limit function
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size))
            }
        })
    })
}

// install service worker
self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            cache.addAll(assets)
        })
    )
})

//activate event
self.addEventListener('activate', evt => {
    evt.waitUntil(
        caches.keys().then(keys => {
            // console.log(keys);
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCache)
                .map(key => caches.delete(key))
            )
        })
    )
})

// fetch event
self.addEventListener('fetch', evt => {
    if (evt.request.url.indexOf('firestore.googleapis.com')) {
        evt.respondWith(
            caches.match(evt.request).then(cacheResp => {
                return cacheResp || fetch(evt.request).then(fetchRes => {
                    return caches.open(dynamicCache).then(cache => {
                        cache.put(evt.request.url, fetchRes.clone())
                        limitCacheSize(dynamicCache, 15)
                        return fetchRes
                    })
                })
            }).catch(() => {
                if (evt.request.url.indexOf('.html') > -1) {
                    return caches.match('/pages/fallback.html')
                }
            })
        )
    }
})