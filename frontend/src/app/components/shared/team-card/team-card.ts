import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-team-card',
  imports: [RouterLink],
  templateUrl: './team-card.html',
  styleUrl: './team-card.scss',
})
export class TeamCard {
  id = input.required<number>();
  nombre = input.required<string>();
  nombreCompleto = input<string>();
  logoUrl = input<string | null>();
  ciudad = input<string>();
  estadio = input<string>();
  fundacion = input<number>();
  pais = input<string>();

  get logoSrc(): string {
    return this.logoUrl() || 'assets/images/teams/default-team.webp';
  }

  get textoFundacion(): string {
    const fundacion = this.fundacion();
    return fundacion ? `Fundado en ${fundacion}` : '';
  }
}
