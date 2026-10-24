# Themenüberblick: Modern Frontend Development 2025

Der Kurs «Modern Frontend Development – Welcome to the Jungle» vermittelte Grundlagen, Werkzeuge und Architekturkonzepte moderner Frontend-Entwicklung. Er verband JavaScript und TypeScript mit asynchroner Programmierung, Browser-APIs sowie einem Überblick über Styling und Frontend-Frameworks.

Grundlage dieser Übersicht sind die acht PDF-Foliensätze und vier Markdown-Übungsblätter im Verzeichnis [00-CourseMaterial des Kurses 2025](/Users/jonas/Dev/MyGithub/modern-frontend-bsi-2025/00-CourseMaterial). Die Übersicht beschreibt die in diesen Unterlagen dokumentierten Inhalte.

## Kursaufbau

Die [Agenda](/Users/jonas/Dev/MyGithub/modern-frontend-bsi-2025/00-CourseMaterial/00-Agenda.pdf) gliederte den Kurs in zwei Tage:

| Tag | Themen |
| --- | --- |
| Tag 1 | Modernes JavaScript, TypeScript, asynchrones JavaScript mit Callbacks, Promises und RxJS, Web Platform APIs |
| Tag 2 | Frontend-Build und Tooling, Styling-Mechanismen, Konzepte von Single Page Applications, Überblick über Angular, React und Vue, Einführung in Web Components |

## 1. Modernes JavaScript

### Funktionen, Gültigkeitsbereiche und Objekte

- Funktionsdeklarationen und Funktionsausdrücke, Hoisting sowie Arrow Functions.
- Funktionsargumente und das Options-Object-Pattern.
- Funktionen als Objekte und als Werte: Higher-Order Functions, Callbacks, partielle Anwendung und Funktionskomposition.
- Verschachtelte Funktionen, Scope und Closures.
- Objekte und Klassen: Methoden, Class Fields, Getter, Vererbung sowie private Felder und Methoden.
- Bedeutung von `this`, Aufrufkontext mit `call()` und `apply()` sowie lexikalische Bindung bei Arrow Functions.

### Module und moderne Sprachmittel

- ECMAScript Modules mit `import` und `export`, Named und Default Exports sowie Modul-Scope und Ausführungssemantik.
- Native Module im Browser, Module als Grundlage für Bundler, dynamische Imports und Lazy Loading.
- Einbindung externer Module über URLs und Import Maps.
- Template Strings, Optional Chaining, Nullish Coalescing, Spread, Destructuring, Default- und Rest-Parameter sowie Kurzschreibweisen für Objektliterale.
- Iterationsprotokoll, `Symbol.iterator`, Generatoren und asynchrone Iteration mit `for await...of`.
- `Set`, `Map`, `WeakSet`, `WeakMap`, Symbols und Proxies.
- Zusammenspiel von Sprachsyntax, Laufzeit und Browser-APIs; Transpiler und Polyfills zur Überbrückung fehlender Unterstützung.

**Ausblick in den Folien:** Decorators, explizite Ressourcenverwaltung mit `using`, Signals, JavaScript-Enums, Temporal, Composites und Web Platform Observables. Diese Themen wurden als Weiterentwicklung der Sprache beziehungsweise Plattform eingeordnet.

**Übungen:** Scope-Probleme mit `let` und `for...of` lösen; als Vertiefung Closures mit `var` verwenden. Gegenseitige Seiteneffekte von Skripten durch ES-Module oder IIFEs vermeiden. Ein Drittanbieter-Modul direkt und über eine Import Map einbinden.

Quellen: [Modern JavaScript](/Users/jonas/Dev/MyGithub/modern-frontend-bsi-2025/00-CourseMaterial/01-ModernJavaScript.pdf), [Übungen zu modernem JavaScript](/Users/jonas/Dev/MyGithub/modern-frontend-bsi-2025/00-CourseMaterial/01-Exercise-Modern-JavaScript.md).

## 2. TypeScript und Typsicherheit

### Grundlagen und Typsystem

