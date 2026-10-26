# Übung 1: Prämienrechner – Projekt in Betrieb nehmen, Unit-Tests und ein erster Playwright-Test

Sie arbeiten an einem kleinen Prämienrechner für eine Krankenversicherung. Versuchen Sie jeden Schritt zuerst selbst, bevor Sie den Lösungshinweis öffnen.

## Fachliche Regeln

Die fiktiven Tarifregeln R1 bis R7 und ein Rechenbeispiel stehen in [docs/REGELN.md](./docs/REGELN.md). Lesen Sie sie vor Beginn.

## Optional: mit einem Coding Agent

Die Schritte 2.4 und 3.3 bis 3.5 können Sie optional mit einem Coding Agent mit Terminalzugriff bearbeiten (z. B. Claude Code, Codex, GitHub Copilot, Cursor). Jeder dieser Schritte beginnt mit einem Auftrag für den Agenten; die Anleitung danach beschreibt, wie Sie ihn manuell lösen und das Ergebnis des Agenten prüfen. Hinweise für Agenten stehen in [AGENTS.md](./AGENTS.md).

Der Agent soll **dieses README nicht lesen**, weil es die Lösungshinweise enthält. Sonst schreibt er die Lösung ab, statt sie aus Code und Regeln herzuleiten. `AGENTS.md` verweist ihn deshalb auf `docs/REGELN.md` und untersagt das Lesen von `README.md`. Beachtet Ihr Agent `AGENTS.md` nicht, ergänzen Sie im Auftrag: «Lies `README.md` nicht.»

---

## Teil 1: Projekt in Betrieb nehmen

Führen Sie alle Befehle in diesem Ordner aus (`Exercises/01-tooling-setup`).

### Schritt 1.1: Abhängigkeiten installieren

```sh
npm ci
```

