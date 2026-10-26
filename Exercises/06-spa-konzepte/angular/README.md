# Übung 6 (Angular): Schadenfälle – Zustand zuordnen, Route ergänzen, Ablauf mit Playwright prüfen

Eine kleine Single-Page-Application (SPA) zeigt die Schadenfälle einer Versicherung aus einer lokalen API. Ein Suchfeld filtert die Liste. Ein Teil des Zustands liegt am falschen Ort, und eine Detailansicht fehlt. Sie ordnen den Zustand ein, legen ihn an den passenden Ort, ergänzen eine Detailroute und prüfen den Ablauf mit Playwright.

Jeder Schritt enthält einen ausklappbaren Lösungshinweis. Versuchen Sie es zuerst selbst. Führen Sie alle Befehle in diesem Ordner aus.

Diese Variante verwendet die Angular CLI statt Vite+. Die npm-Skripte heissen trotzdem gleich wie in React und Vue.

**Optional mit einem Coding Agent:** Die Schritte 2 bis 5 beginnen mit einem Auftrag für einen Coding Agent mit Terminalzugriff (z. B. Claude Code, Codex, GitHub Copilot, Cursor). Die Anleitung «Schritt für Schritt» danach beschreibt, wie Sie den Schritt manuell lösen; zusammen mit den Lösungshinweisen dient sie auch dazu, das Ergebnis des Agenten zu prüfen. Schritt 1 bearbeiten Sie in jedem Fall selbst: Ihre Zuordnung des Zustands ist der Massstab für die Lösung des Agenten. Hinweise für Agenten stehen in [AGENTS.md](./AGENTS.md). Die laufende Seite untersucht der Agent wie in den bisherigen Übungen mit der Playwright CLI (`npx playwright cli open --browser=chrome http://localhost:5183/`); dafür müssen API und Entwicklungsserver laufen.

## Schritt 1: Anwendung starten, Requests beobachten, Zustand zuordnen

```sh
npm ci
npm run api      # Terminal 1: API auf http://localhost:3183/
npm run dev      # Terminal 2: Seite auf http://localhost:5183/
```

Die API antwortet mit etwa 600 ms Verzögerung, damit Ladezustände sichtbar sind. Der Entwicklungsserver leitet `/api` per Proxy an die API weiter.

Öffnen Sie `http://localhost:5183/` in Chrome, Entwicklerwerkzeuge, Register **Network**, Filter **Fetch/XHR**. Führen Sie im dritten Terminal `npm run check`, `npm test` und `npm run e2e` aus. Notieren Sie, welche Tests scheitern. `npm run check` prüft mit `ng build` auch die Templates. Meldet `npm run check` Formatierungsfehler, korrigiert `npx prettier --write .` sie.

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

Lesen Sie danach `src/app/pages/claim-list-page.ts` mit dem Template `claim-list-page.html` und `src/app/claims/claim-resources.ts`. Zustand liegt in **Signals**: lesen mit `value()`, schreiben mit `value.set(…)`.

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

**Tests:** `npm run check` läuft ohne Fehler. `npm test` besteht mit zwei `todo`. Von den Playwright-Tests bestehen «zeigt die Startseite …» und «filtert die Liste nach dem Titel». Die vier Tests mit «Schritt» im Namen scheitern noch. Der Test für Schritt 5 ist mit `test.fixme` übersprungen.

**Requests:**

1. Beim Laden: ein `GET /api/claims`.
2. Beim Filtern: **keine**. Gefiltert wird auf dem Client.
3. Bei «Aktualisieren»: ein neuer `GET /api/claims`.

Der Browser ruft `http://localhost:5183/api/claims` auf. Erst der Entwicklungsserver leitet den Request an die API auf Port 3183 weiter.

**Schwächen:**

1. Der Suchbegriff liegt nur im Komponentenzustand (`signal`) und geht beim Reload verloren.
2. Die Liste zeigt wieder alle zehn Einträge, das Suchfeld noch «wasser». Sobald neue Daten da sind, überschreibt der `effect` die gefilterte Liste. Gefilterte Liste und Suchbegriff sind **auseinandergelaufen**.
3. «Meier» findet nichts. Die Komponente sucht nur im Titel. `filterClaims` in `src/app/claims/filter-claims.ts` kann es richtig, wird aber nicht verwendet.
4. Wie 2: Während des Ladens hat `onQueryInput` noch keine Liste. Danach setzt der `effect` die ganze Liste.

