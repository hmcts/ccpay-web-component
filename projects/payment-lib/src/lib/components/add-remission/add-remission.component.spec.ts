
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentViewService } from '../../services/payment-view/payment-view.service';
import { IPayment } from '../../interfaces/IPayment';
import { IRemission } from '../../interfaces/IRemission';
import { RefundsService } from '../../services/refunds/refunds.service';
import { ChangeDetectorRef } from '@angular/core';
import { OrderslistService } from '../../services/orderslist.service';
import { AddRemissionComponent } from './add-remission.component';
import { of } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core'
import {NotificationService} from "../../services/notification/notification.service";

@Pipe({ name: 'rpxTranslate' })
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}


describe('AddRemissionComponent', () => {
  let component: AddRemissionComponent;
  let fixture: ComponentFixture<AddRemissionComponent>;
  let form = new FormGroup({
    remissionCode: new FormControl(),
    amount: new FormControl(),
    refundReason: new FormControl(),
    refundDDReason: new FormControl(),
    reason: new FormControl()
  });

  form.setValue({remissionCode:"HWF-A1B-23C",amount:"100",refundReason:"Test Refund  Reason",refundDDReason:"Default Reason",reason:"Test Reason"});

  let fee = {
    "code": "FEE0209",
    "version": "3",
    "volume": 1,
    "calculated_amount": 888,
    "net_amount": 888,
    "description": "desc",
    "ccd_case_number": "1010101010101010",
    "id": 298,
    "jurisdiction1": "",
    "jurisdiction2": "",
    "reference": "",
    "memo_line": "",
    "fee_amount": 100,
    "apportion_amount": 10,
    "allocated_amount": 10,
    "is_fully_apportioned": "",
    "date_apportioned": "2021-08-17T09:45:43.468+00:00",
    "date_created":"2021-08-17T09:45:43.468+00:00",
    "date_updated": "2021-08-17T09:45:43.468+00:00",
    "amount_due": 100
  }

  beforeEach(() => {
    const routerStub = () => ({
      routeReuseStrategy: { shouldReuseRoute: {} },
      onSameUrlNavigation: {},
      navigateByUrl: arg => ({})
    });
    const paymentViewServiceStub = () => ({
      postPaymentGroupWithRemissions: (arg, id, requestBody) => ({
        subscribe: f => f({})
      }),
      postPaymentGroupWithRetroRemissions: (arg, id, requestBody) => ({
        subscribe: f => f({})
      }),
      postRefundRetroRemission: requestBody => ({ subscribe: f => f('{}') }),
      postRefundsReason: requestBody => ({ subscribe: f => f({}) }),
      getBSfeature: () => ({ subscribe: f => f({}) })
    });
    const paymentLibComponentStub = () => ({
      SELECTED_OPTION: {},
      bspaymentdcn: {},
      CCD_CASE_NUMBER: {},
      iscancelClicked: {},
      isFromRefundStatusPage: {},
      viewName: {},
      REFUNDLIST: {},
      TAKEPAYMENT: {},
      SERVICEREQUEST: {},
      ISTURNOFF: {},
      isFromServiceRequestPage: {},
      ISBSENABLE: {},
      isFromPaymentDetailPage: {}
    });
    const refundsServiceStub = () => ({
      getRefundReasons: () => ({ subscribe: f => f({}) })
    });
    const changeDetectorRefStub = () => ({ detectChanges: () => ({}) });
    const notificationServiceStub = () => ({  });
    const orderslistServiceStub = () => ({
      setisFromServiceRequestPage: arg => ({}),
      setnavigationPage: string => ({}),
      setpaymentPageView: object => ({}),
      setOrderRef: ()  => ({}),
      setorderCCDEvent: ()  => ({}),
      setorderCreated: ()  => ({}),
      setorderDetail: ()  => ({}),
      setorderParty: ()  => ({}),
      setorderTotalPayments: ()  => ({}),
      setorderRemissionTotal: ()  => ({}),
      setorderFeesTotal: ()  => ({}),
    });


    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [RpxTranslateMockPipe],
      providers: [
        { provide: FormBuilder},
        { provide: Router, useFactory: routerStub },
        { provide: PaymentViewService, useFactory: paymentViewServiceStub },
        { provide: 'PAYMENT_LIB', useFactory: paymentLibComponentStub },
        { provide: RefundsService, useFactory: refundsServiceStub },
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: NotificationService, useFactory: notificationServiceStub },
        { provide: OrderslistService, useFactory: orderslistServiceStub }
      ]
    });
    fixture = TestBed.createComponent(AddRemissionComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it('hasErrors has default value', () => {
    expect(component.hasErrors).toEqual(false);
  });

  it('viewStatus has default value', () => {
    expect(component.viewStatus).toEqual('main');
  });

  it('isConfirmationBtnDisabled has default value', () => {
    expect(component.isConfirmationBtnDisabled).toEqual(false);
  });

  it('selectedValue has default value', () => {
    component.selectedValue = 'yes'
    expect(component.selectedValue).toEqual('yes');
  });

  it('retroRemission has default value', () => {
    component.retroRemission = false;
    expect(component.retroRemission).toEqual(false);
  });

  it('paymentExplanationHasError has default value', () => {
    component.paymentExplanationHasError = false;
    expect(component.paymentExplanationHasError).toEqual(false);
  });

  it('isRemissionCodeEmpty has default value', () => {
    expect(component.isRemissionCodeEmpty).toEqual(false);
  });

  it('remissionCodeHasError has default value', () => {
    expect(component.remissionCodeHasError).toEqual(false);
  });

  it('isAmountEmpty has default value', () => {
    component.isAmountEmpty = false;
    expect(component.isAmountEmpty).toEqual(false);
  });

  it('isReasonEmpty has default value', () => {
    component.isReasonEmpty = false;
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

  it('isPaymentSuccess has default value', () => {
    expect(component.isPaymentSuccess).toEqual(false);
  });

  it('isRemissionApplied has default value', () => {
    expect(component.isRemissionApplied).toEqual(false);
  });

  it('commonRefundReasons has default value', () => {
    expect(component.commonRefundReasons).toEqual([]);
  });

  describe('gotoCheckRetroRemissionPage', () => {
    it('makes expected calls', () => {
      const iPaymentStub: IPayment = <any>{};
      spyOn(component, 'resetRemissionForm').and.callThrough();
      component.remissionForm = form;
      component.fee = <any>fee;
      component.gotoCheckRetroRemissionPage(iPaymentStub);
      expect(component.resetRemissionForm).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const refundsServiceStub: RefundsService = fixture.debugElement.injector.get(
        RefundsService
      );
      const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
        ChangeDetectorRef
      );

      component.fee = <any>fee;
      spyOn(refundsServiceStub, 'getRefundReasons').and.callThrough();
      spyOn(changeDetectorRefStub, 'detectChanges').and.callThrough();
      component.viewCompStatus ='processretroremissonpage';
      component.ngOnInit();
      expect(refundsServiceStub.getRefundReasons).not.toHaveBeenCalled();
      expect(changeDetectorRefStub.detectChanges).not.toHaveBeenCalled();
    });
  });

  describe('addRemission', () => {
    it('makes expected calls', () => {
      spyOn(component, 'resetRemissionForm').and.callThrough();
      component.remissionForm = form;
      component.fee = <any>fee;
      component.addRemission();
      expect(component.resetRemissionForm).toHaveBeenCalled();
    });
  });

  describe('confirmRemission', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      const paymentViewServiceStub: PaymentViewService = fixture.debugElement.injector.get(
        PaymentViewService
      );
      spyOn(component, 'gotoCasetransationPage').and.callThrough();
      spyOn(routerStub, 'navigateByUrl').and.callThrough();
      spyOn(
        paymentViewServiceStub,
        'postPaymentGroupWithRemissions'
      ).and.callThrough();
      component.ccdCaseNumber = "1010101010101010";
      component.caseType = "divorse";
      component.paymentGroupRef = "2021-1629193543478";
      component.remissionForm = form;
      component.fee = <any>fee;
      component.confirmRemission();
      expect(component.gotoCasetransationPage).not.toHaveBeenCalled();
      expect(routerStub.navigateByUrl).not.toHaveBeenCalled();
      expect(
        paymentViewServiceStub.postPaymentGroupWithRemissions
      ).toHaveBeenCalled();
    });
  });

  describe('addRemissionCode', () => {
    it('makes expected calls', () => {
      spyOn(component, 'resetRemissionForm').and.callThrough();
      component.remissionForm = form;
      component.addRemissionCode();
      expect(component.resetRemissionForm).toHaveBeenCalled();
    });
  });

  describe('confirmRetroRemission', () => {
    it('makes expected calls', () => {
      const paymentViewServiceStub: PaymentViewService = fixture.debugElement.injector.get(
        PaymentViewService
      );
      const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
        ChangeDetectorRef
      );
    const mockResponse  = {
                              "_links": {
                                "empty": true
                              },
                              "remission_reference": "RF-1111-2222-3333-4444"
                            }

    component.remissionForm = form;
    component.fee = <any>fee;

    spyOn(
        paymentViewServiceStub,
        'postPaymentGroupWithRetroRemissions'
      ).and.returnValue(of(mockResponse));
      // spyOn(changeDetectorRefStub, 'detectChanges').and.callThrough();
      component.confirmRetroRemission();
      expect(
        paymentViewServiceStub.postPaymentGroupWithRetroRemissions
      ).toHaveBeenCalled();
    });
  });

  describe('processRefund', () => {
    it('makes expected calls', () => {
      const paymentViewServiceStub: PaymentViewService = fixture.debugElement.injector.get(
        PaymentViewService
      );
      const mockResponse = {
              "refund_amount": 10,
              "refund_reference": "RF-1111-2222-3333-4444"
            }
      spyOn(
        paymentViewServiceStub,
        'postRefundRetroRemission'
      ).and.returnValue(of(mockResponse));
      const remission = <IRemission>{
                                      remission_reference: "RM-1634-9738-6543-0599",
                                      hwf_reference: "HWF-A1B-23C",
                                      hwf_amount: 1,
                                      beneficiary_name: "aaa",
                                      ccd_case_number: "1634915906081337",
                                      fee_code:"FEE0546",
                                      date_created: "2021-10-23T07:24:25.464+0000"}
      component.remission =  remission;
      component.processRefund();
      expect(
        paymentViewServiceStub.postRefundRetroRemission
      ).toHaveBeenCalled();
    });
  });

  describe('gotoCasetransationPage', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      const paymentViewServiceStub: PaymentViewService = fixture.debugElement.injector.get(
        PaymentViewService
      );
      const orderslistServiceStub: OrderslistService = fixture.debugElement.injector.get(
        OrderslistService
      );
      spyOn(routerStub, 'navigateByUrl').and.callThrough();
      spyOn(paymentViewServiceStub, 'getBSfeature').and.callThrough();
      spyOn(orderslistServiceStub, 'setnavigationPage').and.callThrough();
      component.remissionForm = form;
      component.gotoCasetransationPage();
      expect(routerStub.navigateByUrl).toHaveBeenCalled();
      expect(paymentViewServiceStub.getBSfeature).not.toHaveBeenCalled();
      expect(orderslistServiceStub.setnavigationPage).toHaveBeenCalled();
    });
  });

  describe('gotoCasetransationPageCancelBtnClicked', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      const paymentViewServiceStub: PaymentViewService = fixture.debugElement.injector.get(
        PaymentViewService
      );
      const orderslistServiceStub: OrderslistService = fixture.debugElement.injector.get(
        OrderslistService
      );
      component.remissionForm = form;
      spyOn(routerStub, 'navigateByUrl').and.callThrough();
      spyOn(paymentViewServiceStub, 'getBSfeature').and.callThrough();
      spyOn(
        orderslistServiceStub,
        'setisFromServiceRequestPage'
      ).and.callThrough();
      spyOn(orderslistServiceStub, 'setpaymentPageView').and.callThrough();
      spyOn(orderslistServiceStub, 'setnavigationPage').and.callThrough();
      spyOn(component, 'gotoCasetransationPageCancelBtnClicked').and.callThrough();
      expect(routerStub.navigateByUrl).not.toHaveBeenCalled();
      // expect(paymentViewServiceStub.getBSfeature).toHaveBeenCalled();
      // expect(
      //   orderslistServiceStub.setisFromServiceRequestPage
      // ).toHaveBeenCalled();
      // expect(orderslistServiceStub.setpaymentPageView).toHaveBeenCalled();
      // expect(orderslistServiceStub.setnavigationPage).toHaveBeenCalled();
    });
  });
});
