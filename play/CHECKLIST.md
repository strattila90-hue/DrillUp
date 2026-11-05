# Play-áruházba kerülés – lépésről lépésre (DrillUp Core Quest)

Az app kódja kész: PWA (manifest, service worker, maszkolható ikonok, offline), adatvédelmi oldal, két nyelv (HU/EN), képernyőképek, bolti szövegek. A Play-be egy **Trusted Web Activity (TWA)** csomagként kerül (az app a Vercel-en marad, a csomag csak a „keret"). A fiókot, a kulcsot és a feltöltést neked kell elvégezned.

## 0. Előfeltételek (egyszer)
1. **Állandó HTTPS-cím.** A Vercel-projekt domainje (pl. `https://drillup-core-quest.vercel.app`) vagy saját domain. A cím a Play-csomagba bekerül, később nehéz váltani → inkább saját domain.
2. **Google Play Console fiók** – play.google.com/console → „Create developer account", egyszeri 25 USD. Személyes fióknál: személyazonosság- és telefonszám-ellenőrzés. **Fontos:** 2023. november után létrehozott *személyes* fióknál az éles megjelenés előtt **zárt teszt kell: legalább 12 tesztelő, 14 napon át** (a szabály változhat – a Console mutatja az aktuálisat). Szervezeti fióknál ez nincs.
3. **Gép:** Node 18+ (Bubblewrap) vagy csak böngésző (PWABuilder).

## 1. A webes app végleges, éles helyen
1. A `main` ág automatikusan települ a Vercel-re. Nyisd meg az éles címet telefonon: telepíthető-e, működik-e offline (repülő üzemmód), mentés megmarad-e.
2. Ellenőrizd: `https://<DOMAIN>/manifest.webmanifest`, `https://<DOMAIN>/privacy.html`, `https://<DOMAIN>/.well-known/assetlinks.json` mind betöltődik (a Vercel-en a `.well-known` mappa is kiszolgálódik).
3. Chrome DevTools → Lighthouse → „Progressive Web App" – zöld legyen (telepíthető, SW, ikonok).

## 2. Az Android-csomag (AAB) elkészítése – két út
**A) PWABuilder (kényelmes):**
1. pwabuilder.com → add meg az éles URL-t → „Package for stores" → **Android** → „Google Play" opció.
2. Package ID: `hu.strattila90.corequest` · Name: `DrillUp Core Quest` · Launcher name: `Core Quest` · Version 5.16 / code 1 · „Signing key: New" (hagyd, hogy generálja).
3. Töltsd le a ZIP-et: benne az `.aab`, a **keystore + jelszó** (!!) és a kész `assetlinks.json`. **A keystore-t és a jelszavát mentsd el 2 helyre.**

**B) Bubblewrap (CLI):**
1. `npm i -g @bubblewrap/cli`
2. A `play/twa-manifest.json`-ban cseréld a `CSERÉLD_LE` részeket az éles domainre.
3. `bubblewrap init --manifest=https://<DOMAIN>/manifest.webmanifest` (kérdez: JDK/Android SDK letöltés → igen), majd `bubblewrap build` → `app-release-bundle.aab`.

## 3. Play Console – új alkalmazás
1. „Create app": név **DrillUp Core Quest**, alapnyelv magyar (vagy angol), „Game", „Free", nyilatkozatok kipipálása.
2. **Play App Signing: engedélyezd** (alapértelmezett). A feltöltött kulcs a *feltöltő-kulcs*, a Google a végleges aláírót kezeli.
3. **Digital Asset Links (kritikus):** Console → *Setup → App signing* → másold ki az **App signing key certificate SHA-256** ujjlenyomatot → írd be a `.well-known/assetlinks.json`-ba (`sha256_cert_fingerprints`), a csomagnév `hu.strattila90.corequest` → commit + push → ellenőrizd, hogy `https://<DOMAIN>/.well-known/assetlinks.json` elérhető. Ha ez hibás, az app böngészősávval nyílik meg (nem teljes képernyő). Az ellenőrző: developers.google.com/digital-asset-links/tools/generator.
4. **Store listing:** `play/STORE_LISTING.md` (magyar) és `play/STORE_LISTING.en.md` (angol) szövegei. Grafikák: ikon `icon-512.png`; feature graphic `play/feature-graphic-1024x500.png` (HU) / `play/feature-graphic-en-1024x500.png` (EN); telefon-képernyőképek `play/screens/s1–s5.png` (HU) és `play/screens-en/` (EN), 1080×1920.
5. **Adatvédelmi nyilatkozat URL:** `https://<DOMAIN>/privacy.html`.
6. **App content:** Data safety (nem gyűjt/oszt adatot, nincs fiók, nincs hirdetés), Content rating (IARC kérdőív → várhatóan PEGI 3), Target audience (13+ vagy „all ages" – nincs adatgyűjtés), Ads: nincs, News: nem, Government: nem.
7. **Nyelvek:** Main store listing → Manage translations → English (United States) hozzáadása, az angol szövegekkel és képekkel.

## 4. Tesztelés a megjelenés előtt
1. *Testing → Internal testing* → új release → töltsd fel az `.aab`-t → saját Gmail-fiókot add tesztelőnek → telepítsd a Play-ről.
2. Telefonon ellenőrizd: teljes képernyő (nincs böngészősáv), offline, hang, rezgés, tájolás, mentés megmarad frissítés után, nyelvváltás (Menü → Beállítások → Language).
3. Személyes fióknál: *Closed testing* → 12+ tesztelő (barátok, közösség), 14 nap → utána „Apply for production".
4. *Production* → release → ellenőrzés (általában 1–7 nap) → megjelenés.

## 5. Frissítések
- A játék tartalma a Vercel-en frissül (a Play-csomag nem kér új feltöltést). Új AAB csak akkor kell, ha a keretet (ikon, név, csomagbeállítás) változtatod: ilyenkor az `appVersionCode`-ot növeld eggyel.
- Minden játékfrissítésnél: `sw.js` gyorsítótár-név emelése, `VER` emelése, tesztek (`node tests/par.js 2`).

## Kompatibilitási összefoglaló
| Terület | Állapot |
|---|---|
| Android | TWA: Android 5.0+ (API 21), Chrome/WebView 80+ kell a játék kódjához – gyakorlatban Android 7+ frissített WebView-val |
| Play célszint | A Bubblewrap/PWABuilder a mindenkori előírt target API-t állítja – feltöltés előtt a Console jelzi, ha kevés |
| Képernyő | Telefon, álló; táblagépen is fut (nincs külön elrendezés) |
| Böngésző/PWA | Chrome (Android/desktop) teljes; Safari 13.1+ működik, iOS-en „Főképernyőhöz adás" (App Store külön út) |
| Offline | service worker, hálózat-első; első betöltés internetet kér |
| Mentés | helyi tároló – Play-ből telepítve külön tároló, mint a böngészőé: az exportálás/importálás viszi át |
| Nyelv | HU + EN (rendszernyelv alapján, Beállításokban váltható) |
| Jogosultság | nincs (nem kér engedélyt) |
