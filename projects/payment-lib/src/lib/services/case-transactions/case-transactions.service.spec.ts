import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LoggerService } from '../shared/logger/logger.service';
import { ErrorHandlerService } from '../shared/error-handler.service';
import { PaymentLibService } from '../../payment-lib.service';
import { CaseTransactionsService } from './case-transactions.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('CaseTransactionsService', () => {
  let service: CaseTransactionsService;

  beforeEach(() => {
    const loggerServiceStub = () => ({ info: (string, ccdCaseNumber) => ({}) });
    const errorHandlerServiceStub = () => ({ handleError: {} });
    const paymentLibServiceStub = () => ({ API_ROOT: {} });
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        CaseTransactionsService,
        { provide: LoggerService, useFactory: loggerServiceStub },
        { provide: ErrorHandlerService, useFactory: errorHandlerServiceStub },
        { provide: PaymentLibService, useFactory: paymentLibServiceStub },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    service = TestBed.inject(CaseTransactionsService);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
});
