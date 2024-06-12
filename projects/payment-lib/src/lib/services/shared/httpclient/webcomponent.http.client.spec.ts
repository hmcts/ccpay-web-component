import { TestBed, inject } from '@angular/core/testing';

import { WebComponentHttpClient } from './webcomponent.http.client';
import { HttpClient} from "@angular/common/http";

describe('PaymentService', () => {

  const httpClientMock = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WebComponentHttpClient,
        {
          provide: HttpClient, useValue: httpClientMock
        }
      ]
    });
  });

  it('should be created', inject([WebComponentHttpClient], (service: WebComponentHttpClient) => {
    expect(service).toBeTruthy();
  }));
});
