# Übung 6 (React): Schadenfälle – Zustand zuordnen, Route ergänzen, Ablauf mit Playwright prüfen

Eine kleine Single-Page-Application (SPA) zeigt die Schadenfälle einer Versicherung aus einer lokalen API. Ein Suchfeld filtert die Liste. Ein Teil des Zustands liegt am falschen Ort, und eine Detailansicht fehlt. Sie ordnen den Zustand ein, legen ihn an den passenden Ort, ergänzen eine Detailroute und prüfen den Ablauf mit Playwright.

Jeder Schritt enthält einen ausklappbaren Lösungshinweis. Versuchen Sie es zuerst selbst. Führen Sie alle Befehle in diesem Ordner aus.

**Optional mit einem Coding Agent:** Die Schritte 2 bis 5 beginnen mit einem Auftrag für einen Coding Agent mit Terminalzugriff (z. B. Claude Code, Codex, GitHub Copilot, Cursor). Die Anleitung «Schritt für Schritt» danach beschreibt, wie Sie den Schritt manuell lösen; zusammen mit den Lösungshinweisen dient sie auch dazu, das Ergebnis des Agenten zu prüfen. Schritt 1 bearbeiten Sie in jedem Fall selbst: Ihre Zuordnung des Zustands ist der Massstab für die Lösung des Agenten. Hinweise für Agenten stehen in [AGENTS.md](./AGENTS.md). Die laufende Seite untersucht der Agent wie in den bisherigen Übungen mit der Playwright CLI (`npx playwright cli open --browser=chrome http://localhost:5181/`); dafür müssen API und Entwicklungsserver laufen.

## Schritt 1: Anwendung starten, Requests beobachten, Zustand zuordnen

```sh
npm ci
npm run api      # Terminal 1: API auf http://localhost:3181/
npm run dev      # Terminal 2: Seite auf http://localhost:5181/
```

Die API antwortet mit etwa 600 ms Verzögerung, damit Ladezustände sichtbar sind. Der Entwicklungsserver leitet `/api` per Proxy an die API weiter.

Öffnen Sie `http://localhost:5181/` in Chrome, Entwicklerwerkzeuge, Register **Network**, Filter **Fetch/XHR**. Führen Sie im dritten Terminal `npm run check`, `npm test` und `npm run e2e` aus. Notieren Sie, welche Tests scheitern.

**a) Requests beobachten.** Welche Requests entstehen

1. beim Laden der Seite,
2. bei der Eingabe eines Suchbegriffs,
3. beim Klick auf «Aktualisieren»?

Vergleichen Sie die URL im Network-Tab mit der Ausgabe im Terminal der API.

**b) Schwächen finden.** Probieren Sie aus und notieren Sie, was passiert:

1. «wasser» eingeben, dann die Seite neu laden (F5).
2. «wasser» eingeben, dann auf «Aktualisieren» klicken.
3. «Meier» eingeben. Das Suchfeld verspricht eine Suche nach «Titel, Kunde oder Schadennummer».
4. Seite neu laden und sofort «wasser» eingeben, solange «Lädt …» sichtbar ist.

Lesen Sie danach `src/pages/ClaimListPage.tsx` und `src/claims/use-claims.ts`. Was meldet `npm run check` für `ClaimListPage.tsx`?

**c) Zustand zuordnen.** Füllen Sie die Tabelle aus. Mögliche Arten: **lokaler UI-Zustand**, **gemeinsamer Client-Zustand**, **Serverzustand**, **URL-Zustand**, **abgeleiteter Zustand**.

| Zustand                               | Art | Wo liegt er heute? | Wo gehört er hin? |
| ------------------------------------- | --- | ------------------ | ----------------- |
| Liste der Schadenfälle von der API    |     |                    |                   |
| Lade- und Fehlerzustand der Liste     |     |                    |                   |
| Suchbegriff                           |     |                    |                   |
| Gefilterte Liste                      |     |                    |                   |
| Anzeige «2 von 10 Schadenfällen»      |     |                    |                   |
| Ausgewählter Schadenfall (welche ID)  |     |                    |                   |
| Angaben des ausgewählten Schadenfalls |     |                    |                   |

