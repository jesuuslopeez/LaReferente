import { Component, computed, input } from '@angular/core';

export type ImageSize = 'small' | 'medium' | 'large';

export interface PlayerCardData {
  playerName: string;
  playerImage?: string;
  playerSlug?: string;
  imageSize?: ImageSize;
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
  playerImage = input<string>('');
  playerSlug = input<string>('');
  imageSize = input<ImageSize>('medium');
  dorsalNumber = input.required<number>();
  clubName = input.required<string>();
  clubLogo = input.required<string>();
  country = input.required<string>();
  age = input.required<number>();
  position = input.required<string>();

  // Indica si usa imagenes locales (para srcset)
  isLocalImage = computed(() => !this.playerImage() && !!this.playerSlug());

  // Computed para obtener la URL de la imagen principal
  imageSrc = computed(() => {
    // Si tiene playerImage (URL externa), usarla
    if (this.playerImage()) {
      return this.playerImage();
    }
    // Si tiene playerSlug, construir ruta local (medium como default)
    if (this.playerSlug()) {
      return `assets/images/players/medium/${this.playerSlug()}.webp`;
    }
    // Fallback
    return 'assets/images/players/medium/no_cutout.webp';
  });

  // Srcset para imagenes responsive (solo para imagenes locales)
  imageSrcset = computed(() => {
    if (!this.playerSlug()) return '';
    const slug = this.playerSlug();
    return `assets/images/players/small/${slug}.webp 400w, assets/images/players/medium/${slug}.webp 800w, assets/images/players/large/${slug}.webp 1200w`;
  });

  // Sizes para indicar al navegador que tamaño usar
  imageSizes = computed(() => {
    // En mobile la imagen ocupa ~120px, en desktop ~150px
    return '(max-width: 640px) 120px, 150px';
  });
}
