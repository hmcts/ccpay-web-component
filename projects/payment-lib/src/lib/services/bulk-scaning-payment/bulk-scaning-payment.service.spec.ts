import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ErrorHandlerService } from '../shared/error-handler.service';
import { WebComponentHttpClient } from '../shared/httpclient/webcomponent.http.client';
import { PaymentLibService } from '../../payment-lib.service';
import { AllocatePaymentRequest } from '../../interfaces/AllocatePaymentRequest';
import { IPaymentGroup } from '../../interfaces/IPaymentGroup';
import { BulkScaningPaymentService } from './bulk-scaning-payment.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TelephonyToPayhubRequest } from '../../interfaces/TelephonyToPayhubRequest';

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

  it('rounds outstanding currency amounts to two decimal places', () => {
    const paymentGroup: IPaymentGroup = <any>{
      fees: [{ calculated_amount: 1789.64 }, { calculated_amount: 387.00 }],
      payments: [],
      remissions: []
    };

    expect(service.calculateOutStandingAmount(paymentGroup)).toBe(2176.64);
  });

  it('normalises the calculated amount before sending it to PayHub', () => {
    const javascriptAmount = 1789.64 + 387.00;
    expect(javascriptAmount).not.toBe(2176.64);
    expect(javascriptAmount.toPrecision(17)).toBe('2176.6400000000003');

    const request = new TelephonyToPayhubRequest('case', javascriptAmount, 'case-type', 'kerv');

    expect(JSON.stringify(request)).toContain('"amount":2176.64');
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
