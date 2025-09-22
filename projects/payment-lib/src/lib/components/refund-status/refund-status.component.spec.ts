// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { RefundStatusComponent } from './refund-status.component';

// describe('RefundStatusComponent', () => {
//   let component: RefundStatusComponent;
//   let fixture: ComponentFixture<RefundStatusComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ RefundStatusComponent ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(RefundStatusComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   // it('should create', () => {
//   //   expect(component).toBeTruthy();
//   // });
// });

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RefundsService } from '../../services/refunds/refunds.service';
import { FormBuilder } from '@angular/forms';
import { IRefundList } from '../../interfaces/IRefundList';
import { IResubmitRefundRequest } from '../../interfaces/IResubmitRefundRequest';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { Router } from '@angular/router';
import { OrderslistService } from '../../services/orderslist.service';
import { PaymentLibComponent } from '../../payment-lib.component';
import { RefundStatusComponent } from './refund-status.component';
import { NotificationService} from "../../services/notification/notification.service";

describe('RefundStatusComponent', () => {
  let component: RefundStatusComponent;
  let fixture: ComponentFixture<RefundStatusComponent>;

  beforeEach(() => {
    const refundsServiceStub = () => ({
      getRefundStatusList: ccdCaseNumber => ({ subscribe: f => f({}) }),
      getRefundStatusHistory: refund_reference => ({ subscribe: f => f({}) }),
      getRefundReasons: () => ({ subscribe: f => f({}) }),
      patchResubmitRefund: (resubmitRequest, refund_reference) => ({
        subscribe: f => f({})
      })
    });
    const formBuilderStub = () => ({ group: object => ({}) });
    const paymentViewServiceStub = () => ({
      getBSfeature: () => ({ subscribe: f => f({}) })
    });
    const routerStub = () => ({ navigateByUrl: url => ({}) });
    const orderslistServiceStub = () => ({
      getRefundView: () => ({ subscribe: f => f({}) }),
      getCCDCaseNumberforRefund: { subscribe: f => f({}) },
      setRefundView: refundlist => ({}),
      setCCDCaseNumber: ccdCaseNumber => ({}),
      setnavigationPage: navigationpage => ({}),
      getnavigationPageValue: () => ({ subscribe: f => f({}) })
    });
    const notificationServiceStub = () => ({ });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [],
      providers: [
        { provide: RefundsService, useFactory: refundsServiceStub },
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: PaymentViewService, useFactory: paymentViewServiceStub },
        { provide: Router, useFactory: routerStub },
        { provide: OrderslistService, useFactory: orderslistServiceStub },
        { provide: NotificationService, useFactory: notificationServiceStub },
        { provide: 'PAYMENT_LIB', useClass: PaymentLibComponent }
      ]
    });
    fixture = TestBed.createComponent(RefundStatusComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it('LOGGEDINUSERROLES has default value', () => {
    expect(component.LOGGEDINUSERROLES).toEqual([]);
  });

  it('rejectedRefundList has default value', () => {
    expect(component.rejectedRefundList).toEqual([]);
  });

  it('approvalStatus has default value', () => {
    expect(component.approvalStatus).toEqual('Sent for approval');
  });

  it('rejectStatus has default value', () => {
    expect(component.rejectStatus).toEqual('Update required');
  });

  it('isAmountEmpty has default value', () => {
    expect(component.isAmountEmpty).toEqual(false);
  });

  it('isReasonEmpty has default value', () => {
    expect(component.isReasonEmpty).toEqual(false);
  });

  it('amountHasError has default value', () => {
    expect(component.amountHasError).toEqual(false);
  });

  it('isRemissionLessThanFeeError has default value', () => {
    expect(component.isRemissionLessThanFeeError).toEqual(false);
  });

  it('refundHasError has default value', () => {
    expect(component.refundHasError).toEqual(false);
  });

  it('refundReasons has default value', () => {
    expect(component.refundReasons).toEqual([]);
  });

  it('isRefundBtnDisabled has default value', () => {
    expect(component.isRefundBtnDisabled).toEqual(true);
  });

  it('isLastUpdatedByCurrentUser has default value', () => {
    expect(component.isLastUpdatedByCurrentUser).toEqual(true);
  });

  it('isProcessRefund has default value', () => {
    expect(component.isProcessRefund).toEqual(false);
  });

  // describe('ngOnInit', () => {
  //   it('makes expected calls', () => {
  //     const refundsServiceStub: RefundsService = fixture.debugElement.injector.get(
  //       RefundsService
  //     );
  //     const formBuilderStub: FormBuilder = fixture.debugElement.injector.get(
  //       FormBuilder
  //     );
  //     const orderslistServiceStub: OrderslistService = fixture.debugElement.injector.get(
  //       OrderslistService
  //     );
  //     spyOn(component, 'resetRemissionForm').and.callThrough();
  //     spyOn(component, 'getRefundsStatusHistoryList').and.callThrough();
  //     spyOn(refundsServiceStub, 'getRefundStatusList').and.callThrough();
  //     spyOn(formBuilderStub, 'group').and.callThrough();
  //     spyOn(orderslistServiceStub, 'getRefundView').and.callThrough();
  //     component.ngOnInit();
  //     expect(component.resetRemissionForm).toHaveBeenCalled();
  //     expect(component.getRefundsStatusHistoryList).toHaveBeenCalled();
  //     expect(refundsServiceStub.getRefundStatusList).toHaveBeenCalled();
  //     expect(formBuilderStub.group).toHaveBeenCalled();
  //     expect(orderslistServiceStub.getRefundView).toHaveBeenCalled();
  //   });
  // });

  // describe('getRefundsStatusHistoryList', () => {
  //   it('makes expected calls', () => {
  //     const refundsServiceStub: RefundsService = fixture.debugElement.injector.get(
  //       RefundsService
  //     );
  //     spyOn(refundsServiceStub, 'getRefundStatusHistory').and.callThrough();
  //     component.getRefundsStatusHistoryList();
  //     expect(refundsServiceStub.getRefundStatusHistory).toHaveBeenCalled();
  //   });
  // });

  // describe('loadCaseTransactionPage', () => {
  //   it('makes expected calls', () => {
  //     const paymentViewServiceStub: PaymentViewService = fixture.debugElement.injector.get(
  //       PaymentViewService
  //     );
  //     const routerStub: Router = fixture.debugElement.injector.get(Router);
  //     spyOn(paymentViewServiceStub, 'getBSfeature').and.callThrough();
  //     spyOn(routerStub, 'navigateByUrl').and.callThrough();
  //     component.loadCaseTransactionPage();
  //     expect(paymentViewServiceStub.getBSfeature).toHaveBeenCalled();
  //     expect(routerStub.navigateByUrl).toHaveBeenCalled();
  //   });
  // });

  // describe('loadRefundListPage', () => {
  //   it('makes expected calls', () => {
  //     const orderslistServiceStub: OrderslistService = fixture.debugElement.injector.get(
  //       OrderslistService
  //     );
  //     spyOn(component, 'loadCaseTransactionPage').and.callThrough();
  //     spyOn(orderslistServiceStub, 'getnavigationPageValue').and.callThrough();
  //     component.loadRefundListPage();
  //     expect(component.loadCaseTransactionPage).toHaveBeenCalled();
  //     expect(orderslistServiceStub.getnavigationPageValue).toHaveBeenCalled();
  //   });
  // });

  // describe('gotoReviewAndReSubmitPage', () => {
  //   it('makes expected calls', () => {
  //     const refundsServiceStub: RefundsService = fixture.debugElement.injector.get(
  //       RefundsService
  //     );

  //     spyOn(refundsServiceStub, 'getRefundReasons').and.callThrough();
  //     component.gotoReviewAndReSubmitPage();
  //     expect(refundsServiceStub.getRefundReasons).toHaveBeenCalled();
  //   });
  // });

  // describe('goToReviewAndSubmitView', () => {
  //   it('makes expected calls', () => {
  //     spyOn(component, 'resetRemissionForm').and.callThrough();
  //     component.goToReviewAndSubmitView();
  //     expect(component.resetRemissionForm).toHaveBeenCalled();
  //   });
  // });
});
