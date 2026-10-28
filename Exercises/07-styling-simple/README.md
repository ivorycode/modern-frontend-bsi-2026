# Übung 7: ProfileCard – eine React-Komponente mit CSS Modules und Tailwind gestalten

Eine kleine Demo-App mit React zeigt dieselbe Komponente `PricingCard` in vier Styling-Ansätzen: CSS Modules, styled-components, vanilla-extract und Tailwind CSS 4. Alle vier verwenden dieselben Design Tokens aus `src/index.css`. Darunter steht eine Komponente `ProfileCard` noch ganz ohne Styling. Sie gestalten sie zuerst mit CSS Modules und danach ein zweites Mal mit Tailwind. Anschliessend vergleichen Sie beide Fassungen. Playwright-Tests prüfen, ob die Karte die Tokens verwendet und im dunklen Farbschema umfärbt.

Jeder Schritt enthält einen ausklappbaren Lösungshinweis. Versuchen Sie es zuerst selbst. Führen Sie alle Befehle in diesem Ordner aus. Vorkenntnisse in Tailwind sind nicht nötig.

**Optional mit einem Coding Agent:** Die Schritte 2 und 3 beginnen mit einem Auftrag für einen Coding Agent mit Terminalzugriff (z. B. Claude Code, Codex, GitHub Copilot, Cursor). Die Anleitung «Schritt für Schritt» danach beschreibt, wie Sie den Schritt manuell lösen; zusammen mit den Lösungshinweisen dient sie auch dazu, das Ergebnis des Agenten zu prüfen. Schritt 1 und den Vergleich in Schritt 4 bearbeiten Sie in jedem Fall selbst, denn der Vergleich beruht auf Ihrer eigenen Erfahrung mit beiden Fassungen. Hinweise für Agenten stehen in [AGENTS.md](./AGENTS.md). Die laufende Seite untersucht der Agent wie in den bisherigen Übungen mit der Playwright CLI (`npx playwright cli open --browser=chrome http://localhost:5177/`); dafür muss der Entwicklungsserver laufen.

## Schritt 1: Demo starten und die vier Ansätze vergleichen

```sh
npm ci
npm run dev
```

Öffnen Sie `http://localhost:5177/` in Chrome. Die vier Karten oben sehen gleich aus, sind aber unterschiedlich umgesetzt (`src/variants/`). Unten steht die `ProfileCard` als ungestylter Text.

**a) Farbschema umschalten.** Klicken Sie auf «Dark Mode». Was ändert sich an der Seite? Lesen Sie `toggleTheme` in `src/App.tsx` und die Tokens in `src/index.css`. Wie viel Code für das dunkle Farbschema steckt in den vier Karten?

**b) In den Entwicklerwerkzeugen vergleichen.** Untersuchen Sie im Register **Elements** das `<article>` jeder Karte. Wie sehen die Klassennamen aus? Woher kommt das CSS? Schauen Sie dazu auch in den `<head>` der Seite.

**c) Tests ausführen.** Führen Sie in einem zweiten Terminal `npm run e2e` aus. Notieren Sie, welche Tests scheitern und warum.

<details>
<summary>Lösungshinweis</summary>

**Farbschema:** Der Schalter setzt nur das Attribut `data-theme="dark"` am `<html>`-Element. In `src/index.css` definiert `[data-theme="dark"]` dieselben Custom Properties (`--surface`, `--ink`, `--accent`, …) mit dunklen Werten neu. Die Karten referenzieren nur diese Tokens und enthalten keine Zeile Dark-Mode-CSS. Custom Properties werden vererbt und erst im Browser aufgelöst, deshalb funktionieren sie mit jedem der vier Ansätze.

**Klassennamen und Herkunft des CSS:**