<details>
<summary>Lösungshinweis</summary>

**Tests:** `npm run check` meldet eine Warnung. `npm test` besteht mit zwei `todo`. Von den Playwright-Tests bestehen «zeigt die Startseite …» und «filtert die Liste nach dem Titel». Die vier Tests mit «Schritt» im Namen scheitern noch. Der Test für Schritt 5 ist mit `test.fixme` übersprungen.

**Requests:**

1. Beim Laden: `GET /api/claims`, in der Entwicklung **zweimal**, der erste `(canceled)`. React führt Effekte im `StrictMode` absichtlich zweimal aus, um fehlendes Aufräumen sichtbar zu machen. `useClaims` bricht den ersten Request mit dem `AbortController` ab. Im Produktions-Build gibt es nur einen Request.
2. Beim Filtern: **keine**. Gefiltert wird auf dem Client.
3. Bei «Aktualisieren»: ein neuer `GET /api/claims`.

Der Browser ruft `http://localhost:5181/api/claims` auf. Erst der Entwicklungsserver leitet den Request an die API auf Port 3181 weiter.

**Schwächen:**

1. Der Suchbegriff liegt nur im Komponentenzustand (`useState`) und geht beim Reload verloren.
2. Die Liste zeigt wieder alle zehn Einträge, das Suchfeld noch «wasser». Der Effekt `setFilteredClaims(claims.data)` überschreibt die gefilterte Liste. Gefilterte Liste und Suchbegriff sind **auseinandergelaufen**.
3. «Meier» findet nichts. Die Komponente sucht nur im Titel. `filterClaims` in `src/claims/filter-claims.ts` kann es richtig, wird aber nicht verwendet.
4. Wie 2: Während des Ladens hat `handleQueryChange` noch keine Liste. Danach setzt der Effekt die ganze Liste.

`npm run check` warnt mit `react(set-state-in-effect)`. Ein `setState` im Effekt, das nur anderen Zustand nachführt, ist fast immer abgeleiteter Zustand. Diesen berechnet man beim Rendern.

**Zuordnung:**

| Zustand                               | Art                  | Wo liegt er heute?                      | Wo gehört er hin?                                                      |
| ------------------------------------- | -------------------- | --------------------------------------- | ---------------------------------------------------------------------- |
| Liste der Schadenfälle                | Serverzustand        | Hook `useClaims` in der Listenseite     | bleibt; die API ist die Quelle, der Client hält eine Kopie             |
| Lade- und Fehlerzustand der Liste     | Serverzustand        | ebenfalls in `useClaims` (`RemoteData`) | bleibt, zusammen mit den Daten                                         |
| Suchbegriff                           | URL-Zustand          | `useState` in `ClaimListPage`           | Query-Parameter `?q=…`                                                 |
| Gefilterte Liste                      | abgeleiteter Zustand | eigener `useState` plus Effekt          | bei jedem Rendern aus Liste und Suchbegriff berechnen (`filterClaims`) |
| «2 von 10 Schadenfällen»              | abgeleiteter Zustand | wird schon berechnet                    | bleibt                                                                 |
| Ausgewählter Schadenfall (ID)         | URL-Zustand          | gibt es noch nicht                      | Pfad `/claims/:id`                                                     |
| Angaben des ausgewählten Schadenfalls | Serverzustand        | gibt es noch nicht                      | Hook `useClaim(id)` in der Detailseite                                 |

**Gemeinsamen Client-Zustand** (z. B. die angemeldete Person) und **lokalen UI-Zustand** (z. B. ein aufklappbarer Bereich) gibt es hier nicht.

Faustregel: Was nach Reload, Lesezeichen oder geteiltem Link erhalten bleiben soll, gehört in die URL. Was sich aus anderem Zustand berechnen lässt, wird berechnet und nicht gespeichert.

</details>

## Schritt 2: Den Suchbegriff in die URL verschieben

### Optional: mit einem Coding Agent

