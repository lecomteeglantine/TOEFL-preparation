const CACHE = 'homemade-toefl-v7-20260922-v4';
const CORE = ['./','./index.html','./styles.css','./data.js','./app.js','./manifest.webmanifest'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
async function cached(request) {
  return (await caches.match(request)) || (await caches.match(request,{ignoreSearch:true}));
}
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith((async()=>{
    try {
      const response=await fetch(event.request);
      if(response && response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}
      return response;
    } catch {
      const hit=await cached(event.request);
      if(hit)return hit;
      if(event.request.mode==='navigate')return (await caches.match('./index.html')) || Response.error();
      return new Response('Offline resource unavailable',{status:503,statusText:'Offline'});
    }
  })());
});
