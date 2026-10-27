# Übung 3: Wörter laden – parallel, sequenziell, getestet

Eine Seite lädt den Satz «The quick brown fox jumps over the lazy dog» Wort für Wort von einer lokalen API. Jede Antwort kommt nach einer zufälligen Verzögerung von 0,2 bis 1,2 Sekunden. Im Moment lädt die Seite nur das erste Wort.

- **Teil 1:** Die Wörter parallel und sequenziell laden und beides testen.
- **Teil 2:** Fehler beim Laden sauber behandeln.
- **Vertiefung 1:** Eine Race Condition in einer Suche mit `AbortController` beheben.
- **Vertiefung 2:** Dieselbe Suche mit RxJS und `switchMap`.

Jeder Schritt hat einen ausklappbaren Lösungshinweis. Versuchen Sie es zuerst selbst.

**Optional mit Coding Agent:** Jeder Teil beginnt mit einem Auftrag, den Sie einem Coding Agent geben können. Mit der Anleitung «Schritt für Schritt» lösen Sie den Teil von Hand oder prüfen das Ergebnis des Agenten. Hinweise für den Agenten stehen in [AGENTS.md](./AGENTS.md).

---

## Teil 1: Parallel und sequenziell laden

### Optional: Auftrag für einen Coding Agent

Führen Sie zuerst Schritt 1.1 aus, damit API und Entwicklungsserver laufen.

> Setze in `src/sentence.ts` die Funktionen `loadSentenceParallel` und `loadSentenceSequential` um. Parallel: alle Wörter sofort anfragen, Ergebnis in der Reihenfolge des Satzes. Sequenziell: das nächste Wort erst anfragen, wenn das vorherige eingetroffen ist, und jedes Wort sofort über `onWord` melden. Ersetze in `src/sentence.test.ts` die `it.todo` «liefert die Wörter in der Reihenfolge des Satzes, auch wenn die Antworten umgekehrt eintreffen» und «fragt das nächste Wort erst an, wenn das vorherige eingetroffen ist» durch echte Tests mit der Attrappe aus `src/test-helpers.ts`. Zeige, dass der Test für die sequenzielle Variante fehlschlägt, wenn sie parallel lädt. Prüfe beide Varianten auf dem laufenden Entwicklungsserver (`http://localhost:5175/`) mit der Playwright CLI und beschreibe, wie viele Requests gleichzeitig offen sind. Ändere `server/api.ts`, `src/test-helpers.ts` und die Playwright-Tests nicht. Führe `npm run check`, `npm test` und `npm run e2e` aus; die Playwright-Tests zu Fehlern und zur Suche dürfen noch fehlschlagen.

Prüfen Sie das Ergebnis:

- Prüft der Test zur sequenziellen Variante die Reihenfolge der **Anfragen** (`requestedIndexes`)? Ein Test, der nur den fertigen Satz prüft, besteht auch mit paralleler Umsetzung.
- Verwenden die Tests echte Wartezeiten (`setTimeout` mit Verzögerung, `vi.waitFor`) oder echtes Netzwerk? Beides soll nicht vorkommen.
- Verwendet die sequenzielle Variante `forEach` mit `async`-Callback? Dann lädt sie in Wirklichkeit parallel.
- Sind `server/api.ts`, `src/test-helpers.ts` und `e2e/` unverändert (`git diff`)?

### Schritt für Schritt

#### Schritt 1.1: Projekt und API starten

Sie brauchen drei Terminals im Ordner `Exercises/03-async`:

```sh
npm ci
npm run api      # Terminal 1: API auf Port 3003
npm run dev      # Terminal 2: Entwicklungsserver auf Port 5175
```

Rufen Sie im Browser `http://localhost:3003/api/words/0` auf, danach `http://localhost:5175/api/words/0`. Im dritten Terminal messen Sie die Dauer einer Anfrage:

```sh
curl -w "\n%{time_total} s\n" http://localhost:3003/api/words/3
```

- Was liefert die API, und wie lange dauert eine Antwort?
- Warum funktioniert die Adresse auch auf Port 5175?

<details>
<summary>Lösungshinweis</summary>

Die API liefert JSON, z. B. `{"index":3,"word":"fox"}`, nach 0,2 bis 1,2 Sekunden.

`vite.config.ts` leitet alle Requests auf `/api` an `http://localhost:3003` weiter (`server.proxy`). Die Seite fragt also beim eigenen Origin an und braucht keine CORS-Freigabe.

Terminal 1 protokolliert jeden Request mit Status und Dauer, z. B. `GET /api/words/3?scenario=ok → 200 nach 734 ms`. Daran sehen Sie später, ob Requests gleichzeitig oder nacheinander kommen.

</details>

#### Schritt 1.2: Ausgangslage untersuchen

Öffnen Sie `http://localhost:5175/` in Chrome mit den DevTools, Tab **Network**, Filter **Fetch/XHR**. Klicken Sie «Parallel laden» und «Sequenziell laden». Lesen Sie `src/sentence.ts` und `src/sentence-view.ts` und führen Sie die Tests aus:

```sh
npm test
```

- Was zeigt die Seite, wie viele Requests sehen Sie?
- Warum erhält `load` in `sentence-view.ts` eine **Funktion** und nicht direkt das Promise, also `load(() => loadSentenceParallel(…))` statt `load(loadSentenceParallel(…))`?

<details>
<summary>Lösungshinweis</summary>

Beide Buttons zeigen nur «The», es gibt jeweils einen Request. Die beiden Funktionen laden bisher nur das erste Wort. Der Test «fragt alle Wörter sofort an und liefert den Satz» schlägt deshalb fehl.