Alle Werkzeuge werden lokal installiert. Die npm-Skripte rufen das lokale `vp` von [Vite+](https://viteplus.dev/) auf; direkt rufen Sie es mit `npx vp …` auf.

Öffnen Sie `package.json`. Welche Pakete stehen unter `devDependencies`? Wozu dient der Abschnitt `overrides`?

<details>
<summary>Lösungshinweis</summary>

- `vite-plus`: Entwicklungsserver, Build, Vitest, Oxlint, Oxfmt. `@playwright/test`: Tests im Browser. `typescript`: Compiler für die Typprüfung.
- `npm ci` installiert exakt nach `package-lock.json` und bricht ab, wenn Lockfile und `package.json` nicht zusammenpassen (`npm install` würde das Lockfile anpassen). Daher reproduzierbar im Team und in CI.
- `overrides` erzwingt im ganzen Abhängigkeitsgraphen die Vite- und Vitest-Version von Vite+.

</details>

### Schritt 1.2: Entwicklungsserver starten

```sh
npm run dev
```

Öffnen Sie `http://localhost:5173/` in Chrome und vergleichen Sie das Ergebnis mit dem Beispiel in `docs/REGELN.md`.

Ändern Sie in `index.html` die Überschrift «Prämienrechner» und speichern Sie. Ändern Sie anschliessend in `src/main.ts` die Funktion `formatChf`, sodass `Fr.` statt `CHF` erscheint. Was passiert jeweils im Browser? Machen Sie beide Änderungen danach rückgängig.

<details>
<summary>Lösungshinweis</summary>

Die Seite aktualisiert sich ohne manuellen Reload (Hot Module Replacement, HMR). Weil `main.ts` beim Laden direkt Code ausführt, lädt Vite hier die ganze Seite neu; mit React oder Vue werden oft nur die geänderten Komponenten ersetzt.

Im Network-Tab sehen Sie: Im Entwicklungsmodus liefert Vite jede Datei einzeln als ES-Modul aus, ohne Bündelung.

</details>

### Schritt 1.3: Typfehler gegenüber Laufzeitverhalten

Fügen Sie am Ende von `src/main.ts` diese Zeile ein:

```ts
ageInput.value = 42;
```

Lädt die Seite weiterhin? Führen Sie in einem zweiten Terminal aus:

```sh
npm run check
```

Warum meldet `check` einen Fehler, obwohl die Seite läuft? Entfernen Sie die Zeile danach wieder.

<details>
<summary>Lösungshinweis</summary>

`check` meldet `TS2322: Type 'number' is not assignable to type 'string'`: `value` ist ein String. Zur Laufzeit wandelt der Browser die Zahl stillschweigend in `"40"` um.

Vite entfernt beim Ausliefern nur die Typannotationen, ohne Typprüfung. Die Typprüfung ist ein eigener Schritt (Editor, `npm run check`, CI). Anders als bei Java muss kein Compilerlauf vor dem Start erfolgreich sein.

Formatierungsabweichungen korrigiert `npx vp check --fix`.

</details>

### Schritt 1.4: Produktionsbuild

```sh
npm run build
```

Sehen Sie sich `dist/` an. Wie viele JavaScript-Dateien gibt es, und wie sehen sie aus? Wozu dient die Zeichenfolge im Dateinamen, z. B. `index-B3x9….js`? Mit `npm run preview` rufen Sie den Build unter `http://localhost:4173/` auf.

<details>
<summary>Lösungshinweis</summary>

- Alle Module sind in **eine** minifizierte JavaScript-Datei gebündelt (ohne Typen und Kommentare, kurze Namen).
- Die Zeichenfolge ist ein Hash des Inhalts. Der Browser darf die Datei unbegrenzt cachen und lädt nach einem Deployment trotzdem die neue Version (Cache-Busting); `index.html` verweist auf den aktuellen Namen.

</details>

Seit Vite 8.1 gibt es den **experimentellen** Bundled Dev Mode: Auch der Entwicklungsserver liefert gebündelte Dateien aus, HMR bleibt erhalten. Probieren Sie ihn mit `npx vp dev --experimental-bundle` aus (dauerhaft: `experimental: { bundledDev: true }` in `vite.config.ts`) und vergleichen Sie den Network-Tab mit Schritt 1.2.

<details>
<summary>Lösungshinweis</summary>

Statt jedes Modul einzeln lädt der Browser wenige gebündelte Dateien. Bei grossen Anwendungen mit Tausenden Modulen werden die vielen Einzelrequests zum Engpass, besonders hinter einem Firmenproxy. Gebündelt startet der Entwicklungsserver und lädt die Seite deutlich schneller neu; das Vite-Team nennt für eine Testanwendung mit 10 000 React-Komponenten etwa 15-mal schnelleren Start. Weil die Funktion experimentell ist, funktionieren noch nicht alle Plugins damit. Für diese kleine Übung bringt sie keinen spürbaren Vorteil.

</details>

### Schritt 1.5: Debuggen mit Source Maps

Öffnen Sie bei laufendem Entwicklungsserver die Chrome DevTools (Register Sources). Öffnen Sie mit `Cmd+P` bzw. `Ctrl+P` die Datei `premium.ts`. Setzen Sie einen Breakpoint in der ersten Zeile von `calculatePremium`. Wählen Sie im Formular eine andere Franchise.

<details>
<summary>Lösungshinweis</summary>

Der Debugger hält in der TypeScript-Datei an: Source Maps ordnen den ausgelieferten Code den Originalzeilen zu. Unter Scope sehen Sie `input`; mit `F10` (Step over) gehen Sie Zeile für Zeile weiter.

</details>

---

## Teil 2: Unit-Tests als Rückmeldung

### Schritt 2.1: Tests ausführen und lesen

```sh
npm test
```

Wie viele Testdateien und Tests laufen? Öffnen Sie `src/rounding.test.ts` und erklären Sie den ersten Test: Was ist Arrange, Act, Assert? Warum verwendet der Test «rundet mehrere Beträge» `toEqual` statt `toBe`?

<details>
<summary>Lösungshinweis</summary>

- Zwei Testdateien, neun Tests.
- Arrange: `const amount = 1.02`. Act: `roundToFiveRappen(amount)`. Assert: `expect(rounded).toBe(1)`.
- `toBe` vergleicht mit `Object.is` die Identität (wie `==` bei Objekten in Java); zwei Arrays mit gleichem Inhalt sind nicht identisch. `toEqual` vergleicht den Inhalt rekursiv (wie `equals`).
- Bei `toThrow(RangeError)` steht der Aufruf in einer Funktion: `expect(() => roundToFiveRappen(-1))`.

</details>

### Schritt 2.2: Einen Fehler über die Testausgabe finden

Ändern Sie in `src/premium.ts` den Rabatt des Hausarztmodells von `0.08` auf `0.1`. Führen Sie `npm test` erneut aus.

Welche Tests schlagen fehl? Was steht bei _Expected_, was bei _Received_? Auf welche Datei und Zeile verweist die Ausgabe?

<details>
<summary>Lösungshinweis</summary>

Zwei Tests schlagen fehl: «berücksichtigt Franchise, Hausarztmodell und Zahnversicherung» und «berechnet die Prämie für Kinder». Zum Beispiel `expected 311.4 to be 317.85`: Expected (317.85) ist der Wert im Test, Received (311.4) das Ergebnis. Die Ausgabe verweist auf das fehlgeschlagene `expect` (`src/premium.test.ts:25:29`), nicht auf die fehlerhafte Codezeile.

</details>

### Schritt 2.3: Korrigieren und erneut prüfen

Stellen Sie den Rabatt wieder auf `0.08` und führen Sie `npm test` aus. Alle Tests müssen bestehen.

Tipp: Mit `npx vp test watch` laufen die Tests bei jeder gespeicherten Änderung automatisch. Beenden mit `q`.

### Schritt 2.4: Fehlende Grenzfälle ergänzen

#### Optional: mit einem Coding Agent

> Prüfe, welche fachlichen Regeln aus `docs/REGELN.md` durch die Unit-Tests in `src/premium.test.ts` und `src/rounding.test.ts` nicht oder nur teilweise abgedeckt sind. Ergänze Tests für die fehlenden Grenzfälle, mindestens für die Altersgrenzen aus R1 (18 gegenüber 19 und 25 gegenüber 26 Jahren). Leite die erwarteten Werte aus den Regeln ab, nicht aus dem aktuellen Verhalten des Codes. Ändere den Code in `src/premium.ts` und `src/rounding.ts` nicht. Führe `npm test` aus, zeige die Ergebnisse und nenne die Herleitung der erwarteten Werte.

Kritisch prüfen:

- Stimmen die erwarteten Werte mit Ihrer eigenen Herleitung aus R2 und R3 überein (Tabelle im Lösungshinweis unten)?
- Prüfen die neuen Tests tatsächlich etwas? Führen Sie Schritt 2.5 mit den Tests des Agenten durch.
- Sind `src/premium.ts` und `src/rounding.ts` unverändert (`git diff`)?

#### Schritt für Schritt

Welche Regeln sind durch die vorhandenen Tests nicht oder nur teilweise geprüft? Ergänzen Sie in `src/premium.test.ts` Tests für die **Altersgrenzen** aus R1: 18 gegenüber 19 und 25 gegenüber 26 Jahren. Leiten Sie die erwarteten Werte aus den Regeln ab, nicht aus der aktuellen Ausgabe der Funktion.

<details>
<summary>Lösungshinweis</summary>

Mit Franchise 300, Standardmodell und ohne Zahnversicherung ergibt sich die Monatsprämie direkt aus R2 und R3:

| Alter | Gruppe           | Rechnung    | Monatsprämie |
| ----- | ---------------- | ----------- | ------------ |
| 18    | Kind             | 104.65 − 15 | 89.65        |
| 19    | junge Erwachsene | 329.80 − 0  | 329.80       |
| 25    | junge Erwachsene | 329.80 − 0  | 329.80       |
| 26    | Erwachsene       | 437.35 − 0  | 437.35       |

Mit `it.each` (wie `@ParameterizedTest` in JUnit):

```ts
describe("Altersgrenzen", () => {
  it.each([
    { age: 18, monthly: 89.65 },
    { age: 19, monthly: 329.8 },
    { age: 25, monthly: 329.8 },
    { age: 26, monthly: 437.35 },
  ])("berechnet für $age Jahre eine Monatsprämie von $monthly", ({ age, monthly }) => {
    const premium = calculatePremium({ age, deductible: 300, model: "standard", dental: false });

    expect(premium.monthly).toBe(monthly);
  });
});
```

Weitere sinnvolle Tests: ungültiges Alter (`-1`, `121`, `30.5`) mit `toThrow(RangeError)`; Rundung bei genau 2.5 Rappen in `rounding.test.ts` (`roundToFiveRappen(1.025)` ergibt `1.05`).

</details>

### Schritt 2.5: Prüfen, ob die neuen Tests etwas prüfen

Ändern Sie in `ageGroup` vorübergehend `age <= 18` zu `age < 18`. Die ursprünglichen Tests bestehen weiterhin. Schlägt mindestens einer Ihrer neuen Tests fehl? Wiederholen Sie das mit `age <= 25` zu `age < 25`. Stellen Sie den Code danach wieder her.

<details>
<summary>Lösungshinweis</summary>

Mit `age < 18` erwartet der Test für 18 Jahre 89.65, erhält 329.80 und schlägt fehl; mit `age < 25` der Test für 25 Jahre. Die ursprünglichen Tests fanden beide Fehler nicht.

Für den Rundungstest: Ersetzen Sie die Rundung vorübergehend durch `Math.ceil(amount * 20 - 0.5) / 20`. Sie rundet nur bei genau 2.5 Rappen falsch ab; nur Ihr neuer Test schlägt fehl.

</details>

---

## Teil 3: Ein Ablauf im Browser

Für die optionale Arbeit mit einem Coding Agent in den Schritten 3.3 bis 3.5: Mit der Playwright CLI (Teil von `@playwright/test`) öffnet, bedient und untersucht der Agent die laufende Seite, zum Beispiel:

```sh
npx playwright cli open --browser=chrome http://localhost:5173/
npx playwright cli snapshot            # Seitenstruktur mit Referenzen auf Elemente
npx playwright cli select "getByLabel('Franchise')" "2500"
npx playwright cli fill "getByLabel('Alter')" "10"
npx playwright cli console error       # Fehlermeldungen der Console
npx playwright cli close
```

Optional als Skill im Projekt ablegen: `npx playwright cli install --skills=claude` (Claude Code) bzw. `--skills=agents`. Alternativen: [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp) oder der eingebaute Browser Ihres Agenten oder Editors.

### Schritt 3.1: Den vorhandenen Playwright-Test ausführen und lesen

```sh
npm run e2e
```

Öffnen Sie `e2e/premium.spec.ts`. Wie findet der Test das Auswahlfeld, den Radiobutton und die Prämie? Worauf wartet `await expect(...).toHaveText(...)`?

<details>
<summary>Lösungshinweis</summary>

- Playwright startet über `webServer` in `playwright.config.ts` den Entwicklungsserver und öffnet die Seite im installierten Chrome (`channel: "chrome"`).
- Nutzernahe Locators: `getByLabel("Franchise")` über die sichtbare Beschriftung, `getByRole("radio", { name: "Hausarzt" })` über Rolle und Namen. Sie bleiben stabil, wenn sich die HTML-Struktur ändert.
- `toHaveText` wiederholt die Prüfung, bis der Text stimmt oder das Zeitlimit abläuft (Web-First Assertion). Feste Wartezeiten (`waitForTimeout`) sind nicht nötig.
- Mit `npx playwright test --ui` verfolgen Sie jeden Schritt im UI-Modus.

</details>

### Schritt 3.2: Den gemeldeten Fehler reproduzieren

Eine Kundin meldet:

> «Wenn ich das Alter meines Kindes eingebe, stimmt die Prämie manchmal nicht. Sie bleibt einfach bei der alten Zahl stehen.»

Alle Unit-Tests und der vorhandene Playwright-Test bestehen. Reproduzieren Sie den Fehler im Browser mit geöffneter Console der DevTools. Unter welchen Bedingungen tritt er auf, unter welchen nicht?

<details>
<summary>Lösungshinweis</summary>

1. Seite neu laden (Alter 40, Franchise CHF 300). Monatsprämie: CHF 437.35.
2. Franchise CHF 2500 wählen. Monatsprämie: CHF 322.35.
3. Als Alter `10` eingeben.

Die Auswahl zeigt «CHF 0», die Prämie bleibt bei CHF 322.35; korrekt wären CHF 104.65 (R7, R2). Die Console meldet `Uncaught RangeError: Franchise 2500 ist für dieses Alter nicht erlaubt` aus `calculatePremium`, aufgerufen von `renderPremium`.

Der Fehler tritt nur auf, wenn die Franchise für die neue Altersgruppe nicht erlaubt ist (1000, 2000, 2500 beim Wechsel zum Kind; 0, 600 beim Wechsel zur erwachsenen Person). 300 ist für alle erlaubt, daher «manchmal».

</details>

### Schritt 3.3: Die Ursache finden

#### Optional: mit einem Coding Agent

Starten Sie den Entwicklungsserver (`npm run dev`) und geben Sie dem Agenten diesen Auftrag:

> Kundenmeldung: «Wenn ich das Alter meines Kindes eingebe, stimmt die Prämie manchmal nicht. Sie bleibt einfach bei der alten Zahl stehen.» Reproduziere den Fehler auf dem laufenden Entwicklungsserver (`http://localhost:5173/`) mit der Playwright CLI und prüfe die Console. Finde heraus, unter welchen Bedingungen der Fehler auftritt und unter welchen nicht. Erkläre die Ursache anhand des Codes in `src/` und der fachlichen Regeln R1 bis R7 in `docs/REGELN.md`. Ändere noch keinen Code.

Kritisch prüfen:

- Hat der Agent den Fehler tatsächlich im Browser reproduziert (Schritte, Console-Meldung) oder nur aus dem Code geschlossen?
- Stimmt seine Erklärung mit dem Code und Ihren Beobachtungen aus Schritt 3.2 überein?
- Hat er trotz Auftrag Dateien geändert (`git status`)?

#### Schritt für Schritt

Lesen Sie den Event Handler für das Altersfeld in `src/main.ts`. Warum zeigt die Auswahl «CHF 0», während die Berechnung mit 2500 rechnet? Warum konnten die Unit-Tests diesen Fehler nicht finden?

<details>
<summary>Lösungshinweis</summary>

Der Handler setzt das neue Alter in `state` und baut die Franchise-Optionen neu auf, `state.deductible` bleibt aber 2500. Keine Option hat diesen Wert, also zeigt der Browser die erste («CHF 0»). Anzeige und Zustand laufen auseinander.

`calculatePremium` lehnt die ungültige Kombination korrekt mit einem `RangeError` ab (R3). `renderPremium` fängt ihn nicht ab, die alte Prämie bleibt stehen.

Die Unit-Tests prüfen nur `premium.ts`. Der Fehler liegt im Zusammenspiel von Oberfläche, Zustand und Fachlogik und zeigt sich erst durch eine Abfolge von Interaktionen.

</details>

### Schritt 3.4: Den Fehler mit einem Playwright-Test sichtbar machen

#### Optional: mit einem Coding Agent

> Schreibe in einer neuen Datei `e2e/age-change.spec.ts` einen Playwright-Test für den gemeldeten Fehler: Franchise CHF 2500 wählen, danach als Alter 10 eingeben. Leite die erwartete Franchise, Monatsprämie und Jahresprämie aus den Regeln in `docs/REGELN.md` ab, nicht aus dem aktuellen Verhalten. Verwende nutzernahe Locators wie `getByLabel` und keine festen Wartezeiten. Führe `npm run e2e` aus und zeige, dass der neue Test fehlschlägt. Ändere den Anwendungscode in `src/` nicht.

Kritisch prüfen:

- Ist der Test vor der Korrektur tatsächlich fehlgeschlagen, und zwar an der Prämie? Lassen Sie sich die Ausgabe zeigen oder führen Sie `npm run e2e` selbst aus.
- Sind die erwarteten Werte aus R2, R3 und R7 abgeleitet (CHF 104.65 pro Monat) oder aus dem aktuellen Verhalten abgeschrieben?
- Ist `src/` unverändert (`git diff`)?

#### Schritt für Schritt

Schreiben Sie in einer neuen Datei `e2e/age-change.spec.ts` einen Test, der die Schritte aus 3.2 ausführt und das richtige Ergebnis nach R7 erwartet. **Der Test muss vor der Korrektur fehlschlagen.** Kontrollieren Sie das mit `npm run e2e`.

Hilfsmittel: Codegen zeichnet Klicks auf und gibt sie als Testcode aus (Entwicklungsserver muss laufen):

```sh
npx playwright codegen --channel=chrome http://localhost:5173/
```

<details>
<summary>Lösungshinweis</summary>

```ts
import { expect, test } from "@playwright/test";

test("passt die Franchise an, wenn sie für das neue Alter nicht erlaubt ist", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Franchise").selectOption({ label: "CHF 2500" });

  await page.getByLabel("Alter").fill("10");

  await expect(page.getByLabel("Franchise")).toHaveValue("0");
  await expect(page.getByLabel("Monatsprämie")).toHaveText("CHF 104.65");
  await expect(page.getByLabel("Jahresprämie")).toHaveText("CHF 1255.80");
});
```

Vor der Korrektur: `Expected: "CHF 104.65"`, `Received: "CHF 322.35"`. `toHaveValue("0")` besteht schon vorher, denn die Anzeige sieht richtig aus; erst die Prämie deckt den Fehler auf.

Bei einem Fehlschlag liegt ein Trace in `test-results/`; `npx playwright show-trace <Pfad zur trace.zip>` zeigt jeden Schritt mit DOM und Console.

</details>

### Schritt 3.5: Den Fehler beheben

#### Optional: mit einem Coding Agent

> Behebe den Fehler in `src/main.ts`, sodass der Test in `e2e/age-change.spec.ts` besteht und Regel R7 aus `docs/REGELN.md` erfüllt ist. Behebe die Ursache, statt den Fehler mit einem `try`/`catch` zu verschlucken. Ändere den Test nicht. Führe danach `npm run check`, `npm test` und `npm run e2e` aus und zeige die Ergebnisse.

Kritisch prüfen:

- Behebt die Änderung die Ursache (R7) oder überdeckt sie nur das Symptom?
- Ist der Test unverändert (`git diff e2e/`)? Ein angepasster Test kann den Fehler verdecken.
- Hat der Agent Dateien ausserhalb des Auftrags geändert (`git diff`)?

#### Schritt für Schritt

Korrigieren Sie `src/main.ts`, sodass R7 erfüllt ist. Führen Sie danach alle Prüfungen aus:

```sh
npm run check
npm test
npm run e2e
```

<details>
<summary>Lösungshinweis</summary>

Passen Sie im Handler des Altersfelds die Franchise vor `renderDeductibleOptions()` an:

```ts
state.age = age;
const allowed = allowedDeductibles(age);
if (!allowed.includes(state.deductible)) {
  state.deductible = allowed[0];
}
renderDeductibleOptions();
renderPremium();
```

`allowedDeductibles` liefert aufsteigend sortiert, `allowed[0]` ist die tiefste erlaubte Franchise. Ein `try`/`catch`, das den Fehler verschluckt, überdeckt nur das Symptom; die Prämie bliebe falsch, und der Playwright-Test schlüge weiter fehl.

</details>

---

## Checkliste

- [ ] `npm run dev` läuft, Änderungen erscheinen ohne manuellen Reload.
- [ ] `npm run check`, `npm test`, `npm run e2e` und `npm run build` laufen ohne Fehler.
- [ ] Die ergänzten Unit-Tests schlagen bei den Fehlervarianten aus Schritt 2.5 fehl und bestehen beim korrekten Code.
- [ ] Der neue Playwright-Test schlägt vor der Korrektur fehl und besteht danach; nutzernahe Locators, keine festen Wartezeiten.
- [ ] Sie können erklären, warum ein Typfehler den Entwicklungsserver nicht stoppt und warum die Unit-Tests den Fehler aus Teil 3 nicht finden konnten.
