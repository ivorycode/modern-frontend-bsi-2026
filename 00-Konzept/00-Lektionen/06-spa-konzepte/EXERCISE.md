# Übungsentwurf: Zustand zuordnen, Route ergänzen, Ablauf mit Playwright prüfen

Status: Beschreibung zur Review, noch keine Übung angelegt.

## Rahmen

- Zeitbedarf: etwa 45 Minuten Kernaufgabe, 15 Minuten Besprechung.
- Voraussetzungen: Blöcke 3 bis 5 (Zustände, Async, Fetch). Kenntnisse im gewählten Framework sind nicht erforderlich; der Ausgangsstand ist so vorbereitet, dass nur kleine Änderungen nötig sind.
- Varianten: Die Übung gibt es in drei gleichwertigen Varianten für **React**, **Angular** und **Vue**. Die Teilnehmenden wählen eine Variante, idealerweise das Framework ihres Projekts.

## Lernziel

Die Teilnehmenden ordnen den Zustand eines kleinen SPA-Beispiels nach Verantwortung ein und verschieben ihn an den passenden Ort. Sie ergänzen eine Detailroute mit Routenparameter und prüfen einen Nutzerablauf mit Playwright. In der Besprechung erkennen sie, dass die Konzepte in allen drei Frameworks gleich sind und sich nur die APIs unterscheiden.

## Ausgangslage (vorzubereiten)

### Gemeinsam für alle Varianten

- Dieselbe Fachlichkeit: ein Mini-SPA mit zwei Ansichten, z. B. «Liste von Einträgen mit Filter» und «Detailansicht».
- **Eine echte lokale HTTP-API**, die alle drei Varianten verwenden, z. B. ein kleiner Node-Server (Fastify) mit `GET /api/items` (optional mit Filter als Query-Parameter) und `GET /api/items/:id` (`404` bei unbekannter ID). Die API antwortet mit leichter Verzögerung, damit Ladezustände sichtbar sind, und liefert dieselben Daten für alle Varianten. Alle Requests sind im Network-Tab der Browser-Entwicklerwerkzeuge nachvollziehbar.
- Der Dev-Server jeder Variante leitet `/api` per Proxy an die lokale API weiter (Vite-Proxy beziehungsweise Proxy-Konfiguration der Angular CLI). So gibt es keine CORS-Probleme, und die Requests erscheinen unter derselben Origin.
- Dasselbe Markup und CSS in allen Varianten. Die drei Oberflächen sehen gleich aus.
- Eine reine TypeScript-Funktion für die Filterlogik als gemeinsames Modul oder als identische Kopie pro Variante; die Unit-Tests dafür laufen mit `vp test`.
- **Eine gemeinsame Playwright-Testsuite**, die gegen jede Variante laufen kann (z. B. ein Playwright-Projekt pro Variante mit eigenem `webServer` und `baseURL`; die lokale API wird als zusätzlicher `webServer` gestartet). Ein Beispieltest öffnet die Startseite und prüft den Titel. Weil die Tests nur sichtbares Verhalten und nutzernahe Locators verwenden, gelten sie unverändert für alle Frameworks.
- Bewusst eingebaute Schwächen bei der Zustandsverantwortung, in allen Varianten gleich:
  - Der Filter liegt nur im Komponentenzustand und geht beim Reload oder beim Zurück-Navigieren verloren.
  - Die gefilterte Liste wird zusätzlich als eigener Zustand gespeichert und kann mit der Gesamtliste auseinanderlaufen.
  - Die Filterlogik ist in Template beziehungsweise Komponente verteilt, statt die gemeinsame Funktion zu nutzen.
- Die Detailroute fehlt; Einträge sind noch nicht anklickbar.
- Eine Tabelle zur Zustandszuordnung als Arbeitsblatt (lokal, gemeinsam, Server, URL, abgeleitet).
- Pro Variante ein kurzer Spickzettel mit den nötigen APIs, damit niemand das Framework erst lernen muss.

### Pro Variante

| Variante | Basis | Router | Filter in der URL | Abgeleiteter Zustand |
| --- | --- | --- | --- | --- |
| React | Vite+ (`vp create` mit React-Template), pnpm | React Router | `useSearchParams` | Berechnung im Render bzw. `useMemo` |
| Vue | Vite+ (`vp create` mit Vue-Template), pnpm | Vue Router | `useRoute().query` und `router.replace` | `computed` |
| Angular | Angular CLI, pnpm | Angular Router | `ActivatedRoute.queryParamMap` oder Komponenten-Inputs mit `withComponentInputBinding` | `computed` mit Signals |

Angular bringt eine eigene Toolchain mit und wird deshalb nicht über Vite+ betrieben. Projektbefehle und Lint-Setup weichen dort ab; das ist im Spickzettel zu dokumentieren.

## Aufgabe