Ein Promise steht für eine Operation, die **bereits läuft** – wie ein `CompletableFuture` in Java. Mit dem Promise als Argument wären die Requests schon gestartet, bevor `load` die Anzeige zurücksetzt und die Zeitmessung startet. Mit einer Funktion (vergleichbar mit einem `Supplier`) bestimmt `load`, wann das Laden beginnt.

</details>

#### Schritt 1.3: Die Testattrappe verstehen

Die Funktionen in `sentence.ts` bekommen die Lade-Funktion als Parameter (`fetchWord: FetchWord`). Die Seite übergibt die echte Funktion aus `word-api.ts`, die Tests eine Attrappe.

Lesen Sie `createFakeFetchWord` und `flushPromises` in `src/test-helpers.ts` und den Test «fragt alle Wörter sofort an und liefert den Satz» in `src/sentence.test.ts`.

- Was gibt `fake.fetchWord(3)` zurück, und wann wird das Promise erfüllt?
- Wozu dient `await flushPromises()`? Wartet der Test dabei eine bestimmte Zeit?

<details>
<summary>Lösungshinweis</summary>

`fake.fetchWord(3)` gibt ein Promise zurück, das offen bleibt, bis der Test `fake.respond(3, "fox")` oder `fake.fail(3, error)` aufruft. `fake.requestedIndexes()` liefert die angefragten Indizes in der Reihenfolge der Aufrufe. Der Test bestimmt also selbst, **wann** und **in welcher Reihenfolge** Antworten kommen – ohne Netzwerk und ohne Zufall.

`Promise.withResolvers()` erzeugt ein Promise und liefert `resolve` und `reject` dazu, ähnlich wie in Java ein `CompletableFuture`, das man später mit `complete()` oder `completeExceptionally()` abschliesst.

JavaScript läuft im Browser in einem einzigen Thread mit einer Event Loop. Code nach einem `await` läuft nicht sofort weiter, sondern als **Microtask** in einer Warteschlange. `flushPromises` plant mit `setTimeout(…, 0)` eine normale Task ein. Diese läuft erst, wenn alle Microtasks abgearbeitet sind. Danach ist aller Code weitergelaufen, der nicht auf eine offene Antwort wartet. Der Test wartet also nicht auf eine Uhr, sondern auf einen Zustand.

</details>

#### Schritt 1.4: Parallel laden mit Promise.all

Setzen Sie `loadSentenceParallel` um: alle Wörter sofort anfragen und die Promises mit `Promise.all` zusammenführen. Die Anzahl Wörter steht in `WORD_COUNT` (`word-api.ts`).

Führen Sie `npm test` aus und probieren Sie «Parallel laden» im Browser.

<details>
<summary>Lösungshinweis</summary>

```ts
import { WORD_COUNT, type FetchWord } from "./word-api.ts";

export async function loadSentenceParallel(fetchWord: FetchWord): Promise<string[]> {
  const requests = Array.from({ length: WORD_COUNT }, (_, index) => fetchWord(index));
  return Promise.all(requests);
}
```

`Array.from({ length: 9 }, (_, index) => …)` erzeugt ein Array mit neun Einträgen, ähnlich wie `IntStream.range(0, 9).mapToObj(…)`. Alle neun Aufrufe von `fetchWord` starten sofort. `Promise.all` wird erfüllt, wenn alle Promises erfüllt sind, und liefert ein Array der Ergebnisse (vergleichbar mit `CompletableFuture.allOf` plus Einsammeln der Resultate).

</details>

#### Schritt 1.5: Reihenfolge der Antworten testen

Die echten Antworten kommen in zufälliger Reihenfolge. Ersetzen Sie in `src/sentence.test.ts` das `it.todo` «liefert die Wörter in der Reihenfolge des Satzes, auch wenn die Antworten umgekehrt eintreffen» durch einen echten Test: Beantworten Sie die Anfragen vom letzten zum ersten Wort.

Welche fehlerhafte Umsetzung würde dieser Test finden, der vorbereitete Test aber nicht?

<details>
<summary>Lösungshinweis</summary>

```ts
it("liefert die Wörter in der Reihenfolge des Satzes, auch wenn die Antworten umgekehrt eintreffen", async () => {
  const fake = createFakeFetchWord();

  const loading = loadSentenceParallel(fake.fetchWord);
  await flushPromises();

  for (let index = WORDS.length - 1; index >= 0; index--) {
    fake.respond(index, WORDS[index]);
    await flushPromises();
  }

  await expect(loading).resolves.toEqual(WORDS);
});
```

Der Test findet eine Umsetzung, die die Wörter in der Reihenfolge ihres **Eintreffens** sammelt:

```ts
const words: string[] = [];
const requests = Array.from({ length: WORD_COUNT }, (_, index) =>
  fetchWord(index).then((word) => words.push(word)),
);
await Promise.all(requests);
return words; // ["dog", "lazy", "the", …]
```

`Promise.all` liefert die Ergebnisse dagegen immer in der Reihenfolge der übergebenen Promises.

</details>

#### Schritt 1.6: Sequenziell laden, zuerst der Test

Ersetzen Sie das `it.todo` «fragt das nächste Wort erst an, wenn das vorherige eingetroffen ist» durch einen Test:

1. Nach dem Start ist nur Wort 0 angefragt.
2. Nach der Antwort für Wort 0 wurde `onWord` mit «The» aufgerufen, und erst jetzt ist Wort 1 angefragt.
3. Nach allen Antworten liefert die Funktion den ganzen Satz, und `onWord` wurde für jedes Wort in der richtigen Reihenfolge aufgerufen.

Für `onWord` verwenden Sie eine Spy-Funktion (wie ein Mock in Mockito): `const onWord = vi.fn();`, `vi` aus `vite-plus/test` importieren. Der neue Test muss zuerst fehlschlagen.

