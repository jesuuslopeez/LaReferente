import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favorites',
  imports: [RouterLink],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites {
  favoritos = [
    {
      slug: 'laliga-ea-sports',
      nombre: 'LaLiga EA Sports',
      tipo: 'competicion',
    },
    {
      slug: 'segunda-federacion',
      nombre: 'Segunda Federacion',
      tipo: 'competicion',
    },
  ];

  eliminar(slug: string): void {
    this.favoritos = this.favoritos.filter((f) => f.slug !== slug);
  }
}
