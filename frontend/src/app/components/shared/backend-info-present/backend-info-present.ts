import { Component, Input } from '@angular/core';
import { Player } from '../../../core/models/player.model';

@Component({
  standalone: true,
  selector: 'app-backend-info-present',
  imports: [],
  templateUrl: './backend-info-present.html',
  styleUrl: './backend-info-present.scss',
})
export class BackendInfoPresent {
  @Input({ required: true }) player!: Player;
}
