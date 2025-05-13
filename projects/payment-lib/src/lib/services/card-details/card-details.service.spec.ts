import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PaymentLibService } from '../../payment-lib.service';
import { ErrorHandlerService } from '../shared/error-handler.service';
import { LoggerService } from '../shared/logger/logger.service';
import { CardDetailsService } from './card-details.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('CardDetailsService', () => {
  let service: CardDetailsService;

  beforeEach(() => {
    const paymentLibServiceStub = () => ({ API_ROOT: {} });
    const errorHandlerServiceStub = () => ({ handleError: {} });
    const loggerServiceStub = () => ({
      info: (string, paymentReference) => ({})
    });
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        CardDetailsService,
        { provide: PaymentLibService, useFactory: paymentLibServiceStub },
        { provide: ErrorHandlerService, useFactory: errorHandlerServiceStub },
        { provide: LoggerService, useFactory: loggerServiceStub },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    service = TestBed.get(CardDetailsService);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
});
