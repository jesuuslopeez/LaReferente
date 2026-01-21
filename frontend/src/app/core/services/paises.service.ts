import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';

export interface Pais {
  name: string;
  es_name: string;
  code: string;
}

interface PaisesResponse {
  countries: Pais[];
}

@Injectable({
  providedIn: 'root',
})
export class PaisesService {
  private readonly http = inject(HttpClient);
  private cache$: Observable<Pais[]> | null = null;

  /**
   * Carga el JSON de países (con caché)
   */
  cargarPaises(): Observable<Pais[]> {
    if (!this.cache$) {
      this.cache$ = this.http
        .get<PaisesResponse>('assets/data/paises.json')
        .pipe(
          map(response => response.countries),
          shareReplay(1)
        );
    }
    return this.cache$;
  }

  /**
   * Busca países que coincidan con el texto (para autocompletado)
   * Busca tanto en nombre en español como en inglés
   * Devuelve máximo 10 resultados
   */
  buscarPaises(texto: string): Observable<Pais[]> {
    if (!texto || texto.length < 1) {
      return new Observable(obs => {
        obs.next([]);
        obs.complete();
      });
    }

    const textoLower = texto.toLowerCase();
    return this.cargarPaises().pipe(
      map(paises => {
        const resultados: Pais[] = [];

        for (const pais of paises) {
          if (
            pais.es_name.toLowerCase().includes(textoLower) ||
            pais.name.toLowerCase().includes(textoLower)
          ) {
            resultados.push(pais);
            if (resultados.length >= 10) {
              return resultados;
            }
          }
        }
        return resultados;
      })
    );
  }

  /**
   * Verifica si un país existe en el JSON (por nombre en español)
   */
  existePais(nombre: string): Observable<boolean> {
    return this.cargarPaises().pipe(
      map(paises => {
        const nombreLower = nombre.toLowerCase();
        return paises.some(p => p.es_name.toLowerCase() === nombreLower);
      })
    );
  }

  /**
   * Obtiene el código de bandera para un país dado su nombre en español
   * Devuelve 'es' por defecto si no encuentra el país
   */
  getFlagCode(nacionalidad: string | undefined): Observable<string> {
    if (!nacionalidad) {
      return new Observable(obs => {
        obs.next('es');
        obs.complete();
      });
    }

    const nombreLower = nacionalidad.toLowerCase();
    return this.cargarPaises().pipe(
      map(paises => {
        const pais = paises.find(p => p.es_name.toLowerCase() === nombreLower);
        return pais?.code || 'es';
      })
    );
  }

  /**
   * Obtiene el código de bandera de forma síncrona usando un mapa cacheado
   * Útil para templates donde no se puede usar async pipe fácilmente
   */
  private flagMap: Map<string, string> | null = null;

  buildFlagMap(): Observable<Map<string, string>> {
    return this.cargarPaises().pipe(
      map(paises => {
        if (!this.flagMap) {
          this.flagMap = new Map();
          for (const pais of paises) {
            this.flagMap.set(pais.es_name.toLowerCase(), pais.code);
          }
        }
        return this.flagMap;
      })
    );
  }

  getFlagCodeSync(nacionalidad: string | undefined): string {
    if (!nacionalidad || !this.flagMap) {
      return 'es';
    }
    return this.flagMap.get(nacionalidad.toLowerCase()) || 'es';
  }
}
