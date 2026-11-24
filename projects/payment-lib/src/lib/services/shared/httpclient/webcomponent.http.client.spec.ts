import { TestBed, inject } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';

import { WebComponentHttpClient } from './webcomponent.http.client';

describe('PaymentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WebComponentHttpClient,
        Meta,
        provideHttpClient(withXhr(), withInterceptorsFromDi())
      ]
    });
  });

  it('should be created', inject([WebComponentHttpClient], (service: WebComponentHttpClient) => {
    expect(service).toBeTruthy();
  }));
});
