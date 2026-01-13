import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { CompetitionService } from '../services/competition.service';
import { Competition } from '../core/models';

export const competitionResolver: ResolveFn<Competition | undefined> = (route) => {
  const service = inject(CompetitionService);
  const router = inject(Router);
  const id = Number(route.paramMap.get('id'));

  if (!id || isNaN(id)) {
    router.navigate(['/404']);
    return of(undefined);
  }

  return service.obtenerPorId(id).pipe(
    tap((comp) => {
      if (!comp) {
        router.navigate(['/404']);
      }
    }),
    catchError(() => {
      router.navigate(['/404']);
      return of(undefined);
    })
  );
};
