import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AllocatePaymentsComponent } from './allocate-payments.component';
import { CaseTransactionsService} from "../../services/case-transactions/case-transactions.service";
import { PaymentViewService} from "../../services/payment-view/payment-view.service";
import { BulkScaningPaymentService } from '../../services/bulk-scaning-payment/bulk-scaning-payment.service';
import { ErrorHandlerService } from '../../services/shared/error-handler.service';
import { OrderslistService } from '../../services/orderslist.service';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import { WebComponentHttpClient } from '../../services/shared/httpclient/webcomponent.http.client';
import { PaymentLibComponent } from '../../payment-lib.component';

describe('AllocatePaymentsComponent', () => {
  let component: AllocatePaymentsComponent;
  let fixture: ComponentFixture<AllocatePaymentsComponent>;

  beforeEach(() => {
    const emptyServiceStub = () => ({  });
    const bulkScaningPaymentServiceStub = () => ({
      calculateOutStandingAmount: paymentGroup => ({}),
      postBSPaymentStrategic: (postStrategicBody, payment_group_reference) => ({ subscribe: f => f({}) }),
      patchBSChangeStatus: (dcn_reference, string) => ({ subscribe: f => f({}) }),
      postBSAllocatePayment: (requestBody, payment_group_reference) => ({ subscribe: f => f({}) }),
      getBSPaymentsByDCN: bspaymentdcn => ({ subscribe: f => f({}) })
    });
    const errorHandlerServiceStub = () => ({
      getServerErrorMessage: arg => ({})
    });
    const orderslistServiceStub = () => ({
      getOrdersList: () => ({ subscribe: f => f({}) }),
      getCaseType: () => ({ subscribe: f => f({}) })
    });
    
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [],
      providers: [
        { provide: 'PAYMENT_LIB', useClass: PaymentLibComponent },
        { provide: CaseTransactionsService, useFactory: emptyServiceStub },
        { provide: PaymentViewService, useFactory: emptyServiceStub },
        { provide: BulkScaningPaymentService, useFactory: bulkScaningPaymentServiceStub },
        { provide: ErrorHandlerService, useFactory: errorHandlerServiceStub },
        { provide: OrderslistService, useFactory: orderslistServiceStub },
        provideHttpClient(withInterceptorsFromDi())
      ]
    });
    fixture = TestBed.createComponent(AllocatePaymentsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('AllocatePaymentsComponent', () => {
  let component: AllocatePaymentsComponent;
  let fixture: ComponentFixture<AllocatePaymentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule], // Import HttpClientModule
      // imports : [WebComponentHttpClient],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AllocatePaymentsComponent],
      providers: [
        { provide: CaseTransactionsService, useClass: CaseTransactionsService },
        { provide: PaymentViewService, useClass: PaymentViewService },
        { provide: WebComponentHttpClient, useValue: {} },
        { provide: 'PAYMENT_LIB', useClass: PaymentLibComponent }
      ]
    });
    fixture = TestBed.createComponent(AllocatePaymentsComponent);
    component = fixture.componentInstance;
  });

  it('should emit the correct value via reasonEventEmitter', () => {
    spyOn(component.reasonEventEmitter, 'emit'); // Spy on the emitter
    const testValue = 'testReason';

    component.getReasonValue(testValue); // Call the method

    expect(component.reasonEventEmitter.emit).toHaveBeenCalledWith(testValue); // Assert the emitted value
  });

  it('should emit the correct value via explanationEventEmitter', () => {
    spyOn(component.explanationEventEmitter, 'emit'); // Spy on the emitter
    const testValue = 'testReason';

    component.getExplanationValue(testValue); // Call the method

    expect(component.explanationEventEmitter.emit).toHaveBeenCalledWith(testValue); // Assert the emitted value
  });
});

// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { FormBuilder } from '@angular/forms';
// import { PaymentLibComponent } from '../../payment-lib.component';
// import { PaymentViewService } from '../../services/payment-view/payment-view.service';
// import { CaseTransactionsService } from '../../services/case-transactions/case-transactions.service';
// import { BulkScaningPaymentService } from '../../services/bulk-scaning-payment/bulk-scaning-payment.service';
// import { ErrorHandlerService } from '../../services/shared/error-handler.service';
// import { IPaymentGroup } from '../../interfaces/IPaymentGroup';
// import { OrderslistService } from '../../services/orderslist.service';
// import { FormsModule } from '@angular/forms';
// import { AllocatePaymentsComponent } from './allocate-payments.component';

// describe('AllocatePaymentsComponent', () => {
//   let component: AllocatePaymentsComponent;
//   let fixture: ComponentFixture<AllocatePaymentsComponent>;

//   beforeEach(() => {
//     const formBuilderStub = () => ({ group: object => ({}) });
//     const paymentLibComponentStub = () => ({
//       paymentGroupReference: {},
//       CCD_CASE_NUMBER: {},
//       bspaymentdcn: {},
//       SELECTED_OPTION: {},
//       ISSFENABLE: {},
//       isTurnOff: {},
//       viewName: {},
//       TAKEPAYMENT: {},
//       ISBSENABLE: {}
//     });
//     const paymentViewServiceStub = () => ({
//       getPaymentGroupDetails: paymentRef => ({ subscribe: f => f({}) }),
//       postBSAllocationPayments: reqBody => ({ subscribe: f => f({}) })
//     });
//     const caseTransactionsServiceStub = () => ({
//       getPaymentGroups: ccdCaseNumber => ({ subscribe: f => f({}) })
//     });
//     const bulkScaningPaymentServiceStub = () => ({
//       calculateOutStandingAmount: paymentGroup => ({}),
//       postBSPaymentStrategic: (postStrategicBody, payment_group_reference) => ({
//         subscribe: f => f({})
//       }),
//       patchBSChangeStatus: (dcn_reference, string) => ({
//         subscribe: f => f({})
//       }),
//       postBSAllocatePayment: (requestBody, payment_group_reference) => ({
//         subscribe: f => f({})
//       }),
//       getBSPaymentsByDCN: bspaymentdcn => ({ subscribe: f => f({}) })
//     });
//     const errorHandlerServiceStub = () => ({
//       getServerErrorMessage: arg => ({})
//     });
//     const orderslistServiceStub = () => ({
//       getOrdersList: () => ({ subscribe: f => f({}) }),
//       getCaseType: () => ({ subscribe: f => f({}) })
//     });
//     TestBed.configureTestingModule({
//       imports: [FormsModule],
//       schemas: [NO_ERRORS_SCHEMA],
//       declarations: [AllocatePaymentsComponent],
//       providers: [
//         { provide: FormBuilder, useFactory: formBuilderStub },
//         { provide: PaymentLibComponent, useFactory: paymentLibComponentStub },
//         { provide: PaymentViewService, useFactory: paymentViewServiceStub },
//         {
//           provide: CaseTransactionsService,
//           useFactory: caseTransactionsServiceStub
//         },
//         {
//           provide: BulkScaningPaymentService,
//           useFactory: bulkScaningPaymentServiceStub
//         },
//         { provide: ErrorHandlerService, useFactory: errorHandlerServiceStub },
//         { provide: OrderslistService, useFactory: orderslistServiceStub }
//       ]
//     });
//     fixture = TestBed.createComponent(AllocatePaymentsComponent);
//     component = fixture.componentInstance;
//   });

//   it('can load instance', () => {
//     expect(component).toBeTruthy();
//   });

//   it(`paymentGroups has default value`, () => {
//     expect(component.paymentGroups).toEqual([]);
//   });

//   it(`isMoreDetailsBoxHide has default value`, () => {
//     expect(component.isMoreDetailsBoxHide).toEqual(true);
//   });

//   it(`isConfirmButtondisabled has default value`, () => {
//     expect(component.isConfirmButtondisabled).toEqual(false);
//   });

//   it(`isContinueButtondisabled has default value`, () => {
//     expect(component.isContinueButtondisabled).toEqual(true);
//   });

//   it(`isFeeAmountZero has default value`, () => {
//     expect(component.isFeeAmountZero).toEqual(false);
//   });