| Ansatz            | Klassen am `<article>`                           | Herkunft des CSS                                                                        |
| ----------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| CSS Modules       | `_card_g54be_11 _highlighted_g54be_22`           | Normale CSS-Datei; Vite hängt beim Build einen Hash an jeden Klassennamen               |
| styled-components | `sc-bdnzMm ZACjr`                                | Wird **zur Laufzeit** im Browser erzeugt und in ein `<style data-styled>` geschrieben   |
| vanilla-extract   | `pricingCard_card_highlighted__9okrkv2 …`        | In TypeScript geschrieben (`.css.ts`), beim Build als statische CSS-Datei ausgegeben    |
| Tailwind          | `grid gap-4 rounded-2xl border bg-surface p-6 …` | Utilities direkt im Markup; Tailwind erzeugt CSS für alle Klassen in den Projektdateien |

Die Hashes sehen bei Ihnen anders aus. CSS Modules lösen das Problem globaler Klassennamen mit Werkzeugen: Zwei Dateien dürfen beide eine Klasse `.card` definieren, ohne dass sie kollidieren. styled-components ist seit 2025 im Maintenance Mode. Für neue Projekte ist es nicht mehr empfohlen; man trifft es aber in vielen bestehenden Projekten an. vanilla-extract bietet Ähnliches ohne Laufzeitkosten.

**Tests:** Alle vier Tests scheitern. Die Tests zu Aufgabe 1 finden die Karte, aber ihr Hintergrund ist durchsichtig (`rgba(0, 0, 0, 0)`) statt `--surface`. Die Tests zu Aufgabe 2 finden den Abschnitt «Übung · ProfileCard (Tailwind)» nicht, den legen Sie in Schritt 3 an.

</details>

## Schritt 2: Die ProfileCard mit CSS Modules gestalten (Aufgabe 1)

### Optional: mit einem Coding Agent

> Gestalte die Komponente `src/exercise/ProfileCard.tsx` mit CSS Modules in einer neuen Datei `src/exercise/ProfileCard.module.css`. Layout: ein Grid mit zwei Spalten, links ein runder Avatar mit den Initialen über zwei Zeilen, rechts Name und Rolle; Skills als Pills und der Button «Folgen» über die volle Breite; der Status-Punkt sitzt oben rechts in der Ecke, grün wenn `online`, sonst grau (bedingte Klasse). Verwende für Farben, Radius und Schatten ausschliesslich die Design Tokens aus `src/index.css`, auch für den Status-Punkt, und schreibe kein CSS für das dunkle Farbschema. Ändere `src/index.css`, die Tests und die Attribute `role` und `aria-label` des Status-Punkts nicht. Prüfe mit der Playwright CLI beide Farbschemas und den Zustand offline (`online: false` in `demoProfile`, danach zurücksetzen). Führe `npm run check` und `npm run e2e` aus; die Tests zu Aufgabe 2 dürfen noch fehlschlagen.

Kritisch prüfen:

- Steht in `ProfileCard.module.css` irgendwo ein Farbwert wie `white`, `#fff` oder `rgb(…)`? Gibt es Regeln für `[data-theme="dark"]`?
- Wird die Klasse für den Status-Punkt abhängig von `profile.online` zusammengesetzt, oder ist der Punkt immer grün?
- Sieht die Karte im Browser aus wie beschrieben? Die Tests prüfen nur Farben, nicht das Layout.
- Sind `src/index.css`, `e2e/` und `demoProfile` unverändert (`git diff src/index.css e2e/ src/exercise/ProfileCard.tsx`)?

Den erwarteten Stand beschreibt der Lösungshinweis unten.

### Schritt für Schritt

Anforderungen:

- Für Farben, Radius und Schatten **ausschliesslich die Design Tokens** verwenden (`var(--surface)`, `var(--ink)`, `var(--ink-muted)`, `var(--accent)`, `var(--accent-contrast)`, `var(--edge)`, `var(--radius-card)`, `var(--shadow-card)`, `var(--status-online)`, `var(--status-offline)`), keine fest eingetragenen Farbwerte.
- Der Status-Punkt ist grün, wenn `online`, sonst grau (bedingte Klasse).
- Der Button «Folgen» verwendet `--accent` und `--accent-contrast`.

Die `PricingCard` in `src/variants/css-modules/` zeigt den Ansatz an einer einfacheren Karte, einschliesslich einer bedingten Klasse (`highlighted`). Nutzen Sie sie als Vorlage.

