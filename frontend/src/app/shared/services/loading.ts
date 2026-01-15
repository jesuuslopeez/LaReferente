import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Servicio para gestionar el estado de carga global de la aplicación.
 * Soporta múltiples peticiones concurrentes (contador) y mensajes personalizados.
 */
@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private messageSubject = new BehaviorSubject<string | null>(null);

  /** Observable del estado de carga */
  public isLoading$: Observable<boolean> = this.loadingSubject.asObservable();

  /** Observable del mensaje de carga */
  public message$: Observable<string | null> = this.messageSubject.asObservable();

  private requestCount = 0;

  /**
   * Muestra el indicador de carga
   * @param message Mensaje opcional para mostrar durante la carga
   */
  show(message?: string): void {
    this.requestCount++;
    if (message) {
      this.messageSubject.next(message);
    }
    this.loadingSubject.next(this.requestCount > 0);
  }

  /**
   * Oculta el indicador de carga
   */
  hide(): void {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this.loadingSubject.next(false);
      this.messageSubject.next(null);
    }
  }
}