- Motivation und Einordnung von TypeScript als Ergänzung zu JavaScript: statische Typprüfung, bessere Entwicklungswerkzeuge und schrittweise Typisierung.
- Unterschied zwischen Typprüfung und Transpilation; Entfernung der Typinformationen vor der Ausführung.
- Projektkonfiguration mit lokalem TypeScript-Compiler und `tsconfig.json`, unter anderem strikte Prüfungen und `erasableSyntaxOnly`.
- Grundtypen, Arrays, Typinferenz sowie die Typen `any`, `unknown` und `never`.
- Union- und Intersection-Typen, Type Assertions, Type Guards und Type Narrowing.
- Funktionstypen und Overloads; Klassen, Interfaces, Sichtbarkeitsmodifikatoren und strukturelle Typkompatibilität.
- Type Aliases gegenüber Interfaces; Enums und Alternativen mit Union-Typen beziehungsweise `as const`.
- Ableitung neuer Typen mit `typeof`, `keyof`, indizierten Zugriffen sowie Hilfstypen wie `ReturnType` und `Awaited`.
- Decorators zur Erweiterung von Klassen und Methoden.

### Typinformationen an Systemgrenzen

- Einbindung von JavaScript-Bibliotheken über eigene Deklarationen und Typdefinitionen aus DefinitelyTyped (`@types`).
- Grenzen statischer Typisierung bei API-Antworten und anderen externen Daten.
- Generierung von Typen und API-Clients, beispielsweise aus OpenAPI, GraphQL oder Backend-Modellen.
- Laufzeitvalidierung mit Schemas, insbesondere Zod; Überblick über Alternativen wie ArkType und Valibot.
- Einsatzfelder der Validierung: API-Daten, Formulare, URL-Parameter, gespeicherte Daten und Serverkonfiguration.

**Übungen:** Externe TypeScript-Übungsaufgaben bearbeiten. jQuery in ein TypeScript-Projekt einbinden, zunächst eine einfache Moduldeklaration und danach eine typisierte Deklaration erstellen; diese anschliessend durch `@types/jquery` ersetzen.

Quellen: [TypeScript](/Users/jonas/Dev/MyGithub/modern-frontend-bsi-2025/00-CourseMaterial/02-TypeScript.pdf), [TypeScript-Übungen](/Users/jonas/Dev/MyGithub/modern-frontend-bsi-2025/00-CourseMaterial/02-Exercise-TypeScript.md).

## 3. Asynchrones JavaScript

### Event Loop, Callbacks und Promises

- Nebenläufigkeit in JavaScript: Main Thread, Event Loop, Callback Queue sowie Einordnung von Microtasks und Macrotasks.
- Netzwerkzugriffe aus JavaScript und AJAX mit Callbacks am Beispiel von jQuery.
- Promises als Modell für das Ergebnis einer asynchronen Operation: Zustände, Erzeugung, Verkettung und Fehlerbehandlung.
- Koordination mehrerer Operationen mit `Promise.all()`, `race()`, `allSettled()` und `any()`.
- Weitere Promise-Funktionen wie `finally()` und `withResolvers()` sowie Abbruch unterstützender APIs mit `AbortController` und `AbortSignal`.
- `async`/`await` als Syntax über Promises, Fehlerbehandlung mit `try`/`catch`, asynchrone Generatoren und Iteration.
- Vergleich Promise-basierter HTTP-Zugriffe mit `fetch`, axios und ky.

### Reaktive Programmierung mit RxJS

- Observables, Observer und Subscriptions; Wertefolgen über die Zeit gegenüber einem einzelnen Promise-Ergebnis.
- Synchrone und asynchrone Streams, Lazy-Ausführung, Cold und Hot Observables.
- Erzeugen von Streams mit Funktionen wie `of`, `from`, `fromEvent`, `interval` und `timer`.
- Transformation und Kombination mit Operatoren wie `map`, `filter`, `distinctUntilChanged`, `pairwise`, `merge` und `zip`.
- Higher-Order Observables und die Unterschiede von `mergeMap`, `concatMap` und `switchMap`.
- Abmelden von Subscriptions und Vermeidung von Speicherlecks.
- Subjects und BehaviorSubjects, einschliesslich Multicasting und aktuellem Wert; Type-Ahead-Suche als Demo.

**Übungen:** Einen Satz Wort für Wort über eine lokale HTTP-API laden. Parallele und sequenzielle Requests mit jQuery-Callbacks und axios/Promises vergleichen, die Promise-Lösung auf `async`/`await` umstellen und das sequenzielle Szenario mit RxJS umsetzen. Das Wasserfallverhalten in den Browser-Entwicklerwerkzeugen beobachten.

