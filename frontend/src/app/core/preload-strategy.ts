import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

/**
 * Estrategia de precarga selectiva que:
 * 1. Solo precarga rutas marcadas con data: { preload: true }
 * 2. Espera 2 segundos después de la carga inicial para no bloquear
 * 3. Mejora el performance inicial manteniendo carga diferida inteligente
 */
@Injectable({ providedIn: 'root' })
export class SelectivePreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Si la ruta tiene data.preload = true, precargarla después de 2s
    if (route.data?.['preload']) {
      return timer(2000).pipe(mergeMap(() => load()));
    }
    // Si no, no precargar
    return of(null);
  }
}
