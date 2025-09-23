
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
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
import { PaymentLibComponent } from '../../payment-lib.component';

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
    reason: new FormControl(),
    feeAmount: new FormControl(),
    feesList: new FormArray([])
  });

  form.setValue({remissionCode:"HWF-A1B-23C",amount:"100",refundReason:"Test Refund  Reason",refundDDReason:"Default Reason",reason:"Test Reason",feeAmount:"100",feesList:[]});

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

  let fee02 = {
    "code": "FEE0210",
    "version": "3",
    "volume": 1,
    "calculated_amount": 567.91,
    "net_amount": 567.91,
    "description": "desc",
    "ccd_case_number": "1010101010101011",
    "id": 299,
    "jurisdiction1": "",
    "jurisdiction2": "",
    "reference": "",
    "memo_line": "",
    "fee_amount": 567.91,
    "apportion_amount": 567.91,
    "allocated_amount": 567.91,
    "is_fully_apportioned": "",
    "date_apportioned": "2021-08-17T09:45:43.468+00:00",
    "date_created":"2021-08-17T09:45:43.468+00:00",
    "date_updated": "2021-08-17T09:45:43.468+00:00",
    "amount_due": 567.91
  }

  beforeEach(() => {
    const formBuilderStub = () => ({
      group: object => ({  remissionCode:"HWF-A1B-23C",amount: 10,refundReason: "Test Reason", refundDDReason:"Test Default reason", reason:"Testing"}),
      array: (controls) => new FormArray(controls || [])
    });
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
        subscribe: f => f(JSON.stringify({ remission_reference: 'RM-TEST-1234' }))
      }),
      postRefundRetroRemission: requestBody => ({ subscribe: f => f(JSON.stringify({ refund_reference: 'RF-TEST-1234', refund_amount: 10 })) }),
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
    const orderslistServiceStub = {
      setisFromServiceRequestPage: jasmine.createSpy('setisFromServiceRequestPage'),
      setnavigationPage: jasmine.createSpy('setnavigationPage'),
      setpaymentPageView: jasmine.createSpy('setpaymentPageView'),
      setOrderRef: jasmine.createSpy('setOrderRef'),
      setorderCCDEvent: jasmine.createSpy('setorderCCDEvent'),
      setorderCreated: jasmine.createSpy('setorderCreated'),
      setorderDetail: jasmine.createSpy('setorderDetail'),
      setorderParty: jasmine.createSpy('setorderParty'),
      setorderTotalPayments: jasmine.createSpy('setorderTotalPayments'),
      setorderRemissionTotal: jasmine.createSpy('setorderRemissionTotal'),
      setorderFeesTotal: jasmine.createSpy('setorderFeesTotal')
    };


    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [RpxTranslateMockPipe],
      providers: [
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: Router, useFactory: routerStub },
        { provide: PaymentViewService, useFactory: paymentViewServiceStub },
        { provide: 'PAYMENT_LIB', useClass: PaymentLibComponent },
        { provide: RefundsService, useFactory: refundsServiceStub },
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: NotificationService, useFactory: notificationServiceStub },
        { provide: OrderslistService, useValue: orderslistServiceStub }
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

  describe('gotoIssueRefundConfirmation', () => {
    it('makes expected calls', () => {
      const iPaymentStub: IPayment = <any>{};
      spyOn(component, 'resetRemissionForm').and.callThrough();
      component.selectedRefundReason = "Other";
      component.remissionForm = form;
      // Add feesList data to the FormArray to prevent reduce error
      const feesListArray = component.remissionForm.get('feesList') as FormArray;
      feesListArray.push(new FormGroup({
        refund_amount: new FormControl(10),
        selected: new FormControl(true)
      }));
      feesListArray.push(new FormGroup({
        refund_amount: new FormControl(20),
        selected: new FormControl(false)
      }));
      component.gotoIssueRefundConfirmation(iPaymentStub);
      expect(component.resetRemissionForm).not.toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const formBuilderStub: FormBuilder = fixture.debugElement.injector.get(
        FormBuilder
      );
      const refundsServiceStub: RefundsService = fixture.debugElement.injector.get(
        RefundsService
      );
      const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
        ChangeDetectorRef
      );

      component.fee = <any>fee;
      spyOn(formBuilderStub, 'group').and.returnValue(form);
      spyOn(refundsServiceStub, 'getRefundReasons').and.callThrough();
      spyOn(changeDetectorRefStub, 'detectChanges').and.callThrough();
      component.viewCompStatus ='processretroremissonpage';
      component.ngOnInit();
      expect(formBuilderStub.group).toHaveBeenCalled();
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
      const paymentViewServiceStub: PaymentViewService = fixture.debugElement.injector.get(PaymentViewService);
      spyOn(component, 'gotoCasetransationPage').and.callThrough();
      spyOn(routerStub, 'navigateByUrl').and.callThrough();
      spyOn(paymentViewServiceStub, 'postPaymentGroupWithRemissions').and.returnValue(of(JSON.stringify({ success: true })));

      component.ccdCaseNumber = "1010101010101010";
      component.caseType = "divorse";
      component.paymentGroupRef = "2021-1629193543478";
      component.remissionForm = form;
      component.fee = <any>fee;
      // Set bspaymentdcn to truthy value to prevent gotoCasetransationPage call
      (component as any).paymentLibComponent.bspaymentdcn = "test-dcn";
      component.confirmRemission();

      expect(component.gotoCasetransationPage).not.toHaveBeenCalled();
      expect(routerStub.navigateByUrl).toHaveBeenCalled();
      expect(paymentViewServiceStub.postPaymentGroupWithRemissions).toHaveBeenCalled();
    });

    it('calculates remissionAmount correctly when newNetAmount is less than net_amount', () => {
      component.remissionForm = form;
      component.fee = <any>fee02;
      component.remissionForm.controls.amount.setValue(100.20);
      const newNetAmount = component.remissionForm.controls.amount.value;
      const expectedRemissionAmount = parseFloat((component.fee.net_amount - newNetAmount).toFixed(2));
      expect(expectedRemissionAmount).toEqual(467.71); // 567.91 - 100.20 = 467.71
    });

    it('calculates remissionAmount correctly when newNetAmount is equal to net_amount', () => {
      component.remissionForm = form;
      component.fee = <any>fee02;
      component.remissionForm.controls.amount.setValue(567.91);
      const newNetAmount = component.remissionForm.controls.amount.value;
      const expectedRemissionAmount = parseFloat((component.fee.net_amount - newNetAmount).toFixed(2));
      expect(expectedRemissionAmount).toEqual(0); // 567.91 - 567.91 = 0
    });

    it('calculates remissionAmount correctly when newNetAmount is greater than net_amount', () => {
      component.remissionForm = form;
      component.fee = <any>fee02;
      component.remissionForm.controls.amount.setValue(1000.55);
      const newNetAmount = component.remissionForm.controls.amount.value;
      const expectedRemissionAmount = parseFloat((component.fee.net_amount - newNetAmount).toFixed(2));
      expect(expectedRemissionAmount).toEqual(-432.64); // 567.91 - 1000.55 = -432.64
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
      // const formBuilderStub: FormBuilder = fixture.debugElement.injector.get(
      //   FormBuilder
      // );
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
      ).and.returnValue(of(JSON.stringify(mockResponse)));
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
      ).and.returnValue(of(JSON.stringify(mockResponse)));
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

  describe('confirmIssueRefund', () => {
    it('makes expected calls', () => {
      const paymentViewServiceStub: PaymentViewService = fixture.debugElement.injector.get(
        PaymentViewService
      );
      const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
        ChangeDetectorRef
      );
      const mockResponse = {
        "refund_amount": 10,
        "refund_reference": "RF-1111-2222-3333-4444"
      }
      component.refundReason = 'testing reason';
      component.remissionForm = form;
      // Add feesList data to the FormArray
      const feesListArray = component.remissionForm.get('feesList') as FormArray;
      feesListArray.push(new FormGroup({
        id: new FormControl('1'),
        code: new FormControl('FEE001'),
        version: new FormControl('1'),
        apportion_amount: new FormControl(10),
        calculated_amount: new FormControl(10),
        volume: new FormControl(1),
        updated_volume: new FormControl(1),
        refund_amount: new FormControl(10),
        selected: new FormControl(true)
      }));
     const payment = {
                            "amount": 888,
                            "description": "Money Claim issue fee",
                            "reference": "RC-1629-1935-4353-9730",
                            "currency": "GBP",
                            "date_created": "2021-08-17T09:45:43.530+0000",
                            "banked_date": "2021-08-17T09:45:43.530+0000",
                            "document_control_number": "",
                            "payer_name": "aaa",
                            "date_updated": "2021-08-17T09:45:43.530+0000",
                            "ccd_case_number": "1010101010101010",
                            "case_reference": "9eb95270-7fee-48cf-afa2-e6c58ee756ba",
                            "channel": "online",
                            "method": "payment by account",
                            "external_provider": "",
                            "status": "Success",
                            "payment_allocation": [],
                            "external_reference": "",
                            "site_id": "Y689",
                            "service_name": "Civil Money Claims",
                            "account_number":  "PBAFUNC12345",
                            "customer_reference": "",
                            "organisation_name": "",
                            "fees": [],
                            "status_histories":[],
                            "payment_group_reference": "",
                            "paymentGroupReference":""
                            };
      component.payment = <any>payment;
      // component.payment.reference = 'RC-1629-1935-4353-9730';
      spyOn(paymentViewServiceStub, 'postRefundsReason').and.returnValue(of(JSON.stringify(mockResponse)));
      spyOn(changeDetectorRefStub, 'detectChanges').and.callThrough();
      // Call the method to trigger the spy
      component.confirmIssueRefund(false);
      expect(paymentViewServiceStub.postRefundsReason).toHaveBeenCalled();
    });
  });

  describe('confirmRetroRefund', () => {
    it('makes expected calls', () => {
      const paymentViewServiceStub: PaymentViewService = fixture.debugElement.injector.get(
        PaymentViewService
      );
      const mockResponse = JSON.stringify({
        "refund_amount": 10,
        "refund_reference": "RF-1111-2222-3333-4444"
      });

      const payment = <IPayment>{
                                  account_number: "PBA0066906",
                                  amount: 218,
                                  case_reference: "string",
                                  ccd_case_number: "1634915906081337",
                                  channel: "online",
                                  currency: "GBP",
                                  customer_reference: "string",
                                  date_created: "2021-10-18T16:21:20.027+0000",
                                  date_updated: "2021-10-18T16:21:20.040+0000",
                                  description: "string",
                                  method: "payment by account",
                                  organisation_name: "string",
                                  payment_allocation: [],
                                  reference: "RC-1634-9196-8009-2114",
                                  service_name: "Probate",
                                  site_id: "AA08",
                                  status: "Success" }
        component.payment = payment;
        component.contactDetailsObj = { email: 'test@test.com', address_line: 'Test Address', city: 'Test City' };
        component.fees = [];
        component.totalRefundAmount = 100;
        spyOn(paymentViewServiceStub, 'postRefundsReason').and.returnValue(of(JSON.stringify(mockResponse)));

        component.confirmRetroRefund();

        expect(paymentViewServiceStub.postRefundsReason).toHaveBeenCalled();
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
      ((orderslistServiceStub.setnavigationPage) as unknown as jasmine.Spy).calls.reset();
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
      ((orderslistServiceStub.setisFromServiceRequestPage) as unknown as jasmine.Spy).calls.reset();
      ((orderslistServiceStub.setpaymentPageView) as unknown as jasmine.Spy).calls.reset();
      ((orderslistServiceStub.setnavigationPage) as unknown as jasmine.Spy).calls.reset();
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