Vorgehen:

1. **Datei anlegen und einbinden.** Legen Sie neben `ProfileCard.tsx` die Datei `ProfileCard.module.css` an und importieren Sie sie mit `import styles from "./ProfileCard.module.css";`. Die Endung `.module.css` sorgt dafür, dass Vite die Klassennamen mit einem Hash versieht. Klassen weisen Sie über das importierte Objekt zu: `<article className={styles.card}>`.
2. **Grundgerüst.** Die Karte ist ein Grid mit zwei Spalten (`grid-template-columns: auto 1fr`): links der Avatar über zwei Zeilen, rechts Name und Rolle. Hintergrund, Text, Rahmen, Radius und Schatten kommen aus den Tokens.
3. **Avatar, Name, Rolle.** Der Avatar ist ein Kreis von 56 px mit den Initialen in der Mitte (`display: grid; place-items: center`) und spannt über zwei Zeilen (`grid-row: span 2`). Achten Sie auf die Abstände von `h3` und `p`.
4. **Status-Punkt.** Ein Punkt von 10 px, absolut positioniert in der oberen rechten Ecke der Karte. Grau ist der Standard, eine zusätzliche Klasse `.online` macht ihn grün. Setzen Sie die Klassen im JSX abhängig von `profile.online` zusammen.
5. **Skills und Button.** Beide spannen über die volle Breite (`grid-column: 1 / -1`). Die Liste braucht einen Reset (`list-style`, `margin`, `padding`); die Einträge werden zu Pills mit Rahmen und `border-radius: 999px`.

Prüfen Sie:

- Klicken Sie auf «Dark Mode». Hintergrund, Text, Rahmen, Pills und Button müssen **vollständig** umfärben, ohne dass Sie eine Zeile CSS für das dunkle Farbschema schreiben. Bleibt etwas hell, ist dort eine Farbe fest eingetragen.
- Setzen Sie `online: false` in `demoProfile`. Der Punkt wird grau. Setzen Sie den Wert danach zurück.
- `npm run check` und `npm run e2e`: Die Tests zu Aufgabe 1 bestehen.

<details>
<summary>Lösungshinweis</summary>

`ProfileCard.module.css`:

```css
.card {
  background: var(--surface);
  color: var(--ink);
  border: 1px solid var(--edge);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: 1.5rem;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.35rem 1rem;
  align-items: center;
  position: relative; /* Anker für den Status-Punkt */
}

.avatar {
  grid-row: span 2;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--accent);
  color: var(--accent-contrast);
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 1.1rem;
}

.status {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--status-offline);
}

.status.online {
  background: var(--status-online);
}

.name {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
}

.role {
  margin: 0;
  font-size: 0.85rem;
  color: var(--ink-muted);
}

.skills {
  grid-column: 1 / -1;
  list-style: none;
  margin: 0.5rem 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.skills li {
  font-size: 0.75rem;
  border: 1px solid var(--edge);
  border-radius: 999px;
  padding: 0.2rem 0.6rem;
  color: var(--ink-muted);
}

.follow {
  grid-column: 1 / -1;
  margin-top: 0.75rem;
  border: none;
  border-radius: 8px;
  background: var(--accent);
  color: var(--accent-contrast);
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.6rem 1rem;
  cursor: pointer;
}
```

`ProfileCard.tsx`:

```tsx
import styles from "./ProfileCard.module.css";
// …

export function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <article className={styles.card}>
      <div className={styles.avatar}>{initials(profile.name)}</div>
      <span
        className={profile.online ? `${styles.status} ${styles.online}` : styles.status}
        role="img"
        aria-label={profile.online ? "online" : "offline"}
      />
      <h3 className={styles.name}>{profile.name}</h3>
      <p className={styles.role}>{profile.role}</p>
      <ul className={styles.skills}>
        {profile.skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
      <button className={styles.follow}>Folgen</button>
    </article>
  );
}
```

