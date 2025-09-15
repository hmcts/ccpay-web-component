import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PaymentLibService } from '../../payment-lib.service';
import { WebComponentHttpClient } from '../shared/httpclient/webcomponent.http.client';
import { ErrorHandlerService } from '../shared/error-handler.service';
import { LoggerService } from '../shared/logger/logger.service';
import { AddRemissionRequest } from '../../interfaces/AddRemissionRequest';
import { PaymentToPayhubRequest } from '../../interfaces/PaymentToPayhubRequest';
import { PayhubAntennaRequest } from '../../interfaces/PayhubAntennaRequest';
import { UnidentifiedPaymentsRequest } from '../../interfaces/UnidentifiedPaymentsRequest';
import { UnsolicitedPaymentsRequest } from '../../interfaces/UnsolicitedPaymentsRequest';
import { AllocatePaymentRequest } from '../../interfaces/AllocatePaymentRequest';
import { IAllocationPaymentsRequest } from '../../interfaces/IAllocationPaymentsRequest';
import { AddRetroRemissionRequest } from '../../interfaces/AddRetroRemissionRequest';
import { PostRefundRetroRemission } from '../../interfaces/PostRefundRetroRemission';
import { PostIssueRefundRetroRemission } from '../../interfaces/PostIssueRefundRetroRemission';
import { PaymentViewService } from './payment-view.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PaymentViewService', () => {
  let service: PaymentViewService;

  beforeEach(() => {
    const paymentLibServiceStub = () => ({ API_ROOT: {} });
    const webComponentHttpClientStub = () => ({
      post: (arg, body) => ({ pipe: () => ({}) }),
      delete: arg => ({ pipe: () => ({}) }),
      get: (url, object) => ({ pipe: () => ({}) })
    });
    const errorHandlerServiceStub = () => ({ handleError: {} });
    const loggerServiceStub = () => ({
      info: (string, paymentReference) => ({})
    });
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        PaymentViewService,
        { provide: PaymentLibService, useFactory: paymentLibServiceStub },
        {
            provide: WebComponentHttpClient,
            useFactory: webComponentHttpClientStub
        },
        { provide: ErrorHandlerService, useFactory: errorHandlerServiceStub },
        { provide: LoggerService, useFactory: loggerServiceStub },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    service = TestBed.inject(PaymentViewService);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  describe('postBSPayments', () => {
    it('makes expected calls', () => {
      const webComponentHttpClientStub: WebComponentHttpClient = TestBed.inject(
        WebComponentHttpClient
      );
      const allocatePaymentRequestStub: AllocatePaymentRequest = <any>{};
      spyOn(webComponentHttpClientStub, 'post').and.callThrough();
      service.postBSPayments(allocatePaymentRequestStub);
      expect(webComponentHttpClientStub.post).toHaveBeenCalled();
    });
  });

  describe('postBSUnidentifiedPayments', () => {
    it('makes expected calls', () => {
      const webComponentHttpClientStub: WebComponentHttpClient = TestBed.inject(
        WebComponentHttpClient
      );
      const unidentifiedPaymentsRequestStub: UnidentifiedPaymentsRequest = <
        any
      >{};
      spyOn(webComponentHttpClientStub, 'post').and.callThrough();
      service.postBSUnidentifiedPayments(unidentifiedPaymentsRequestStub);
      expect(webComponentHttpClientStub.post).toHaveBeenCalled();
    });
  });

  describe('postBSUnsolicitedPayments', () => {
    it('makes expected calls', () => {
      const webComponentHttpClientStub: WebComponentHttpClient = TestBed.inject(
        WebComponentHttpClient
      );
      const unsolicitedPaymentsRequestStub: UnsolicitedPaymentsRequest = <
        any
      >{};
      spyOn(webComponentHttpClientStub, 'post').and.callThrough();
      service.postBSUnsolicitedPayments(unsolicitedPaymentsRequestStub);
      expect(webComponentHttpClientStub.post).toHaveBeenCalled();
    });
  });

  describe('postBSAllocationPayments', () => {
    it('makes expected calls', () => {
      const webComponentHttpClientStub: WebComponentHttpClient = TestBed.inject(
        WebComponentHttpClient
      );
      const iAllocationPaymentsRequestStub: IAllocationPaymentsRequest = <
        any
      >{};
      spyOn(webComponentHttpClientStub, 'post').and.callThrough();
      service.postBSAllocationPayments(iAllocationPaymentsRequestStub);
      expect(webComponentHttpClientStub.post).toHaveBeenCalled();
    });
  });

  describe('postRefundsReason', () => {
    it('makes expected calls', () => {
      const webComponentHttpClientStub: WebComponentHttpClient = TestBed.inject(
        WebComponentHttpClient
      );
      const postRefundRetroRemissionStub: PostRefundRetroRemission = <any>{};
      spyOn(webComponentHttpClientStub, 'post').and.callThrough();
      service.postRefundsReason(postRefundRetroRemissionStub);
      expect(webComponentHttpClientStub.post).toHaveBeenCalled();
    });
  });

  describe('postRefundRetroRemission', () => {
    it('makes expected calls', () => {
      const webComponentHttpClientStub: WebComponentHttpClient = TestBed.inject(
        WebComponentHttpClient
      );
      const postIssueRefundRetroRemissionStub: PostIssueRefundRetroRemission = <
        any
      >{};
      spyOn(webComponentHttpClientStub, 'post').and.callThrough();
      service.postRefundRetroRemission(postIssueRefundRetroRemissionStub);
      expect(webComponentHttpClientStub.post).toHaveBeenCalled();
    });
  });

  describe('getBSfeature', () => {
    it('makes expected calls', () => {
      const webComponentHttpClientStub: WebComponentHttpClient = TestBed.inject(
        WebComponentHttpClient
      );
      spyOn(webComponentHttpClientStub, 'get').and.callThrough();
      service.getBSfeature();
      expect(webComponentHttpClientStub.get).toHaveBeenCalled();
    });
  });

  describe('getSiteID', () => {
    it('makes expected calls', () => {
      const webComponentHttpClientStub: WebComponentHttpClient = TestBed.inject(
        WebComponentHttpClient
      );
      spyOn(webComponentHttpClientStub, 'get').and.callThrough();
      service.getSiteID();
      expect(webComponentHttpClientStub.get).toHaveBeenCalled();
    });
  });
});
