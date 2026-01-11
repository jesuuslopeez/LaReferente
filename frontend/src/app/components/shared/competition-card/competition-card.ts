import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface CompetitionCardData {
  logo: string;
  name: string;
  totalTeams: number;
  groups?: number;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-competition-card',
  imports: [RouterLink],
  templateUrl: './competition-card.html',
  styleUrl: './competition-card.scss',
})
export class CompetitionCard {
  logo = input.required<string>();
  name = input.required<string>();
  slug = input.required<string>();
  totalTeams = input.required<number>();
  groups = input<number>();
  startDate = input.required<string>();
  endDate = input.required<string>();

  get isMultiGroup(): boolean {
    return this.groups() !== undefined && this.groups()! > 1;
  }
}
