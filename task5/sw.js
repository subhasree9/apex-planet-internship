const CACHE = "minishop-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
];

self.addEventListener("install", (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});

self.addEventListener("activate", (e)=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  );
});

self.addEventListener("fetch", (e)=>{
  const {request} = e;
  // Network-first for images, cache-first for app shell
  if (request.destination === "image") {
    e.respondWith(
      fetch(request).then(res=>{
        const copy = res.clone();
        caches.open(CACHE).then(c=>c.put(request, copy));
        return res;
      }).catch(()=>caches.match(request))
    );
  } else {
    e.respondWith(
      caches.match(request).then(res=>res || fetch(request))
    );
  }
});
