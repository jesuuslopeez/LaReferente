import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';

export interface Municipio {
  parent_code: string;
  code: string;
  label: string;
}

export interface Provincia {
  parent_code: string;
  code: string;
  label: string;
  towns: Municipio[];
}

export interface ComunidadAutonoma {
  parent_code: string;
  code: string;
  label: string;
  provinces: Provincia[];
}

@Injectable({
  providedIn: 'root',
})
export class MunicipiosService {
  private readonly http = inject(HttpClient);
  private cache$: Observable<ComunidadAutonoma[]> | null = null;

  /**
   * Carga el JSON de municipios (con caché)
   */
  cargarMunicipios(): Observable<ComunidadAutonoma[]> {
    if (!this.cache$) {
      this.cache$ = this.http
        .get<ComunidadAutonoma[]>('assets/data/municipios-espana.json')
        .pipe(shareReplay(1));
    }
    return this.cache$;
  }

  /**
   * Obtiene todas las comunidades autónomas
   */
  getComunidades(): Observable<{ code: string; label: string }[]> {
    return this.cargarMunicipios().pipe(
      map(data => data.map(ca => ({ code: ca.code, label: ca.label })))
    );
  }

  /**
   * Obtiene las provincias de una comunidad autónoma
   */
  getProvincias(ccaaCode: string): Observable<{ code: string; label: string }[]> {
    return this.cargarMunicipios().pipe(
      map(data => {
        const ccaa = data.find(ca => ca.code === ccaaCode);
        if (!ccaa) return [];
        return ccaa.provinces.map(p => ({ code: p.code, label: p.label }));
      })
    );
  }

  /**
   * Obtiene los municipios de una provincia
   */
  getMunicipios(ccaaCode: string, provinciaCode: string): Observable<string[]> {
    return this.cargarMunicipios().pipe(
      map(data => {
        const ccaa = data.find(ca => ca.code === ccaaCode);
        if (!ccaa) return [];
        const provincia = ccaa.provinces.find(p => p.code === provinciaCode);
        if (!provincia) return [];
        return provincia.towns.map(t => t.label).sort();
      })
    );
  }

  /**
   * Busca en qué CCAA y provincia está un municipio dado
   */
  buscarMunicipio(nombreMunicipio: string): Observable<{ ccaaCode: string; provinciaCode: string; municipio: string } | null> {
    return this.cargarMunicipios().pipe(
      map(data => {
        for (const ccaa of data) {
          for (const provincia of ccaa.provinces) {
            const municipio = provincia.towns.find(
              t => t.label.toLowerCase() === nombreMunicipio.toLowerCase()
            );
            if (municipio) {
              return {
                ccaaCode: ccaa.code,
                provinciaCode: provincia.code,
                municipio: municipio.label,
              };
            }
          }
        }
        return null;
      })
    );
  }

  /**
   * Busca municipios que coincidan con el texto (para autocompletado)
   * Devuelve máximo 10 resultados
   */
  buscarMunicipios(texto: string): Observable<{ municipio: string; provincia: string }[]> {
    if (!texto || texto.length < 2) {
      return new Observable(obs => {
        obs.next([]);
        obs.complete();
      });
    }

    const textoLower = texto.toLowerCase();
    return this.cargarMunicipios().pipe(
      map(data => {
        const resultados: { municipio: string; provincia: string }[] = [];

        for (const ccaa of data) {
          for (const provincia of ccaa.provinces) {
            for (const town of provincia.towns) {
              if (town.label.toLowerCase().includes(textoLower)) {
                resultados.push({
                  municipio: town.label,
                  provincia: provincia.label,
                });
                if (resultados.length >= 10) {
                  return resultados;
                }
              }
            }
          }
        }
        return resultados;
      })
    );
  }

  /**
   * Verifica si un municipio existe en el JSON
   */
  existeMunicipio(nombre: string): Observable<boolean> {
    return this.cargarMunicipios().pipe(
      map(data => {
        const nombreLower = nombre.toLowerCase();
        for (const ccaa of data) {
          for (const provincia of ccaa.provinces) {
            if (provincia.towns.some(t => t.label.toLowerCase() === nombreLower)) {
              return true;
            }
          }
        }
        return false;
      })
    );
  }
}
