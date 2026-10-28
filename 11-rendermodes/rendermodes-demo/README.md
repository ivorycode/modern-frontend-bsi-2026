# Render Modes in Angular

Demo der drei Render Modes von Angular 22 an einer fiktiven Versicherungs-Website. Erstellt mit `ng new rendermodes-demo --ssr`.

| Route | Render Mode | HTML entsteht | Fachliche Begründung |
| --- | --- | --- | --- |
| `/produkte` | SSG (`RenderMode.Prerender`) | einmal beim Build | Produktkatalog: öffentlich, SEO-relevant, ändert sich nur mit einem Release |
| `/unwetter` | SSR (`RenderMode.Server`) | bei jedem Request auf dem Server | Unwetterwarnungen: öffentlich, SEO-relevant, müssen bei jedem Aufruf aktuell sein, Filter per Query-Parameter (`?region=Bern`) |
| `/portal` | CSR (`RenderMode.Client`) | im Browser | Kundenportal: personalisiert, hinter Login (Token im `localStorage`), nicht für Suchmaschinen |

Die Render Modes werden pro Route in [`src/app/app.routes.server.ts`](./src/app/app.routes.server.ts) festgelegt. Die simulierten APIs (`/api/unwetterwarnungen`, `/api/meine-policen`) liegen im Express-Server [`src/server.ts`](./src/server.ts).

Jede Seite zeigt oben, wo und wann ihr HTML erzeugt wurde. Der Zeitpunkt des Server-Renderings wird über den `TransferState` an den Browser übergeben ([`src/app/shared/render-info.ts`](./src/app/shared/render-info.ts)).

## Starten

Der Unterschied zwischen SSG und SSR ist nur im Production-Build sichtbar. `ng serve` rendert auch prerenderte Routen bei jedem Request.

```bash
npm install
npm run build
npm run serve:ssr:rendermodes-demo
```

Danach <http://localhost:4000> öffnen.

Zum Entwickeln: `npm start` (Dev-Server auf <http://localhost:4200>).

## Ausprobieren

- Jede Seite direkt aufrufen und mehrmals neu laden: Bei `/produkte` bleibt der Zeitstempel gleich (Build-Zeit), bei `/unwetter` ändert er sich, bei `/portal` kommt er aus dem Browser.
- «Seitenquelltext anzeigen»: `/produkte` und `/unwetter` enthalten die Inhalte bereits im HTML, `/portal` nur `<app-root></app-root>`.
- In `dist/rendermodes-demo/browser/produkte/index.html` liegt die prerenderte Seite als Datei.
- Über die Navigation wechseln: Nach dem ersten Laden ist die Anwendung eine SPA, und alle weiteren Seiten rendert der Browser.
- JavaScript in den DevTools deaktivieren und alle drei Seiten neu laden.
