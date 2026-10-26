# Übung 6 (Vue): Schadenfälle – Zustand zuordnen, Route ergänzen, Ablauf mit Playwright prüfen

Eine kleine Single-Page-Application (SPA) zeigt die Schadenfälle einer Versicherung aus einer lokalen API. Ein Suchfeld filtert die Liste. Ein Teil des Zustands liegt am falschen Ort, und eine Detailansicht fehlt. Sie ordnen den Zustand ein, legen ihn an den passenden Ort, ergänzen eine Detailroute und prüfen den Ablauf mit Playwright.

Jeder Schritt enthält einen ausklappbaren Lösungshinweis. Versuchen Sie es zuerst selbst. Führen Sie alle Befehle in diesem Ordner aus.

**Optional mit einem Coding Agent:** Die Schritte 2 bis 5 beginnen mit einem Auftrag für einen Coding Agent mit Terminalzugriff (z. B. Claude Code, Codex, GitHub Copilot, Cursor). Die Anleitung «Schritt für Schritt» danach beschreibt, wie Sie den Schritt manuell lösen; zusammen mit den Lösungshinweisen dient sie auch dazu, das Ergebnis des Agenten zu prüfen. Schritt 1 bearbeiten Sie in jedem Fall selbst: Ihre Zuordnung des Zustands ist der Massstab für die Lösung des Agenten. Hinweise für Agenten stehen in [AGENTS.md](./AGENTS.md). Die laufende Seite untersucht der Agent wie in den bisherigen Übungen mit der Playwright CLI (`npx playwright cli open --browser=chrome http://localhost:5182/`); dafür müssen API und Entwicklungsserver laufen.

## Schritt 1: Anwendung starten, Requests beobachten, Zustand zuordnen

```sh
npm ci
npm run api      # Terminal 1: API auf http://localhost:3182/
npm run dev      # Terminal 2: Seite auf http://localhost:5182/
```

Die API antwortet mit etwa 600 ms Verzögerung, damit Ladezustände sichtbar sind. Der Entwicklungsserver leitet `/api` per Proxy an die API weiter.

Öffnen Sie `http://localhost:5182/` in Chrome, Entwicklerwerkzeuge, Register **Network**, Filter **Fetch/XHR**. Führen Sie im dritten Terminal `npm run check`, `npm test` und `npm run e2e` aus. Notieren Sie, welche Tests scheitern. `npm run check` prüft mit `vue-tsc` auch die Templates in den `.vue`-Dateien.

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

Lesen Sie danach `src/pages/ClaimListPage.vue` und `src/claims/use-claims.ts`.

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

Der Browser ruft `http://localhost:5182/api/claims` auf. Erst der Entwicklungsserver leitet den Request an die API auf Port 3182 weiter.

**Schwächen:**

1. Der Suchbegriff liegt nur im Komponentenzustand (`ref`) und geht beim Reload verloren.
2. Die Liste zeigt wieder alle zehn Einträge, das Suchfeld noch «wasser». Der `watch` auf `claims` überschreibt die gefilterte Liste. Gefilterte Liste und Suchbegriff sind **auseinandergelaufen**.
3. «Meier» findet nichts. Die Komponente sucht nur im Titel. `filterClaims` in `src/claims/filter-claims.ts` kann es richtig, wird aber nicht verwendet.
4. Wie 2: Während des Ladens hat der `watch` auf `query` noch keine Liste. Danach setzt der `watch` auf `claims` die ganze Liste.

Zwei `watch`, die zusammen einen dritten Zustand nachführen, sind ein Warnsignal. Fast immer ist das abgeleiteter Zustand. Diesen berechnet man mit `computed`.

**Zuordnung:**

| Zustand                               | Art                  | Wo liegt er heute?                        | Wo gehört er hin?                                          |
| ------------------------------------- | -------------------- | ----------------------------------------- | ---------------------------------------------------------- |
| Liste der Schadenfälle                | Serverzustand        | Composable `useClaims` in der Listenseite | bleibt; die API ist die Quelle, der Client hält eine Kopie |
| Lade- und Fehlerzustand der Liste     | Serverzustand        | ebenfalls in `useClaims` (`RemoteData`)   | bleibt, zusammen mit den Daten                             |
| Suchbegriff                           | URL-Zustand          | `ref` in `ClaimListPage`                  | Query-Parameter `?q=…`                                     |
| Gefilterte Liste                      | abgeleiteter Zustand | eigener `ref` plus zwei `watch`           | `computed` aus Liste und Suchbegriff (`filterClaims`)      |
| «2 von 10 Schadenfällen»              | abgeleiteter Zustand | wird im Template berechnet                | bleibt                                                     |
| Ausgewählter Schadenfall (ID)         | URL-Zustand          | gibt es noch nicht                        | Pfad `/claims/:id`                                         |
| Angaben des ausgewählten Schadenfalls | Serverzustand        | gibt es noch nicht                        | Composable `useClaim(id)` in der Detailseite               |

