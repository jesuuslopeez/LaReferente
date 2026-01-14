import { Component, inject, signal, HostListener } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Competition, UpdateCompetitionDto, CompetitionType, AgeCategory } from '../../core/models';
import { CompetitionService } from '../../services/competition.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-competition-detail',
  imports: [RouterLink, RouterOutlet, FormsModule],
  templateUrl: './competition-detail.html',
  styleUrl: './competition-detail.scss',
})
export class CompetitionDetail {
  private competitionService = inject(CompetitionService);
  authService = inject(AuthService);

  competicion: Competition;

  // Estado del modal de edición
  showEditModal = signal(false);
  closingModal = signal(false);
  saving = signal(false);
  saveError = signal<string | null>(null);

  // Datos del formulario de edición
  editForm = signal<UpdateCompetitionDto>({});

  // Opciones para selects
  tipos: { value: CompetitionType; label: string }[] = [
    { value: 'LIGA', label: 'Liga' },
    { value: 'COPA', label: 'Copa' },
  ];

  categorias: { value: AgeCategory; label: string }[] = [
    { value: 'SENIOR', label: 'Senior' },
    { value: 'JUVENIL', label: 'Juvenil' },
    { value: 'CADETE', label: 'Cadete' },
    { value: 'INFANTIL', label: 'Infantil' },
    { value: 'ALEVIN', label: 'Alevín' },
    { value: 'BENJAMIN', label: 'Benjamín' },
    { value: 'PREBENJAMIN', label: 'Prebenjamín' },
  ];

  paises: string[] = [
    'España', 'Francia', 'Alemania', 'Italia', 'Portugal', 'Inglaterra',
    'Brasil', 'Argentina', 'Países Bajos', 'Bélgica'
  ];

  constructor(private route: ActivatedRoute) {
    this.competicion = this.route.snapshot.data['competicion'];
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.showEditModal() && !this.closingModal()) {
      this.closeEditModal();
    }
  }

  openEditModal(): void {
    const c = this.competicion;
    if (!c) return;

    this.editForm.set({
      nombre: c.nombre,
      nombreCompleto: c.nombreCompleto ?? undefined,
      pais: c.pais ?? undefined,
      tipo: c.tipo,
      categoria: c.categoria,
      numEquipos: c.numEquipos ?? undefined,
      temporada: c.temporada,
      descripcion: c.descripcion ?? undefined,
      fechaInicio: c.fechaInicio ?? undefined,
      fechaFin: c.fechaFin ?? undefined,
      activa: c.activa,
      logoUrl: c.logoUrl ?? undefined,
    });
    this.saveError.set(null);
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.closingModal.set(true);
    setTimeout(() => {
      this.showEditModal.set(false);
      this.closingModal.set(false);
    }, 300);
  }

  updateFormField(field: keyof UpdateCompetitionDto, value: any): void {
    this.editForm.update(form => ({ ...form, [field]: value }));
  }

  saveCompetition(): void {
    const c = this.competicion;
    if (!c) return;

    this.saving.set(true);
    this.saveError.set(null);

    this.competitionService.update(c.id, this.editForm()).subscribe({
      next: (updatedCompetition) => {
        this.competicion = updatedCompetition;
        this.saving.set(false);
        this.showEditModal.set(false);
        this.closingModal.set(false);
      },
      error: () => {
        this.saveError.set('Error al guardar los cambios');
        this.saving.set(false);
      },
    });
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

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}
