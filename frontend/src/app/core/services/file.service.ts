import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UploadResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class FileService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/files';

  /**
   * Subir un archivo usando FormData
   * No usa ApiService porque necesita enviar multipart/form-data
   */
  upload(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    // No establecer Content-Type, el navegador lo genera automáticamente
    return this.http.post<UploadResponse>(`${this.baseUrl}/upload`, formData);
  }

  /**
   * Obtener URL completa de un archivo
   */
  getFileUrl(fileName: string): string {
    return `${this.baseUrl}/${fileName}`;
  }

  /**
   * Eliminar un archivo
   */
  delete(fileName: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${fileName}`);
  }

  /**
   * Subir imagen con preview
   * Retorna tanto el resultado de upload como un preview local
   */
  uploadWithPreview(file: File): { preview: string; upload$: Observable<UploadResponse> } {
    const preview = URL.createObjectURL(file);
    const upload$ = this.upload(file);
    return { preview, upload$ };
  }
}
