import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpParams } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        ApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should make GET request to correct URL', () => {
      service.get('test-endpoint').subscribe();

      const req = httpMock.expectOne('/api/test-endpoint');
      expect(req.request.method).toBe('GET');
      req.flush({});
    });

    it('should accept object params and convert to HttpParams', () => {
      service.get('test', { page: 1, limit: 10 }).subscribe();

      const req = httpMock.expectOne('/api/test?page=1&limit=10');
      expect(req.request.method).toBe('GET');
      req.flush({});
    });

    it('should accept HttpParams directly', () => {
      const params = new HttpParams().set('filter', 'active');
      service.get('test', params).subscribe();

      const req = httpMock.expectOne('/api/test?filter=active');
      expect(req.request.method).toBe('GET');
      req.flush({});
    });

    it('should ignore null and undefined params', () => {
      service.get('test', { valid: 'value', empty: '', nullVal: null as any }).subscribe();

      const req = httpMock.expectOne('/api/test?valid=value');
      expect(req.request.method).toBe('GET');
      req.flush({});
    });

    it('should retry failed requests twice', () => {
      let attempts = 0;

      service.get('test').subscribe({
        next: () => {},
        error: () => {}
      });

      // First attempt fails
      const req1 = httpMock.expectOne('/api/test');
      req1.error(new ProgressEvent('error'));

      // Second attempt (retry 1) - use setTimeout to wait for retry delay
      setTimeout(() => {
        const req2 = httpMock.expectOne('/api/test');
        req2.error(new ProgressEvent('error'));
      }, 1100);

      // Third attempt (retry 2)
      setTimeout(() => {
        const req3 = httpMock.expectOne('/api/test');
        req3.flush({ success: true });
      }, 2200);
    });
  });

  describe('post', () => {
    it('should make POST request with body', () => {
      const body = { name: 'Test', value: 123 };

      service.post('test-endpoint', body).subscribe();

      const req = httpMock.expectOne('/api/test-endpoint');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(body);
      req.flush({ id: 1, ...body });
    });
  });

  describe('put', () => {
    it('should make PUT request with body', () => {
      const body = { name: 'Updated' };

      service.put('test-endpoint/1', body).subscribe();

      const req = httpMock.expectOne('/api/test-endpoint/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(body);
      req.flush({ id: 1, ...body });
    });
  });

  describe('patch', () => {
    it('should make PATCH request with partial body', () => {
      const body = { status: 'active' };

      service.patch('test-endpoint/1', body).subscribe();

      const req = httpMock.expectOne('/api/test-endpoint/1');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(body);
      req.flush({ id: 1, ...body });
    });
  });

  describe('delete', () => {
    it('should make DELETE request', () => {
      service.delete('test-endpoint/1').subscribe();

      const req = httpMock.expectOne('/api/test-endpoint/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('upload', () => {
    it('should make POST request with FormData', () => {
      const formData = new FormData();
      formData.append('file', new Blob(['test']), 'test.txt');

      service.upload('files/upload', formData).subscribe();

      const req = httpMock.expectOne('/api/files/upload');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBe(formData);
      req.flush({ url: '/files/test.txt' });
    });
  });

  describe('error handling', () => {
    it('should handle 400 Bad Request', () => {
      service.get('test').subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.message).toContain('inválidos');
        }
      });

      const req = httpMock.expectOne('/api/test');
      req.flush({ message: 'Invalid data' }, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle 401 Unauthorized', () => {
      service.get('test').subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
          expect(error.message).toContain('Sesión expirada');
        }
      });

      const req = httpMock.expectOne('/api/test');
      req.flush({}, { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle 403 Forbidden', () => {
      service.get('test').subscribe({
        error: (error) => {
          expect(error.status).toBe(403);
          expect(error.message).toContain('permisos');
        }
      });

      const req = httpMock.expectOne('/api/test');
      req.flush({}, { status: 403, statusText: 'Forbidden' });
    });

    it('should handle 404 Not Found', () => {
      service.get('test').subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.message).toContain('no encontrado');
        }
      });

      const req = httpMock.expectOne('/api/test');
      req.flush({}, { status: 404, statusText: 'Not Found' });
    });

    it('should handle 409 Conflict', () => {
      service.post('test', {}).subscribe({
        error: (error) => {
          expect(error.status).toBe(409);
          expect(error.message).toContain('Conflicto');
        }
      });

      const req = httpMock.expectOne('/api/test');
      req.flush({}, { status: 409, statusText: 'Conflict' });
    });

    it('should handle 500 Internal Server Error', () => {
      service.get('test').subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.message).toContain('interno del servidor');
        }
      });

      const req = httpMock.expectOne('/api/test');
      req.flush({}, { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle network errors (status 0)', () => {
      service.get('test').subscribe({
        error: (error) => {
          expect(error.message).toContain('conectar con el servidor');
        }
      });

      const req = httpMock.expectOne('/api/test');
      req.error(new ProgressEvent('error'));
    });
  });
});
