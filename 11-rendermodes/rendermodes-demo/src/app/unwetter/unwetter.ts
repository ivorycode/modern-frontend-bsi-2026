import { httpResource } from '@angular/common/http';
import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RenderBadge } from '../shared/render-badge';
import { injectRenderInfo } from '../shared/render-info';

interface Unwetterwarnung {
  region: string;
  gefahr: string;
  stufe: number;
}

interface UnwetterLage {
  stand: string;
  warnungen: Unwetterwarnung[];
}

/**
 * SSR (Server): Die Unwetterlage ändert sich laufend und muss beim Aufruf aktuell
 * sein. Die Seite ist öffentlich, wird geteilt und über Suchmaschinen gefunden,
 * und soll auch auf dem Handy während eines Gewitters sofort Inhalt zeigen.
 * Der Server rendert deshalb bei jedem Request – auch abhängig vom Query-Parameter.
 */
@Component({
  selector: 'app-unwetter',
  imports: [RenderBadge, RouterLink, DatePipe],
  template: `
    <app-render-badge mode="SSR" [info]="renderInfo" />

    <h1>Aktuelle Unwetterwarnungen</h1>
    <p>
      Bei jedem Neuladen erzeugt der Server neues HTML mit der aktuellen Lage. Der Filter
      wird als Query-Parameter an den Server geschickt.
    </p>

    <nav class="regionen">
      <a routerLink="/unwetter">Alle Regionen</a>
      @for (r of regionen; track r) {
        <a routerLink="/unwetter" [queryParams]="{ region: r }">{{ r }}</a>
      }
    </nav>

    @if (lage.hasValue()) {
      <p>Stand der Daten: {{ lage.value().stand | date: 'HH:mm:ss' }} Uhr</p>
      <table>
        <thead>
          <tr><th>Region</th><th>Gefahr</th><th>Stufe</th></tr>
        </thead>
        <tbody>
          @for (w of lage.value().warnungen; track w.region + w.gefahr) {
            <tr [class]="'stufe-' + w.stufe">
              <td>{{ w.region }}</td>
              <td>{{ w.gefahr }}</td>
              <td>{{ w.stufe }}</td>
            </tr>
          } @empty {
            <tr><td colspan="3">Keine Warnungen.</td></tr>
          }
        </tbody>
      </table>
    } @else if (lage.error()) {
      <p>Die Unwetterlage konnte nicht geladen werden.</p>
    } @else {
      <p>Lade Unwetterlage …</p>
    }
  `,
  styles: `
    .regionen {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
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
    .stufe-3 {
      background: #fff3e0;
    }
    .stufe-4 {
      background: #ffebee;
    }
  `,
})
export class Unwetter {
  /** Query-Parameter `?region=…`, gebunden über withComponentInputBinding(). */
  readonly region = input<string>();

  protected readonly regionen = ['Bern', 'Zürich', 'Luzern', 'Basel', 'Wallis'];
  protected readonly renderInfo = injectRenderInfo('unwetter');

  protected readonly lage = httpResource<UnwetterLage>(() => {
    const region = this.region();
    return { url: '/api/unwetterwarnungen', params: region ? { region } : undefined };
  });
}
