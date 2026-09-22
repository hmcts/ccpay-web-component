import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PaymentLibService } from './payment-lib.service';
import { PaymentLibComponent } from './payment-lib.component';

describe('PaymentLibComponent', () => {
  let component: PaymentLibComponent;
  let fixture: ComponentFixture<PaymentLibComponent>;

  beforeEach(() => {
    const paymentLibServiceStub = () => ({
      setApiRootUrl: API_ROOT => ({}),
      setBulkScanApiRootUrl: bULKSCAN_API_ROOT => ({}),
      setRefundndsApiRootUrl: rEFUNDS_API_ROOT => ({})
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PaymentLibComponent],
      providers: [
        { provide: PaymentLibService, useFactory: paymentLibServiceStub }
      ]
    });
    fixture = TestBed.createComponent(PaymentLibComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  describe('floating point precision when totalling currency amounts', () => {
    // Naively summing as raw floats yields 2176.6400000000003 instead of 2176.64.
    it('getTotalRemission does not drift when summing hwf_amount', () => {
      component.paymentGroup = <any>{
        remissions: [{ hwf_amount: 1789.64 }, { hwf_amount: 387.00 }]
      };

      const total = component.getTotalRemission();

      expect(total).toBe(2176.64);
    });

    it('getTotalFees does not drift when summing calculated_amount', () => {
      component.paymentGroup = <any>{
        fees: [{ calculated_amount: 1789.64 }, { calculated_amount: 387.00 }]
      };

      const total = component.getTotalFees();

      expect(total).toBe(2176.64);
    });

    it('getTotalPayments does not drift when summing amount', () => {
      component.paymentGroup = <any>{
        payments: [{ amount: 1789.64 }, { amount: 387.00 }]
      };

      const total = component.getTotalPayments();

      expect(total).toBe(2176.64);
    });
  });

  // describe('ngOnInit', () => {
  //   it('makes expected calls', () => {
  //     const paymentLibServiceStub: PaymentLibService = fixture.debugElement.injector.get(
  //       PaymentLibService
  //     );
  //     spyOn(paymentLibServiceStub, 'setApiRootUrl').and.callThrough();
  //     spyOn(paymentLibServiceStub, 'setBulkScanApiRootUrl').and.callThrough();
  //     spyOn(paymentLibServiceStub, 'setRefundndsApiRootUrl').and.callThrough();
  //     component.ngOnInit();
  //     expect(paymentLibServiceStub.setApiRootUrl).toHaveBeenCalled();
  //     expect(paymentLibServiceStub.setBulkScanApiRootUrl).toHaveBeenCalled();
  //     expect(paymentLibServiceStub.setRefundndsApiRootUrl).toHaveBeenCalled();
  //   });
  // });
});
