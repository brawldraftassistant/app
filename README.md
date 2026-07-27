# Draft Assistant — Brawl Stars Ranked

An offline draft helper for Brawl Stars Ranked. It suggests picks based on role
counters, tier, map type, the role your team still needs, and current bans.
Everything runs locally in the browser — no server, no API calls, no tracking.

Installable as a PWA on Android, iOS and desktop.

**[Русская версия ниже ↓](#драфт-ассистент--brawl-stars-ranked)**

---

## Features

- 105 brawlers with roles, tiers and counter relationships
- Pick order 1-2-2-1-1-2, the real Ranked draft rhythm
- Modes, maps and map types (closed / mid / open)
- Rank mode: blind pick before Mythic, open draft after
- Bans, name search, role filters
- Warnings for gear-dependent brawlers, double-countered picks, tanks on the
  wrong map, bush maps, water paths
- 8 languages: Ukrainian, English, Spanish, Portuguese, Russian, Turkish,
  Arabic (RTL), German
- Works fully offline once loaded

## Files

```
index.html              the app itself
manifest.webmanifest    name, icons, colors, standalone mode
sw.js                   service worker — offline caching
icons/                  192/512, maskable, apple-touch, favicon
```

## Running it

A PWA needs **https** (or `localhost`). Opening `index.html` by double-clicking
will not work — the service worker won't register.

### GitHub Pages

1. Create a public repository and upload every file, including the `icons` folder.
2. **Settings → Pages → Source: Deploy from a branch → main → / (root) → Save**
3. After a minute the URL appears: `https://username.github.io/repo-name/`

### Netlify Drop

Open https://app.netlify.com/drop and drag the folder in. Sign up afterwards to
keep the site permanently.

### Local test

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Installing on a phone

- **Android / Chrome** — an install bar appears at the bottom, or use ⋮ → Install app
- **iPhone / Safari** — Share button → Add to Home Screen (iOS shows no automatic prompt)
- **Desktop / Chrome, Edge** — install icon in the address bar

Open the app online once so the service worker can cache everything, including
fonts. After that it works with no connection; a yellow badge appears at the top
when you're offline.

## Updating

After editing `index.html`, bump the version in `sw.js`:

```js
const VERSION = 'draft-v2';   // was draft-v1
```

Otherwise browsers keep serving the old cached copy.

---
---

# Драфт-ассистент — Brawl Stars Ranked

Офлайн-помощник для драфта в Brawl Stars Ranked. Подсказывает пик, опираясь на
контры по ролям, тир, тип карты, роль, которой не хватает команде, и текущие
баны. Всё считается локально в браузере — без сервера, без обращений к API,
без слежки.

Устанавливается как PWA на Android, iOS и компьютер.

## Возможности

- 105 бравлеров с ролями, тирами и связями контр
- Порядок пиков 1-2-2-1-1-2 — настоящий ритм драфта в Ranked
- Режимы, карты и типы карт (закрытая / средняя / открытая)
- Ранг: слепой пик до мифика, открытый драфт после
- Баны, поиск по имени, фильтры по ролям
- Предупреждения про бравлеров, которым нужны гаджеты и снаряжение, про пики,
  которые контрят сразу двое, про танков на неподходящей карте, про кустовые
  карты и проход по воде
- 8 языков: украинский, английский, испанский, португальский, русский,
  турецкий, арабский (RTL), немецкий
- Полностью работает офлайн после первой загрузки

## Файлы

```
index.html              само приложение
manifest.webmanifest    название, иконки, цвета, режим standalone
sw.js                   service worker — кеширование для офлайна
icons/                  192/512, maskable, apple-touch, favicon
```

## Как запустить

PWA требует **https** (или `localhost`). Просто открыть `index.html` двойным
кликом не получится — service worker не зарегистрируется.

### GitHub Pages

1. Создай публичный репозиторий и загрузи все файлы, включая папку `icons`.
2. **Settings → Pages → Source: Deploy from a branch → main → / (root) → Save**
3. Через минуту появится адрес: `https://ник.github.io/название-репозитория/`

### Netlify Drop

Открой https://app.netlify.com/drop и перетащи папку туда. Потом
зарегистрируйся, иначе сайт удалится через несколько часов.

### Локальная проверка

```bash
python3 -m http.server 8000
```

Дальше открыть `http://localhost:8000`.

## Установка на телефон

- **Android / Chrome** — снизу появится панель установки, либо меню ⋮ → «Установить приложение»
- **iPhone / Safari** — кнопка «Поделиться» → «На экран «Домой»» (iOS автоматическую панель не показывает)
- **Компьютер / Chrome, Edge** — иконка установки в адресной строке

Открой приложение один раз с интернетом, чтобы service worker закешировал всё,
включая шрифты. После этого оно работает без сети; сверху появляется жёлтая
пометка, когда соединения нет.

## Обновление

После правок в `index.html` подними версию в `sw.js`:

```js
const VERSION = 'draft-v2';   // было draft-v1
```

Иначе браузер продолжит отдавать старую копию из кеша.