**Gemeinsamen Client-Zustand** (z. B. die angemeldete Person; in Vue in einem Store wie Pinia) und **lokalen UI-Zustand** (z. B. ein aufklappbarer Bereich) gibt es hier nicht.

Faustregel: Was nach Reload, Lesezeichen oder geteiltem Link erhalten bleiben soll, gehört in die URL. Was sich aus anderem Zustand berechnen lässt, wird berechnet und nicht gespeichert.

</details>

## Schritt 2: Den Suchbegriff in die URL verschieben

### Optional: mit einem Coding Agent

> Der Suchbegriff in `src/pages/ClaimListPage.vue` liegt nur im Komponentenzustand und geht beim Neuladen verloren. Verschiebe ihn in den Query-Parameter `q`: Die Eingabe von «velo» soll zur Adresse `http://localhost:5182/?q=velo` führen, beim Aufruf dieser Adresse soll «velo» im Suchfeld stehen. Ein leerer Suchbegriff entfernt den Parameter. Nicht jeder Tastendruck soll einen Eintrag in der Browser-History erzeugen. Das Template soll `v-model="query"` behalten. Ändere nur, woher der Suchbegriff kommt; `filteredClaims` und die beiden `watch` noch nicht. Prüfe auf dem laufenden Entwicklungsserver mit der Playwright CLI Reload und Zurück-Button und berichte, was die Liste nach einem Reload von `/?q=velo` zeigt und warum. Führe `npm run check`, `npm test` und `npm run e2e` aus und erkläre, warum der Test «übernimmt den Suchbegriff in die URL …» noch fehlschlägt.

Kritisch prüfen:

- Ist die URL die einzige Quelle des Suchbegriffs, oder gibt es noch einen `ref` dafür?
- Verwendet der Agent `router.replace` oder `router.push`? Tippen Sie «velo» und drücken Sie selbst den Zurück-Button.
- Wie behandelt er den Typ von `route.query.q`: mit einer Prüfung wie `typeof` oder mit `as string`? Was passiert bei `/?q=a&q=b`?
- Hat der Agent trotz Auftrag schon `filteredClaims` oder die `watch` geändert (`git diff src/`)? Das ist Schritt 3.
- Stimmt seine Erklärung für die ungefilterte Liste nach dem Reload mit dem Lösungshinweis überein?
- Ist `e2e/` unverändert (`git diff e2e/`)?

Den erwarteten Stand beschreibt der Lösungshinweis unten.

### Schritt für Schritt

Ersetzen Sie in `ClaimListPage.vue` den Zustand `query` durch den Query-Parameter `q`. Die Eingabe von «velo» soll zur Adresse `http://localhost:5182/?q=velo` führen. Beim Aufruf dieser Adresse soll «velo» im Suchfeld stehen.

- Lesen Sie den Suchbegriff mit `useRoute()` (aus `"vue-router"`) als `route.query.q`. Der Typ ist `string | null | (string | null)[] | undefined`.
- Schreiben Sie ihn bei jeder Eingabe mit `useRouter()` zurück, etwa `router.replace({ query: { q: "velo" } })`. Ein leerer Suchbegriff soll den Parameter entfernen (`{ query: {} }`).
- Das Template soll `v-model="query"` behalten. Das geht mit einem schreibbaren `computed({ get: () => …, set: (value) => … })`.
- Soll jeder Tastendruck einen neuen Eintrag in der Browser-History erzeugen? Probieren Sie `router.push` und `router.replace` aus. Drücken Sie danach den Zurück-Button.

Prüfen Sie: Reload, Lesezeichen und der Zurück-Button behalten den Suchbegriff. Was zeigt die Liste nach einem Reload von `/?q=velo`?

<details>
<summary>Lösungshinweis</summary>

