# DrillUp Core Quest

🇬🇧 English · [🇭🇺 Magyar](README.hu.md)

Drill down to the Earth's core – 6,371 km – in real meters. A tracked drilling machine, real geological layers, temperature and pressure, wear and armor, a depot with a freight train, minerals, fossils and collectible film relics. Single-player, offline-capable, no ads, no accounts, no tracking.

## Features
- **Real scale**: soil → crust → mantle → outer core → inner core, with realistic layer thicknesses (layer map on the right).
- **A machine you build**: engines (steam → diesel → gas turbine → nuclear), armor, 6 drill bit tiers, generator, boiler, emergency brake with mechanical arms, hydraulic erector with a tower crane.
- **Depot & economy**: unload the hold, compress, store, sell by freight train. Storage yard, conveyor, wagons and locomotive upgrade up to **level 20**. Freight port with gantry cranes and railway signals.
- **Exploration**: seismograph and probes, oil and gas fields, volcanoes, mobile geological lab, reports from real drilling history, hidden finds.
- **Hall of Fame**: 12 original, fictional film relics to dig up.
- **Languages**: Hungarian and English (Menu → Settings → Language; English is the default on first start).
- **PWA**: installable, works offline, your save stays on your device.

## Run / develop
No build step – static files.
```
python3 -m http.server 8000      # then open http://localhost:8000
npm test                         # node tests/run.js  (headless; no browser needed)
node tests/par.js 2              # full test run on 2 processes (~3 min)
```
Structure: `index.html` (core + inline script) · `js/*.js` (feature modules, loaded as plain script tags) · `ui.css` · `sw.js` (service worker, network-first; bump the cache name `V` and add new files to `A`) · `manifest.webmanifest` · `tests/`.

### Localization
`js/i18n.js` is a translation layer: when the language is English it replaces visible text (DOM text, labels, text drawn on canvas) using the dictionary in `js/i18n_en.js` (`"hungarian text": "English text"`). Texts that are not in the dictionary stay Hungarian. To add a string: add it to the dictionary and reload. The language is stored in `localStorage` (`du_lang`), not in the save.

## Save data
Stored in the browser's local storage. Menu → Settings → Data: **export / import** your save regularly.

## Compatibility
Chrome / Android WebView 80+ (optional chaining syntax), Safari 13.1+. A polyfill (`js/compat.js`) covers `Array.at`, `flat`, `flatMap` on older engines. Touch-first, portrait; vibration, wake lock and fullscreen are used only where available.

## Google Play
The Play build is a Trusted Web Activity wrapper around the hosted PWA – see [`play/CHECKLIST.md`](play/CHECKLIST.md), [`play/STORE_LISTING.md`](play/STORE_LISTING.md) and [`privacy.html`](privacy.html).

## License / credits
All game content and the film relics are original and fictional. Developer: strattila90.

## v5.18 additions
- Skippable first-run tutorial (replay from Settings); original background music (volume slider in Settings); local, opt-in error report (copy from Settings – nothing is sent anywhere).
- In English the in-game currency is shown as USD ($); only the label changes, values are unchanged.
- In-game windows are smaller/less intrusive and have a clear red ✕ close button (👁 brings them back).
