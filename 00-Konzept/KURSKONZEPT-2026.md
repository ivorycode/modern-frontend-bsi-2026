# Vorschlag für die Neuauflage 2026

Stand: 24. Oktober 2026. Arbeitsannahme: weiterhin zwei Kurstage für Personen mit Programmiererfahrung, die moderne Frontend-Entwicklung verstehen und praktisch anwenden wollen.

## Leitentscheidung

Der Kurs richtet sich auf das **Verstehen, Entwickeln und Überprüfen moderner Frontend-Anwendungen** aus. Die technischen Grundlagen von 2025 bleiben überwiegend relevant. Weniger Unterrichtszeit benötigen Syntaxvarianten, historische Entwicklung und die Aufzählung konkurrierender Werkzeuge. Mehr Zeit verdienen Architekturentscheidungen, Fehlersuche, Datenverträge und überprüfbare Qualität.

Coding Agents werden als optionale Unterstützung der Entwicklungsarbeit eingeordnet. Alle Übungen sind vollständig von Hand lösbar; wer einen Agenten zur Verfügung hat, kann ihn ausprobieren. Lernziele, Aufgaben und Abnahmekriterien gelten für beide Arbeitsweisen. Ein eigener Agentenzugang ist keine Voraussetzung für die Teilnahme.

Ein überprüfbares Abschlussziel wäre: Die Teilnehmenden können eine kleine Frontend-Funktion fachlich beschreiben, implementieren, ihre kritischen Teile erklären und ihre Abnahme anhand von Tests und Browserverhalten begründen. Die Umsetzung kann manuell oder mit Agentenunterstützung erfolgen.

## Kursauftakt: Tooling, Projekt-Setup und Testing-Grundlagen

Dieser Block steht vor den Sprach- und Plattformthemen. Er schafft die gemeinsame Arbeitsumgebung und führt Tests als Handwerksmittel für spätere Übungen ein. Wer einen Agentenzugang hat, kann diesen anschliessend ebenfalls nutzen.

### Gemeinsame Arbeitsumgebung

- Den vorbereiteten Starter öffnen und seinen Aufbau verstehen: Einstiegspunkt, Quellcode, Konfiguration und Projektbefehle.
- Abhängigkeiten reproduzierbar installieren, Entwicklungsserver starten und das Ergebnis im Browser prüfen.
- Die Aufgaben von Vite, TypeScript, Linter, Testwerkzeugen und Produktionsbuild einordnen. Einfache Tests werden direkt ausprobiert; weiterführende Testkenntnisse folgen in den jeweiligen Fachthemen.
- Browser-Entwicklerwerkzeuge und Git-Diffs für die Arbeit an kleinen Änderungen nutzen.
- Erklären, wie die unabhängigen Übungsordner gestartet, geprüft und auf ihren jeweiligen Ausgangsstand zurückgesetzt werden.