1. Lokale API und Anwendung starten. Im Network-Tab beobachten, welche Requests beim Laden, Filtern und Navigieren entstehen. Den Zustand in der Tabelle zuordnen: Welches Stück Zustand gehört wohin, und wo liegt es heute?
2. Den Filter in die URL verschieben (Query-Parameter), sodass Reload, Lesezeichen und Zurück-Button funktionieren.
3. Die gefilterte Liste ableiten statt speichern und dafür die gemeinsame Filterfunktion verwenden; einen fehlenden Unit-Test für die Filterfunktion ergänzen.
4. Eine Detailroute `/items/:id` ergänzen; Einträge der Liste verlinken dorthin. Die Detailansicht lädt den Eintrag über `GET /api/items/:id` und behandelt Laden, Fehler und «nicht gefunden». Im Network-Tab prüfen, dass beim Zurück-Navigieren keine unnötigen Requests entstehen beziehungsweise begründen, warum sie entstehen.
5. Einen Playwright-Test in der gemeinsamen Suite schreiben: Startseite öffnen, Filter setzen, Eintrag anklicken, Detailansicht prüfen, zurück navigieren, Filter ist noch gesetzt. Den Test gegen die eigene Variante ausführen.

## Abnahmekriterien

- Der Filterzustand überlebt Reload und Zurück-Navigation.
- Es gibt keinen doppelt gespeicherten, abgeleiteten Zustand.
- Ein direkter Aufruf einer Detail-URL funktioniert, auch für eine nicht existierende ID (Meldung statt Absturz).
- Der Playwright-Test nutzt nutzernahe Locators, läuft stabil ohne feste Wartezeiten und schlägt fehl, wenn der Filter beim Zurück-Navigieren verloren geht.
- Die Teilnehmenden können ihre Zuordnung des Zustands begründen.

## Besprechung: Vergleich der Varianten

- Je eine Person pro Variante zeigt ihre Lösung für Schritt 2 und 3. Gemeinsam wird verglichen: Wo liegt der URL-Zustand, wie wird abgeleiteter Zustand ausgedrückt, wie viel Code war nötig?
- Die gemeinsame Playwright-Suite läuft gegen alle drei Lösungen. Das zeigt, dass ein nutzernaher Test das Verhalten unabhängig von der Implementierung prüft.
- Ergebnis als Tabelle festhalten: gleiches Konzept, unterschiedliche API.

## Vertiefung für Schnellere

- Dieselbe Aufgabe in einer zweiten Variante lösen und die Unterschiede notieren.
- Die Rendering-Frage beantworten: Wäre für diese Anwendung CSR, SSR oder SSG passend? Was ändert sich, wenn die Detailseiten öffentlich und suchmaschinenrelevant sein sollen?
- Einen zweiten Playwright-Test für den Fehlerfall schreiben, indem die Antwort der lokalen API mit `page.route` gezielt durch einen `500` ersetzt wird. Diskutieren, wann ein Ablauftest die echte API und wann eine ersetzte Antwort verwenden sollte.

## Optional mit Agent

- Auftrag: «Verschiebe den Filter in die URL und ergänze die Detailroute. Schreibe einen Playwright-Test für den Ablauf Liste → Detail → zurück.»
- Besonders prüfen: Wo hat der Agent den Zustand abgelegt, und ist das begründbar? Verwendet der Test CSS-Selektoren, framework-spezifische Attribute oder `waitForTimeout`? Läuft er unverändert gegen die anderen Varianten?
- Variante: Den Agenten eine Lösung von einem Framework in ein anderes übertragen lassen und das Ergebnis mit der gemeinsamen Testsuite prüfen.

## Material aus 2025

- `06-SPA/react-starter`, `06-SPA/angular-starter`, `06-SPA/vue-starter` als Orientierung; die Varianten 2026 werden neu mit Vite+ beziehungsweise der aktuellen Angular CLI und pnpm erzeugt.
- `06-SPA/full-stack/41-react-router-starter-finish` als Beispiel für Routing mit Datenbeschaffung.

## Entscheidungen

- Alle drei Varianten verwenden eine echte lokale API statt simulierter Daten, damit die Requests realistisch sind und im Network-Tab sichtbar werden.

## Offene Punkte für die Review

- Lokale API aus Block 5 wiederverwenden (Fastify-Server erweitern) oder eine eigene, schlankere API für diesen Block?

- Ist die Kombination aus Zustandsrefactoring, neuer Route und Playwright-Test in 45 Minuten machbar? Alternative: Detailroute vorgeben und nur Filter in URL plus Test.
- Gemeinsame Teile (API, Filterfunktion, Playwright-Suite) als pnpm-Workspace mit drei Paketen organisieren oder pro Variante kopieren? Ein Workspace vermeidet Abweichungen, ist aber für Teilnehmende komplexer; Kopien entsprechen dem Prinzip unabhängiger Ausgangsstände.
- Gemeinsames CSS für alle drei Varianten, damit sich der Vergleich auf Zustand und Routing beschränkt?
