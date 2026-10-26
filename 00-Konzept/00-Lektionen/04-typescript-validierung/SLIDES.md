# Folienvorschlag: TypeScript, Datenverträge, Laufzeitvalidierung und Zustandsmodellierung

Erster Entwurf für etwa 40 Minuten Input. «2025: S. x» verweist auf [02-TypeScript.pdf](../../../../modern-frontend-bsi-2025/00-CourseMaterial/02-TypeScript.pdf).

## Einordnung

1. **Titel: TypeScript – Verträge, Zustände und Systemgrenzen**
2. **TypeScript ist JavaScript mit Typsyntax** – 2025: S. 2, 15–16.
3. **Typen verschwinden beim Build** – Ein Diagramm: `.ts` → Typprüfung (`tsc`) und Transformation (Vite) getrennt. 2025: S. 17, 26.
4. **Strikte Konfiguration** – relevante `tsconfig`-Optionen und warum. 2025: S. 32–33, aktualisiert auf TypeScript 6.

## Typen lesen und schreiben

5. **Inferenz zuerst, Annotationen an Grenzen** – Beispiele für sinnvolle und überflüssige Annotationen. 2025: S. 35–36.
6. **Objekttypen, optionale Properties, `readonly`** – 2025: S. 51.
7. **Type Alias oder Interface?** – eine Entscheidungsregel. 2025: S. 47, 50.
8. **Strukturelles Typsystem** – 2025: S. 46.
9. **Literal-Typen, Unions und `as const` statt `enum`** – 2025: S. 48–49.

## Unsicherheit sichtbar machen

10. **`any` gegenüber `unknown`** – 2025: S. 39–40.
11. **Narrowing** – `typeof`, `in`, Diskriminator, Type Guard. 2025: S. 41.
12. **Review: Wo versteckt sich Unsicherheit?** – Codeausschnitt mit `any`, `as`, `!`, `@ts-ignore`; Publikum findet die Stellen.

## Zustände modellieren

13. **Das Boolean-Chaos** – `isLoading`, `error`, `data` als unabhängige Felder: welche Kombinationen sind unsinnig? Anknüpfung an die Lade- und Fehleranzeige aus Block 3.
14. **Zustände statt Flags** – Zustandsdiagramm: initial → loading → success/empty/error.
15. **Diskriminierte Union** – Typdefinition und Verwendung mit `switch`.
16. **Erschöpfende Prüfung mit `never`** – neuer Zustand ergänzt, Compiler meldet fehlende Behandlung.

## Typen ableiten, kurz

17. **Typen aus Typen** – `typeof`, `keyof`, `Pick`, `ReturnType` an einem Beispiel. 2025: S. 52; S. 53 («Types can run Doom») höchstens als Pointe.

## Systemgrenzen und Laufzeitvalidierung

18. **Was weiss TypeScript über eine API-Antwort?** – `const data = await res.json()` ist `any`. 2025: S. 55–56.
19. **`as Customer` prüft nichts** – Live-Demo: falsches JSON, Absturz weit entfernt von der Ursache. Quelle: TypeScript Handbook.
20. **Wo kommen die Typen her?** – handgeschrieben, generiert aus OpenAPI, abgeleitet aus Schema. 2025: S. 57.
21. **Laufzeitprüfung: das klassische Problem** – doppelte Pflege von Typ und Prüfcode. 2025: S. 58–59.
22. **Zod: Schema als Quelle der Wahrheit** – Schema, `z.infer`, `parse`, `safeParse`. 2025: S. 60–61, auf Zod 4 aktualisieren.
23. **`safeParse` ist eine diskriminierte Union** – Brücke zu den Zuständen von Folie 15.
24. **Fehlermeldungen für Menschen** – Validierungsfehler pro Feld aufbereiten.
25. **Wo validieren?** – API-Antworten, Formulare, URL-Parameter, `localStorage`.

## Testing und Übung

26. **Was prüft der Compiler, was der Test?** – Tabelle: Typfehler, ungültige Laufzeitdaten, fachliche Regel.
27. **Tests für Validierung** – gültige Eingabe, ungültige Eingabe, Grenzfall, erwartete Fehlermeldung.
28. **Übung 4** – Verweis auf `EXERCISE.md`.
29. **Zusammenfassung** – Typen beschreiben Verträge, Schemas prüfen sie zur Laufzeit, Unions machen ungültige Zustände unmöglich.

## Aus 2025 nicht übernehmen

- Popularität, Historie, Alternativen und Mythen (S. 3–14, 18–31) bis auf eine Einstiegsfolie.
- Overloads (S. 43), Klassen-Details (S. 44–45), Decorators (S. 54).
