import { RenderMode, ServerRoute } from '@angular/ssr';

/** Hier wird pro Route festgelegt, wo und wann das HTML entsteht. */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'produkte', renderMode: RenderMode.Prerender },
  { path: 'unwetter', renderMode: RenderMode.Server },
  { path: 'portal', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Server },
];
