import { HttpHeaders, httpResource } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RenderBadge } from '../shared/render-badge';
import { injectRenderInfo } from '../shared/render-info';

interface Police {
  nummer: string;
  produkt: string;
  praemie: number;
}

const TOKEN_KEY = 'portal-token';

/**
 * CSR (Client): Das Kundenportal ist personalisiert und nur nach Anmeldung
 * sichtbar. Suchmaschinen sollen es nicht indexieren, und das Login-Token liegt
 * im Browser (localStorage), den es auf dem Server nicht gibt. Der Server liefert
 * nur die leere App-Shell; alles Weitere passiert im Browser.
 */
@Component({
  selector: 'app-portal',
  imports: [RenderBadge, FormsModule],
  template: `
    <app-render-badge mode="CSR" [info]="renderInfo" />

    <h1>Kundenportal: Meine Policen</h1>

    @if (token()) {
      <p>
        Angemeldet als <strong>{{ token() }}</strong>
        <button type="button" (click)="abmelden()">Abmelden</button>
      </p>

      @if (policen.hasValue()) {
        <table>
          <thead>
            <tr><th>Police</th><th>Produkt</th><th>Jahresprämie</th></tr>
          </thead>
          <tbody>
            @for (p of policen.value(); track p.nummer) {
              <tr>
                <td>{{ p.nummer }}</td>
                <td>{{ p.produkt }}</td>
                <td>CHF {{ p.praemie }}</td>
              </tr>
            }
          </tbody>
        </table>
      } @else if (policen.error()) {
        <p>Die Policen konnten nicht geladen werden.</p>
      } @else {
        <p>Lade Policen …</p>
      }
    } @else {
      <form (ngSubmit)="anmelden()">
        <label>
          Name
          <input name="name" [(ngModel)]="name" required />
        </label>
        <button type="submit">Anmelden</button>
      </form>
    }
  `,
  styles: `
    table {
      border-collapse: collapse;
      min-width: 24rem;
    }
    th,
    td {
      text-align: left;
      padding: 0.4rem 0.8rem;
      border-bottom: 1px solid #ddd;
    }
    button {
      margin-left: 0.5rem;
    }
  `,
})
export class Portal {
  protected readonly renderInfo = injectRenderInfo('portal');

  // Läuft nur im Browser: Auf dem Server gäbe es localStorage nicht.
  protected readonly token = signal(localStorage.getItem(TOKEN_KEY));
  protected name = '';

  protected readonly policen = httpResource<Police[]>(() => {
    const token = this.token();
    if (!token) return undefined;
    return {
      url: '/api/meine-policen',
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    };
  });

  protected anmelden() {
    const name = this.name.trim();
    if (!name) return;
    localStorage.setItem(TOKEN_KEY, name);
    this.token.set(name);
  }

  protected abmelden() {
    localStorage.removeItem(TOKEN_KEY);
    this.token.set(null);
  }
}
