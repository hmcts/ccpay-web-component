import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PaymentLibService } from '../../payment-lib.service';
import { ErrorHandlerService } from '../shared/error-handler.service';
import { LoggerService } from '../shared/logger/logger.service';
import { StatusHistoryService } from './status-history.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('StatusHistoryService', () => {
  let service: StatusHistoryService;

  beforeEach(() => {
    const paymentLibServiceStub = () => ({ API_ROOT: {} });
    const errorHandlerServiceStub = () => ({ handleError: {} });
    const loggerServiceStub = () => ({
      info: (string, paymentReference) => ({})
    });
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        StatusHistoryService,
        { provide: PaymentLibService, useFactory: paymentLibServiceStub },
        { provide: ErrorHandlerService, useFactory: errorHandlerServiceStub },
        { provide: LoggerService, useFactory: loggerServiceStub },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    service = TestBed.inject(StatusHistoryService);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
});
