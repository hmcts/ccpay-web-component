import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { PaymentLibComponent } from '../../payment-lib.component';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { BulkScaningPaymentService } from '../../services/bulk-scaning-payment/bulk-scaning-payment.service';
import { MarkUnidentifiedPaymentComponent } from './mark-unidentified-payment.component';

describe('MarkUnidentifiedPaymentComponent', () => {
  let component: MarkUnidentifiedPaymentComponent;
  let fixture: ComponentFixture<MarkUnidentifiedPaymentComponent>;

  beforeEach(() => {
    const formBuilderStub = () => ({ group: object => ({}) });
    const paymentViewServiceStub = () => ({
      postBSPayments: requestBody => ({ subscribe: f => f({}) }),
      postBSUnidentifiedPayments: reqBody => ({ subscribe: f => f({}) })
    });
    const bulkScaningPaymentServiceStub = () => ({
      getBSPaymentsByDCN: bspaymentdcn => ({ subscribe: f => f({}) }),
      removeUnwantedString: (method, string) => ({}),
      postBSWoPGStrategic: postStrategicBody => ({ subscribe: f => f({}) }),
      patchBSChangeStatus: (dcn_reference, string) => ({
        subscribe: f => f({})
      })
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [MarkUnidentifiedPaymentComponent],
      providers: [
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: 'PAYMENT_LIB', useClass: PaymentLibComponent },
        { provide: PaymentViewService, useFactory: paymentViewServiceStub },
        {
          provide: BulkScaningPaymentService,
          useFactory: bulkScaningPaymentServiceStub
        },
        provideHttpClient(withInterceptorsFromDi())
      ]
    });
    fixture = TestBed.createComponent(MarkUnidentifiedPaymentComponent);
    component = fixture.componentInstance;
  });

  // it('can load instance', () => {
  //   expect(component).toBeTruthy();
  // });

  it('isInvesticationDetailEmpty has default value', () => {
    expect(component.isInvesticationDetailEmpty).toEqual(false);
  });

  it('investicationDetailHasError has default value', () => {
    expect(component.investicationDetailHasError).toEqual(false);
  });

  it('investicationDetailMinHasError has default value', () => {
    expect(component.investicationDetailMinHasError).toEqual(false);
  });

  it('investicationDetailMaxHasError has default value', () => {
    expect(component.investicationDetailMaxHasError).toEqual(false);
  });

  it('isConfirmButtondisabled has default value', () => {
    expect(component.isConfirmButtondisabled).toEqual(false);
  });

  it('isStrategicFixEnable has default value', () => {
    expect(component.isStrategicFixEnable).toEqual(true);
  });

  // describe('ngOnInit', () => {
  //   it('makes expected calls', () => {
  //     const formBuilderStub: FormBuilder = fixture.debugElement.injector.get(
  //       FormBuilder
  //     );
  //     spyOn(component, 'getUnassignedPayment').and.callThrough();
  //     spyOn(formBuilderStub, 'group').and.callThrough();
  //     component.ngOnInit();
  //     expect(component.getUnassignedPayment).toHaveBeenCalled();
  //     expect(formBuilderStub.group).toHaveBeenCalled();
  //   });
  // });

  // describe('getUnassignedPayment', () => {
  //   it('makes expected calls', () => {
  //     const bulkScaningPaymentServiceStub: BulkScaningPaymentService = fixture.debugElement.injector.get(
  //       BulkScaningPaymentService
  //     );
  //     spyOn(component, 'getErrorMessage').and.callThrough();
  //     spyOn(
  //       bulkScaningPaymentServiceStub,
  //       'getBSPaymentsByDCN'
  //     ).and.callThrough();
  //     component.getUnassignedPayment();
  //     expect(component.getErrorMessage).toHaveBeenCalled();
  //     expect(
  //       bulkScaningPaymentServiceStub.getBSPaymentsByDCN
  //     ).toHaveBeenCalled();
  //   });
  // });

  // describe('saveAndContinue', () => {
  //   it('makes expected calls', () => {
  //     spyOn(component, 'resetForm').and.callThrough();
  //     component.saveAndContinue();
  //     expect(component.resetForm).toHaveBeenCalled();
  //   });
  // });

  // describe('confirmPayments', () => {
  //   it('makes expected calls', () => {
  //     const paymentViewServiceStub: PaymentViewService = fixture.debugElement.injector.get(
  //       PaymentViewService
  //     );
  //     const bulkScaningPaymentServiceStub: BulkScaningPaymentService = fixture.debugElement.injector.get(
  //       BulkScaningPaymentService
  //     );
  //     spyOn(component, 'getErrorMessage').and.callThrough();
  //     spyOn(component, 'gotoCasetransationPage').and.callThrough();
  //     spyOn(paymentViewServiceStub, 'postBSPayments').and.callThrough();
  //     spyOn(
  //       paymentViewServiceStub,
  //       'postBSUnidentifiedPayments'
  //     ).and.callThrough();
  //     spyOn(
  //       bulkScaningPaymentServiceStub,
  //       'postBSWoPGStrategic'
  //     ).and.callThrough();
  //     spyOn(
  //       bulkScaningPaymentServiceStub,
  //       'patchBSChangeStatus'
  //     ).and.callThrough();
  //     component.confirmPayments();
  //     expect(component.getErrorMessage).toHaveBeenCalled();
  //     expect(component.gotoCasetransationPage).toHaveBeenCalled();
  //     expect(paymentViewServiceStub.postBSPayments).toHaveBeenCalled();
  //     expect(
  //       paymentViewServiceStub.postBSUnidentifiedPayments
  //     ).toHaveBeenCalled();
  //     expect(
  //       bulkScaningPaymentServiceStub.postBSWoPGStrategic
  //     ).toHaveBeenCalled();
  //     expect(
  //       bulkScaningPaymentServiceStub.patchBSChangeStatus
  //     ).toHaveBeenCalled();
  //   });
  // });
});
