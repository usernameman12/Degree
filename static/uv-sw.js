importScripts("../static/uv/uv.sw.js"); // stawt from da root

const sw = new UVServiceWorker();

self.addEventListener("fetch", (event) => event.respondWith(sw.fetch(event)));
