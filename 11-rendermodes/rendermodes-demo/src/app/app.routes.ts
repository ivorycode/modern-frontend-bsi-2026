import { Routes } from '@angular/router';
import { Portal } from './portal/portal';
import { Produkte } from './produkte/produkte';
import { Start } from './start/start';
import { Unwetter } from './unwetter/unwetter';

export const routes: Routes = [
  { path: '', component: Start, title: 'Render Modes' },
  { path: 'produkte', component: Produkte, title: 'Produkte (SSG)' },
  { path: 'unwetter', component: Unwetter, title: 'Unwetterwarnungen (SSR)' },
  { path: 'portal', component: Portal, title: 'Kundenportal (CSR)' },
  { path: '**', redirectTo: '' },
];
