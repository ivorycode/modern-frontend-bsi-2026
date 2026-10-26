# Übung 7: Kursanmeldung – von nativem CSS auf Tailwind umstellen

Die Seite «Kursanmeldung» ist mit nativem CSS gestaltet (`src/styles.css`). Sie stellen sie **schrittweise** auf [Tailwind CSS 4](https://tailwindcss.com/docs) um. Darstellung und Verhalten dürfen sich nicht ändern. Screenshot-Tests halten den Ausgangsstand fest.

Unterwegs treffen Sie auf absichtlich eingebaute **Stolpersteine** (A bis H). Zu jedem gibt es mehrere gültige Varianten. Halten Sie Ihre Wahl und den Grund in [NOTIZEN.md](./NOTIZEN.md) fest. Tailwind-Kenntnisse sind nicht nötig.

- **Teil 1:** Referenz festhalten und die Seite umstellen.
- **Teil 2:** Einen Änderungsauftrag in beiden Fassungen umsetzen.
- **Teil 3:** Beide Ansätze vergleichen.

Jeder Schritt enthält einen ausklappbaren Lösungshinweis. Versuchen Sie es zuerst selbst.

**Optional mit einem Coding Agent:** Die Schritte 1 bis 8 beginnen mit einem Auftrag für einen Coding Agent mit Terminalzugriff (z. B. Claude Code, Codex, GitHub Copilot, Cursor). Die Anleitung «Schritt für Schritt» danach beschreibt, wie Sie den Schritt manuell lösen; zusammen mit den Lösungshinweisen dient sie auch dazu, das Ergebnis des Agenten zu prüfen. Bei jedem Stolperstein nennt der Agent Varianten und wartet auf Ihre Entscheidung; Ihre Wahl und den Grund halten Sie selbst in `NOTIZEN.md` fest. Schritt 0 bearbeiten Sie in jedem Fall selbst: Er erzeugt die Referenzbilder, die der Agent danach nicht verändern darf. Auch Teil 2 und Teil 3 führen Sie selbst durch, denn der Vergleich beruht auf Ihrer eigenen Erfahrung mit beiden Fassungen. Hinweise für Agenten stehen in [AGENTS.md](./AGENTS.md). Die laufende Seite untersucht der Agent wie in den bisherigen Übungen mit der Playwright CLI (`npx playwright cli open --browser=chrome http://localhost:5178/`), Abweichungen der Screenshot-Tests anhand der Diff-Bilder in `test-results/`.

---

## Teil 1: Die Seite umstellen

Alle Befehle im Ordner `Exercises/07-styling` ausführen. Vorgehen in jedem Schritt:

1. Eine Komponente im Markup mit Utilities gestalten.
2. Die zugehörigen Regeln aus `src/styles.css` löschen.
3. `npm run e2e` ausführen. Bei Abweichungen den Bildvergleich ansehen und die Ursache beheben.

Das alte CSS bleibt bis zum Schluss eingebunden. Eine teilweise Umstellung ist ein gültiger Endstand, solange alle Tests grün sind. **Die Schritte 6 und 7 sind optional.**

`src/app.ts` setzt nur Zustandsattribute (`aria-expanded`, `disabled`) und Text, nie Klassen. Es bleibt unverändert.

### Schritt 0: Seite kennenlernen und Referenz festhalten

```sh
npm ci
npm run dev
```

Öffnen Sie `http://localhost:5178/` in Chrome und probieren Sie die Seite aus:

- Ändern Sie die Fensterbreite (oder Device Mode). Ab welcher Breite steht die Zusammenfassung neben dem Formular? Wann stehen in der Zusammenfassung Begriff und Wert nebeneinander?
- Öffnen Sie auf schmalem Bildschirm das Menü.
- Akzeptieren Sie die Bedingungen und senden Sie das Formular mit leeren Pflichtfeldern ab.

Lesen Sie `src/styles.css`. Wo stehen Tokens, Layout und Zustände? Welche Regeln reagieren auf die Breite des Fensters, welche auf die Breite eines Elements?

Erzeugen Sie in einem zweiten Terminal die Referenzbilder und prüfen Sie, dass alle Tests grün sind:

```sh
npm run e2e -- --update-snapshots
npm run e2e
```

Die Tests laufen in drei Viewports: `mobil` (375 px), `grenzfall` (784 px) und `desktop` (1280 px). `--update-snapshots` verwenden Sie danach nur noch bewusst (Teil 2).

<details>
<summary>Lösungshinweis</summary>

- Ab `50rem` (800 px) steht die Zusammenfassung neben dem Formular (`@media (width >= 50rem)`, Abschnitt «Seitenlayout»). Dieselbe Media Query blendet den Menü-Button aus und zeigt die Navigation.
- Begriff und Wert stehen nebeneinander, sobald die **Zusammenfassung selbst** mindestens `30rem` breit ist (`@container (width >= 30rem)`). Das ist bei 784 px der Fall: Dort steht die Zusammenfassung unter dem Formular in voller Breite. Auf dem Desktop ist die Spalte nur 350 px breit, mobil ist der Bildschirm zu schmal.
- Das Menü öffnet sich über `aria-expanded="true"` am Button. Das CSS reagiert mit `.site-header:has([aria-expanded="true"]) .site-nav`.
- Fehler zeigt `.field:has(:user-invalid)`. Ein Feld ist `:user-invalid`, wenn es ungültig ist **und** bearbeitet wurde oder das Formular abgesendet werden sollte. `novalidate` unterdrückt nur die Meldungen des Browsers.

Die Referenzbilder in `e2e/screenshots.spec.ts-snapshots/` sind von Git ausgeschlossen, weil sie vom Betriebssystem abhängen. Der Viewport `grenzfall` liegt absichtlich knapp unter dem Breakpoint von 800 px; er wird in Schritt 4 wichtig.

</details>

### Schritt 1: Tailwind einbinden

#### Optional: mit einem Coding Agent

> Binde Tailwind CSS 4 ein: Plugin `@tailwindcss/vite` in `vite.config.ts`, eine neue Datei `src/tailwind.css` mit `@import "tailwindcss";`, in `src/main.ts` nach `styles.css` importiert. Ändere noch keine Klassen im Markup. Führe `npm run e2e` aus. Sieh dir bei fehlschlagenden Screenshot-Tests die Diff-Bilder in `test-results/` an, beschreibe, was sich verändert hat, und erkläre die Ursache. Nenne Lösungsvarianten mit Vor- und Nachteilen und warte auf meine Entscheidung, bevor du eine umsetzt. Aktualisiere keine Referenzbilder und ändere weder die Tests noch `src/app.ts`.

Kritisch prüfen:

- Hat der Agent die Diff-Bilder tatsächlich angesehen? Vergleichen Sie seine Beschreibung mit dem HTML-Bericht (`npm run e2e -- --reporter=html`, danach `npx playwright show-report`).
- Nennt er Preflight und die Cascade Layers als Ursache? Vergleichen Sie seine Varianten mit dem Lösungshinweis zu Stolperstein A. Schlägt er vor, die Referenzbilder neu zu erzeugen, und begründet er das als Designentscheidung?
- Sind nach der Umsetzung alle Tests grün, ohne dass Referenzbilder neu erzeugt wurden? Die Bilder sind von Git ausgeschlossen; Änderungen sehen Sie am Änderungsdatum (`ls -l e2e/screenshots.spec.ts-snapshots/`).
- Sind `e2e/`, `playwright.config.ts` und `src/app.ts` unverändert (`git status`)?

Den erwarteten Stand beschreibt der Lösungshinweis unten.

#### Schritt für Schritt

`tailwindcss` und `@tailwindcss/vite` sind bereits installiert.

1. Ergänzen Sie das Tailwind-Plugin in `vite.config.ts`:

   ```ts
   import tailwindcss from "@tailwindcss/vite";
   import { defineConfig } from "vite-plus";

   export default defineConfig({
     plugins: [tailwindcss()],
     // … bisherige Einstellungen
   });
   ```

2. Legen Sie `src/tailwind.css` an:

   ```css
   @import "tailwindcss";
   ```

3. Importieren Sie die Datei in `src/main.ts` nach `styles.css`:

   ```ts
   import "./styles.css";
   import "./tailwind.css";
   ```

4. Starten Sie den Entwicklungsserver neu und führen Sie `npm run e2e` aus.

Die Screenshot-Tests schlagen fehl, obwohl Sie noch keine Klasse geändert haben. Erzeugen Sie einen HTML-Bericht mit `npm run e2e -- --reporter=html`; bei Fehlern öffnet er sich im Browser, später erneut mit `npx playwright show-report` (beenden mit Ctrl+C). Ohne `--reporter=html` entsteht kein Bericht, nur die Bilder in `test-results/`. Vergleichen Sie die Bilder (Register **Diff** oder Schieberegler). Was hat sich verändert, und warum?

**Stolperstein A: Preflight verändert die Seite.** Wie gehen Sie damit um?

<details>
<summary>Lösungshinweis</summary>

Die Überschriften «Kursanmeldung» und «Ihre Anmeldung» sind nicht mehr fett. Die Liste «Im Kurs enthalten» hat keine Aufzählungszeichen und keinen Einzug mehr.

Ursache ist **Preflight**, der Reset von Tailwind. Tailwind ordnet sein CSS in Cascade Layers: `theme`, `base` (darin Preflight), `components` und `utilities`. Preflight setzt unter anderem `font-weight: inherit` für Überschriften und `list-style: none; padding: 0` für Listen. Das alte CSS setzt die Schriftstärke der Überschriften und den Stil der Liste nicht, sondern nutzt den Browser-Standard. Wo das alte CSS eine Eigenschaft selbst setzt, gewinnt es, denn CSS ausserhalb von Layern schlägt jeden Layer. Wo es den Browser-Standard nutzt, greift Preflight.

**Variante a: Betroffene Elemente ausdrücklich gestalten** (empfohlen):

```html
<h1 class="page__title font-bold">Kursanmeldung</h1>
…
<h2 class="summary__title font-bold" id="summary-title">Ihre Anmeldung</h2>
…
<ul class="summary__includes list-disc pl-10"></ul>
```

Die Utilities wirken, weil das alte CSS diese Eigenschaften nicht setzt und `utilities` gegen `base` gewinnt. `pl-10` entspricht den 40 px Einzug des Browsers.

**Variante b: Preflight vorerst weglassen.** Statt `@import "tailwindcss";`:

```css
@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities);
```

Die Tests sind sofort grün. Am Schluss müssen Sie Preflight trotzdem einbinden und dieselben Abweichungen beheben. Das Problem wird nur verschoben.

**Variante c: Änderung als Designentscheidung akzeptieren** und die Referenzbilder mit `--update-snapshots` neu erzeugen. Nur zulässig, wenn die neue Darstellung gewollt und abgesprochen ist. Wer Referenzbilder aktualisiert, nur um Tests grün zu bekommen, entwertet das Sicherheitsnetz.

</details>

### Schritt 2: Design Tokens übertragen

#### Optional: mit einem Coding Agent

> Übertrage die Design Tokens aus dem `:root`-Block von `src/styles.css` in einen `@theme`-Block in `src/tailwind.css`: Farben, Radien, Schriftgrössen und Schrift mit denselben Namen, den Grundabstand `--space-unit` als `--spacing`. Lösche danach in `src/styles.css` alle Tokens ausser den Abständen und erkläre, woher das alte CSS die Werte jetzt bezieht. Erkläre auch, welche Farben und Schriftgrössen von Tailwind danach zusätzlich zur Verfügung stehen und was die Utilities für Schriftgrössen ausser der Grösse setzen. Nenne für beides Varianten mit Vor- und Nachteilen und warte auf meine Entscheidung. Führe `npm run e2e` aus. Aktualisiere keine Referenzbilder und ändere weder die Tests noch `src/app.ts`.

Kritisch prüfen:

- Stimmen alle Werte im `@theme`-Block mit dem bisherigen `:root` überein? Fehlt eine Farbe, die das alte CSS verwendet?
- Erzeugt `text-red-600` nach Ihrer Entscheidung noch CSS? Probieren Sie es an einer Überschrift selbst aus.
- Hat der Agent die Zeilenhöhe von `text-sm` erwähnt (Stolperstein B)? Wird sie jetzt übersehen, fallen die Abweichungen erst in Schritt 5 auf.
- Sind die Referenzbilder unverändert (`ls -l e2e/screenshots.spec.ts-snapshots/`)?

Den erwarteten Stand beschreibt der Lösungshinweis unten.

#### Schritt für Schritt

Übertragen Sie die Tokens aus dem `:root`-Block von `src/styles.css` in einen `@theme`-Block in `src/tailwind.css` (nach dem Import). Aus einem Theme-Token wie `--color-primary` erzeugt Tailwind Utilities wie `bg-primary`, `text-primary` und `border-primary`.

- Farben: `--color-*` mit denselben Namen.
- Abstände: Tailwind rechnet mit einem Grundabstand `--spacing`, das alte CSS genauso mit `--space-unit`. `p-4` bedeutet `calc(var(--spacing) * 4)`.
- Radien `--radius-*`, Schriftgrössen `--text-*`, Schrift `--font-sans`.

Löschen Sie danach im alten CSS die Tokens für Farben, Radien, Schrift und Schriftgrössen aus `:root`. Nur die Abstände bleiben. Führen Sie `npm run e2e` aus. Das alte CSS verwendet weiterhin `var(--color-primary)` usw. Woher kommen die Werte jetzt?

**Stolperstein B: Standardpalette und Zeilenhöhen.** Setzen Sie vorübergehend `class="text-red-600"` an einer Überschrift. Was passiert? Lesen Sie ausserdem im Lösungshinweis, was `text-sm` neben der Schriftgrösse noch setzt.

<details>
<summary>Lösungshinweis</summary>

```css
@import "tailwindcss";

@theme {
  --color-*: initial;
  --color-primary: #1a5fb4;
  --color-primary-hover: #154a8c;
  --color-text: #1f2933;
  --color-muted: #52606d;
  --color-border: #c5ced8;
  --color-surface: #f4f6f8;
  --color-danger: #b42318;
  --color-white: #ffffff;

  --spacing: 0.25rem;

  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;

  --text-*: initial;
  --text-sm: 0.875rem;
  --text-sm--line-height: 1.5;
  --text-base: 1rem;
  --text-base--line-height: 1.5;
  --text-lg: 1.25rem;
  --text-lg--line-height: 1.5;
  --text-xl: 1.75rem;
  --text-xl--line-height: 1.5;

  --font-sans: system-ui, sans-serif;
}
```

Tailwind gibt die Theme-Variablen als Custom Properties auf `:root` aus (Layer `theme`). Weil die Namen gleich sind, liest das alte CSS seine Farben jetzt aus dem `@theme`-Block. Tailwind gibt eine Variable nur aus, wenn sie verwendet wird; `var(--color-danger)` im alten CSS zählt als Verwendung. Wer auch die Abstände an einer Stelle haben will, schreibt im alten CSS `--space-unit: var(--spacing);`.

**Standardpalette.** Ohne `--color-*: initial;` stehen alle Farben von Tailwind zur Verfügung; `text-red-600` funktioniert dann wie `text-danger`.

- **a) Palette entfernen** mit `--color-*: initial;` (wie oben). `text-red-600` erzeugt kein CSS mehr. Auch `white` und `black` gehören zur Palette und müssen bei Bedarf selbst definiert werden.
- **b) Palette behalten** und Konsistenz über Reviews sichern. Flexibler, aber Werte ausserhalb der Tokens schleichen sich leicht ein, weil sie wie Tokens aussehen.

