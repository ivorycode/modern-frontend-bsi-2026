import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RenderInfo } from './render-info';

@Component({
  selector: 'app-render-badge',
  imports: [DatePipe],
  template: `
    <aside class="render-badge" [class]="mode().toLowerCase()">
      <strong>{{ mode() }}</strong>
      HTML erzeugt im <strong>{{ info().renderedOn }}</strong>
      um {{ info().renderedAt | date: 'HH:mm:ss' }} Uhr
      ({{ info().renderedAt | date: 'dd.MM.yyyy' }})
    </aside>
  `,
  styles: `
    .render-badge {
      padding: 0.75rem 1rem;
      border-left: 6px solid;
      border-radius: 4px;
      margin-bottom: 1.5rem;
    }
    .ssg {
      background: #e8f5e9;
      border-color: #2e7d32;
    }
    .ssr {
      background: #e3f2fd;
      border-color: #1565c0;
    }
    .csr {
      background: #fff3e0;
      border-color: #ef6c00;
    }
  `,
})
export class RenderBadge {
  readonly mode = input.required<'SSG' | 'SSR' | 'CSR'>();
  readonly info = input.required<RenderInfo>();
}
