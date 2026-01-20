import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ValidationService } from './validation';

describe('ValidationService', () => {
  let service: ValidationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        ValidationService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ValidationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('checkEmailUnique', () => {
    it('should return true for empty email', () => {
      service.checkEmailUnique('').subscribe(result => {
        expect(result).toBe(true);
      });

      // No HTTP request should be made
      httpMock.expectNone('/api/auth/check-email');
    });

    it('should return true when email does not exist', () => {
      service.checkEmailUnique('new@example.com').subscribe(result => {
        expect(result).toBe(true);
      });

      const req = httpMock.expectOne(r => r.url.includes('/api/auth/check-email'));
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('email')).toBe('new@example.com');
      req.flush(false); // false = email doesn't exist = available
    });

    it('should return false when email already exists', () => {
      service.checkEmailUnique('existing@example.com').subscribe(result => {
        expect(result).toBe(false);
      });

      const req = httpMock.expectOne(r => r.url.includes('/api/auth/check-email'));
      req.flush(true); // true = email exists = not available
    });

    it('should return true on HTTP error (graceful degradation)', () => {
      service.checkEmailUnique('test@example.com').subscribe(result => {
        expect(result).toBe(true);
      });

      const req = httpMock.expectOne(r => r.url.includes('/api/auth/check-email'));
      req.error(new ProgressEvent('error'));
    });
  });

  describe('checkUsernameAvailable', () => {
    it('should return true for empty username', () => {
      service.checkUsernameAvailable('').subscribe(result => {
        expect(result).toBe(true);
      });
    });

    it('should return true for username shorter than 3 characters', () => {
      service.checkUsernameAvailable('ab').subscribe(result => {
        expect(result).toBe(true);
      });
    });

    it('should return false for reserved usernames', () => {
      service.checkUsernameAvailable('admin').subscribe(result => {
        expect(result).toBe(false);
      });
    });

    it('should return false for reserved usernames (case insensitive)', () => {
      service.checkUsernameAvailable('ADMIN').subscribe(result => {
        expect(result).toBe(false);
      });

      service.checkUsernameAvailable('Root').subscribe(result => {
        expect(result).toBe(false);
      });
    });

    it('should return true for available username', () => {
      service.checkUsernameAvailable('validuser').subscribe(result => {
        expect(result).toBe(true);
      });
    });

    it('should check all reserved usernames', () => {
      const reserved = ['admin', 'root', 'user', 'test'];

      reserved.forEach(username => {
        service.checkUsernameAvailable(username).subscribe(result => {
          expect(result).toBe(false);
        });
      });
    });
  });
});