//   it(`paymentReasonHasError has default value`, () => {
//     expect(component.paymentReasonHasError).toEqual(false);
//   });

//   it(`paymentExplanationHasError has default value`, () => {
//     expect(component.paymentExplanationHasError).toEqual(false);
//   });

//   it(`isPaymentDetailsEmpty has default value`, () => {
//     expect(component.isPaymentDetailsEmpty).toEqual(false);
//   });

//   it(`isPaymentDetailsInvalid has default value`, () => {
//     expect(component.isPaymentDetailsInvalid).toEqual(false);
//   });

//   it(`paymentDetailsMinHasError has default value`, () => {
//     expect(component.paymentDetailsMinHasError).toEqual(false);
//   });

//   it(`paymentDetailsMaxHasError has default value`, () => {
//     expect(component.paymentDetailsMaxHasError).toEqual(false);
//   });

//   it(`isUserNameEmpty has default value`, () => {
//     expect(component.isUserNameEmpty).toEqual(false);
//   });

//   it(`isUserNameInvalid has default value`, () => {
//     expect(component.isUserNameInvalid).toEqual(false);
//   });

//   it(`isStrategicFixEnable has default value`, () => {
//     expect(component.isStrategicFixEnable).toEqual(true);
//   });

//   it(`orderLevelFees has default value`, () => {
//     expect(component.orderLevelFees).toEqual([]);
//   });

//   describe('getGroupOutstandingAmount', () => {
//     it('makes expected calls', () => {
//       const bulkScaningPaymentServiceStub: BulkScaningPaymentService = fixture.debugElement.injector.get(
//         BulkScaningPaymentService
//       );
//       const iPaymentGroupStub: IPaymentGroup = <any>{};
//       spyOn(
//         bulkScaningPaymentServiceStub,
//         'calculateOutStandingAmount'
//       ).and.callThrough();
//       component.getGroupOutstandingAmount(iPaymentGroupStub);
//       expect(
//         bulkScaningPaymentServiceStub.calculateOutStandingAmount
//       ).toHaveBeenCalled();
//     });
//   });

//   describe('ngOnInit', () => {
//     it('makes expected calls', () => {
//       const formBuilderStub: FormBuilder = fixture.debugElement.injector.get(
//         FormBuilder
//       );
//       const orderslistServiceStub: OrderslistService = fixture.debugElement.injector.get(
//         OrderslistService
//       );
//       spyOn(component, 'getUnassignedPayment').and.callThrough();
//       spyOn(formBuilderStub, 'group').and.callThrough();
//       spyOn(orderslistServiceStub, 'getOrdersList').and.callThrough();
//       spyOn(orderslistServiceStub, 'getCaseType').and.callThrough();
//       component.ngOnInit();
//       expect(component.getUnassignedPayment).toHaveBeenCalled();
//       expect(formBuilderStub.group).toHaveBeenCalled();
//       expect(orderslistServiceStub.getOrdersList).toHaveBeenCalled();
//       expect(orderslistServiceStub.getCaseType).toHaveBeenCalled();
//     });
//   });

//   describe('getPaymentGroupDetails', () => {
//     it('makes expected calls', () => {
//       const paymentViewServiceStub: PaymentViewService = fixture.debugElement.injector.get(
//         PaymentViewService
//       );
//       const caseTransactionsServiceStub: CaseTransactionsService = fixture.debugElement.injector.get(
//         CaseTransactionsService
//       );
//       const errorHandlerServiceStub: ErrorHandlerService = fixture.debugElement.injector.get(
//         ErrorHandlerService
//       );
//       spyOn(component, 'saveAndContinue').and.callThrough();
//       spyOn(component, 'getGroupOutstandingAmount').and.callThrough();
//       spyOn(paymentViewServiceStub, 'getPaymentGroupDetails').and.callThrough();
//       spyOn(caseTransactionsServiceStub, 'getPaymentGroups').and.callThrough();
//       spyOn(errorHandlerServiceStub, 'getServerErrorMessage').and.callThrough();
//       component.getPaymentGroupDetails();
//       expect(component.saveAndContinue).toHaveBeenCalled();
//       expect(component.getGroupOutstandingAmount).toHaveBeenCalled();
//       expect(paymentViewServiceStub.getPaymentGroupDetails).toHaveBeenCalled();
//       expect(caseTransactionsServiceStub.getPaymentGroups).toHaveBeenCalled();
//       expect(errorHandlerServiceStub.getServerErrorMessage).toHaveBeenCalled();
//     });
//   });