Ein `effect`, der ein anderes Signal schreibt, ist ein Warnsignal. Fast immer ist das abgeleiteter Zustand. Diesen berechnet man mit `computed`. Die Angular-Dokumentation rät ausdrücklich davon ab, Zustand mit `effect` weiterzugeben.

**Zuordnung:**

| Zustand                               | Art                  | Wo liegt er heute?                                       | Wo gehört er hin?                                          |
| ------------------------------------- | -------------------- | -------------------------------------------------------- | ---------------------------------------------------------- |
| Liste der Schadenfälle                | Serverzustand        | httpResource `claims` in der Listenseite                 | bleibt; die API ist die Quelle, der Client hält eine Kopie |
| Lade- und Fehlerzustand der Liste     | Serverzustand        | ebenfalls in der httpResource (`isLoading()`, `error()`) | bleibt, zusammen mit den Daten                             |
| Suchbegriff                           | URL-Zustand          | `signal` in `ClaimListPage`                              | Query-Parameter `?q=…`                                     |
| Gefilterte Liste                      | abgeleiteter Zustand | eigenes `signal` plus `effect`                           | `computed` aus Liste und Suchbegriff (`filterClaims`)      |
| «2 von 10 Schadenfällen»              | abgeleiteter Zustand | wird im Template berechnet                               | bleibt                                                     |
| Ausgewählter Schadenfall (ID)         | URL-Zustand          | gibt es noch nicht                                       | Pfad `/claims/:id`                                         |
| Angaben des ausgewählten Schadenfalls | Serverzustand        | gibt es noch nicht                                       | `claimResource(id)` in der Detailseite                     |

**Gemeinsamen Client-Zustand** (z. B. die angemeldete Person; in Angular in einem Service mit `providedIn: "root"`) und **lokalen UI-Zustand** (z. B. ein aufklappbarer Bereich) gibt es hier nicht.

Faustregel: Was nach Reload, Lesezeichen oder geteiltem Link erhalten bleiben soll, gehört in die URL. Was sich aus anderem Zustand berechnen lässt, wird berechnet und nicht gespeichert.

</details>

## Schritt 2: Den Suchbegriff in die URL verschieben

### Optional: mit einem Coding Agent

> Der Suchbegriff in `src/app/pages/claim-list-page.ts` liegt nur in einem Signal der Komponente und geht beim Neuladen verloren. Verschiebe ihn in den Query-Parameter `q`: Die Eingabe von «velo» soll zur Adresse `http://localhost:5183/?q=velo` führen, beim Aufruf dieser Adresse soll «velo» im Suchfeld stehen. Ein leerer Suchbegriff entfernt den Parameter. Nicht jeder Tastendruck soll einen Eintrag in der Browser-History erzeugen. Ändere nur, woher der Suchbegriff kommt; das Signal `filteredClaims` und den `effect` noch nicht. Prüfe auf dem laufenden Entwicklungsserver mit der Playwright CLI Reload und Zurück-Button und berichte, was die Liste nach einem Reload von `/?q=velo` zeigt und warum. Führe `npm run check`, `npm test` und `npm run e2e` aus und erkläre, warum der Test «übernimmt den Suchbegriff in die URL …» noch fehlschlägt.

Kritisch prüfen:

- Ist die URL die einzige Quelle des Suchbegriffs, oder gibt es noch ein beschreibbares `signal` dafür?
- Wie liest der Agent den Parameter: als Input dank `withComponentInputBinding()` oder über `ActivatedRoute`? Beides ist möglich; kann er die Wahl begründen?
- Erzeugt jeder Tastendruck einen History-Eintrag? Tippen Sie «velo» und drücken Sie selbst den Zurück-Button.
- Hat der Agent trotz Auftrag schon `filteredClaims` oder den `effect` geändert (`git diff src/`)? Das ist Schritt 3.
- Stimmt seine Erklärung für die ungefilterte Liste nach dem Reload mit dem Lösungshinweis überein?
- Ist `e2e/` unverändert (`git diff e2e/`)?

Den erwarteten Stand beschreibt der Lösungshinweis unten.

### Schritt für Schritt

Ersetzen Sie in `claim-list-page.ts` das Signal `query` durch den Query-Parameter `q`. Die Eingabe von «velo» soll zur Adresse `http://localhost:5183/?q=velo` führen. Beim Aufruf dieser Adresse soll «velo» im Suchfeld stehen.

