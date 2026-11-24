#!/usr/bin/env node
/* Сборка для выкладки: node tools/build.js <папка-вывода>
   Копирует сайт в папку и склеивает все css/*.css в один css/app.css (порядок как в index.html, значит каскад тот же).
   Исходники в репозитории остаются раздельными, склейка делается только в выкладываемой копии.
   JS не склеивается: обычные скрипты делят глобальные переменные, и одна ошибка в общем файле остановила бы весь сайт.
   Дальше запускается node tools/bump.js <папка-вывода> (хеш версии). */
const fs = require('fs'), path = require('path');
const src = path.resolve(__dirname, '..'), out = path.resolve(process.argv[2] || '_site');
const SKIP = new Set(['.git', '.github', '_site', 'tools']);
fs.rmSync(out, {recursive: true, force: true});
(function copy(from, to) {
  fs.mkdirSync(to, {recursive: true});
  for (const e of fs.readdirSync(from, {withFileTypes: true})) {
    if (from === src && SKIP.has(e.name)) continue;
    const a = path.join(from, e.name), b = path.join(to, e.name);
    e.isDirectory() ? copy(a, b) : fs.copyFileSync(a, b);
  }
})(src, out);

const idx = path.join(out, 'index.html');
let html = fs.readFileSync(idx, 'utf8');
const re = /<link rel="stylesheet" href="(css\/[^"?]+\.css)(?:\?v=[^"]*)?">/g;
const list = [...html.matchAll(re)].map(m => m[1]);
if (list.length) {
  const css = list.map(f => '/* ' + f + ' */\n' + fs.readFileSync(path.join(out, f), 'utf8').trim()).join('\n');
  fs.writeFileSync(path.join(out, 'css/app.css'), css + '\n');
  let first = true;
  html = html.replace(re, () => { if (first) { first = false; return '<link rel="stylesheet" href="css/app.css">'; } return ''; });
  fs.writeFileSync(idx, html);
  for (const f of fs.readdirSync(path.join(out, 'css'))) if (f.endsWith('.css') && f !== 'app.css') fs.unlinkSync(path.join(out, 'css', f));
}
console.log('build →', out, '· css склеено:', list.length, 'файлов в css/app.css');
