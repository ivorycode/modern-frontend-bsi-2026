import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-start',
  imports: [RouterLink],
  template: `
    <h1>Render Modes in Angular</h1>
    <p>Drei Seiten einer Versicherungs-Website, jede mit dem Render Mode, der fachlich passt:</p>

    <table>
      <thead>
        <tr><th>Route</th><th>Render Mode</th><th>HTML entsteht</th><th>Warum</th></tr>
      </thead>
      <tbody>
        <tr>
          <td><a routerLink="/produkte">/produkte</a></td>
          <td>SSG (Prerender)</td>
          <td>einmal beim Build</td>
          <td>öffentlich, SEO-relevant, ändert sich nur mit einem Release</td>
        </tr>
        <tr>
          <td><a routerLink="/unwetter">/unwetter</a></td>
          <td>SSR (Server)</td>
          <td>bei jedem Request auf dem Server</td>
          <td>öffentlich, SEO-relevant, muss bei jedem Aufruf aktuell sein</td>
        </tr>
        <tr>
          <td><a routerLink="/portal">/portal</a></td>
          <td>CSR (Client)</td>
          <td>im Browser</td>
          <td>personalisiert, hinter Login, nicht für Suchmaschinen</td>
        </tr>
      </tbody>
    </table>

    <h2>Ausprobieren</h2>
    <ul>
      <li>Jede Seite direkt im Browser aufrufen und neu laden: Wie verändert sich der Zeitstempel?</li>
      <li>
        «Seitenquelltext anzeigen» (nicht DevTools-Elements): Welche Seite enthält die Inhalte
        bereits im HTML?
      </li>
      <li>Mit den Links in der Navigation wechseln: Jetzt rendert immer der Browser.</li>
      <li>JavaScript in den DevTools deaktivieren und alle drei Seiten neu laden.</li>
    </ul>
  `,
  styles: `
    table {
      border-collapse: collapse;
    }
    th,
    td {
      text-align: left;
      padding: 0.4rem 0.8rem;
      border-bottom: 1px solid #ddd;
    }
  `,
})
export class Start {}
