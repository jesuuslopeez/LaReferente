import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatchService } from '../../../core/services/match.service';
import { CompetitionService } from '../../../services/competition.service';
import { ToastService } from '../../../shared/services/toast';
import { Competition, MatchStatus, AgeCategory } from '../../../core/models';
import { TeamSearch } from '../../../components/shared/team-search/team-search';

@Component({
  selector: 'app-match-create',
  imports: [ReactiveFormsModule, RouterLink, TeamSearch],
  templateUrl: './match-create.html',
  styleUrl: './match-create.scss',
})
export class MatchCreate {
  private fb = inject(FormBuilder);
  private matchService = inject(MatchService);
  private competitionService = inject(CompetitionService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  competiciones = signal<Competition[]>([]);
  competicionesFiltradas = signal<Competition[]>([]);
  categoriaActual = signal<AgeCategory>('SENIOR');

  categorias: { valor: AgeCategory; texto: string }[] = [
    { valor: 'SENIOR', texto: 'Senior' },
    { valor: 'JUVENIL', texto: 'Juvenil' },
    { valor: 'CADETE', texto: 'Cadete' },
    { valor: 'INFANTIL', texto: 'Infantil' },
    { valor: 'ALEVIN', texto: 'Alevín' },
    { valor: 'BENJAMIN', texto: 'Benjamín' },
    { valor: 'PREBENJAMIN', texto: 'Prebenjamín' },
  ];

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

  constructor() {
    this.competitionService.obtenerTodas().subscribe((comps) => {
      this.competiciones.set(comps);
      this.filtrarCompeticiones();
    });
  }

  onCategoriaChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.categoriaActual.set(select.value as AgeCategory);
    this.filtrarCompeticiones();
    // Limpiar selecciones al cambiar categoría
    this.form.patchValue({
      competicionId: null,
      equipoLocalId: null,
      equipoVisitanteId: null,
    });
  }

  private filtrarCompeticiones(): void {
    const filtradas = this.competiciones().filter(
      (c) => c.categoria === this.categoriaActual()
    );
    this.competicionesFiltradas.set(filtradas);
  }

  onEquipoLocalSelected(team: { id: number; nombre: string } | null): void {
    this.form.patchValue({ equipoLocalId: team?.id || null });
  }

  onEquipoVisitanteSelected(team: { id: number; nombre: string } | null): void {
    this.form.patchValue({ equipoVisitanteId: team?.id || null });
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
