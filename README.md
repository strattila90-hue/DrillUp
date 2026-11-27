# DrillUp Core Quest

🇬🇧 English · [🇭🇺 Magyar](README.hu.md)

<p align="center"><img src="docs/demo.gif" alt="DrillUp Core Quest gameplay" width="320"></p>

<p align="center"><b><a href="https://drillup-seven.vercel.app">▶ Play now</a></b> &nbsp;·&nbsp; <b><a href="https://github.com/strattila90-hue/DrillUp/releases/latest/download/CoreQuest.apk">📱 Download APK</a></b></p>

<p align="center">

[![License: MIT](https://img.shields.io/github/license/strattila90-hue/DrillUp)](LICENSE)
[![Last commit](https://img.shields.io/github/last-commit/strattila90-hue/DrillUp)](https://github.com/strattila90-hue/DrillUp/commits)
[![Release](https://img.shields.io/github/v/release/strattila90-hue/DrillUp)](https://github.com/strattila90-hue/DrillUp/releases/latest)
[![Repo size](https://img.shields.io/github/repo-size/strattila90-hue/DrillUp)](https://github.com/strattila90-hue/DrillUp)
![PWA](https://img.shields.io/badge/PWA-installable-5a0fc8)
![No build step](https://img.shields.io/badge/build%20step-none-brightgreen)
[![Stars](https://img.shields.io/github/stars/strattila90-hue/DrillUp?style=social)](https://github.com/strattila90-hue/DrillUp/stargazers)

</p>

Drill down to the Earth's core – 6,371 km – in real meters. A tracked drilling machine, real geological layers, temperature and pressure, wear and armor, a depot with a freight train, minerals, fossils and collectible film relics. Single-player, offline-capable, no ads, no accounts, no tracking.

## Screenshots
<p><img src="docs/screenshot-menu.png" alt="Main menu" width="240"> &nbsp; <img src="docs/screenshot-drilling.png" alt="Drilling through the sediment layer" width="240"></p>

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
A standalone, fully offline Android APK / iOS build (Capacitor) is built by GitHub Actions – see [`mobile/README.md`](mobile/README.md). The Play build can be that AAB or a Trusted Web Activity wrapper around the hosted PWA – see [`play/CHECKLIST.md`](play/CHECKLIST.md), [`play/STORE_LISTING.md`](play/STORE_LISTING.md) and [`privacy.html`](privacy.html).

## Tech
Vanilla JavaScript, HTML5 canvas and CSS – no framework, no bundler, no runtime dependencies. Installable PWA with a service worker; the Android/iOS builds wrap the same files with Capacitor. Tests are plain Node scripts (`tests/`).

## Contributing
Bug reports, ideas and pull requests are welcome – see [CONTRIBUTING.md](CONTRIBUTING.md). Issues labelled `good first issue` are a good place to start.

## License / credits
Released under the [MIT License](LICENSE). All game content and the film relics are original and fictional. Developer: strattila90.

---
⭐ If you like it, please give it a star — it really helps!

## v5.20
- **New: SG-3 Russian superdeep drilling station** (modelled on the Kola Superdeep Borehole) at the surface base (🗼 button or tap the derrick). Drilling in stages: each stage is one stand (1–3 × 12 m pipes), then a new pipe must be made up – pipes have to be bought (aluminium LBT, steel, titanium). 5 derrick levels (BU-75 → Uralmash-15000, 15 km).
- Simplified real physics: buoyant string weight in mud, hook load, aluminium weakening with heat, fatigue, buckling, turbodrilling, cuttings and stuck pipe, bit wear and tripping. Overload causes a **pipe failure**: the string below stays in the hole and you sidetrack and drill again.
- Button controls (drill, make-up, bit change, weight on bit, mud flow, zoom), **automatic zoom onto the bit while drilling**, layer-coloured cross-section, real scientific milestones (microfossils, "no basalt", 180 °C, 12,262 m).
- Smoother rendering: lights come from pre-rendered sprites (no per-frame gradients), lower-resolution darkness layer; more vivid layer and sky colours.

## v5.19
- Main menu: a discreet "⭐ Star on GitHub" link.

## v5.18 additions
- Skippable first-run tutorial (replay from Settings); original background music (volume slider in Settings); local, opt-in error report (copy from Settings – nothing is sent anywhere).
- In English the in-game currency is shown as USD ($); only the label changes, values are unchanged.
- In-game windows are smaller/less intrusive and have a clear red ✕ close button (👁 brings them back).
- Main menu now shows the drilling machine with a compact button row; the "Home" button became a "Surface" button (arrow up to the ground); Mineral library, Classroom and volcano texts are available in English.
- Solar backup drive: on the surface the machine can always move horizontally. If the fuel runs out, solar panels on the roof power electric motors (slow, daytime only – at night wait for morning).

⭐ If you like it, please give it a star — it really helps!