**Toolchain:** Die Übungen verwenden [Vite+](https://viteplus.dev/) als Entwicklungsabhängigkeit des jeweiligen Projekts und laufen mit Node.js und npm, wie sie in [_PREPARATION.md](../_PREPARATION.md) geprüft werden. Eine globale Installation von Vite+ ist weder nötig noch vorausgesetzt. Die Projektbefehle stehen als npm-Skripte in `package.json` (`npm run dev`, `npm run check`, `npm test`, `npm run build`, `npm run e2e`) und rufen das lokale `vp` auf. End-to-End-Tests laufen mit Playwright im bereits installierten Chrome (`channel: "chrome"`), damit kein zusätzlicher Browser-Download nötig ist.

### Tests als unmittelbare Rückmeldung

Für die Testing-Grundlagen sind etwa 40 Minuten innerhalb des Auftaktblocks vorgesehen. Grundlage ist eine kleine interaktive Seite mit einer synchronen Fachfunktion ohne Netzwerk. An der Fachfunktion üben die Teilnehmenden mit Vitest:

1. Tests mit Vitest starten und die Ausgabe lesen.
2. Einen Test verstehen: Vorbereitung, Aktion und erwartetes Ergebnis.
3. Einen Fehler in die Funktion einbauen und den fehlgeschlagenen Test erklären.
4. Die Implementierung korrigieren und erneut prüfen.
5. Einen zusätzlichen Testfall ergänzen und seine Erwartung begründen.

Anschliessend lernen sie einen ersten End-to-End-Test mit Playwright kennen. Die Seite enthält einen absichtlich eingebauten Fehler, der nur bei der Interaktion im Browser sichtbar wird, während alle Unit-Tests bestehen. Die Teilnehmenden reproduzieren ihn im Browser, korrigieren ihn und sichern das Verhalten mit einem Playwright-Test ab. So wird früh sichtbar, dass Unit-Tests und Abläufe im Browser unterschiedliche Aussagen belegen.

Das Einstiegsziel lautet: **Tests als Rückmeldung verwenden und einfache Erwartungen formulieren können.** Die Testkonfiguration für Vitest und Playwright ist vorbereitet. Der Einstieg benötigt weder fortgeschrittene TypeScript-Kenntnisse noch Promises oder Mocking. Diese Inhalte und weiterführende Playwright-Techniken werden später anhand konkreter Aufgaben eingeführt.

### Optionale Einbindung von Coding Agents

Die Kursleitung zeigt an einem vorbereiteten Beispiel, wie ein Agent im Projekt arbeiten kann: Projekt öffnen, einen begrenzten Auftrag geben, relevante Dateien lesen lassen, eine kleine Änderung durchführen und mit den vorhandenen Projektbefehlen überprüfen. Für die Demonstration sind etwa 15 bis 20 Minuten innerhalb des Auftaktblocks vorgesehen.

Dabei werden folgende Punkte kurz behandelt:

- Projektkontext, Konventionen und Prüfkommandos in einer knappen Anleitung wie `AGENTS.md` oder dem jeweiligen Werkzeugäquivalent bereitstellen.
- Ziel, betroffene Grenzen und überprüfbare Erwartungen im Auftrag benennen.
- Änderungen im Diff und das tatsächliche Verhalten im Browser kontrollieren.
- Zugriffe, Secrets und externe Anweisungen einordnen; Arbeitsrechte passend zur Übung begrenzen.

Ein Schwerpunkt der Demonstration ist die Inspektion der laufenden Seite durch den Agenten. Ohne Browserzugriff kennt ein Agent nur den Quellcode und muss das Verhalten der Seite erschliessen. Mit der [Playwright CLI](https://github.com/microsoft/playwright-cli) öffnet er die Seite, interagiert mit ihr, liest Seitenstruktur und Console-Meldungen, prüft seine Korrektur im Browser und hält den Befund als Playwright-Test fest. Die CLI ist in `@playwright/test` enthalten (`npx playwright cli`) und benötigt keine weitere Installation; sie funktioniert mit jedem Agenten, der Befehle im Terminal ausführen kann. Als Alternativen werden das [Chrome DevTools MCP](https://developer.chrome.com/blog/chrome-devtools-mcp-debug-your-browser-session), das sich auch an eine laufende Chrome-Sitzung anbinden kann, und die in Agenten oder Editoren eingebauten Browser eingeordnet.

Die Teilnehmenden können die Demonstration verfolgen oder mit einem bereits verfügbaren Agenten mitmachen. Einrichtung und Anmeldung sind keine Voraussetzung für die folgenden Blöcke. Falls eine Live-Demonstration nicht möglich ist, dienen ein vorbereiteter Ablauf und ein Beispieldiff als Ersatz.

Der Arbeitszyklus aus Implementieren, Prüfen und Korrigieren wird sowohl in der [OpenAI-Dokumentation](https://developers.openai.com/blog/run-long-horizon-tasks-with-codex) als auch in den [Claude-Code-Empfehlungen](https://code.claude.com/docs/en/best-practices) beschrieben. Hinweise zu knappen Projektanweisungen finden sich bei [OpenAI](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra), Risiken und Schutzmechanismen bei [GitHub](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/risks-and-mitigations). Diese Quellen dienen als Hintergrund für die optionale Agenteneinbindung.

## Bewertung des Materials von 2025

| Bereich | Entscheidung | Schwerpunkt 2026 |
| --- | --- | --- |
| ECMAScript-Module | Beibehalten | `import`/`export`, Modul-Scope statt globalem Scope, native Module und Bundler; Module als Grundlage für testbaren Code. |
| Funktionale und objektorientierte Programmierung | Beibehalten, neu als Vergleich mit Java gliedern | Beide Stile nebeneinander: Callbacks, Higher-Order Functions, innere Funktionen und Closures; Klassen mit privaten Feldern `#` und das von Java abweichende Verhalten von `this`. An typischen Fehlern vermitteln. |
| Unveränderliche Daten | Vertiefen, Immer neu | Referenzen und Mutation, flache und tiefe Kopien, unveränderliche Updates mit Spread und nicht mutierenden Array-Methoden, Immer; Bezug zur Änderungserkennung in UI-Frameworks. |
| JavaScript-Syntax und fortgeschrittene Sprachmittel | Stark kürzen | Moderne Syntax nur so weit, wie sie zum Lesen der Beispiele nötig ist. Keine ausführliche Reise durch `call`/`apply`, Symbols, eigene Iteratoren, Proxies und Generatoren; Vererbung nur zum Lesen. Relevante Konstrukte bei ihrem Auftreten erklären. |
| Async JavaScript | Vertiefen, Historie kürzen | `async`/`await`, Fehlerpfade, Parallelität, Abbruch, Race Conditions und veraltete Antworten. |
| TypeScript | Vertiefen und fokussieren | Strikte Typprüfung, `unknown`, Narrowing, diskriminierte Unions, verständliche Verträge; problematische Assertions und `any` im Review erkennen. |
| Laufzeitvalidierung | Vertiefen | API-Antworten und Formulare mit einem Schemawerkzeug validieren; Fehler sinnvoll behandeln. |
| RxJS | Zielgruppenabhängig | Allgemeiner Kurs: Zustand, Einzelresultat und Ereignisstrom unterscheiden. Angular-lastiger Kurs: zusätzlich `switchMap`, Fehlerbehandlung und Subscription-Lebensdauer. |
| Web Platform APIs | Kern behalten | HTTP, Fetch, CORS, JSON und Formulare; Browser-Entwicklerwerkzeuge praktisch nutzen. Streaming als Wahlthema; WebSocket und Worker nach Anwendungsbedarf. |
| Tooling | An den Kursanfang ziehen, Katalog kürzen | Arbeitsumgebung und Projekt-Setup vorbereiten; Installation, Typprüfung, Linting und Build verstehen. Erste Tests praktisch nutzen und optionale Agentenanbindung demonstrieren. |
| Styling | Vergleich kürzen, Umsetzung vertiefen | CSS-Grundlagen, Layout, responsive Darstellung, konsistente Komponenten und Designvorgaben. Einen Ansatz praktisch nutzen. |
| Tests | Im Setup beginnen, über die Themenblöcke vertiefen | Einfache Tests lesen, ausführen und ergänzen; später Validierung, Async-Verhalten und Nutzerabläufe prüfen. Aussagekraft selbst geschriebener und optional generierter Tests beurteilen. |
| SPA und Frameworks | Konzepte vertiefen, Marktübersicht kürzen | Komponenten, Zustand, Routing, Serverdaten, Client-/Server-Grenzen und Rendering-Entscheidungen. |
| Web Components | Wahlthema | Besonders relevant bei frameworkübergreifenden Design Systems; sonst kurzer Überblick. |
| Zukunftsfeatures und Ökosystem-Trends | In Zusatzmaterial verschieben | Nur aufnehmen, wenn sie für die konkrete Übungsanwendung oder eine Architekturentscheidung nötig sind. |

Die technischen Belege zu diesen Entscheidungen stehen in [RECHERCHE-FRONTEND-2026.md](./RECHERCHE-FRONTEND-2026.md).

### Konkrete Streichungen aus dem Pflichtprogramm

- jQuery-AJAX als Implementierungsübung und mehrfaches Nachbauen derselben Lösung mit unterschiedlichen HTTP-Bibliotheken.
- Manuelle Modul-Isolation mit IIFEs sowie Scope-Reparaturen unter der Einschränkung, ausschliesslich `var` zu verwenden.
- Ausführliche Geschichte von ES5, Promise-Polyfills und alten Browsern, sofern keine entsprechenden Bestandsanwendungen relevant sind.
- Ein vollständiger RxJS-Operatorenkatalog für eine gemischte Zielgruppe.
- TypeScript-Typakrobatik, ausführliche Overload- und Decorator-Beispiele sowie mehrere konkurrierende Validierungsbibliotheken.
- Lange Listen von Bundlern, Paketmanagern, CSS-in-JS-Lösungen und Komponentenbibliotheken.
- Framework-Popularitätskurven und Einzelvergleiche, die keine konkrete Projektentscheidung unterstützen.

Das sind Entscheidungen über knappe Kurszeit. Viele dieser Themen bleiben für bestimmte Projekte nützlich.

## Themen, die mehr Tiefe verdienen

### Daten und Zustand modellieren

Die Teilnehmenden sollen erkennen, welche Zustände zulässig sind und welche Übergänge eine Oberfläche benötigt: initial, ladend, erfolgreich, leer, fehlgeschlagen. Daraus entstehen Typen, UI-Verhalten und Tests. Diskriminierte Unions sind hierfür ein besonders anschauliches TypeScript-Beispiel.

API-Antworten benötigen eine gesonderte Betrachtung. Type Assertions erzeugen keine Laufzeitprüfung; ein `as Customer` validiert keine Daten. [TypeScript-Handbuch](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) und [Zod-Dokumentation](https://zod.dev/basics) liefern dafür die fachliche Grundlage.

### Asynchrones Verhalten diagnostizieren

Die Wort-API aus 2025 kann als kurze Einstiegsübung bleiben. Für die Vertiefung eignet sich eine Suche: Eine ältere, langsamere Antwort überschreibt die neue Suche. Die Teilnehmenden reproduzieren das Verhalten, untersuchen das Timing und begründen die Korrektur. So werden Reihenfolge, Nebenläufigkeit und Abbruch zu praktisch überprüfbaren Kenntnissen.

### Architekturentscheidungen treffen

An kleinen, vorbereiteten Beispielen unterscheiden: lokaler UI-Zustand, Serverdaten, fachliche Logik und externe Schnittstellen. Kleine, klar abgegrenzte Module machen Änderungen leichter prüfbar. Die Teilnehmenden sollten die tragenden Entscheidungen unabhängig von der Art der Implementierung erklären können.

CSR, SSR, SSG und Hydration bleiben im Kurs. Dafür reicht zunächst die Entscheidung zwischen einer internen Fachanwendung und einer öffentlichen Inhaltsseite. Die aktuelle React-Dokumentation nennt ausdrücklich auch CSR, SPAs und statische Ausgabe als Möglichkeiten empfohlener Frameworks; aus einer Framework-Empfehlung folgt kein SSR-Zwang. [React: Creating a React App](https://react.dev/learn/creating-a-react-app)

### Qualität praktisch nachweisen

Die Testwerkzeuge sind in den vorbereiteten Startern eingerichtet und werden bereits beim Setup genutzt. In den späteren Themenblöcken werden Erwartungen aus Anforderungen und fachlichen Beispielen abgeleitet und die jeweils passenden Testtechniken ergänzt. Tests können denselben Denkfehler wie die Implementierung enthalten; deshalb entdecken die Teilnehmenden bereits beim Einstieg einen absichtlich eingebauten Fehler mit einem Test. Das gilt auch für optional durch Agenten erzeugte Tests.

Playwright empfiehlt die Prüfung sichtbaren Nutzerverhaltens und robuste, nutzernahe Selektoren. Das passt zu einer Abnahme über Formularabläufe, Fehlermeldungen und Navigation. [Playwright: Best Practices](https://playwright.dev/docs/best-practices)

### Testing schrittweise vertiefen

Testing wird als Querschnittsthema vermittelt. Einen separaten Testing-Block gibt es nicht mehr. Neue Techniken kommen hinzu, sobald die fachlichen Voraussetzungen im jeweiligen Block erarbeitet sind:

| Themenblock | Testkenntnisse und Anwendung |
| --- | --- |
| Tooling und Setup | Synchrone Tests mit Vitest lesen, starten, Fehlerausgaben verstehen und einen Testfall ergänzen. Einen ersten Playwright-Test ausführen und einen Interaktionsfehler mit einem Ablauftest absichern. |
| JavaScript | Das Verhalten einer kleinen Funktion oder eines Moduls mit einfachen Erwartungen absichern, etwa dass eine Update-Funktion ihre Eingabe nicht verändert. |
| Async JavaScript | Asynchrone Tests nach der Einführung von Promises und `async`/`await` schreiben; Reihenfolge und Fehlerfälle mit kontrolliert verzögerten Antworten untersuchen. |
| TypeScript und Laufzeitvalidierung | Gültige und ungültige Eingaben, Grenzfälle und erwartete Fehler testen; statische Typprüfung und Laufzeittests unterscheiden. |
| Web Platform APIs | Netzwerkabhängigkeiten durch vorbereitete Antworten kontrollieren; echte Requests und Testantworten unterscheiden. CORS zusätzlich im Browser untersuchen, da ersetzte Netzwerkantworten dessen tatsächliches Verhalten nicht belegen. |
| SPA-Konzepte | Playwright an einem vorbereiteten Mini-Beispiel vertiefen; Zustandswechsel und Navigation aus Nutzersicht prüfen. |
| Styling | Browserprüfungen für Interaktionen und Sichtbarkeit ergänzen; Darstellung bei unterschiedlichen Bildschirmgrössen untersuchen. |

Testkonfiguration und benötigte Hilfsmittel werden pro Übung mitgeliefert. Beim Async-Thema steht zunächst das Verständnis des Verhaltens im Vordergrund; Details wie simulierte Timer oder umfangreiches Mocking bleiben Vertiefungen bei Bedarf.

Automatisierte Tests werden durch passende Beobachtungen ergänzt. Insbesondere bei Styling bleiben visuelle Prüfung, Verständlichkeit und Gebrauchstauglichkeit Teil der Abnahme. Ein grüner Testlauf belegt die geprüften Erwartungen, aber nicht die vollständige Qualität einer Lösung.

## Ergänzende Lernziele in den Themenblöcken

### Anforderungen und Fehlerfälle formulieren

Jede Übung benennt Ziel, Ausgangslage und überprüfbare Erwartungen. Die Teilnehmenden ergänzen passende Fehlerfälle, etwa ungültige Formulardaten oder eine fehlgeschlagene HTTP-Anfrage. Diese Erwartungen leiten sowohl die manuelle Umsetzung als auch einen optionalen Agentenauftrag an.

### Änderungen umsetzen und beurteilen

Der gemeinsame Ablauf lautet: Aufgabe verstehen, Änderung umsetzen, passende Prüfungen ausführen, Ergebnis untersuchen und Fehler korrigieren. Im Review beurteilen die Teilnehmenden fachliches Verhalten, Fehlerbehandlung, Komplexität und Testaussagen. Die Umsetzung erfolgt wahlweise manuell oder mit Agentenunterstützung; die Erklärung des Ergebnisses gehört für alle zur Übung.

## Übungsformat

Der Kurs verwendet **kleine, unabhängige Übungen pro Themenblock**. Jede Übung hat einen eigenen lauffähigen Ausgangsstand und ein klar begrenztes Lernziel. Sie setzt keine Lösung aus einem früheren Block voraus. Bestehende Beispiele aus 2025 werden, wo passend, weiterverwendet und gezielt angepasst.

Ein gemeinsamer technischer Starter kann als Vorlage für mehrere Übungsordner dienen. Die fachlichen Beispiele bleiben unabhängig. Benötigte APIs, Testdaten oder UI-Gerüste werden vorbereitet, damit die Übungszeit dem jeweiligen Thema zugutekommt.

### Gestaltung jeder Übung

- Eine kurze Aufgabenbeschreibung mit Ausgangslage, Lernziel und Abnahmekriterien.
- Eine Kernaufgabe, deren Umfang für die manuelle Bearbeitung im vorgesehenen Zeitfenster ausgelegt ist.
- Hinweise und gegebenenfalls eine Musterlösung zur selbstständigen Bearbeitung.
- Je nach Lernziel vorbereitete Tests, ein zu ergänzender Testfall oder ein bewusst fehlerhafter Test zur Korrektur; erwartetes Verhalten und Grenzen der Prüfung werden besprochen.
- Optional ein Agentenhinweis: Welcher Kontext ist hilfreich, und welche Teile des Ergebnisses sind besonders zu prüfen?
- Eine zusätzliche Vertiefung für schnellere Teilnehmende, die ebenfalls manuell lösbar ist.

Es gilt derselbe fachliche Auftrag für beide Arbeitsweisen. Agentenunterstützung darf die Bearbeitung erleichtern; sie ist keine Voraussetzung für ein vollständiges Ergebnis.

Die Testaufgaben werden bewusst variiert: In einer Übung helfen vorgegebene Tests beim Lösen, in einer anderen ergänzen die Teilnehmenden eine fehlende Prüfung oder korrigieren einen Test anhand der fachlichen Anforderung. So bleibt das Lernziel über einen grünen Testlauf hinaus sichtbar. Die unabhängigen Ausgangsstände enthalten jeweils alle benötigten Testdateien; Ergebnisse früherer Übungen müssen nicht übernommen werden.

### Beispiele pro Themenblock

| Themenblock | Kleine, eigenständige Kernübung | Optionale Nutzung eines Agenten |
| --- | --- | --- |
| Tooling und Setup | Starter starten, einen synchronen Test lesen und ausführen, einen Fehler einbauen und korrigieren sowie einen Testfall ergänzen. Typprüfung und Build kennenlernen. Einen Interaktionsfehler im Browser finden und mit einem Playwright-Test absichern. | Den Agenten die Seite mit der Playwright CLI inspizieren lassen, den Fehler reproduzieren und beheben lassen, dieselben Tests ausführen und den Diff kontrollieren. |
| JavaScript | Zwei Einkaufslisten teilen sich den Zustand eines Moduls: Zustand mit einer Factory-Funktion in einer Closure kapseln. «Rückgängig» scheitert an einer flachen Kopie: Mutationen durch unveränderliche Updates ersetzen und mit Tests belegen, dass der bisherige Stand unverändert bleibt. | Eine Korrektur vorschlagen lassen und prüfen, ob sie die Ursache behebt oder nur das Symptom überdeckt (z. B. tiefe Kopie statt unveränderlicher Updates). |
| Async JavaScript | Wörter parallel beziehungsweise sequenziell laden und das Verhalten asynchron testen; als Vertiefung eine Race Condition in einem separaten Suchbeispiel beheben. | Eine Umsetzung oder Fehlerdiagnose anfordern und mit Tests sowie Beobachtungen im Browser prüfen. |
| TypeScript | Ladezustände mit einer diskriminierten Union modellieren und unsichere Zugriffe beseitigen. | Einen Typentwurf erzeugen und auf ungültige Zustände prüfen. |
| Laufzeitvalidierung | Asynchron geladene JSON-Antworten validieren, Fehler darstellen und Tests für gültige und ungültige Eingaben ergänzen. | Ein Schema und Tests vorschlagen lassen und deren Erwartungen fachlich überprüfen. |
| Web Platform APIs | In einem vorbereiteten Fetch-Beispiel HTTP-Fehler behandeln, Erfolg und Fehler mit kontrollierten Antworten testen und CORS im Browser untersuchen. | Testfälle vorschlagen lassen und mit den Anforderungen sowie echten Netzwerkantworten abgleichen. |
| SPA-Konzepte | In einem vorbereiteten Mini-Beispiel Zustandsverantwortung zuordnen oder eine zusätzliche Route ergänzen; einen Nutzerablauf mit Playwright prüfen. | Einen Änderungsvorschlag einholen und Verantwortlichkeiten sowie Testaussagen beurteilen. |
| Styling | Ein kleines Formular responsive gestalten; Browserprüfungen ergänzen und das Layout visuell kontrollieren. | Änderungen und Prüfungen vorschlagen lassen und Layout sowie Darstellung selbst beurteilen. |

## Möglicher Ablauf für zwei Tage

Vorschlag mit zwölf Netto-Unterrichtsstunden, Pausen zusätzlich:

| Tag | Block | Zeit |
| --- | --- | --- |
| 1 | Einführung, Tooling, Arbeitsumgebung und Projekt-Setup mit etwa 40 Minuten Testing-Grundlagen (Vitest und ein erster Playwright-Test); kurze Demonstration der optionalen Agenteneinbindung mit Browserinspektion | 120 min |
| 1 | Modernes JavaScript: ES-Module, funktionale und objektorientierte Programmierung im Vergleich zu Java, unveränderliche Updates; unabhängige Übung mit einfachen Verhaltenstests | 60 min |
| 1 | Async JavaScript und Fehlersuche mit Wort-API beziehungsweise Suchbeispiel; Einführung asynchroner Tests | 90 min |
| 1 | TypeScript, Datenverträge, Laufzeitvalidierung und Zustandsmodellierung; Einzelübungen mit Tests für Eingaben und Fehlerfälle | 90 min |
| 2 | Web Platform APIs: Fetch, HTTP, CORS und Formulare; Einzelübungen mit kontrollierten Netzwerkantworten und Browserbeobachtung | 90 min |
| 2 | SPA-Konzepte: Komponenten, Zustand, Routing und Rendering; Framework-Einordnung und Playwright-Prüfung von Nutzerabläufen am Mini-Beispiel | 105 min |
| 2 | Styling und semantisches HTML; eigenständige UI-Übung mit Browserprüfungen und visueller Kontrolle | 120 min |
| 2 | Rückblick, Grenzen grüner Tests, offene Fragen und Transfer ins eigene Projekt | 45 min |

Die Zeitblöcke enthalten jeweils Erklärung, Übung, passende Testvertiefungen und Besprechung. Die Zeitplanung ist innerhalb der zwölf Stunden neu gewichtet; der bisherige eigenständige Testing-Block entfällt. Im Rückblick wird gemeinsam geklärt, was ein grüner Test belegt, welche Prüfungen zusätzlich nötig sind und wann ein Test wenig aussagekräftig ist.

Agentenunterstützung kann nach dem Auftakt in allen Übungen genutzt werden. Die Agenda setzt vorab getestete Übungsstarter voraus; Agentenzugänge sind optional. Bei geringer JavaScript-Erfahrung wächst die Grundlagenphase und die Zahl der Vertiefungen sinkt. Bei starkem Angular-Bezug erhält RxJS mehr Zeit; bei einem Design-System-Schwerpunkt Web Components.