> Der Suchbegriff in `src/pages/ClaimListPage.tsx` liegt nur im Komponentenzustand und geht beim Neuladen verloren. Verschiebe ihn in den Query-Parameter `q`: Die Eingabe von «velo» soll zur Adresse `http://localhost:5181/?q=velo` führen, beim Aufruf dieser Adresse soll «velo» im Suchfeld stehen. Ein leerer Suchbegriff entfernt den Parameter. Nicht jeder Tastendruck soll einen Eintrag in der Browser-History erzeugen. Ändere nur, woher der Suchbegriff kommt; `filteredClaims` und den Effekt noch nicht. Prüfe auf dem laufenden Entwicklungsserver mit der Playwright CLI Reload und Zurück-Button und berichte, was die Liste nach einem Reload von `/?q=velo` zeigt und warum. Führe `npm run check`, `npm test` und `npm run e2e` aus und erkläre, warum der Test «übernimmt den Suchbegriff in die URL …» noch fehlschlägt.

Kritisch prüfen:

- Ist die URL die einzige Quelle des Suchbegriffs, oder gibt es noch einen `useState` dafür?
- Erzeugt jeder Tastendruck einen History-Eintrag? Tippen Sie «velo» und drücken Sie selbst den Zurück-Button.
- Hat der Agent trotz Auftrag schon `filteredClaims` oder den Effekt geändert (`git diff src/`)? Das ist Schritt 3.
- Stimmt seine Erklärung für die ungefilterte Liste nach dem Reload mit dem Lösungshinweis überein?
- Ist `e2e/` unverändert (`git diff e2e/`)?

Den erwarteten Stand beschreibt der Lösungshinweis unten.

### Schritt für Schritt

Ersetzen Sie in `ClaimListPage.tsx` den Zustand `query` durch den Query-Parameter `q`. Die Eingabe von «velo» soll zur Adresse `http://localhost:5181/?q=velo` führen. Beim Aufruf dieser Adresse soll «velo» im Suchfeld stehen.

- Lesen Sie den Suchbegriff mit `const [searchParams, setSearchParams] = useSearchParams()` (aus `"react-router"`) und `searchParams.get("q")`.
- Schreiben Sie ihn bei jeder Eingabe mit `setSearchParams` zurück. Ein leerer Suchbegriff soll den Parameter entfernen (`setSearchParams({})`).
- Soll jeder Tastendruck einen neuen Eintrag in der Browser-History erzeugen? Probieren Sie es mit und ohne `{ replace: true }` als zweites Argument aus. Drücken Sie danach den Zurück-Button.

Prüfen Sie: Reload, Lesezeichen und der Zurück-Button behalten den Suchbegriff. Was zeigt die Liste nach einem Reload von `/?q=velo`?

<details>
<summary>Lösungshinweis</summary>

```tsx
import { useEffect, useState, type ChangeEvent } from "react";
import { useSearchParams } from "react-router";
// …

export function ClaimListPage() {
  const { claims, reload } = useClaims();

  // URL-Zustand: Der Suchbegriff steht als ?q=… in der Adresse.
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [filteredClaims, setFilteredClaims] = useState<ClaimSummary[]>([]);
  // … Effekt vorerst unverändert

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    // replace: Nicht jeder Tastendruck soll einen Eintrag in der History erzeugen.
    setSearchParams(value === "" ? {} : { q: value }, { replace: true });
    // … Filtern vorerst unverändert
  }
  // …
}
```

`value={query}` zeigt immer, was in der URL steht. `setQuery` gibt es nicht mehr. Die URL ist die einzige Quelle des Suchbegriffs.

**`replace: true`:** Ohne diese Option erzeugt jeder Tastendruck einen History-Eintrag. Nach «velo» müssten Sie viermal zurück. Mit `replace` ersetzt jede Eingabe den aktuellen Eintrag. Eine Navigation auf eine andere Seite erzeugt weiterhin einen neuen Eintrag, darum funktioniert der Zurück-Button von der Detailansicht (Schritt 4).

