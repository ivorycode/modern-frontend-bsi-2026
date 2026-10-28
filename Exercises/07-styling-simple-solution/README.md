# Musterlösung zu Übung 7: ProfileCard mit CSS Modules und Tailwind

Aufgabe: [Übung 7](../07-styling-simple/README.md)

```sh
npm install
npm run dev
```

Seite: `http://localhost:5277/`

Prüfungen: `npm run check` und `npm run e2e`.

Aufgabe 1 steht in `src/exercise/ProfileCard.tsx` und `ProfileCard.module.css`, Aufgabe 2 in `src/exercise/ProfileCardTailwind.tsx`. Die Vertiefungen a (Container Query) und b (`:has()`) sind in beiden Fassungen umgesetzt; ihre Tests stehen in `e2e/vertiefung.spec.ts`. Grössen und Abstände in `ProfileCard.module.css` folgen der Skala von Tailwind, damit beide Karten bei jeder Fensterbreite identisch aussehen.
