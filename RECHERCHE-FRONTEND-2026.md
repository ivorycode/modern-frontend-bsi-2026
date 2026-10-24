# Frontend-Lehrprioritäten für die Schulung 2026

Stand: **24.10.2026**. Grundlage: der dokumentierte Zweitageskurs 2025 und die unten verlinkten Primärquellen. Die Aussagen unter **Quellenbefund** beschreiben dokumentierte Eigenschaften; **Lehrentscheidung** bezeichnet meine didaktische Empfehlung. Dokumentation belegt hier technische Fähigkeiten und Grenzen, keine allgemeine Produktivitätssteigerung durch Coding Agents.

## 1. TypeScript bleibt Grundlage für die Beurteilung von Code

**Quellenbefund:** Type Assertions werden bei der Übersetzung entfernt und führen keine Laufzeitprüfung durch. Ein `as Customer` macht eine unbekannte API-Antwort somit nicht zu geprüften Kundendaten. Das TypeScript-Handbuch erläutert diese Grenze ausdrücklich. [TypeScript: Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

**Lehrentscheidung: Vertiefen.** Der Schwerpunkt sollte auf lesbaren Verträgen, `unknown`, Narrowing, diskriminierten Unions sowie strikter Typprüfung liegen. Die Teilnehmenden sollen erkennen, wann generierter Code mit `any`, Assertions oder Non-Null Assertions Unsicherheit versteckt. Komplexe Typakrobatik, Decorators und das Auswendiglernen aller Hilfstypen erhalten weniger Zeit. Als Übung eignet sich eine scheinbar funktionierende Datenabfrage, deren typisierte Antwort tatsächlich ungültig ist.

## 2. Laufzeitvalidierung wird eine praktische Pflichtübung

**Quellenbefund:** Zod validiert Eingaben anhand eines Schemas. `parse()` liefert gültige Daten oder wirft einen Fehler; `safeParse()` liefert eine diskriminierte Union aus Erfolgs- und Fehlerfall. Statische Typen lassen sich aus dem Schema ableiten. [Zod: Basic usage](https://zod.dev/basics)

**Lehrentscheidung: Vertiefen.** Die 2025 bereits erwähnte Laufzeitvalidierung sollte praktisch durchgeführt werden: API-Antworten, Formulare oder gespeicherte Daten prüfen, Validierungsfehler darstellen und Tests mit ungültigen Eingaben schreiben. Ein einziges Schemawerkzeug reicht. Der Lerngewinn liegt an der Systemgrenze und im Fehlerverhalten, nicht im Vergleich zahlreicher Bibliotheken. Ein durch einen Agenten erzeugtes Interface allein erfüllt den Datenvertrag nicht.

## 3. Browser- und Async-Grundlagen bleiben unverzichtbar

**Quellenbefund:** `fetch()` liefert eine Response auch für HTTP-Fehler wie 404; solche Statuscodes führen für sich genommen nicht zur Ablehnung des Promise. Die MDN-Dokumentation zeigt die Prüfung von `response.ok`, die asynchrone Verarbeitung des Bodys und den Request-Abbruch. Das Fetch-Modell einschliesslich CORS ist im WHATWG-Standard definiert. [MDN: Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch), [WHATWG: Fetch Standard](https://fetch.spec.whatwg.org/)

**Lehrentscheidung: Beibehalten und praktisch schärfen.** `async`/`await`, Fehlerpfade, Parallelität, Abbruch und veraltete Suchantworten sind relevanter als eine längere Callback-Historie. Die Teilnehmenden untersuchen Requests, Timing und Fehler im Browser. jQuery-AJAX und mehrere HTTP-Clients können entfallen; ein kurzer Legacy-Hinweis genügt. Streaming ist eine passende optionale Vertiefung für inkrementelle Antworten.

## 4. Accessibility gehört in die Abnahmekriterien

**Quellenbefund:** Nach W3C liefert `role="button"` allein kein erwartetes Tastaturverhalten. Formulare benötigen korrekt zugeordnete Beschriftungen. Playwright kann mit axe bestimmte Barrieren automatisch finden; seine Dokumentation betont zusätzlich manuelle und inklusive Tests. [W3C: ARIA-Prinzipien](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/), [W3C: Form labels](https://www.w3.org/WAI/tutorials/forms/labels/), [Playwright: Accessibility testing](https://playwright.dev/docs/accessibility-testing)

**Lehrentscheidung: Neu als verbindlicher Schwerpunkt aufnehmen.** Semantisches HTML, sichtbarer Fokus, Tastaturbedienung, Labels und verständliche Fehlermeldungen anhand eines Formulars üben. Einen automatisch bestandenen Scan als begrenzten Nachweis einordnen. Für generierte Oberflächen muss die Aufgabenbeschreibung solche Anforderungen bereits enthalten; anschliessend prüfen die Teilnehmenden das tatsächliche Verhalten.

## 5. Tests werden vom Überblick zum Arbeitsinstrument

**Quellenbefund:** Playwright empfiehlt Tests des für Nutzer sichtbaren Verhaltens, isolierte Testfälle und robuste, nutzernahe Selektoren. Vitest kann Tests nativ im Browser ausführen und unter anderem Playwright als Provider verwenden. [Playwright: Best Practices](https://playwright.dev/docs/best-practices), [Vitest: Browser Mode](https://vitest.dev/guide/browser/)

**Lehrentscheidung: Deutlich vertiefen.** Statt Testing nur auf Folien einzuordnen: eine Validierungsregel mit Vitest prüfen und einen vollständigen Formularablauf mit Playwright absichern. Die Anforderungen liefern die erwarteten Ergebnisse. Generierte Tests müssen fachlich geprüft werden; ein grüner Test ist nur so aussagekräftig wie seine Assertions. Ein absichtlich eingebauter Fehler demonstriert, ob die Prüfung tatsächlich anschlägt. Abdeckung als alleinige Qualitätskennzahl vermeiden.

## 6. SPA bleibt relevant; Rendering wird eine Architekturentscheidung

**Quellenbefund:** React empfiehlt für neue vollständige Anwendungen grundsätzlich ein Framework, erlaubt aber einen Start ohne Framework bei passenden Anforderungen oder zum Lernen. Die empfohlenen Frameworks unterstützen auch CSR, SPAs und statische Ausgabe; Serverfunktionen können je Route hinzukommen. Routing, Datenbeschaffung und Codeaufteilung hängen zusammen. [React: Creating a React App](https://react.dev/learn/creating-a-react-app), [React: Build from Scratch](https://react.dev/learn/build-a-react-app-from-scratch)

**Lehrentscheidung: Beibehalten und anders gewichten.** CSR, SSR, SSG und Hydration konzeptionell vergleichen; UI-Zustand, Serverdaten und Client-/Server-Grenzen explizit machen. Keine vollständige Einführung in mehrere Meta-Frameworks. Eine einfache Entscheidung anhand von interner Fachanwendung versus öffentlicher Inhaltsseite ist wertvoller als ein Framework-Ranking. Reacts Empfehlung ist keine allgemeine Vorschrift für Angular oder Vue.

## 7. Tooling verstehen, Werkzeugkatalog kürzen

**Quellenbefund:** Vite dokumentiert einen Entwicklungsserver mit HMR und einen gesonderten Produktionsbuild. Der Kern ist frameworkunabhängig und über Plugins erweiterbar. Die aktuelle Dokumentation beschreibt Rolldown für Produktionsbundles. [Vite: Getting Started](https://vite.dev/guide/), [Vite: Philosophy](https://vite.dev/guide/philosophy)

**Lehrentscheidung: Komprimieren und aktualisieren.** Ein vorbereiteter Stack mit reproduzierbarer Installation, Typprüfung, Linting, Tests und Build genügt. Die aktuelle Build-Architektur kurz erklären; die 2025 verwendete Zuordnung zu esbuild und Rollup vor Wiederverwendung prüfen. Entscheidend ist, dass Menschen und Agents dieselben überprüfbaren Projektbefehle verwenden. Mehrere Paketmanager und Bundler brauchen keinen praktischen Vergleich.

## 8. RxJS gezielt statt pauschal streichen

**Quellenbefund:** Angular dokumentiert Signals für reaktiven Zustand und explizite Brücken zwischen Signals und RxJS. `toSignal()` abonniert einen Observable und stellt dessen aktuellen Wert bereit; standardmässig wird die Subscription mit dem betreffenden Kontext aufgeräumt. [Angular: Signals](https://angular.dev/guide/signals), [Angular: toSignal](https://angular.dev/api/core/rxjs-interop/toSignal), [Angular: toObservable](https://angular.dev/api/core/rxjs-interop/toObservable)

**Lehrentscheidung: Zielgruppenabhängig kürzen.** In einem allgemeinen Zweitageskurs reichen die Unterschiede zwischen Zustand, Einzelresultat und Ereignisstrom. Operatorenkataloge und Subjects werden Zusatzmaterial. Bei Angular-lastigen Projekten bleiben Abbruch, `switchMap`, Fehlerbehandlung und Subscription-Lebensdauer dagegen Kernstoff. Signals sind kein allgemeiner Ersatz für asynchrone Streams.
