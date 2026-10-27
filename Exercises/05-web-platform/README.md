# Übung 5: Geräteverleih – Fehlerpfade von fetch, kontrollierte Antworten und CORS

Die Seite lädt eine Geräteliste mit `fetch` von einer lokalen API (Port 3005). Die Seite selbst läuft auf Port 5177, also auf einem anderen **Origin**. Über die Auswahl «Szenario» liefert die API Erfolg, leere Liste und verschiedene Fehler. Der Code ruft nur `fetch(url).then((response) => response.json())` auf und prüft weder Status noch Daten.

- **Teil 1:** Fehlerfälle untersuchen, `loadDevices` robust machen, die Anzeige über Zustände steuern und jeden Fehlerfall mit [Mock Service Worker](https://mswjs.io/) (MSW) testen.
- **Teil 2:** Einen CORS-Fehler untersuchen, mit `curl` vergleichen und auf zwei Arten beheben.

Versuchen Sie jeden Schritt zuerst selbst, bevor Sie den Lösungshinweis öffnen.

**Optional mit einem Coding Agent:** Beide Teile beginnen mit einem Auftrag für einen Coding Agent mit Terminalzugriff (z. B. Claude Code, Codex, GitHub Copilot, Cursor). Die Anleitung «Schritt für Schritt» danach beschreibt, wie Sie den Teil manuell lösen; zusammen mit den Lösungshinweisen dient sie auch dazu, das Ergebnis des Agenten zu prüfen. Hinweise für Agenten stehen in [AGENTS.md](./AGENTS.md). Die laufende Seite untersucht der Agent wie in den bisherigen Übungen mit der Playwright CLI (`npx playwright cli open --browser=chrome http://localhost:5177/`); dafür müssen API und Entwicklungsserver laufen.

---

## Teil 1: Fehlerpfade umsetzen und testen

Alle Befehle im Ordner `Exercises/05-web-platform` ausführen. Sie brauchen drei Terminals.

### Optional: mit einem Coding Agent

Installieren Sie die Abhängigkeiten und starten Sie API und Entwicklungsserver in je einem Terminal (`npm ci`, `npm run api`, `npm run dev`). Geben Sie dem Agenten dann diesen Auftrag:

> Kundenmeldung: «Die Geräteliste bleibt bei manchen Fehlern auf ‹Lädt …› stehen, zeigt fehlerhafte Daten ohne Hinweis an und bei einer leeren Liste eine leere Tabelle.» Wähle auf dem laufenden Entwicklungsserver (`http://localhost:5177/`) mit der Playwright CLI nacheinander alle Szenarien ausser «Ausgemusterte Geräte» und halte pro Szenario Status, Body, Anzeige und Console-Meldung fest. Erkläre, welche Fälle `fetch` selbst als Fehler erkennt. Schreibe zuerst Tests, die fehlschlagen: Ersetze die ersten fünf `it.todo` in `src/api.test.ts` durch Tests mit `server.use(…)` aus MSW und prüfe jeweils `reason` und Meldung des `LoadError`. Zeige, dass sie fehlschlagen. Ändere danach `loadDevices` in `src/api.ts` mit `async`/`await`: Die Funktion gibt eine mit `deviceListSchema` geprüfte Liste zurück oder wirft einen `LoadError` mit dem Grund `network`, `http`, `invalid-json` oder `invalid-data` und gibt den ursprünglichen Fehler als `cause` weiter. Ändere `showDevices` in `src/device-view.ts`: leere Liste → Zustand `empty`, jeder Fehler → Zustand `error`, keine unbehandelte Rejection. Ändere weder `server/api.ts` noch `e2e/` noch `src/test-setup.ts`, und behandle das letzte `it.todo` und die ausgemusterten Geräte noch nicht. Prüfe das Ergebnis im Browser und führe `npm run check`, `npm test` und `npm run e2e` aus. Der Playwright-Test «zeigt ausgemusterte Geräte (Teil 2)» darf noch fehlschlagen.

Kritisch prüfen:

- Hat der Agent alle Szenarien im Browser ausprobiert und Console und Network-Tab gelesen? Vergleichen Sie mit der Tabelle in Schritt 1.2.
- Haben die neuen Tests vor der Änderung tatsächlich fehlgeschlagen? Prüfen sie `reason` und die konkrete Meldung oder nur, dass irgendein Fehler auftritt (`rejects.toThrow()`)?
- Ersetzt der Agent `fetch` zusätzlich mit `vi.stubGlobal` oder `vi.spyOn(globalThis, "fetch")`? Dann testen die Tests die Attrappe, nicht den Request.
- Hat er `onUnhandledFrame` oder die Prüfung in `test-setup.ts` gelockert, damit Tests grün werden?
- Prüft `loadDevices` den Status **vor** dem Lesen des Bodys? Umfasst jeder `try` nur den Aufruf, dessen Fehler er übersetzt, oder fängt ein grosser `try` alles als Netzwerkfehler?
- Wird das Ergebnis von `response.json()` als `unknown` behandelt und mit `safeParse` geprüft, oder steht noch eine Behauptung im Code (`grep -rnE " as |!\.|: any" src`)?
- Zeigt ein unerwarteter Fehler in `showDevices` eine allgemeine Meldung, und wird er protokolliert?
- Sind `server/api.ts`, `e2e/` und `src/test-setup.ts` unverändert (`git diff server/ e2e/ src/test-setup.ts`)?

Den erwarteten Stand beschreiben die Lösungshinweise zu den Schritten 1.3 bis 1.5. Schritt 1.6 bearbeiten Sie auch mit Agent selbst: Er erklärt, was die MSW-Tests belegen und wo ihre Grenzen liegen.

### Schritt für Schritt

#### Schritt 1.1: Projekt starten und Code lesen

```sh
npm ci
npm run api      # Terminal 1, startet bei Änderungen neu
npm run dev      # Terminal 2
```

Öffnen Sie `http://localhost:5177/` in Chrome und wählen Sie «Alle Geräte». Lesen Sie `src/main.ts`, `src/api.ts` und `src/device-view.ts`.

- Wie lautet die vollständige URL des Requests, und wie entsteht sie?
- Welchen Origin hat die Seite, welchen die API?
- Was gibt `loadDevices` zurück, wenn die API mit Status 404 antwortet?

Führen Sie im dritten Terminal `npm run check`, `npm test` und `npm run e2e` aus. Prüfung und Unit-Tests laufen durch; sechs Tests sind `todo`. Von den Playwright-Tests besteht nur «zeigt alle Geräte». Die übrigen sieben beschreiben das Zielverhalten und scheitern nach je etwa fünf Sekunden.

<details>
<summary>Lösungshinweis</summary>

`main.ts` legt die Adresse der API fest (`http://localhost:3005`). `device-view.ts` setzt sie mit dem Wert der Auswahl zusammen, etwa `new URL("/api/devices?scenario=empty", "http://localhost:3005")` → `http://localhost:3005/api/devices?scenario=empty`.

Ein **Origin** besteht aus Schema, Host und Port. Seite: `http://localhost:5177`, API: `http://localhost:3005`. Schon ein anderer Port ergibt einen anderen Origin.

Bei 404 gibt `loadDevices` den Body der Fehlerantwort zurück: `{ "message": "Nicht gefunden: GET /api/geraete" }`. `fetch` lehnt bei HTTP-Fehlern nicht ab, und `response.json()` liest jeden JSON-Body. Der Rückgabetyp `Promise<Device[]>` stimmt trotzdem für den Compiler, weil `response.json()` `any` liefert.

</details>

#### Schritt 1.2: Fehlerfälle im Browser untersuchen

Öffnen Sie die Entwicklerwerkzeuge (**Network** und **Console**). Wählen Sie nacheinander alle Szenarien ausser «Ausgemusterte Geräte» (folgt in Teil 2). Laden Sie die Seite vor jedem Szenario neu.

Notieren Sie pro Szenario: Status und `Content-Type` (Request anklicken, **Headers**), Body (**Response**), Anzeige der Seite und Meldung in der Console.

Welche Fälle erkennt `fetch` selbst als Fehler, welche nicht?

<details>
<summary>Lösungshinweis</summary>

| Szenario               | Network-Tab                                           | Seite und Console                                                                           |
| ---------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Leere Liste            | 200, Body `[]`                                        | Leere Tabelle mit «0 Geräte, davon 0 verfügbar» statt eines Hinweises                       |
| Falscher Pfad          | 404, JSON mit `message`                               | «Lädt …» bleibt stehen; `Uncaught (in promise) TypeError: devices.filter is not a function` |
| Serverfehler           | 500, JSON mit `message`                               | wie bei 404                                                                                 |
| Abgeschnittene Antwort | 200, `Content-Type: application/json`, Body bricht ab | «Lädt …» bleibt stehen; `SyntaxError: Unterminated string in JSON …`                        |
| Ungültige Daten        | 200, `"available": "ja"` statt `true`                 | Das Gerät erscheint als «verfügbar», ohne Fehlermeldung                                     |
| Verbindungsabbruch     | `(failed) net::ERR_EMPTY_RESPONSE`, kein Status       | «Lädt …» bleibt stehen; `TypeError: Failed to fetch`                                        |
| Langsame Antwort       | 200 nach etwa 5 Sekunden (Spalte **Time**)            | «Lädt …» während 5 Sekunden, danach die Liste                                               |

`fetch` lehnt nur ab, wenn **keine HTTP-Antwort** zustande kommt (Verbindungsabbruch). 404 und 500 sind für `fetch` erfolgreich übertragene Antworten; der eigene Code prüft sie mit `response.ok` (true bei 200 bis 299).

Bei der abgeschnittenen Antwort scheitert erst `response.json()`. Die ungültigen Daten sind gültiges JSON; das bemerkt nur eine Prüfung gegen ein Schema (Zod).

`Uncaught (in promise)` zeigt eine **unbehandelte Rejection**: Das Promise aus `showDevices` lehnt ab, niemand fängt den Fehler (wie eine ungefangene Exception in Java). Darum bleibt die Seite im Ladezustand.

</details>

#### Schritt 1.3: loadDevices robust machen

Ändern Sie `loadDevices` in `src/api.ts`: Die Funktion gibt eine geprüfte Geräteliste zurück oder wirft einen `LoadError` (vorbereitet) mit passendem Grund.

| Fall                                   | `reason`       | Meldung (Vorschlag)                                  |
| -------------------------------------- | -------------- | ---------------------------------------------------- |
| `fetch` lehnt ab                       | `network`      | «Der Server ist nicht erreichbar.»                   |
| Status ausserhalb von 200 bis 299      | `http`         | «Der Server meldet einen Fehler (HTTP-Status 404).»  |
| Body ist kein JSON                     | `invalid-json` | «Die Antwort des Servers ist kein gültiges JSON.»    |
| JSON passt nicht zu `deviceListSchema` | `invalid-data` | «Die Antwort des Servers enthält ungültige Daten: …» |

Geben Sie den ursprünglichen Fehler als `cause` weiter (wie in Java `new RuntimeException(message, cause)`). Verwenden Sie `async`/`await` statt `.then`.

In welcher Reihenfolge müssen die Prüfungen stehen, und warum?

<details>
<summary>Lösungshinweis</summary>

```ts
import { z } from "zod";
import { deviceListSchema, type Device } from "./device.ts";

// … LoadErrorReason und LoadError unverändert

/** Lädt die Geräteliste von `url`; wirft bei jedem Fehler einen `LoadError`. */
export async function loadDevices(url: string | URL): Promise<Device[]> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch (error) {
    // fetch lehnt nur ab, wenn keine HTTP-Antwort zustande kommt.
    throw new LoadError("network", "Der Server ist nicht erreichbar.", { cause: error });
  }

  if (!response.ok) {
    throw new LoadError("http", `Der Server meldet einen Fehler (HTTP-Status ${response.status}).`);
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch (error) {
    throw new LoadError("invalid-json", "Die Antwort des Servers ist kein gültiges JSON.", {
      cause: error,
    });
  }

  const result = deviceListSchema.safeParse(json);
  if (!result.success) {
    throw new LoadError(
      "invalid-data",
      `Die Antwort des Servers enthält ungültige Daten:\n${z.prettifyError(result.error)}`,
    );
  }
  return result.data;
}
```

Reihenfolge entlang der Antwort: Verbindung, Status, Body, Inhalt.

- Status **vor** dem Body prüfen: Viele Server liefern bei 404 oder 500 HTML; `response.json()` würde mit einem irreführenden JSON-Fehler scheitern.
- Jeder `try` umfasst nur den Aufruf, dessen Fehler er übersetzt. Ein grosser `try` würde etwa einen `SyntaxError` als Netzwerkfehler melden.
- Ein Body lässt sich nur einmal lesen. `response.text()` und danach `response.json()` ergibt `TypeError: … body stream already read`.
- `let json: unknown` macht aus dem `any` ein `unknown`; erst `safeParse` macht daraus `Device[]`.

</details>

#### Schritt 1.4: Die Anzeige über Zustände steuern

`device-view.ts` enthält bereits den Typ `ViewState` und `render` für jeden Zustand. `showDevices` meldet aber nur `loading` und `success`. Ändern Sie `showDevices`:

- Leere Liste → Zustand `empty`.
- Jeder Fehler → Zustand `error`. Ein `LoadError` zeigt seine Meldung, ein unerwarteter Fehler eine allgemeine Meldung.
- Keine unbehandelte Rejection in der Console.

Prüfen Sie danach alle Szenarien aus Schritt 1.2 erneut im Browser.

<details>
<summary>Lösungshinweis</summary>

```ts
import { LoadError, loadDevices } from "./api.ts";

// … in setupDeviceView
async function showDevices(path: string): Promise<void> {
  render({ kind: "loading" });
  try {
    const devices = await loadDevices(new URL(path, apiBaseUrl));
    render(devices.length === 0 ? { kind: "empty" } : { kind: "success", devices });
  } catch (error) {
    render({ kind: "error", message: errorMessage(error) });
  }
}

// … ausserhalb von setupDeviceView
/** Meldung für die Anzeige; unerwartete Fehler werden zusätzlich protokolliert. */
function errorMessage(error: unknown): string {
  if (error instanceof LoadError) return error.message;
  console.error(error);
  return "Beim Laden ist ein unerwarteter Fehler aufgetreten.";
}
```

Der `catch` fängt auch Programmierfehler in `render`; `console.error` hält sie fest. `instanceof` funktioniert, weil `LoadError` eine Klasse ist; TypeScript-Typen existieren zur Laufzeit nicht.

</details>

#### Schritt 1.5: Fehlerfälle mit MSW testen

MSW fängt die Requests von `fetch` ab und beantwortet sie mit vorgegebenen Antworten, ohne echten Server. Lesen Sie `src/test-setup.ts`, `src/mocks/handlers.ts` und die zwei vorhandenen Tests in `src/api.test.ts`. Der zweite zeigt, wie `server.use(…)` die Antwort nur für einen Test festlegt.

Ersetzen Sie die ersten fünf `it.todo` durch echte Tests. Legen Sie die Antwort jeweils mit `server.use(…)` fest und prüfen Sie Grund **und** Meldung. Bausteine:

| Antwort                             | MSW                                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------------------ |
| JSON mit Status                     | `HttpResponse.json({ message: "…" }, { status: 404 })`                               |
| Body, der kein JSON ist             | `new HttpResponse("kein json", { headers: { "Content-Type": "application/json" } })` |
| Netzwerkfehler (keine HTTP-Antwort) | `HttpResponse.error()`                                                               |

Eine abgelehnte Promise prüfen Sie mit `await expect(promise).rejects.toMatchObject({ … })`. Mit `npx vp test watch` laufen die Tests bei jeder Änderung neu.

<details>
<summary>Lösungshinweis</summary>

Import ergänzen: `import { LoadError, loadDevices } from "./api.ts";`

```ts
it.each([404, 500])("meldet HTTP %i", async (status) => {
  server.use(http.get(DEVICES_URL, () => HttpResponse.json({ message: "Fehler" }, { status })));

  await expect(loadDevices(DEVICES_URL)).rejects.toMatchObject({
    reason: "http",
    message: expect.stringContaining(`HTTP-Status ${status}`),
  });
});

it("meldet eine Antwort, die kein JSON ist", async () => {
  server.use(
    http.get(
      DEVICES_URL,
      () => new HttpResponse("kein json", { headers: { "Content-Type": "application/json" } }),
    ),
  );

  await expect(loadDevices(DEVICES_URL)).rejects.toMatchObject({
    reason: "invalid-json",
    message: "Die Antwort des Servers ist kein gültiges JSON.",
  });
});

it("meldet Daten, die nicht zum Schema passen", async () => {
  server.use(http.get(DEVICES_URL, () => HttpResponse.json([{ ...devices[0], available: "ja" }])));

  await expect(loadDevices(DEVICES_URL)).rejects.toMatchObject({
    reason: "invalid-data",
    message: expect.stringContaining("[0].available"),
  });
});

it("meldet einen Netzwerkfehler", async () => {
  server.use(http.get(DEVICES_URL, () => HttpResponse.error()));

  const error = await loadDevices(DEVICES_URL).catch((error: unknown) => error);

  expect(error).toBeInstanceOf(LoadError);
  expect(error).toMatchObject({ reason: "network", message: "Der Server ist nicht erreichbar." });
});
```

Nur `rejects.toThrow()` würde auch bei einem Fehler aus dem falschen Grund bestehen. Erst `reason` und `message` belegen den richtigen Fall.

Probieren Sie es aus: Entfernen Sie vorübergehend die Statusprüfung in `loadDevices`. Welche Tests scheitern, mit welcher Meldung?

</details>

#### Schritt 1.6: MSW im Vergleich zu einer fetch-Attrappe

Alternative: `fetch` als Parameter übergeben (`loadDevices(url, fetchFn)`), im Test eine Attrappe, die direkt ein `Response` liefert (wie ein per Konstruktor injizierter Mock in Java). `loadDevices` ruft hier dagegen das globale `fetch` auf, und MSW fängt den Request ab.

1. Was ändert sich für Code und Tests, wenn Antworten auf Netzwerkebene abgefangen werden statt mit einer Attrappe?
2. Ändern Sie im Test «meldet einen Netzwerkfehler» die URL im Aufruf von `loadDevices` probehalber auf `${API_BASE_URL}/api/device` (ohne «s»). Was meldet `npm test`? Lesen Sie die Kommentare in `src/test-setup.ts`.

<details>
<summary>Lösungshinweis</summary>

1. Der Code bleibt wie im Browser: kein zusätzlicher Parameter. MSW ersetzt nicht `fetch`, sondern beantwortet den abgeschickten Request. Getestet wird also auch, wie `fetch` echte `Response`-Objekte, Header und Netzwerkfehler behandelt. Preis: Die Tests müssen die URL kennen, und es braucht ein Setup, das MSW startet und zurücksetzt.

   Eine Attrappe bleibt sinnvoll für bewusst übergebene Abhängigkeiten, etwa fein gesteuerte Abläufe mit `Promise.withResolvers`. `vi.stubGlobal("fetch", …)` koppelt die Tests an die Art der `fetch`-Aufrufe.

2. Für die falsche URL gibt es keinen Handler. Mit `onUnhandledFrame: "error"` lässt MSW den Request scheitern; für `loadDevices` ist das ein Netzwerkfehler (`reason: "network"`). Der Test «meldet einen Netzwerkfehler» würde mit falscher URL also **bestehen**. Darum prüft `test-setup.ts` nach jedem Test, ob ein Request ohne Handler vorkam, und lässt den Test mit `Request ohne passenden Handler: GET …` scheitern.

   In MSW 2 hiess die Option `onUnhandledRequest`.

</details>

---

## Teil 2: CORS untersuchen

### Optional: mit einem Coding Agent

API und Entwicklungsserver laufen weiterhin. Auftrag für den Agenten:

> Kundenmeldung: «Bei ‹Ausgemusterte Geräte› meldet die Seite ‹Der Server ist nicht erreichbar.›, obwohl die API läuft.» Reproduziere den Fehler auf dem laufenden Entwicklungsserver (`http://localhost:5177/`) mit der Playwright CLI und lies Console und Network-Tab. Vergleiche die Response-Header von `/api/devices` und `/api/devices/archived` mit `curl`, mit und ohne `Origin`-Header, und erkläre, warum `curl` die Daten erhält, der Browser aber nicht. Ersetze das letzte `it.todo` in `src/api.test.ts` durch einen MSW-Test, der die ausgemusterten Geräte von `${API_BASE_URL}/api/devices/archived` lädt, und erkläre, warum er besteht, obwohl dieselbe Funktion im Browser scheitert. Behebe den Fehler danach in `server/api.ts`, sodass der Endpunkt denselben CORS-Header sendet wie `/api/devices`. Verwende weder `mode: "no-cors"` noch einen Proxy des Entwicklungsservers, und ändere weder die übrigen Szenarien in `server/api.ts` noch `e2e/`. Prüfe das Ergebnis im Browser und führe `npm run check`, `npm test` und `npm run e2e` aus.

Kritisch prüfen:

- Hat der Agent den CORS-Fehler im Browser gesehen und die Response-Header verglichen, oder nur aus dem Code geschlossen?
- Erklärt er, dass CORS eine Regel des Browsers ist und **kein Zugriffsschutz** des Servers?
- Schlägt er `mode: "no-cors"` vor? Die Antwort ist dann opak (Status `0`, Body leer, `response.json()` scheitert); das löst nichts.
- Sendet die Antwort `Access-Control-Allow-Origin: http://localhost:5177` oder `*`? Ist `*` hier vertretbar (Kontrollfrage 4)?
- Hat er einen Proxy in `vite.config.ts` eingerichtet oder `API_BASE_URL` in `src/main.ts` geändert? Diese Lösung untersuchen Sie in Schritt 2.5 selbst.
- Sind die übrigen Szenarien in `server/api.ts` und `e2e/` unverändert (`git diff server/ e2e/`)?

Den erwarteten Stand beschreiben die Lösungshinweise zu den Schritten 2.3 und 2.4 sowie Schritt 2.6. Den Vergleich mit dem Proxy in Schritt 2.5 bearbeiten Sie auch mit Agent selbst.

### Schritt für Schritt

#### Schritt 2.1: Der Fehler im Browser

Wählen Sie «Ausgemusterte Geräte». Was zeigen Seite, Console und Network-Tab? Ist der Request laut Ausgabe der API (Terminal 1) beim Server angekommen?

Vergleichen Sie die Response-Header von `/api/devices` und `/api/devices/archived` sowie den Code in `server/api.ts`.

<details>
<summary>Lösungshinweis</summary>

Die Seite meldet «Der Server ist nicht erreichbar.», wie beim Verbindungsabbruch. Die Console zeigt die Ursache:

```text
Access to fetch at 'http://localhost:3005/api/devices/archived' from origin 'http://localhost:5177'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

Der Network-Tab zeigt `CORS error`. Die API hat den Request aber beantwortet: `GET /api/devices/archived (Origin: http://localhost:5177)`.

`/api/devices` antwortet über `sendJson` mit `Access-Control-Allow-Origin: http://localhost:5177`. `getArchivedDevices` schreibt die Antwort selbst und lässt den Header weg.

Der Browser schickt bei Cross-Origin-Requests den Header `Origin` mit. Fehlt die Freigabe in der Antwort, gibt er sie nicht an JavaScript weiter (**Same Origin Policy**). So können fremde Seiten keine Daten mit Cookies und Netzwerkzugang der Nutzenden lesen, etwa im Intranet. CORS lockert diese Regel gezielt.

Für JavaScript ist ein CORS-Fehler absichtlich ein gewöhnlicher `TypeError: Failed to fetch`, sonst liessen sich interne Server ausspähen. Die Ursache steht nur in der Console.

</details>

#### Schritt 2.2: Derselbe Request mit curl

Unter Windows `curl.exe` statt `curl` verwenden (in PowerShell ist `curl` ein anderer Befehl).

```sh
curl -i http://localhost:3005/api/devices/archived
curl -i -H "Origin: http://localhost:5177" http://localhost:3005/api/devices/archived
curl -i -H "Origin: http://localhost:5177" http://localhost:3005/api/devices
```

Warum liefert `curl` die Daten, obwohl der Browser sie blockiert? (Tipp: Im Network-Tab kopiert Rechtsklick → **Copy** → **Copy as cURL** einen Request.)

<details>
<summary>Lösungshinweis</summary>

`curl` erhält jedes Mal Status 200 und die Daten; nur `/api/devices` sendet `Access-Control-Allow-Origin`.

CORS ist eine Regel **des Browsers**. Der Server liefert immer aus; der Header erlaubt dem Browser nur, die Antwort an eine Seite eines anderen Origins weiterzugeben. `curl` hat keine Seite zu schützen und ignoriert den Header. CORS ist deshalb **kein Zugriffsschutz**; dafür braucht es Authentifizierung.

</details>

#### Schritt 2.3: Was die Tests nicht zeigen

Ersetzen Sie das letzte `it.todo` in `src/api.test.ts` durch einen Test, der die ausgemusterten Geräte von `${API_BASE_URL}/api/devices/archived` lädt (Antwort mit `server.use(…)`). Führen Sie `npm test` aus.

Der Test ist grün, obwohl dieselbe Funktion im Browser scheitert. Warum?

<details>
<summary>Lösungshinweis</summary>

Import ergänzen: `import { API_BASE_URL, devices, DEVICES_URL } from "./mocks/handlers.ts";`

```ts
it("lädt die ausgemusterten Geräte", async () => {
  const url = `${API_BASE_URL}/api/devices/archived`;
  const archived = [{ id: 90, name: "ThinkPad T480", category: "laptop", available: false }];
  server.use(http.get(url, () => HttpResponse.json(archived)));

  await expect(loadDevices(url)).resolves.toEqual(archived);
});
```

Der Test prüft nur, wie `loadDevices` mit einer vorgegebenen Antwort umgeht. Es fehlen:

- **Browser:** Vitest läuft in Node.js, ohne Origin und Same Origin Policy. `fetch` in Node.js prüft keine CORS-Header.
- **Server:** Die Antwort kommt vom Handler, nicht von `server/api.ts`.
- **Echte Adresse:** Ob die API unter der URL erreichbar ist, prüft der Test nicht.

Unit-Tests prüfen die eigene Logik ohne Abhängigkeiten; CORS zeigen erst Browser und Playwright. Der Playwright-Test «zeigt ausgemusterte Geräte (Teil 2)» scheitert deshalb weiterhin.

</details>

#### Schritt 2.4: Lösung A – CORS-Header auf dem Server

Ändern Sie `getArchivedDevices` in `server/api.ts`, sodass die Antwort den nötigen Header enthält. Die API startet nach dem Speichern neu. Prüfen Sie das Szenario und die Response-Header im Browser.

<details>
<summary>Lösungshinweis</summary>

Am einfachsten über `sendJson`:

```ts
function getArchivedDevices(response: ServerResponse): void {
  sendJson(response, 200, archivedDevices);
}
```

Die Antwort enthält jetzt `Access-Control-Allow-Origin: http://localhost:5177`; die Seite zeigt zwei ausgemusterte Geräte.

In echten Servern gehört CORS an eine zentrale Stelle, etwa eine Middleware (`@fastify/cors`, `cors` für Express, `CorsRegistry` in Spring).

Bei nicht «einfachen» Requests, etwa `POST` mit `Content-Type: application/json` oder eigenen Headern, fragt der Browser vorher mit einem **Preflight** (`OPTIONS`) nach. Der Server antwortet mit `Access-Control-Allow-Methods` und `Access-Control-Allow-Headers`; dafür gibt es in `server/api.ts` bereits `allowPreflight`. Vertiefung 2 zeigt den Preflight in Aktion.

</details>

#### Schritt 2.5: Lösung B – Proxy des Entwicklungsservers

Der Vite-Entwicklungsserver kann Requests weiterleiten. Die Seite fragt dann den eigenen Origin an; es gibt keinen Cross-Origin-Request mehr.

1. Ergänzen Sie in `vite.config.ts` unter `server` einen Proxy, der alle Pfade unter `/api` an `http://localhost:3005` weiterleitet.
2. Setzen Sie `API_BASE_URL` in `src/main.ts` auf `window.location.origin`.
3. Laden Sie die Seite neu. Welche URL zeigt der Network-Tab? Welchen `Origin` protokolliert die API?
4. Führen Sie `npm test` und `npm run e2e` aus. Welcher Ablauftest scheitert jetzt, und warum?
5. Machen Sie beide Änderungen rückgängig. Lösung A bleibt bestehen.

Welche Vor- und Nachteile haben die beiden Lösungen?

<details>
<summary>Lösungshinweis</summary>

```ts
// vite.config.ts
server: {
  port: 5177,
  strictPort: true,
  // Requests an /api/… leitet der Entwicklungsserver an die Geräte-API weiter.
  proxy: { "/api": "http://localhost:3005" },
},
```

```ts
// src/main.ts
const API_BASE_URL = window.location.origin;
```

Der Network-Tab zeigt `http://localhost:5177/api/devices/archived`, einen Same-Origin-Request; `Access-Control-Allow-Origin` spielt keine Rolle mehr. Die API protokolliert `Origin: –`, weil Chrome bei einem `GET` an den eigenen Origin keinen `Origin`-Header sendet.

`npm test` bleibt grün (eigene absolute URLs). In `npm run e2e` scheitert «Verbindungsabbruch»: Die Seite meldet «HTTP-Status 502» statt «nicht erreichbar». Den Abbruch erlebt jetzt der Proxy, und er antwortet mit **502 Bad Gateway**. Ein Proxy verändert also das Fehlerbild.

- **A: CORS-Header:** entspricht dem Betrieb mit getrennten Origins, explizit. Aber: Server anpassen, erlaubte Origins pro Umgebung pflegen, Preflights kosten Zeit.
- **B: Proxy:** keine Serveränderung, Cookies und Pfade wie bei gleichem Origin. Aber: nur im Entwicklungsserver (Produktion braucht Reverse Proxy oder Gateway), verdeckt fehlende CORS-Konfiguration, verändert Fehlerbilder.

In Produktion: Frontend und API per Reverse Proxy unter einem Origin ausliefern (das ahmt Lösung B nach) oder CORS korrekt konfigurieren.

</details>

#### Schritt 2.6: Alles prüfen

```sh
npm run check    # nur Formatierungsabweichungen? npx vp check --fix
npm test
npm run e2e
```

Alles läuft ohne Fehler. Gehen Sie alle Szenarien im Browser durch: Jeder Fehlerfall zeigt eine verständliche Meldung, die Ladeanzeige verschwindet immer, die Console zeigt keine unbehandelte Rejection.

---

## Checkliste

- [ ] `loadDevices` prüft Verbindung, Status, JSON und Schema und wirft in jedem Fehlerfall einen `LoadError` mit passendem Grund.
- [ ] Jeder Fehlerfall zeigt eine verständliche Meldung; eine leere Liste einen Hinweis.
- [ ] Keine unbehandelte Rejection; «Lädt …» verschwindet in jedem Fall.
- [ ] Für jeden Fehlerfall gibt es einen MSW-Test, der Grund und Meldung prüft.
- [ ] Ein Request ohne passenden Handler lässt den Test scheitern.
- [ ] Die ausgemusterten Geräte erscheinen im Browser; der Endpunkt sendet den CORS-Header.
- [ ] `npm run check`, `npm test` und `npm run e2e` laufen ohne Fehler.
- [ ] Sie können erklären, warum der CORS-Fehler nur im Browser auftritt und welcher Header ihn behebt.

## Kontrollfragen

1. Warum lehnt `fetch` bei 404 und 500 nicht ab? Wäre es besser, wenn es das täte?
2. Verbindungsabbruch und CORS-Fehler führen zur selben Meldung. Ist das ein Problem für Nutzende, Support, Entwicklung?
3. Was belegt `npm test`, was `npm run e2e` und was der Network-Tab?
4. Wann ist `Access-Control-Allow-Origin: *` vertretbar, wann nicht?
5. Wie verhält sich Angulars `HttpTestingController` im Vergleich zu MSW?

<details>
<summary>Antworten zu den Kontrollfragen</summary>

1. Eine 404-Antwort ist für HTTP erfolgreich übertragen. Ob sie fachlich ein Fehler ist, hängt vom Fall ab; `fetch` überlässt das dem Code. axios oder Angulars `HttpClient` werfen bei jedem Status ausserhalb von 2xx.
2. Für Nutzende genügt «nicht erreichbar». Support und Entwicklung brauchen Console, Logs oder Fehlerberichte aus dem Browser, denn JavaScript erhält die Ursache nicht (Schritt 2.1).
3. `npm test`: `loadDevices` ordnet jede vorgegebene Antwort richtig ein. `npm run e2e`: Seite, Browser und echte API funktionieren zusammen, inklusive CORS. Network-Tab: was tatsächlich übertragen wurde.
4. Vertretbar für öffentliche Daten ohne Anmeldung. Nicht vertretbar mit Cookies oder anderen Credentials; der Browser lehnt `*` zusammen mit `Access-Control-Allow-Credentials: true` ohnehin ab. Dann muss der Server die Origins einzeln nennen.
5. `HttpTestingController` (über `provideHttpClientTesting`) fängt nur Requests von `HttpClient` ab; der Test beantwortet sie mit `flush`. MSW ist frameworkunabhängig und funktioniert auch im Browser.

</details>

## Vertiefung

1. **Timeout:** Brechen Sie den Request mit `AbortSignal.timeout` nach drei Sekunden ab und melden Sie das mit dem Grund `timeout`. Testen Sie mit `delay()` aus MSW, ohne wirklich drei Sekunden zu warten.
2. **Formular und Preflight:** Ergänzen Sie ein Formular «Gerät erfassen» (Name, Kategorie). Lesen Sie die Eingaben mit `FormData`, prüfen Sie sie mit `newDeviceSchema` aus `src/device.ts` und senden Sie sie als JSON per `POST` an `/api/devices`. Die API prüft mit demselben Schema und antwortet bei ungültigen Eingaben mit 400 und `fieldErrors`. Zeigen Sie Feldfehler aus beiden Prüfungen beim Feld an. Beobachten Sie den `OPTIONS`-Request vor dem `POST`.
3. **Testdaten gegen das Schema prüfen:** Prüfen Sie die Testdaten in `src/mocks/handlers.ts` mit `deviceListSchema.parse` statt nur mit dem Typ `Device[]`. Welche Regel des Schemas kann der Typ allein nicht prüfen?
4. **CORS bei fremden Servern:** Führen Sie in der Console einer beliebigen Seite, etwa `https://www.srf.ch`, aus:

   ```js
   await (await fetch("https://jsonplaceholder.typicode.com/todos/1")).json();
   await (await fetch("https://www.nzz.ch/")).text();
   ```

   Warum funktioniert nur der erste Aufruf? Prüfen Sie die Response-Header. Probieren Sie dann `fetch("https://www.nzz.ch/", { mode: "no-cors" })` und sehen Sie sich `type`, `status` und Body an.

<details>
<summary>Lösungshinweis zu Vertiefung 1</summary>

```ts
export type LoadErrorReason = "network" | "timeout" | "http" | "invalid-json" | "invalid-data";

export async function loadDevices(url: string | URL, timeoutMs = 3000): Promise<Device[]> {
  let response: Response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new LoadError("timeout", "Der Server antwortet nicht rechtzeitig.", { cause: error });
    }
    throw new LoadError("network", "Der Server ist nicht erreichbar.", { cause: error });
  }
  // … Rest unverändert
}
```

Test (Import `delay` aus `msw` ergänzen):

```ts
it("bricht eine zu langsame Antwort ab", async () => {
  server.use(
    http.get(DEVICES_URL, async () => {
      await delay("infinite");
      return HttpResponse.json(devices);
    }),
  );

  await expect(loadDevices(DEVICES_URL, 10)).rejects.toMatchObject({ reason: "timeout" });
});
```

Der Test wählt 10 ms; `delay("infinite")` antwortet nie. `AbortSignal.timeout` meldet `TimeoutError`, ein eigener `AbortController` `AbortError`. Läuft der Timeout erst beim Lesen des Bodys ab, meldet diese Fassung «kein gültiges JSON».

</details>

<details>
<summary>Lösungshinweis zu Vertiefung 2</summary>

In `index.html` ein Formular `<form class="new-device" novalidate>` mit `<input name="name" />`, `<select name="category">` (Werte `laptop`, `monitor`, `beamer`, `headset`), je Feld einem `<span class="field-error" data-error-for="…">`, einem `<button>Erfassen</button>` und `<p class="form-message">`. `novalidate` schaltet die Browserprüfung ab, damit die Meldungen aus dem Schema erscheinen.

In `src/api.ts` (ein Validierungsfehler ist ein erwartetes Ergebnis und wird wie bei `safeParse` als Union zurückgegeben; `invalid-json` fehlt der Kürze halber):

```ts
import { deviceListSchema, deviceSchema, type Device, type NewDevice } from "./device.ts";

const validationErrorSchema = z.object({
  fieldErrors: z.record(z.string(), z.array(z.string())),
});

export type FieldErrors = Partial<Record<string, string[]>>;

export type CreateResult =
  | { success: true; device: Device }
  | { success: false; fieldErrors: FieldErrors };

/** Sendet ein neues Gerät als JSON; Validierungsfehler des Servers gehören zum Ergebnis. */
export async function createDevice(url: string | URL, input: NewDevice): Promise<CreateResult> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch (error) {
    throw new LoadError("network", "Der Server ist nicht erreichbar.", { cause: error });
  }

  if (response.status === 400) {
    const body = validationErrorSchema.safeParse(await response.json());
    if (body.success) return { success: false, fieldErrors: body.data.fieldErrors };
  }
  if (!response.ok) {
    throw new LoadError("http", `Der Server meldet einen Fehler (HTTP-Status ${response.status}).`);
  }

  const device = deviceSchema.safeParse(await response.json());
  if (!device.success) {
    throw new LoadError("invalid-data", "Die Antwort des Servers enthält ungültige Daten.");
  }
  return { success: true, device: device.data };
}
```

Neue Datei `src/device-form.ts` mit `setupDeviceForm(form, apiBaseUrl, onCreated)`, aufgerufen in `src/main.ts`:

- Beim `submit`-Event `event.preventDefault()`, dann `newDeviceSchema.safeParse(Object.fromEntries(new FormData(form)))`.
- Feldfehler aus `z.flattenError(result.error).fieldErrors` bzw. aus `created.fieldErrors` in die passenden `[data-error-for]`-Elemente schreiben (`output.dataset["errorFor"]`).
- Bei Erfolg Feldfehler leeren, `form.reset()`, Meldung in `.form-message` und `onCreated()`. Der Callback lädt die Liste neu: `select[name="source"]` auf `"/api/devices"` setzen und `dispatchEvent(new Event("change"))`.
- Im `catch` die Meldung des `LoadError` anzeigen, sonst eine allgemeine Meldung.

Das Terminal der API zeigt beim Erfassen:

```text
OPTIONS /api/devices  (Origin: http://localhost:5177)
POST /api/devices  (Origin: http://localhost:5177)
GET /api/devices  (Origin: http://localhost:5177)
```

`Content-Type: application/json` macht den `POST` zu einem nicht einfachen Request; der Browser sendet ihn erst nach der Freigabe durch `allowPreflight`. Im Network-Tab erscheint der Eintrag vom Typ `preflight`.

Serverprüfung testen (umgeht den Browser):

```sh
curl -i -X POST -H "Content-Type: application/json" -d '{"name":" ","category":"tablet"}' http://localhost:3005/api/devices
```

Die Browserprüfung dient der schnellen Rückmeldung, die Serverprüfung der Sicherheit. Neue Geräte liegen nur im Speicher der API.

</details>

<details>
<summary>Lösungshinweis zu Vertiefung 3</summary>

```ts
import { deviceListSchema } from "../device.ts";

export const devices = deviceListSchema.parse([
  { id: 1, name: "ThinkPad T14", category: "laptop", available: true },
  { id: 2, name: "Dell UltraSharp 27", category: "monitor", available: false },
]);
```

Die Annotation `Device[]` entfällt, weil `parse` den Typ liefert. Der Typ kennt nur `id: number`; dass die Nummer eine positive ganze Zahl und der Name nicht leer ist, prüft nur das Schema. Mit `id: 0` meldet `npm test` jetzt einen `ZodError`, bevor ein Test läuft.

</details>

<details>
<summary>Lösungshinweis zu Vertiefung 4</summary>

`jsonplaceholder.typicode.com` gibt die Antwort für jeden Origin frei: `Access-Control-Allow-Origin` nennt den Origin der anfragenden Seite (hier `https://www.srf.ch`). Die NZZ-Startseite sendet keinen solchen Header; der Browser blockiert die Antwort wie in Schritt 2.1, obwohl der Request beim Server ankam.

Mit `mode: "no-cors"` scheitert der Request nicht, aber die Antwort ist **opak**: `type` ist `"opaque"`, `status` ist `0`, der Body leer. `no-cors` verzichtet nur darauf, die Antwort zu lesen.

Meldet die Console einen CSP-Verstoss (`connect-src`), blockiert die **Content Security Policy** der Seite den Request schon vorher. CSP schützt die Seite, CORS den Server.

</details>