Quellen: [Async JavaScript](/Users/jonas/Dev/MyGithub/modern-frontend-bsi-2025/00-CourseMaterial/03-AsyncJavaScript.pdf), [Übungen zu asynchronem JavaScript](/Users/jonas/Dev/MyGithub/modern-frontend-bsi-2025/00-CourseMaterial/03-Exercise-Async.md).

## 4. Web Platform APIs

- **HTTP mit `fetch`:** Request- und Response-Verarbeitung, Lesen als Text oder JSON, Prüfung von HTTP-Statuscodes und Vergleich mit HTTP-Bibliotheken.
- **Browser-Sicherheitsmodell:** Same Origin Policy und Cross-Origin Resource Sharing (CORS), einschliesslich der Rolle von Server-Headern und Browser-Prüfungen.
- **WebSockets:** bidirektionale Kommunikation zwischen Browser und Server.
- **Streaming:** schrittweise Übertragung und Verarbeitung von Serverdaten mit der Streams API.
- **JSON:** Serialisierung und Deserialisierung sowie der Umgang mit Werten wie `BigInt`, `Date` und `Set`.
- **Formulare:** Übermittlung als JSON oder Formulardaten sowie client- und serverseitige Validierung.
- **Web Workers:** als Demo-Thema in den Folien aufgeführt.

**Übungen:** `response.text()` und `response.json()` vergleichen und CORS-Verhalten untersuchen; einen WebSocket-Broadcast an mehrere Browserfenster ergänzen; mehrere Streaming-Nachrichten senden und gezielt darstellen; JSON-Konvertierung verschiedener Datentypen erproben; serverseitige Formularvalidierung ergänzen, optional mit Zod.

Quellen: [Web Platform APIs](/Users/jonas/Dev/MyGithub/modern-frontend-bsi-2025/00-CourseMaterial/04-WebPlatformApis.pdf), [Übungen zu Plattform-APIs](/Users/jonas/Dev/MyGithub/modern-frontend-bsi-2025/00-CourseMaterial/04-Exercise-Platform.md).

## 5. Frontend-Tooling und Build-Prozesse

- **Projektstart:** Scaffolding mit Framework-Werkzeugen und Vite.
- **Aufgaben einer Toolchain:** Abhängigkeiten verwalten, Skripte ausführen, Code transformieren und typprüfen, Assets bündeln, linten und formatieren.
- **npm-Grundlagen:** lokale und globale Pakete, `package.json`, `node_modules`, semantische Versionierung und Lockfiles.
- **Reproduzierbare Installation:** Unterschiede zwischen `npm install` und `npm ci` sowie entsprechende Lockfile-Verfahren anderer Paketmanager.
- **Paketpflege:** Updates, npm-Skripte, `npx`, `npm create`, Sicherheitsprüfungen mit `npm audit` und deren Grenzen.
- **Ökosystem und Unternehmen:** Wartungsaufwand, Supply-Chain-Risiken, private Registries und Alternativen zu npm wie pnpm, Yarn, Bun und Deno.
- **Node-Versionen:** Verwaltung mit nvm und Einordnung weiterer Werkzeuge.
- **Codequalität:** ESLint, Biome und Formatierungswerkzeuge wie Prettier.
- **Bundling:** Abhängigkeitsgraphen, optimierte Produktionsartefakte, Minifizierung, Entfernung ungenutzten Codes, Cache-Busting und Lazy-Loading-Chunks.
- **Vite:** ES-Module im Entwicklungsbetrieb und Produktions-Build; Einordnung von esbuild und Rollup sowie neuerer Ansätze mit Rolldown, Oxc und Vite+.
- **Debugging:** Source Maps zur Zuordnung transformierten Codes zu den Originalquellen.
- **Testing:** Unit-, Komponenten- und End-to-End-Tests; Ausführung in Node oder Browsern, DOM-Simulation sowie Vitest und Playwright.

Quelle: [Frontend Tooling](/Users/jonas/Dev/MyGithub/modern-frontend-bsi-2025/00-CourseMaterial/05-FrontendTooling.pdf).

## 6. Styling, Komponentenbibliotheken und Web Components

### Styling-Ansätze