```ts
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
// …

const { claims, reload } = useClaims();
const route = useRoute();
const router = useRouter();

// URL-Zustand: Der Suchbegriff steht als ?q=… in der Adresse.
// v-model liest über get und schreibt über set.
const query = computed({
  get: () => (typeof route.query.q === "string" ? route.query.q : ""),
  // replace: Nicht jeder Tastendruck soll einen Eintrag in der History erzeugen.
  set: (value: string) => router.replace({ query: value === "" ? {} : { q: value } }),
});

// … filteredClaims und die beiden watch vorerst unverändert
```

Die Prüfung mit `typeof` macht aus fehlendem Parameter oder Array (`?q=a&q=b`) immer einen String. Im Template ändert sich nichts. Die URL ist die einzige Quelle des Suchbegriffs.

**`replace` statt `push`:** Mit `push` erzeugt jeder Tastendruck einen History-Eintrag. Nach «velo» müssten Sie viermal zurück. `replace` ersetzt den aktuellen Eintrag. Eine Navigation auf eine andere Seite erzeugt weiterhin einen neuen Eintrag, darum funktioniert der Zurück-Button von der Detailansicht (Schritt 4).

**Nach dem Reload von `/?q=velo`** steht «velo» im Feld, die Liste zeigt aber alle zehn Schadenfälle. Der `watch` auf `claims` füllt `filteredClaims` nach dem Laden mit der ganzen Liste. Der Playwright-Test «übernimmt den Suchbegriff in die URL …» scheitert deshalb weiterhin. Gespeicherter abgeleiteter Zustand muss an jeder Stelle nachgeführt werden. Schritt 3 behebt das grundsätzlich.

</details>

## Schritt 3: Die gefilterte Liste ableiten statt speichern

### Optional: mit einem Coding Agent

> In `src/pages/ClaimListPage.vue` wird die gefilterte Liste in einem eigenen `ref` gespeichert und von zwei `watch` nachgeführt. Reproduziere mit der Playwright CLI, dass Suchfeld und Liste auseinanderlaufen: «wasser» eingeben und auf «Aktualisieren» klicken; Seite neu laden und «wasser» eingeben, solange «Lädt …» sichtbar ist. Leite die gefilterte Liste aus der geladenen Liste und dem Suchbegriff ab, statt sie zu speichern. Verwende dafür `filterClaims` aus `src/claims/filter-claims.ts` statt der eigenen Filterlogik und ändere `filterClaims` selbst nicht. Ersetze die beiden `test.todo` in `src/claims/filter-claims.test.ts` durch echte Tests. Ändere die Playwright-Tests nicht. Führe `npm run check`, `npm test` und `npm run e2e` aus; die Tests zu Schritt 4 dürfen noch fehlschlagen.

Kritisch prüfen:

- Gibt es noch einen `ref` oder ein `watch` für die gefilterte Liste, oder ist sie ein `computed`?
- Verwendet die Komponente `filterClaims`, oder steht dort noch eigene Filterlogik? Findet «Meier» im Browser zwei Schadenfälle?
- Prüfen die neuen Unit-Tests, **welche** Schadenfälle gefunden werden, oder nur, dass die Liste nicht leer ist?
- Sind `src/claims/filter-claims.ts` und `e2e/` unverändert (`git diff src/claims/filter-claims.ts e2e/`)?

Den erwarteten Stand beschreibt der Lösungshinweis unten.

### Schritt für Schritt

Ersetzen Sie den `ref` `filteredClaims` und die beiden `watch` durch ein `computed` aus der geladenen Liste und dem Suchbegriff. Verwenden Sie dafür `filterClaims` aus `src/claims/filter-claims.ts` statt der eigenen Filterlogik.

Ergänzen Sie danach in `src/claims/filter-claims.test.ts` die beiden Tests, die als `test.todo` markiert sind.

Wiederholen Sie die Versuche aus Schritt 1 b). Führen Sie `npm run check`, `npm test` und `npm run e2e` aus. Die Tests zu Schritt 2 und 3 bestehen jetzt.

<details>
<summary>Lösungshinweis</summary>

