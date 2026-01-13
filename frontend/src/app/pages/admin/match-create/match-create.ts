import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatchService } from '../../../core/services/match.service';
import { TeamService } from '../../../core/services/team.service';
import { CompetitionService } from '../../../services/competition.service';
import { ToastService } from '../../../shared/services/toast';
import { Team, Competition, MatchStatus } from '../../../core/models';

@Component({
  selector: 'app-match-create',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './match-create.html',
  styleUrl: './match-create.scss',
})
export class MatchCreate implements OnInit {
  private fb = inject(FormBuilder);
  private matchService = inject(MatchService);
  private teamService = inject(TeamService);
  private competitionService = inject(CompetitionService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  equipos = signal<Team[]>([]);
  competiciones = signal<Competition[]>([]);

  estados: { valor: MatchStatus; texto: string }[] = [
    { valor: 'PROGRAMADO', texto: 'Programado' },
    { valor: 'EN_CURSO', texto: 'En curso' },
    { valor: 'FINALIZADO', texto: 'Finalizado' },
    { valor: 'APLAZADO', texto: 'Aplazado' },
    { valor: 'CANCELADO', texto: 'Cancelado' },
  ];

  form: FormGroup = this.fb.group({
    competicionId: [null, Validators.required],
    equipoLocalId: [null, Validators.required],
    equipoVisitanteId: [null, Validators.required],
    fechaHora: ['', Validators.required],
    estadio: [''],
    jornada: [null],
    estado: ['PROGRAMADO'],
    arbitro: [''],
  });

  cargando = false;

  ngOnInit(): void {
    this.teamService.getActive().subscribe((equipos) => {
      this.equipos.set(equipos);
    });
    this.competitionService.obtenerTodas().subscribe((comps) => {
      this.competiciones.set(comps);
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.error('Por favor, completa los campos requeridos');
      return;
    }

    if (this.form.value.equipoLocalId === this.form.value.equipoVisitanteId) {
      this.toastService.error('El equipo local y visitante no pueden ser el mismo');
      return;
    }

    this.cargando = true;

    this.matchService.create(this.form.value).subscribe({
      next: () => {
        this.toastService.success('Encuentro creado correctamente');
        this.router.navigate(['/calendario']);
      },
      error: (err) => {
        this.cargando = false;
        this.toastService.error(err.error?.message || 'Error al crear el encuentro');
      },
    });
  }
}
