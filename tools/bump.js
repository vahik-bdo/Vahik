#!/usr/bin/env node
/* Автоверсия сайта. Запуск: node tools/bump.js
   1) считает хеш содержимого index.html, css/, js/, иконок и manifest
   2) вписывает его в sw.js (const BUILD) и в ?v= у локальных css/js в index.html
   Если файлы не менялись, хеш тот же и ничего не перезаписывается. */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = path.resolve(__dirname, '..');
const rd = f => fs.readFileSync(path.join(root, f), 'utf8');
const strip = h => h.replace(/(<(?:script|link)[^>]*(?:src|href)="(?:css|js)\/[^"?]+)\?v=[^"]*"/g, '$1"');
const walk = d => fs.existsSync(path.join(root, d)) ? fs.readdirSync(path.join(root, d), {withFileTypes: true}).flatMap(x => x.isDirectory() ? walk(d + '/' + x.name) : [d + '/' + x.name]) : [];
const files = ['manifest.webmanifest', ...walk('css'), ...walk('js'), ...walk('icons')].sort();
const h = crypto.createHash('sha1');
h.update(strip(rd('index.html')));
for (const f of files) { h.update(f); h.update(fs.readFileSync(path.join(root, f))); }
const build = h.digest('hex').slice(0, 10);

let sw = rd('sw.js');
const sw2 = sw.replace(/const BUILD = '[^']*';/, `const BUILD = '${build}';`);
let html = rd('index.html');
const html2 = strip(html).replace(/(<(?:script|link)[^>]*(?:src|href)="(?:css|js)\/[^"?]+)"/g, `$1?v=${build}"`);
if (sw2 !== sw) fs.writeFileSync(path.join(root, 'sw.js'), sw2);
if (html2 !== html) fs.writeFileSync(path.join(root, 'index.html'), html2);
console.log('BUILD', build, sw2 !== sw || html2 !== html ? '(обновлено)' : '(без изменений)');
