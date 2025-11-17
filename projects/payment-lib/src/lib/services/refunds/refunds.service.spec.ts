import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Meta } from '@angular/platform-browser';
import { ErrorHandlerService } from '../shared/error-handler.service';
import { WebComponentHttpClient } from '../shared/httpclient/webcomponent.http.client';
import { PaymentLibService } from '../../payment-lib.service';
import { IssueRefundRequest } from '../../interfaces/IssueRefundRequest';
import { RefundsService } from './refunds.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('RefundsService', () => {
  let service: RefundsService;

  beforeEach(() => {
    const metaStub = () => ({ getTag: string => ({ content: {} }) });
    const errorHandlerServiceStub = () => ({ handleError: {} });
    const webComponentHttpClientStub = () => ({
      patch: (arg, body) => ({ pipe: () => ({}) }),
      post: (arg, body) => ({ pipe: () => ({}) })
    });
    const paymentLibServiceStub = () => ({ REFUNDS_API_ROOT: {} });
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        RefundsService,
        { provide: Meta, useFactory: metaStub },
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
    service = TestBed.inject(RefundsService);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  describe('postIssueRefund', () => {
    it('makes expected calls', () => {
      const webComponentHttpClientStub: WebComponentHttpClient = TestBed.inject(
        WebComponentHttpClient
      );
      const issueRefundRequestStub: IssueRefundRequest = <any>{};
      spyOn(webComponentHttpClientStub, 'post').and.callThrough();
      service.postIssueRefund(issueRefundRequestStub);
      expect(webComponentHttpClientStub.post).toHaveBeenCalled();
    });
  });

  // describe('getRefundReasons', () => {
  //   it('makes expected calls', () => {
  //     const httpTestingController = TestBed.get(HttpTestingController);
  //     service.getRefundReasons().subscribe(res => {
  //       expect(res).toEqual([]);
  //     });
  //     const req = httpTestingController.expectOne('HTTP_ROUTE_GOES_HERE');
  //     expect(req.request.method).toEqual('GET');
  //     req.flush([]);
  //     httpTestingController.verify();
  //   });
  // });

  // describe('getRefundRejectReasons', () => {
  //   it('makes expected calls', () => {
  //     const httpTestingController = TestBed.get(HttpTestingController);
  //     service.getRefundRejectReasons().subscribe(res => {
  //       expect(res).toEqual([]);
  //     });
  //     const req = httpTestingController.expectOne('HTTP_ROUTE_GOES_HERE');
  //     expect(req.request.method).toEqual('GET');
  //     req.flush();
  //     httpTestingController.verify();
  //   });
  // });

});