- Lesen Sie den Suchbegriff als Input `readonly q = input<string>()`. `withComponentInputBinding()` in `app.config.ts` überträgt Query-Parameter auf Inputs mit gleichem Namen.
- Machen Sie daraus ein `computed` `query`, das `""` liefert, wenn der Parameter fehlt. Das Template liest weiterhin `query()`.
- Schreiben Sie den Suchbegriff in `onQueryInput` mit dem Router in die URL: `private readonly router = inject(Router)`, dann `this.router.navigate([], { queryParams: { q: … } })`. Ein leerer Suchbegriff soll den Parameter entfernen (`q: null`).
- Soll jeder Tastendruck einen neuen Eintrag in der Browser-History erzeugen? Probieren Sie es mit und ohne `replaceUrl: true` aus. Drücken Sie danach den Zurück-Button.

Imports: `input`, `computed`, `inject` aus `"@angular/core"`, `Router` aus `"@angular/router"`.

Prüfen Sie: Reload, Lesezeichen und der Zurück-Button behalten den Suchbegriff. Was zeigt die Liste nach einem Reload von `/?q=velo`?

<details>
<summary>Lösungshinweis</summary>

```ts
import { Component, computed, effect, inject, input, signal } from "@angular/core";
import { Router } from "@angular/router";
// …

export class ClaimListPage {
  private readonly router = inject(Router);

  protected readonly claims = claimsResource();

  /** Query-Parameter ?q=…, über withComponentInputBinding an die Komponente gebunden */
  readonly q = input<string>();

  /** URL-Zustand: Der Suchbegriff kommt aus der Adresse. */
  protected readonly query = computed(() => this.q() ?? "");

  protected readonly filteredClaims = signal<ClaimSummary[]>([]);
  // … Konstruktor mit effect vorerst unverändert

  protected onQueryInput(value: string): void {
    // replaceUrl: Nicht jeder Tastendruck soll einen Eintrag in der History erzeugen.
    // null entfernt den Parameter aus der URL.
    void this.router.navigate([], { queryParams: { q: value || null }, replaceUrl: true });
    // … Filtern vorerst unverändert
  }
  // …
}
```

Das Template bleibt unverändert. `[value]="query()"` zeigt immer, was in der URL steht. Die URL ist die einzige Quelle des Suchbegriffs.

`router.navigate` gibt ein Promise zurück; `void` zeigt, dass es bewusst nicht abgewartet wird. Ohne `relativeTo` beziehen sich die leeren Befehle `[]` auf die Wurzel `/`, hier die Listenseite.

Alternativ liest man den Parameter mit `inject(ActivatedRoute).queryParamMap` (ein Observable, mit `toSignal` in ein Signal umgewandelt). Die Input-Variante ist kürzer und macht die Komponente unabhängig vom Router.

**`replaceUrl: true`:** Ohne diese Option erzeugt jeder Tastendruck einen History-Eintrag. Nach «velo» müssten Sie viermal zurück. Mit `replaceUrl` ersetzt jede Eingabe den aktuellen Eintrag. Eine Navigation auf eine andere Seite erzeugt weiterhin einen neuen Eintrag, darum funktioniert der Zurück-Button von der Detailansicht (Schritt 4).

**Nach dem Reload von `/?q=velo`** steht «velo» im Feld, die Liste zeigt aber alle zehn Schadenfälle. Der `effect` füllt `filteredClaims` nach dem Laden mit der ganzen Liste. Der Playwright-Test «übernimmt den Suchbegriff in die URL …» scheitert deshalb weiterhin. Gespeicherter abgeleiteter Zustand muss an jeder Stelle nachgeführt werden. Schritt 3 behebt das grundsätzlich.

</details>

## Schritt 3: Die gefilterte Liste ableiten statt speichern

### Optional: mit einem Coding Agent

> In `src/app/pages/claim-list-page.ts` wird die gefilterte Liste in einem eigenen Signal gespeichert und von einem `effect` nachgeführt. Reproduziere mit der Playwright CLI, dass Suchfeld und Liste auseinanderlaufen: «wasser» eingeben und auf «Aktualisieren» klicken; Seite neu laden und «wasser» eingeben, solange «Lädt …» sichtbar ist. Leite die gefilterte Liste aus der geladenen Liste und dem Suchbegriff ab, statt sie zu speichern. Verwende dafür `filterClaims` aus `src/app/claims/filter-claims.ts` statt der eigenen Filterlogik und ändere `filterClaims` selbst nicht. Ersetze die beiden `test.todo` in `src/app/claims/filter-claims.spec.ts` durch echte Tests. Ändere die Playwright-Tests nicht. Führe `npm run check`, `npm test` und `npm run e2e` aus; die Tests zu Schritt 4 dürfen noch fehlschlagen.

