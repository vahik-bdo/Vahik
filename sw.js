/* Service worker: офлайн + надёжные обновления.
   BUILD подставляется автоматически (tools/bump.js, GitHub Action) — вручную ничего поднимать не нужно. */
const BUILD = '82037092fc';
const CORE = 'nz-core-' + BUILD, DATA = 'nz-data-v1', FONTS = 'nz-fonts-v1';
const CORE_FILES = ["index.html", "css/armenian.css", "css/base.css", "css/compare.css", "css/contact.css", "css/hy-latin.css", "css/cross.css", "css/effects.css", "css/fixes.css", "css/layout.css", "css/likes.css", "css/perf.css", "css/preface-modal.css", "css/reader.css", "css/torch.css", "css/tour.css", "css/translation-guide.css", "js/app.js", "js/contact.js", "js/hy-latin.js", "js/install.js", "js/perf.js", "js/preface-gate.js", "js/reader.js", "js/translation-info.js", "js/ready.js", "js/scroll-blur.js", "js/scroll-reveal.js", "js/smooth-scroll.js", "js/soundscape.js", "js/torch.js", "js/tour.js", "manifest.webmanifest", "icons/apple-touch-icon.png", "icons/favicon-48.png", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png"];
/* тяжёлое (тексты Библии, звуки) лежит в отдельном кэше: не перекачивается при каждом обновлении сайта */
const DATA_FILES = ["data/bible-arar.js", "data/bible-cass.js", "data/bible-elb.js", "data/bible-nasb.js", "data/bible-rbo.js", "assets/audio/birds.js", "assets/audio/bolt.js", "assets/audio/wind.js"];
const FONT_CSS = ["https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;1,7..72,400&display=swap", "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Manrope:wght@400;500;600&family=PT+Serif:ital,wght@0,400;0,700;1,400&family=Spectral:ital,wght@0,400;0,600;1,400&family=Alegreya:ital,wght@0,400;0,600;1,400&family=Philosopher:ital,wght@0,400;0,700;1,400&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Marck+Script&family=Inter:wght@400;500&family=Noto+Serif+Armenian:wght@400;600&family=Noto+Sans+Armenian:wght@400;500&display=swap"];
const KEEP = /\/\* (latin|cyrillic|armenian) \*\//;
const NAV_TIMEOUT = 4000;
const isAsset = u => /\.(css|js)$/.test(u);

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CORE);
    /* css/js кладём под двумя ключами: «чистым» и с ?v=BUILD (так их просит index.html после bump.js) */
    await Promise.all(CORE_FILES.map(async u => {
      const r = await fetch(new Request(u, {cache: 'reload'}));
      if (!r.ok) throw new Error(u + ' ' + r.status);
      await c.put(u, r.clone());
      if (isAsset(u)) await c.put(u + '?v=' + BUILD, r.clone());
    }));
    /* перенос уже скачанных данных и звуков из старых кэшей (чтобы у прежних пользователей офлайн не пропал) */
    try {
      const dc = await caches.open(DATA);
      for (const k of await caches.keys()) {
        if (!k.startsWith('nz-core-') || k === CORE) continue;
        const old = await caches.open(k);
        for (const rq of await old.keys()) {
          if (/\/(data|assets)\//.test(new URL(rq.url).pathname) && !(await dc.match(rq))) { const r = await old.match(rq); if (r) await dc.put(rq, r); }
        }
      }
    } catch (_) {}
    /* тексты Библии, звуки и шрифты кладём в кэш сразу: офлайн всегда открывается последняя загруженная версия */
    try {
      const dc2 = await caches.open(DATA);
      await Promise.all(DATA_FILES.map(u => dc2.match(u).then(h => h || dc2.add(new Request(u, {cache: 'reload'}))).catch(() => {})));
    } catch (_) {}
    try { const fc2 = await caches.open(FONTS); await Promise.all(FONT_CSS.map(u => saveFontCss(fc2, u).catch(() => {}))); } catch (_) {}
    await self.skipWaiting(); /* новая версия включается сразу, а не «когда закроют все вкладки» */
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('nz-core-') && k !== CORE) await caches.delete(k);
    await self.clients.claim();
  })());
});