- **Typischer Fehler:** `background: white` statt `var(--surface)`. Im hellen Farbschema sieht das gleich aus; erst der Test für das dunkle Farbschema scheitert.
- **`margin: 0`:** `h3` und `p` haben Abstände aus dem Browser-Standard, die das Grid auseinanderdrücken.
- **`font-weight: 600`:** Das Projekt bindet Tailwind ein, und dessen Reset **Preflight** gilt für die ganze Seite. Er setzt unter anderem die Schriftstärke von Überschriften zurück. Ohne diese Zeile ist der Name nicht fett. Dieselbe Ursache sehen Sie bei «Pro» in den Karten mit CSS Modules, styled-components und vanilla-extract.
- **Bedingte Klassen:** Bei mehreren Bedingungen wird das Zusammensetzen von Strings unübersichtlich. Viele Projekte verwenden dafür die kleine Bibliothek `clsx`: `clsx(styles.status, profile.online && styles.online)`.
- **Status-Tokens:** Auch für den Status gibt es Tokens (`--status-online`, `--status-offline`). Auf diese Weise kann das dunkle Farbschema auch diese Farben anpassen.

</details>

## Schritt 3: Eine zweite Fassung mit Tailwind (Aufgabe 2)

### Optional: mit einem Coding Agent

> Lege `src/exercise/ProfileCardTailwind.tsx` an: dieselbe Karte wie `ProfileCard` mit Komponente `ProfileCardTailwind`, aber nur mit Tailwind-Utilities, ohne CSS-Datei. Importiere `Profile` und `initials` aus `./ProfileCard.tsx` statt sie zu kopieren, und übernimm `role` und `aria-label` des Status-Punkts. Verwende für alle Farben die Token-Utilities aus dem `@theme`-Block in `src/index.css` (`bg-surface`, `text-ink`, `border-edge`, `bg-status-online`, …), keine Farben aus Tailwinds Standardpalette. Ergänze in `src/App.tsx` nach dem Abschnitt für CSS Modules einen gleich aufgebauten Abschnitt mit der Überschrift «Übung · ProfileCard (Tailwind)» und `aria-labelledby="uebung-tailwind"`. Vergleiche mit der Playwright CLI beide Karten nebeneinander in beiden Farbschemas und nenne sichtbare Unterschiede. Führe `npm run check` und `npm run e2e` aus.

Kritisch prüfen:

- Verwendet die Karte Farben aus der Standardpalette wie `bg-white`, `bg-emerald-500` oder `text-gray-500`? Die Tests prüfen das nur für einige Elemente.
- Wird die Klasse des Status-Punkts zusammengesetzt (`` `bg-status-${…}` ``)? Warum funktioniert das mit Tailwind nicht (siehe Lösungshinweis)?
- Sehen beide Karten gleich aus? Vergleichen Sie selbst im Browser, auch im dunklen Farbschema.
- Wurden `Profile` und `initials` importiert statt kopiert? Ist `e2e/` unverändert (`git diff e2e/`)?

Den erwarteten Stand beschreibt der Lösungshinweis unten.

### Schritt für Schritt

Die `PricingCard` in `src/variants/tailwind/` zeigt den Ansatz an einer einfacheren Karte. Nutzen Sie sie als Vorlage. Ihr Layout ist aber ein einfacher Stapel; für die `ProfileCard` brauchen Sie zusätzliche Utilities.

1. Legen Sie `src/exercise/ProfileCardTailwind.tsx` an. Kopieren Sie das JSX aus `ProfileCard.tsx` in eine neue Komponente `ProfileCardTailwind`. Importieren Sie `Profile` und `initials` aus `./ProfileCard.tsx`, statt sie zu kopieren.
2. Binden Sie die Karte in `src/App.tsx` nach dem Abschnitt für CSS Modules ein, damit Sie beide nebeneinander sehen. Die Tests finden die Karte über die Überschrift des Abschnitts:

   ```tsx
   <section aria-labelledby="uebung-tailwind">
     <h2 id="uebung-tailwind">Übung · ProfileCard (Tailwind)</h2>
     <ProfileCardTailwind profile={demoProfile} />
   </section>
   ```