**Zeilenhöhen.** `text-sm` setzt `font-size: 0.875rem` **und** `line-height: calc(1.25 / 0.875)` (etwa 1.43). Das alte CSS setzt nur die Grösse und erbt 1.5 vom `body`. Ohne Anpassung verschieben sich in Schritt 5 und 7 alle Zeilen mit `text-sm` um Bruchteile von Pixeln.

- **a) Zeilenhöhe als Teil des Tokens** mit `--text-sm--line-height: 1.5` (wie oben). `--text-*: initial;` entfernt die übrigen Schriftgrössen von Tailwind.
- **b) Zeilenhöhe an jeder Stelle setzen:** `text-sm leading-normal`.
- **c) Zeilenhöhen von Tailwind übernehmen** und die Referenzbilder bewusst aktualisieren. Das ist eine Designentscheidung.

</details>

### Schritt 3: Seitenkopf und Navigation umstellen

Utilities sind kleine Klassen für je eine CSS-Eigenschaft, direkt im Markup. Tailwind erzeugt nur CSS für Klassen, die in den Projektdateien vorkommen.

```html
<!-- Natives CSS: .hint { margin-top: var(--space-2); color: var(--color-muted); font-size: var(--text-sm); } -->
<p class="hint">…</p>
<!-- Tailwind -->
<p class="mt-2 text-sm text-muted">…</p>
```