- Anforderungen an Styling: Gültigkeitsbereich, Nähe zu Komponenten, dynamische Styles, Performance und Entwicklungserfahrung.
- Unterschied zwischen dem Styling ganzer Seiten und einzelner Komponenten.
- Klassische CSS-Frameworks wie Bootstrap und Bulma sowie Namenskonventionen wie BEM.
- CSS-Präprozessoren, insbesondere Sass, im Vergleich zu nativen CSS-Funktionen wie Custom Properties und Nesting.
- CSS Modules zur Begrenzung von Klassennamen auf Komponenten.
- CSS-in-JS, unter anderem Emotion und styled-components, sowie dessen Einordnung im Zusammenhang mit SSR und React Server Components.
- Tailwind CSS als Utility-First-Ansatz; Abwägung von Wiederholung, Wartbarkeit, Refactoring und Verteilung der Komplexität zwischen HTML und CSS.

### Wiederverwendbare UI-Bausteine

- Überblick über Komponentenbibliotheken für Angular, React und Vue, beispielsweise Angular Material, PrimeNG, Material UI, Mantine, Vuetify und PrimeVue.
- Design Systems und wiederverwendbare Präsentationskomponenten; Abhängigkeit von Frameworks und Versionen.
- Headless Components, beispielsweise Radix UI, React Aria und Headless UI; Kombination mit Tailwind.
- shadcn als Ansatz, Komponentenquellcode in das eigene Projekt zu übernehmen.
- Web Components als Browserstandards: Custom Elements, Shadow DOM und HTML Templates.
- Web-Component-Werkzeuge wie Lit und Stencil sowie Bibliotheken wie FAST, Spectrum, Shoelace und Vaadin.
- Grenzen der Standards allein, etwa bei Reaktivität, State Management, umfangreichem Templating, Komposition und SSR.

Quelle: [Styling Mechanisms](/Users/jonas/Dev/MyGithub/modern-frontend-bsi-2025/00-CourseMaterial/06-Styling.pdf).

## 7. Single Page Applications und Framework-Überblick

### Architektur und Laufzeitkonzepte

- SPA-Architektur mit zustandsbehaftetem Browser-Client, Client-Side Rendering und HTTP-/REST-API.
- Aufteilung zwischen Frontend und Backend, API-Nutzung durch mehrere Clients sowie Backend-for-Frontend (BFF).
- Gründe für SPAs und ihre Abwägungen, insbesondere Benutzererlebnis, getrennte Entwicklungsumgebungen und verteilter Zustand.
- Komponentenarchitektur statt klassischer MVC-Struktur: Kapselung von Darstellung und Verhalten, Wiederverwendung, Grenzen und Datenfluss.
- Zustand in JavaScript und die UI als Funktion dieses Zustands: `UI = f(state)`.
- Reaktivität und Erkennung von Zustandsänderungen; unterschiedliche Framework-Ansätze und Fine-Grained Reactivity.
- Clientseitiges Routing, Deep Links, Lesezeichen und Browsernavigation; Hash-Routing gegenüber History-/Push-State-Routing.
- Server-Side Rendering und Hydration sowie die Verbindung von Rendering, Routing und Datenbeschaffung.
- Full-Stack- und Meta-Frameworks, unter anderem Next.js, React Router, Nuxt und TanStack Start; Verschiebung der Grenze zwischen Client und Server.

### Vergleich von Angular, React und Vue

- Gemeinsame Grundlagen: Komponenten, JavaScript-Zustand, DOM-Bindung, TypeScript und das npm-Ökosystem.
- Unterschiede zwischen vollständigem Framework, UI-Bibliothek und progressivem Framework.
- Templates gegenüber JSX sowie Klassen, Composition API und Hooks als Komponentenmodelle.
- Vergleich von Reaktivität, Verbreitung, Performance und Ökosystemen.
- Einordnung der Weiterentwicklung von Angular, der Full-Stack-Ausrichtung im React-Umfeld und der Beiträge des Vue-Ökosystems.
- Auswahl zusätzlicher Bibliotheken, besonders im React-Umfeld: Routing, Datenbeschaffung und State Management.
- Kriterien für Technologieentscheidungen: Architektur, Entwicklungsprozess, Wartbarkeit, Stabilität, Community und organisatorischer Kontext.

Die Frameworks wurden vergleichend und konzeptionell behandelt. Der Foliensatz dokumentiert einen Überblick über ihre Ansätze und Ökosysteme.

Quelle: [SPA Concepts](/Users/jonas/Dev/MyGithub/modern-frontend-bsi-2025/00-CourseMaterial/07-SPA-Concepts.pdf).
