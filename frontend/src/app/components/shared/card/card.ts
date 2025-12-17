import { Component, input } from '@angular/core';

export interface PlayerCardData {
  playerName: string;
  playerImage: string;
  dorsalNumber: number;
  clubName: string;
  clubLogo: string;
  country: string;
  age: number;
  position: string;
}

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  playerName = input.required<string>();
  playerImage = input.required<string>();
  dorsalNumber = input.required<number>();
  clubName = input.required<string>();
  clubLogo = input.required<string>();
  country = input.required<string>();
  age = input.required<number>();
  position = input.required<string>();
}
