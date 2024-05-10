import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PaymentListService } from '../../services/payment-list/payment-list.service';
import { PaymentLibComponent } from '../../payment-lib.component';
import { PaymentListComponent } from './payment-list.component';

describe('PaymentListComponent', () => {
  let component: PaymentListComponent;
  let fixture: ComponentFixture<PaymentListComponent>;

  beforeEach(() => {
    const paymentListServiceStub = () => ({
      getPaymentByCcdCaseNumber: (cCD_CASE_NUMBER, pAYMENT_METHOD) => ({
        subscribe: f => f({})
      })
    });
    const paymentLibComponentStub = () => ({
      CCD_CASE_NUMBER: {},
      PAYMENT_METHOD: {},
      paymentMethod: {},
      paymentGroupReference: {},
      paymentReference: {},
      viewName: {}
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [],
      providers: [
        { provide: PaymentListService, useFactory: paymentListServiceStub },
        { provide: 'PAYMENT_LIB', useFactory: paymentLibComponentStub }
      ]
    });
    fixture = TestBed.createComponent(PaymentListComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const paymentListServiceStub: PaymentListService = fixture.debugElement.injector.get(
        PaymentListService
      );
      spyOn(
        paymentListServiceStub,
        'getPaymentByCcdCaseNumber'
      ).and.callThrough();
      component.ngOnInit();
      expect(
        paymentListServiceStub.getPaymentByCcdCaseNumber
      ).toHaveBeenCalled();
    });
  });
});