- **Varianten** für Zustände und Breiten: `hover:`, `focus-visible:`, `disabled:`, `md:`; verkettbar, etwa `md:hover:underline`.
- **Willkürliche Werte** in eckigen Klammern: `w-[350px]`, `grid-cols-[8rem_1fr]` (Leerzeichen als `_`). Praktisch, umgeht aber die Tokens.
- Nachschlagen: auf [tailwindcss.com/docs](https://tailwindcss.com/docs) nach dem Namen der CSS-Eigenschaft suchen. In VS Code hilft die Erweiterung **Tailwind CSS IntelliSense** (Vervollständigung, erzeugtes CSS beim Überfahren).

#### Optional: mit einem Coding Agent

> Stelle den Seitenkopf mit Navigation (Abschnitt «Seitenkopf mit Navigation» in `src/styles.css`, inklusive Media Query) in `index.html` auf Tailwind-Utilities um und lösche die zugehörigen Regeln aus `src/styles.css`. Schreibe den Breakpoint von `50rem` vorerst als `min-[50rem]:`. Die Navigation muss weiterhin erscheinen, sobald der Menü-Button `aria-expanded="true"` trägt. Prüfe mit der Playwright CLI das Menü bei 375 px Breite und den Seitenkopf bei 1280 px und führe `npm run e2e` aus. Wenn eine Utility nicht wirkt oder ein Test fehlschlägt: Erkläre die Ursache, nenne Varianten mit Vor- und Nachteilen und warte auf meine Entscheidung. Aktualisiere keine Referenzbilder und ändere weder die Tests noch `src/app.ts`.

Kritisch prüfen:

- Kann der Agent erklären, warum Utilities gegen das alte CSS verlieren (Stolperstein C)? Steht der Inhalt des Kopfs bei 1280 px noch zentriert? Prüfen Sie es selbst.
- Hat er Utilities mit dem Wichtig-Modifier (`bg-danger!`) durchgesetzt?
- Wie macht er die Navigation vom Zustand des Buttons abhängig (Stolperstein D)? Vergleichen Sie mit den Varianten im Lösungshinweis.
- Hat er nur die Regeln des Seitenkopfs und die Grundregel für `*` gelöscht (`git diff src/styles.css`)? Ist `src/app.ts` unverändert?
- Sind die Referenzbilder unverändert (`ls -l e2e/screenshots.spec.ts-snapshots/`)?

Den erwarteten Stand beschreibt der Lösungshinweis unten.

#### Schritt für Schritt

Gestalten Sie `header`, Markenname, Menü-Button und Navigation mit Utilities (Abschnitt «Seitenkopf mit Navigation», inklusive Media Query). Den Breakpoint von `50rem` schreiben Sie vorerst als `min-[50rem]:`.

Manche Regeln brauchen Sie nicht mehr, weil Preflight sie setzt: Links erben Farbe und Textdekoration, Buttons erben die Schrift, Listen haben weder Aufzählungszeichen noch Innenabstand.

**Stolperstein C: Altes CSS überschreibt Utilities.** Setzen Sie zuerst nur `bg-danger` am `header`, ohne die Regel `.site-header` zu löschen. Wirkt die Klasse? Untersuchen Sie das Element in den Entwicklerwerkzeugen (Register **Styles**). Prüfen Sie nach der Umstellung auf dem Desktop: Steht der Inhalt des Kopfs noch zentriert?

**Stolperstein D, Teil 1: Zustand eines anderen Elements.** Die Navigation wird sichtbar, wenn der Menü-Button `aria-expanded="true"` trägt. Wie drücken Sie das mit Utilities aus?

<details>
<summary>Lösungshinweis</summary>

**Zu Stolperstein C:** `bg-danger` wirkt nicht; in den Entwicklerwerkzeugen ist es durchgestrichen, obwohl die Spezifität gleich ist und `tailwind.css` später geladen wird. CSS ausserhalb von Layern gewinnt **immer** gegen CSS in einem Layer, unabhängig von Spezifität und Reihenfolge. Das alte CSS liegt in keinem Layer, die Utilities in `@layer utilities`.

- **a) Alte Regel im selben Schritt löschen**, Komponente für Komponente (empfohlen). Jeder Schritt bleibt für sich überprüfbar.
- **b) Altes CSS in einen Layer unterhalb der Utilities verschieben.** Ganz oben in `src/tailwind.css`:

  ```css
  @layer theme, base, legacy, components, utilities;
  @import "tailwindcss";
  @import "./styles.css" layer(legacy);
  ```

  Den Import von `styles.css` in `src/main.ts` entfernen. Utilities gewinnen dann immer; das alte CSS gewinnt weiterhin gegen Preflight (`base`). Passt zu grossen Beständen.

- **c) Wichtig-Modifier:** `bg-danger!` erzeugt `!important`. Eskaliert die Kaskade; nur als Notlösung.

