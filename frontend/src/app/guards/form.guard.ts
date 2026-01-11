import { CanDeactivateFn } from '@angular/router';

export interface FormularioConCambios {
  tieneCambiosSinGuardar(): boolean;
}

export const formGuard: CanDeactivateFn<FormularioConCambios> = (component) => {
  if (component.tieneCambiosSinGuardar && component.tieneCambiosSinGuardar()) {
    return confirm('Tienes cambios sin guardar. ¿Seguro que quieres salir?');
  }
  return true;
};
