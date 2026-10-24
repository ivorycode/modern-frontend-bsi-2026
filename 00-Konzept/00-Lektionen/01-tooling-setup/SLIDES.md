# Folienvorschlag: Tooling, Projekt-Setup und Testing-Grundlagen

Erster Entwurf. «2025: S. x» verweist auf Seiten im Foliensatz [05-FrontendTooling.pdf](../../../../modern-frontend-bsi-2025/00-CourseMaterial/05-FrontendTooling.pdf), sofern nicht anders angegeben.

## Teil A: Kurseinstieg (ca. 15 min)

1. **Titel: Modern Frontend Development 2026**
2. **Über mich** – 2025: [00-Agenda.pdf](../../../../modern-frontend-bsi-2025/00-CourseMaterial/00-Agenda.pdf) S. 2.
3. **Agenda der zwei Tage** – sieben Themenblöcke und Rückblick; Testing als roter Faden statt eigener Block.
4. **Was dieser Kurs erreichen will** – Frontend-Code verstehen, entwickeln und überprüfen; Abschlussziel: eine kleine Funktion beschreiben, umsetzen, erklären und ihre Abnahme begründen.
5. **So funktionieren die Übungen** – jede Übung hat einen eigenen lauffähigen Ausgangsstand; Lernziel, Abnahmekriterien, Vertiefung; manuell vollständig lösbar, Agent optional.

## Teil B: Projekt und Toolchain (ca. 45 min)

6. **Der Starter auf einen Blick** – Verzeichnisbaum mit Einstiegspunkt, Quellcode, Konfiguration; Live-Rundgang.
7. **Was eine Frontend-Toolchain erledigt** – Abhängigkeiten, Transformation, Typprüfung, Linting, Tests, Bundling; Diagramm «Quellcode → Entwicklung / Produktion».
8. **package.json und Lockfile** – Dependencies, DevDependencies, SemVer-Bereiche, Lockfile als exakter Stand. 2025: S. 8–9.
9. **Reproduzierbare Installation** – Lockfile gegenüber Versionsbereichen; `vp install --frozen-lockfile` (pnpm) mit `npm ci` als bekanntem Gegenstück. 2025: S. 11.
10. **Projektbefehle sind der Vertrag** – `vp dev`, `vp check`, `vp test`, `vp build`, eigene Skripte mit `vp run`; dieselben Befehle für Menschen, CI und Agenten. 2025: S. 21–22, gekürzt.
11. **Das npm-Ökosystem: Risiken** – Abhängigkeitsgraph, Supply-Chain-Vorfälle, `npm audit` und seine Grenzen, private Registries. 2025: S. 12–16, 19, 23 auf eine Folie verdichtet.
12. **Vite: Entwicklung und Produktion** – Native ES-Module im Dev Server, HMR, Produktionsbuild. 2025: S. 32–33; Build-Architektur aktualisieren (Rolldown, Oxc).
13. **Vite+: die Toolchain des Kurses** – ein CLI für Paketverwaltung, Dev Server, Check, Test und Build; Bausteine Vite, Rolldown, Vitest, Oxlint, Oxfmt; `vp toolchain` zeigt die Versionen.
14. **TypeScript wird transformiert, nicht geprüft** – Vite entfernt Typen; erst `vp check` prüft. Live-Demo: Typfehler läuft im Browser, scheitert im Check.
15. **Linting und Formatierung** – Oxlint und Oxfmt in `vp check`; ESLint und Prettier als verbreitete Alternativen; Regeln als Teamvereinbarung. 2025: S. 25–26, gekürzt.
16. **Was im Build passiert** – Bundling, Minifizierung, Hashes, Lazy-Loading-Chunks. 2025: S. 27–29.
17. **Source Maps und DevTools** – vom gebündelten Code zurück zur TS-Datei; Breakpoint setzen. 2025: S. 34.
18. **Arbeiten in kleinen Schritten mit Git** – Diff lesen, Ausgangsstand wiederherstellen.

## Teil C: Testing-Grundlagen (ca. 30 min inkl. Übung)

19. **Warum Tests schon am ersten Tag** – Tests als schnelle Rückmeldung, nicht als Pflichtübung am Ende.
20. **Testarten im Frontend** – Unit, Komponente, End-to-End; Node gegenüber Browser. 2025: S. 35–36; Hinweis, wann im Kurs welche Art vorkommt.
21. **Anatomie eines Vitest-Tests** – Codebeispiel mit Vorbereitung, Aktion, Erwartung.
22. **Die Testausgabe lesen** – Screenshot eines fehlschlagenden Tests: Expected / Received, Dateiposition.
23. **Testfälle aus Anforderungen ableiten** – Normalfall, Grenzfall, Fehlerfall an der Übungsfunktion.
24. **Was ein grüner Test belegt – und was nicht** – absichtlich eingebauter Fehler als Kontrolle der Testaussage.
25. **Übung 1** – Verweis auf `EXERCISE.md`, Zeitrahmen, Abnahmekriterien.

## Teil D: Optionale Agenteneinbindung (ca. 15–20 min)

26. **Coding Agents im Kurs** – optional, gleicher Auftrag, gleiche Abnahme; kein Zugang erforderlich.
27. **Projektkontext für Agenten** – Beispiel einer knappen `AGENTS.md` mit Konventionen und Prüfkommandos.
28. **Ein guter Auftrag** – Ziel, Grenzen, überprüfbare Erwartungen; Gegenbeispiel eines vagen Auftrags.
29. **Der Arbeitszyklus** – implementieren → prüfen → korrigieren; Quellen: OpenAI, Claude Code Best Practices.
30. **Live-Demo** – kleine Änderung am Starter delegieren, Tests laufen lassen, Diff kontrollieren. Ersatz: vorbereiteter Ablauf mit Beispieldiff.
31. **Sicherheit und Grenzen** – Rechte, Secrets, externe Anweisungen; Quelle: GitHub Risks and Mitigations.
32. **Zusammenfassung Block 1** – Arbeitsablauf, der ab jetzt in jeder Übung gilt.

## Aus 2025 nicht übernehmen

- «The Future?» (S. 7), Alternativen-Katalog zu npm (S. 18), Node-Versionsmanager im Detail (S. 24): höchstens Backup-Folien.