Dasselbe Problem tritt versteckt auf: Auf dem Desktop rutscht der Inhalt des Kopfs nach links, obwohl `mx-auto` gesetzt ist. Die Grundregel `*, *::before, *::after { box-sizing: border-box; margin: 0; }` im alten CSS liegt in keinem Layer. `margin: 0` schlägt `mx-auto` und später auch `mt-2`, `mb-6` oder `-mt-2`. Löschen Sie die Grundregel; Preflight setzt `box-sizing` und `margin: 0` bereits. Wer Preflight noch weglässt (Schritt 1, Variante b), verschiebt stattdessen das alte CSS in einen Layer (Variante b oben).

**Zu Stolperstein D:** Ein mit `group` markiertes Element lässt Nachfahren mit `group-…:` auf seinen Zustand reagieren.

- **a) `group-has-[[aria-expanded=true]]:block`** an der Navigation, `group` am `header`. Bildet den CSS-Selektor fast wörtlich nach. Kürzer: `group-has-aria-expanded:block`.
- **b) Eigene Variante** in `src/tailwind.css`:

  ```css
  @custom-variant menu-open (header:has([aria-expanded="true"]) &);
  ```

  An der Navigation dann `menu-open:block`. Gut lesbar, aber der Selektor steht im CSS statt im Markup.

- **c) Das Skript setzt zusätzlich ein Attribut** wie `data-open` an der Navigation (`data-open:block`). Erfordert eine Änderung an `app.ts`; in dieser Übung nicht vorgesehen.

Ergebnis mit Variante a (Ausschnitt):

```html
<header class="group bg-primary text-white">
  <div
    class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3"
  >
    <a class="text-lg font-bold" href="/">Kursportal</a>
    <button
      class="cursor-pointer rounded-sm border border-white px-3 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white min-[50rem]:hidden"
      type="button"
      aria-expanded="false"
      aria-controls="site-nav"
    >
      Menü
    </button>
    <nav
      class="hidden basis-full group-has-[[aria-expanded=true]]:block min-[50rem]:block min-[50rem]:basis-auto"
      id="site-nav"
      aria-label="Hauptnavigation"
    >
      <ul class="flex flex-col gap-1 min-[50rem]:flex-row min-[50rem]:gap-6">
        <li>
          <a class="block py-2 hover:underline aria-[current=page]:font-bold" href="#kurse"
            >Kurse</a
          >
        </li>
        <!-- … gleich für «Anmeldung» und «Kontakt» -->
      </ul>
    </nav>
  </div>
</header>
```

Aus `src/styles.css` löschen: `.site-header`, `.brand`, `.menu-button`, `.site-nav`, die Regel mit `:has()`, die erste Media Query und die Grundregel für `*`. Bei `text-lg` am Markennamen greift die Zeilenhöhe aus Stolperstein B zum ersten Mal.

</details>

### Schritt 4: Seitenlayout umstellen

#### Optional: mit einem Coding Agent

> Stelle das Seitenlayout (Abschnitt «Seitenlayout» in `src/styles.css`: `main`, Titel, Einleitung und das Raster aus Formular und Zusammenfassung) auf Utilities um und lösche die zugehörigen Regeln. Verwende für die Breite zunächst den Standard-Breakpoint `md:`, auch im Seitenkopf. Führe `npm run e2e` aus und berichte, welche Tests in welchem Viewport fehlschlagen und warum. Laut Designvorgabe ist die Zusammenfassung auf breiten Bildschirmen genau `350px` breit. Nenne für den Breakpoint und für diese Breite Varianten mit Vor- und Nachteilen und warte auf meine Entscheidung. Aktualisiere keine Referenzbilder und ändere weder die Tests noch `src/app.ts`.

Kritisch prüfen:

- Hat der Agent erkannt, dass nur der Viewport `grenzfall` betroffen ist, und den Unterschied zwischen `md` (48rem) und dem Design (50rem) benannt (Stolperstein E)?
- Wie überträgt er die `350px` (Stolperstein F)? Vorsicht bei `w-87.5`: Es sieht aus wie ein Token, hängt aber am Grundabstand (siehe Lösungshinweis).
- Steht der Breakpoint nach Ihrer Entscheidung an allen Stellen einheitlich, auch im Seitenkopf?
- Sind die Referenzbilder unverändert (`ls -l e2e/screenshots.spec.ts-snapshots/`)?

Den erwarteten Stand beschreibt der Lösungshinweis unten.

#### Schritt für Schritt

Gestalten Sie `main`, Titel, Einleitung und das Raster aus Formular und Zusammenfassung (Abschnitt «Seitenlayout»). Verwenden Sie für die Breite diesmal den Standard-Breakpoint `md:` statt `min-[50rem]:`, auch im Seitenkopf. Führen Sie `npm run e2e` aus.

**Stolperstein E: Grössen ausserhalb der Skala.** Welche Tests schlagen fehl, und in welchem Viewport?

**Stolperstein F: Ein Wert aus der Designvorgabe.** Die Zusammenfassung ist auf breiten Bildschirmen genau `350px` breit. Wie übertragen Sie diesen Wert?

<details>
<summary>Lösungshinweis</summary>

**Zu Stolperstein E:** Nur die Tests im Viewport `grenzfall` scheitern. `md` liegt bei `48rem` (768 px), das Design wechselt bei `50rem` (800 px). Dazwischen stehen Formular und Zusammenfassung zu früh nebeneinander.

- **a) Willkürlicher Breakpoint `min-[50rem]:`.** Exakt, aber an jeder Stelle wiederholt (hier sechs Stellen).
- **b) Eigener Breakpoint als Token** (empfohlen), im `@theme`-Block:

  ```css
  --breakpoint-wide: 50rem;
  ```

  Danach steht `wide:` zur Verfügung. Alternativ überschreibt `--breakpoint-md: 50rem;` den Standard; kürzer, aber wer Tailwind kennt, erwartet bei `md` 48rem.

- **c) Design an `md` angleichen** und Referenzbilder bewusst aktualisieren. Eine abzusprechende Designentscheidung.

**Zu Stolperstein F:**

- **a) Willkürlicher Wert:** `wide:grid-cols-[minmax(0,1fr)_350px]`. Der Wert ist sichtbar eine Ausnahme.
- **b) Wert als Token:** `--spacing-summary: 350px;` im `@theme`-Block. Dann gibt es `w-summary`, im Raster `wide:grid-cols-[minmax(0,1fr)_var(--spacing-summary)]`.
- **c) Auf die Skala runden:** `22rem` (352 px). Die Abweichung von 2 px muss das Design entscheiden.

Vorsicht: `w-87.5` ergibt zwar genau 350 px und sieht aus wie ein Token, ist aber `calc(var(--spacing) * 87.5)`. Tailwind 4 akzeptiert jedes Vielfache von `0.25`. Der Wert ändert sich mit dem Grundabstand (siehe Teil 2), die `350px` der Designvorgabe nicht.

Ergebnis (Ausschnitt):

```html
<main class="mx-auto max-w-6xl px-4 pt-6 pb-8" id="anmeldung">
  <h1 class="text-xl leading-tight font-bold">Kursanmeldung</h1>
  <p class="mt-2 mb-6 text-muted">…</p>

  <div class="grid items-start gap-8 wide:grid-cols-[minmax(0,1fr)_350px]">
    <form class="grid gap-4" novalidate>…</form>
    <aside …>…</aside>
  </div>
</main>
```

`max-w-6xl` entspricht genau `72rem`. Ersetzen Sie im Seitenkopf `min-[50rem]:` beziehungsweise `md:` durch `wide:`.