Setzen Sie danach `loadSentenceSequential` um, bis der Test besteht. Ersetzen Sie die Umsetzung zur Probe durch eine parallele: Der Test muss dann fehlschlagen.

<details>
<summary>Lösungshinweis</summary>

```ts
it("fragt das nächste Wort erst an, wenn das vorherige eingetroffen ist", async () => {
  const fake = createFakeFetchWord();
  const onWord = vi.fn();

  const loading = loadSentenceSequential(fake.fetchWord, onWord);
  await flushPromises();
  expect(fake.requestedIndexes()).toEqual([0]);

  fake.respond(0, "The");
  await flushPromises();
  expect(onWord).toHaveBeenCalledWith("The");
  expect(fake.requestedIndexes()).toEqual([0, 1]);

  for (let index = 1; index < WORDS.length; index++) {
    fake.respond(index, WORDS[index]);
    await flushPromises();
  }

  await expect(loading).resolves.toEqual(WORDS);
  expect(onWord.mock.calls.map(([word]) => word)).toEqual(WORDS);
});
```

```ts
export async function loadSentenceSequential(
  fetchWord: FetchWord,
  onWord: (word: string) => void,
): Promise<string[]> {
  const words: string[] = [];
  for (let index = 0; index < WORD_COUNT; index++) {
    const word = await fetchWord(index);
    onWord(word);
    words.push(word);
  }
  return words;
}
```

`await` in der Schleife hält die Funktion an, bis das Wort da ist. Anders als `future.get()` in Java blockiert `await` aber keinen Thread: Die Funktion gibt den einzigen Thread frei und läuft später weiter. Die Seite bleibt bedienbar.

Mit einer parallelen Umsetzung sind nach dem ersten `flushPromises` alle neun Wörter angefragt, und der Test schlägt bei `toEqual([0])` fehl.

</details>

#### Schritt 1.7: Beide Varianten im Network-Tab vergleichen

1. Blenden Sie im Network-Tab die Spalte **Waterfall** ein (Rechtsklick auf eine Spaltenüberschrift) und leeren Sie die Liste (🚫).
2. Klicken Sie «Parallel laden» und notieren Sie die Dauer unter dem Satz.
3. Leeren Sie die Liste und klicken Sie «Sequenziell laden».
4. Klicken Sie in der parallelen Variante auf den Request für Wort 8 und öffnen Sie den Tab **Timing**.

- Wovon hängt die Gesamtdauer der beiden Varianten ab?
- Warum starten bei «Parallel laden» nur sechs Requests sofort?
- Wann ist sequenzielles Laden trotzdem richtig?

<details>
<summary>Lösungshinweis</summary>

Parallel entspricht die Dauer etwa der **langsamsten** Antwort, also höchstens rund 1,2 Sekunden. Sequenziell ist sie die **Summe** aller Antworten, meist 6 bis 8 Sekunden. Im Wasserfall sieht man die Balken nebeneinander beziehungsweise als Treppe.

Chrome öffnet über HTTP/1.1 höchstens sechs Verbindungen pro Host. Die übrigen Requests warten; der Tab **Timing** zeigt das als «Queueing» oder «Stalled». Mit HTTP/2 entfällt diese Grenze. Der Vite-Entwicklungsserver verwendet HTTP/1.1.

Sequenziell ist richtig, wenn ein Request vom Ergebnis des vorherigen abhängt (z. B. Paging mit einem Cursor) oder der Server nur wenige gleichzeitige Requests erlaubt. Ein unbeabsichtigter Wasserfall durch `await` in einer Schleife ist dagegen ein häufiges Performance-Problem.

</details>

#### Schritt 1.8: Teil 1 prüfen

```sh
npm run check
npm test
npm run e2e
```

`npx vp check --fix` korrigiert Formatierungsfehler. `npm run e2e` startet API und Entwicklungsserver bei Bedarf selbst.

Erwartet: `check` und `test` ohne Fehler (sechs Tests noch `todo`). Die Playwright-Tests «lädt alle Wörter parallel» und «lädt die Wörter nacheinander …» bestehen. Die Tests zu Fehlern und zur Suche folgen später.

---

## Teil 2: Fehler behandeln

### Optional: Auftrag für einen Coding Agent

> In der Auswahl «Szenario» liefert «Wort 5 schlägt fehl» für Wort 5 einen HTTP-Fehler. Reproduziere auf dem laufenden Entwicklungsserver (`http://localhost:5175/`) mit der Playwright CLI, was beide Lade-Varianten dann anzeigen, und prüfe Console und Network. Erkläre, warum die Ladeanzeige stehen bleibt. Ersetze die beiden `it.todo` zu abgelehnten Ladevorgängen in `src/sentence.test.ts` durch echte Tests und zeige, dass sie fehlschlagen würden, wenn `loadSentenceSequential` Fehler verschluckt. Behebe den Fehler in `src/sentence-view.ts`: Die Seite zeigt die Meldung aus dem Fehler an, Ladeanzeige und deaktivierte Buttons werden in jedem Fall zurückgesetzt. Fange den Fehler nicht in `src/sentence.ts` ab. Führe `npm run check`, `npm test` und `npm run e2e` aus; nur die Suchtests dürfen noch fehlschlagen.

Prüfen Sie das Ergebnis:

- Wird die Ladeanzeige in einem `finally` zurückgesetzt?
- Geben `loadSentenceParallel` und `loadSentenceSequential` den Fehler weiter, statt ein leeres oder unvollständiges Array zu liefern?
- Prüft der Test zur sequenziellen Variante, dass nach dem Fehler keine weiteren Wörter angefragt werden?

