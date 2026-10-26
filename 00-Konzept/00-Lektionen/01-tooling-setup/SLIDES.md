# Folienvorschlag: Tooling, Projekt-Setup und Testing-Grundlagen

Erster Entwurf. «2025: S. x» verweist auf Seiten im Foliensatz [05-FrontendTooling.pdf](../../../../modern-frontend-bsi-2025/00-CourseMaterial/05-FrontendTooling.pdf), sofern nicht anders angegeben.

## Teil A: Kurseinstieg (ca. 10 min)

1. **Titel: Modern Frontend Development 2026**
2. **Über mich** – 2025: [00-Agenda.pdf](../../../../modern-frontend-bsi-2025/00-CourseMaterial/00-Agenda.pdf) S. 2.
3. **Agenda der zwei Tage** – sieben Themenblöcke und Rückblick; Testing als roter Faden statt eigener Block.
4. **Was dieser Kurs erreichen will** – Frontend-Code verstehen, entwickeln und überprüfen; Abschlussziel: eine kleine Funktion beschreiben, umsetzen, erklären und ihre Abnahme begründen.
5. **So funktionieren die Übungen** – jede Übung hat einen eigenen lauffähigen Ausgangsstand; Lernziel, Abnahmekriterien, Vertiefung; manuell vollständig lösbar, Agent optional; nur Node.js, npm und Chrome nötig.

## Teil B: Projekt und Toolchain (ca. 35 min inkl. Übung Teil 1)

6. **Der Starter auf einen Blick** – Verzeichnisbaum mit Einstiegspunkt, Quellcode, Konfiguration; Live-Rundgang.
7. **Was eine Frontend-Toolchain erledigt** – Abhängigkeiten, Transformation, Typprüfung, Linting, Tests, Bundling; Diagramm «Quellcode → Entwicklung / Produktion».
8. **package.json und Lockfile** – Dependencies, DevDependencies, SemVer-Bereiche, `package-lock.json` als exakter Stand. 2025: S. 8–9.
9. **Reproduzierbare Installation** – Lockfile gegenüber Versionsbereichen; `npm ci` gegenüber `npm install`. 2025: S. 11.
10. **Projektbefehle sind der Vertrag** – `npm run dev`, `npm run check`, `npm test`, `npm run build`, `npm run e2e`; dieselben Befehle für Menschen, CI und Agenten. 2025: S. 21–22, gekürzt.
11. **Das npm-Ökosystem: Risiken** – Abhängigkeitsgraph, Supply-Chain-Vorfälle, `npm audit` und seine Grenzen, Install-Scripts, private Registries. 2025: S. 12–16, 19, 23 auf eine Folie verdichtet.
12. **Vite: Entwicklung und Produktion** – Native ES-Module im Dev Server, HMR, Produktionsbuild. 2025: S. 32–33; Build-Architektur aktualisieren (Rolldown, Oxc).
13. **Vite+: die Toolchain des Kurses** – eine Entwicklungsabhängigkeit für Dev Server, Check, Test und Build; Bausteine Vite, Rolldown, Vitest, Oxlint, Oxfmt; npm-Skripte rufen das lokale `vp` auf, `npx vp toolchain` zeigt die Versionen; `overrides` halten Vite und Vitest einheitlich. Globales `vp`-CLI nur als Hinweis.
14. **TypeScript wird transformiert, nicht geprüft** – Vite entfernt Typen; erst `npm run check` prüft. Live-Demo: Typfehler läuft im Browser, scheitert im Check.
15. **Linting und Formatierung** – Oxlint und Oxfmt in `vp check`; ESLint und Prettier als verbreitete Alternativen; Regeln als Teamvereinbarung. 2025: S. 25–26, gekürzt.
16. **Was im Build passiert** – Bundling, Minifizierung, Hashes, Lazy-Loading-Chunks. 2025: S. 27–29.
17. **Source Maps und DevTools** – vom gebündelten Code zurück zur TS-Datei; Breakpoint setzen. 2025: S. 34.
18. **Arbeiten in kleinen Schritten mit Git** – Diff lesen, Ausgangsstand wiederherstellen.
19. **Übung 1, Teil 1** – Projekt in Betrieb nehmen.

