import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { LoadingService } from './loading';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        LoadingService
      ]
    });

    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with isLoading$ as false', (done) => {
    service.isLoading$.subscribe(loading => {
      expect(loading).toBe(false);
      done();
    });
  });

  it('should start with message$ as null', (done) => {
    service.message$.subscribe(message => {
      expect(message).toBeNull();
      done();
    });
  });

  describe('show', () => {
    it('should set isLoading$ to true when show is called', (done) => {
      service.show();

      service.isLoading$.subscribe(loading => {
        expect(loading).toBe(true);
        done();
      });
    });

    it('should set message when provided', (done) => {
      service.show('Loading data...');

      service.message$.subscribe(message => {
        if (message) {
          expect(message).toBe('Loading data...');
          done();
        }
      });
    });
  });

  describe('hide', () => {
    it('should set isLoading$ to false when hide is called after show', (done) => {
      service.show();
      service.hide();

      service.isLoading$.subscribe(loading => {
        expect(loading).toBe(false);
        done();
      });
    });

    it('should clear message when hide is called', (done) => {
      service.show('Loading...');
      service.hide();

      service.message$.subscribe(message => {
        expect(message).toBeNull();
        done();
      });
    });
  });

  describe('concurrent requests', () => {
    it('should stay loading when multiple shows are called', () => {
      service.show();
      service.show();
      service.hide();

      let isLoading = false;
      service.isLoading$.subscribe(loading => {
        isLoading = loading;
      });

      expect(isLoading).toBe(true);
    });

    it('should stop loading only when all shows are hidden', () => {
      service.show();
      service.show();
      service.show();
      service.hide();
      service.hide();
      service.hide();

      let isLoading = true;
      service.isLoading$.subscribe(loading => {
        isLoading = loading;
      });

      expect(isLoading).toBe(false);
    });

    it('should not go below zero when hide is called more than show', () => {
      service.show();
      service.hide();
      service.hide();
      service.hide();

      let isLoading = true;
      service.isLoading$.subscribe(loading => {
        isLoading = loading;
      });

      expect(isLoading).toBe(false);
    });

    it('should keep the last message when multiple shows have messages', () => {
      service.show('First');
      service.show('Second');

      let receivedMessage = '';
      service.message$.subscribe(message => {
        if (message) receivedMessage = message;
      });

      expect(receivedMessage).toBe('Second');
    });
  });
});
