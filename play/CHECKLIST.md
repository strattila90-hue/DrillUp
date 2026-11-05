# Play-áruházba kerülés – teendők

Az app kódja kész (PWA: manifest, service worker, maszkolható ikon, offline, adatvédelmi oldal, képernyőképek). A Play-be **Trusted Web Activity (TWA)** csomagként kerül, ezt a te fiókoddal és kulcsoddal kell elkészíteni – ezt én innen nem tudom megtenni.

1. **Fejlesztői fiók:** play.google.com/console, egyszeri 25 USD, személyazonosság-ellenőrzés. Új személyes fióknál a Play zárt tesztet kér (jelenleg ≥12 tesztelő, 14 napig) az éles megjelenés előtt.
2. **Állandó HTTPS-cím:** a Vercel-projekt domainje (jobb: saját domain). Ezt írd be a `play/twa-manifest.json`-ba (`CSERÉLD_LE`).
3. **Csomag építése:** PWABuilder (pwabuilder.com, URL megadása → Android → AAB letöltés) VAGY `npm i -g @bubblewrap/cli` → `bubblewrap init --manifest=https://<DOMAIN>/manifest.webmanifest` → `bubblewrap build`. Csomagnév javaslat: `hu.strattila90.corequest` (megjelenés után nem változtatható!).
4. **Aláírás:** Play App Signing-et kérd (ajánlott). A feltöltő-kulcs (keystore) mentsd el biztonságosan, elvesztése = nincs frissítés.
5. **Digital Asset Links:** a Play Console → App integrity → App signing → *SHA-256 ujjlenyomatot* másold be a `.well-known/assetlinks.json` fájlba (és a csomagnevet), majd deploy. Ha ez hibás, az app címsorral (böngészősávval) nyílik meg.
6. **Adatlap:** `play/STORE_LISTING.md` szövegei, adatvédelmi URL, Data safety, tartalom-besorolás, célközönség (13+ vagy minden korosztály – nincs adatgyűjtés).
7. **Teszt:** belső teszt sáv → saját telefonon telepítés → ellenőrizd: teljes képernyő, offline, hang, rezgés, mentés megmarad frissítés után.
8. **Verziók:** minden új feltöltéshez az `appVersionCode` növelendő (egész szám); a játék saját verziója (`VER`) külön.

## Ismert pontok
- Az app weboldalként frissül (Vercel), a Play-csomag csak a „keret" – a játékfrissítés nem kér újabb áruházi feltöltést.
- Az iOS App Store ehhez külön út (Capacitor/wrapper), nem része ennek.
