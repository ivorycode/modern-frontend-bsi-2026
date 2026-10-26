# Folienvorschlag: SPA-Konzepte – Komponenten, Zustand, Routing und Rendering

Erster Entwurf für etwa 45 Minuten Input. «2025: S. x» verweist auf [07-SPA-Concepts.pdf](../../../../modern-frontend-bsi-2025/00-CourseMaterial/07-SPA-Concepts.pdf).

## Architektur

1. **Titel: SPA-Konzepte – was alle Frameworks gemeinsam haben**
2. **Architektur einer SPA** – Browser-Client mit Zustand, API, Backend. 2025: S. 2–4.
3. **Die Rolle der API** – mehrere Clients, Backend for Frontend. 2025: S. 5–6.
4. **Warum eine SPA – und wann nicht?** – Abwägung. 2025: S. 7–9, zu einer Folie verdichtet.

## Komponenten und Zustand

5. **Komponenten statt Seiten** – Kapselung, Wiederverwendung. 2025: S. 10–12.
6. **Datenfluss** – Props/Inputs nach unten, Events nach oben; Komponentenbaum-Diagramm.
7. **`UI = f(state)`** – Zustand liegt in JavaScript, die UI folgt. 2025: S. 14.
8. **Reaktivität** – wie Frameworks Änderungen erkennen: Virtual DOM, Signals, Fine-Grained Reactivity. 2025: S. 13, 15–17.
9. **Nicht jeder Zustand ist gleich** – Tabelle: lokal, gemeinsam, Serverdaten, URL, abgeleitet; jeweils Beispiel und typischer Ort.
10. **Serverdaten sind ein Cache** – Laden, Fehler, Aktualität, Invalidierung; Bezug zu den Zuständen aus Block 4.
11. **Fachlogik gehört nicht in die Komponente** – reine Funktionen auslagern und unabhängig testen.
12. **Übungsfrage** – ein UI-Ausschnitt; das Publikum ordnet jedes Stück Zustand einer Kategorie zu.

## Routing

13. **Clientseitiges Routing** – URL ändert sich ohne Seitenwechsel. 2025: S. 18–20.
14. **History API gegenüber Hash-Routing** – 2025: S. 21.
15. **Die URL ist Zustand** – Deep Links, Filter in Query-Parametern, Zurück-Button.
16. **SPA-Fallback auf dem Server** – warum ein Reload auf `/items/42` einen 404 liefern kann.

## Rendering

17. **CSR, SSR, SSG, Hydration** – vier Diagramme oder eine Vergleichstabelle. 2025: S. 22–23.
18. **Meta-Frameworks und die Client-/Server-Grenze** – Next.js, React Router, Nuxt, Angular SSR, TanStack Start. 2025: S. 24–26, gekürzt.
19. **Entscheidung: Fachanwendung oder Inhaltsseite?** – Entscheidungsbaum mit zwei Beispielen.
20. **Framework-Empfehlung heisst nicht SSR-Pflicht** – Zitat React-Dokumentation.

## Framework-Einordnung

21. **Angular, React, Vue: viele Gemeinsamkeiten** – 2025: S. 52.
22. **Die wichtigsten Unterschiede** – Komplettframework/Bibliothek/progressiv, Templates/JSX, Reaktivitätsmodell. 2025: S. 42–43.
23. **Kriterien für eine Technologieentscheidung** – Architektur, Team, Wartbarkeit, Stabilität, organisatorischer Kontext. 2025: S. 50–51, 54.
24. **Dasselbe Beispiel in drei Frameworks** – Ausschnitte aus den drei Übungsvarianten: Filter in der URL und abgeleitete Liste in React, Vue und Angular nebeneinander.
25. **Gleiches Konzept, andere API** – Tabelle: URL-Zustand, abgeleiteter Zustand, Routenparameter pro Framework; wird in der Besprechung mit den Lösungen der Teilnehmenden ergänzt.

## Testing und Übung

26. **Playwright aus Block 1 in einer Folie** – Rückblick: Browser automatisieren, Abläufe prüfen.
27. **Nutzernahe Locators** – `getByRole`, `getByLabel`, `getByText` statt CSS-Selektoren; Quelle Playwright Best Practices.
28. **Ein Ablauf über mehrere Seiten** – Liste, Detail, zurück; Web-First Assertions warten automatisch; API als zusätzlicher `webServer`.
29. **Ein Test, drei Frameworks** – dieselbe Playwright-Suite läuft gegen alle Varianten; nutzernahe Tests sind unabhängig von der Implementierung.
30. **Unit-Test oder Playwright?** – Testpyramide angepasst an Frontend-Projekte.
31. **Übung 6** – Verweis auf `EXERCISE.md`, Wahl der Variante.
32. **Zusammenfassung** – Zustand nach Verantwortung, URL als Zustand, Rendering als Entscheidung.

## Aus 2025 nicht übernehmen

- Popularität, Performance-Vergleiche und Kontroversen (S. 32–41, 44–49, 53): höchstens eine Backup-Folie.