**Nach dem Reload von `/?q=velo`** steht «velo» im Feld, die Liste zeigt aber alle zehn Schadenfälle. Der Effekt füllt `filteredClaims` nach dem Laden mit der ganzen Liste. Der Playwright-Test «übernimmt den Suchbegriff in die URL …» scheitert deshalb weiterhin. Gespeicherter abgeleiteter Zustand muss an jeder Stelle nachgeführt werden. Schritt 3 behebt das grundsätzlich.

</details>

## Schritt 3: Die gefilterte Liste ableiten statt speichern

### Optional: mit einem Coding Agent

> In `src/pages/ClaimListPage.tsx` wird die gefilterte Liste als eigener Zustand gespeichert und von einem Effekt nachgeführt; `npm run check` warnt mit `react(set-state-in-effect)`. Reproduziere mit der Playwright CLI, dass Suchfeld und Liste auseinanderlaufen: «wasser» eingeben und auf «Aktualisieren» klicken; Seite neu laden und «wasser» eingeben, solange «Lädt …» sichtbar ist. Leite die gefilterte Liste aus der geladenen Liste und dem Suchbegriff ab, statt sie zu speichern. Verwende dafür `filterClaims` aus `src/claims/filter-claims.ts` statt der eigenen Filterlogik und ändere `filterClaims` selbst nicht. Ersetze die beiden `test.todo` in `src/claims/filter-claims.test.ts` durch echte Tests. Ändere die Playwright-Tests nicht. Führe `npm run check`, `npm test` und `npm run e2e` aus; die Tests zu Schritt 4 dürfen noch fehlschlagen.

Kritisch prüfen:

- Gibt es noch einen `useState` oder `useEffect` für die gefilterte Liste? Ist die Warnung weg, ohne dass ein Kommentar die Regel abschaltet?
- Verwendet die Komponente `filterClaims`, oder steht dort noch eigene Filterlogik? Findet «Meier» im Browser zwei Schadenfälle?
- Hat der Agent `useMemo` eingesetzt? Wenn ja: Ist es begründet (siehe Lösungshinweis)?
- Prüfen die neuen Unit-Tests, **welche** Schadenfälle gefunden werden, oder nur, dass die Liste nicht leer ist?
- Sind `src/claims/filter-claims.ts` und `e2e/` unverändert (`git diff src/claims/filter-claims.ts e2e/`)?

Den erwarteten Stand beschreibt der Lösungshinweis unten.

### Schritt für Schritt

Entfernen Sie den Zustand `filteredClaims` und den Effekt. Berechnen Sie die gefilterte Liste beim Rendern aus der geladenen Liste und dem Suchbegriff. Verwenden Sie dafür `filterClaims` aus `src/claims/filter-claims.ts` statt der eigenen Filterlogik.

Ergänzen Sie danach in `src/claims/filter-claims.test.ts` die beiden Tests, die als `test.todo` markiert sind.

Wiederholen Sie die Versuche aus Schritt 1 b). Führen Sie `npm run check`, `npm test` und `npm run e2e` aus. Die Warnung ist weg, und die Tests zu Schritt 2 und 3 bestehen.

<details>
<summary>Lösungshinweis</summary>

```tsx
import type { ChangeEvent } from "react";
import { useSearchParams } from "react-router";
import { formatDate, statusLabels, type ClaimSummary } from "../claims/claim.ts";
import { filterClaims } from "../claims/filter-claims.ts";
import { useClaims } from "../claims/use-claims.ts";

export function ClaimListPage() {
  const { claims, reload } = useClaims();

  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setSearchParams(value === "" ? {} : { q: value }, { replace: true });
  }

  // Abgeleiteter Zustand: bei jedem Rendern aus Liste und Suchbegriff berechnet.
  const filteredClaims = claims.status === "success" ? filterClaims(claims.data, query) : [];

  return (/* JSX unverändert */);
}
```

Jede Information hat jetzt genau eine Quelle: die Liste im Hook, den Suchbegriff in der URL. Die gefilterte Liste entsteht bei jedem Rendern neu und kann nicht veralten.