3. Gestalten Sie die Karte nur mit Utilities im Attribut `className`. Übersetzen Sie dazu Ihre Regeln aus Schritt 2. Die Tokens stehen als Utilities zur Verfügung, weil der `@theme`-Block in `src/index.css` sie als Farben registriert: `bg-surface`, `text-ink`, `text-ink-muted`, `bg-accent`, `text-accent-contrast`, `border-edge`, `bg-status-online`, `bg-status-offline`. Utilities für Layout und Abstände finden Sie in der [Dokumentation von Tailwind](https://tailwindcss.com/docs), zum Beispiel unter «grid-template-columns» oder «grid-row».
4. Setzen Sie die Klasse des Status-Punkts abhängig von `profile.online`.

Prüfen Sie beide Karten nebeneinander in beiden Farbschemas. Führen Sie `npm run check` und `npm run e2e` aus. Alle Tests bestehen.

<details>
<summary>Lösungshinweis</summary>

Übersetzung der wichtigsten Regeln:

| CSS aus Schritt 2                                  | Tailwind-Utility              |
| -------------------------------------------------- | ----------------------------- |
| `background: var(--surface)`                       | `bg-surface`                  |
| `color: var(--ink)` / `var(--ink-muted)`           | `text-ink` / `text-ink-muted` |
| `border: 1px solid var(--edge)`                    | `border border-edge`          |
| `border-radius: var(--radius-card)`                | `rounded-(--radius-card)`     |
| `box-shadow: var(--shadow-card)`                   | `shadow-(--shadow-card)`      |
| `display: grid; grid-template-columns: auto 1fr`   | `grid grid-cols-[auto_1fr]`   |
| `grid-row: span 2`                                 | `row-span-2`                  |
| `grid-column: 1 / -1`                              | `col-span-full`               |
| `width: 56px; height: 56px; border-radius: 50%`    | `size-14 rounded-full`        |
| `display: grid; place-items: center`               | `grid place-items-center`     |
| `position: absolute; top: 1.25rem; right: 1.25rem` | `absolute top-5 right-5`      |

`ProfileCardTailwind.tsx`:

```tsx
import { initials, type Profile } from "./ProfileCard.tsx";

export function ProfileCardTailwind({ profile }: { profile: Profile }) {
  return (
    <article className="relative grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1.5 rounded-(--radius-card) border border-edge bg-surface p-6 text-ink shadow-(--shadow-card)">
      <div className="row-span-2 grid size-14 place-items-center rounded-full bg-accent text-lg font-bold text-accent-contrast">
        {initials(profile.name)}
      </div>
      <span
        className={`absolute top-5 right-5 size-2.5 rounded-full ${
          profile.online ? "bg-status-online" : "bg-status-offline"
        }`}
        role="img"
        aria-label={profile.online ? "online" : "offline"}
      />
      <h3 className="m-0 text-base font-semibold">{profile.name}</h3>
      <p className="m-0 text-sm text-ink-muted">{profile.role}</p>
      <ul className="col-span-full mt-2 flex list-none flex-wrap gap-1.5 p-0">
        {profile.skills.map((skill) => (
          <li
            key={skill}
            className="rounded-full border border-edge px-2.5 py-1 text-xs text-ink-muted"
          >
            {skill}
          </li>
        ))}
      </ul>
      <button className="col-span-full mt-3 cursor-pointer rounded-lg border-none bg-accent px-4 py-2.5 text-sm font-semibold text-accent-contrast">
        Folgen
      </button>
    </article>
  );
}
```

- **Neu gegenüber der `PricingCard`:** Spannen im Grid (`grid-cols-[auto_1fr]`, `row-span-2`, `col-span-full`), Positionierung (`relative` an der Karte, `absolute top-5 right-5` am Punkt), ein Kreis mit zentriertem Inhalt (`size-14 rounded-full grid place-items-center`), umbrechende Pills (`flex flex-wrap`) und die Kurzform `(--…)` für Tokens ohne eigene Utility. Die bedingte Klasse kennen Sie schon: `highlighted` bei der `PricingCard` entspricht `online` hier.
- **Vollständige Klassennamen:** Tailwind liest die Projektdateien als Text und erzeugt CSS nur für Klassennamen, die vollständig darin vorkommen. `` `bg-status-${profile.online ? "online" : "offline"}` `` ergibt im Browser zwar den richtigen Namen, aber Tailwind hat dafür kein CSS erzeugt.
- **Tokens ohne Utility:** Radius und Schatten sind nicht im `@theme`-Block registriert. `rounded-(--radius-card)` ist die Kurzform für `border-radius: var(--radius-card)`. Die naheliegenden `rounded-2xl` und `shadow-lg` aus der Skala von Tailwind entsprechen den Tokens nur ungefähr, und `shadow-lg` färbt im dunklen Farbschema nicht um.
- **`grid-cols-[auto_1fr]`** ist ein willkürlicher Wert in eckigen Klammern; der Unterstrich steht für ein Leerzeichen.

</details>

## Schritt 4: Beide Ansätze vergleichen

Beantworten Sie für sich, am besten mit Beispielen aus Ihrem Code:

1. **Dateien:** Wie viele Dateien gehören zu jeder Fassung?
2. **Markup:** Wie lang ist das Markup? Wo steht beim Lesen des Codes die Information zum Styling?
3. **Benennung:** Welche Namen mussten Sie in welcher Fassung erfinden?
4. **Tempo und Wartbarkeit:** Welcher Ansatz fühlte sich schneller an, welcher wartbarer?
5. **Werkzeuge:** Was haben Vite und Tailwind geleistet, was haben Sie von nativem CSS bekommen?
6. **Einordnung:** Wann würden Sie styled-components oder vanilla-extract aus Schritt 1 wählen?

<details>
<summary>Lösungshinweis</summary>

1. CSS Modules: zwei Dateien (TSX und CSS). Tailwind: eine Datei.
2. Bei CSS Modules beschreibt das Markup die **Struktur** (`card`, `avatar`, `status`), das Styling steht in einer zweiten Datei. Bei Tailwind steht das Styling **am Element**; dafür trägt das `<article>` über ein Dutzend Utilities, und die Bedeutung der Elemente steckt nur noch im Tag und im Inhalt.
3. CSS Modules: ein Name pro gestaltetem Element. Tailwind: keine Namen. Die Wiederverwendung geschieht über die Komponente selbst.
4. Tailwind ist oft schneller, weil der Wechsel zwischen Dateien entfällt und die Skala Werte vorgibt. CSS Modules lassen sich leichter lesen, wenn viele Regeln oder komplexe Selektoren zusammenkommen. Beide sind gekapselt: Eine Änderung trifft nur diese Komponente.
5. Vite erzeugt bei CSS Modules die eindeutigen Klassennamen, Tailwind erzeugt die Utilities und den Reset Preflight. Custom Properties, Vererbung, Grid, `position` und das Umfärben im dunklen Farbschema liefert der Browser mit nativem CSS. Deshalb funktionieren die Tokens in allen vier Ansätzen.
6. styled-components praktisch nur noch in bestehenden Projekten. vanilla-extract, wenn ein Design System seine Styles typsicher in TypeScript beschreiben und als statisches CSS ausliefern soll. Für die meisten Projekte genügen CSS Modules oder Tailwind.

</details>

## Checkliste

- [ ] Beide Karten zeigen Avatar mit Initialen, Name, Rolle, Pills, Status-Punkt und Button und sehen gleich aus.
- [ ] Keine fest eingetragenen Farben; keine Farben aus Tailwinds Standardpalette.
- [ ] Der Status-Punkt ist grün bei `online: true` und grau bei `online: false`.
- [ ] Der Schalter «Dark Mode» färbt beide Karten vollständig um, ohne eigenes CSS für das dunkle Farbschema.
- [ ] `npm run check` und `npm run e2e` laufen ohne Fehler.
- [ ] Sie können die Vergleichsfragen aus Schritt 4 mit Beispielen aus Ihrem Code beantworten.

## Vertiefung

**a) Container Query.** Die Karte mit CSS Modules soll ihr Layout ändern, wenn ihr **Container** schmaler als 300 px ist: alles untereinander und zentriert. Verwenden Sie `container-type: inline-size` und `@container`. Bei welchen Fensterbreiten ist die Karte danach vertikal, bei welchen horizontal? Schreiben Sie einen Playwright-Test, der beide Zustände prüft (`page.setViewportSize`).