```vue
<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { formatDate, statusLabels } from "../claims/claim.ts";
import { filterClaims } from "../claims/filter-claims.ts";
import { useClaims } from "../claims/use-claims.ts";

const { claims, reload } = useClaims();
const route = useRoute();
const router = useRouter();

const query = computed({
  get: () => (typeof route.query.q === "string" ? route.query.q : ""),
  set: (value: string) => router.replace({ query: value === "" ? {} : { q: value } }),
});

// Abgeleiteter Zustand: berechnet aus Liste und Suchbegriff, nie gespeichert.
const filteredClaims = computed(() =>
  claims.value.status === "success" ? filterClaims(claims.value.data, query.value) : [],
);
</script>
```

Das Template bleibt unverändert. Dort ist `filteredClaims` automatisch ausgepackt, also ohne `.value`.

Jede Information hat jetzt genau eine Quelle: die Liste im Composable, den Suchbegriff in der URL. Das `computed` merkt sich, welche reaktiven Werte es liest (`claims` und `route.query`), und rechnet neu, sobald sich einer ändert.

**Fehlende Unit-Tests:**

```ts
test("findet Schadenfälle über die Schadennummer", () => {
  expect(ids(filterClaims(claims, "s-2026-0104"))).toEqual([4]);
});

test("ignoriert Leerzeichen am Anfang und Ende des Suchbegriffs", () => {
  expect(ids(filterClaims(claims, "  velo "))).toEqual([3]);
});
```

Die Filterlogik ist eine reine Funktion ohne Vue und lässt sich ohne Browser und Komponente testen. Ob die Komponente sie richtig verwendet, prüft der Playwright-Test.

</details>

## Schritt 4: Eine Detailroute ergänzen

### Optional: mit einem Coding Agent

> Ergänze eine Detailroute `/claims/:id`, zum Beispiel `/claims/4` für «Glasbruch Wohnzimmerfenster». Trage sie in `src/router.ts` ein und verlinke in der Liste den Titel jedes Schadenfalls auf seine Detailroute, ohne dass die Seite dabei neu lädt. Setze `src/pages/ClaimDetailPage.vue` mit dem vorbereiteten Composable `useClaim` aus `src/claims/use-claims.ts` und der Komponente `ClaimDetails` um. Zeige je nach Zustand `<p class="loading" role="status">Lädt …</p>`, bei einer unbekannten ID die Überschrift «Schadenfall nicht gefunden» mit einem Satz zur ID, bei einem Fehler die Meldung in `<p class="error" role="alert">` oder die Details. Ändere `src/claims/` und `server/` nicht. Prüfe mit der Playwright CLI den direkten Aufruf von `/claims/2` samt Reload und von `/claims/999`. Beobachte mit `requests`, welche Requests beim Öffnen eines Schadenfalls und beim Zurück-Navigieren zur Liste entstehen, und erkläre sie. Führe `npm run check`, `npm test` und `npm run e2e` aus.

Kritisch prüfen:

- Verwendet die Liste `<RouterLink>` statt `<a href>`? Ein Klick auf einen Titel darf die Seite nicht neu laden.
- Wie kommt die ID in die Komponente: als Prop (`props: true`) oder über `useRoute()`? Übergibt die Seite sie als Funktion (`() => props.id`) an `useClaim` oder nur den ersten Wert (siehe Lösungshinweis)?
- Behandelt die Detailseite jeden Wert von `status`, ohne `!` oder `as`?
- Sind `src/claims/` und `server/` unverändert (`git diff src/claims/ server/`)?
- Kann der Agent erklären, warum die Liste beim Zurück-Navigieren neu lädt? Hat er das ungefragt «behoben», etwa mit `<KeepAlive>` oder einem Store?

Den erwarteten Stand beschreibt der Lösungshinweis unten.

### Schritt für Schritt

Unter `/claims/:id` soll eine Detailansicht erscheinen, zum Beispiel `/claims/4` für «Glasbruch Wohnzimmerfenster».

1. Tragen Sie in `src/router.ts` eine Route `/claims/:id` für `ClaimDetailPage` ein. Mit `props: true` kommt der Routenparameter als Prop in die Komponente.
2. Verlinken Sie in der Tabelle von `ClaimListPage.vue` den Titel jedes Schadenfalls mit `<RouterLink :to="…">` auf seine Detailroute. `RouterLink` ist global registriert und braucht keinen Import.
3. Setzen Sie `src/pages/ClaimDetailPage.vue` um. Nehmen Sie die ID mit `defineProps<{ id: string }>()` entgegen (Compiler-Makro, kein Import). Laden Sie den Schadenfall mit dem vorbereiteten Composable `useClaim(…)`. Zeigen Sie je nach `status` an (mit `v-if`, `v-else-if`, `v-else`):
   - Laden: `<p class="loading" role="status">Lädt …</p>`
   - nicht gefunden: Überschrift «Schadenfall nicht gefunden» und ein Satz mit der ID
   - Fehler: `<p class="error" role="alert">` mit der Meldung
   - Erfolg: die vorbereitete Komponente `<ClaimDetails :claim="…" />`

