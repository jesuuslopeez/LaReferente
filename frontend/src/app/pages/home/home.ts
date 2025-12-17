import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Button } from '../../components/shared/button/button';
import { Alert } from '../../components/shared/alert/alert';
import { Card } from '../../components/shared/card/card';
import { CompetitionCard } from '../../components/shared/competition-card/competition-card';
import { ToastService } from '../../shared/services/toast';
import { LoadingService } from '../../shared/services/loading';
import { CommunicationService } from '../../shared/services/communication';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Button, Alert, Card, CompetitionCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private router = inject(Router);
  private toastService = inject(ToastService);
  private loadingService = inject(LoadingService);
  private commService = inject(CommunicationService);

  isLoading = signal(false);
  lastMessage = signal('');

  constructor() {
    this.commService.notifications$.subscribe(msg => {
      if (msg) {
        this.lastMessage.set(msg);
        this.toastService.info(`Mensaje recibido: ${msg}`);
      }
    });
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
