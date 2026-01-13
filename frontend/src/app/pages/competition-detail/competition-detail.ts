import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { Competition } from '../../core/models';

@Component({
  selector: 'app-competition-detail',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './competition-detail.html',
  styleUrl: './competition-detail.scss',
})
export class CompetitionDetail {
  competicion: Competition;

  constructor(private route: ActivatedRoute) {
    this.competicion = this.route.snapshot.data['competicion'];
  }
}