Prüfen Sie:

- `http://localhost:5182/claims/2` direkt in der Adresszeile aufrufen und neu laden.
- `http://localhost:5182/claims/999` aufrufen.
- Im Network-Tab: Welche Requests entstehen beim Öffnen eines Schadenfalls und beim Zurück-Navigieren zur Liste? Sind sie nötig?

<details>
<summary>Lösungshinweis</summary>

`src/router.ts`:

```ts
import ClaimDetailPage from "./pages/ClaimDetailPage.vue";
// …
routes: [
  { path: "/", component: ClaimListPage },
  { path: "/claims/:id", component: ClaimDetailPage, props: true },
  { path: "/:pathMatch(.*)*", component: NotFoundPage },
],
```

`ClaimListPage.vue`:

```vue
<td>
  <RouterLink :to="`/claims/${claim.id}`">{{ claim.title }}</RouterLink>
</td>
```

`ClaimDetailPage.vue`:

```vue
<!-- Detailansicht eines Schadenfalls unter /claims/:id. -->
<script setup lang="ts">
import { useClaim } from "../claims/use-claims.ts";
import ClaimDetails from "../components/ClaimDetails.vue";

// Routenparameter als Prop, weil die Route `props: true` setzt: bei /claims/4 ist id === "4"
const props = defineProps<{ id: string }>();
const claim = useClaim(() => props.id);
</script>

<template>
  <p v-if="claim.status === 'loading'" class="loading" role="status">Lädt …</p>
  <template v-else-if="claim.status === 'not-found'">
    <h1>Schadenfall nicht gefunden</h1>
    <p>Es gibt keinen Schadenfall mit der ID {{ id }}.</p>
  </template>
  <p v-else-if="claim.status === 'error'" class="error" role="alert">{{ claim.message }}</p>
  <ClaimDetails v-else :claim="claim.data" />
</template>
```

**`() => props.id` statt `props.id`:** Navigiert man von `/claims/2` direkt zu `/claims/4`, verwendet Vue dieselbe Komponente weiter und ändert nur die Prop. Weil `useClaim` die ID in einer Funktion liest, bemerkt Vue die Änderung. Mit `useClaim(props.id)` würde nur der erste Wert übergeben.

`claim` ist eine diskriminierte Union: `status` legt fest, welche weiteren Felder vorhanden sind. `vue-tsc` weiss deshalb im Zweig `v-else`, dass `claim.data` existiert.

**Direkter Aufruf:** Der Entwicklungsserver liefert für jeden unbekannten Pfad `index.html` aus (SPA-Fallback). Danach wertet Vue Router den Pfad im Browser aus. Ein Produktionsserver braucht dieselbe Regel, sonst antwortet er bei `/claims/2` mit 404.

**`<RouterLink>` statt `<a href>`:** `RouterLink` ändert die URL mit der History API (`history.pushState`). Ein `<a href>` würde die ganze Seite neu laden.

**Requests:**

- Detail öffnen: `GET /api/claims/4`.
- Zurück zur Liste: erneut `GET /api/claims`. Beim Routenwechsel entfernt `<RouterView>` die Listenseite samt Zustand. Kommt sie zurück, lädt `useClaims` neu.

Ob das stört, hängt von der Anwendung ab. Wer es vermeiden will, braucht einen **Cache für Serverzustand**, der länger lebt als die Seite, etwa TanStack Query für Vue oder einen Store (Pinia). Alternativ behält `<KeepAlive>` innerhalb von `<RouterView>` die Listenseite im Speicher.

</details>

## Schritt 5: Den Ablauf mit Playwright prüfen

### Optional: mit einem Coding Agent

