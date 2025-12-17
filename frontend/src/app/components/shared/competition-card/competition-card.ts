import { Component, input } from '@angular/core';

export interface CompetitionCardData {
  logo: string;
  name: string;
  totalTeams: number;
  groups?: number; // Opcional: si existe, es multigrupo
  startDate: string; // Formato: 'Agosto 2025'
  endDate: string; // Formato: 'Mayo 2026'
}

@Component({
  selector: 'app-competition-card',
  imports: [],
  templateUrl: './competition-card.html',
  styleUrl: './competition-card.scss',
})
export class CompetitionCard {
  logo = input.required<string>();
  name = input.required<string>();
  totalTeams = input.required<number>();
  groups = input<number>();
  startDate = input.required<string>();
  endDate = input.required<string>();

  get isMultiGroup(): boolean {
    return this.groups() !== undefined && this.groups()! > 1;
  }
}