<details>
<summary>Lösungshinweis</summary>

Eine Container Query wertet immer einen **Vorfahren** aus; ein Element kann sich nicht selbst abfragen. `container-type` direkt an `.card` wirkt deshalb nicht auf `.card`. Legen Sie ein Element um die Karte:

```tsx
<div className={styles.host}>
  <article className={styles.card}>…</article>
</div>
```

```css
.host {
  container-type: inline-size;
}

@container (width < 300px) {
  .card {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }

  .avatar {
    grid-row: auto; /* spannt nicht mehr über zwei Zeilen */
  }

  .follow {
    justify-self: stretch; /* sonst wird der Button schmal */
  }
}
```

Auf dem Desktop ist die Karte **vertikal**: Das Raster der Demo hat dort bis zu vier Spalten von etwa 270 px. Bei etwa 350 bis 590 px Fensterbreite gibt es nur eine Spalte, und die Karte ist breiter als 300 px und damit **horizontal**. Ein schmaleres Fenster ergibt hier also das breitere Layout. Mit einer Media Query wäre das nicht möglich, denn sie kennt nur die Breite des Fensters. Dieselbe Karte verhält sich in einer schmalen Seitenleiste anders als im breiten Inhaltsbereich.

```ts
test("Layout hängt von der Breite des Containers ab", async ({ page }) => {
  const karte = page
    .getByRole("region", { name: "Übung · ProfileCard (CSS Modules)" })
    .getByRole("article");

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await expect(karte).toHaveCSS("text-align", "center");

  await page.setViewportSize({ width: 500, height: 900 });
  await expect(karte).toHaveCSS("text-align", "start");
});
```