### Schritt für Schritt

#### Schritt 2.1: Fehler im Browser reproduzieren

Laden Sie die Seite neu, wählen Sie «Wort 5 schlägt fehl» und öffnen Sie **Console** und **Network**. Probieren Sie «Parallel laden» und, nach einem Neuladen, «Sequenziell laden».

- Was zeigen Seite und Console?
- Welche Requests sehen Sie, mit welchem Status?
- Wo geht der Fehler verloren? Verfolgen Sie ihn von `fetchWord` bis zum Click-Handler in `sentence-view.ts`.

<details>
<summary>Lösungshinweis</summary>

In beiden Varianten bleibt «Lädt …» stehen, die Buttons bleiben deaktiviert. Die Console meldet:

```text
Uncaught (in promise) Error: Wort 5 konnte nicht geladen werden (HTTP 500).
```

Parallel gehen alle neun Requests raus; Wort 5 antwortet mit 500. Sequenziell erscheint «The quick brown fox», dann bricht das Laden ab.

Der Weg des Fehlers: `fetchWord` lehnt ab → `Promise.all` bzw. `await` in der Schleife lehnt ab → `loadSentence…` lehnt ab → `await loadSentence()` in `load` wirft → `setLoading(false)` läuft nie. Niemand wartet auf das Promise des Click-Handlers. Der Browser meldet deshalb eine **unbehandelte Rejection** – vergleichbar mit einer Exception in einem `CompletableFuture` in Java, die niemand abfragt.

</details>

#### Schritt 2.2: Fehlerfall testen

Ersetzen Sie die beiden übrigen `it.todo` in `src/sentence.test.ts`:

- «lehnt ab, wenn ein Wort nicht geladen werden kann» (parallel)
- «lehnt ab, wenn ein Wort nicht geladen werden kann, und fragt keine weiteren Wörter an» (sequenziell)

Eine Anfrage lehnen Sie mit `fake.fail(…)` ab. Eine erwartete Rejection prüfen Sie mit `await expect(promise).rejects.toThrow(…)`.

Die Tests bestehen vermutlich sofort. Warum? Verschlucken Sie zur Probe den Fehler in `loadSentenceSequential` (`try`/`catch` um das `await`, im `catch` ein `break`). Schlägt Ihr Test jetzt fehl?

<details>
<summary>Lösungshinweis</summary>

```ts
it("lehnt ab, wenn ein Wort nicht geladen werden kann", async () => {
  const fake = createFakeFetchWord();

  const loading = loadSentenceParallel(fake.fetchWord);
  await flushPromises();
  fake.fail(4, new Error("Wort 5 konnte nicht geladen werden (HTTP 500)."));

  await expect(loading).rejects.toThrow("Wort 5 konnte nicht geladen werden");
});
```

```ts
it("lehnt ab, wenn ein Wort nicht geladen werden kann, und fragt keine weiteren Wörter an", async () => {
  const fake = createFakeFetchWord();

  const loading = loadSentenceSequential(fake.fetchWord, () => {});
  await flushPromises();
  fake.fail(0, new Error("Wort 1 konnte nicht geladen werden (HTTP 500)."));

  await expect(loading).rejects.toThrow("Wort 1 konnte nicht geladen werden");
  expect(fake.requestedIndexes()).toEqual([0]);
});
```

Die Tests bestehen sofort, weil Rejections automatisch weitergegeben werden: `Promise.all` lehnt ab, sobald ein Promise abgelehnt wird, und `await` auf ein abgelehntes Promise wirft wie ein `throw`. Die Tests sichern dieses Verhalten gegen spätere Änderungen ab. Mit dem verschluckten Fehler schlagen sie fehl – erst damit wissen Sie, dass sie einen Fehler überhaupt erkennen.

</details>

#### Schritt 2.3: Ladeanzeige zuverlässig zurücksetzen

Ändern Sie `load` in `src/sentence-view.ts`:

- Bei einem Fehler erscheint die Fehlermeldung im Element `.error` (`hidden` entfernen).
- Ladeanzeige und Buttons werden in **jedem** Fall zurückgesetzt.

Behandeln Sie den Fehler in der Ansicht, nicht in `sentence.ts`. Warum?

<details>
<summary>Lösungshinweis</summary>

```ts
async function load(loadSentence: () => Promise<string[]>): Promise<void> {
  sentence.value = "";
  error.hidden = true;
  duration.textContent = "";
  setLoading(true);
  const started = performance.now();

  try {
    const words = await loadSentence();
    sentence.value = words.join(" ");
    duration.textContent = `Geladen in ${((performance.now() - started) / 1000).toFixed(1)} s`;
  } catch (err) {
    error.textContent = err instanceof Error ? err.message : String(err);
    error.hidden = false;
  } finally {
    setLoading(false);
  }
}
```

`try`/`catch`/`finally` funktioniert mit `await` wie in Java. Anders als in Java kann `throw` jeden Wert werfen, nicht nur `Error`-Objekte; darum die Prüfung `err instanceof Error`.

`sentence.ts` weiss nicht, wie die Seite Fehler darstellt. Die Lade-Funktionen melden den Fehler an den Aufrufer, die Ansicht entscheidet über die Darstellung – wie eine Service-Methode, die eine Exception wirft, statt sie zu verschlucken.

</details>

#### Schritt 2.4: Was mit den übrigen Requests geschieht

Wiederholen Sie «Parallel laden» mit «Wort 5 schlägt fehl» und beobachten Sie Network-Tab und Terminal 1.

- Erscheint die Fehlermeldung sofort nach der Antwort für Wort 5 oder erst nach allen Antworten?
- Was geschieht mit den Requests, die noch laufen?
- Wann wäre `Promise.allSettled` die bessere Wahl?

