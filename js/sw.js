/* Service worker: офлайн + надёжные обновления.
   BUILD подставляется автоматически (tools/bump.js, GitHub Action) — вручную ничего поднимать не нужно. */
const BUILD = '7e93b9bbd34c';
const CORE = 'nz-core-' + BUILD, DATA = 'nz-data-v1', FONTS = 'nz-fonts-v1';
/* GEN:start (tools/bump.js пересобирает этот блок сам: списки файлов) */
const CORE_FILES = ["index.html","css/armenian.css","css/base.css","css/compare.css","css/contact.css","css/cross.css","css/effects.css","css/fixes.css","css/hy-latin.css","css/layout.css","css/likes.css","css/offline.css","css/perf.css","css/preface-modal.css","css/reader.css","css/torch.css","css/tour.css","css/translation-guide.css","icons/apple-touch-icon.png","icons/cross.webp","icons/favicon-48.png","icons/icon-192.png","icons/icon-512.png","icons/maskable-512.png","js/app.js","js/contact.js","js/hy-latin.js","js/install.js","js/offline.js","js/perf.js","js/preface-gate.js","js/reader.js","js/ready.js","js/scroll-blur.js","js/scroll-reveal.js","js/smooth-scroll.js","js/soundscape.js","js/torch.js","js/tour.js","js/translation-info.js","manifest.webmanifest"];
const TFILES = {"arar":["data/arar/1cor.js","data/arar/1jn.js","data/arar/1pet.js","data/arar/1th.js","data/arar/1tim.js","data/arar/2cor.js","data/arar/2jn.js","data/arar/2pet.js","data/arar/2th.js","data/arar/2tim.js","data/arar/3jn.js","data/arar/acts.js","data/arar/col.js","data/arar/eph.js","data/arar/gal.js","data/arar/heb.js","data/arar/jas.js","data/arar/jn.js","data/arar/jude.js","data/arar/lk.js","data/arar/mk.js","data/arar/mt.js","data/arar/phil.js","data/arar/phlm.js","data/arar/rev.js","data/arar/rom.js","data/arar/tit.js"],"cass":["data/cass/1cor.js","data/cass/1jn.js","data/cass/1pet.js","data/cass/1th.js","data/cass/1tim.js","data/cass/2cor.js","data/cass/2jn.js","data/cass/2pet.js","data/cass/2th.js","data/cass/2tim.js","data/cass/3jn.js","data/cass/acts.js","data/cass/col.js","data/cass/eph.js","data/cass/gal.js","data/cass/heb.js","data/cass/jas.js","data/cass/jn.js","data/cass/jude.js","data/cass/lk.js","data/cass/mk.js","data/cass/mt.js","data/cass/phil.js","data/cass/phlm.js","data/cass/rev.js","data/cass/rom.js","data/cass/tit.js"],"elb":["data/elb/1cor.js","data/elb/1jn.js","data/elb/1pet.js","data/elb/1th.js","data/elb/1tim.js","data/elb/2cor.js","data/elb/2jn.js","data/elb/2pet.js","data/elb/2th.js","data/elb/2tim.js","data/elb/3jn.js","data/elb/acts.js","data/elb/col.js","data/elb/eph.js","data/elb/gal.js","data/elb/heb.js","data/elb/jas.js","data/elb/jn.js","data/elb/jude.js","data/elb/lk.js","data/elb/mk.js","data/elb/mt.js","data/elb/phil.js","data/elb/phlm.js","data/elb/rev.js","data/elb/rom.js","data/elb/tit.js"],"nasb":["data/nasb/1cor.js","data/nasb/1jn.js","data/nasb/1pet.js","data/nasb/1th.js","data/nasb/1tim.js","data/nasb/2cor.js","data/nasb/2jn.js","data/nasb/2pet.js","data/nasb/2th.js","data/nasb/2tim.js","data/nasb/3jn.js","data/nasb/acts.js","data/nasb/col.js","data/nasb/eph.js","data/nasb/gal.js","data/nasb/heb.js","data/nasb/jas.js","data/nasb/jn.js","data/nasb/jude.js","data/nasb/lk.js","data/nasb/mk.js","data/nasb/mt.js","data/nasb/phil.js","data/nasb/phlm.js","data/nasb/rev.js","data/nasb/rom.js","data/nasb/tit.js"],"rbo":["data/rbo/1chr.js","data/rbo/1cor.js","data/rbo/1jn.js","data/rbo/1kgs.js","data/rbo/1pet.js","data/rbo/1sam.js","data/rbo/1th.js","data/rbo/1tim.js","data/rbo/2chr.js","data/rbo/2cor.js","data/rbo/2jn.js","data/rbo/2kgs.js","data/rbo/2pet.js","data/rbo/2sam.js","data/rbo/2th.js","data/rbo/2tim.js","data/rbo/3jn.js","data/rbo/acts.js","data/rbo/amos.js","data/rbo/col.js","data/rbo/dan.js","data/rbo/deut.js","data/rbo/eccl.js","data/rbo/eph.js","data/rbo/esth.js","data/rbo/ex.js","data/rbo/ezek.js","data/rbo/ezra.js","data/rbo/gal.js","data/rbo/gen.js","data/rbo/hab.js","data/rbo/hag.js","data/rbo/heb.js","data/rbo/hos.js","data/rbo/isa.js","data/rbo/jas.js","data/rbo/jer.js","data/rbo/jn.js","data/rbo/job.js","data/rbo/joel.js","data/rbo/jonah.js","data/rbo/josh.js","data/rbo/jude.js","data/rbo/judg.js","data/rbo/lam.js","data/rbo/lev.js","data/rbo/lk.js","data/rbo/mal.js","data/rbo/mic.js","data/rbo/mk.js","data/rbo/mt.js","data/rbo/nah.js","data/rbo/neh.js","data/rbo/num.js","data/rbo/obad.js","data/rbo/phil.js","data/rbo/phlm.js","data/rbo/prov.js","data/rbo/ps.js","data/rbo/rev.js","data/rbo/rom.js","data/rbo/ruth.js","data/rbo/song.js","data/rbo/tit.js","data/rbo/zech.js","data/rbo/zeph.js"]};
/* GEN:end */
/* Тексты (data/<перевод>/<книга>.js) и звуки в установке НЕ скачиваются: читаются по мере открытия и оседают в отдельном кэше.
   Скачать всё заранее можно кнопкой «Офлайн» в настройках. */
