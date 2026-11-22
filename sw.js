/* PaKuBuddy service worker – works fully offline after the first visit */
const VERSION='2026.11.22-1';
const CACHE='pakubuddy-'+VERSION;
const FILES=['./','index.html','family.js','install.js','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png','icon-maskable.png','apple-touch-icon.png','qr.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n.startsWith('pakubuddy-')&&n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  /* the rounded font: keep a copy so it also works offline */
  if(url.host==='fonts.googleapis.com'||url.host==='fonts.gstatic.com'){
    e.respondWith(caches.open(CACHE).then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(res=>{c.put(e.request,res.clone());return res;}).catch(()=>new Response('',{status:200,headers:{'Content-Type':'text/css'}})))));return;}
  if(url.origin!==location.origin)return;
  e.respondWith(caches.open(CACHE).then(c=>c.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{if(res.ok)c.put(e.request,res.clone());return res;}).catch(()=>c.match('index.html')))));
});