</details>

### Schritt 5: Formular und Zustände umstellen

#### Optional: mit einem Coding Agent

> Stelle das Formular (Abschnitt «Formular» in `src/styles.css`: Felder, Labels, Fehlermeldungen, Auswahl «Teilnahme», Checkbox und Statusmeldung) auf Utilities um, mit Hover, Fokus und Fehlerzustand; die Buttons noch nicht. Lösche die zugehörigen Regeln. Der Fehlerzustand muss wie bisher über `:user-invalid` entstehen. Führe `npm run e2e` aus. Vergleiche danach mit der Playwright CLI die Tailwind-Fassung (`/`) mit der CSS-Referenz (`/css-referenz/`): Bedingungen akzeptieren, Formular mit leeren Pflichtfeldern absenden, dann mit der Maus über das Feld «Name» fahren. Berichte jeden Unterschied und erkläre, warum die Tests ihn nicht bemerken. Nenne bei Problemen Varianten mit Vor- und Nachteilen und warte auf meine Entscheidung. Aktualisiere keine Referenzbilder und ändere weder die Tests noch `src/app.ts`.

Kritisch prüfen:

- Wie färbt der Agent Label und Meldung im Fehlerzustand (Stolperstein D, Teil 2)? Mit `peer` allein lässt sich das Label vor dem Eingabefeld nicht färben.
- Hat er den Unterschied beim Überfahren eines ungültigen Feldes gefunden und erklärt (Stolperstein G)? Prüfen Sie es selbst im Browser.
- Hat er kleine Abweichungen in den Screenshots mit willkürlichen Werten wie `mt-[3px]` ausgeglichen, statt die Ursache zu suchen (etwa die Zeilenhöhe aus Stolperstein B)?
- Ist `src/app.ts` unverändert, und sind die Referenzbilder unverändert (`ls -l e2e/screenshots.spec.ts-snapshots/`)?

Den erwarteten Stand beschreibt der Lösungshinweis unten.

#### Schritt für Schritt

Gestalten Sie Felder, Labels, Fehlermeldungen, die Auswahl «Teilnahme», die Checkbox und die Statusmeldung (Abschnitt «Formular»). Übertragen Sie Hover, Fokus und Fehlerzustand vollständig. Die Buttons folgen in Schritt 6.

**Stolperstein D, Teil 2: Fehlerzustand eines Feldes.** Im CSS färbt `.field:has(:user-invalid)` Label und Rahmen und blendet die Meldung ein. Der Rahmen gehört zum Feld selbst; Label und Meldung sind Geschwister des Feldes.

**Stolperstein G: Reihenfolge der Varianten.** Wenn die Tests grün sind: Senden Sie das Formular mit leeren Pflichtfeldern ab und fahren Sie mit der Maus über das rot umrandete Feld «Name». Machen Sie dasselbe unter `/css-referenz/`. Was unterscheidet sich, und warum bemerken die Tests es nicht?

<details>
<summary>Lösungshinweis</summary>

**Zu Stolperstein D, Teil 2:** Der Rahmen braucht keine Elternbeziehung: `user-invalid:border-danger` direkt am Feld. Für Label und Meldung:

- **a) `group` am Feld-Container, `group-has-[:user-invalid]:…` an Label und Meldung.** Entspricht dem CSS eins zu eins.
- **b) `peer` am Eingabefeld, `peer-user-invalid:block` an der Meldung.** Kürzer, funktioniert aber nur für Geschwister **nach** dem Eingabefeld. Das Label davor lässt sich so nicht färben.
- **c) Kleine eigene Regel** in `@layer components` von `tailwind.css`. Pragmatisch, aber das Styling ist auf zwei Orte verteilt.

**Zu Stolperstein G:** In der Tailwind-Fassung wird der Rahmen beim Überfahren grau (`hover:border-muted`), in der CSS-Fassung bleibt er rot. Im CSS haben `.field .field__input:hover` und `.field:has(:user-invalid) .field__input` dieselbe Spezifität; die spätere Regel (Fehlerzustand) gewinnt. In Tailwind haben `hover:border-muted` und `user-invalid:border-danger` ebenfalls dieselbe Spezifität, aber Tailwind ordnet `hover` nach `user-invalid` ein. Die Reihenfolge legt das Framework fest, nicht Ihr Stylesheet.

Die Tests bemerken es nicht, weil kein Test ein ungültiges Feld überfährt. Behebung: `user-invalid:hover:border-danger` ergänzen; die verkettete Variante ist spezifischer. Notieren Sie den Fall unter «Was die Tests nicht abdecken».

Ergebnis für ein Feld (die anderen sind gleich; die Bemerkung hat keine Fehlermeldung):

```html
<div class="group grid gap-1">
  <label class="font-semibold group-has-[:user-invalid]:text-danger" for="name">Name</label>
  <input
    class="w-full rounded-sm border border-border bg-white px-3 py-2 hover:border-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary user-invalid:border-danger user-invalid:hover:border-danger"
    id="name"
    name="name"
    required
    autocomplete="name"
  />
  <p class="hidden text-sm text-danger group-has-[:user-invalid]:block">
    Bitte geben Sie Ihren Namen an.
  </p>
</div>
```

Auswahl, Checkbox und Status:

```html
<fieldset class="flex flex-wrap gap-x-6 gap-y-2">
  <legend class="mb-1 font-semibold">Teilnahme</legend>
  <label class="flex cursor-pointer items-center gap-2 accent-primary">
    <input type="radio" name="attendance" value="Vor Ort" checked />
    Vor Ort
  </label>
  <!-- … «Online» gleich -->
</fieldset>

<label class="flex cursor-pointer items-center gap-2 accent-primary">
  <input type="checkbox" name="consent" />
  Ich akzeptiere die Teilnahmebedingungen.
</label>

<div class="flex flex-wrap items-center gap-4"><!-- Buttons, Schritt 6 --></div>

<p class="font-semibold text-primary empty:hidden" role="status"></p>
```

Preflight entfernt Rahmen und Innenabstand von `fieldset` und `legend`; `padding: 0` und `border: none` aus dem alten CSS entfallen. `accent-primary` am Label wird an Radio-Button und Checkbox vererbt. Weichen die Screenshots nur um wenige Pixel in der Höhe ab, prüfen Sie die Zeilenhöhe von `text-sm` (Stolperstein B).

</details>

### Schritt 6: Buttons umstellen (optional)

#### Optional: mit einem Coding Agent

> Stelle die Buttons «Anmelden», «Anmeldung drucken» und «Zurücksetzen» (Abschnitt «Buttons» in `src/styles.css`) mit allen Zuständen auf Utilities um: Hover, Fokus, deaktiviert. Lösche die zugehörigen Regeln. Der Hauptbutton kommt zweimal vor, die Eingabefelder aus dem Formular viermal. Nenne Möglichkeiten, mit der Wiederholung der Klassen umzugehen, mit Vor- und Nachteilen, und warte auf meine Entscheidung. Prüfe mit der Playwright CLI das Überfahren des deaktivierten und des aktiven Buttons «Anmelden» und führe `npm run e2e` aus. Aktualisiere keine Referenzbilder und ändere weder die Tests noch `src/app.ts`.

Kritisch prüfen:

- Verändert sich der deaktivierte Button beim Überfahren? Zeigt der Mauszeiger über den Buttons wie bisher eine Hand?
- Bei einer eigenen Utility: Heisst sie `button` und kollidiert damit mit der alten Klasse `.button`?
- Sind die Referenzbilder unverändert (`ls -l e2e/screenshots.spec.ts-snapshots/`)?

Den erwarteten Stand beschreibt der Lösungshinweis unten.

#### Schritt für Schritt

Gestalten Sie die Buttons «Anmelden», «Anmeldung drucken» und «Zurücksetzen» (Abschnitt «Buttons») mit allen Zuständen: Hover, Fokus, deaktiviert.

**Stolperstein H: Wiederholung.** Der Hauptbutton braucht rund ein Dutzend Utilities und kommt zweimal vor, die Eingabefelder aus Schritt 5 viermal. Wie gehen Sie mit der Wiederholung um?

<details>
<summary>Lösungshinweis</summary>

```html
<button
  class="cursor-pointer justify-self-start rounded-sm bg-primary px-4 py-2 font-semibold text-white enabled:hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
  type="submit"
  disabled
>
  Anmelden
</button>
<button
  class="cursor-pointer text-primary underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
  type="reset"
>
  Zurücksetzen
</button>
```

`enabled:hover:` ersetzt die Regel `.button:disabled:hover`. `cursor-pointer` ist nötig, weil Tailwind 4 Buttons beim Standard-Cursor belässt, das alte CSS aber `cursor: pointer` setzt.

- **a) Klassen wiederholen.** Empfiehlt Tailwind bei wenigen, nahe beieinander liegenden Stellen. Jede Änderung muss an allen Stellen nachgezogen werden.
- **b) Eigene Utility** in `src/tailwind.css`, getrennt nach Form und Farbe:

  ```css
  @utility btn {
    @apply cursor-pointer justify-self-start rounded-sm px-4 py-2 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50;
  }

  @utility btn-primary {
    @apply bg-primary text-white enabled:hover:bg-primary-hover;
  }
  ```

  Im Markup dann `class="btn btn-primary"`. Im Grunde wieder eine CSS-Klasse wie `.button`. Den Namen `button` nicht verwenden, solange das alte CSS mit `.button` eingebunden ist.

- **c) Komponente in einem UI-Framework** (React, Vue, Angular): Die Klassen stehen einmal in einer Button-Komponente. Hier ohne Framework nicht umsetzbar, in der Praxis der häufigste Weg.

</details>

### Schritt 7: Zusammenfassung umstellen (optional)

#### Optional: mit einem Coding Agent

> Stelle die Zusammenfassung (Abschnitt «Zusammenfassung» in `src/styles.css`) einschliesslich der Container Query auf Utilities um und lösche die zugehörigen Regeln. Begriff und Wert sollen wie bisher nebeneinander stehen, sobald die Zusammenfassung selbst mindestens `30rem` breit ist. Prüfe mit der Playwright CLI bei 784 px und bei 1280 px Breite und führe `npm run e2e` aus. Nenne bei Problemen Varianten mit Vor- und Nachteilen und warte auf meine Entscheidung. Aktualisiere keine Referenzbilder und ändere weder die Tests noch `src/app.ts`.

Kritisch prüfen:

- Reagiert die Regel auf die Breite der Zusammenfassung (`@container`) oder auf die des Fensters (`md:`, `wide:`)? Bei 784 px stehen Begriff und Wert nebeneinander, bei 1280 px untereinander.
- Verwendet der Agent genau `30rem` oder eine Container-Grösse wie `@md` (28rem) oder `@lg` (32rem)?
- Sind die Referenzbilder unverändert (`ls -l e2e/screenshots.spec.ts-snapshots/`)?

Den erwarteten Stand beschreibt der Lösungshinweis unten.

#### Schritt für Schritt

Gestalten Sie die Zusammenfassung (Abschnitt «Zusammenfassung») einschliesslich der Container Query. Mit Variante a aus Schritt 1 tragen Überschrift und Liste bereits `font-bold` beziehungsweise `list-disc pl-10`.

Die Container Query reagiert ab `30rem`. Die Container-Grössen von Tailwind heissen wie die Breakpoints, haben aber andere Werte: `@md` liegt bei `28rem`, `@lg` bei `32rem` (wieder Stolperstein E).

<details>
<summary>Lösungshinweis</summary>

```html
<aside class="@container grid gap-4 rounded-md bg-surface p-6" aria-labelledby="summary-title">
  <h2 class="text-lg leading-tight font-bold" id="summary-title">Ihre Anmeldung</h2>
  <dl class="grid gap-3">
    <div class="grid gap-1 @min-[30rem]:grid-cols-[8rem_1fr] @min-[30rem]:items-baseline">
      <dt class="text-sm text-muted">Name</dt>
      <dd class="wrap-anywhere" data-summary="name">–</dd>
    </div>
    <!-- … E-Mail, Kurs, Teilnahme gleich -->
  </dl>
  <p class="font-semibold">Im Kurs enthalten:</p>
  <ul class="-mt-2 list-disc pl-10">
    …
  </ul>
  <button class="… wie «Anmelden» …" type="button" data-action="print">Anmeldung drucken</button>
</aside>
```

- **a) Willkürlich:** `@min-[30rem]:` (wie oben).
- **b) Token:** `--container-summary: 30rem;` im `@theme`-Block, danach `@summary:grid-cols-[8rem_1fr]`. Achtung: `--container-*` erzeugt zugleich Breiten wie `max-w-summary`.

`@container` entspricht `container-type: inline-size`. Prüfen Sie: Im Viewport `grenzfall` stehen Begriff und Wert nebeneinander, auf dem Desktop untereinander.

</details>

### Schritt 8: Abschliessen

#### Optional: mit einem Coding Agent

> Übertrage das restliche CSS aus `src/styles.css` in Tailwind und lösche danach `src/styles.css` und den Import in `src/main.ts`. Ist Preflight noch nicht eingebunden, binde ihn jetzt ein. Ergänze in `e2e/anmeldung.spec.ts` funktionale Tests mit nutzernahen Locators (`getByRole`, `getByLabel`, `getByText`) und ohne feste Wartezeiten: Mobil ist die Navigation zunächst verborgen und nach Klick auf «Menü» sichtbar. Auf dem Desktop ist sie ohne Klick sichtbar und der Menü-Button verborgen. Ab `50rem` steht die Zusammenfassung neben dem Formular, schmaler darunter. Nach dem Absenden mit leeren Pflichtfeldern sind die Fehlermeldungen sichtbar, nach korrektem Ausfüllen erscheint die Bestätigung. Ändere `e2e/screenshots.spec.ts` nicht. Prüfe das Layout mit der Playwright CLI bei 500, 800 und 1000 px Breite und mit sehr langen Eingaben und berichte, was die Tests nicht abdecken. Führe `npm run check` und `npm run e2e` aus.

Kritisch prüfen:

- Sind `src/styles.css` und der Import entfernt, und bestehen die Screenshot-Tests ohne neue Referenzbilder?
- Verwenden die neuen Tests nur Rollen, Labels und Texte, keine Klassen? Laufen Tests für eine bestimmte Breite nur im passenden Viewport?
- Prüfen die Tests etwas? Entfernen Sie probehalber den Breakpoint am Raster aus Formular und Zusammenfassung: Der Test zur Zusammenfassung muss auf dem Desktop scheitern.
- Stimmt die Liste des Agenten, was die Tests nicht abdecken, mit Ihren eigenen Beobachtungen überein? Übernehmen Sie das Ergebnis in `NOTIZEN.md`.

