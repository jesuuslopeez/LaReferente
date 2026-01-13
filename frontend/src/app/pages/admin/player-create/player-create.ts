import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PlayerService } from '../../../core/services/player.service';
import { ToastService } from '../../../shared/services/toast';
import { PlayerPosition, AgeCategory } from '../../../core/models';
import { ImageUpload } from '../../../components/shared/image-upload/image-upload';
import { TeamSearch } from '../../../components/shared/team-search/team-search';

@Component({
  selector: 'app-player-create',
  imports: [ReactiveFormsModule, RouterLink, ImageUpload, TeamSearch],
  templateUrl: './player-create.html',
  styleUrl: './player-create.scss',
})
export class PlayerCreate {
  private fb = inject(FormBuilder);
  private playerService = inject(PlayerService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  posiciones: { valor: PlayerPosition; texto: string }[] = [
    { valor: 'PORTERO', texto: 'Portero' },
    { valor: 'DEFENSA', texto: 'Defensa' },
    { valor: 'CENTROCAMPISTA', texto: 'Centrocampista' },
    { valor: 'DELANTERO', texto: 'Delantero' },
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
    apellidos: ['', [Validators.required, Validators.minLength(2)]],
    fechaNacimiento: ['', Validators.required],
    nacionalidad: ['España', Validators.required],
    posicion: ['CENTROCAMPISTA', Validators.required],
    categoria: ['SENIOR', Validators.required],
    dorsal: [null],
    altura: [null],
    peso: [null],
    fotoUrl: [''],
    biografia: [''],
    equipoId: [null],
    activo: [true],
  });

  cargando = false;

  get categoriaActual(): AgeCategory {
    return this.form.get('categoria')?.value || 'SENIOR';
  }

  onImageUploaded(url: string): void {
    this.form.patchValue({ fotoUrl: url });
  }

  onImageRemoved(): void {
    this.form.patchValue({ fotoUrl: '' });
  }

  onTeamSelected(team: { id: number; nombre: string } | null): void {
    this.form.patchValue({ equipoId: team?.id || null });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.error('Por favor, completa los campos requeridos');
      return;
    }

    this.cargando = true;

    const data = { ...this.form.value };
    if (!data.equipoId) {
      delete data.equipoId;
    }

    this.playerService.create(data).subscribe({
      next: (player) => {
        this.toastService.success('Jugador creado correctamente');
        this.router.navigate(['/jugadores', player.id]);
      },
      error: (err) => {
        this.cargando = false;
        this.toastService.error(err.error?.message || 'Error al crear el jugador');
      },
    });
  }
}
