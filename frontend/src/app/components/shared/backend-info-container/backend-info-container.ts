import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BackendInfoPresent } from '../backend-info-present/backend-info-present';
import { PlayerService } from '../../../core/services/player.service';
import { Player } from '../../../core/models/player.model';

@Component({
  selector: 'app-backend-info-container',
  standalone: true,
  imports: [BackendInfoPresent],
  templateUrl: './backend-info-container.html',
  styleUrl: './backend-info-container.scss',
})
export class BackendInfoContainer implements OnInit {
  private readonly playerService = inject(PlayerService);
  private readonly destroyRef = inject(DestroyRef);

  player = signal<Player | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    this.playerService.getById(1).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (data) => {
        this.player.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
