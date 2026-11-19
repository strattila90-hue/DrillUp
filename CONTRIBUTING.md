# Contributing

## English
Thanks for helping out! DrillUp Core Quest is a static web game (no build step).

- **Run locally:** `python3 -m http.server 8000`, then open http://localhost:8000
- **Check before a PR:** `npm test` (headless Node tests, no browser needed) and `node check.js`. A full run: `node tests/par.js 2` (~3 min).
- **Style:** plain JavaScript, no framework or bundler. Feature modules live in `js/*.js` and are loaded as plain script tags. New files must be added to the script list in `index.html` and to the cache list `A` in `sw.js`; bump the cache name `V` in `sw.js` and `VER` in `index.html` on every release.
- **Texts:** the game is written in Hungarian; English comes from the dictionary in `js/i18n_en.js` / `js/i18n_en2.js` (`"hungarian text": "English text"`). Add both when you add a visible string.
- **Pull requests:** fork, create a branch, keep the change small and focused, describe what and why, and make sure the tests pass. Issues labelled `good first issue` are a good start.

## Magyar
Köszönjük a segítséget! A DrillUp Core Quest statikus webes játék (nincs build-lépés).

- **Helyi futtatás:** `python3 -m http.server 8000`, majd http://localhost:8000
- **PR előtt:** `npm test` (böngésző nélküli Node-tesztek) és `node check.js`. Teljes futás: `node tests/par.js 2` (~3 perc).
- **Stílus:** sima JavaScript, keretrendszer és csomagoló nélkül. A funkciómodulok a `js/*.js` fájlokban vannak, sima script-tagekkel. Új fájlt vegyél fel az `index.html` szkriptlistájába és az `sw.js` `A` listájába; minden kiadásnál emeld az `sw.js` `V` gyorsítótár-nevét és az `index.html` `VER` értékét.
- **Szövegek:** a játék magyarul íródott; az angolt a `js/i18n_en.js` / `js/i18n_en2.js` szótár adja (`"magyar szöveg": "English text"`). Új látható szövegnél mindkettőt add meg.
- **Pull request:** fork, új ág, kicsi és célzott változtatás, leírás (mit és miért), a tesztek menjenek át. A `good first issue` címkéjű feladatok jó kezdőpontok.