const DATA_FILES = ["assets/audio/birds.mp3", "assets/audio/bolt.mp3", "assets/audio/wind.mp3"];
const FONT_CORE = "https://fonts.googleapis.com/css2?family=Noto+Serif+Armenian:wght@400;600&family=Manrope:wght@400;500;600&family=Noto+Sans+Armenian:wght@400;500&display=swap";
/* для офлайн-сохранения: Literata, основной набор и шрифты из выбора в настройках */
const FONT_CSS = ["https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;1,7..72,400&display=swap", FONT_CORE, "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=PT+Serif:ital,wght@0,400;0,700;1,400&family=Spectral:ital,wght@0,400;0,600;1,400&family=Alegreya:ital,wght@0,400;0,600;1,400&family=Philosopher:ital,wght@0,400;0,700;1,400&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Marck+Script&family=Inter:wght@400;500&display=swap"];
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
    /* основные шрифты (Literata и армянские) кладём в кэш сразу, остальное — по мере использования */
    try { const fc2 = await caches.open(FONTS); await Promise.all(FONT_CSS.slice(0, 2).map(u => saveFontCss(fc2, u).catch(() => {}))); } catch (_) {}
    await self.skipWaiting(); /* новая версия включается сразу, а не «когда закроют все вкладки» */
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('nz-core-') && k !== CORE) await caches.delete(k);
    await self.clients.claim();
    /* переход со старой схемы (data/bible-xxx.js целиком): удаляем старые файлы и докачиваем те же переводы по книгам,
       чтобы у тех, кто сохранял тексты для офлайна, они остались сохранёнными */
    try {
      const dc = await caches.open(DATA), had = new Set();
      for (const rq of await dc.keys()) { const pn = new URL(rq.url).pathname, m = /\/data\/bible-(\w+)\.js$/.exec(pn); if (m) { had.add(m[1]); await dc.delete(rq); } else if (/\/assets\/audio\/\w+\.js$/.test(pn)) { had.add('audio'); await dc.delete(rq); } }
      if (had.has('audio')) await Promise.all(DATA_FILES.map(u => dc.add(new Request(u, {cache: 'reload'})).catch(() => {})));
      for (const g of had) if (TFILES[g]) await Promise.all(TFILES[g].map(u => dc.add(new Request(u, {cache: 'reload'})).catch(() => {})));
    } catch (_) {}
  })());
});

/* ---------- Офлайн-чтение: команды от страницы (js/offline.js) ---------- */
const TRANS = ['cass', 'rbo', 'arar', 'nasb', 'elb'];
const META = new Request(new URL('offline-meta.json', self.registration.scope).href);
const say = async o => { for (const c of await self.clients.matchAll({includeUncontrolled: true})) c.postMessage(Object.assign({nz: 'offline'}, o)); };
const urlsOf = g => g === 'audio' ? DATA_FILES.filter(u => u.startsWith('assets/')) : TRANS.includes(g) ? (TFILES[g] || []) : [];
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
  let next = 0;
  const worker = async () => {
    while (next < tasks.length) {
      const t = tasks[next++];
      try { if (t.font) await saveFontCss(fc, t.url); else await dc.add(new Request(t.url, {cache: 'reload'})); } catch (_) { failed.add(t.g); }
      done++; await say({type: 'progress', done, total});
    }
  };
  await Promise.all(Array.from({length: 6}, worker));
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
