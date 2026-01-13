import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.scss',
})
export class ImageUpload {
  private http = inject(HttpClient);

  @Input() label = 'Imagen';
  @Input() currentImageUrl: string | null = null;
  @Output() imageUploaded = new EventEmitter<string>();
  @Output() imageRemoved = new EventEmitter<void>();

  isDragging = signal(false);
  isUploading = signal(false);
  previewUrl = signal<string | null>(null);
  error = signal<string | null>(null);

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File): void {
    this.error.set(null);

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      this.error.set('Solo se permiten archivos de imagen');
      return;
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.error.set('La imagen no puede superar los 5MB');
      return;
    }

    // Mostrar preview local
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Subir archivo
    this.uploadFile(file);
  }

  private uploadFile(file: File): void {
    this.isUploading.set(true);

    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ fileName: string; fileUrl: string }>('http://localhost:8080/api/files/upload', formData).subscribe({
      next: (response) => {
        this.isUploading.set(false);
        this.imageUploaded.emit(response.fileUrl);
      },
      error: (err) => {
        this.isUploading.set(false);
        this.error.set(err.error?.message || 'Error al subir la imagen');
        this.previewUrl.set(null);
      },
    });
  }

  removeImage(): void {
    this.previewUrl.set(null);
    this.imageRemoved.emit();
  }

  get displayUrl(): string | null {
    return this.previewUrl() || this.currentImageUrl;
  }
}