In Tailwind gibt es dafür `@container` am Wrapper und Varianten wie `@max-[300px]:text-center` an den Kindern.

</details>

**b) `:has()`.** Die ganze Karte soll einen Rahmen in der Akzentfarbe bekommen, solange der Button «Folgen» unter der Maus ist, ohne JavaScript. Setzen Sie das in beiden Fassungen um und prüfen Sie es mit einem Playwright-Test (`hover()`).

<details>
<summary>Lösungshinweis</summary>

CSS Modules:

```css
.card:has(.follow:hover) {
  border-color: var(--accent);
  outline: 2px solid var(--accent);
  outline-offset: -2px;
}
```

Tailwind, mit der Variante `has-[…]` am `<article>`:

```
has-[button:hover]:border-accent has-[button:hover]:outline-2
has-[button:hover]:-outline-offset-2 has-[button:hover]:outline-accent
```

`:has()` wählt ein Element abhängig von seinen Nachfahren aus. Vor `:has()` brauchte man dafür JavaScript. Alternativ kennt Tailwind `group` am Elternelement und `group-hover:` an den Kindern; das reagiert aber auf das Elternelement, nicht auf den Button.

```ts
for (const abschnitt of ["Übung · ProfileCard (CSS Modules)", "Übung · ProfileCard (Tailwind)"]) {
  test(`Rahmen beim Hover über «Folgen» (${abschnitt})`, async ({ page }) => {
    await page.goto("/");
    const karte = page.getByRole("region", { name: abschnitt }).getByRole("article");

    await expect(karte).toHaveCSS("border-top-color", "rgb(217, 221, 227)");
    await karte.getByRole("button", { name: "Folgen" }).hover();
    await expect(karte).toHaveCSS("border-top-color", "rgb(47, 111, 237)");
  });
}
```

Prüfen Sie im Browser auch: Der Rahmen erscheint nur über dem Button, nicht über dem Rest der Karte.

</details>
