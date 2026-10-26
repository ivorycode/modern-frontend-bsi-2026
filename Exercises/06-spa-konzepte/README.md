# Übung 6: Schadenfälle – Zustand zuordnen, Route ergänzen, Ablauf mit Playwright prüfen

Eine kleine Single-Page-Application zeigt die Schadenfälle einer Versicherung als Liste mit Suche. Sie ordnen den Zustand nach Verantwortung ein, verschieben den Suchbegriff in die URL und leiten die gefilterte Liste ab, statt sie zu speichern. Zum Schluss ergänzen Sie eine Detailroute und prüfen den Ablauf mit Playwright.

Die Übung gibt es in drei gleichwertigen Varianten. Wählen Sie **eine**, am besten das Framework Ihres Projekts. Kenntnisse im Framework sind nicht nötig; jede Anleitung nennt die benötigten APIs im jeweiligen Schritt.

| Variante                       | Werkzeuge                               | Seite                    | API                      |
| ------------------------------ | --------------------------------------- | ------------------------ | ------------------------ |
| [React](./react/README.md)     | React 19, React Router, Vite+           | `http://localhost:5181/` | `http://localhost:3181/` |
| [Vue](./vue/README.md)         | Vue 3, Vue Router, Vite+                | `http://localhost:5182/` | `http://localhost:3182/` |
| [Angular](./angular/README.md) | Angular 22, Angular Router, Angular CLI | `http://localhost:5183/` | `http://localhost:3183/` |

Jede Variante ist ein eigenständiges npm-Projekt ohne gemeinsamen Code. Fachlichkeit, Daten, Markup, CSS und die Playwright-Tests in `e2e/claims.spec.ts` sind in allen drei gleich. Dank eigener Ports können alle drei gleichzeitig laufen.

**Optional mit einem Coding Agent:** In jeder Variante beginnen die Schritte 2 bis 5 mit einem Auftrag für einen Coding Agent, gefolgt von der Anleitung zum manuellen Lösen und Prüfen. Schritt 1 und den Vergleich unten bearbeiten Sie selbst. Vertiefung a zeigt, wie Sie eine Lösung mit dem Agenten in eine zweite Variante übertragen und mit derselben Playwright-Suite prüfen.

```sh
cd Exercises/06-spa-konzepte/react    # oder vue, angular
npm ci
```

## Ausgangsstand und Ziel

- **Ausgangsstand:** `npm run check` besteht; in React mit einer absichtlichen Warnung `react(set-state-in-effect)`. `npm test` besteht mit zwei `todo`. Von den Playwright-Tests bestehen zwei, vier scheitern absichtlich (Schritte 2 bis 4), einer ist als `fixme` markiert (Schritt 5).
- **Ziel:** Alle Prüfungen bestehen ohne Warnung, alle Playwright-Tests bestehen.

## Kontrollfragen: gleiches Konzept, andere API

Vergleichen Sie Ihre Lösung der Schritte 2 und 3 mit einer anderen Variante:

| Frage                                                          | React | Vue | Angular |
| -------------------------------------------------------------- | ----- | --- | ------- |
| Wo liegt der Suchbegriff als URL-Zustand, wie wird er gelesen? |       |     |         |
| Wie wird er geschrieben, ohne die History zu füllen?           |       |     |         |
| Wie wird die gefilterte Liste abgeleitet?                      |       |     |         |
| Wie kommt der Routenparameter `:id` in die Komponente?         |       |     |         |
| Wo liegt der Serverzustand (Laden, Fehler, Daten)?             |       |     |         |
| Warum lädt die Liste beim Zurück-Navigieren neu?               |       |     |         |
| Wie viel Code war für Schritt 2 und 3 nötig?                   |       |     |         |

Führen Sie zum Schluss in jedem Ordner `npm run e2e` aus. Die Suite verwendet nur, was Nutzerinnen und Nutzer sehen, und prüft das Verhalten darum unabhängig vom Framework.

<details>
<summary>Antworten zu den Kontrollfragen</summary>

| Frage                          | React                                                               | Vue                                                                        | Angular                                                         |
| ------------------------------ | ------------------------------------------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Suchbegriff lesen              | `useSearchParams()`, `searchParams.get("q")`                        | `useRoute().query.q`                                                       | Input `q = input<string>()` dank `withComponentInputBinding()`  |
| Schreiben ohne History-Eintrag | `setSearchParams({ q }, { replace: true })`                         | `router.replace({ query: { q } })` im `set` eines `computed` für `v-model` | `router.navigate([], { queryParams: { q }, replaceUrl: true })` |
| Gefilterte Liste ableiten      | Berechnung beim Rendern (bei Bedarf `useMemo`)                      | `computed(() => …)`                                                        | `computed(() => …)`                                             |
| Routenparameter `:id`          | `useParams()`                                                       | Prop dank `props: true` (oder `useRoute().params`)                         | Input `id = input.required<string>()`                           |
| Serverzustand                  | Hooks `useClaims`, `useClaim` mit `useEffect` und `AbortController` | Composables `useClaims`, `useClaim` mit `ref` und `watchEffect`            | `httpResource`                                                  |

**Neu laden beim Zurück-Navigieren:** In allen drei Frameworks entfernt der Router die Listenseite samt Zustand und erzeugt sie beim Zurückkehren neu. Abhilfe schafft ein Cache für Serverzustand, der länger lebt als die Seite, etwa TanStack Query, ein Store oder ein Service.

Gemeinsam ist allen drei: Daten fliessen über Props bzw. Inputs nach unten. Die URL ist die Quelle für Suchbegriff und ausgewählten Schadenfall. Abgeleiteter Zustand ist eine Berechnung. Serverzustand besteht aus Laden, Fehler und Daten.

Unterschiedlich ist das Reaktivitätsmodell: React rendert die ganze Komponente neu und berechnet dabei alles. Vue und Angular verfolgen mit `ref`/`computed` bzw. Signals, welche Werte gelesen werden, und rechnen nur neu, was sich geändert hat.

</details>