/* ---------- Офлайн-чтение: команды от страницы (js/offline.js) ---------- */
const TRANS = ['cass', 'rbo', 'arar', 'nasb', 'elb'];
const META = new Request(new URL('offline-meta.json', self.registration.scope).href);
const say = async o => { for (const c of await self.clients.matchAll({includeUncontrolled: true})) c.postMessage(Object.assign({nz: 'offline'}, o)); };
const urlsOf = g => g === 'audio' ? DATA_FILES.filter(u => u.startsWith('assets/')) : TRANS.includes(g) ? ['data/bible-' + g + '.js'] : [];
async function readMeta() { try { const r = await (await caches.open(DATA)).match(META); return r ? await r.json() : {groups: {}}; } catch (_) { return {groups: {}}; } }
async function writeMeta(m) { await (await caches.open(DATA)).put(META, new Response(JSON.stringify(m), {headers: {'Content-Type': 'application/json'}})); }
async function offStatus() {
  const dc = await caches.open(DATA), fc = await caches.open(FONTS), m = await readMeta(), groups = {};
  for (const g of [...TRANS, 'audio']) { const us = urlsOf(g); let ok = true; for (const u of us) if (!(await dc.match(u))) { ok = false; break; } groups[g] = {saved: ok, date: ok ? (m.groups[g] || null) : null}; }
  groups.fonts = {saved: !!(await fc.match(FONT_CSS[0])) && !!m.groups.fonts, date: m.groups.fonts || null};
  return {groups, build: BUILD, savedBuild: m.build || null};
}
async function saveFontCss(fc, url) {
  const css = await (await fetch(url)).text();
  await fc.put(url, new Response(css, {headers: {'Content-Type': 'text/css'}}));
  const blocks = css.split(/(?=\/\* [a-z-]+ \*\/)/).filter(b => KEEP.test(b));
  const urls = [...new Set(blocks.flatMap(b => [...b.matchAll(/url\((https:[^)]+)\)/g)].map(m => m[1])))];
  await Promise.all(urls.map(u => fc.add(u).catch(() => {})));
}
async function offSave(groups) {
  const dc = await caches.open(DATA), fc = await caches.open(FONTS);
  const tasks = [];
  for (const g of groups) { if (g === 'fonts') FONT_CSS.forEach(url => tasks.push({g, url, font: 1})); else urlsOf(g).forEach(url => tasks.push({g, url})); }
  let done = 0; const failed = new Set(), total = tasks.length;
  await say({type: 'progress', done, total});
  for (const t of tasks) {
    try { if (t.font) await saveFontCss(fc, t.url); else await dc.add(new Request(t.url, {cache: 'reload'})); } catch (_) { failed.add(t.g); }
    done++; await say({type: 'progress', done, total});
  }
  const m = await readMeta(); m.build = BUILD;
  for (const g of groups) if (!failed.has(g)) m.groups[g] = Date.now();
  await writeMeta(m);
  await say({type: 'done', failed: [...failed], status: await offStatus()});
}
async function offRemove(groups) {
  const dc = await caches.open(DATA), m = await readMeta();
  for (const g of groups) {
    if (g === 'fonts') { await caches.delete(FONTS); } else { for (const u of urlsOf(g)) await dc.delete(u); }
    delete m.groups[g];
  }
  await writeMeta(m);
  await say({type: 'status', status: await offStatus()});
}
self.addEventListener('message', e => {
  const d = e.data;
  if (d === 'SKIP_WAITING') { self.skipWaiting(); return; }
  if (!d || !d.cmd) return;
  const gs = (d.groups || []).filter(g => TRANS.includes(g) || g === 'audio' || g === 'fonts');
  e.waitUntil((async () => {
    if (d.cmd === 'status') await say({type: 'status', status: await offStatus()});
    else if (d.cmd === 'save') await offSave(gs);
    else if (d.cmd === 'remove') await offRemove(gs);
  })().catch(err => say({type: 'error', message: String(err)})));
});

/* страница: сначала сеть (свежая версия), при медленной сети или офлайне — кэш */
async function navigate(e) {
  const c = await caches.open(CORE);
  const net = fetch(e.request, {cache: 'no-cache'}).then(r => { if (r.ok) c.put('index.html', r.clone()); return r; });
  const cached = async () => (await c.match('index.html')) || (await c.match('./'));
  try {
    return await Promise.race([net, new Promise((_, rej) => setTimeout(rej, NAV_TIMEOUT))]);
  } catch (_) {
    const hit = await cached();
    if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
    return net.catch(() => new Response('Offline', {status: 503, headers: {'Content-Type': 'text/plain'}}));
  }
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
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
  if (url.origin !== location.origin || url.pathname.endsWith('.apk') || url.pathname.endsWith('/sw.js')) return;
  if (req.mode === 'navigate') { e.respondWith(navigate(e)); return; }
  e.respondWith((async () => {
    const isData = /\/(data|assets)\//.test(url.pathname);
    const c = await caches.open(isData ? DATA : CORE);
    const hit = await c.match(req);               /* точное совпадение (с ?v=) */
    if (isData && /\/data\//.test(url.pathname)) {   /* тексты: онлайн — свежие сразу, офлайн/медленно — из кэша */
      const net = fetch(req, {cache: 'no-cache'}).then(r => { if (r.ok) c.put(req, r.clone()); return r; });
      try { return await Promise.race([net, new Promise((_, rej) => setTimeout(rej, 3000))]); }
      catch (_) { if (hit) { e.waitUntil(net.catch(() => {})); return hit; } return net.catch(() => new Response('', {status: 504})); }
    }
    if (hit) {
      if (isData) e.waitUntil(fetch(req).then(r => { if (r.ok) c.put(req, r); }).catch(() => {}));
      return hit;
    }
    try {                                          /* такого адреса нет в кэше: берём из сети (это новая версия) */
      const r = await fetch(req);
      if (r.ok) c.put(req, r.clone());
      return r;
    } catch (_) {                                  /* офлайн: пробуем без параметров */
      const any = await c.match(req, {ignoreSearch: true});
      return any || new Response('', {status: 504});
    }
  })());
});
