#!/usr/bin/env node
/* Автоверсия сайта. Запуск: node tools/bump.js [папка] (на GitHub запускается сам при каждой выкладке, см. .github/workflows/pages.yml)
   1) пересобирает в sw.js списки файлов (CORE_FILES — интерфейс, TFILES — тексты по книгам)
   2) считает хеш содержимого index.html, css/, js/, иконок, manifest и списков файлов
   3) вписывает хеш в sw.js (const BUILD) и в ?v= у локальных css/js в index.html
   Любая правка кода/стилей/иконок → новый хеш → новый service worker → у всех пользователей подтягивается свежая версия.
   Если файлы не менялись, хеш тот же и ничего не перезаписывается. */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const rd = f => fs.readFileSync(path.join(root, f), 'utf8');
const strip = h => h.replace(/(<(?:script|link)[^>]*(?:src|href)="(?:css|js)\/[^"?]+)\?v=[^"]*"/g, '$1"');
const walk = d => fs.existsSync(path.join(root, d)) ? fs.readdirSync(path.join(root, d), {withFileTypes: true}).flatMap(x => x.isDirectory() ? walk(d + '/' + x.name) : [d + '/' + x.name]) : [];
const files = ['manifest.webmanifest', ...walk('css'), ...walk('js'), ...walk('icons')].sort();

/* списки файлов для service worker */
const CORE = ['index.html', ...files];
const TFILES = {};
if (fs.existsSync(path.join(root, 'data'))) for (const d of fs.readdirSync(path.join(root, 'data'), {withFileTypes: true}))
  if (d.isDirectory()) TFILES[d.name] = walk('data/' + d.name).sort();
const gen = '/* GEN:start (tools/bump.js пересобирает этот блок сам: списки файлов) */\nconst CORE_FILES = ' + JSON.stringify(CORE) + ';\nconst TFILES = ' + JSON.stringify(TFILES) + ';\n/* GEN:end */';

/* размеры переводов (байты) для вкладки «Офлайн» — вписываются в js/offline.js */
const SIZES = {};
for (const k of Object.keys(TFILES)) SIZES[k] = TFILES[k].reduce((s, f) => s + fs.statSync(path.join(root, f)).size, 0);
{ const off = rd('js/offline.js'), off2 = off.replace(/\/\*GEN:sizes\*\/[\s\S]*?\/\*GEN:end\*\//, () => '/*GEN:sizes*/const SIZES=' + JSON.stringify(SIZES) + ';/*GEN:end*/');
  if (off2 !== off) fs.writeFileSync(path.join(root, 'js/offline.js'), off2); }

const h = crypto.createHash('sha1');
h.update(strip(rd('index.html')));
for (const f of files) { h.update(f); h.update(fs.readFileSync(path.join(root, f))); }
h.update(gen);
const build = h.digest('hex').slice(0, 10);

let sw = rd('sw.js');
const sw2 = sw.replace(/\/\* GEN:start[\s\S]*?\/\* GEN:end \*\//, () => gen).replace(/const BUILD = '[^']*';/, `const BUILD = '${build}';`);
let html = rd('index.html');
const html2 = strip(html).replace(/(<(?:script|link)[^>]*(?:src|href)="(?:css|js)\/[^"?]+)"/g, `$1?v=${build}"`);
if (sw2 !== sw) fs.writeFileSync(path.join(root, 'sw.js'), sw2);
if (html2 !== html) fs.writeFileSync(path.join(root, 'index.html'), html2);
console.log('BUILD', build, sw2 !== sw || html2 !== html ? '(обновлено)' : '(без изменений)', '· файлов интерфейса:', CORE.length, '· переводов:', Object.keys(TFILES).map(k => k + ':' + TFILES[k].length).join(' '));
