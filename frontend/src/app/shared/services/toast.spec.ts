import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ToastService, ToastMessage } from './toast';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        ToastService
      ]
    });

    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with null toast', (done) => {
    service.toast$.subscribe(toast => {
      expect(toast).toBeNull();
      done();
    });
  });

  describe('show', () => {
    it('should emit a toast with message, type and default duration', (done) => {
      service.show('Test message', 'info');

      service.toast$.subscribe(toast => {
        if (toast) {
          expect(toast.message).toBe('Test message');
          expect(toast.type).toBe('info');
          expect(toast.duration).toBe(5000);
          done();
        }
      });
    });

    it('should emit a toast with custom duration', (done) => {
      service.show('Test message', 'info', 2000);

      service.toast$.subscribe(toast => {
        if (toast) {
          expect(toast.duration).toBe(2000);
          done();
        }
      });
    });
  });

  describe('success', () => {
    it('should emit a success toast with default duration', (done) => {
      service.success('Operation successful');

      service.toast$.subscribe(toast => {
        if (toast) {
          expect(toast.message).toBe('Operation successful');
          expect(toast.type).toBe('success');
          expect(toast.duration).toBe(4000);
          done();
        }
      });
    });
  });

  describe('error', () => {
    it('should emit an error toast with default duration', (done) => {
      service.error('Something went wrong');

      service.toast$.subscribe(toast => {
        if (toast) {
          expect(toast.message).toBe('Something went wrong');
          expect(toast.type).toBe('error');
          expect(toast.duration).toBe(8000);
          done();
        }
      });
    });
  });

  describe('info', () => {
    it('should emit an info toast with default duration', (done) => {
      service.info('Just so you know');

      service.toast$.subscribe(toast => {
        if (toast) {
          expect(toast.message).toBe('Just so you know');
          expect(toast.type).toBe('info');
          expect(toast.duration).toBe(3000);
          done();
        }
      });
    });
  });

  describe('warning', () => {
    it('should emit a warning toast with default duration', (done) => {
      service.warning('Be careful');

      service.toast$.subscribe(toast => {
        if (toast) {
          expect(toast.message).toBe('Be careful');
          expect(toast.type).toBe('warning');
          expect(toast.duration).toBe(6000);
          done();
        }
      });
    });
  });

  describe('broadcasting', () => {
    it('should broadcast toast to multiple subscribers', () => {
      let subscriber1Value: ToastMessage | null = null;
      let subscriber2Value: ToastMessage | null = null;

      service.toast$.subscribe(toast => {
        subscriber1Value = toast;
      });

      service.toast$.subscribe(toast => {
        subscriber2Value = toast;
      });

      service.success('Broadcast message');

      expect((subscriber1Value as ToastMessage | null)?.message).toBe('Broadcast message');
      expect((subscriber2Value as ToastMessage | null)?.message).toBe('Broadcast message');
    });
  });
});