<details>
<summary>Lösungshinweis</summary>

`Promise.all` lehnt ab, **sobald** das erste Promise abgelehnt wird. Die übrigen Requests laufen trotzdem zu Ende, ihre Ergebnisse werden verworfen. Ein Promise lässt sich nicht von aussen abbrechen; einen laufenden `fetch` bricht nur ein `AbortSignal` ab (siehe Vertiefung 1).

`Promise.allSettled` wartet auf alle Promises und liefert pro Eintrag `{ status: "fulfilled", value }` oder `{ status: "rejected", reason }`. Das passt, wenn Teilergebnisse nützlich sind, z. B. bei einem Dashboard mit mehreren unabhängigen Kacheln.

</details>

#### Schritt 2.5: Alles prüfen

```sh
npm run check
npm test
npm run e2e
```

Erwartet: `check` und `test` ohne Fehler (vier Tests der Vertiefungen noch `todo`). Alle Playwright-Tests zu den Wörtern bestehen, die beiden Suchtests noch nicht.

---

## Kontrollfragen

1. Jemand schreibt die sequenzielle Variante so: `indexes.forEach(async (index) => onWord(await fetchWord(index)))`. Was passiert?
2. Was ist in einer `async`-Funktion der Unterschied zwischen `return Promise.all(requests)` und `return await Promise.all(requests)`?
3. Warum genügt in den Tests ein einzelnes `await Promise.resolve()` nicht zuverlässig?
4. Was belegen die Unit-Tests mit der Attrappe, was erst die Playwright-Tests?

<details>
<summary>Antworten</summary>

1. `forEach` ruft den `async`-Callback für alle Einträge sofort auf und ignoriert die zurückgegebenen Promises. Alle Requests laufen parallel, `onWord` meldet die Wörter in der Reihenfolge des Eintreffens, und die äussere Funktion wartet auf nichts. Fehler werden zu unbehandelten Rejections. Sequenziell: `for` oder `for…of` mit `await`. Parallel: `map` mit `Promise.all`.
2. Das Ergebnis ist dasselbe. Der Unterschied zeigt sich nur in einem umgebenden `try`/`catch` oder `finally`: Nur mit `await` landet eine Rejection im `catch` dieser Funktion, und `finally` läuft erst nach dem Ende von `Promise.all`.
3. `await Promise.resolve()` lässt nur eine Runde Microtasks laufen. Bis die Umsetzung nach einer Antwort das nächste Wort anfragt, können mehrere Runden nötig sein. Der Test hinge dann von Details der Umsetzung ab. `flushPromises` wartet, bis die Microtask-Queue leer ist.
4. Die Unit-Tests belegen die Logik in `sentence.ts`: welche Wörter wann angefragt werden, die Reihenfolge des Ergebnisses und die Weitergabe von Fehlern – schnell und reproduzierbar. Die Playwright-Tests belegen das Zusammenspiel mit echter API und Browser: Proxy, gleichzeitige Requests, Fehlermeldung und Ladeanzeige.

</details>

---

## Vertiefung 1: Veraltete Suchantworten

Die Seite `http://localhost:5175/suche.html` sucht bei jeder Eingabe nach Frontend-Begriffen. Suchbegriffe mit ein oder zwei Zeichen beantwortet die API absichtlich erst nach 2 Sekunden, längere nach 0,2 Sekunden. Bei schnellem Tippen überschreibt ein älteres Resultat das neuere.

Die Logik steht in `src/search.ts` (`createSearch`), die Tests in `src/search.test.ts`.

### Optional: Auftrag für einen Coding Agent

> Kundenmeldung: «Die Suche zeigt manchmal Treffer zu einem Begriff, den ich gar nicht mehr eingegeben habe.» Reproduziere den Fehler auf `http://localhost:5175/suche.html` mit der Playwright CLI und erkläre die Ursache mit den Beobachtungen im Network-Tab. Schreibe in `src/search.test.ts` zuerst einen Test, der fehlschlägt: zwei überlappende Suchen, die ältere antwortet zuletzt, angezeigt werden die Treffer der neueren. Behebe den Fehler in `createSearch`, indem die vorherige Suche mit `AbortController` abgebrochen wird. Ein Abbruch darf keine Fehlermeldung anzeigen, ein echter Fehler weiterhin schon. Ersetze das zweite `it.todo` durch einen Test dafür. Debouncing ist keine Lösung für diesen Fehler. Ändere `server/api.ts`, `src/test-helpers.ts` und die Playwright-Tests nicht. Führe `npm run check`, `npm test` und `npm run e2e` aus; der Suchtest «rxjs: …» darf noch fehlschlagen.

Prüfen Sie das Ergebnis:

- Hat der Agent nur Debouncing eingebaut? Das behebt den Fehler nicht (Schritt V1.4).
- Prüft der Code im `catch` das Signal **dieser** Suche oder `controller.signal`, das inzwischen zur nächsten Suche gehört?
- Zeigt die Seite bei einem echten Fehler weiterhin eine Meldung?

### Schritt für Schritt

#### Schritt V1.1: Fehler reproduzieren

Öffnen Sie `http://localhost:5175/suche.html` mit Network-Tab. Tippen Sie zügig «react» und warten Sie zwei Sekunden. Tippen Sie danach langsam, mit mehr als zwei Sekunden Pause nach jedem Buchstaben.

Was sehen Sie, und in welcher Reihenfolge kommen die Antworten?

<details>
<summary>Lösungshinweis</summary>

