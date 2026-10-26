# Lektion 6: SPA-Konzepte – Komponenten, Zustand, Routing und Rendering

Tag 2, 105 Minuten inklusive Übung und Besprechung.

## Ziel der Lektion

Die Teilnehmenden verstehen die tragenden Konzepte moderner Frontend-Frameworks unabhängig vom konkreten Framework. Sie ordnen Zustand nach Verantwortung ein, verstehen clientseitiges Routing und treffen eine begründete Rendering-Entscheidung. Einen Nutzerablauf prüfen sie mit Playwright aus Sicht der Nutzer.

## Themen

- **Architektur einer SPA:** zustandsbehafteter Client im Browser, API im Backend; Aufteilung der Verantwortung; Backend for Frontend als Variante.
- **Warum (und wann nicht) eine SPA:** Interaktivität und Benutzererlebnis gegenüber Komplexität, verteiltem Zustand und Ladezeit; interne Fachanwendung gegenüber öffentlicher Inhaltsseite.
- **Komponenten:**
  - Darstellung und Verhalten gekapselt; Eingaben (Props/Inputs) und Ausgaben (Events/Callbacks).
  - Datenfluss nach unten, Ereignisse nach oben.
  - Komponenten schneiden: Präsentation gegenüber Containern, Wiederverwendung mit Augenmass.
- **`UI = f(state)`:** deklarative Darstellung; Reaktivität als Mechanismus, Zustandsänderungen in die UI zu bringen; Überblick über Ansätze (Virtual DOM, Signals, Fine-Grained Reactivity).
- **Zustand nach Verantwortung einordnen:**
  - Lokaler UI-Zustand (offen/geschlossen, Eingabefeld).
  - Gemeinsamer Client-Zustand (z. B. Auswahl über mehrere Komponenten).
  - Serverdaten als Cache mit Laden, Fehler, Aktualität (Bezug zu TanStack Query, Angular Resource und Ähnlichem).
  - URL-Zustand (Filter, Seite, ausgewählte Ressource).
  - Abgeleiteter Zustand wird berechnet, nicht gespeichert.
- **Fachliche Logik ausserhalb der Komponenten:** reine Funktionen und Module, die ohne UI testbar sind.
- **Clientseitiges Routing:** URL als Zustand; Deep Links, Lesezeichen, Zurück-Button; History API gegenüber Hash-Routing; Routenparameter; Server-Konfiguration für SPA-Fallback.
- **Rendering-Strategien:** CSR, SSR, SSG und Hydration; Zusammenhang von Routing, Datenbeschaffung und Rendering; Client-/Server-Grenze in Meta-Frameworks; aus einer Framework-Empfehlung folgt kein SSR-Zwang.
- **Framework-Einordnung:** Angular, React und Vue – Gemeinsamkeiten (Komponenten, Zustand, TypeScript, npm-Ökosystem) und Unterschiede (Komplettframework gegenüber Bibliothek, Templates gegenüber JSX, Reaktivitätsmodell); Entscheidungskriterien statt Ranking.
- **Gleiches Konzept, andere API:** dieselbe Übung in React, Angular und Vue; URL-Zustand, abgeleiteter Zustand und Routenparameter in den drei Frameworks vergleichen.
- **Testing in diesem Block:**
  - Playwright aus Block 1 vertiefen: nutzernahe Locators (`getByRole`, `getByLabel`, `getByText`), Web-First Assertions, mehrere `webServer` und Projekte.
  - Einen Nutzerablauf prüfen: Navigation, Zustandswechsel, Anzeige nach dem Laden.
  - Abgrenzung: Unit-Test für Logik, Playwright für Abläufe.
  - Eine gemeinsame Playwright-Suite für drei Implementierungen zeigt, dass nutzernahe Tests das Verhalten unabhängig vom Framework prüfen.

## Bewusst nicht enthalten

- Popularitätskurven, Performance-Benchmarks und Framework-Kontroversen.
- Vollständige Einführung in ein oder mehrere Frameworks oder Meta-Frameworks.
- Globale State-Management-Bibliotheken im Detail (Redux, NgRx, Pinia).
- Komponententests mit Testing Library oder Vitest Browser Mode (höchstens Hinweis).

## Ausgangslage aus 2025

- Foliensatz [07-SPA-Concepts.pdf](../../../../modern-frontend-bsi-2025/00-CourseMaterial/07-SPA-Concepts.pdf): Architektur, Komponenten, Reaktivität, Routing und SSR weitgehend wiederverwendbar; Framework-Vergleich und Popularität stark kürzen.
- Starter `06-SPA/react-starter`, `06-SPA/angular-starter`, `06-SPA/vue-starter` sowie `06-SPA/full-stack/41-react-router-starter-finish` und `71-nextjs-demo-finish` als Demos.
- Testing-Folien zu Playwright aus [05-FrontendTooling.pdf](../../../../modern-frontend-bsi-2025/00-CourseMaterial/05-FrontendTooling.pdf), S. 38.
