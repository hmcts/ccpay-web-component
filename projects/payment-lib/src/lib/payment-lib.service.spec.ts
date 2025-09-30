import { TestBed } from '@angular/core/testing';
import { PaymentLibService } from './payment-lib.service';

describe('PaymentLibService', () => {
  let service: PaymentLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [PaymentLibService] });
    service = TestBed.inject(PaymentLibService);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
});
