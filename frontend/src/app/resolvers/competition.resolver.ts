import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { CompetitionService, Competicion, Grupo } from '../services/competition.service';

export const competitionResolver: ResolveFn<Competicion | undefined> = (route) => {
  const service = inject(CompetitionService);
  const router = inject(Router);
  const slug = route.paramMap.get('slug')!;

  return service.obtenerPorSlug(slug).pipe(
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

export const groupResolver: ResolveFn<{ competicion: Competicion; grupo: Grupo } | undefined> = (route) => {
  const service = inject(CompetitionService);
  const router = inject(Router);
  const compSlug = route.parent?.paramMap.get('slug') || route.paramMap.get('slug')!;
  const grupoSlug = route.paramMap.get('grupo')!;

  return service.obtenerGrupo(compSlug, grupoSlug).pipe(
    tap((data) => {
      if (!data) {
        router.navigate(['/404']);
      }
    }),
    catchError(() => {
      router.navigate(['/404']);
      return of(undefined);
    })
  );
};