## Teil C: Testing-Grundlagen (ca. 50 min inkl. Übung Teil 2 und 3)

20. **Warum Tests schon am ersten Tag** – Tests als schnelle Rückmeldung, nicht als Pflichtübung am Ende.
21. **Testarten im Frontend** – Unit, Komponente, End-to-End; Node gegenüber Browser. 2025: S. 35–36; Hinweis, wann im Kurs welche Art vorkommt.
22. **Anatomie eines Vitest-Tests** – Codebeispiel mit Vorbereitung, Aktion, Erwartung.
23. **Die Testausgabe lesen** – Screenshot eines fehlschlagenden Tests: Expected / Received, Dateiposition.
24. **Testfälle aus Anforderungen ableiten** – Normalfall, Grenzfall, Fehlerfall an der Übungsfunktion.
25. **Übung 1, Teil 2** – Unit-Tests als Rückmeldung.
26. **Alle Unit-Tests grün – und trotzdem falsch** – Live: Interaktion auf der Übungsseite zeigt den eingebauten Fehler.
27. **Anatomie eines Playwright-Tests** – Seite öffnen, interagieren, erwarten; `getByRole`/`getByLabel`, Web-First Assertions; `webServer` startet den Dev Server. 2025: S. 38.
28. **Playwright-Werkzeuge** – UI-Modus, Codegen, Trace bei Fehlschlag; Chrome des Laptops statt Browser-Download (`channel: "chrome"`).
29. **Was ein grüner Test belegt – und was nicht** – Unit-Test gegenüber Ablauftest; absichtlich eingebauter Fehler als Kontrolle der Testaussage.
30. **Übung 1, Teil 3** – Fehler im Browser finden und mit einem Playwright-Test absichern.

## Teil D: Optionale Agenteneinbindung (ca. 20 min)

31. **Coding Agents im Kurs** – optional, gleicher Auftrag, gleiche Abnahme; kein Zugang erforderlich.
32. **Projektkontext für Agenten** – Beispiel einer knappen `AGENTS.md` mit Konventionen und Prüfkommandos.
33. **Ein guter Auftrag** – Ziel, Grenzen, überprüfbare Erwartungen; Gegenbeispiel eines vagen Auftrags.
34. **Der Arbeitszyklus** – implementieren → prüfen → korrigieren; Quellen: OpenAI, Claude Code Best Practices.
35. **Agenten brauchen Augen** – ohne Browser kennt der Agent nur den Code; mit Browser reproduziert er Verhalten und prüft seine Korrektur selbst.
36. **Optionen für den Browserzugriff** – Playwright CLI (Kurs: `npx playwright cli`, Teil von `@playwright/test`, funktioniert mit jedem Agenten mit Terminal), Chrome DevTools MCP (Console, Network, Performance; Anbindung an laufendes Chrome), eingebaute Browser von Agenten und Editoren; je ein Satz zu Stärken und Grenzen.
37. **Live-Demo** – Fehlerbeschreibung wie aus einem Ticket an den Agenten; er öffnet die Seite mit der Playwright CLI, reproduziert, korrigiert, prüft im Browser, schreibt einen Playwright-Regressionstest; Diff kontrollieren. Ersatz: vorbereiteter Ablauf mit Beispieldiff und Ausgabe der CLI.
38. **Sicherheit und Grenzen** – Rechte, Secrets, externe Anweisungen; Webseiteninhalte als Quelle für Prompt Injection; isoliertes Browserprofil, nur `localhost`. Quelle: GitHub Risks and Mitigations.
39. **Zusammenfassung Block 1** – Arbeitsablauf, der ab jetzt in jeder Übung gilt.

## Aus 2025 nicht übernehmen

- «The Future?» (S. 7), Alternativen-Katalog zu npm (S. 18), Node-Versionsmanager im Detail (S. 24): höchstens Backup-Folien.
