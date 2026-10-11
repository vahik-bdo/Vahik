# Новый Завет

Сайт и приложение (PWA) для чтения Нового Завета: четыре перевода (рус, англ, арм, нем), избранное, молитвы, звуки природы, работает офлайн.
Открывать нужно `index.html`; на GitHub Pages сайт лежит по адресу из файла `CNAME`.

## Структура (папки должны лежать так, как здесь)
```
index.html            страница
sw.js                 офлайн-режим (service worker). При каждом обновлении сайта поднимайте VERSION в первой строке
manifest.webmanifest  данные приложения (имя, иконки, цвета)
.nojekyll             нужен GitHub Pages, чтобы отдавалась папка .well-known
.well-known/assetlinks.json   связывает сайт с Android-приложением (убирает адресную строку в приложении)
app/vahik.apk         Android-приложение для скачивания (кнопка «Установить» на сайте)
icons/                иконки приложения
css/
  base.css, reader.css, layout.css, fixes.css, effects.css (появление текста и блюр по краям),
  perf.css (облегчение и режим lite), cross.css (маска креста), likes.css, torch.css, tour.css,
  preface-modal.css, translation-guide.css, armenian.css, contact.css
js/
  app.js          ядро: настройки, темы, звуки, погода
  soundscape.js   живые звуки природы и атмосферы (дождь, камин, хор, пианино, метель)
  reader.js       читалка, избранное, толкования
  perf.js         автоматический режим lite для слабых устройств (?lite=1 / ?lite=0)
  scroll-reveal.js, scroll-blur.js, smooth-scroll.js, torch.js, tour.js, preface-gate.js,
  install.js (кнопка установки), contact.js (Telegram @vahe100), ready.js
data/                 тексты переводов (грузится только выбранный язык)
assets/audio/         записи ветра, птиц и грома
```

## Что где менять
- Блюр по краям: `--blur-edge`, `--blur-scroll` в начале `css/base.css`; количество слоёв — `N` в `js/scroll-reveal.js`.
- Telegram: `js/contact.js` (константы `URL_` и `H`) и ссылка в футере `index.html`.
- Звуки: каждая сцена — отдельный блок в `js/soundscape.js`; чтобы вернуть старые звуки, уберите этот файл из `index.html`.
- Режим lite принудительно: добавьте к адресу `?lite=1`; сбросить — `?lite=0`.
