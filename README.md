# Vahik — New Testament reader

Static HTML, CSS and JavaScript. No bundler, Node packages, backend or build step is required. Deploy the entire repository, including `assets/` and `data/`, to a static host such as GitHub Pages. Keep `CNAME` when publishing to the existing custom domain.

## Develop

```sh
cd /workspace/Vahik
python3 -m http.server 8000 --bind 127.0.0.1
```

Use HTTP rather than opening `index.html` as a file: the reader fetches translation JSON. A failed download shows a retry button. Only the selected language is fetched; switching languages releases the previous translation object. Browser HTTP caching can reuse downloaded files according to the host's cache policy. Search and favorites use the active translation locally.

## Structure

- `index.html`: page structure, controls, contact footer and tiny initial theme scripts.
- `assets/css/`: base, reader, interface, translation guide, favorites, torch, reveal, preface and tour styles. `comfort.css` sets the shared moderate blur and keeps the reading surface crisp while scrolling.
- `assets/js/`: application controllers, reader, effects, scrolling, preface, tour, startup and localized contact label.
- `data/translations/{ru,en,hy,de}.json`: original translation texts, loaded by selected language.
- `assets/audio/`: wind, birds and thunder, fetched only when used.
- `assets/images/`: shared cross mask.
- `tests/smoke.py`: desktop/mobile browser checks, including translation requests and retry behavior.

Telegram contact: <https://t.me/vahe100>. Google Fonts is optional; system fonts are used when unavailable. Commentary links use bible.by.

Particle painting is capped at about 30 frames per second, with the existing adaptive particle counts. Disabled and hidden effects skip painting; the progress bar updates only during scrolling/easing. Reduced-motion preferences disable default particles. Panel blur is 8 px on desktop and 6 px on mobile; modal backgrounds use 6 px.

## Validate

With the server running, and Python Playwright and Chromium installed:

```sh
python3 tests/smoke.py
```

The checks cover language changes, chapter navigation, search, persistent favorites, Telegram contact, computed blur, reload, lazy audio/translation requests, and recovery after a failed translation download. On another machine adjust the Chromium executable path in the test if necessary.
