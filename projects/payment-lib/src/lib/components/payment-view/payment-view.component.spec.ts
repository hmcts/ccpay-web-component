import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { ChangeDetectorRef } from '@angular/core';
import { OrderslistService } from '../../services/orderslist.service';
import { PaymentViewComponent } from './payment-view.component';
import { Pipe, PipeTransform } from '@angular/core';
import { NotificationService} from "../../services/notification/notification.service";
import { PaymentLibComponent } from '../../payment-lib.component';

@Pipe({
    name: 'rpxTranslate',
    standalone: false
})
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

describe('PaymentViewComponent', () => {
  let component: PaymentViewComponent;
  let fixture: ComponentFixture<PaymentViewComponent>;

  beforeEach(() => {
    const paymentViewServiceStub = () => ({
      getApportionPaymentDetails: paymentReference => ({
        subscribe: f => f({})
      }),
      getBSfeature: () => ({ subscribe: f => f({}) })
    });
    const paymentLibComponentStub = () => ({
      CCD_CASE_NUMBER: {},
      SELECTED_OPTION: {},
      DCN_NUMBER: {},
      ISTURNOFF: {},
      paymentReference: {},
      viewName: {},
      ISBSENABLE: {},
      isFromPaymentDetailPage: {}
    });
    const changeDetectorRefStub = () => ({ detectChanges: () => ({}) });
    const notificationServiceStub = () => ({  });
    const orderslistServiceStub = () => ({
      setnavigationPage: string => ({}),
      setisFromServiceRequestPage: arg => ({})
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [RpxTranslateMockPipe],
      providers: [
        { provide: PaymentViewService, useFactory: paymentViewServiceStub },
        { provide: 'PAYMENT_LIB', useClass: PaymentLibComponent },
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: NotificationService, useFactory: notificationServiceStub },
        { provide: OrderslistService, useFactory: orderslistServiceStub }
      ]
    });
    fixture = TestBed.createComponent(PaymentViewComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it('isRefundRemission has default value', () => {
    expect(component.isRefundRemission).toEqual(false);
  });

  it('isAddFeeBtnEnabled has default value', () => {
    expect(component.isAddFeeBtnEnabled).toEqual(false);
  });

  it('isIssueRefunfBtnEnable has default value', () => {
    expect(component.isIssueRefunfBtnEnable).toEqual(false);
  });

  it('allowedRolesToAccessRefund has default value', () => {
    expect(component.allowedRolesToAccessRefund).toEqual([
      'payments-refund-approver',
      'payments-refund'
    ]);
  });

  it('remissions has default value', () => {
    expect(component.remissions).toEqual([]);
  });

  // describe('addRemission', () => {
  //   it('makes expected calls', () => {
  //     const paymentViewServiceStub: PaymentViewService = fixture.debugElement.injector.get(
  //       PaymentViewService
  //     );
  //     const iFeeStub: IFee = <any>{};
  //     const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
  //       ChangeDetectorRef
  //     );
  //     spyOn(component, 'chkForAddRemission').and.callThrough();
  //     spyOn(
  //       paymentViewServiceStub,
  //       'getApportionPaymentDetails'
  //     ).and.callThrough();
  //     spyOn(changeDetectorRefStub, 'detectChanges').and.callThrough();
  //     component.addRemission(iFeeStub);
  //     expect(component.chkForAddRemission).toHaveBeenCalled();
  //     expect(
  //       paymentViewServiceStub.getApportionPaymentDetails
  //     ).toHaveBeenCalled();
  //     expect(changeDetectorRefStub.detectChanges).toHaveBeenCalled();
  //   });
  // });

  // describe('issueRefund', () => {
  //   it('makes expected calls', () => {
  //     const iPaymentGroupStub: IPaymentGroup = <any>{};
  //     spyOn(component, 'chkIssueRefundBtnEnable').and.callThrough();
  //     component.issueRefund(iPaymentGroupStub);
  //     expect(component.chkIssueRefundBtnEnable).toHaveBeenCalled();
  //   });
  // });

  // describe('ngOnInit', () => {
  //   it('makes expected calls', () => {
  //     const paymentViewServiceStub: PaymentViewService = fixture.debugElement.injector.get(
  //       PaymentViewService
  //     );
  //     spyOn(
  //       paymentViewServiceStub,
  //       'getApportionPaymentDetails'
  //     ).and.callThrough();
  //     component.ngOnInit();
  //     expect(
  //       paymentViewServiceStub.getApportionPaymentDetails
  //     ).toHaveBeenCalled();
  //   });
  // });
});
