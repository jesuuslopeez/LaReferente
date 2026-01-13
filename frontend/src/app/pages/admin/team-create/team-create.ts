import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TeamService } from '../../../core/services/team.service';
import { ToastService } from '../../../shared/services/toast';
import { AgeCategory } from '../../../core/models';
import { ImageUpload } from '../../../components/shared/image-upload/image-upload';

@Component({
  selector: 'app-team-create',
  imports: [ReactiveFormsModule, RouterLink, ImageUpload],
  templateUrl: './team-create.html',
  styleUrl: './team-create.scss',
})
export class TeamCreate {
  private fb = inject(FormBuilder);
  private teamService = inject(TeamService);
  private toastService = inject(ToastService);
  private router = inject(Router);

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
    pais: ['España', Validators.required],
    ciudad: [''],
    estadio: [''],
    fundacion: [null],
    logoUrl: [''],
    descripcion: [''],
    activo: [true],
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
