const CACHE_NAME = 'sams-cache-v1';
const API_CACHE_NAME = 'sams-api-cache-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',                   
  '/dashboard',           
  '/dashboard/live-enrollment',     
  '/dashboard/teachers',            
  '/dashboard/schools',  
  '/dashboard/learners',            
  '/manifest.json',
  '/favicon.ico',
  '/images/*',           
  '/public/*'            
];

// Runtime caching strategies
const API_CACHE_STRATEGY = {
  cache: 'network-first',
  maxAge: 5 * 60, // 5 minutes
  strategies: {
    '/school-data/school-types-by-state': {
      cache: 'stale-while-revalidate',
      maxAge: 15 * 60 // 15 minutess
    },
    '/school-data/enrollment/completed': {
      cache: 'network-first',
      maxAge: 5 * 60 // 5 minutes
    }
  }
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle API requests
  if (url.pathname.includes('/api/') || url.pathname.includes('/school-data/')) {
    const strategy = API_CACHE_STRATEGY.strategies[url.pathname] || API_CACHE_STRATEGY;
    
    if (strategy.cache === 'network-first') {
      event.respondWith(
        fetch(event.request)
          .then((response) => {
            const responseClone = response.clone();
            caches.open(API_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
            return response;
          })
          .catch(() => {
            return caches.match(event.request);
          })
      );
    } else if (strategy.cache === 'stale-while-revalidate') {
      event.respondWith(
        caches.match(event.request).then((response) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            caches.open(API_CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
            return networkResponse;
          });
          return response || fetchPromise;
        })
      );
    }
  } else {
    // Handle static assets
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
