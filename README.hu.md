# DrillUp Core Quest

[🇬🇧 English](README.md) · 🇭🇺 Magyar

Fúrj le a Föld magjáig – 6 371 km – valós méterekben. Lánctalpas fúrógép, valódi földtani rétegek, hőmérséklet és nyomás, kopás és páncél, depó tehervonattal, ásványok, kövületek és gyűjthető filmes relikviák. Egyjátékos, offline is működik, nincs hirdetés, regisztráció vagy követés.

## Jellemzők
- **Valós léptékek**: talaj → kéreg → köpeny → külső mag → belső mag, a rétegek valósághű vastagságával (jobb oldali rétegtérkép).
- **Fejleszthető gép**: motorok (gőz → dízel → gázturbina → atom), páncél, 6 fúrófej-szint, generátor, kazán, zuhanófék mechanikus karokkal, hidraulikus felállító toronydaruval.
- **Depó és gazdaság**: kirakodás, tömörítés, tárolás, eladás tehervonattal. A raktártelep, a szalag, a vagonok és a mozdony **20. szintig** fejleszthető (legfeljebb a 20. szintig). Teherkikötő portáldarukkal, vasúti jelzők.
- **Felfedezés**: szeizmográf és szondák, olaj- és gázmezők, vulkánok, mobil geológiai labor, valós fúrás-történeti beszámolók, rejtett leletek.
- **Dicsőségfal**: 12 eredeti, kitalált filmes relikvia.
- **Nyelvek**: magyar és angol (Menü → Beállítások → Language; első indításkor angol az alapértelmezés).
- **PWA**: telepíthető, offline működik, a mentés az eszközödön marad.

## Futtatás / fejlesztés
Nincs build-lépés – statikus fájlok.
```
python3 -m http.server 8000      # majd http://localhost:8000
npm test                         # node tests/run.js  (böngésző nélkül)
node tests/par.js 2              # teljes tesztfutás 2 folyamaton (~3 perc)
```
Felépítés: `index.html` (mag + inline szkript) · `js/*.js` (funkciómodulok, sima script-tagek) · `ui.css` · `sw.js` (service worker, hálózat-első; új fájlnál bővítsd az `A` listát és emeld a `V` gyorsítótár-nevet) · `manifest.webmanifest` · `tests/`.

### Lokalizáció
A `js/i18n.js` fordítási réteg: angol nyelvnél a megjelenő szöveget (DOM-szöveg, címkék, vászonra rajzolt feliratok) a `js/i18n_en.js` szótára alapján cseréli (`"magyar szöveg": "English text"`). Ami nincs a szótárban, magyarul marad. Új szöveg: vedd fel a szótárba. A nyelv a `localStorage`-ban van (`du_lang`), nem a mentésben.

## Mentés
A böngésző helyi tárolójában. Menü → Beállítások → Adatok: rendszeresen **exportáld / importáld** a mentést.

## Kompatibilitás
Chrome / Android WebView 80+, Safari 13.1+. A `js/compat.js` pótolja az `Array.at`, `flat`, `flatMap` függvényeket régebbi motorokon. Érintés-központú, álló tájolás; rezgés, képernyő-ébrentartás és teljes képernyő csak ahol elérhető.

## Google Play
A Play-változat a hosztolt PWA köré épített Trusted Web Activity – lásd [`play/CHECKLIST.md`](play/CHECKLIST.md), [`play/STORE_LISTING.md`](play/STORE_LISTING.md), [`privacy.html`](privacy.html).

## Licenc / közreműködők
A játék minden tartalma és a filmes relikviák eredetiek, kitaláltak. Fejlesztő: strattila90.

## v5.18 újdonságok
- Kihagyható első indítási bemutató (a Beállításokból újraindítható); saját, eredeti háttérzene (hangerő a Beállításokban); helyi, önkéntes hibajelentés (másolható, sehová nem küldi el).
- Angol nyelven a pénznem USD ($) – csak a felirat változik, az értékek nem.
- A játék közbeni kisablakok kisebbek, kevésbé takarnak, jól látható piros ✕ gombbal zárhatók (a 👁 visszahozza).
- A főmenüben látszik a fúrógép, a gombok tömören alul vannak; a „Haza” gomb „Felszín” gomb lett (felfelé nyíl a talajhoz); az Ásványtár, a Tanterem és a vulkán-szövegek angolul is elérhetők.
- Napelemes tartalék-hajtás: a felszínen a gép mindig tud vízszintesen mozogni. Ha elfogy az üzemanyag, a tetején lévő napelemek által táplált elektromotorok viszik (lassan, csak nappal – éjjel reggelig várni kell).
