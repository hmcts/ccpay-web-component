import { TestBed, inject } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';

import { WebComponentHttpClient } from './webcomponent.http.client';

describe('PaymentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WebComponentHttpClient,
        Meta,
        provideHttpClient(withInterceptorsFromDi())
      ]
    });
  });

  it('should be created', inject([WebComponentHttpClient], (service: WebComponentHttpClient) => {
    expect(service).toBeTruthy();
  }));
});
