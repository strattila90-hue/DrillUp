# Önálló mobil app (Android APK / iOS)

Ez a mappa a játékot **önálló, internet nélkül is futó** natív appba csomagolja ([Capacitor](https://capacitorjs.com)).
A Play-es TWA-val ellentétben itt minden fájl az appban van, nem kell hozzá a Vercel-oldal.

A webes fájlokat (`index.html`, `js/`, `ui.css`, ikonok) a `copy-web.js` másolja be a `www/` mappába; a fájllistát a `sw.js` `A` listájából veszi.
Új modul felvételekor tehát elég a `sw.js`-t bővíteni (ezt a web miatt amúgy is meg kell tenni).

## APK letöltése
A legújabb: **https://github.com/strattila90-hue/DrillUp/releases/latest** → `CoreQuest-….apk`.
Telefonon: töltsd le → nyisd meg (értesítés, vagy Fájlok → Letöltések) → engedélyezd az „ismeretlen forrásból való telepítést” → Telepítés.

Minden `main`-re kerülő játékváltozásnál a GitHub Actions („Mobile build”) magától új kiadást készít (`v<VER>-b<sorszám>`), benne az APK, az iOS IPA és a `web-b<sorszám>.zip` frissítőcsomag.

## Frissítés a játékon belül
Menü → **Frissítés** gomb (rajta a verzió és a csomagszám, pl. `v5.18·12`):
1. megnézi a GitHub legújabb kiadását (`releases/latest`),
2. ha abban nagyobb sorszámú `web-bN.zip` van, letölti, és újraindítja vele a játékot – **a mentés megmarad**, újratelepítés nem kell.
Ha az új csomag nem indulna el rendben, a frissítő (Capgo updater, statisztika-küldés kikapcsolva) magától visszaáll az előzőre.

Új APK csak akkor kell, ha a natív keret változik (új Capacitor-plugin, ikon, jogosultság) – ilyenkor kézzel kell telepíteni.

### Saját aláíró kulcs (ajánlott, egyszer kell)
Kulcs nélkül a CI **debug** APK-t készít: telepíthető, de minden fordítás más kulccsal készül, ezért frissítéskor a régi appot előbb el kell távolítani (**a mentés is törlődik**, előtte: Menü → Beállítások → Adatok → Exportálás).
Állandó kulccsal az új APK egyszerűen felülírja a régit, és a mentés megmarad:

```
keytool -genkeypair -v -keystore corequest.keystore -alias corequest -keyalg RSA -keysize 2048 -validity 10000
base64 -w0 corequest.keystore > corequest.keystore.b64      # macOS: base64 -i corequest.keystore
```
GitHub → Settings → Secrets and variables → Actions → New repository secret:

| Secret | Érték |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | a `corequest.keystore.b64` tartalma |
| `ANDROID_KEYSTORE_PASSWORD` | a keystore jelszava |
| `ANDROID_KEY_ALIAS` | `corequest` |
| `ANDROID_KEY_PASSWORD` | a kulcs jelszava (ha ugyanaz, elhagyható) |

A keystore-t és a jelszót mentsd el biztos helyre – ha elveszik, a már telepített appot nem lehet frissíteni.
Ezzel a kulccsal a CI egy `.aab`-t is készít, ami **közvetlenül feltölthető a Google Play-be** (a TWA helyett is használható; a csomagnév ugyanaz: `hu.strattila90.corequest`).

## iOS
Az Apple nem engedi az APK-hoz hasonló szabad telepítést, ezért három út van:

| Út | Költség | Mit kapsz |
|---|---|---|
| **Főképernyőhöz adás (PWA)** – Safari → Megosztás → „Főképernyőhöz adás” | ingyenes | teljes képernyős, offline is működő app az ikonnal; ez a legegyszerűbb |
| **Sideload** – a CI által készített `CoreQuest-unsigned.ipa` (Actions → `ios` artifact) telepítése [Sideloadly](https://sideloadly.io) vagy [AltStore](https://altstore.io) segítségével, saját Apple ID-vel | ingyenes | valódi natív app; ingyenes Apple ID-vel 7 naponta újra kell aláírni (AltStore ezt automatikusan teszi) |
| **App Store / TestFlight** | Apple Developer Program, 99 USD/év | rendes terjesztés; Mac + Xcode: `npm ci && npm run sync`, majd `npx cap open ios` → Signing & Capabilities → Team → Product → Archive |

## Helyi fejlesztés
```
cd mobile
npm ci
npm run sync            # web-fájlok bemásolása + cap sync
npx cap open android    # Android Studio
npx cap open ios        # Xcode (csak macOS)
npm run assets          # ikonok/indítókép újragenerálása az assets/ mappából
```

## Natív sajátosságok
- Service worker nem fut az appban (nincs rá szükség, minden fájl helyben van).
- A natív kiegészítést a `shim/native-app.js` adja (csak az appba kerül): frissítés, rezgés (Haptics), megosztás (Share), mentés-exportálás fájlba (Dokumentumok/DrillUp + megosztás), a böngészős teljes képernyő kikapcsolása.
- A kijelző játék közben nem alszik el (Android: `FLAG_KEEP_SCREEN_ON`, iOS: `isIdleTimerDisabled`).
- Csak álló tájolás; az Android vissza-gomb a játék menüjét nyitja (a `js/native.js` kezeli).
- A mentés az app saját tárolójában van, külön a böngészőétől: átvitelhez Exportálás / Importálás.
