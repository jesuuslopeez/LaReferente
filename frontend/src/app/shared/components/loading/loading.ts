import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading';

@Component({
  selector: 'app-loading',
  imports: [CommonModule],
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
})
export class Loading {
  private loadingService = inject(LoadingService);

  /** Observable del estado de carga */
  isLoading$ = this.loadingService.isLoading$;

  /** Observable del mensaje de carga personalizado */
  message$ = this.loadingService.message$;
}
