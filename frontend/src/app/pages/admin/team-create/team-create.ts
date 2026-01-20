import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TeamService } from '../../../core/services/team.service';
import { MunicipiosService } from '../../../core/services/municipios.service';
import { CompetitionService } from '../../../services/competition.service';
import { ToastService } from '../../../shared/services/toast';
import { AgeCategory, Competition } from '../../../core/models';
import { ImageUpload } from '../../../components/shared/image-upload/image-upload';

@Component({
  selector: 'app-team-create',
  imports: [ReactiveFormsModule, RouterLink, ImageUpload],
  templateUrl: './team-create.html',
  styleUrl: './team-create.scss',
})
export class TeamCreate implements OnInit {
  private fb = inject(FormBuilder);
  private teamService = inject(TeamService);
  private municipiosService = inject(MunicipiosService);
  private competitionService = inject(CompetitionService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  // Autocompletado de municipios
  municipioSugerencias = signal<{ municipio: string; provincia: string }[]>([]);
  municipioInput = signal<string>('');
  showSugerencias = signal(false);
  municipioValido = signal(true);

  // Competiciones
  availableCompetitions = signal<Competition[]>([]);
  selectedCompeticionIds = signal<number[]>([]);

  categorias: { valor: AgeCategory; texto: string }[] = [
    { valor: 'SENIOR', texto: 'Senior' },
    { valor: 'JUVENIL', texto: 'Juvenil' },
    { valor: 'CADETE', texto: 'Cadete' },
    { valor: 'INFANTIL', texto: 'Infantil' },
    { valor: 'ALEVIN', texto: 'Alevín' },
    { valor: 'BENJAMIN', texto: 'Benjamín' },
    { valor: 'PREBENJAMIN', texto: 'Prebenjamín' },
  ];

  letras: { valor: string; texto: string }[] = [
    { valor: '', texto: 'A (principal)' },
    { valor: 'B', texto: 'B' },
    { valor: 'C', texto: 'C' },
    { valor: 'D', texto: 'D' },
    { valor: 'E', texto: 'E' },
  ];

  form: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    nombreCompleto: [''],
    categoria: ['SENIOR', Validators.required],
    letra: [''],
    pais: ['España'],
    ciudad: [''],
    estadio: [''],
    fundacion: [null],
    logoUrl: [''],
    descripcion: [''],
    activo: [true],
    competicionIds: [[]],
  });

  cargando = false;

  ngOnInit(): void {
    this.loadCompetitions();
  }

  private loadCompetitions(): void {
    this.competitionService.obtenerTodas().subscribe({
      next: (competitions) => {
        this.availableCompetitions.set(competitions);
      },
    });
  }

  // Obtener competiciones filtradas por la categoría seleccionada
  getFilteredCompetitions(): Competition[] {
    const categoria = this.form.get('categoria')?.value;
    if (!categoria) return [];
    return this.availableCompetitions().filter(c => c.categoria === categoria);
  }

  // Verificar si ya hay una liga seleccionada
  private hasLeagueSelected(): boolean {
    const currentIds = this.selectedCompeticionIds();
    return this.availableCompetitions().some(
      c => currentIds.includes(c.id) && c.tipo === 'LIGA'
    );
  }

  // Verificar si una competición está deshabilitada
  isCompetitionDisabled(competition: Competition): boolean {
    if (competition.tipo !== 'LIGA') return false;
    const currentIds = this.selectedCompeticionIds();
    if (currentIds.includes(competition.id)) return false;
    return this.hasLeagueSelected();
  }

  toggleCompetition(competition: Competition): void {
    if (this.isCompetitionDisabled(competition)) return;

    const currentIds = this.selectedCompeticionIds();
    const index = currentIds.indexOf(competition.id);
    if (index > -1) {
      this.selectedCompeticionIds.set(currentIds.filter(id => id !== competition.id));
    } else {
      this.selectedCompeticionIds.set([...currentIds, competition.id]);
    }
    this.form.patchValue({ competicionIds: this.selectedCompeticionIds() });
  }

  isCompetitionSelected(competitionId: number): boolean {
    return this.selectedCompeticionIds().includes(competitionId);
  }

  getCategoriaTexto(categoria: AgeCategory): string {
    const map: Record<AgeCategory, string> = {
      SENIOR: 'Senior',
      JUVENIL: 'Juvenil',
      CADETE: 'Cadete',
      INFANTIL: 'Infantil',
      ALEVIN: 'Alevín',
      BENJAMIN: 'Benjamín',
      PREBENJAMIN: 'Prebenjamín',
    };
    return map[categoria] || categoria;
  }

  // Métodos para autocompletado de municipios
  onMunicipioInputChange(valor: string): void {
    this.municipioInput.set(valor);
    this.municipioValido.set(false);
    this.form.patchValue({ ciudad: '' });

    if (valor.length >= 2) {
      this.municipiosService.buscarMunicipios(valor).subscribe({
        next: (sugerencias) => {
          this.municipioSugerencias.set(sugerencias);
          this.showSugerencias.set(sugerencias.length > 0);
        },
      });
    } else {
      this.municipioSugerencias.set([]);
      this.showSugerencias.set(false);
    }
  }

  seleccionarMunicipio(sugerencia: { municipio: string; provincia: string }): void {
    this.municipioInput.set(sugerencia.municipio);
    this.form.patchValue({ ciudad: sugerencia.municipio });
    this.municipioValido.set(true);
    this.showSugerencias.set(false);
    this.municipioSugerencias.set([]);
  }

  ocultarSugerencias(): void {
    setTimeout(() => {
      this.showSugerencias.set(false);
    }, 200);
  }

  mostrarSugerencias(): void {
    if (this.municipioSugerencias().length > 0) {
      this.showSugerencias.set(true);
    }
  }

  onImageUploaded(url: string): void {
    this.form.patchValue({ logoUrl: url });
  }

  onImageRemoved(): void {
    this.form.patchValue({ logoUrl: '' });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.error('Por favor, completa los campos requeridos');
      return;
    }

    this.cargando = true;

    this.teamService.create(this.form.value).subscribe({
      next: (team) => {
        this.toastService.success('Equipo creado correctamente');
        this.router.navigate(['/equipos', team.id]);
      },
      error: (err) => {
        this.cargando = false;
        this.toastService.error(err.error?.message || 'Error al crear el equipo');
      },
    });
  }
}