Den erwarteten Stand beschreibt der Lösungshinweis unten.

#### Schritt für Schritt

1. Entfernen Sie das restliche alte CSS. Übrig sind die Abstands-Tokens und die Grundregel für `body`. Preflight setzt Schrift und Zeilenhöhe am `html`; die Schrift kommt aus `--font-sans`. Für Text- und Hintergrundfarbe setzen Sie `class="bg-white text-text"` am `body`. Danach `src/styles.css` und den Import in `src/main.ts` löschen. Mit Variante b aus Schritt 1 binden Sie jetzt Preflight ein.
2. Ergänzen Sie in `e2e/anmeldung.spec.ts` funktionale Tests:
   - Mobil: Die Navigation ist zunächst verborgen und nach Klick auf «Menü» sichtbar.
   - Desktop: Die Navigation ist ohne Klick sichtbar, der Menü-Button ist verborgen.
   - Ab `50rem` steht die Zusammenfassung neben dem Formular, schmaler darunter (über `boundingBox()`).
   - Nach dem Absenden mit leeren Pflichtfeldern sind die Fehlermeldungen sichtbar. Nach korrektem Ausfüllen erscheint die Bestätigung.
3. Führen Sie `npm run check` und `npm run e2e` aus. Meldet `check` nur Formatierungsabweichungen, korrigiert `npx vp check --fix` sie.
4. Prüfen Sie das Layout in den Entwicklerwerkzeugen bei Breiten **zwischen** den Test-Viewports (etwa 500, 800 und 1000 px) und mit sehr langen Eingaben. Nutzen Sie die Grid- und Flex-Overlays im Register **Elements**. Notieren Sie, was die Tests nicht abdecken.

<details>
<summary>Lösungshinweis</summary>

`src/main.ts`:

```ts
import "./tailwind.css";
import { setupApp } from "./app.ts";

setupApp(document);
```

Tests (alle laufen in allen drei Viewports; Tests für eine bestimmte Breite überspringen die anderen):

```ts
test("blendet die Navigation mobil über den Menü-Button ein", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobil", "Nur auf schmalen Bildschirmen");
  await page.goto("/");
  const navigation = page.getByRole("navigation", { name: "Hauptnavigation" });

  await expect(navigation).toBeHidden();
  await page.getByRole("button", { name: "Menü" }).click();
  await expect(navigation.getByRole("link", { name: "Kurse" })).toBeVisible();
});

test("zeigt die Navigation auf dem Desktop ohne Menü-Button", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Nur auf breiten Bildschirmen");
  await page.goto("/");

  await expect(page.getByRole("button", { name: "Menü" })).toBeHidden();
  await expect(page.getByRole("link", { name: "Kurse" })).toBeVisible();
});

test("stellt die Zusammenfassung ab 50rem neben das Formular", async ({ page }, testInfo) => {
  await page.goto("/");
  const form = await page.locator("form").boundingBox();
  const summary = await page.getByRole("complementary", { name: "Ihre Anmeldung" }).boundingBox();
  if (!form || !summary) throw new Error("Formular oder Zusammenfassung nicht sichtbar");

  if (testInfo.project.name === "desktop") {
    expect(summary.x).toBeGreaterThanOrEqual(form.x + form.width);
    expect(summary.y).toBeLessThan(form.y + form.height);
  } else {
    expect(summary.y).toBeGreaterThanOrEqual(form.y + form.height);
  }
});

test("zeigt nach dem Absenden die Fehler aller ungültigen Felder", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Ich akzeptiere").check();
  await page.getByRole("button", { name: "Anmelden" }).click();

  await expect(page.getByText("Bitte geben Sie Ihren Namen an.")).toBeVisible();
  await expect(page.getByText("Bitte wählen Sie einen Kurs.")).toBeVisible();
  await expect(page.getByRole("status")).toBeHidden();

  await page.getByLabel("Name").fill("Ada Lovelace");
  await page.getByLabel("E-Mail").fill("ada@example.ch");
  await page.getByLabel("Kurs").selectOption("Testing im Frontend");
  await page.getByRole("button", { name: "Anmelden" }).click();

  await expect(page.getByText("Bitte geben Sie Ihren Namen an.")).toBeHidden();
  await expect(page.getByRole("status")).toHaveText("Danke, Ihre Anmeldung ist eingegangen.");
});
```

Diese Tests prüfen Verhalten und Sichtbarkeit und bestehen mit beiden Fassungen. Die Screenshots prüfen das Aussehen, aber nur in drei Breiten und vier Zuständen. Nicht abgedeckt sind zum Beispiel:

- Breiten zwischen den Viewports, etwa 500 oder 1000 px.
- Hover über einem ungültigen Feld (Stolperstein G), Hover über Navigation und Links, Tastaturfokus auf Buttons und Links.
- Lange Namen oder E-Mail-Adressen, die umbrechen müssen (`wrap-anywhere`).
- Die Bestätigung nach erfolgreichem Absenden im Screenshot und die Druckansicht.

</details>

---

## Teil 2: Änderungsauftrag in beiden Fassungen

Setzen Sie die Änderungen in der CSS-Referenz (`css-referenz/styles.css` und `css-referenz/index.html`) **und** in Ihrer Tailwind-Fassung um:

1. Primärfarbe `#0f766e`, Hover-Farbe `#115e59`.
2. Grundabstand `0.3rem` statt `0.25rem`.
3. Neben «Anmelden» ein sekundärer Button «Entwurf speichern»: weisser Hintergrund, Schrift und 1 px Rahmen in der Primärfarbe, beim Überfahren Hintergrund `surface`. Gleich gross wie «Anmelden», immer aktiv.

Notieren Sie für jede Fassung: Wie viele Stellen mussten Sie ändern? Wo ist der neue Code entstanden?

Führen Sie diesen Teil selbst durch, auch wenn Sie Teil 1 mit einem Agenten bearbeitet haben. Ihr Aufwand in beiden Fassungen ist die Grundlage für den Vergleich in Teil 3.

Die Screenshot-Tests schlagen jetzt erwartungsgemäss fehl. Sehen Sie sich die Abweichungen an und erzeugen Sie die Referenzbilder erst danach bewusst neu (`npm run e2e -- --update-snapshots`).

Vergleichen Sie beide Fassungen bei 1280 px nebeneinander (`/` und `/css-referenz/`). Sind sie noch gleich?

<details>
<summary>Lösungshinweis</summary>

**Farbe und Grundabstand:** In beiden Fassungen je eine Stelle pro Token. CSS: `--color-primary`, `--color-primary-hover` und `--space-unit` in `:root`. Tailwind: dieselben Farben und `--spacing` im `@theme`-Block.

**Sekundärer Button, CSS:** eine Modifier-Klasse im Stylesheet und eine Klasse mehr im Markup.

```css
.button--secondary {
  background: var(--color-white);
  color: var(--color-primary);
  box-shadow: inset 0 0 0 1px var(--color-primary);

  &:hover {
    background: var(--color-surface);
  }
}
```

```html
<button class="button button--secondary" type="button">Entwurf speichern</button>
```

Der Rahmen ist als `box-shadow` umgesetzt, damit der Button nicht 2 px grösser wird als «Anmelden».

**Sekundärer Button, Tailwind mit wiederholten Klassen:** Klassenliste des Hauptbuttons kopieren und die Farben austauschen:

```html
<button
  class="cursor-pointer justify-self-start rounded-sm bg-white px-4 py-2 font-semibold text-primary inset-ring inset-ring-primary enabled:hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
  type="button"
>
  Entwurf speichern
</button>
```

`inset-ring` entspricht dem `box-shadow` mit `inset`. Mit Variante b aus Schritt 6 genügen `@utility btn-secondary { @apply bg-white text-primary inset-ring inset-ring-primary enabled:hover:bg-surface; }` und `class="btn btn-secondary"`.

**Unterschied nach der Änderung:** Beide Fassungen sind gleich, bis auf den Einzug der Liste «Im Kurs enthalten». In Tailwind ist `pl-10` ein Vielfaches des Grundabstands und wächst auf 3rem. Im CSS stammen die 40 px vom Browser und bleiben gleich. Ähnlich wäre es mit `w-87.5` statt `350px` (Stolperstein F). In Tailwind hängt fast jede Länge am Grundabstand, im CSS nur das, was ausdrücklich mit `--space-*` geschrieben ist. Was richtig ist, entscheidet das Design.

</details>

---

## Teil 3: Vergleich

Füllen Sie die Vergleichstabelle in [NOTIZEN.md](./NOTIZEN.md) aus und belegen Sie jeden Punkt mit einem Beispiel aus Ihrem Code:

- **Lesbarkeit:** Wie gut versteht man Markup und Styling einer Komponente beim ersten Lesen?
- **Änderung der Designvorgabe:** Ihre Erfahrung aus Teil 2.
- **Neue Variante einer Komponente:** Wo entstand der sekundäre Button, was wurde wiederholt?
- **Konsistenz:** Wo hätten sich Werte ausserhalb der Tokens eingeschlichen (B, E, F)?
- **Gültigkeitsbereich und Kaskade:** Erfahrung aus C. Wie gross ist das Risiko, dass eine Änderung ungewollt andere Stellen trifft?
- **Zustände und Selektoren:** Erfahrung aus D und G.
- **Werkzeuge:** Diagnose in den Entwicklerwerkzeugen, Unterstützung im Editor, Umfang des ausgelieferten CSS. Vergleichen Sie nach `npm run build` die Dateigrössen in `dist/assets/`. Tailwind erzeugt CSS für jeden Klassennamen in den Projektdateien, auch für die in `README.md` und `NOTIZEN.md` erwähnten. Ergänzen Sie für einen fairen Vergleich vorher `@source not "../*.md";` nach dem Import in `src/tailwind.css`.

Fazit: Für welches Projekt passt welcher Ansatz (Design System, Fachanwendung mit Komponentenbibliothek, kleine Inhaltsseite)? Lohnt sich die Umstellung eines bestehenden Projekts, und wenn ja: schrittweise oder auf einmal?

## Checkliste

- [ ] Screenshot-Tests in allen drei Viewports grün; Referenzbilder nur bewusst und begründet aktualisiert.
- [ ] Keine Farben ausserhalb der Tokens; willkürliche Werte nur begründet und notiert.
- [ ] Für jeden bearbeiteten Stolperstein Variante und Begründung in `NOTIZEN.md`.
- [ ] Ergänzte funktionale Tests grün, mit nutzernahen Locators (`getByRole`, `getByLabel`, `getByText`).
- [ ] Sie können benennen, was Screenshots und Tests nicht abdecken, und wie Sie es geprüft haben.
- [ ] Änderungsauftrag in beiden Fassungen umgesetzt; Vergleichstabelle mit Beispielen belegt.
- [ ] `npm run check` und `npm run e2e` laufen ohne Fehler.

## Kontrollfragen

1. Warum gewinnt CSS ausserhalb von Layern gegen jede Utility? Fehler von Tailwind oder Eigenschaft von CSS?
2. Was hat das Sicherheitsnetz aus Screenshots gefunden, was hat es übersehen?
3. Ist `w-87.5` ein Token?
4. Wann lohnt sich eine eigene Utility wie `btn`, wann eine Komponente, wann die Wiederholung?
5. Welche Stolpersteine wären bei einem Neubau mit Tailwind gar nicht erst entstanden?

<details>
<summary>Antworten zu den Kontrollfragen</summary>

1. Eine Eigenschaft von CSS: CSS ohne Layer gewinnt gegen alle Layer, unabhängig von der Spezifität. Tailwind legt sein CSS bewusst in Layer, damit eigenes CSS es gezielt überschreiben kann. Bei einer Umstellung kehrt sich das um. `@layer` ist deshalb auch ohne Tailwind ein Werkzeug für Migrationen.
2. Gefunden: Preflight (A), Zeilenhöhen (B), Breakpoint (E) und jede Verschiebung um wenige Pixel. Übersehen: alles ausserhalb der getesteten Breiten und Zustände, etwa den Hover über einem ungültigen Feld (G). Screenshot-Tests sind stark bei Refactorings ohne sichtbare Änderung; bei gewollten Änderungen kosten sie Pflege und hängen vom Betriebssystem ab.
3. Nein. Es ist ein Vielfaches des Grundabstands, das zufällig 350 px ergibt. Tailwind 4 akzeptiert jedes Vielfache von 0.25; die Skala ist bequem, aber nicht begrenzt. Konsistenz entsteht nur durch Vereinbarung oder Werkzeuge.
4. Wiederholung, solange die Stellen nahe beieinander liegen und gemeinsam geändert werden. Bei vielen Verwendungsorten eine Komponente des Frameworks. `@utility` mit `@apply` liegt dazwischen und führt zurück zu benannten Klassen; Tailwind empfiehlt es nur sparsam.
5. A und C entstehen nur, weil altes CSS und Tailwind nebeneinander bestehen. B entsteht, weil bestehende Tokens auf die Annahmen von Tailwind treffen. D, E, F, G und H gibt es auch bei einem Neubau; sie sind die eigentlichen Unterschiede zwischen den Ansätzen.

</details>

## Vertiefung

1. **Dunkles Farbschema:** In beiden Fassungen über die Tokens ergänzen. CSS: `color-scheme: light dark` und `light-dark()` in `:root`. Tailwind: dieselben Werte im `@theme`-Block, etwa `--color-surface: light-dark(#f4f6f8, #1f2933);`, dazu `color-scheme: light dark` (Utility `scheme-light-dark` am `html` oder eine Regel für `:root` in `@layer base`), oder die Variante `dark:`. In Playwright mit `test.use({ colorScheme: "dark" })` und eigenen Referenzbildern prüfen. Welcher Weg braucht weniger Änderungen im Markup?
2. **Zweite Variante ausprobieren:** Für einen Stolperstein eine andere Variante umsetzen und Markup, CSS und Lesbarkeit vergleichen.
3. **Schrittweise mit Layer:** Die Umstellung von vorne beginnen, diesmal mit Variante b aus Stolperstein C (altes CSS im Layer `legacy`). Was ändert sich am Vorgehen?

Optional mit einem Coding Agent: Für Vertiefung 2 und 3 eignet sich ein Agent besonders, weil er eine andere Variante oder einen zweiten Durchgang schnell umsetzt und Sie sich auf den Vergleich konzentrieren. Arbeiten Sie dafür in einem eigenen Git-Branch und verwenden Sie dieselben Regeln wie in den Aufträgen aus Teil 1: keine neuen Referenzbilder, keine Änderungen an Tests und `src/app.ts`.
