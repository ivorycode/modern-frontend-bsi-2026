import { isPlatformServer } from '@angular/common';
import { PLATFORM_ID, TransferState, inject, makeStateKey } from '@angular/core';

export interface RenderInfo {
  renderedAt: string;
  renderedOn: 'Server' | 'Browser';
}

/**
 * Hält fest, wo und wann das HTML einer Seite erzeugt wurde.
 *
 * Auf dem Server (SSR oder Prerendering beim Build) wird der Zeitpunkt in den
 * TransferState geschrieben. Der Browser liest ihn bei der Hydration wieder aus
 * und zeigt so den Zeitpunkt des Server-Renderings an statt der eigenen Uhrzeit.
 * Fehlt der Eintrag (CSR oder Navigation im Browser), hat der Browser gerendert.
 */
export function injectRenderInfo(page: string): RenderInfo {
  const transferState = inject(TransferState);
  const key = makeStateKey<RenderInfo>(`render-info:${page}`);

  if (isPlatformServer(inject(PLATFORM_ID))) {
    const info: RenderInfo = { renderedAt: new Date().toISOString(), renderedOn: 'Server' };
    transferState.set(key, info);
    return info;
  }

  const fromServer = transferState.get(key, null);
  transferState.remove(key);
  return fromServer ?? { renderedAt: new Date().toISOString(), renderedOn: 'Browser' };
}
