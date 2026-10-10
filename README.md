# Новый Завет — структура сайта

Открывать нужно `index.html`. Папки должны лежать рядом с ним (работает и локально, и на хостинге).

```
index.html            разметка страницы (всё, что видно)
css/
  cross.css           маска креста (тяжёлая картинка вынесена отдельно)
  base.css            основные стили и переменные (--blur, --blur-edge, --blur-scroll)
  reader.css          чтение Нового Завета
  fixes.css, polish.css, layout.css   правки и доводка
  likes.css, torch.css, tour.css, preface-modal.css, translation-guide.css, armenian.css
  contact.css         окно «Связаться»
js/
  app.js              ядро: настройки, темы, заметки, погода, звуки
  reader.js           читалка, поиск, толкования, избранное
  torch.js            режим факела
  scroll-reveal.js, scroll-blur.js, smooth-scroll.js
  preface-gate.js, tour.js, ready.js
  contact.js          кнопка и окно Telegram (@vahe100)
data/
  bible-cass.js (рус), bible-nasb.js (англ), bible-arar.js (арм), bible-elb.js (нем)
                      грузится ТОЛЬКО перевод выбранного языка
assets/audio/
  wind.js, birds.js, bolt.js   звуки, грузятся при первом нажатии
```

## Блюр
Всё в начале `css/base.css`:
- `--blur: 12px` — панели, окна, подложки (было 14–22px)
- `--blur-edge: 8px` — размытие у верхнего и нижнего края (было 14px)
- `--blur-scroll: 6px` — размытие при прокрутке (было 9px)
На телефонах значения автоматически на четверть меньше. Хочешь сильнее или слабее — меняй эти три числа.
Появление текста при прокрутке: `--svb` в `css/polish.css` (было 9px, стало 6px; на телефоне 4px).

## Контакт
Telegram: `@vahe100`. Меняется в `js/contact.js` (константы `URL_` и `H`) и в `index.html` (ссылка `#ctFoot`).
