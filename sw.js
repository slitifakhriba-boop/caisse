const CACHE='caisse-spa-202610250705';
const FILES=['./','index.html','config.js','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;const scope=new URL(self.registration.scope).pathname;const rel=u.pathname.startsWith(scope)?u.pathname.slice(scope.length):null;if(rel===null||(e.request.mode!=='navigate'&&!FILES.includes(rel)))return;
  e.respondWith(caches.open(CACHE).then(async c=>{const hit=await c.match(e.request,{ignoreSearch:true});const net=fetch(new Request(u.href,{cache:'no-cache',credentials:'same-origin'})).then(r=>{if(r.ok)c.put(e.request,r.clone());return r}).catch(()=>null);
    if(hit){e.waitUntil(net);return hit}const r=await net;return r||(await c.match('index.html'))||new Response('Hors ligne',{status:503})}))});
