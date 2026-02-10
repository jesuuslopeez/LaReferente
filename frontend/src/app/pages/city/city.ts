import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerCard } from '../../components/shared/player-card/player-card'

@Component({
    selector: 'app-city',
    standalone: true,
    imports: [CommonModule, PlayerCard],
    templateUrl: './city.html',
    styleUrl: './city.scss',
})
export class City {
    
}