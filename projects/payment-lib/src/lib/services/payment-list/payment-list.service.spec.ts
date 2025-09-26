import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PaymentLibService } from '../../payment-lib.service';
import { ErrorHandlerService } from '../shared/error-handler.service';
import { LoggerService } from '../shared/logger/logger.service';
import { PaymentListService } from './payment-list.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PaymentListService', () => {
  let service: PaymentListService;

  beforeEach(() => {
    const paymentLibServiceStub = () => ({ API_ROOT: {} });
    const errorHandlerServiceStub = () => ({ handleError: {} });
    const loggerServiceStub = () => ({ info: (string, ccdCaseNumber) => ({}) });
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        PaymentListService,
        { provide: PaymentLibService, useFactory: paymentLibServiceStub },
        { provide: ErrorHandlerService, useFactory: errorHandlerServiceStub },
        { provide: LoggerService, useFactory: loggerServiceStub },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    service = TestBed.inject(PaymentListService);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
});
