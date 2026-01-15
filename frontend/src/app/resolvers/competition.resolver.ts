import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, of, tap, finalize } from 'rxjs';
import { CompetitionService } from '../services/competition.service';
import { LoadingService } from '../shared/services/loading';
import { Competition } from '../core/models';

/**
 * Resolver que precarga los datos de una competición antes de activar la ruta.
 * Muestra un estado de carga mientras obtiene los datos y redirige a 404 si hay error.
 */
export const competitionResolver: ResolveFn<Competition | undefined> = (route) => {
  const service = inject(CompetitionService);
  const router = inject(Router);
  const loadingService = inject(LoadingService);
  const id = Number(route.paramMap.get('id'));

  if (!id || isNaN(id)) {
    router.navigate(['/404']);
    return of(undefined);
  }

  // Mostrar estado de carga mientras se resuelven los datos
  loadingService.show('Cargando competición...');

  return service.obtenerPorId(id).pipe(
    tap((comp) => {
      if (!comp) {
        router.navigate(['/404']);
      }
    }),
    catchError(() => {
      router.navigate(['/404']);
      return of(undefined);
    }),
    finalize(() => {
      // Ocultar estado de carga cuando termine (éxito o error)
      loadingService.hide();
    })
  );
};