Zuerst erscheinen die Treffer für «react». Etwa zwei Sekunden später wechselt die Anzeige zu den Treffern für «re», obwohl im Feld «react» steht. Die Requests `q=r` und `q=re` dauern zwei Sekunden, die übrigen 0,2 Sekunden; die Antwort für «re» kommt zuletzt.

Beim langsamen Tippen tritt der Fehler nicht auf. Er hängt vom Timing ab und fällt deshalb mit schnellem lokalem Netz oft nicht auf.

</details>

#### Schritt V1.2: Ursache untersuchen

1. Wählen Sie im Network-Tab die Drosselung **Slow 4G** und wiederholen Sie die Eingabe.
2. Setzen Sie im Tab **Sources** einen Breakpoint auf `view.showResults(query, results);` in `src/search.ts` (Datei mit Ctrl+P bzw. Cmd+P öffnen). Tippen Sie «react» und prüfen Sie bei jedem Halt `query` unter **Scope**.
3. Skizzieren Sie den zeitlichen Ablauf der Suchen nach «re» und «react».

<details>
<summary>Lösungshinweis</summary>

Der Debugger hält zuerst mit `query = "rea"`, `"reac"` und `"react"`, rund zwei Sekunden später noch mit `"r"` und `"re"`.

```text
Zeit ──────────────────────────────────────────────────►
Eingabe «re»     ├── Request q=re ──────────────────────┤ showResults("re")   ✗ überschreibt
Eingabe «react»       ├── q=react ──┤ showResults("react")
```

Jede Eingabe startet eine eigene Suche. Wer zuletzt antwortet, bestimmt die Anzeige. Das ist eine **Race Condition** – auch ohne mehrere Threads, denn die Requests laufen nebenläufig.

</details>

#### Schritt V1.3: Fehlschlagenden Test schreiben

Ersetzen Sie in `src/search.test.ts` das `it.todo` «zeigt die Treffer der neueren Suche, auch wenn die ältere zuletzt antwortet» durch einen Test. Die Attrappe `createFakeSearchTerms` funktioniert wie die aus Teil 1, mit dem Suchbegriff statt des Index. `flushPromises` müssen Sie zusätzlich importieren.

Der Test muss mit dem bisherigen Code fehlschlagen.

<details>
<summary>Lösungshinweis</summary>

```ts
it("zeigt die Treffer der neueren Suche, auch wenn die ältere zuletzt antwortet", async () => {
  const fake = createFakeSearchTerms();
  const view = createFakeView();
  const search = createSearch(fake.searchTerms, view);

  const older = search("re");
  const newer = search("react");
  fake.respond("react", ["React"]);
  await flushPromises();
  fake.respond("re", ["React", "Redux", "Remix"]);
  await Promise.all([older, newer]);

  expect(view.showResults).toHaveBeenCalledTimes(1);
  expect(view.showResults).toHaveBeenLastCalledWith("react", ["React"]);
});
```

Der Test stellt genau die Reihenfolge her, die im Browser nur bei schnellem Tippen auftritt.

</details>

#### Schritt V1.4: Hilft Debouncing?

Eine Kollegin schlägt vor, die Suche erst 300 Millisekunden nach der letzten Eingabe zu starten (Debouncing). Behebt das den Fehler?

<details>
<summary>Lösungshinweis</summary>

Nein. Debouncing spart Requests, die Race Condition bleibt: Tippt jemand «re», wartet eine halbe Sekunde und tippt dann «act», laufen wieder zwei Suchen, und die langsame Antwort für «re» gewinnt. Ihr Test aus Schritt V1.3 schlägt auch mit Debouncing fehl.

</details>

#### Schritt V1.5: Vorherige Suche abbrechen

Ändern Sie `createSearch`: Jede neue Suche bricht die vorherige mit einem `AbortController` ab. `searchTerms` nimmt dafür ein `AbortSignal` als zweiten Parameter und reicht es an `fetch` weiter.

Ein abgebrochener `fetch` lehnt mit einem `AbortError` ab. Dafür darf keine Fehlermeldung erscheinen; ein echter Fehler muss weiterhin angezeigt werden.

Ersetzen Sie danach das `it.todo` «bricht die vorherige Suche ab und zeigt dafür keine Fehlermeldung» durch einen Test. `fake.isAborted("re")` prüft, ob eine Suche abgebrochen wurde.

<details>
<summary>Lösungshinweis</summary>

```ts
export function createSearch(
  searchTerms: SearchTerms,
  view: SearchView,
): (query: string) => Promise<void> {
  let controller: AbortController | undefined;

  return async (query) => {
    controller?.abort();
    controller = new AbortController();
    const signal = controller.signal;

    try {
      const results = await searchTerms(query, signal);
      view.showResults(query, results);
    } catch {
      if (signal.aborted) return;
      view.showError("Die Suche ist fehlgeschlagen.");
    }
  };
}
```

`controller` liegt in der Closure und bleibt zwischen den Aufrufen erhalten. `AbortController` ist vergleichbar mit `future.cancel()` in Java, nur dass Auslöser (`AbortController`) und Signal (`AbortSignal`) getrennt sind.

Wichtig ist die lokale Konstante `signal`: Im `catch` gehört `controller` schon zur **nächsten** Suche. `controller.signal.aborted` wäre `false`, und der Abbruch erschiene als Fehler.

```ts
it("bricht die vorherige Suche ab und zeigt dafür keine Fehlermeldung", async () => {
  const fake = createFakeSearchTerms();
  const view = createFakeView();
  const search = createSearch(fake.searchTerms, view);

  const older = search("re");
  const newer = search("react");
  expect(fake.isAborted("re")).toBe(true);

  fake.respond("react", ["React"]);
  await Promise.all([older, newer]);

  expect(view.showError).not.toHaveBeenCalled();
});
```

