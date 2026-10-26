# Lektion 4: TypeScript, Datenverträge, Laufzeitvalidierung und Zustandsmodellierung

Tag 1, 90 Minuten inklusive Übung und Besprechung.

## Ziel der Lektion

Die Teilnehmenden formulieren verständliche Typverträge und modellieren zulässige UI-Zustände. Sie unterscheiden statische Typprüfung von Laufzeitprüfung und validieren externe Daten an der Systemgrenze mit einem Schema. Unsichere Konstrukte wie `any`, Type Assertions und Non-Null Assertions erkennen sie im Review.

## Themen

- **Rolle von TypeScript:** JavaScript mit Typsyntax; Typen werden beim Build entfernt und existieren zur Laufzeit nicht.
- **Projektkonfiguration kompakt:** `strict`, `noUncheckedIndexedAccess`, `erasableSyntaxOnly`; warum Strenge sich lohnt.
- **Grundlagen zum Lesen und Schreiben:** Typinferenz, Grundtypen, Arrays, Objekttypen, optionale Properties, `readonly`.
- **Type Alias und Interface:** pragmatische Entscheidungsregel statt Grundsatzdiskussion.
- **Strukturelles Typsystem:** Kompatibilität nach Form, nicht nach Name.
- **Union-Typen und Literal-Typen:** `'idle' | 'loading'`; `as const` statt `enum`.
- **`any`, `unknown` und `never`:**
  - `any` schaltet die Prüfung ab und breitet sich aus.
  - `unknown` erzwingt eine Prüfung vor der Verwendung.
  - `never` für erschöpfende Fallunterscheidungen.
- **Narrowing:** `typeof`, `in`, `instanceof`, Vergleich auf Diskriminator, eigene Type Guards.
- **Diskriminierte Unions für Zustände:** `initial`, `loading`, `success`, `empty`, `error`; ungültige Kombinationen (z. B. gleichzeitig Daten und Fehler) werden unmöglich; Exhaustiveness-Check mit `never`.
- **Funktionstypen und Verträge:** Parameter- und Rückgabetypen an Modulgrenzen explizit; Inferenz im Inneren.
- **Typen ableiten:** `typeof`, `keyof`, indizierter Zugriff, `Pick`/`Omit`, `ReturnType` – nur so weit, wie für Verträge nötig.
- **Typen für Bibliotheken:** mitgelieferte Typen, `@types/*` und eigene Deklarationen in einem Satz.
- **Grenzen statischer Typen an Systemgrenzen:** `response.json()` liefert `any`; `as Customer` ist eine Behauptung, keine Prüfung.
- **Laufzeitvalidierung mit Zod:**
  - Schema definieren, Typ mit `z.infer` ableiten – eine Quelle der Wahrheit.
  - `parse` (wirft) gegenüber `safeParse` (Ergebnis als diskriminierte Union).
  - Fehlermeldungen auswerten und für Nutzer aufbereiten.
  - Einsatzorte: API-Antworten, Formulardaten, URL-Parameter, gespeicherte Daten.
- **Typen aus Backend-Verträgen generieren:** OpenAPI und vergleichbare Ansätze als Hinweis; auch generierte Typen ersetzen keine Laufzeitprüfung von unvertrauenswürdigen Daten.
- **Review-Checkliste:** `any`, `as`, `!`, `@ts-ignore`, zu breite Typen wie `string` statt Literal-Union.
- **Testing in diesem Block:** gültige und ungültige Eingaben, Grenzfälle und erwartete Fehler testen; was die Typprüfung abdeckt und was nur ein Laufzeittest belegt.

## Bewusst nicht enthalten

- Typakrobatik (Conditional und Mapped Types im Detail, Template Literal Types).
- Overloads, Decorators, Klassen-Modifikatoren im Detail.
- Historie und Popularität von TypeScript; Vergleich mehrerer Validierungsbibliotheken (ArkType, Valibot nur namentlich).
- Ausführliche Deklarationsdateien für Drittbibliotheken (jQuery-Übung von 2025).

## Ausgangslage aus 2025

- Foliensatz [02-TypeScript.pdf](../../../../modern-frontend-bsi-2025/00-CourseMaterial/02-TypeScript.pdf): Kompilierung, Setup, Typsystem-Folien und Runtime-Type-Checking mit Zod wiederverwendbar; Historie und Mythen stark kürzen.
- Übungsblatt [02-Exercise-TypeScript.md](../../../../modern-frontend-bsi-2025/00-CourseMaterial/02-Exercise-TypeScript.md): externe TypeScript-Übungen als Vertiefung für Zuhause; jQuery-Deklarationsübung entfällt.
- `04-web-platform/05-forms` (Formular mit Client-Validierung) als Anknüpfungspunkt für Schemavalidierung.
