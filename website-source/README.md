# Goblin Services

Reszponzív, animált, fekete–piros termékbemutató és értékesítési weboldal React, TypeScript és Vite használatával. A szövegek a megadott angol termékleírások alapján készültek.

A forráskód ebben a `website-source/` mappában található. Klónozás után a repó gyökeréből lépj be ide; tárhely-beállításnál a projekt gyökérmappája `website-source`, a build kimenete `dist`.

## Indítás

Node.js 22 vagy újabb és npm szükséges. Az elkészült környezetben Node.js 24 használatával ellenőrizve.

```sh
cd website-source
npm ci
npm run dev
```

A fejlesztői szerver alapértelmezett portja `5173`. Nincs szükség adatbázisra, API-kulcsra vagy külön háttérszolgáltatásra. A betűtípusokat és képeket az oldal helyben szolgálja ki, külső font- vagy kép-CDN nélkül.

## Éles verzió

```sh
npm run build
npm run preview
```

A publikálható statikus weboldal a `dist/` mappába kerül. A tárhelyen a buildparancs `npm run build`, a kimeneti mappa `dist`. Az alkalmazás a domain gyökerében történő kiszolgálásra van beállítva. A build nem publikál automatikusan, és nem módosít DNS-beállításokat.

## Tartalom és linkek módosítása

- `src/config.ts`: Discord-meghívó és Sellhub-áruház URL. A Discord-link a kérésnek megfelelően **példa**: `https://discord.gg/example`; éles indulás előtt cserélendő.
- `src/data/products.ts`: az öt termék, a 23 licencopció, az összes ár, funkció, kompatibilitási információ és státusz.
- `src/App.tsx`: főoldali szövegek, navigáció és gyakori kérdések.
- `src/styles.css`: színek, elrendezés, animációk és mobilos megjelenés.

A **Purchase now** gomb a `https://goblinservices.sellhub.cx` áruházba vezet. A licencválasztó a weboldalon a megfelelő árat mutatja; a terméket és a licencet az áruházban is ki kell választani. Nem feltételezünk nem dokumentált Sellhub checkout-paramétereket.

A státuszok a kérés szerinti, kézzel megadott **Undetected** értékek. Nincs automatikus ellenőrzés, lekérdezés vagy külső státusz API. A forrásukat az oldal is megjelöli. Módosításhoz a termékadatokat kell szerkeszteni, majd új buildet publikálni.

## Feltöltött képek

A repó eredeti képei változatlanul megmaradtak. Az oldal optimalizált WebP-változatokat használ a `public/assets/` mappából:

| Eredeti fájl | Felhasználás |
| --- | --- |
| `standard_1.gif` | Animált G logó a fejlécben, a betöltőképernyőn és a közösségi szekcióban |
| `1ebb03ad-9839-4145-91d7-24d23faa86d6.png` | Fortnite Private |
| `b0b53d9c-57d1-44ef-91f0-60d52eec3e6d.png` | Fortnite Slotted |
| `b7b72992-1111-484a-a9e8-d489f0a2a8ed.png` | Valorant ColorBot |
| `e580b26b-5b2f-4fd3-893a-00584fcd2029.png` | Permanent Spoofer |
| `e40cabf9-a007-43b3-aa85-8723b9a1950e.png` | Temporary Spoofer |

A nyitó szekció letisztult fekete–vörös fényátmenetet kapott, finoman változó fénnyel és lassan felfelé szálló, visszafogott parázsszemcsékkel. A fejlécben és a termékeknél a feltöltött márkaanyagok szerepelnek. A csökkentett mozgást kérő felhasználók számára a logó állókép, a parallax, a részecskék és a mozgó effektek kikapcsolnak.

## Ellenőrzés

```sh
npm run typecheck
npm run build
```

Automatizált asztali és mobilos böngészőtesztek:

```sh
npx playwright install chromium
npm run test:e2e
```

Ha a rendszerben már van Chromium, külön böngészőletöltés helyett:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e
```

A tesztek ellenőrzik a képek betöltését, a kategóriaszűrést, mind a 23 licenc árát és kiválasztását, a termékablakokat, a kompatibilitási füleket, a státuszokat, a mobilmenüt, a FAQ-t, a billentyűzetes kezelést és a csökkentett mozgás beállítását.