**`useMemo`?** `useMemo(() => …, [claims, query])` lohnt sich erst bei teuren Berechnungen, nicht für zehn Einträge. Der React Compiler kann solche Berechnungen auch automatisch zwischenspeichern.

**Fehlende Unit-Tests:**

```ts
test("findet Schadenfälle über die Schadennummer", () => {
  expect(ids(filterClaims(claims, "s-2026-0104"))).toEqual([4]);
});

test("ignoriert Leerzeichen am Anfang und Ende des Suchbegriffs", () => {
  expect(ids(filterClaims(claims, "  velo "))).toEqual([3]);
});
```

Die Filterlogik ist eine reine Funktion ohne React und lässt sich ohne Browser und Komponente testen. Ob die Komponente sie richtig verwendet, prüft der Playwright-Test.

</details>

## Schritt 4: Eine Detailroute ergänzen

### Optional: mit einem Coding Agent

> Ergänze eine Detailroute `/claims/:id`, zum Beispiel `/claims/4` für «Glasbruch Wohnzimmerfenster». Trage sie in `src/App.tsx` ein und verlinke in der Liste den Titel jedes Schadenfalls auf seine Detailroute, ohne dass die Seite dabei neu lädt. Setze `src/pages/ClaimDetailPage.tsx` mit dem vorbereiteten Hook `useClaim` aus `src/claims/use-claims.ts` und der Komponente `ClaimDetails` um. Zeige je nach Zustand `<p className="loading" role="status">Lädt …</p>`, bei einer unbekannten ID die Überschrift «Schadenfall nicht gefunden» mit einem Satz zur ID, bei einem Fehler die Meldung in `<p className="error" role="alert">` oder die Details. Ändere `src/claims/` und `server/` nicht. Prüfe mit der Playwright CLI den direkten Aufruf von `/claims/2` samt Reload und von `/claims/999`. Beobachte mit `requests`, welche Requests beim Öffnen eines Schadenfalls und beim Zurück-Navigieren zur Liste entstehen, und erkläre sie. Führe `npm run check`, `npm test` und `npm run e2e` aus.

Kritisch prüfen:

- Verwendet die Liste `<Link>` statt `<a href>`? Ein Klick auf einen Titel darf die Seite nicht neu laden.
- Behandelt die Detailseite jeden Wert von `status`, ohne `!` oder `as`?
- Sind `src/claims/` und `server/` unverändert (`git diff src/claims/ server/`)?
- Kann der Agent erklären, warum die Liste beim Zurück-Navigieren neu lädt? Hat er das ungefragt «behoben», etwa indem er `useClaims` nach `App` verschoben hat? Warum ist das keine gute Lösung (siehe Lösungshinweis)?

Den erwarteten Stand beschreibt der Lösungshinweis unten.

### Schritt für Schritt

Unter `/claims/:id` soll eine Detailansicht erscheinen, zum Beispiel `/claims/4` für «Glasbruch Wohnzimmerfenster».

1. Tragen Sie in `App.tsx` eine Route `claims/:id` für `ClaimDetailPage` ein.
2. Verlinken Sie in der Tabelle von `ClaimListPage.tsx` den Titel jedes Schadenfalls mit `<Link to={…}>` (aus `"react-router"`) auf seine Detailroute.
3. Setzen Sie `src/pages/ClaimDetailPage.tsx` um. Lesen Sie die ID mit `useParams()` aus der Route (Typ `string | undefined`). Laden Sie den Schadenfall mit dem vorbereiteten Hook `useClaim(id)`. Zeigen Sie je nach `status` an:
   - Laden: `<p className="loading" role="status">Lädt …</p>`
   - nicht gefunden: Überschrift «Schadenfall nicht gefunden» und ein Satz mit der ID
   - Fehler: `<p className="error" role="alert">` mit der Meldung
   - Erfolg: die vorbereitete Komponente `<ClaimDetails claim={…} />`

Prüfen Sie:

- `http://localhost:5181/claims/2` direkt in der Adresszeile aufrufen und neu laden.
- `http://localhost:5181/claims/999` aufrufen.
- Im Network-Tab: Welche Requests entstehen beim Öffnen eines Schadenfalls und beim Zurück-Navigieren zur Liste? Sind sie nötig?

<details>
<summary>Lösungshinweis</summary>

`App.tsx`:

```tsx
import { ClaimDetailPage } from "./pages/ClaimDetailPage.tsx";
// …
<Route element={<Layout />}>
  <Route index element={<ClaimListPage />} />
  <Route path="claims/:id" element={<ClaimDetailPage />} />
  <Route path="*" element={<NotFoundPage />} />
</Route>;
```

`ClaimListPage.tsx` (Import `Link` aus `"react-router"` ergänzen):

```tsx
<td>
  <Link to={`/claims/${claim.id}`}>{claim.title}</Link>
</td>
```

`ClaimDetailPage.tsx`:

```tsx
import { useParams } from "react-router";
import { useClaim } from "../claims/use-claims.ts";
import { ClaimDetails } from "../components/ClaimDetails.tsx";

/** Detailansicht eines Schadenfalls unter /claims/:id. */
export function ClaimDetailPage() {
  // Routenparameter: bei /claims/4 ist id === "4"
  const { id = "" } = useParams();
  const claim = useClaim(id);

  switch (claim.status) {
    case "loading":
      return (
        <p className="loading" role="status">
          Lädt …
        </p>
      );
    case "not-found":
      return (
        <>
          <h1>Schadenfall nicht gefunden</h1>
          <p>Es gibt keinen Schadenfall mit der ID {id}.</p>
        </>
      );
    case "error":
      return (
        <p className="error" role="alert">
          {claim.message}
        </p>
      );
    case "success":
      return <ClaimDetails claim={claim.data} />;
  }
}
```

`claim` ist eine diskriminierte Union: `status` legt fest, welche weiteren Felder vorhanden sind. TypeScript prüft, dass der `switch` jeden Fall behandelt, und kennt im Fall `success` das Feld `claim.data`.

**Direkter Aufruf:** Der Entwicklungsserver liefert für jeden unbekannten Pfad `index.html` aus (SPA-Fallback). Danach wertet React Router den Pfad im Browser aus. Ein Produktionsserver braucht dieselbe Regel, sonst antwortet er bei `/claims/2` mit 404.

**`<Link>` statt `<a href>`:** `Link` ändert die URL mit der History API (`history.pushState`). Ein `<a href>` würde die ganze Seite neu laden.

**Requests:**

- Detail öffnen: `GET /api/claims/4` (in der Entwicklung zweimal, siehe Schritt 1).
- Zurück zur Liste: erneut `GET /api/claims`. Beim Routenwechsel entfernt React die Listenseite samt Zustand. Kommt sie zurück, lädt `useClaims` neu.

Ob das stört, hängt von der Anwendung ab. Wer es vermeiden will, braucht einen **Cache für Serverzustand**, der länger lebt als die Seite, etwa TanStack Query (mit `staleTime`) oder die Loader von React Router. Den Hook einfach in `App` zu verschieben, würde die Liste auch auf der Detailseite laden.

</details>

## Schritt 5: Den Ablauf mit Playwright prüfen

### Optional: mit einem Coding Agent

> Ersetze in `e2e/claims.spec.ts` den Test mit `test.fixme` durch einen echten Test für diesen Ablauf: Startseite öffnen, «Meier» suchen, «Glasbruch Wohnzimmerfenster» anklicken, prüfen, dass die Detailansicht diesen Schadenfall zeigt, mit dem Zurück-Button des Browsers zurück navigieren und prüfen, dass der Suchbegriff noch im Feld steht und die Liste weiterhin gefiltert ist. Verwende nur nutzernahe Locators (`getByRole`, `getByLabel`, `getByText`) und Web-First Assertions, keine CSS-Selektoren und keine festen Wartezeiten. Der Test muss unverändert auch in `../vue` und `../angular` laufen. Ändere die übrigen Tests nicht. Zeige danach, dass der Test einen Rückfall findet: Lege den Suchbegriff vorübergehend wieder in einen `useState`, führe den Test aus, zeige den Fehlschlag und mache die Änderung rückgängig. Führe zum Schluss `npm run check`, `npm test` und `npm run e2e` aus.

