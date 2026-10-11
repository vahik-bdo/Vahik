/* Service worker: офлайн-режим. Поднимайте VERSION при каждом обновлении сайта, чтобы у всех обновился кэш. */
const VERSION = 'v8';
const CORE = 'nz-core-' + VERSION, FONTS = 'nz-fonts-v1';
const CORE_FILES = ["./", "index.html", "css/armenian.css", "css/base.css", "css/contact.css", "css/cross.css", "css/effects.css", "css/fixes.css", "css/layout.css", "css/likes.css", "css/perf.css", "css/preface-modal.css", "css/reader.css", "css/torch.css", "css/tour.css", "css/translation-guide.css", "js/app.js", "js/contact.js", "js/install.js", "js/perf.js", "js/preface-gate.js", "js/reader.js", "js/ready.js", "js/scroll-blur.js", "js/scroll-reveal.js", "js/smooth-scroll.js", "js/soundscape.js", "js/torch.js", "js/tour.js", "data/bible-arar.js", "data/bible-cass.js", "data/bible-elb.js", "data/bible-nasb.js", "assets/audio/birds.js", "assets/audio/bolt.js", "assets/audio/wind.js", "manifest.webmanifest", "icons/apple-touch-icon.png", "icons/favicon-48.png", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png"];
const FONT_CSS = ["https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;1,7..72,400&display=swap", "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Manrope:wght@400;500;600&family=PT+Serif:ital,wght@0,400;0,700;1,400&family=Spectral:ital,wght@0,400;0,600;1,400&family=Alegreya:ital,wght@0,400;0,600;1,400&family=Philosopher:ital,wght@0,400;0,700;1,400&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Marck+Script&family=Inter:wght@400;500&family=Noto+Serif+Armenian:wght@400;600&family=Noto+Sans+Armenian:wght@400;500&display=swap"];
const KEEP = /\/\* (latin|cyrillic|armenian) \*\//;

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CORE);
    await c.addAll(CORE_FILES.map(u => new Request(u, {cache: 'reload'})));
    // шрифты Google: скачиваем только латиницу, кириллицу и армянский; ошибки не ломают установку
    try {
      const fc = await caches.open(FONTS);
      for (const url of FONT_CSS) {
        try {
          const css = await (await fetch(url)).text();
          await fc.put(url, new Response(css, {headers: {'Content-Type': 'text/css'}}));
          const blocks = css.split(/(?=\/\* [a-z-]+ \*\/)/).filter(b => KEEP.test(b));
          const urls = [...new Set(blocks.flatMap(b => [...b.matchAll(/url\((https:[^)]+)\)/g)].map(m => m[1])))];
          await Promise.all(urls.map(u => fc.add(u).catch(() => {})));
        } catch (_) {}
      }
    } catch (_) {}
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('nz-core-') && k !== CORE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // шрифты Google: из кэша, иначе сеть (и запоминаем)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith((async () => {
      const fc = await caches.open(FONTS);
      const hit = await fc.match(req);
      if (hit) return hit;
      try { const r = await fetch(req); if (r.ok || r.type === 'opaque') fc.put(req, r.clone()); return r; }
      catch (_) { return new Response('', {status: 504}); }
    })());
    return;
  }
  if (url.origin !== location.origin || url.pathname.endsWith('.apk')) return;
  // свои файлы: сначала кэш, в фоне обновляем (новая версия появится при следующем открытии)
  e.respondWith((async () => {
    const c = await caches.open(CORE);
    const hit = await c.match(req, {ignoreSearch: true});
    const net = fetch(req).then(r => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    const r = await net;
    if (r) return r;
    if (req.mode === 'navigate') return (await c.match('./index.html')) || (await c.match('./'));
    return new Response('', {status: 504});
  })());
});
