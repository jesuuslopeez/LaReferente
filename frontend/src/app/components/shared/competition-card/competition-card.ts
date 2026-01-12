import { Component, computed, input } from '@angular/core';
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

  // Detecta si es imagen local (para usar srcset)
  isLocalImage = computed(() => {
    const logo = this.logo();
    return logo.startsWith('assets/') || logo.startsWith('/assets/');
  });

  // Extrae el slug de la imagen del logo para construir srcset
  logoSlug = computed(() => {
    const logo = this.logo();
    // Extrae nombre del archivo sin extension ni tamaño
    // Ej: assets/images/competitions/medium/laliga_ea.webp -> laliga_ea
    const match = logo.match(/\/([^/]+)\.webp$/);
    return match ? match[1] : '';
  });

  // Srcset para imagenes responsive de competiciones
  logoSrcset = computed(() => {
    const slug = this.logoSlug();
    if (!slug) return '';
    return `assets/images/competitions/small/${slug}.webp 400w, assets/images/competitions/medium/${slug}.webp 800w, assets/images/competitions/large/${slug}.webp 1200w`;
  });

  // Sizes para el logo de competicion
  logoSizes = computed(() => {
    // Logo ocupa ~60px en mobile, ~80px en desktop
    return '(max-width: 640px) 60px, 80px';
  });
}