Kritisch prüfen:

- Verwendet der Test CSS-Selektoren, Klassennamen, `data-testid`, `waitForTimeout` oder andere feste Wartezeiten?
- Prüft er vor dem Klick, dass die Liste geladen und gefiltert ist, und nach `goBack()` sowohl das Suchfeld als auch die Liste?
- Ist der Test beim Rückfall tatsächlich gescheitert, und zwar nach dem Zurück-Navigieren? Ist die Änderung danach wieder rückgängig gemacht (`git diff src/`)?
- Hat der Agent nur den Test mit `test.fixme` ersetzt (`git diff e2e/`)?

Den erwarteten Stand beschreibt der Lösungshinweis unten. Ob der Test auch in einer anderen Variante läuft, prüfen Sie in Vertiefung a.

### Schritt für Schritt

Ersetzen Sie in `e2e/claims.spec.ts` den Test mit `test.fixme` durch einen echten Test:

1. Startseite öffnen.
2. Den Suchbegriff «Meier» eingeben.
3. «Glasbruch Wohnzimmerfenster» anklicken.
4. Prüfen, dass die Detailansicht diesen Schadenfall zeigt.
5. Mit dem Zurück-Button des Browsers zurück navigieren (`page.goBack()`).
6. Prüfen, dass der Suchbegriff noch im Feld steht und die Liste weiterhin gefiltert ist.

Regeln:

- Nutzernahe Locators (`getByRole`, `getByLabel`, `getByText`), keine CSS-Selektoren.
- Web-First Assertions wie `await expect(…).toBeVisible()`. Sie wiederholen die Prüfung, bis sie zutrifft.
- Keine festen Wartezeiten (`waitForTimeout`).

Führen Sie `npm run e2e` aus. Prüfen Sie danach, ob Ihr Test den Fehler wirklich findet: Speichern Sie den Suchbegriff vorübergehend wieder mit `useState` statt in der URL. Der Test muss scheitern. Machen Sie die Änderung danach rückgängig.

<details>
<summary>Lösungshinweis</summary>

```ts
test("behält den Filter nach Detailansicht und Zurück-Navigation", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Suche").fill("Meier");
  await expect(page.getByText("2 von 10 Schadenfällen")).toBeVisible();

  await page.getByRole("link", { name: "Glasbruch Wohnzimmerfenster" }).click();
  await expect(page).toHaveURL(/\/claims\/4$/);
  await expect(page.getByRole("heading", { name: "Glasbruch Wohnzimmerfenster" })).toBeVisible();
  await expect(page.getByText("Peter Meier")).toBeVisible();

  await page.goBack();

  await expect(page.getByLabel("Suche")).toHaveValue("Meier");
  await expect(page.getByText("2 von 10 Schadenfällen")).toBeVisible();
  await expect(page.getByRole("link", { name: "Glasbruch Wohnzimmerfenster" })).toBeVisible();
});
```

- Jede `expect`-Assertion wartet bis zu fünf Sekunden. Die Ladeverzögerung braucht deshalb kein `waitForTimeout`.
- `expect(…"2 von 10 …")` vor dem Klick stellt sicher, dass die Liste geladen und gefiltert ist.
- Nach `goBack()` lädt die Liste neu (Schritt 4). Die Assertions warten darauf.
- Der Test kennt keine Klassen und keine React-Details. Darum läuft dieselbe Datei unverändert in der Vue- und der Angular-Variante.

</details>

## Checkliste

