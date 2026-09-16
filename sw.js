/* Spot Check service worker.
   VERSION is bumped on every deploy; skipWaiting + clients.claim mean a new
   build takes over on the next launch without a manual cache clear. */
const VERSION = "sci-v4";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-180.png"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => c.addAll(SHELL.map(u => new Request(u, { cache: "reload" }))))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Network-first for the page so a deploy is picked up as soon as there is a
   signal; cache-first fallback so a cold launch works with no network at all.

   Shell requests go out with cache:"reload" to bypass the HTTP disk cache.
   GitHub Pages serves Cache-Control: max-age=600, so without this the
   "network" leg can be answered by a ten-minute-old copy and a fresh deploy
   does not appear until that expires. */
const SHELL_PATHS = new Set(SHELL.map(p => new URL(p, self.location).pathname));

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  const revalidate = req.mode === "navigate" || SHELL_PATHS.has(new URL(req.url).pathname);
  e.respondWith(
    fetch(revalidate ? new Request(req, { cache: "reload" }) : req)
      .then(res => {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then(hit => hit || caches.match("./index.html")))
  );
});
