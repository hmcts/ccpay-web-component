import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ErrorHandlerService } from '../shared/error-handler.service';
import { WebComponentHttpClient } from '../shared/httpclient/webcomponent.http.client';
import { PaymentLibService } from '../../payment-lib.service';
import { NotificationService } from './notification.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('BulkScaningPaymentService', () => {
  let service: NotificationService;

  beforeEach(() => {
    const errorHandlerServiceStub = () => ({ handleError: {} });
    const webComponentHttpClientStub = () => ({
      post: (arg, body) => ({ pipe: () => ({}) }),
      patch: (arg, status) => ({ pipe: () => ({}) }),
      get: (arg, object) => ({ pipe: () => ({}) })
    });
    const paymentLibServiceStub = () => ({
      BULKSCAN_API_ROOT: {},
      API_ROOT: {}
    });
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        NotificationService,
        { provide: ErrorHandlerService, useFactory: errorHandlerServiceStub },
        {
            provide: WebComponentHttpClient,
            useFactory: webComponentHttpClientStub
        },
        { provide: PaymentLibService, useFactory: paymentLibServiceStub },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    service = TestBed.inject(NotificationService);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

});
