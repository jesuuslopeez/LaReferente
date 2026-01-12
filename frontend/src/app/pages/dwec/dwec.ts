import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Button } from '../../components/shared/button/button';
import { Alert } from '../../components/shared/alert/alert';
import { Card } from '../../components/shared/card/card';
import { CompetitionCard } from '../../components/shared/competition-card/competition-card';
import { ToastService } from '../../shared/services/toast';
import { LoadingService } from '../../shared/services/loading';
import { CommunicationService } from '../../shared/services/communication';
import { telefono } from '../../shared/validators/spanish-formats.validator';

@Component({
  selector: 'app-dwec',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Button, Alert, Card, CompetitionCard],
  templateUrl: './dwec.html',
  styleUrl: './dwec.scss',
})
export class Dwec {
  private router = inject(Router);
  private toastService = inject(ToastService);
  private loadingService = inject(LoadingService);
  private commService = inject(CommunicationService);
  private fb = inject(FormBuilder);

  isLoading = signal(false);
  lastMessage = signal('');
  phonesForm: FormGroup;

  constructor() {
    this.commService.notifications$.subscribe(msg => {
      if (msg) {
        this.lastMessage.set(msg);
        this.toastService.info(`Mensaje recibido: ${msg}`);
      }
    });

    // FormArray ejemplo
    this.phonesForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phones: this.fb.array([this.newPhone()])
    });
  }

  // FormArray methods
  get phones(): FormArray {
    return this.phonesForm.get('phones') as FormArray;
  }

  newPhone(): FormGroup {
    return this.fb.group({
      number: ['', [Validators.required, telefono()]]
    });
  }

  addPhone(): void {
    this.phones.push(this.newPhone());
  }

  removePhone(index: number): void {
    if (this.phones.length > 1) {
      this.phones.removeAt(index);
    }
  }

  onSubmitPhones(): void {
    if (this.phonesForm.invalid) {
      this.phonesForm.markAllAsTouched();
      this.toastService.error('Completa todos los campos correctamente');
      return;
    }
    console.log('Teléfonos enviados:', this.phonesForm.value);
    this.toastService.success('¡Teléfonos guardados exitosamente!');
  }

  navigateToStyleGuide() {
    this.router.navigate(['/style-guide']);
  }

  showSuccessToast() {
    this.toastService.success('¡Operación exitosa! Los cambios se han guardado correctamente.');
  }

  showErrorToast() {
    this.toastService.error('Ha ocurrido un error al procesar la solicitud.');
  }

  showInfoToast() {
    this.toastService.info('Se han actualizado las condiciones del servicio.');
  }

  showWarningToast() {
    this.toastService.warning('Esta acción no se puede deshacer. Procede con precaución.');
  }

  simulateLoading() {
    this.isLoading.set(true);
    this.loadingService.show();

    setTimeout(() => {
      this.isLoading.set(false);
      this.loadingService.hide();
      this.toastService.success('¡Carga completada!');
    }, 2000);
  }

  sendNotification() {
    const timestamp = new Date().toLocaleTimeString();
    this.commService.sendNotification(`Notificación enviada a las ${timestamp}`);
  }
}