Kritisch prüfen:

- Gibt es noch ein `signal` oder einen `effect` für die gefilterte Liste, oder ist sie ein `computed`?
- Schreibt `onQueryInput` nur noch die URL?
- Verwendet die Komponente `filterClaims`, oder steht dort noch eigene Filterlogik? Findet «Meier» im Browser zwei Schadenfälle?
- Prüfen die neuen Unit-Tests, **welche** Schadenfälle gefunden werden, oder nur, dass die Liste nicht leer ist?
- Sind `src/app/claims/filter-claims.ts` und `e2e/` unverändert (`git diff src/app/claims/filter-claims.ts e2e/`)?

Den erwarteten Stand beschreibt der Lösungshinweis unten.

### Schritt für Schritt

Ersetzen Sie das Signal `filteredClaims` und den `effect` durch ein `computed` aus der geladenen Liste und dem Suchbegriff. Verwenden Sie dafür `filterClaims` aus `src/app/claims/filter-claims.ts` statt der eigenen Filterlogik. `onQueryInput` schreibt danach nur noch die URL.

Ergänzen Sie danach in `src/app/claims/filter-claims.spec.ts` die beiden Tests, die als `test.todo` markiert sind.

Wiederholen Sie die Versuche aus Schritt 1 b). Führen Sie `npm run check`, `npm test` und `npm run e2e` aus. Die Tests zu Schritt 2 und 3 bestehen jetzt.

<details>
<summary>Lösungshinweis</summary>

```ts
import { Component, computed, inject, input } from "@angular/core";
import { Router } from "@angular/router";
import { formatDate, statusLabels } from "../claims/claim";
import { claimsResource, loadErrorMessage } from "../claims/claim-resources";
import { filterClaims } from "../claims/filter-claims";

@Component({
  selector: "app-claim-list-page",
  templateUrl: "./claim-list-page.html",
})
export class ClaimListPage {
  private readonly router = inject(Router);

  protected readonly claims = claimsResource();

  readonly q = input<string>();

  protected readonly query = computed(() => this.q() ?? "");

  /** Abgeleiteter Zustand: berechnet aus Liste und Suchbegriff, nie gespeichert. */
  protected readonly filteredClaims = computed(() =>
    this.claims.hasValue() ? filterClaims(this.claims.value(), this.query()) : [],
  );

  protected onQueryInput(value: string): void {
    void this.router.navigate([], { queryParams: { q: value || null }, replaceUrl: true });
  }

  protected readonly statusLabels = statusLabels;
  protected readonly formatDate = formatDate;
  protected readonly loadErrorMessage = loadErrorMessage;
}
```

Das Template bleibt unverändert. Es liest `filteredClaims()`, egal ob das ein `signal` oder ein `computed` ist.

Jede Information hat jetzt genau eine Quelle: die Liste in der httpResource, den Suchbegriff in der URL. Das `computed` merkt sich, welche Signals es liest (`claims.value` und `q`), und rechnet neu, sobald sich eines ändert.

**Fehlende Unit-Tests:**

```ts
test("findet Schadenfälle über die Schadennummer", () => {
  expect(ids(filterClaims(claims, "s-2026-0104"))).toEqual([4]);
});

test("ignoriert Leerzeichen am Anfang und Ende des Suchbegriffs", () => {
  expect(ids(filterClaims(claims, "  velo "))).toEqual([3]);
});
```

Die Filterlogik ist eine reine Funktion ohne Angular und lässt sich ohne Browser, `TestBed` und Komponente testen. Ob die Komponente sie richtig verwendet, prüft der Playwright-Test.

</details>

## Schritt 4: Eine Detailroute ergänzen

### Optional: mit einem Coding Agent