> Ersetze in `e2e/claims.spec.ts` den Test mit `test.fixme` durch einen echten Test für diesen Ablauf: Startseite öffnen, «Meier» suchen, «Glasbruch Wohnzimmerfenster» anklicken, prüfen, dass die Detailansicht diesen Schadenfall zeigt, mit dem Zurück-Button des Browsers zurück navigieren und prüfen, dass der Suchbegriff noch im Feld steht und die Liste weiterhin gefiltert ist. Verwende nur nutzernahe Locators (`getByRole`, `getByLabel`, `getByText`) und Web-First Assertions, keine CSS-Selektoren und keine festen Wartezeiten. Der Test muss unverändert auch in `../react` und `../angular` laufen. Ändere die übrigen Tests nicht. Zeige danach, dass der Test einen Rückfall findet: Lege den Suchbegriff vorübergehend wieder in einen `ref`, führe den Test aus, zeige den Fehlschlag und mache die Änderung rückgängig. Führe zum Schluss `npm run check`, `npm test` und `npm run e2e` aus.

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

Führen Sie `npm run e2e` aus. Prüfen Sie danach, ob Ihr Test den Fehler wirklich findet: Speichern Sie den Suchbegriff vorübergehend wieder in einem `ref` statt in der URL. Der Test muss scheitern. Machen Sie die Änderung danach rückgängig.

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
- Der Test kennt keine Klassen und keine Vue-Details. Darum läuft dieselbe Datei unverändert in der React- und der Angular-Variante.

</details>

## Checkliste

- [ ] Der Suchbegriff überlebt Reload und Zurück-Navigation.
- [ ] Kein doppelt gespeicherter, abgeleiteter Zustand und kein `watch`, das Zustand nachführt.
- [ ] Eine Detail-URL funktioniert beim direkten Aufruf. Eine unbekannte ID zeigt eine Meldung.
- [ ] Der Test aus Schritt 5 verwendet nutzernahe Locators, keine festen Wartezeiten und scheitert, wenn der Filter verloren geht.
- [ ] `npm run check`, `npm test` und `npm run e2e` laufen ohne Fehler, ohne `todo` oder `fixme`.
- [ ] Sie können Ihre Zuordnung des Zustands aus Schritt 1 begründen.

## Vertiefung

**a) Eine zweite Variante.** Lösen Sie die Schritte 2 bis 4 in `../react` oder `../angular`. Wo steht der URL-Zustand? Wie wird abgeleiteter Zustand ausgedrückt? Wie kommt der Routenparameter in die Komponente? Führen Sie Ihren Test aus Schritt 5 dort unverändert aus.

Optional mit einem Coding Agent: Starten Sie den Agenten im Zielordner, damit er dessen `AGENTS.md` liest, zum Beispiel in `../react`:

> Übertrage die Lösung der Schritte 2 bis 4 aus `../vue` sinngemäss in dieses Projekt. Verwende die Mittel von React und React Router, wie sie `README.md` in den Schritten 2 bis 4 nennt, und importiere nichts aus anderen Ordnern. Übernimm den Test «behält den Filter nach Detailansicht und Zurück-Navigation» unverändert aus `../vue/e2e/claims.spec.ts` und ersetze damit den Test mit `test.fixme`. Führe `npm run check`, `npm test` und `npm run e2e` aus.

Kritisch prüfen: Ist das Ergebnis typisch für das Zielframework (in React eine Berechnung beim Rendern statt `useEffect`, in Angular `computed` statt `effect`) oder eine wörtliche Übersetzung von Vue-Mustern? Besteht der übernommene Test ohne Änderung? Die Vergleichsfragen in der [Übersicht](../README.md) beantworten Sie selbst.

**b) Rendering.** Passt für diese Anwendung Client-Side Rendering (CSR), Server-Side Rendering (SSR) oder Static Site Generation (SSG)? Was ändert sich, wenn die Detailseiten öffentlich und für Suchmaschinen relevant sein sollen?

<details>
<summary>Lösungshinweis</summary>

Für eine interne Fachanwendung hinter einem Login passt **CSR**, wie hier: keine Suchmaschinen, personenbezogene und laufend geänderte Daten, lange Sitzungen.

Öffentliche, auffindbare Detailseiten brauchen HTML mit Inhalt schon in der ersten Antwort. **SSR** rendert jede Seite auf dem Server mit aktuellen Daten. **SSG** erzeugt sie beim Build und passt nur für selten geänderte Inhalte. Danach übernimmt der Client die Seite (Hydration). Dafür gibt es Meta-Frameworks wie Nuxt. Schadenfälle sind allerdings vertraulich; öffentlich wären eher Produktseiten oder Ratgeber.

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
