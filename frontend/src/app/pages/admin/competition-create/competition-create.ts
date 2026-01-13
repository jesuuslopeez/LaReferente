import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CompetitionService } from '../../../services/competition.service';
import { ToastService } from '../../../shared/services/toast';
import { CompetitionType, AgeCategory } from '../../../core/models';
import { ImageUpload } from '../../../components/shared/image-upload/image-upload';

@Component({
  selector: 'app-competition-create',
  imports: [ReactiveFormsModule, RouterLink, ImageUpload],
  templateUrl: './competition-create.html',
  styleUrl: './competition-create.scss',
})
export class CompetitionCreate {
  private fb = inject(FormBuilder);
  private competitionService = inject(CompetitionService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  tipos: { valor: CompetitionType; texto: string }[] = [
    { valor: 'LIGA', texto: 'Liga' },
    { valor: 'COPA', texto: 'Copa' },
  ];

  categorias: { valor: AgeCategory; texto: string }[] = [
    { valor: 'SENIOR', texto: 'Senior' },
    { valor: 'JUVENIL', texto: 'Juvenil' },
    { valor: 'CADETE', texto: 'Cadete' },
    { valor: 'INFANTIL', texto: 'Infantil' },
    { valor: 'ALEVIN', texto: 'Alevín' },
    { valor: 'BENJAMIN', texto: 'Benjamín' },
    { valor: 'PREBENJAMIN', texto: 'Prebenjamín' },
  ];

  form: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    nombreCompleto: [''],
    pais: ['España'],
    tipo: ['LIGA', Validators.required],
    categoria: ['SENIOR', Validators.required],
    numEquipos: [null],
    temporada: ['2024-2025', Validators.required],
    logoUrl: [''],
    descripcion: [''],
    fechaInicio: [''],
    fechaFin: [''],
    activa: [true],
  });

  cargando = false;

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

    this.competitionService.create(this.form.value).subscribe({
      next: (competition) => {
        this.toastService.success('Competición creada correctamente');
        this.router.navigate(['/competiciones', competition.id]);
      },
      error: (err) => {
        this.cargando = false;
        this.toastService.error(err.error?.message || 'Error al crear la competición');
      },
    });
  }
}