> Ergänze eine Detailroute `/claims/:id`, zum Beispiel `/claims/4` für «Glasbruch Wohnzimmerfenster». Trage sie in `src/app/app.routes.ts` ein und verlinke in der Liste den Titel jedes Schadenfalls auf seine Detailroute, ohne dass die Seite dabei neu lädt. Setze `src/app/pages/claim-detail-page.ts` mit einem eigenen Template `claim-detail-page.html` um. Verwende die vorbereiteten Funktionen `claimResource`, `isNotFound` und `loadErrorMessage` aus `src/app/claims/claim-resources.ts` und die Komponente `ClaimDetails`. Zeige je nach Zustand `<p class="loading" role="status">Lädt …</p>`, bei einer unbekannten ID die Überschrift «Schadenfall nicht gefunden» mit einem Satz zur ID, bei einem Fehler die Meldung in `<p class="error" role="alert">` oder die Details. Ändere `src/app/claims/` und `server/` nicht. Prüfe mit der Playwright CLI den direkten Aufruf von `/claims/2` samt Reload und von `/claims/999`. Beobachte mit `requests`, welche Requests beim Öffnen eines Schadenfalls und beim Zurück-Navigieren zur Liste entstehen, und erkläre sie. Führe `npm run check`, `npm test` und `npm run e2e` aus.

Kritisch prüfen:

- Verwendet die Liste `routerLink` statt `href`? Ein Klick auf einen Titel darf die Seite nicht neu laden.
- Kommt die ID als Input (`input.required<string>()`) in die Komponente, und erhält `claimResource` das Signal statt eines einmal gelesenen Werts?
- Liest das Template `value()` erst nach `hasValue()` (siehe Lösungshinweis)? Rufen Sie `/claims/999` selbst auf und prüfen Sie die Console.
- Sind `src/app/claims/` und `server/` unverändert (`git diff src/app/claims/ server/`)?
- Kann der Agent erklären, warum die Liste beim Zurück-Navigieren neu lädt? Hat er das ungefragt «behoben», etwa mit einem Service?

Den erwarteten Stand beschreibt der Lösungshinweis unten.

### Schritt für Schritt

Unter `/claims/:id` soll eine Detailansicht erscheinen, zum Beispiel `/claims/4` für «Glasbruch Wohnzimmerfenster».

1. Tragen Sie in `src/app/app.routes.ts` eine Route `claims/:id` für `ClaimDetailPage` ein.
2. Verlinken Sie in `claim-list-page.html` den Titel jedes Schadenfalls mit `<a [routerLink]="…">` auf seine Detailroute. Tragen Sie dafür `RouterLink` (aus `"@angular/router"`) in die `imports` der Komponente ein.
3. Setzen Sie `src/app/pages/claim-detail-page.ts` um. Nehmen Sie die ID als Input `id = input.required<string>()` entgegen; `withComponentInputBinding()` bindet auch Routenparameter. Laden Sie den Schadenfall mit der vorbereiteten Funktion `claimResource(…)`. Die Resource bietet `isLoading()`, `hasValue()`, `value()` und `error()`. Zeigen Sie mit `@if (…) { … } @else if (…) { … }` je nach Zustand an:
   - Laden: `<p class="loading" role="status">Lädt …</p>`
   - nicht gefunden (`isNotFound(…)`): Überschrift «Schadenfall nicht gefunden» und ein Satz mit der ID
   - Fehler: `<p class="error" role="alert">` mit der Meldung von `loadErrorMessage(…)`
   - Erfolg: die vorbereitete Komponente `<app-claim-details [claim]="…" />`; `ClaimDetails` in die `imports` eintragen

   Das Template kann nur Felder der Klasse verwenden, keine importierten Funktionen. Stellen Sie `isNotFound` und `loadErrorMessage` deshalb als `protected readonly` Felder bereit, wie in `claim-list-page.ts`.

Prüfen Sie:

- `http://localhost:5183/claims/2` direkt in der Adresszeile aufrufen und neu laden.
- `http://localhost:5183/claims/999` aufrufen.
- Im Network-Tab: Welche Requests entstehen beim Öffnen eines Schadenfalls und beim Zurück-Navigieren zur Liste? Sind sie nötig?

<details>
<summary>Lösungshinweis</summary>

`app.routes.ts`:

```ts
import { ClaimDetailPage } from "./pages/claim-detail-page";
// …
export const routes: Routes = [
  { path: "", component: ClaimListPage },
  { path: "claims/:id", component: ClaimDetailPage },
  { path: "**", component: NotFoundPage },
];
```

`claim-list-page.ts` und `claim-list-page.html`:

