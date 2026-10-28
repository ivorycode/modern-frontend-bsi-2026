import { Component } from '@angular/core';
import { RenderBadge } from '../shared/render-badge';
import { injectRenderInfo } from '../shared/render-info';
import { PRODUKTE } from './produkte-data';

/**
 * SSG (Prerender): Der Produktkatalog ist öffentlich, soll von Suchmaschinen
 * gefunden werden und ändert sich nur mit einem Release. Das HTML wird einmal
 * beim Build erzeugt und als statische Datei ausgeliefert (CDN-tauglich).
 */
@Component({
  selector: 'app-produkte',
  imports: [RenderBadge],
  template: `
    <app-render-badge mode="SSG" [info]="renderInfo" />

    <h1>Unsere Versicherungsprodukte</h1>
    <p>
      Der Zeitstempel oben bleibt bei jedem Neuladen gleich: Das HTML wurde beim
      <code>ng build</code> erzeugt.
    </p>

    <div class="produkte">
      @for (produkt of produkte; track produkt.id) {
        <article>
          <h2>{{ produkt.name }}</h2>
          <p>{{ produkt.beschreibung }}</p>
          <ul>
            @for (leistung of produkt.leistungen; track leistung) {
              <li>{{ leistung }}</li>
            }
          </ul>
        </article>
      }
    </div>
  `,
  styles: `
    .produkte {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
      gap: 1rem;
    }
    article {
      border: 1px solid #ccc;
      border-radius: 6px;
      padding: 0 1rem;
    }
  `,
})
export class Produkte {
  protected readonly renderInfo = injectRenderInfo('produkte');
  protected readonly produkte = PRODUKTE;
}