- [ ] Der Suchbegriff überlebt Reload und Zurück-Navigation.
- [ ] Kein doppelt gespeicherter, abgeleiteter Zustand. `npm run check` meldet keine Warnung.
- [ ] Eine Detail-URL funktioniert beim direkten Aufruf. Eine unbekannte ID zeigt eine Meldung.
- [ ] Der Test aus Schritt 5 verwendet nutzernahe Locators, keine festen Wartezeiten und scheitert, wenn der Filter verloren geht.
- [ ] `npm run check`, `npm test` und `npm run e2e` laufen ohne Fehler, ohne `todo` oder `fixme`.
- [ ] Sie können Ihre Zuordnung des Zustands aus Schritt 1 begründen.

## Vertiefung

**a) Eine zweite Variante.** Lösen Sie die Schritte 2 bis 4 in `../vue` oder `../angular`. Wo steht der URL-Zustand? Wie wird abgeleiteter Zustand ausgedrückt? Wie kommt der Routenparameter in die Komponente? Führen Sie Ihren Test aus Schritt 5 dort unverändert aus.

Optional mit einem Coding Agent: Starten Sie den Agenten im Zielordner, damit er dessen `AGENTS.md` liest, zum Beispiel in `../vue`:

> Übertrage die Lösung der Schritte 2 bis 4 aus `../react` sinngemäss in dieses Projekt. Verwende die Mittel von Vue und Vue Router, wie sie `README.md` in den Schritten 2 bis 4 nennt, und importiere nichts aus anderen Ordnern. Übernimm den Test «behält den Filter nach Detailansicht und Zurück-Navigation» unverändert aus `../react/e2e/claims.spec.ts` und ersetze damit den Test mit `test.fixme`. Führe `npm run check`, `npm test` und `npm run e2e` aus.

Kritisch prüfen: Ist das Ergebnis typisch für das Zielframework (`computed` statt `watch` bzw. `effect`) oder eine wörtliche Übersetzung von React-Mustern? Besteht der übernommene Test ohne Änderung? Die Vergleichsfragen in der [Übersicht](../README.md) beantworten Sie selbst.

**b) Rendering.** Passt für diese Anwendung Client-Side Rendering (CSR), Server-Side Rendering (SSR) oder Static Site Generation (SSG)? Was ändert sich, wenn die Detailseiten öffentlich und für Suchmaschinen relevant sein sollen?

<details>
<summary>Lösungshinweis</summary>

Für eine interne Fachanwendung hinter einem Login passt **CSR**, wie hier: keine Suchmaschinen, personenbezogene und laufend geänderte Daten, lange Sitzungen.

Öffentliche, auffindbare Detailseiten brauchen HTML mit Inhalt schon in der ersten Antwort. **SSR** rendert jede Seite auf dem Server mit aktuellen Daten. **SSG** erzeugt sie beim Build und passt nur für selten geänderte Inhalte. Danach übernimmt der Client die Seite (Hydration). Dafür gibt es Meta-Frameworks wie React Router im Framework-Modus oder Next.js. Schadenfälle sind allerdings vertraulich; öffentlich wären eher Produktseiten oder Ratgeber.

</details>

**c) Fehlerfall im Ablauftest.** Schreiben Sie einen zweiten Playwright-Test. Ersetzen Sie darin die Antwort von `GET /api/claims` mit `page.route` durch einen Status 500. Prüfen Sie, dass die Seite eine Fehlermeldung zeigt. Wann sollte ein Ablauftest die echte API verwenden, wann eine ersetzte Antwort?

<details>
<summary>Lösungshinweis</summary>

```ts
test("meldet einen Serverfehler in der Liste", async ({ page }) => {
  await page.route("**/api/claims", (route) =>
    route.fulfill({ status: 500, json: { message: "Datenbank nicht erreichbar" } }),
  );

  await page.goto("/");

  await expect(page.getByRole("alert")).toContainText("HTTP-Status 500");
});
```

`page.route` muss vor `page.goto` stehen. Das Muster `**/api/claims` passt nur auf die Liste, nicht auf `/api/claims/4`.

Die **echte API** belegt, dass Frontend, Proxy und Backend zusammenspielen; sie eignet sich für die wichtigsten Abläufe. Eine **ersetzte Antwort** macht Serverfehler, Zeitüberschreitungen oder leere Listen reproduzierbar, prüft aber nur das Frontend.

</details>