```ts
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: "app-claim-list-page",
  imports: [RouterLink],
  templateUrl: "./claim-list-page.html",
})
```

```html
<td>
  <a [routerLink]="['/claims', claim.id]">{{ claim.title }}</a>
</td>
```

`claim-detail-page.ts`:

```ts
import { Component, input } from "@angular/core";
import { claimResource, isNotFound, loadErrorMessage } from "../claims/claim-resources";
import { ClaimDetails } from "../components/claim-details";

/** Detailansicht eines Schadenfalls unter /claims/:id. */
@Component({
  selector: "app-claim-detail-page",
  imports: [ClaimDetails],
  templateUrl: "./claim-detail-page.html",
})
export class ClaimDetailPage {
  /** Routenparameter :id, über withComponentInputBinding gebunden: bei /claims/4 ist id() === "4" */
  readonly id = input.required<string>();

  protected readonly claim = claimResource(this.id);

  protected readonly isNotFound = isNotFound;
  protected readonly loadErrorMessage = loadErrorMessage;
}
```

Neue Datei `claim-detail-page.html`:

<!-- prettier-ignore -->
```html
@if (claim.isLoading()) {
  <p class="loading" role="status">Lädt …</p>
} @else if (claim.hasValue()) {
  <app-claim-details [claim]="claim.value()" />
} @else if (isNotFound(claim.error())) {
  <h1>Schadenfall nicht gefunden</h1>
  <p>Es gibt keinen Schadenfall mit der ID {{ id() }}.</p>
} @else if (claim.error()) {
  <p class="error" role="alert">
    {{ loadErrorMessage(claim.error(), "Der Schadenfall konnte nicht geladen werden") }}
  </p>
}
```

**`claimResource(this.id)`:** Das Input-Signal `id` ist eine Funktion, die die aktuelle ID liefert. httpResource liest es und lädt neu, wenn sich die ID ändert, etwa bei einer Navigation von `/claims/2` direkt zu `/claims/4`. Das Feld `id` muss über `claim` stehen, weil `claim` es beim Initialisieren braucht.

**Reihenfolge der `@if`-Zweige:** Erst nach `hasValue()` darf das Template `value()` lesen. Bei einem Fehler würde `value()` selbst einen Fehler werfen.

**Direkter Aufruf:** Der Entwicklungsserver liefert für jeden unbekannten Pfad `index.html` aus (SPA-Fallback). Danach wertet der Angular Router den Pfad im Browser aus. Ein Produktionsserver braucht dieselbe Regel, sonst antwortet er bei `/claims/2` mit 404.

**`routerLink` statt `href`:** `routerLink` ändert die URL mit der History API (`history.pushState`). Ein `<a href>` würde die ganze Seite neu laden.

**Requests:**

- Detail öffnen: `GET /api/claims/4`.
- Zurück zur Liste: erneut `GET /api/claims`. Beim Routenwechsel zerstört `<router-outlet>` die Listenseite samt httpResource. Kommt sie zurück, lädt sie neu.

Ob das stört, hängt von der Anwendung ab. Wer es vermeiden will, braucht einen **Cache für Serverzustand**, der länger lebt als die Seite, etwa die Resource in einem Service mit `providedIn: "root"` oder TanStack Query für Angular.

</details>

## Schritt 5: Den Ablauf mit Playwright prüfen

### Optional: mit einem Coding Agent

> Ersetze in `e2e/claims.spec.ts` den Test mit `test.fixme` durch einen echten Test für diesen Ablauf: Startseite öffnen, «Meier» suchen, «Glasbruch Wohnzimmerfenster» anklicken, prüfen, dass die Detailansicht diesen Schadenfall zeigt, mit dem Zurück-Button des Browsers zurück navigieren und prüfen, dass der Suchbegriff noch im Feld steht und die Liste weiterhin gefiltert ist. Verwende nur nutzernahe Locators (`getByRole`, `getByLabel`, `getByText`) und Web-First Assertions, keine CSS-Selektoren, keine Elementnamen wie `app-claim-details` und keine festen Wartezeiten. Der Test muss unverändert auch in `../react` und `../vue` laufen. Ändere die übrigen Tests nicht. Zeige danach, dass der Test einen Rückfall findet: Lege den Suchbegriff vorübergehend wieder in ein `signal`, führe den Test aus, zeige den Fehlschlag und mache die Änderung rückgängig. Führe zum Schluss `npm run check`, `npm test` und `npm run e2e` aus.