Im Network-Tab erscheinen abgebrochene Requests als «(canceled)».

</details>

#### Schritt V1.6: Prüfen

```sh
npm run check
npm test
npm run e2e
```

Erwartet: Unit-Tests und der Playwright-Test «promise: …» bestehen. Der Test «rxjs: …» folgt in Vertiefung 2.

---

## Vertiefung 2: Dieselbe Suche mit RxJS und switchMap

Angular arbeitet mit **Observables** aus [RxJS](https://rxjs.dev/), dem JavaScript-Gegenstück zu RxJava. Ein Promise liefert **ein** zukünftiges Ergebnis, ein Observable einen Strom von beliebig vielen Werten. Die Eingaben in ein Suchfeld sind so ein Strom.

Unter `http://localhost:5175/suche.html?umsetzung=rxjs` verwendet die Seite `searchResults` aus `src/search-rx.ts`. `src/search-main.ts` macht aus den `input`-Events mit `fromEvent` einen Strom von Suchbegriffen. Gesucht wird mit `searchTerms$` aus `src/search-api.ts`: Sie liefert statt eines Promise ein Observable, erzeugt mit `fromFetch` aus `rxjs/fetch`.

Ein Observable lässt sich im Gegensatz zu einem Promise abbrechen: Wer sich abmeldet (`unsubscribe`), beendet die Arbeit dahinter. Den Abbruch, den Sie in Vertiefung 1 selbst gebaut haben, liefert RxJS hier mit.

### Optional: Auftrag für einen Coding Agent

> Die RxJS-Variante der Suche (`http://localhost:5175/suche.html?umsetzung=rxjs`, `src/search-rx.ts`) zeigt nach schnellem Tippen veraltete Treffer. Reproduziere das mit der Playwright CLI und erkläre, warum `mergeMap` dazu führt. Ersetze in `src/search-rx.test.ts` zuerst das `it.todo` «liefert nur die Treffer der neueren Suche, auch wenn die ältere zuletzt antwortet» durch einen fehlschlagenden Test mit einem `Subject` und der Attrappe `createFakeSearchTerms$` aus `src/test-helpers.ts`. Behebe den Fehler mit `switchMap`. Zeige mit einem Test anstelle des zweiten `it.todo`, dass die veraltete Suche abgebrochen wird. Nach einem fehlgeschlagenen Request soll die Suche weiter funktionieren: Ersetze das dritte `it.todo` durch einen fehlschlagenden Test und behebe den Fehler mit `catchError`. Ergänze in `src/search-main.ts` `debounceTime(300)` und `distinctUntilChanged()`, nicht in `searchResults`. Ändere `server/api.ts`, `src/search-api.ts`, `src/test-helpers.ts` und die Playwright-Tests nicht. Führe `npm run check`, `npm test` und `npm run e2e` aus.

Prüfen Sie das Ergebnis:

- Hat der Agent selbst einen `AbortController` oder ein `new Observable` gebaut? Das ist unnötig: `fromFetch` bricht den Request beim Abmelden ab (Schritt V2.3).
- Steht `catchError` **innerhalb** von `switchMap`? Ausserhalb beendet ein Fehler weiterhin den ganzen Strom (Schritt V2.4).
- Liegt `debounceTime` in `search-main.ts`, sodass die Unit-Tests ohne Zeit auskommen?

### Schritt für Schritt

#### Schritt V2.1: Fehler nachvollziehen

Öffnen Sie `http://localhost:5175/suche.html?umsetzung=rxjs` und tippen Sie zügig «react». Lesen Sie `src/search-rx.ts`, `searchTerms$` in `src/search-api.ts` und den Abschnitt `if (useRxjs)` in `src/search-main.ts`.

Was macht `mergeMap` mit jedem Suchbegriff, und in welcher Reihenfolge gibt es die Resultate weiter?

<details>
<summary>Lösungshinweis</summary>

`mergeMap` meldet sich für jeden Suchbegriff bei einer eigenen Suche an und gibt jedes Resultat weiter, sobald es eintrifft. Das ist derselbe Fehler wie in Vertiefung 1.

```text
Suchbegriffe:  ──r──re──rea──reac──react────────────────►
mergeMap:      ───────────────────────react──────r──re──►   ✗
switchMap:     ───────────────────────react─────────────►   ✓
```

</details>

#### Schritt V2.2: Fehlschlagenden Test schreiben

Lesen Sie den vorbereiteten Test in `src/search-rx.test.ts` und `createFakeSearchTerms$` in `src/test-helpers.ts`. Ein `Subject` ist ein Observable, in das der Test mit `next` selbst Werte einspeist; es ersetzt das Eingabefeld. Die Attrappe liefert ihre Antworten sofort, wenn der Test `respond` aufruft. `flushPromises` ist deshalb nicht nötig.

Ersetzen Sie das `it.todo` «liefert nur die Treffer der neueren Suche, auch wenn die ältere zuletzt antwortet» durch einen Test. Er muss mit `mergeMap` fehlschlagen.

<details>
<summary>Lösungshinweis</summary>

```ts
it("liefert nur die Treffer der neueren Suche, auch wenn die ältere zuletzt antwortet", () => {
  const fake = createFakeSearchTerms$();
  const queries = new Subject<string>();
  const received: SearchResult[] = [];
  searchResults(queries, fake.searchTerms$).subscribe((result) => received.push(result));

  queries.next("re");
  queries.next("react");
  fake.respond("react", ["React"]);
  fake.respond("re", ["React", "Redux", "Remix"]);

  expect(received).toEqual([{ query: "react", results: ["React"] }]);
});
```

</details>

#### Schritt V2.3: mergeMap durch switchMap ersetzen

Ersetzen Sie `mergeMap` durch `switchMap` und führen Sie die Tests aus. Tippen Sie im Browser zügig «react» und beobachten Sie den Network-Tab.

- Besteht Ihr Test?
- Was geschieht mit den Requests für «r» und «re»? Vergleichen Sie mit der Promise-Variante vor Vertiefung 1.

Ersetzen Sie danach das `it.todo` «bricht die vorherige Suche ab» durch einen Test.

<details>
<summary>Lösungshinweis</summary>

```ts
import { map, switchMap, type Observable } from "rxjs";

// …
return queries.pipe(
  switchMap((query) => searchTerms$(query).pipe(map((results) => ({ query, results })))),
);
```

`switchMap` meldet sich bei jedem neuen Suchbegriff von der vorherigen Suche ab und gibt nur noch die Resultate der neuesten weiter. Der Test besteht.

Im Network-Tab erscheinen die Requests für «r» und «re» als «(canceled)». Beim Abmelden bricht `fromFetch` den Request mit einem `AbortController` ab. Im Kern macht es dasselbe wie dieses eigene Observable: Die zurückgegebene Funktion (**Teardown**) ruft RxJS beim Abmelden auf.

```ts
new Observable<string[]>((subscriber) => {
  const controller = new AbortController();
  searchTerms(query, controller.signal).then(
    (results) => {
      subscriber.next(results);
      subscriber.complete();
    },
    (error) => subscriber.error(error),
  );
  return () => controller.abort();
});
```

Nach dem Abmelden leitet RxJS keine Werte und Fehler mehr weiter. Der `AbortError` erreicht die Seite deshalb nicht – die Unterscheidung aus Vertiefung 1 übernimmt hier `switchMap`. Angulars `HttpClient` funktioniert gleich: `switchMap((query) => http.get(…))` bricht veraltete Requests ab.

```ts
it("bricht die vorherige Suche ab", () => {
  const fake = createFakeSearchTerms$();
  const queries = new Subject<string>();
  searchResults(queries, fake.searchTerms$).subscribe();

  queries.next("re");
  queries.next("react");

  expect(fake.isAborted("re")).toBe(true);
  expect(fake.isAborted("react")).toBe(false);
});
```

</details>

#### Schritt V2.4: Nach einem Fehler weitersuchen

Stoppen Sie die API in Terminal 1 (`Ctrl+C`) und suchen Sie nach «vue». Der Entwicklungsserver antwortet mit HTTP 502, die Seite zeigt eine Fehlermeldung. Starten Sie die API wieder (`npm run api`) und suchen Sie nach «react».

- Funktioniert die Suche danach noch?
- Was geschieht mit einem Observable, wenn es einen Fehler meldet?

Ersetzen Sie das `it.todo` «sucht nach einem Fehler weiter» durch einen fehlschlagenden Test und beheben Sie den Fehler mit `catchError`. Der Typ `SearchResult` sieht für einen Fehler bereits `{ query, error }` vor, und `search-main.ts` zeigt dafür die Meldung an.

<details>
<summary>Lösungshinweis</summary>

Nein. Ein Observable endet nach einem Fehler endgültig. Der Fehler der inneren Suche beendet auch den äusseren Strom: Die Seite zeigt die Meldung, weitere Eingaben lösen keine Suche mehr aus.

`catchError` **innerhalb** von `switchMap` wandelt den Fehler in einen normalen Wert um. Es beendet nur die eine Suche, der äussere Strom läuft weiter. Ausserhalb von `switchMap` würde `catchError` den ganzen Strom ersetzen, und die Suche wäre ebenfalls beendet.

```ts
import { catchError, map, of, switchMap, type Observable } from "rxjs";

// …
return queries.pipe(
  switchMap((query) =>
    searchTerms$(query).pipe(
      map((results) => ({ query, results })),
      catchError((error: unknown) => of({ query, error })),
    ),
  ),
);
```

```ts
it("sucht nach einem Fehler weiter", () => {
  const fake = createFakeSearchTerms$();
  const queries = new Subject<string>();
  const received: SearchResult[] = [];
  searchResults(queries, fake.searchTerms$).subscribe((result) => received.push(result));

  const error = new Error("HTTP 500");
  queries.next("vue");
  fake.fail("vue", error);
  queries.next("react");
  fake.respond("react", ["React"]);

  expect(received).toEqual([
    { query: "vue", error },
    { query: "react", results: ["React"] },
  ]);
});
```

</details>

#### Schritt V2.5: Debouncing ergänzen

Ergänzen Sie in `src/search-main.ts` im Strom der Suchbegriffe `debounceTime(300)` und `distinctUntilChanged()`. Tippen Sie zügig «react» und vergleichen Sie die Anzahl Requests.

Warum gehören die Operatoren nach `search-main.ts` und nicht in `searchResults`?

<details>
<summary>Lösungshinweis</summary>

```ts
import { debounceTime, distinctUntilChanged, fromEvent, map } from "rxjs";

// …
const queries = fromEvent(input, "input").pipe(
  map(() => input.value.trim()),
  debounceTime(300),
  distinctUntilChanged(),
);
```

`debounceTime(300)` gibt einen Begriff erst weiter, wenn 300 Millisekunden keine Eingabe folgt. `distinctUntilChanged()` unterdrückt eine Suche nach demselben Begriff wie zuvor. Bei zügigem Tippen startet nur noch ein Request.

So bleibt `searchResults` frei von Zeit, und die Unit-Tests brauchen weder Wartezeiten noch simulierte Timer.

</details>

#### Schritt V2.6: Alles prüfen

```sh
npm run check
npm test
npm run e2e
```

Erwartet: Alle Unit-Tests und Playwright-Tests bestehen.
