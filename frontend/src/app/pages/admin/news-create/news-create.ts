import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NewsService } from '../../../core/services';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../shared/services/toast';
import { NewsCategory } from '../../../core/models';

@Component({
  selector: 'app-news-create',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './news-create.html',
  styleUrl: './news-create.scss',
})
export class NewsCreate {
  private fb = inject(FormBuilder);
  private newsService = inject(NewsService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  categorias: { valor: NewsCategory; texto: string }[] = [
    { valor: 'GENERAL', texto: 'General' },
    { valor: 'FICHAJES', texto: 'Fichajes' },
    { valor: 'PARTIDOS', texto: 'Partidos' },
    { valor: 'LESIONES', texto: 'Lesiones' },
    { valor: 'RUEDAS_PRENSA', texto: 'Ruedas de prensa' },
  ];

  form: FormGroup = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(5)]],
    subtitulo: [''],
    contenido: ['', [Validators.required, Validators.minLength(20)]],
    categoria: ['GENERAL', Validators.required],
    imagenPrincipalUrl: [''],
    destacada: [false],
    publicada: [true],
  });

  cargando = false;

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.error('Por favor, completa los campos requeridos');
      return;
    }

    const usuario = this.authService.usuario();
    if (!usuario) {
      this.toastService.error('Debes iniciar sesión');
      return;
    }

    this.cargando = true;

    this.newsService.create({
      ...this.form.value,
      autorId: 1, // TODO: obtener ID real del usuario
    }).subscribe({
      next: () => {
        this.toastService.success('Noticia creada correctamente');
        this.router.navigate(['/noticias']);
      },
      error: (err) => {
        this.cargando = false;
        this.toastService.error(err.error?.message || 'Error al crear la noticia');
      },
    });
  }
}