Kritisch prüfen:

- Verwendet der Test CSS-Selektoren, Elementnamen wie `app-claim-details`, `data-testid`, `waitForTimeout` oder andere feste Wartezeiten?
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

Führen Sie `npm run e2e` aus. Prüfen Sie danach, ob Ihr Test den Fehler wirklich findet: Speichern Sie den Suchbegriff vorübergehend wieder in einem `signal` statt in der URL. Der Test muss scheitern. Machen Sie die Änderung danach rückgängig.

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
- Der Test kennt keine Klassen und keine Angular-Details wie `app-…`-Elemente. Darum läuft dieselbe Datei unverändert in der React- und der Vue-Variante.

</details>

## Checkliste

- [ ] Der Suchbegriff überlebt Reload und Zurück-Navigation.
- [ ] Kein doppelt gespeicherter, abgeleiteter Zustand und kein `effect`, der Zustand nachführt.
- [ ] Eine Detail-URL funktioniert beim direkten Aufruf. Eine unbekannte ID zeigt eine Meldung.
- [ ] Der Test aus Schritt 5 verwendet nutzernahe Locators, keine festen Wartezeiten und scheitert, wenn der Filter verloren geht.
- [ ] `npm run check`, `npm test` und `npm run e2e` laufen ohne Fehler, ohne `todo` oder `fixme`.
- [ ] Sie können Ihre Zuordnung des Zustands aus Schritt 1 begründen.

## Vertiefung

**a) Eine zweite Variante.** Lösen Sie die Schritte 2 bis 4 in `../react` oder `../vue`. Wo steht der URL-Zustand? Wie wird abgeleiteter Zustand ausgedrückt? Wie kommt der Routenparameter in die Komponente? Führen Sie Ihren Test aus Schritt 5 dort unverändert aus.

Optional mit einem Coding Agent: Starten Sie den Agenten im Zielordner, damit er dessen `AGENTS.md` liest, zum Beispiel in `../react`:

> Übertrage die Lösung der Schritte 2 bis 4 aus `../angular` sinngemäss in dieses Projekt. Verwende die Mittel von React und React Router, wie sie `README.md` in den Schritten 2 bis 4 nennt, und importiere nichts aus anderen Ordnern. Übernimm den Test «behält den Filter nach Detailansicht und Zurück-Navigation» unverändert aus `../angular/e2e/claims.spec.ts` und ersetze damit den Test mit `test.fixme`. Führe `npm run check`, `npm test` und `npm run e2e` aus.

Kritisch prüfen: Ist das Ergebnis typisch für das Zielframework (in React eine Berechnung beim Rendern statt `useEffect`, in Vue `computed` statt `watch`) oder eine wörtliche Übersetzung von Angular-Mustern wie Services oder Signals? Besteht der übernommene Test ohne Änderung? Die Vergleichsfragen in der [Übersicht](../README.md) beantworten Sie selbst.

**b) Rendering.** Passt für diese Anwendung Client-Side Rendering (CSR), Server-Side Rendering (SSR) oder Static Site Generation (SSG)? Was ändert sich, wenn die Detailseiten öffentlich und für Suchmaschinen relevant sein sollen?

<details>
<summary>Lösungshinweis</summary>

Für eine interne Fachanwendung hinter einem Login passt **CSR**, wie hier: keine Suchmaschinen, personenbezogene und laufend geänderte Daten, lange Sitzungen.

Öffentliche, auffindbare Detailseiten brauchen HTML mit Inhalt schon in der ersten Antwort. **SSR** rendert jede Seite auf dem Server mit aktuellen Daten. **SSG** (in Angular «Prerendering») erzeugt sie beim Build und passt nur für selten geänderte Inhalte. Danach übernimmt der Client die Seite (Hydration). Angular bringt das mit `@angular/ssr` selbst mit; pro Route lässt sich die Art des Renderings wählen. Schadenfälle sind allerdings vertraulich; öffentlich wären eher Produktseiten oder Ratgeber.

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

Die **echte API** belegt, dass Frontend, Proxy und Backend zusammenspielen; sie eignet sich für die wichtigsten Abläufe. Eine **ersetzte Antwort** macht Serverfehler, Zeitüberschreitungen oder leere Listen reproduzierbar, prüft aber nur das Frontend. Für Unit-Tests von Services mit `HttpClient` bietet Angular zusätzlich den `HttpTestingController`.

</details>