//   describe('confirmAllocatePayement', () => {
//     it('makes expected calls', () => {
//       spyOn(component, 'resetForm').and.callThrough();
//       spyOn(component, 'finalServiceCall').and.callThrough();
//       component.confirmAllocatePayement();
//       expect(component.resetForm).toHaveBeenCalled();
//       expect(component.finalServiceCall).toHaveBeenCalled();
//     });
//   });

//   describe('finalServiceCall', () => {
//     it('makes expected calls', () => {
//       const paymentViewServiceStub: PaymentViewService = fixture.debugElement.injector.get(
//         PaymentViewService
//       );
//       const bulkScaningPaymentServiceStub: BulkScaningPaymentService = fixture.debugElement.injector.get(
//         BulkScaningPaymentService
//       );
//       const errorHandlerServiceStub: ErrorHandlerService = fixture.debugElement.injector.get(
//         ErrorHandlerService
//       );
//       spyOn(component, 'gotoCasetransationPage').and.callThrough();
//       spyOn(
//         paymentViewServiceStub,
//         'postBSAllocationPayments'
//       ).and.callThrough();
//       spyOn(
//         bulkScaningPaymentServiceStub,
//         'postBSPaymentStrategic'
//       ).and.callThrough();
//       spyOn(
//         bulkScaningPaymentServiceStub,
//         'patchBSChangeStatus'
//       ).and.callThrough();
//       spyOn(
//         bulkScaningPaymentServiceStub,
//         'postBSAllocatePayment'
//       ).and.callThrough();
//       spyOn(errorHandlerServiceStub, 'getServerErrorMessage').and.callThrough();
//       component.finalServiceCall();
//       expect(component.gotoCasetransationPage).toHaveBeenCalled();
//       expect(
//         paymentViewServiceStub.postBSAllocationPayments
//       ).toHaveBeenCalled();
//       expect(
//         bulkScaningPaymentServiceStub.postBSPaymentStrategic
//       ).toHaveBeenCalled();
//       expect(
//         bulkScaningPaymentServiceStub.patchBSChangeStatus
//       ).toHaveBeenCalled();
//       expect(
//         bulkScaningPaymentServiceStub.postBSAllocatePayment
//       ).toHaveBeenCalled();
//       expect(errorHandlerServiceStub.getServerErrorMessage).toHaveBeenCalled();
//     });
//   });

//   describe('saveAndContinue', () => {
//     it('makes expected calls', () => {
//       spyOn(component, 'getGroupOutstandingAmount').and.callThrough();
//       component.saveAndContinue();
//       expect(component.getGroupOutstandingAmount).toHaveBeenCalled();
//     });
//   });

//   describe('getUnassignedPayment', () => {
//     it('makes expected calls', () => {
//       const bulkScaningPaymentServiceStub: BulkScaningPaymentService = fixture.debugElement.injector.get(
//         BulkScaningPaymentService
//       );
//       const errorHandlerServiceStub: ErrorHandlerService = fixture.debugElement.injector.get(
//         ErrorHandlerService
//       );
//       spyOn(component, 'getPaymentGroupDetails').and.callThrough();
//       spyOn(
//         bulkScaningPaymentServiceStub,
//         'getBSPaymentsByDCN'
//       ).and.callThrough();
//       spyOn(errorHandlerServiceStub, 'getServerErrorMessage').and.callThrough();
//       component.getUnassignedPayment();
//       expect(component.getPaymentGroupDetails).toHaveBeenCalled();
//       expect(
//         bulkScaningPaymentServiceStub.getBSPaymentsByDCN
//       ).toHaveBeenCalled();
//       expect(errorHandlerServiceStub.getServerErrorMessage).toHaveBeenCalled();
//     });
//   });
// });

