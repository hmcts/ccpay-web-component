import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ErrorHandlerService } from '../shared/error-handler.service';
import { WebComponentHttpClient } from '../shared/httpclient/webcomponent.http.client';
import { PaymentLibService } from '../../payment-lib.service';
import { AllocatePaymentRequest } from '../../interfaces/AllocatePaymentRequest';
import { IPaymentGroup } from '../../interfaces/IPaymentGroup';
import { BulkScaningPaymentService } from './bulk-scaning-payment.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('BulkScaningPaymentService', () => {
  let service: BulkScaningPaymentService;

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
        BulkScaningPaymentService,
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
    service = TestBed.inject(BulkScaningPaymentService);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  describe('postBSWoPGStrategic', () => {
    it('makes expected calls', () => {
      const webComponentHttpClientStub: WebComponentHttpClient = TestBed.inject(
        WebComponentHttpClient
      );
      const allocatePaymentRequestStub: AllocatePaymentRequest = <any>{};
      spyOn(webComponentHttpClientStub, 'post').and.callThrough();
      service.postBSWoPGStrategic(allocatePaymentRequestStub);
      expect(webComponentHttpClientStub.post).toHaveBeenCalled();
    });
  });
});
