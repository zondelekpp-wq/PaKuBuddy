/* PaKuBuddy service worker – always the newest version when online, full app offline */
const VERSION='2026.11.22-9';
const CACHE='pakubuddy-'+VERSION;
const FILES=['./','index.html','family.js','install.js','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png','icon-maskable.png','apple-touch-icon.png','qr.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n.startsWith('pakubuddy-')&&n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()));});
const fresh=req=>fetch(req,{cache:'no-cache'}).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp));}return res;});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  if(url.host==='fonts.googleapis.com'||url.host==='fonts.gstatic.com'){
    e.respondWith(caches.open(CACHE).then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(res=>{c.put(e.request,res.clone());return res;}).catch(()=>new Response('',{status:200,headers:{'Content-Type':'text/css'}})))));return;}
  if(url.origin!==location.origin)return;
  /* the app page and its scripts: network first (newest version), cache when offline */
  if(e.request.mode==='navigate'||/\.(html|js|json|webmanifest)$/.test(url.pathname)||url.pathname.endsWith('/')){
    e.respondWith(fresh(e.request).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));return;}
  /* images: cache first, refresh in the background */
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>{const n=fresh(e.request).catch(()=>r);return r||n;}));
});
