import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Competicion, Grupo } from '../../services/competition.service';

@Component({
  selector: 'app-competition-group',
  imports: [],
  templateUrl: './competition-group.html',
  styleUrl: './competition-group.scss',
})
export class CompetitionGroup {
  competicion: Competicion;
  grupo: Grupo;

  constructor(private route: ActivatedRoute) {
    const data = this.route.snapshot.data['grupoData'];
    this.competicion = data.competicion;
    this.grupo = data.grupo;
  }
}
